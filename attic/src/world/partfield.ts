/**
 * The one answer to "what is at this square metre, and how high is it".
 *
 * This is the piece that ends the argument. `docs/STATE.md` §4.6 counted four
 * separate representations of ground ownership in this codebase — a
 * constructive union in the junction builder, an ownership raster at 0.5 m, a
 * paved-area raster at 3 m, and per-segment boolean arrays in the renderer —
 * all answering versions of the same question, and answering it differently.
 * Every "the pavement is doubled here and missing there" bug lived in the gaps
 * between them.
 *
 * There is one representation now: the cells of the parts themselves. This
 * index is a spatial lookup over those cells and nothing more — it stores no
 * geometry of its own, invents nothing, and cannot drift from the picture,
 * because the cell it returns is the quad the renderer drew. A car asking what
 * is under its wheels and a renderer deciding what colour to paint are reading
 * the same four vertices.
 *
 * The triangulation here — corner 0-1-2 and 0-2-3 — must stay identical to the
 * renderer's. Two different splits of the same quad give different heights
 * inside it, and that difference is exactly the kind of one-centimetre lie
 * that turns into a car sitting in the tarmac.
 */

import { affords, Can, Role, type Part } from './parts';

/** Grid spacing of the lookup. Comfortably larger than a lattice cell. */
const GRID_M = 8;

export interface PartHit {
  part: Part;
  role: Role;
  /** Which lane of the carriageway, or -1. */
  lane: number;
  /** Height of the drawn surface at the query point. */
  y: number;
  /** What may be done here: a mask of `Can`. */
  can: number;
}

export class PartField {
  readonly parts: Part[];
  /** Cell index → part. */
  private readonly cellPart: Int32Array;
  /** Cell index → index within that part's `lattice.cell`. */
  private readonly cellAt: Int32Array;
  /** CSR: start of each grid square's run in `items`. */
  private readonly starts: Int32Array;
  private readonly items: Int32Array;
  private readonly cols: number;
  private readonly rows: number;
  private readonly originX: number;
  private readonly originZ: number;

