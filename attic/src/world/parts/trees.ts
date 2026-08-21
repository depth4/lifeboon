/**
 * Where street trees stand.
 *
 * A tree in a verge is a fact about the part it stands on, not about how the
 * part is drawn — it is a thing with a place, which the ground has to carry
 * and a pedestrian has to walk round. So it is decided here, with the rest of
 * the placement, and the renderer only instances what it is given. It also
 * means the count can be measured from Node, which matters: an instanced
 * canopy costs its triangle count once per tree, and `CLAUDE.md` records
 * 6 600 trees costing 3.6 M triangles — more than the rest of the city put
 * together.
 */

import { Role, type Part } from '../parts';

export interface TreeSpot {
  x: number;
  z: number;
  scale: number;
}

/**
 * How far apart street trees stand, before the jitter.
 *
 * Kept from the renderer this replaces, along with the two rules that go with
 * it and are not decoration: a tree goes on **one** side, chosen at random,
 * and not every gap gets one. Planted on both sides at a fixed interval the
 * street reads as wallpaper — and it is twice as many trees. Measured on the
 * offline city: 6 480 the naive way against about 2 900 this way.
 */
const TREE_SPACING_M = 13;
/** How much of the spacing is randomised, either way. */
const TREE_JITTER = 0.25;
/** Share of the gaps left empty, so the planting is not a grid. */
const TREE_SKIP = 0.22;

/**
 * Plant the verges.
 *
 * Walked along the part by real distance, not by lattice row: rows are eight
 * metres apart on a straight and centimetres round a bend, so counting rows
 * plants an avenue on one and a thicket on the other.
 *
 * A tree only goes where the verge really is — the cell is checked, so nothing
 * is planted in the gap where the paving stops for a crossing, and nothing is
 * planted on a street whose verge was turned to pavement.
 */
export function plantTrees(part: Part, along: Float64Array, out: TreeSpot[]): void {
  if (part.kind === 'junction') return;
  const { rows, cols, x, z, cell } = part.lattice;
  const total = along[rows - 1];
  // Seeded from the part, so the same city plants the same trees every time.
  let seed = (part.edge * 2654435761) >>> 0;
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  let at = TREE_SPACING_M * rand();
  let r = 0;
  while (at < total) {
    while (r < rows - 2 && along[r + 1] <= at) r++;
    if (rand() > TREE_SKIP) {
      const c = vergeColumn(cell, r, cols, rand() < 0.5);
      if (c >= 0) {
        const i0 = r * cols + c;
        const i2 = i0 + cols + 1;
        out.push({
          x: (x[i0] + x[i2]) / 2,
          z: (z[i0] + z[i2]) / 2,
          scale: 0.85 + rand() * 0.5,
        });
      }
    }
    at += TREE_SPACING_M * (1 - TREE_JITTER + rand() * TREE_JITTER * 2);
  }
}

/** The verge cell on one side of a row, or -1 if that side has none here. */
function vergeColumn(cell: Uint8Array, r: number, cols: number, left: boolean): number {
  const base = r * (cols - 1);
  for (let i = 0; i < cols - 1; i++) {
    const c = left ? i : cols - 2 - i;
    if (cell[base + c] === Role.Verge) return c;
  }
  return -1;
}
