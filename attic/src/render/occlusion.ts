/**
 * Where the ground is shut in, so it can be shaded darker there.
 *
 * A directional sun and a hemisphere light give every open surface the same
 * brightness, so grass right against a wall is exactly as bright as grass in
 * the middle of a field. The eye reads that as "these two objects are not in
 * the same place" — it is the single reason a building looks like a box
 * intersecting a green plane rather than something standing on the ground.
 *
 * The honest fix is ambient occlusion, and the cheap version of it is this: a
 * coarse grid of what the buildings cover, blurred, sampled per vertex. It
 * costs one pass over the footprints at load time and nothing at all per
 * frame, which matters because the alternative — screen-space AO — needs a
 * post-processing chain that a logarithmic depth buffer makes awkward.
 */

import type { Building, Vec2 } from '../world/types';
import type { StreetCorridor } from '../terrain/heightfield';

/** Grid spacing. Fine enough to resolve a gap between two houses. */
const CELL_M = 3;
/**
 * Blur passes. Each one widens the darkening by about a cell, so three passes
 * over a 3 m grid reach roughly nine metres out from a wall — about where a
 * building stops affecting the light on the ground beside it.
 */
const BLUR_PASSES = 3;

export class OcclusionField {
  private readonly grid: Float32Array;
  /**
   * Where the ground is already spoken for — under a building or under a
   * street. Unblurred and separate from the shading, because it answers a
   * different question: not "how dark is it here" but "may something be
   * planted here", which is what deciding where trees and shrubs go needs.
   */
  private readonly blocked: Uint8Array;
  private readonly cols: number;
  private readonly rows: number;
  private readonly originX: number;
  private readonly originZ: number;

  constructor(buildings: Building[], radius: number, corridors: StreetCorridor[] = []) {
    const span = radius * 2.2;
    this.cols = Math.max(8, Math.ceil(span / CELL_M) + 1);
    this.rows = this.cols;
    this.originX = -span / 2;
    this.originZ = -span / 2;
    this.grid = new Float32Array(this.cols * this.rows);
    this.blocked = new Uint8Array(this.cols * this.rows);

    for (const b of buildings) this.stamp(b.ring, b.holes);
    for (const c of corridors) this.blockCorridor(c);
    for (let i = 0; i < BLUR_PASSES; i++) this.blur();

    // A footprint's own cells come back from the blur well below 1, which
    // would leave the ground pale right where a wall meets it. Push the solid
    // interior back up so the darkest shading is against the wall.
    for (const b of buildings) this.reinforce(b.ring, b.holes);
    this.blur();
  }

  /** 0 in the open, approaching 1 hard against a wall. */
  at(x: number, z: number): number {
    const fx = (x - this.originX) / CELL_M;
    const fz = (z - this.originZ) / CELL_M;
    if (fx < 0 || fz < 0 || fx >= this.cols - 1 || fz >= this.rows - 1) return 0;
    const c = Math.floor(fx);
    const r = Math.floor(fz);
    const tx = fx - c;
    const tz = fz - r;
    const i = r * this.cols + c;
    const top = this.grid[i] + (this.grid[i + 1] - this.grid[i]) * tx;
    const j = i + this.cols;
    const bottom = this.grid[j] + (this.grid[j + 1] - this.grid[j]) * tx;
    return top + (bottom - top) * tz;
  }

  /** True where a building or a street already occupies the ground. */
  isBlocked(x: number, z: number): boolean {
    const c = Math.round((x - this.originX) / CELL_M);
    const r = Math.round((z - this.originZ) / CELL_M);
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return false;
    return this.blocked[r * this.cols + c] === 1;
  }

  private stamp(ring: Vec2[], holes: Vec2[][]): void {
    this.paint(ring, holes, 1);
    this.blockRing(ring);
  }

