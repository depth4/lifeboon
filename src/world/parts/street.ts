/**
 * A stretch of street, as one part.
 *
 * This is the piece the user asked for: *"чтобы её фрагмент был отдельный и
 * читался что пешеходом, что машиной как дорога."* One network edge in, one
 * lattice out — rows along the street, columns across it — and every cell
 * labelled with what it is and what may be done on it.
 *
 * The columns are the cross-section and the lanes together, and that is not a
 * tidiness argument. It means the answer to "how high is the tarmac here",
 * "which lane am I in" and "may I walk here" is one lookup into the same grid
 * the renderer drew from. Before this, those were three separate calculations
 * in three files, and the car drove on a surface that was computed differently
 * from the one you could see.
 *
 * The part stops short of the junction at each end, by exactly the distance
 * the junction's port says. Nothing is drawn twice, so nothing has to be
 * hidden afterwards.
 */

import type { Terrain } from '../../terrain/heightfield';
import {
  gradedHalfWidth, sectionHeightAt, type StreetEdge, type StreetSurface,
} from '../street';
import type { Lane, NetEdge } from '../network';
import { boundsOf, makeLattice, Role, type Part, type Port } from '../parts';
import type { MappedPaths } from '../sidewalks';
import type { Road, Vec2 } from '../types';
import { chainage, pointAt, rowsBetween, tangentAt, valueAt } from './polyline';

/**
 * How far apart the rows of a street lattice are, at most.
 *
 * Every vertex the map drew is kept whatever this is; this only fills in the
 * straights. It matters because the outer edge of the embankment follows the
 * real ground, and ground moves on a scale of tens of metres — a 200 m
 * straight with two rows would tie into the hillside with one straight line
 * and hang over everything between.
 */
const ROW_STEP_M = 8;

/** One column of the cross-section: how far out, and how high above the crown. */
interface Column {
  offset: number;
  /** NaN means "meet the ground here" — the outer edge of the embankment. */
  dy: number;
}

export interface StreetPartInput {
  edge: NetEdge;
  edgeIndex: number;
  road: Road;
  section: StreetEdge[];
  /** Crown height at each point of the edge, on un-graded ground. */
  crown: number[];
  /**
   * The mouths at the two ends, computed once by the placement pass and read
   * by this builder and the junction builder alike. `startPort` sits on
   * `edge.from`, `endPort` on `edge.to`; each says how far in from that end
   * the junction has taken the ground over.
   */
  startPort: Port;
  endPort: Port;
  terrain: Terrain;
  /**
   * Pavements somebody has already surveyed and mapped as ways of their own.
   *
   * A street's section grows a pavement because most towns are not surveyed
   * for them and a street with nothing beside it reads as a runway. Where the
   * map does have one, drawing ours too gives two pavements with a strip of
   * grass between them — "двойной тротуар", and the user saw it. The band
   * keeps its place in the section, because the kerb, the levels and the
   * grading all depend on it; it is simply laid as verge there instead.
   */
  mapped: MappedPaths | null;
}

