/**
 * What the parts ask of the earth.
 *
 * The invariant this serves is the oldest one in the project: **the earth is
 * cut to carry what is built on it, and nothing is built on earth that has not
 * been cut.** What is new is where the claim comes from. It used to be derived
 * from the OpenStreetMap ways — the whole way, junctions included — so at
 * every crossing two corridors claimed the same earth at two different levels
 * and the stronger claim won. That is where the "прямоугольные плато криво
 * друг на друге" came from.
 *
 * Now the claim is the part. A street part has already been trimmed back to
 * its junctions, so it cuts exactly the ground it covers and stops; the
 * junction cuts its own pad. There is no overlap to arbitrate because the
 * overlap was resolved before any of this was built.
 */

import type { GroundPad, StreetCorridor } from '../../terrain/heightfield';
import { STRUCTURE_DEPTH } from '../roadprofile';
import { gradedHalfWidth, type StreetEdge, type StreetNorm } from '../street';
import type { Part } from '../parts';
import type { Vec2 } from '../types';
import type { PlacedNetwork } from './place';

/**
 * The corridors the earth has to be cut to.
 *
 * A bridge is deliberately absent: its deck is metres above the ground and
 * cutting a trench under one digs a hole in the riverbank for no reason.
 */
export function corridorsFrom(placed: PlacedNetwork, norm: StreetNorm): StreetCorridor[] {
  const out: StreetCorridor[] = [];
  for (const part of placed.parts) {
    if (part.kind === 'junction' || part.elevated || !part.spine) continue;
    if (part.spine.points.length < 2) continue;
    const section = placed.sections[part.edge];
    out.push({
      points: part.spine.points.map((p) => [p[0], p[1]] as [number, number]),
      levels: part.spine.levels,
      halfWidth: gradedHalfWidth(section),
      blend: Math.max(1.5, norm.batter),
      depth: STRUCTURE_DEPTH,
      shape: shapeOf(section),
    });
  }
  // Where two corridors claim the same ground equally hard, the first claim
  // stands, so the bigger road goes first and carries the side street across
  // it rather than being dug through.
  out.sort((a, b) => b.halfWidth - a.halfWidth);
  return out;
}

/**
 * The junctions' claim: their own pad, at the heights their own arms arrive at.
 *
 * Graded a little wider than it is drawn. A mesh cell straddling the drawn
 * boundary would otherwise have one corner on the junction and one on a street
 * climbing away from it, and the plane between them rises through the asphalt.
 */
export function padsFrom(placed: PlacedNetwork, apron = 1.5): GroundPad[] {
  const out: GroundPad[] = [];
  for (const part of placed.parts) {
    if (part.kind !== 'junction') continue;
    const { cols, x, z } = part.lattice;
    const centre: Vec2 = [x[0], z[0]];
    const ring: Array<[number, number]> = [];
    for (let c = 0; c < cols - 1; c++) {
      const i = cols + c;
      const dx = x[i] - centre[0];
      const dz = z[i] - centre[1];
      const len = Math.hypot(dx, dz) || 1;
      ring.push([x[i] + (dx / len) * apron, z[i] + (dz / len) * apron]);
    }
    if (ring.length < 3) continue;
    out.push({
      ring,
      heightAt: (px: number, pz: number) => padHeightAt(part, px, pz),
      depth: STRUCTURE_DEPTH,
      blend: 3,
    });
  }
  return out;
}

/**
 * The surface of a junction pad at a point, extended past its own boundary.
 *
 * A junction is not flat: it is levelled at its middle and each street climbs
 * away at its own gradient, so the mouths sit at their own heights and the
 * surface warps between them. Beyond the ring the same warp carries on, which
 * is what the apron needs — held flat out there it would hold the ground up
 * while the street descends.
 */
function padHeightAt(part: Part, x: number, z: number): number {
  const { cols, x: px, y: py, z: pz } = part.lattice;
  const cx = px[0];
  const cz = pz[0];
  const angle = Math.atan2(x - cx, z - cz);
  const n = cols - 1;

  let best = 0;
  let bestGap = Infinity;
  for (let c = 0; c < n; c++) {
    const i = cols + c;
    let gap = Math.abs(wrap(Math.atan2(px[i] - cx, pz[i] - cz) - angle));
    if (gap > Math.PI) gap = 2 * Math.PI - gap;
    if (gap < bestGap) {
      bestGap = gap;
      best = c;
    }
  }
  const i = cols + best;
  const reach = Math.hypot(px[i] - cx, pz[i] - cz) || 1;
  const here = Math.hypot(x - cx, z - cz);
  const t = Math.min(1.4, here / reach);
  return py[0] + (py[i] - py[0]) * t;
}

function wrap(a: number): number {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}

/**
 * The finished surface across a street, as [distance from centre, height above
 * the crown] pairs.
 *
 * The embankment edge is deliberately dropped: its height is whatever the
 * untouched ground turns out to be, which is the question grading is
 * answering, not an input to it.
 */
function shapeOf(section: StreetEdge[]): Array<[number, number]> {
  return section
    .filter((e) => !Number.isNaN(e.dy))
    .map((e) => [e.offset, e.dy] as [number, number]);
}
