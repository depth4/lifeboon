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

/**
 * One place where two ways cross, with how far along each way it is.
 *
 * Wanted by two quite different jobs: deciding where the paving stops, and
 * deciding what height the ground is at a junction. They have to agree, so
 * they read the same crossings.
 */
export interface Crossing {
  x: number;
  z: number;
  roadA: number;
  roadB: number;
  atA: number;
  atB: number;
  /** |sin| of the angle between the two ways. */
  sin: number;
}

export function findCrossings(roads: Road[]): Crossing[] {
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

  const out: Crossing[] = [];
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
          out.push({
            x: a.ax + (a.bx - a.ax) * hit.ta,
            z: a.az + (a.bz - a.az) * hit.ta,
            roadA: a.road,
            roadB: b.road,
            atA: a.at + a.len * hit.ta,
            atB: b.at + b.len * hit.tb,
            sin: Math.abs(hit.sin),
          });
        }
      }
    }
  }
  return out;
}

export function junctionSpans(roads: Road[], crossings = findCrossings(roads)): Map<string, StreetSpans> {
  const raw = roads.map(() => ({
    sides: [] as Array<[number, number]>,
    carriageway: [] as Array<[number, number]>,
  }));

  for (const c of crossings) {
    const roadA = roads[c.roadA];
    const roadB = roads[c.roadB];

    // The wider road carries its surface through; the narrower one stops at
    // the kerb line. A tie is broken on identity so the same pair always
    // resolves the same way whatever order they arrive in.
    const aMajor = roadA.width !== roadB.width
      ? roadA.width > roadB.width
      : roadA.id < roadB.id;

    // Each road's paving stops where the other road's carriageway runs.
    const sideA = reachAlong(roadB.width / 2, c.sin);
    const sideB = reachAlong(roadA.width / 2, c.sin);
    raw[c.roadA].sides.push([c.atA - sideA, c.atA + sideA]);
    raw[c.roadB].sides.push([c.atB - sideB, c.atB + sideB]);

    // Only the minor road's asphalt is interrupted, and only across the major
    // road's carriageway, which is exactly what covers the gap.
    if (aMajor) raw[c.roadB].carriageway.push([c.atB - sideB, c.atB + sideB]);
    else raw[c.roadA].carriageway.push([c.atA - sideA, c.atA + sideA]);
  }

  const out = new Map<string, StreetSpans>();
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

/* ========================================================================
 * The junction as a shape
 *
 * Everything above answers "where does paving stop". That was enough to keep
 * grass off a main road, and not nearly enough to make a crossing look like a
 * crossing: two ribbons overlapping, both interrupted, with bare ground in the
 * four corners and no kerb turning round any of them. The user's word for it
 * was "отдельные плато" — separate plateaus — and that is exactly right,
 * because nothing in the model said the streets meeting here are one place.
 *
 * So a junction becomes a thing with a boundary. It is built constructively —
 * from the directions and widths of the streets that arrive — and never by
 * intersecting polygons with each other, which is where this kind of code
 * usually dies on real map data: self-touching ways, duplicate nodes, three
 * streets meeting at two degrees.
 *
 * The construction, for a node with approaches sorted by bearing:
 *
 *   1. Each approach stops at `stop` metres from the centre, far enough out
 *      that the widest street crossing it has already gone by.
 *   2. That gives two mouth points per approach, one either side of its
 *      carriageway.
 *   3. Between one approach's left mouth point and the next approach's right
 *      one lies a corner: where their kerb lines would meet if extended.
 *      Rounded, because a kerb is poured round a radius and not mitred.
 *   4. Walking mouth, corner, mouth, corner … closes the ring.
 *
 * The ring is then one polygon at one height, and every approach ends exactly
 * on it. Both halves of that sentence matter: the spans that interrupt the
 * paving are derived from the same `stop` numbers, so the street stops where
 * the junction begins rather than somewhere nearby.
 * ===================================================================== */

/** One street arriving at a junction. */
export interface Approach {
  /** Index into the roads array this junction was built from. */
  road: number;
  /** Distance along that way at which it passes through the node. */
  at: number;
  /** Unit direction along the way, pointing away from the node. */
  dir: Vec2;
  /** Half-width of the carriageway. */
  half: number;
  /** How far from the centre this approach's carriageway stops. */
  stop: number;
  /** +1 when `dir` follows the way's own direction, -1 when it opposes it. */
  sign: number;
  /** Surface height at the mouth. Filled in by `RoadProfiles`. */
  mouthY: number;
}

export interface JunctionShape {
  x: number;
  z: number;
  /** Height at the middle. Filled in by `RoadProfiles`. */
  height: number;
  /**
   * Height at each ring vertex, so the surface can be warped.
   *
   * A junction is not flat, and pretending it is breaks it on any slope worth
   * the name: each street is levelled to agree at the *centre*, then climbs
   * away at its own gradient, so by the time it reaches its mouth — six or ten
   * metres out — it can be most of a metre above that. Drawn flat, the
   * junction would meet every approach in a step of exactly that size.
   * Measured on a 1-in-3 test hillside: half a metre, at every mouth.
   *
   * So the surface is a fan: the middle at one height, each mouth at the
   * height its own street actually arrives at, and the corners interpolating
   * between the two mouths they join. Which is what a real junction does —
   * it warps.
   */
  ringY: number[];
  /** How far the flat pad under the junction reaches. */
  radius: number;
  approaches: Approach[];
  /** Boundary, walking anticlockwise in bearing order. */
  ring: Vec2[];
  /** For each edge ring[i] → ring[i+1]: true when it is an open mouth. */
  mouth: boolean[];
}

/**
 * Below this the two streets are too nearly parallel for "how far along does
 * the other one reach" to mean anything, and the answer runs to infinity.
 */
const MIN_SIN = 0.34;
/** However the geometry works out, a junction is not half a block wide. */
const MAX_STOP_M = 26;
/** How far along a way its end has to be before it counts as arriving. */
const STUB_M = 1.5;
/** Points sampled along each rounded corner, endpoints excluded. */
const CORNER_SAMPLES = 3;

/** Cumulative length along a way, one entry per point. */
function chainage(points: Vec2[]): number[] {
  const out = [0];
  for (let i = 1; i < points.length; i++) {
    out.push(out[i - 1] + Math.hypot(
      points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  }
  return out;
}

/** Unit direction of a way at a distance along it. */
function tangentAt(points: Vec2[], chain: number[], at: number): Vec2 {
  let i = 0;
  while (i < chain.length - 2 && chain[i + 1] < at) i++;
  const dx = points[i + 1][0] - points[i][0];
  const dz = points[i + 1][1] - points[i][1];
  const len = Math.hypot(dx, dz) || 1;
  return [dx / len, dz / len];
}

/**
 * Group crossings into places, and give each place a boundary.
 *
 * Heights are not decided here — they need the road profiles, which are not
 * this file's business — so every shape comes back at height zero for
 * `RoadProfiles` to fill in.
 */
export function buildJunctions(
  roads: Road[],
  crossings = findCrossings(roads),
  mergeDistance = 6,
): JunctionShape[] {
  if (!crossings.length) return [];

  const clusters = new Map<string, Crossing[]>();
  for (const c of crossings) {
    const key = `${Math.round(c.x / mergeDistance)},${Math.round(c.z / mergeDistance)}`;
    let bucket = clusters.get(key);
    if (!bucket) clusters.set(key, (bucket = []));
    bucket.push(c);
  }

  const chains = new Map<number, number[]>();
  const chainFor = (index: number): number[] => {
    let chain = chains.get(index);
    if (!chain) chains.set(index, (chain = chainage(roads[index].points)));
    return chain;
  };

  const out: JunctionShape[] = [];
  for (const bucket of clusters.values()) {
    const members = new Map<number, number>();
    let sx = 0;
    let sz = 0;
    for (const c of bucket) {
      members.set(c.roadA, c.atA);
      members.set(c.roadB, c.atB);
      sx += c.x;
      sz += c.z;
    }
    const x = sx / bucket.length;
    const z = sz / bucket.length;

    // A way passing through contributes two approaches, one each way. A way
    // that ends here contributes one: there is no street on the far side to
    // stop, and pretending otherwise builds a mouth opening onto nothing.
    const approaches: Approach[] = [];
    for (const [road, at] of members) {
      const points = roads[road].points;
      const chain = chainFor(road);
      const total = chain[chain.length - 1];
      const [tx, tz] = tangentAt(points, chain, at);
      const half = roads[road].width / 2;
      if (total - at > STUB_M) {
        approaches.push({ road, at, dir: [tx, tz], half, stop: half, sign: 1, mouthY: 0 });
      }
      if (at > STUB_M) {
        approaches.push({ road, at, dir: [-tx, -tz], half, stop: half, sign: -1, mouthY: 0 });
      }
    }
    if (approaches.length < 2) continue;

    // How far each approach has to stand back: far enough that the widest
    // street crossing it has already passed. A pair too nearly parallel to
    // cross properly is ignored rather than allowed to run away to infinity.
    let widest = 0;
    for (const a of approaches) widest = Math.max(widest, a.half);
    for (const a of approaches) {
      let stop = widest;
      for (const b of approaches) {
        if (b === a || b.road === a.road) continue;
        const sin = Math.abs(a.dir[0] * b.dir[1] - a.dir[1] * b.dir[0]);
        if (sin < MIN_SIN) continue;
        stop = Math.max(stop, b.half / sin);
      }
      a.stop = Math.min(MAX_STOP_M, stop);
    }

    approaches.sort((p, q) =>
      Math.atan2(p.dir[1], p.dir[0]) - Math.atan2(q.dir[1], q.dir[0]));

    const ring: Vec2[] = [];
    const mouth: boolean[] = [];
    for (let i = 0; i < approaches.length; i++) {
      const a = approaches[i];
      const b = approaches[(i + 1) % approaches.length];
      // Perpendicular at ninety degrees further round, so walking the
      // approaches in bearing order walks the ring the same way.
      const pa: Vec2 = [-a.dir[1], a.dir[0]];
      const pb: Vec2 = [-b.dir[1], b.dir[0]];

      const near: Vec2 = [x + a.dir[0] * a.stop - pa[0] * a.half,
                          z + a.dir[1] * a.stop - pa[1] * a.half];
      const far: Vec2 = [x + a.dir[0] * a.stop + pa[0] * a.half,
                         z + a.dir[1] * a.stop + pa[1] * a.half];
      const nextNear: Vec2 = [x + b.dir[0] * b.stop - pb[0] * b.half,
                              z + b.dir[1] * b.stop - pb[1] * b.half];

      ring.push(near);
      mouth.push(true);      // near -> far is the mouth of this approach
      ring.push(far);

      for (const p of cornerPoints(far, a.dir, nextNear, b.dir)) {
        ring.push(p);
        mouth.push(false);
      }
      mouth.push(false);     // last corner point -> next approach's near point
    }

    let radius = 0;
    for (const p of ring) radius = Math.max(radius, Math.hypot(p[0] - x, p[1] - z));
    out.push({
      x, z, height: 0, ringY: new Array<number>(ring.length).fill(0),
      radius, approaches, ring, mouth,
    });
  }
  return out;
}

/**
 * The rounded corner between the end of one approach and the start of the
 * next: the point where their kerb lines would meet, used as the control
 * point of a curve from one to the other.
 *
 * A Bézier rather than a fitted arc on purpose. A true fillet has to solve for
 * a tangent radius and has a family of degenerate cases — parallel lines,
 * reflex corners, a radius that will not fit — every one of which produces a
 * NaN that ends up in a vertex buffer. A quadratic through the mitre point is
 * always defined, always lands on both ends, and looks like a kerb radius.
 */
function cornerPoints(from: Vec2, fromDir: Vec2, to: Vec2, toDir: Vec2): Vec2[] {
  const denom = fromDir[0] * toDir[1] - fromDir[1] * toDir[0];
  let control: Vec2;
  if (Math.abs(denom) < 0.2) {
    control = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  } else {
    const dx = to[0] - from[0];
    const dz = to[1] - from[1];
    const s = (dx * toDir[1] - dz * toDir[0]) / denom;
    // A corner behind the mouths is not a corner; fall back to the chord.
    control = s > 0 && s < MAX_STOP_M
      ? [from[0] + fromDir[0] * s, from[1] + fromDir[1] * s]
      : [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  }

  const out: Vec2[] = [];
  for (let i = 1; i <= CORNER_SAMPLES; i++) {
    const u = i / (CORNER_SAMPLES + 1);
    const v = 1 - u;
    out.push([
      v * v * from[0] + 2 * u * v * control[0] + u * u * to[0],
      v * v * from[1] + 2 * u * v * control[1] + u * u * to[1],
    ]);
  }
  return out;
}

/**
 * Where paving stops, taken from the junctions themselves.
 *
 * This replaces the older per-crossing calculation, and the difference is the
 * whole point: the street now stops exactly where the junction's mouth is,
 * because both numbers are the same number. Before, one was worked out from a
 * single crossing and the other from a cluster of them, and at any junction
 * where three streets met they disagreed by a metre or two — which is a gap
 * you can see through, or an overlap that flickers.
 *
 * Every approach is interrupted, including the widest. Nothing "carries its
 * surface through" any more, because the junction carries it.
 */
export function spansFromJunctions(
  roads: Road[],
  junctions: readonly JunctionShape[],
): Map<string, StreetSpans> {
  const raw = roads.map(() => ({
    sides: [] as Array<[number, number]>,
    carriageway: [] as Array<[number, number]>,
  }));

  for (const j of junctions) {
    for (const a of j.approaches) {
      const from = a.at;
      // The approach runs away from the node in `dir`, so its stop lies ahead
      // of the node along the way in one case and behind it in the other. Both
      // are recorded as a span around the node.
      const lo = from - a.stop;
      const hi = from + a.stop;
      raw[a.road].carriageway.push([lo, hi]);
      raw[a.road].sides.push([lo, hi]);
    }
  }

  const out = new Map<string, StreetSpans>();
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

/** How many ring vertices each approach contributes: two mouth, then corner. */
const RING_STRIDE = 2 + CORNER_SAMPLES;

/**
 * Give every ring vertex a height, from the heights the streets arrive at.
 *
 * The ring was built approach by approach in bearing order — two mouth points,
 * then the corner leading to the next approach — so walking it in the same
 * order is enough to know what every vertex belongs to. Mouth vertices take
 * their own street's height; corner vertices ease from one to the next.
 */
export function warpRing(shape: JunctionShape): void {
  const n = shape.approaches.length;
  if (!n || shape.ring.length !== n * RING_STRIDE) {
    shape.ringY = shape.ring.map(() => shape.height);
    return;
  }
  const y = new Array<number>(shape.ring.length);
  for (let i = 0; i < n; i++) {
    const here = shape.approaches[i].mouthY;
    const next = shape.approaches[(i + 1) % n].mouthY;
    const base = i * RING_STRIDE;
    y[base] = here;
    y[base + 1] = here;
    for (let k = 1; k <= CORNER_SAMPLES; k++) {
      const u = k / (CORNER_SAMPLES + 1);
      y[base + 1 + k] = here + (next - here) * u;
    }
  }
  shape.ringY = y;
}

/**
 * The junction surface at a point: the fan triangle it falls in, interpolated.
 *
 * Outside the ring it answers with the nearest boundary edge, which is what
 * the grading wants when it eases the correction off past the junction.
 */
export function junctionHeightAt(shape: JunctionShape, x: number, z: number): number {
  const ring = shape.ring;
  const ringY = shape.ringY;
  if (ring.length < 3 || ringY.length !== ring.length) return shape.height;

  let bestDist = Infinity;
  let bestY = shape.height;
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    const ax = ring[i][0] - shape.x, az = ring[i][1] - shape.z;
    const bx = ring[j][0] - shape.x, bz = ring[j][1] - shape.z;
    const px = x - shape.x, pz = z - shape.z;

    // Barycentric coordinates in the fan triangle (centre, ring[i], ring[j]).
    const denom = ax * bz - az * bx;
    if (Math.abs(denom) > 1e-9) {
      const u = (px * bz - pz * bx) / denom;
      const v = (ax * pz - az * px) / denom;
      if (u >= 0 && v >= 0 && u + v <= 1) {
        return shape.height * (1 - u - v) + ringY[i] * u + ringY[j] * v;
      }
    }

    // Not in this wedge: remember the closest edge in case we are outside.
    const vx = bx - ax, vz = bz - az;
    const len2 = vx * vx + vz * vz;
    let t = len2 < 1e-9 ? 0 : ((px - ax) * vx + (pz - az) * vz) / len2;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const d = Math.hypot(px - (ax + vx * t), pz - (az + vz * t));
    if (d < bestDist) {
      bestDist = d;
      bestY = ringY[i] + (ringY[j] - ringY[i]) * t;
    }
  }
  return bestY;
}