export function buildStreetPart(input: StreetPartInput): Part | null {
  const { edge, road, section, crown, terrain } = input;
  const chain = chainage(edge.points);
  const total = chain[chain.length - 1];

  // A short edge swallowed by the junctions at both ends contributes nothing:
  // the junction pads already meet. Drawing a sliver there is how you get the
  // slivers of tarmac standing proud of a crossing.
  // The placement pass has already made sure two junctions cannot both claim
  // the whole edge; this is only a floor under arithmetic.
  const from = Math.min(input.startPort.stop, total * 0.49);
  const to = Math.max(total - input.endPort.stop, total * 0.51);
  const stops = rowsBetween(chain, from, to, ROW_STEP_M);
  if (stops.length < 2) return null;

  const { columns, roles, lanes, marks } = crossSection(section, edge, road);
  const spine: { points: Vec2[]; levels: number[] } = { points: [], levels: [] };
  const cols = columns.length;
  const rows = stops.length;
  const lattice = makeLattice(rows, cols);
  const built = gradedHalfWidth(section);

  for (let r = 0; r < rows; r++) {
    const at = stops[r];
    const centre = pointAt(edge.points, chain, at);
    const dir = tangentAt(edge.points, chain, at);
    // z runs south, so this normal points to the left of travel.
    const nx = dir[1];
    const nz = -dir[0];
    const y = valueAt(crown, chain, at);
    // Where the embankment lands: the real ground, but never above the back of
    // the works. This is the shoulder rule as a fact about the part rather
    // than a correction applied to the terrain afterwards.
    const backY = y + sectionHeightAt(section, built);

    spine.points.push(centre);
    spine.levels.push(y);

    for (let c = 0; c < cols; c++) {
      const col = columns[c];
      const px = centre[0] + nx * col.offset;
      const pz = centre[1] + nz * col.offset;
      const i = r * cols + c;
      lattice.x[i] = px;
      lattice.z[i] = pz;
      lattice.y[i] = Number.isNaN(col.dy)
        ? Math.min(terrain.heightAt(px, pz), backY)
        : y + col.dy;
    }
  }

  // Where the paving beside the carriageway is interrupted by a crossing.
  //
  // Suppressed cell by cell rather than by shortening the whole part: the
  // tarmac runs all the way to the junction's mouth, and only what is beside
  // it stops early. Carried through instead, a pavement crosses the other
  // street's carriageway — which is exactly the grass-across-the-main-road
  // that the whole junction machinery was first written to remove.
  const startSide = Math.max(0, input.startPort.sideStop);
  const endSide = Math.max(0, input.endPort.sideStop);
  // Decided per row and per side, not per street, because the coverage is
  // patchy: on the user's own town 66 streets have a mapped footway beside
  // them and only eight are shadowed along more than half their length.
  const reach = built + 3;
  for (let r = 0; r < rows - 1; r++) {
    const mid = (stops[r] + stops[r + 1]) / 2;
    const beside = mid < startSide || total - mid < endSide;
    const i0 = r * cols;
    const i1 = (r + 1) * cols;
    const surveyed = input.mapped && !edge.bridge
      ? [
        input.mapped.covers(
          (lattice.x[i0] + lattice.x[i1]) / 2, (lattice.z[i0] + lattice.z[i1]) / 2, reach),
        input.mapped.covers(
          (lattice.x[i0 + cols - 1] + lattice.x[i1 + cols - 1]) / 2,
          (lattice.z[i0 + cols - 1] + lattice.z[i1 + cols - 1]) / 2, reach),
      ]
      : [false, false];

    for (let c = 0; c < cols - 1; c++) {
      const i = r * (cols - 1) + c;
      let role = roles[c];
      if (beside && role !== Role.Carriageway && role !== Role.Parking) {
        role = Role.None;
      } else if (role === Role.Pavement && surveyed[c < (cols - 1) / 2 ? 0 : 1]) {
        role = Role.Verge;
      }
      lattice.cell[i] = role;
      lattice.lane[i] = lanes[c];
    }
  }

  const part: Part = {
    id: `street:${input.edgeIndex}`,
    kind: road.drivable ? 'street' : 'path',
    lattice,
    ports: [input.startPort, input.endPort],
    edge: input.edgeIndex,
    node: -1,
    road: edge.road,
    cls: edge.cls,
    elevated: edge.bridge,
    spine,
    marks,
    minX: 0, minZ: 0, maxX: 0, maxZ: 0,
  };
  boundsOf(part);
  return part;
}

/**
 * The columns across a street, left to right, and what lies between them.
 *
 * Walking out from the centre the strips are: the traffic lanes, then the
 * channel edge, the vertical face of the kerb, the top of the kerb stone, the
 * verge, the pavement and the embankment. The middle is divided by *lanes*
 * rather than by one span of asphalt, so a car can be asked which lane it is
 * in without a second calculation that might disagree.
 */
