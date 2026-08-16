/**
 * "Which street am I on, and which way does it run?"
 *
 * A grid hash over every segment of every drivable way. Two things need this:
 * putting a car down on a road in the first place, and telling — sixty times a
 * second — whether the wheels are still on asphalt. Later, traffic will need
 * exactly the same query to find the lane ahead.
 *
 * Segments are registered into every cell their bounding box touches, so a
 * 200 m straight is found from anywhere along it rather than only near its
 * ends.
 */

import type { Terrain } from '../terrain/heightfield';
import { roadSurfaceProfile } from '../world/roadprofile';
import type { Road, Vec2 } from '../world/types';

/** Cell size. Comfortably larger than a street is wide, small enough to stay cheap. */
const CELL_M = 40;

export interface RoadHit {
  road: Road;
  /** Distance from the query point to the centreline, in metres. */
  distance: number;
  /** Closest point on the centreline. */
  point: Vec2;
  /** Unit direction of travel along the way at that point. */
  direction: Vec2;
  /**
   * Height of the drawn road surface there. This is what a car has to sit on:
   * on a bridge it is metres above the terrain, and reading the terrain
   * instead would drop the car into the river.
   */
  surfaceY: number;
}

interface Segment {
  road: number;
  /** Index of this segment's first point within the way. */
  at: number;
  ax: number;
  az: number;
  bx: number;
  bz: number;
}

export class RoadIndex {
  private readonly cells = new Map<number, number[]>();
  private readonly segments: Segment[] = [];
  private readonly roads: Road[];
  private readonly terrain: Terrain;
  /** Surface heights per way, built on first use — most ways are never driven. */
  private readonly profiles = new Map<number, number[]>();

  constructor(roads: Road[], terrain: Terrain) {
    this.roads = roads;
    this.terrain = terrain;

    roads.forEach((road, roadIndex) => {
      for (let i = 0; i < road.points.length - 1; i++) {
        const a = road.points[i];
        const b = road.points[i + 1];
        if (a[0] === b[0] && a[1] === b[1]) continue;

        const index = this.segments.length;
        this.segments.push({
          road: roadIndex, at: i, ax: a[0], az: a[1], bx: b[0], bz: b[1],
        });

        const minX = Math.floor(Math.min(a[0], b[0]) / CELL_M);
        const maxX = Math.floor(Math.max(a[0], b[0]) / CELL_M);
        const minZ = Math.floor(Math.min(a[1], b[1]) / CELL_M);
        const maxZ = Math.floor(Math.max(a[1], b[1]) / CELL_M);
        for (let cx = minX; cx <= maxX; cx++) {
          for (let cz = minZ; cz <= maxZ; cz++) {
            const key = cellKey(cx, cz);
            let bucket = this.cells.get(key);
            if (!bucket) this.cells.set(key, (bucket = []));
            bucket.push(index);
          }
        }
      }
    });
  }

  get roadCount(): number {
    return this.roads.length;
  }

  /**
   * Nearest point on any indexed way, searching outwards ring by ring and
   * stopping as soon as another ring cannot possibly hold anything closer.
   */
  nearest(x: number, z: number, maxRadius = 120): RoadHit | null {
    const cx = Math.floor(x / CELL_M);
    const cz = Math.floor(z / CELL_M);
    const maxRings = Math.ceil(maxRadius / CELL_M);

    let best = -1;
    let bestDist = Infinity;
    let bestT = 0;

    for (let ring = 0; ring <= maxRings; ring++) {
      for (let dx = -ring; dx <= ring; dx++) {
        for (let dz = -ring; dz <= ring; dz++) {
          if (ring > 0 && Math.max(Math.abs(dx), Math.abs(dz)) !== ring) continue;
          const bucket = this.cells.get(cellKey(cx + dx, cz + dz));
          if (!bucket) continue;
          for (const index of bucket) {
            const seg = this.segments[index];
            const vx = seg.bx - seg.ax;
            const vz = seg.bz - seg.az;
            const lenSq = vx * vx + vz * vz;
            const t = Math.max(0, Math.min(1, ((x - seg.ax) * vx + (z - seg.az) * vz) / lenSq));
            const px = seg.ax + vx * t;
            const pz = seg.az + vz * t;
            const d = Math.hypot(x - px, z - pz);
            if (d < bestDist) {
              bestDist = d;
              best = index;
              bestT = t;
            }
          }
        }
      }
      // A hit inside the rings already searched cannot be beaten by the next.
      if (best >= 0 && bestDist <= ring * CELL_M) break;
    }

    if (best < 0 || bestDist > maxRadius) return null;

    const seg = this.segments[best];
    const vx = seg.bx - seg.ax;
    const vz = seg.bz - seg.az;
    const len = Math.hypot(vx, vz) || 1;
    const profile = this.profileFor(seg.road);
    return {
      road: this.roads[seg.road],
      distance: bestDist,
      point: [seg.ax + vx * bestT, seg.az + vz * bestT],
      direction: [vx / len, vz / len],
      surfaceY: profile[seg.at] + (profile[seg.at + 1] - profile[seg.at]) * bestT,
    };
  }

  private profileFor(roadIndex: number): number[] {
    let profile = this.profiles.get(roadIndex);
    if (!profile) {
      profile = roadSurfaceProfile(this.roads[roadIndex], this.terrain);
      this.profiles.set(roadIndex, profile);
    }
    return profile;
  }
}

function cellKey(cx: number, cz: number): number {
  return (cx + 32768) * 65536 + (cz + 32768);
}