  private blockRing(ring: Vec2[]): void {
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const [x, z] of ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    // A metre of clearance, so nothing is planted hard against a wall.
    const pad = 1;
    const c0 = Math.max(0, Math.floor((minX - pad - this.originX) / CELL_M));
    const c1 = Math.min(this.cols - 1, Math.ceil((maxX + pad - this.originX) / CELL_M));
    const r0 = Math.max(0, Math.floor((minZ - pad - this.originZ) / CELL_M));
    const r1 = Math.min(this.rows - 1, Math.ceil((maxZ + pad - this.originZ) / CELL_M));
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) this.blocked[r * this.cols + c] = 1;
    }
  }

  private blockCorridor(corridor: StreetCorridor): void {
    const reach = corridor.halfWidth + corridor.blend;
    const pts = corridor.points;
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i];
      const [bx, bz] = pts[i + 1];
      const c0 = Math.max(0, Math.floor((Math.min(ax, bx) - reach - this.originX) / CELL_M));
      const c1 = Math.min(this.cols - 1, Math.ceil((Math.max(ax, bx) + reach - this.originX) / CELL_M));
      const r0 = Math.max(0, Math.floor((Math.min(az, bz) - reach - this.originZ) / CELL_M));
      const r1 = Math.min(this.rows - 1, Math.ceil((Math.max(az, bz) + reach - this.originZ) / CELL_M));
      const segLen2 = (bx - ax) ** 2 + (bz - az) ** 2;
      if (segLen2 < 1e-9) continue;
      for (let r = r0; r <= r1; r++) {
        const z = this.originZ + r * CELL_M;
        for (let c = c0; c <= c1; c++) {
          const x = this.originX + c * CELL_M;
          let t = ((x - ax) * (bx - ax) + (z - az) * (bz - az)) / segLen2;
          t = t < 0 ? 0 : t > 1 ? 1 : t;
          const px = ax + (bx - ax) * t;
          const pz = az + (bz - az) * t;
          if (Math.hypot(x - px, z - pz) <= reach) this.blocked[r * this.cols + c] = 1;
        }
      }
    }
  }

  private reinforce(ring: Vec2[], holes: Vec2[][]): void {
    this.paint(ring, holes, 0.85, true);
  }

  private paint(ring: Vec2[], holes: Vec2[][], value: number, max = false): void {
    if (ring.length < 3) return;
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const [x, z] of ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    const c0 = Math.max(0, Math.floor((minX - this.originX) / CELL_M));
    const c1 = Math.min(this.cols - 1, Math.ceil((maxX - this.originX) / CELL_M));
    const r0 = Math.max(0, Math.floor((minZ - this.originZ) / CELL_M));
    const r1 = Math.min(this.rows - 1, Math.ceil((maxZ - this.originZ) / CELL_M));

    for (let r = r0; r <= r1; r++) {
      const z = this.originZ + r * CELL_M;
      for (let c = c0; c <= c1; c++) {
        const x = this.originX + c * CELL_M;
        if (!inRing(x, z, ring)) continue;
        let hole = false;
        for (const h of holes) if (inRing(x, z, h)) { hole = true; break; }
        if (hole) continue;
        const i = r * this.cols + c;
        this.grid[i] = max ? Math.max(this.grid[i], value) : value;
      }
    }
  }

  /** Separable box blur, three taps, in place via one scratch row set. */
  private blur(): void {
    const { cols, rows, grid } = this;
    const tmp = new Float32Array(grid.length);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const l = c > 0 ? grid[i - 1] : grid[i];
        const rr = c < cols - 1 ? grid[i + 1] : grid[i];
        tmp[i] = (l + grid[i] * 2 + rr) * 0.25;
      }
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const u = r > 0 ? tmp[i - cols] : tmp[i];
        const d = r < rows - 1 ? tmp[i + cols] : tmp[i];
        grid[i] = (u + tmp[i] * 2 + d) * 0.25;
      }
    }
  }
}

function inRing(px: number, pz: number, ring: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], zi = ring[i][1];
    const xj = ring[j][0], zj = ring[j][1];
    if (zi > pz !== zj > pz && px < ((xj - xi) * (pz - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}
