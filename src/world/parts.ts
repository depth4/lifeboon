/**
 * Parts: the functional units the world is actually made of.
 *
 * The user's diagnosis, and it is the same one an outside reviewer arrived at
 * independently: *"сейчас ты строишь всё напрямую из данных, а данные
 * неоптимальны… Надо чтобы дорога как будто имела сетку. Чтобы её фрагмент был
 * отдельный и читался что пешеходом, что машиной как дорога. И также с домами,
 * столбами, тротуарами. Всё это функциональные единицы."*
 *
 * That is what this file is. Until now a road was a polyline that three
 * different modules each turned into something: the renderer swept a
 * cross-section along it, the car looked up a hash of loose segments, the
 * pedestrian graph welded its points. Three readings of one line, disagreeing
 * with each other, and every recurring bug lived in the gaps between them.
 *
 * A **part** is one piece of world with one owner. It knows the ground it
 * stands on, cell by cell, and it knows what may be done on each cell. The
 * renderer draws those cells. The car asks the same cells what is under its
 * wheels. A pedestrian asks the same cells whether they may walk there. There
 * is no second opinion to disagree with, because there is no second
 * representation.
 *
 * The grid inside a part is the whole point — *"надо чтобы дорога как будто
 * имела сетку"*. A street part is a lattice: rows running along the street,
 * columns running across it. The columns are not decoration, they are the
 * cross-section and the lanes — kerb, verge, pavement on the outside, one
 * column per traffic lane in the middle. So "which lane am I in" and "how high
 * is the tarmac here" are the same lookup, and it returns exactly the vertex
 * the renderer drew.
 *
 * Parts connect through **ports**: a mouth at a network node, with a width and
 * a heading. A junction part is built from the ports of the streets that reach
 * it, and those streets are trimmed back to their ports. That is the whole
 * mechanism for *"соединять как пути видом сверху, как в симуляторе"* — and it
 * is why two parts cannot pave the same square metre: the junction owns its
 * pad, the street stops at the edge of it.
 *
 * See `docs/PARTS.md` for the architecture and `world/parts/` for the builders.
 */

import type { RoadClass, Vec2 } from './types';

/* ----------------------------------------------------------------- roles */

/**
 * What one cell of a part is.
 *
 * Deliberately a short list of *things a person would name*, not a list of
 * materials: the material and the colour come from the role, but so does what
 * you may do there, and those two have to stay in step. A verge is grass you
 * can walk across; a batter is the embankment tying the works back into the
 * hillside and nobody walks on it on purpose.
 */
export const enum Role {
  /** No surface here. A hole in the lattice — a suppressed pavement, say. */
  None = 0,
  /** Asphalt a car drives on. */
  Carriageway = 1,
  /** Asphalt a car stands on: the kerbside parking lane. */
  Parking = 2,
  /** The vertical face of the kerb stone, out of the channel. */
  KerbFace = 3,
  /** The flat top of the kerb stone. */
  KerbTop = 4,
  /** Grass between the kerb and the pavement. */
  Verge = 5,
  /** Paving people walk on. */
  Pavement = 6,
  /** Asphalt inside a junction, where two streets' surfaces are one surface. */
  Junction = 7,
  /** A marked crossing: cars drive over it, people walk over it. */
  Crossing = 8,
  /** The embankment from the back of the works down to untouched ground. */
  Batter = 9,
  /** A bridge parapet: the wall you would otherwise fall over. */
  Parapet = 10,
  /** The outside of a bridge structure below the deck. */
  Fascia = 11,
}

export const ROLE_COUNT = 12;

/** What may be done on a cell. A bitmask, because a crossing is two things. */
export const enum Can {
  Nothing = 0,
  Drive = 1,
  Walk = 2,
  Park = 4,
  /** Paved: the ground beneath may be cut away, and nothing grows here. */
  Paved = 8,
}

/**
 * What each role affords.
 *
 * This table is the single answer to a question that used to have four: which
 * square metre is covered by what, and what does that mean. A car reads
 * `Drive`, a pedestrian reads `Walk`, the ground reads `Paved` to decide
 * whether to cut itself away, and props read `Paved` to decide not to plant a
 * tree there.
 */
const AFFORDS: readonly number[] = (() => {
  const a = new Array<number>(ROLE_COUNT).fill(Can.Nothing);
  a[Role.Carriageway] = Can.Drive | Can.Paved;
  a[Role.Parking] = Can.Drive | Can.Park | Can.Paved;
  // You can step onto a kerb, and people do; you cannot drive along one.
  a[Role.KerbFace] = Can.Paved;
  a[Role.KerbTop] = Can.Walk | Can.Paved;
  // Grass is walkable and is emphatically not paved: it is where trees go.
  a[Role.Verge] = Can.Walk;
  a[Role.Pavement] = Can.Walk | Can.Paved;
  a[Role.Junction] = Can.Drive | Can.Paved;
  a[Role.Crossing] = Can.Drive | Can.Walk | Can.Paved;
  a[Role.Batter] = Can.Nothing;
  a[Role.Parapet] = Can.Nothing;
  a[Role.Fascia] = Can.Nothing;
  return a;
})();

