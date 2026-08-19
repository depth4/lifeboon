/**
 * Where streets cross, and what has to stop there.
 *
 * A street built from its cross-section carries a kerb, a verge and a pavement
 * along its whole length — including straight through every junction, which is
 * how grass ends up growing across a main road. Real junctions are the one
 * place where the cross-section is interrupted: the paving stops at the kerb
 * line of the road being crossed, and the smaller road's carriageway stops at
 * the larger one's edge, because the larger road carries the surface through.
 *
 * This file finds those crossings and says, for each way, over which stretches
 * of its length each part of the section is suppressed. It does not build a
 * junction polygon — corner radii, stop lines and the exact shape of a
 * splayed entry are a bigger job, and this is the part that removes the lie.
 */

import type { Road, Vec2 } from './types';

export interface StreetSpans {
  /** Stretches where kerb, verge and pavement are interrupted. */
  sides: Array<[number, number]>;
  /**
   * Stretches where the carriageway itself is interrupted, because a bigger
   * road is carrying its surface across this one.
   */
  carriageway: Array<[number, number]>;
}

const EMPTY: StreetSpans = { sides: [], carriageway: [] };

/** Cell size for the segment hash. Comfortably wider than any junction. */
const CELL_M = 40;

interface Seg {
  road: number;
  ax: number; az: number; bx: number; bz: number;
  /** Distance from the start of the way to this segment's first point. */
  at: number;
  len: number;
}

/**
 * How far along a way a crossing reaches.
 *
 * A road crossed square is interrupted over its full width; crossed at a
 * shallow angle, over much more, because the far kerb is further down the
 * street than the near one. The clamp stops a near-parallel pair — two streets
 * that touch and run alongside each other — from masking half a kilometre.
 */
function reachAlong(halfWidth: number, sinAngle: number): number {
  return halfWidth / Math.max(0.34, Math.abs(sinAngle));
}

export function junctionSpans(roads: Road[]): Map<string, StreetSpans> {
  const segments: Seg[] = [];
  const cells = new Map<number, number[]>();

  roads.forEach((road, index) => {
    if (!road.drivable || road.points.length < 2) return;
    let at = 0;
    for (let i = 0; i < road.points.length - 1; i++) {
      const [ax, az] = road.points[i];
      const [bx, bz] = road.points[i + 1];
      const len = Math.hypot(bx - ax, bz - az);
      if (len < 1e-6) continue;

      const s = segments.length;
      segments.push({ road: index, ax, az, bx, bz, at, len });
      at += len;

      const c0 = Math.floor(Math.min(ax, bx) / CELL_M);
      const c1 = Math.floor(Math.max(ax, bx) / CELL_M);
      const r0 = Math.floor(Math.min(az, bz) / CELL_M);
      const r1 = Math.floor(Math.max(az, bz) / CELL_M);
      for (let c = c0; c <= c1; c++) {
        for (let r = r0; r <= r1; r++) {
          const key = (c + 32768) * 65536 + (r + 32768);
          let bucket = cells.get(key);
          if (!bucket) cells.set(key, (bucket = []));
          bucket.push(s);
        }
      }
    }
  });

  const out = new Map<string, StreetSpans>();
  const raw = roads.map(() => ({ sides: [] as Array<[number, number]>, carriageway: [] as Array<[number, number]> }));

  const seen = new Set<number>();
  for (let i = 0; i < segments.length; i++) {
    const a = segments[i];
    const c0 = Math.floor(Math.min(a.ax, a.bx) / CELL_M);
    const c1 = Math.floor(Math.max(a.ax, a.bx) / CELL_M);
    const r0 = Math.floor(Math.min(a.az, a.bz) / CELL_M);
    const r1 = Math.floor(Math.max(a.az, a.bz) / CELL_M);

    seen.clear();
    for (let c = c0; c <= c1; c++) {
      for (let r = r0; r <= r1; r++) {
        for (const j of cells.get((c + 32768) * 65536 + (r + 32768)) ?? []) {
          // Each pair once, and never a way against itself: a street that
          // doubles back is still one street and does not junction with it.
          if (j <= i || seen.has(j)) continue;
          seen.add(j);
          const b = segments[j];
          if (b.road === a.road) continue;

          const hit = crossing(a, b);
          if (!hit) continue;

          const roadA = roads[a.road];
          const roadB = roads[b.road];
          const sin = Math.abs(hit.sin);

          // The wider road carries its surface through; the narrower one
          // stops at the kerb line. A tie is broken on identity so the same
          // pair always resolves the same way whatever order they arrive in.
          const aMajor = roadA.width !== roadB.width
            ? roadA.width > roadB.width
            : roadA.id < roadB.id;

          const alongA = a.at + a.len * hit.ta;
          const alongB = b.at + b.len * hit.tb;

          // Each road's paving stops where the other road's carriageway runs.
          const sideA = reachAlong(roadB.width / 2, sin);
          const sideB = reachAlong(roadA.width / 2, sin);
          raw[a.road].sides.push([alongA - sideA, alongA + sideA]);
          raw[b.road].sides.push([alongB - sideB, alongB + sideB]);

          // Only the minor road's asphalt is interrupted, and only across the
          // major road's carriageway, which is exactly what covers the gap.
          if (aMajor) {
            raw[b.road].carriageway.push([alongB - sideB, alongB + sideB]);
          } else {
            raw[a.road].carriageway.push([alongA - sideA, alongA + sideA]);
          }
        }
      }
    }
  }

  roads.forEach((road, index) => {
    const spans = raw[index];
    if (!spans.sides.length && !spans.carriageway.length) return;
    out.set(road.id, {
      sides: merge(spans.sides),
      carriageway: merge(spans.carriageway),
    });
  });
  return out;
}

