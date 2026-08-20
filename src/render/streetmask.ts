/**
 * Where paving was actually laid, so the ground can be cut away under it.
 *
 * Until now every surface in the city was a separate sheet laid over the
 * terrain, and the terrain went on existing underneath all of them. That is
 * the thing the user objected to, and they were right: two surfaces over one
 * square metre is a disagreement waiting to be noticed, and it was noticed
 * every time — grass through the asphalt, a car half a wheel deep in a
 * pavement, strips of road hanging over a junction.
 *
 * So the ground is genuinely cut: where a street is drawn, the earth has no
 * triangles at all. The one thing that must never happen is cutting a hole
 * bigger than the street that covers it — that is a window through the world
 * to the sky. This mask exists to make that impossible rather than unlikely.
 *
 * It records the paving as it is really drawn — after junctions have
 * interrupted it, which is why it is filled in by the road builder rather than
 * computed from the road centrelines — and then it is *eroded*: a point counts
 * as "deep" only when the paving reaches at least one whole ground cell
 * further in every direction. A ground quad whose four corners are all deep
 * lies entirely under paving, because every point of a square is within
 * three-quarters of its own width of one of its corners. That is a proof
 * rather than a margin, which is what a hole in the world deserves.
 */

import type { Vec2 } from '../world/types';
import { offsetPolyline } from './roads';

export class StreetMask {
  private readonly paved: Uint8Array;
  private deep: Uint8Array | null = null;
  private readonly cols: number;
  private readonly rows: number;
  private readonly originX: number;
  private readonly originZ: number;
  readonly cell: number;
  /** How far inside the paving a "deep" point is guaranteed to be, in metres. */
  private inset = 0;

  constructor(radius: number) {
    // A metre for a small town, coarser for a big one — there is no point
    // resolving the mask finer than the mesh that will use it, and a 3 km city
    // at one metre is ten million cells for nothing.
    this.cell = Math.max(1, radius / 500);
    const span = radius * 2.2;
    this.cols = Math.max(8, Math.ceil(span / this.cell) + 1);
    this.rows = this.cols;
    this.originX = -span / 2;
    this.originZ = -span / 2;
    this.paved = new Uint8Array(this.cols * this.rows);
  }

  /**
   * Lay a corridor of paving down the middle of a polyline.
   *
   * `skip` is the road builder's own per-segment interruption list, so a
   * street that stops at a junction stops here too and the ground under the
   * gap is left in place.
   */
  stampCorridor(points: Vec2[], halfWidth: number, skip: boolean[] | null): void {
    if (points.length < 2 || halfWidth <= 0) return;
    const { left, right } = offsetPolyline(points, halfWidth);
    for (let i = 0; i < points.length - 1; i++) {
      if (skip?.[i]) continue;
      this.triangle(left[i], right[i], right[i + 1]);
      this.triangle(left[i], right[i + 1], left[i + 1]);
    }
  }

  /**
   * Close the mask for use by a mesh whose cells are `groundCell` metres
   * across. Nothing may be cut before this is called.
   */
  finish(groundCell: number): void {
    this.inset = groundCell + this.cell;
    const radius = Math.max(1, Math.ceil(this.inset / this.cell));
    this.deep = erode(this.paved, this.cols, this.rows, radius);
  }

  /** True where paving covers everything within `inset` metres. */
  isDeep(x: number, z: number): boolean {
    if (!this.deep) return false;
    const c = Math.round((x - this.originX) / this.cell);
    const r = Math.round((z - this.originZ) / this.cell);
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return false;
    return this.deep[r * this.cols + c] === 1;
  }

  /**
   * The widest ground quad that may be dropped on the strength of `isDeep`.
   * A quad larger than this is not covered by the proof, so it is kept.
   */
  get maxCutSpan(): number {
    return this.inset;
  }

  private triangle(a: Vec2, b: Vec2, c: Vec2): void {
    const minX = Math.min(a[0], b[0], c[0]);
    const maxX = Math.max(a[0], b[0], c[0]);
    const minZ = Math.min(a[1], b[1], c[1]);
    const maxZ = Math.max(a[1], b[1], c[1]);

    const c0 = Math.max(0, Math.floor((minX - this.originX) / this.cell));
    const c1 = Math.min(this.cols - 1, Math.ceil((maxX - this.originX) / this.cell));
    const r0 = Math.max(0, Math.floor((minZ - this.originZ) / this.cell));
    const r1 = Math.min(this.rows - 1, Math.ceil((maxZ - this.originZ) / this.cell));
    if (c1 < c0 || r1 < r0) return;

    // Edge functions. Sign-agnostic so winding does not matter here — a
    // corridor quad flips its winding whenever the street turns back on itself.
    const area = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
    if (Math.abs(area) < 1e-9) return;
    const s = area > 0 ? 1 : -1;

    for (let r = r0; r <= r1; r++) {
      const z = this.originZ + r * this.cell;
      for (let col = c0; col <= c1; col++) {
        const x = this.originX + col * this.cell;
        const w0 = ((b[0] - a[0]) * (z - a[1]) - (x - a[0]) * (b[1] - a[1])) * s;
        if (w0 < 0) continue;
        const w1 = ((c[0] - b[0]) * (z - b[1]) - (x - b[0]) * (c[1] - b[1])) * s;
        if (w1 < 0) continue;
        const w2 = ((a[0] - c[0]) * (z - c[1]) - (x - c[0]) * (a[1] - c[1])) * s;
        if (w2 < 0) continue;
        this.paved[r * this.cols + col] = 1;
      }
    }
  }
}

/**
 * Shrink a mask by `radius` cells, in the Chebyshev sense — a cell survives
 * only when every cell in the square around it is set. Two separable passes,
 * because the square is the product of a row and a column.
 */
function erode(src: Uint8Array, cols: number, rows: number, radius: number): Uint8Array {
  const mid = new Uint8Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    const base = r * cols;
    for (let c = 0; c < cols; c++) {
      let keep = 1;
      const lo = c - radius;
      const hi = c + radius;
      if (lo < 0 || hi >= cols) keep = 0;
      else {
        for (let k = lo; k <= hi; k++) {
          if (src[base + k] === 0) { keep = 0; break; }
        }
      }
      mid[base + c] = keep;
    }
  }

  const out = new Uint8Array(cols * rows);
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      let keep = 1;
      const lo = r - radius;
      const hi = r + radius;
      if (lo < 0 || hi >= rows) keep = 0;
      else {
        for (let k = lo; k <= hi; k++) {
          if (mid[k * cols + c] === 0) { keep = 0; break; }
        }
      }
      out[r * cols + c] = keep;
    }
  }
  return out;
}
