/**
 * "Which street am I on, and which way does it run?"
 *
 * A grid hash over every segment of every drawn way. Two things need this:
 * putting a car down on a road in the first place, and telling — sixty times a
 * second — whether the wheels are still on asphalt. Later, traffic will need
 * exactly the same query to find the lane ahead.
 *
 * Footways and pedestrian areas are indexed too, and that is not for driving
 * on. They are paved, so they are drawn a little above the earth, and anything
 * standing on one has to stand on the paving rather than on the ground beneath
 * it. With only drivable ways here, a car parked on a square sank 20 cm and
 * the paving closed over it. Driving still only ever asks about drivable
 * ways — `nearest` filters them out unless asked not to.
 *
 * Segments are registered into every cell their bounding box touches, so a
 * 200 m straight is found from anywhere along it rather than only near its
 * ends.
 */

import type { Terrain } from '../terrain/heightfield';
import type { PartField } from '../world/partfield';
import { roadSurfaceProfile, type RoadProfiles } from '../world/roadprofile';
import {
  gradedHalfWidth, sectionHalfWidth, sectionHeightAt, streetSection,
  NORM_DEFAULT, type StreetEdge, type StreetNorm,
} from '../world/street';
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
  /** Half-width of the whole street, embankment included. */
  streetHalfWidth: number;
}

interface Segment {
  road: number;
  /** Index of this segment's first point within the way. */
  at: number;
  /** Cars may use this one. Footways and squares are indexed but not drivable. */
  drivable: boolean;
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
  private readonly shared: RoadProfiles | null;
  private readonly norm: StreetNorm;
  /**
   * What was actually built here, cell by cell.
   *
   * When it is present the height under the wheels comes from the very quad
   * the renderer drew, and the two cannot drift apart. Without it the index
   * recomputes a cross-section of its own, which is a second opinion about a
   * surface that already exists — and a second opinion is how a car ends up
   * driving a third of a metre below the asphalt it can see.
   */
  private readonly field: PartField | null;
  /** Cross-sections per way, built on first use. */
  private readonly sections = new Map<number, StreetEdge[]>();
  /** Surface heights per way, built on first use — most ways are never driven. */
  private readonly profiles = new Map<number, number[]>();

  /**
   * `shared` carries the profiles the streets were actually graded and drawn
   * to. Without it the index would recompute them from a terrain that has
   * since been cut to fit those very roads, and the car would drive a third of
   * a metre below the asphalt it can see.
   */
  constructor(
    roads: Road[],
    terrain: Terrain,
    shared: RoadProfiles | null = null,
    norm: StreetNorm = NORM_DEFAULT,
    field: PartField | null = null,
  ) {
    this.roads = roads;
    this.terrain = terrain;
    this.shared = shared;
    this.norm = norm;
    this.field = field;

    roads.forEach((road, roadIndex) => {
      for (let i = 0; i < road.points.length - 1; i++) {
        const a = road.points[i];
        const b = road.points[i + 1];
        if (a[0] === b[0] && a[1] === b[1]) continue;

        const index = this.segments.length;
        this.segments.push({
          road: roadIndex, at: i, drivable: road.drivable,
          ax: a[0], az: a[1], bx: b[0], bz: b[1],
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

  /** How many ways a car could actually use — what "can you drive here" means. */
  get roadCount(): number {
    return this.roads.reduce((n, road) => n + (road.drivable ? 1 : 0), 0);
  }

  /**
   * Nearest point on any indexed way, searching outwards ring by ring and
   * stopping as soon as another ring cannot possibly hold anything closer.
   */
  nearest(x: number, z: number, maxRadius = 120, drivableOnly = true): RoadHit | null {
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
            if (drivableOnly && !seg.drivable) continue;
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
    const section = this.sectionFor(seg.road);
    const full = sectionHalfWidth(section);

    // The height of whatever part of the street this point is over — channel,
    // kerb, verge, pavement — and then, across the embankment, a ramp down to
    // the ground the embankment lands on. Without that last piece the car
    // stands on the drawn earthwork until it crosses the pavement's back edge
    // and then drops the height of the embankment in one step.
    // What was really built here, cell by cell. It is the quad the renderer
    // drew, so the wheels and the picture cannot disagree — which they did,
    // for as long as this index worked the answer out for itself.
    const placed = this.field?.sample(x, z);
    const surfaceY = placed ? placed.y : this.sweptHeightAt(seg, bestT, bestDist, x, z);

    return {
      road: this.roads[seg.road],
      distance: bestDist,
      point: [seg.ax + vx * bestT, seg.az + vz * bestT],
      direction: [vx / len, vz / len],
      surfaceY,
      streetHalfWidth: full,
    };
  }

  /**
   * The old answer: sweep the cross-section along the way and read off the
   * height. Kept for the ways the parts layer does not place — anything
   * outside the network, and any city built before this index was given a
   * field to read.
   */
  private sweptHeightAt(
    seg: Segment, t: number, dist: number, x: number, z: number,
  ): number {
    const profile = this.profileFor(seg.road);
    const crown = profile[seg.at] + (profile[seg.at + 1] - profile[seg.at]) * t;
    const section = this.sectionFor(seg.road);
    const built = gradedHalfWidth(section);
    const full = sectionHalfWidth(section);
    if (dist <= built) return crown + sectionHeightAt(section, dist);
    // Across the embankment, a ramp down to the ground it lands on. Without
    // that last piece the car stands on the drawn earthwork until it crosses
    // the pavement's back edge and then drops the height of it in one step.
    const inner = crown + sectionHeightAt(section, built);
    const outer = this.terrain.heightAt(x, z);
    const k = full > built ? Math.min(1, (dist - built) / (full - built)) : 1;
    return inner + (outer - inner) * k;
  }

  private sectionFor(roadIndex: number): StreetEdge[] {
    let section = this.sections.get(roadIndex);
    if (!section) {
      section = streetSection(this.roads[roadIndex], this.norm);
      this.sections.set(roadIndex, section);
    }
    return section;
  }

  private profileFor(roadIndex: number): number[] {
    let profile = this.profiles.get(roadIndex);
    if (!profile) {
      const road = this.roads[roadIndex];
      profile = this.shared?.get(road) ?? roadSurfaceProfile(road, this.terrain);
      this.profiles.set(roadIndex, profile);
    }
    return profile;
  }
}

function cellKey(cx: number, cz: number): number {
  return (cx + 32768) * 65536 + (cz + 32768);
}