export function spansFor(map: Map<string, StreetSpans>, road: Road): StreetSpans {
  return map.get(road.id) ?? EMPTY;
}

/** True when `d` falls inside any of the sorted, merged spans. */
export function inSpans(spans: Array<[number, number]>, d: number): boolean {
  for (const [lo, hi] of spans) {
    if (d < lo) return false;
    if (d <= hi) return true;
  }
  return false;
}

/** Every span boundary, so a way can be split exactly where a junction starts. */
export function spanCuts(spans: StreetSpans): number[] {
  const cuts: number[] = [];
  for (const [lo, hi] of spans.sides) cuts.push(lo, hi);
  for (const [lo, hi] of spans.carriageway) cuts.push(lo, hi);
  return cuts;
}

function merge(spans: Array<[number, number]>): Array<[number, number]> {
  if (spans.length < 2) return spans;
  spans.sort((p, q) => p[0] - q[0]);
  const out: Array<[number, number]> = [spans[0]];
  for (let i = 1; i < spans.length; i++) {
    const last = out[out.length - 1];
    if (spans[i][0] <= last[1]) last[1] = Math.max(last[1], spans[i][1]);
    else out.push(spans[i]);
  }
  return out;
}

/**
 * Where two segments cross, as a fraction along each, plus the sine of the
 * angle between them. Null when they are parallel or do not actually meet.
 */
function crossing(a: Seg, b: Seg): { ta: number; tb: number; sin: number } | null {
  const ax = a.bx - a.ax, az = a.bz - a.az;
  const bx = b.bx - b.ax, bz = b.bz - b.az;
  const denom = ax * bz - az * bx;
  if (Math.abs(denom) < 1e-9) return null;

  const dx = b.ax - a.ax, dz = b.az - a.az;
  const ta = (dx * bz - dz * bx) / denom;
  const tb = (dx * az - dz * ax) / denom;
  if (ta < 0 || ta > 1 || tb < 0 || tb > 1) return null;

  const sin = denom / (a.len * b.len);
  return { ta, tb, sin };
}

/**
 * A way resampled so that every one of `cuts` falls on a vertex.
 *
 * Junction masks are decided per segment, so a 60 m straight through a
 * crossroads would be masked whole or not at all. Splitting it exactly where
 * the junction begins keeps the interruption the size of the junction, and
 * costs only as many extra vertices as there are junctions.
 */
export function splitAt(
  points: Vec2[],
  heights: number[],
  cuts: number[],
): { points: Vec2[]; heights: number[]; distances: number[] } {
  const outPts: Vec2[] = [];
  const outY: number[] = [];
  const outD: number[] = [];
  const sorted = cuts.slice().sort((p, q) => p - q);

  let travelled = 0;
  let next = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, az] = points[i];
    const [bx, bz] = points[i + 1];
    const len = Math.hypot(bx - ax, bz - az);

    outPts.push(points[i]);
    outY.push(heights[i]);
    outD.push(travelled);

    while (next < sorted.length && sorted[next] <= travelled) next++;
    while (next < sorted.length && sorted[next] < travelled + len) {
      const t = (sorted[next] - travelled) / len;
      // A cut landing on a vertex we already emitted adds nothing but a
      // degenerate segment, which would divide by zero in the mitre.
      if (t > 1e-4 && t < 1 - 1e-4) {
        outPts.push([ax + (bx - ax) * t, az + (bz - az) * t]);
        outY.push(heights[i] + (heights[i + 1] - heights[i]) * t);
        outD.push(sorted[next]);
      }
      next++;
    }
    travelled += len;
  }

  outPts.push(points[points.length - 1]);
  outY.push(heights[heights.length - 1]);
  outD.push(travelled);
  return { points: outPts, heights: outY, distances: outD };
}
