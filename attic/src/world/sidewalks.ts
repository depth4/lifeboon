/**
 * Where the map already has a pavement, stop drawing a second one.
 *
 * A street's cross-section grows a pavement because most towns are not
 * surveyed for them and a street with nothing beside it reads as a runway.
 * That guess is right until the map *does* have the pavement — and in
 * OpenStreetMap the usual way to map one is not a tag on the street but a
 * `highway=footway` way of its own, running alongside it.
 *
 * Draw both and you get two pavements with a strip of grass between them,
 * which is what the user saw and called "двойной тротуар". Measured on
 * Alapaevsk: 96 footway ways, and 66 of the town's streets have one running
 * beside them.
 *
 * It is decided per stretch and not per street, because the coverage is
 * patchy: of those 66, only eight are shadowed along more than half their
 * length and thirty along less than a tenth. Dropping a whole street's
 * pavement because one block of it was surveyed would be as wrong as drawing
 * two. So the band keeps its place in the section — the kerb, the levels and
 * the grading are unchanged — and simply becomes verge where somebody else's
 * pavement is already there.
 */

import type { Road, Vec2 } from './types';

/** Cell size for the hash. A little wider than any street's built width. */
const CELL_M = 24;

export class MappedPaths {
  private readonly cells = new Map<number, Array<[Vec2, Vec2]>>();
  readonly count: number;

  constructor(roads: Road[]) {
    let count = 0;
    for (const road of roads) {
      // Only ways that are *only* a path: a service road people also walk
      // along is not somebody's survey of a pavement, and a crossing is a
      // pavement going the other way.
      if (road.drivable || road.points.length < 2 || road.isCrossing) continue;
      if (road.cls !== 'footway' && road.cls !== 'pedestrian' && road.cls !== 'steps') continue;
      count++;

      for (let i = 0; i < road.points.length - 1; i++) {
        const seg: [Vec2, Vec2] = [road.points[i], road.points[i + 1]];
        const c0 = Math.floor(Math.min(seg[0][0], seg[1][0]) / CELL_M);
        const c1 = Math.floor(Math.max(seg[0][0], seg[1][0]) / CELL_M);
        const r0 = Math.floor(Math.min(seg[0][1], seg[1][1]) / CELL_M);
        const r1 = Math.floor(Math.max(seg[0][1], seg[1][1]) / CELL_M);
        for (let c = c0; c <= c1; c++) {
          for (let r = r0; r <= r1; r++) {
            const k = key(c, r);
            let bucket = this.cells.get(k);
            if (!bucket) this.cells.set(k, (bucket = []));
            bucket.push(seg);
          }
        }
      }
    }
    this.count = count;
  }

  /** True when a mapped path runs within `reach` of this point. */
  covers(x: number, z: number, reach: number): boolean {
    if (!this.cells.size) return false;
    const cx = Math.floor(x / CELL_M);
    const cz = Math.floor(z / CELL_M);
    const span = Math.ceil(reach / CELL_M);
    for (let c = cx - span; c <= cx + span; c++) {
      for (let r = cz - span; r <= cz + span; r++) {
        for (const [a, b] of this.cells.get(key(c, r)) ?? []) {
          const vx = b[0] - a[0];
          const vz = b[1] - a[1];
          const len2 = vx * vx + vz * vz;
          if (len2 < 1e-9) continue;
          let t = ((x - a[0]) * vx + (z - a[1]) * vz) / len2;
          t = t < 0 ? 0 : t > 1 ? 1 : t;
          if (Math.hypot(x - (a[0] + vx * t), z - (a[1] + vz * t)) <= reach) return true;
        }
      }
    }
    return false;
  }
}

function key(cx: number, cz: number): number {
  return (cx + 4096) * 8192 + (cz + 4096);
}