function crossSection(
  section: StreetEdge[], edge: NetEdge, road: Road,
): {
  columns: Column[];
  roles: Role[];
  lanes: number[];
  marks: Array<{ col: number; kind: 'centre' | 'divider' }>;
} {
  const half = section[1].offset;
  const outer = section.slice(2);
  const columns: Column[] = [];
  const roles: Role[] = [];
  const lanes: number[] = [];

  // Outside in, on the left.
  for (let i = outer.length - 1; i >= 0; i--) {
    columns.push({ offset: -outer[i].offset, dy: outer[i].dy });
    if (i > 0) {
      roles.push(roleOf(outer[i], outer[i - 1].offset));
      lanes.push(-1);
    }
  }
  if (outer.length > 0) {
    roles.push(roleOf(outer[0], half));
    lanes.push(-1);
  }

  // The carriageway, divided into its lanes.
  const boundaries = laneBoundaries(edge.lanes, half);
  for (let i = 0; i < boundaries.length - 1; i++) {
    const offset = boundaries[i];
    columns.push({ offset, dy: sectionHeightAt(section, offset) });
    const mid = (boundaries[i] + boundaries[i + 1]) / 2;
    const lane = laneAt(edge.lanes, half, mid);
    if (!road.drivable) {
      roles.push(Role.Pavement);
      lanes.push(-1);
    } else if (lane >= 0 && edge.lanes[lane].kind === 'parking') {
      roles.push(Role.Parking);
      lanes.push(lane);
    } else {
      roles.push(Role.Carriageway);
      lanes.push(lane);
    }
  }
  columns.push({ offset: half, dy: sectionHeightAt(section, half) });

  // Inside out, on the right.
  for (let i = 0; i < outer.length; i++) {
    columns.push({ offset: outer[i].offset, dy: outer[i].dy });
    roles.push(roleOf(outer[i], i === 0 ? half : outer[i - 1].offset));
    lanes.push(-1);
  }

  // Paint, from the lanes. A boundary between two lanes carries a line; the
  // edge of the carriageway and the side of a parking lane do not.
  const marks: Array<{ col: number; kind: 'centre' | 'divider' }> = [];
  for (let c = 1; c < roles.length; c++) {
    const left = lanes[c - 1];
    const right = lanes[c];
    if (left < 0 || right < 0 || left === right) continue;
    const a = edge.lanes[left];
    const b = edge.lanes[right];
    if (!a || !b || a.kind !== 'driving' || b.kind !== 'driving') continue;
    marks.push({ col: c, kind: a.forward === b.forward ? 'divider' : 'centre' });
  }

  return { columns, roles, lanes, marks };
}

/**
 * Where the lanes divide the carriageway.
 *
 * The crown is always a boundary even when no lane edge falls there, because
 * the camber peaks at the centreline and a lattice that skips it draws a road
 * with a flat middle and two creases.
 */
function laneBoundaries(lanes: Lane[], half: number): number[] {
  const total = lanes.reduce((sum, lane) => sum + lane.width, 0);
  const out: number[] = [];
  if (lanes.length > 0 && Math.abs(total - half * 2) < 0.5) {
    let offset = -half;
    out.push(offset);
    for (const lane of lanes) {
      offset += lane.width;
      out.push(Math.min(half, offset));
    }
  } else {
    out.push(-half, half);
  }
  if (!out.some((o) => Math.abs(o) < 1e-6)) out.push(0);
  return [...new Set(out)].sort((a, b) => a - b);
}

/** Which lane covers a point across the carriageway, or -1. */
function laneAt(lanes: Lane[], half: number, offset: number): number {
  const total = lanes.reduce((sum, lane) => sum + lane.width, 0);
  if (!lanes.length || Math.abs(total - half * 2) >= 0.5) return -1;
  let edge = -half;
  for (let i = 0; i < lanes.length; i++) {
    edge += lanes[i].width;
    if (offset <= edge) return i;
  }
  return lanes.length - 1;
}

/**
 * What a strip of the cross-section is.
 *
 * The kerb is two strips with one name: a vertical face out of the channel and
 * the flat top of the stone. They are told apart by width, because that is
 * what actually distinguishes them — the face has none.
 */
function roleOf(edge: StreetEdge, innerOffset: number): Role {
  const width = Math.abs(edge.offset - innerOffset);
  const table: Record<StreetSurface, Role> = {
    carriageway: Role.Carriageway,
    kerb: width < 0.02 ? Role.KerbFace : Role.KerbTop,
    verge: Role.Verge,
    pavement: Role.Pavement,
    batter: Role.Batter,
    parapet: Role.Parapet,
    fascia: Role.Fascia,
  };
  return table[edge.surface];
}