export function affords(role: Role): number {
  return AFFORDS[role] ?? Can.Nothing;
}

export const ROLE_NAMES: readonly string[] = [
  'none', 'carriageway', 'parking', 'kerb face', 'kerb top', 'verge',
  'pavement', 'junction', 'crossing', 'batter', 'parapet', 'fascia',
];

/* --------------------------------------------------------------- lattice */

/**
 * A part's own grid.
 *
 * `rows` run along the part, `cols` across it. Vertices are stored in world
 * metres — no local frame, no transform, because a part is placed once and
 * never moves, and a transform is one more thing that can disagree with the
 * picture.
 *
 * Cells are `(rows - 1) × (cols - 1)`. Each carries a role and, where it is
 * part of the carriageway, the index of the lane it belongs to. A zero-width
 * cell is legal and normal: the vertical face of a kerb is exactly that, two
 * columns at the same offset and different heights.
 */
export interface Lattice {
  rows: number;
  cols: number;
  /** Vertex positions, row-major: index = row * cols + col. */
  x: Float64Array;
  y: Float64Array;
  z: Float64Array;
  /** Role per cell, row-major: index = row * (cols - 1) + col. */
  cell: Uint8Array;
  /** Lane index per cell, or -1. Same indexing as `cell`. */
  lane: Int8Array;
}

export function makeLattice(rows: number, cols: number): Lattice {
  const n = rows * cols;
  const cells = Math.max(0, (rows - 1) * (cols - 1));
  return {
    rows,
    cols,
    x: new Float64Array(n),
    y: new Float64Array(n),
    z: new Float64Array(n),
    cell: new Uint8Array(cells),
    lane: new Int8Array(cells).fill(-1),
  };
}

/* ------------------------------------------------------------------ part */

export type PartKind = 'street' | 'junction' | 'path';

/**
 * Where one part meets another.
 *
 * A port is a mouth: a point, an outward heading and a half-width, sitting on
 * a network node. The junction builder reads the ports of everything that
 * arrives; the street builder trims itself back to its own port. Both read the
 * same numbers, so the seam is exact rather than approximately right — which
 * is the difference between a junction that reads as one surface and the
 * "separate plateau" the user has been looking at.
 */
export interface Port {
  /** Network node this mouth stands on. */
  node: number;
  /** Centre of the mouth. */
  at: Vec2;
  /** Unit heading, pointing out of the junction and along the street. */
  dir: Vec2;
  /** Half the carriageway. */
  half: number;
  /** Surface height at the centre of the mouth: the crown of the street. */
  y: number;
  /**
   * How far the channel at the edge of the carriageway falls below the crown.
   *
   * A junction has to meet the street at the *edge* of the carriageway, not at
   * its middle, and a cambered street is a couple of centimetres lower there.
   * Two centimetres is not a rounding error at this scale — it is the kind of
   * step that catches the light along a whole kerb line.
   */
  edgeDy: number;
  /** How far the mouth is from the node, along the street. */
  stop: number;
  /**
   * How far back the kerb, verge and pavement beside the carriageway stop.
   *
   * Always at least `stop`, usually more: the tarmac of two streets becomes
   * one surface at a crossing, but what runs beside them does not, and a
   * pavement carried through would lie across the other street's carriageway.
   */
  sideStop: number;
  /** Gradient at which the street climbs away from the mouth. */
  slope: number;
}

export interface Part {
  id: string;
  kind: PartKind;
  lattice: Lattice;
  /** Ports at the ends of a street, or one per arm of a junction. */
  ports: Port[];
  /** Network edge this came from, or -1. */
  edge: number;
  /** Network node this came from, or -1. */
  node: number;
  /** OSM way, for name and tags. -1 when the part is not from one way. */
  road: number;
  /** What kind of road this is, for colour and for the rules of the road. */
  cls: RoadClass;
  /** Set for a deck: it stands above the earth and must not be graded into it. */
  elevated: boolean;
  /**
   * For a street: the centreline it was swept along, row by row, and the crown
   * height at each row.
   *
   * Kept because the earth has to be cut to *this* line, not to the way the
   * map drew — the part may have been trimmed back at both ends, and cutting
   * the untrimmed way would dig a trench through the junction that took the
   * ground over.
   */
  spine: { points: Vec2[]; levels: number[] } | null;
  /**
   * Where paint goes: the columns of the lattice that are a line on the road.
   *
   * Markings come out of the lane model rather than being drawn down the
   * middle of a way and hoped for. A boundary between two lanes running
   * opposite ways is the centre line; between two going the same way it is a
   * lane divider; against a parking lane it is nothing, because there is no
   * line there in the real street either.
   */
  marks: Array<{ col: number; kind: 'centre' | 'divider' }>;
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
}

export function boundsOf(part: Part): void {
  const { x, z } = part.lattice;
  let minX = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxZ = -Infinity;
  for (let i = 0; i < x.length; i++) {
    if (x[i] < minX) minX = x[i];
    if (x[i] > maxX) maxX = x[i];
    if (z[i] < minZ) minZ = z[i];
    if (z[i] > maxZ) maxZ = z[i];
  }
  part.minX = minX;
  part.minZ = minZ;
  part.maxX = maxX;
  part.maxZ = maxZ;
}