  constructor(parts: Part[]) {
    this.parts = parts;

    let minX = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxZ = -Infinity;
    let total = 0;
    for (const part of parts) {
      if (!part.lattice.cell.length) continue;
      minX = Math.min(minX, part.minX);
      minZ = Math.min(minZ, part.minZ);
      maxX = Math.max(maxX, part.maxX);
      maxZ = Math.max(maxZ, part.maxZ);
      total += part.lattice.cell.length;
    }
    if (!Number.isFinite(minX)) {
      minX = minZ = 0;
      maxX = maxZ = 1;
    }
    this.originX = minX - GRID_M;
    this.originZ = minZ - GRID_M;
    this.cols = Math.max(1, Math.ceil((maxX - minX) / GRID_M) + 3);
    this.rows = Math.max(1, Math.ceil((maxZ - minZ) / GRID_M) + 3);

    this.cellPart = new Int32Array(total);
    this.cellAt = new Int32Array(total);
    const boxes = new Int32Array(total * 4);

    let n = 0;
    parts.forEach((part, partIndex) => {
      const { rows, cols, x, z, cell } = part.lattice;
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const at = r * (cols - 1) + c;
          if (cell[at] === Role.None) continue;
          const i00 = r * cols + c;
          const i01 = i00 + 1;
          const i10 = i00 + cols;
          const i11 = i10 + 1;
          const lox = Math.min(x[i00], x[i01], x[i10], x[i11]);
          const hix = Math.max(x[i00], x[i01], x[i10], x[i11]);
          const loz = Math.min(z[i00], z[i01], z[i10], z[i11]);
          const hiz = Math.max(z[i00], z[i01], z[i10], z[i11]);
          this.cellPart[n] = partIndex;
          this.cellAt[n] = at;
          boxes[n * 4] = this.gx(lox);
          boxes[n * 4 + 1] = this.gz(loz);
          boxes[n * 4 + 2] = this.gx(hix);
          boxes[n * 4 + 3] = this.gz(hiz);
          n++;
        }
      }
    });

    // Count, prefix-sum, fill: the whole index is three typed arrays and no
    // per-square allocation. A city is a quarter of a million cells and an
    // array of arrays for that costs more than the geometry does.
    const squares = this.cols * this.rows;
    const counts = new Int32Array(squares + 1);
    for (let i = 0; i < n; i++) {
      for (let gz = boxes[i * 4 + 1]; gz <= boxes[i * 4 + 3]; gz++) {
        for (let gx = boxes[i * 4]; gx <= boxes[i * 4 + 2]; gx++) {
          counts[gz * this.cols + gx + 1]++;
        }
      }
    }
    for (let i = 0; i < squares; i++) counts[i + 1] += counts[i];
    this.starts = counts;
    this.items = new Int32Array(counts[squares]);
    const cursor = counts.slice(0, squares);
    for (let i = 0; i < n; i++) {
      for (let gz = boxes[i * 4 + 1]; gz <= boxes[i * 4 + 3]; gz++) {
        for (let gx = boxes[i * 4]; gx <= boxes[i * 4 + 2]; gx++) {
          this.items[cursor[gz * this.cols + gx]++] = i;
        }
      }
    }
    this.cellPart = this.cellPart.slice(0, n);
    this.cellAt = this.cellAt.slice(0, n);
  }

  /** How many cells of built world there are. The size of the model, in short. */
  get cellCount(): number {
    return this.cellPart.length;
  }

  /**
   * Every surface over a point, highest first.
   *
   * More than one is normal and correct: a bridge deck over a street is two
   * surfaces, and the car on the street below must not be given the deck.
   */
  sampleAll(x: number, z: number, out: PartHit[] = []): PartHit[] {
    out.length = 0;
    const gx = this.gx(x);
    const gz = this.gz(z);
    if (gx < 0 || gz < 0 || gx >= this.cols || gz >= this.rows) return out;
    const square = gz * this.cols + gx;
    for (let i = this.starts[square]; i < this.starts[square + 1]; i++) {
      const cell = this.items[i];
      const part = this.parts[this.cellPart[cell]];
      const y = heightIn(part, this.cellAt[cell], x, z);
      if (y === null) continue;
      const role = part.lattice.cell[this.cellAt[cell]] as Role;
      out.push({ part, role, lane: part.lattice.lane[this.cellAt[cell]], y, can: affords(role) });
    }
    out.sort((a, b) => b.y - a.y);
    return out;
  }

  /** The topmost surface over a point. */
  sample(x: number, z: number): PartHit | null {
    const hits = this.sampleAll(x, z, SCRATCH);
    return hits.length ? hits[0] : null;
  }

  /**
   * The surface nearest a height you are already at.
   *
   * What a car has to ask. Standing on the road under a viaduct, "the topmost
   * surface" is the viaduct, and answering with it drops the car through the
   * world or lifts it into the air.
   */
  sampleNear(x: number, z: number, y: number): PartHit | null {
    const hits = this.sampleAll(x, z, SCRATCH);
    let best: PartHit | null = null;
    let bestGap = Infinity;
    for (const hit of hits) {
      const gap = Math.abs(hit.y - y);
      if (gap < bestGap) {
        bestGap = gap;
        best = hit;
      }
    }
    return best;
  }

  /** Whether anything paved covers this point. What the ground asks. */
  paved(x: number, z: number): boolean {
    const hits = this.sampleAll(x, z, SCRATCH);
    for (const hit of hits) if (hit.can & Can.Paved) return true;
    return false;
  }

  private gx(x: number): number {
    return Math.floor((x - this.originX) / GRID_M);
  }

  private gz(z: number): number {
    return Math.floor((z - this.originZ) / GRID_M);
  }
}

const SCRATCH: PartHit[] = [];

/**
 * Height of one lattice cell at a point, or null if the point is outside it.
 *
 * Split 0-1-2 and 0-2-3, the same way the renderer splits it. The test is
 * sign-agnostic so a cell wound either way is handled: which side is "up" is
 * the renderer's business and it decides per quad.
 */
function heightIn(part: Part, at: number, x: number, z: number): number | null {
  const { cols, x: px, y: py, z: pz } = part.lattice;
  const perRow = cols - 1;
  const r = (at / perRow) | 0;
  const c = at - r * perRow;
  const i0 = r * cols + c;
  const i1 = i0 + 1;
  const i2 = i0 + cols + 1;
  const i3 = i0 + cols;
  return inTriangle(px, py, pz, i0, i1, i2, x, z)
    ?? inTriangle(px, py, pz, i0, i2, i3, x, z);
}

function inTriangle(
  px: Float64Array, py: Float64Array, pz: Float64Array,
  a: number, b: number, c: number, x: number, z: number,
): number | null {
  const x0 = px[a];
  const z0 = pz[a];
  const dx1 = px[b] - x0;
  const dz1 = pz[b] - z0;
  const dx2 = px[c] - x0;
  const dz2 = pz[c] - z0;
  const det = dx1 * dz2 - dx2 * dz1;
  if (Math.abs(det) < 1e-9) return null;
  const rx = x - x0;
  const rz = z - z0;
  const u = (rx * dz2 - rz * dx2) / det;
  const v = (rz * dx1 - rx * dz1) / det;
  const e = 1e-6;
  if (u < -e || v < -e || u + v > 1 + e) return null;
  return py[a] + (py[b] - py[a]) * u + (py[c] - py[a]) * v;
}
