/**
 * A junction, as one part.
 *
 * The complaint this answers is *"перекрёстки — это отдельные плато"*: a
 * crossing that reads as a separate slab dropped on top of the streets, rather
 * than as the place where they become one surface.
 *
 * It happened because a junction was discovered three times over, from the raw
 * ways, by three modules that clustered at three different tolerances. Here it
 * is built from the network node and from the ports of the streets that reach
 * it — the same ports those streets trimmed themselves back to. So the pad and
 * its arms share their edge by construction, not by agreement.
 *
 * The shape is the union of the arriving carriageways: each arm contributes a
 * mouth, and between two mouths the kerb turns through a corner that reaches
 * **outwards**, because the union of two bands is reflex at the corner. That
 * one fact took 265 folded rings out of 454 to learn, and it is why the fillet
 * is built from the intersection of the two band edges rather than from an
 * inward arc.
 */

import {
  boundsOf, makeLattice, Role, type Part, type Port,
} from '../parts';
import type { RoadClass, Vec2 } from '../types';

/**
 * However the geometry works out, a junction is not half a block wide.
 *
 * Kept from the previous junction builder along with the reason: two streets
 * meeting at a shallow angle overlap for tens of metres, and taken literally
 * that makes the pad as long as the overlap. On a hillside the mouth is then
 * sampled far enough along the street for the street to have climbed several
 * metres, and the pad warps up to meet it.
 */
export const MAX_STOP_M = 15;
export const MAX_STOP_WIDTHS = 3;
/** Below this two arms are too nearly parallel for "how far along" to mean anything. */
const MIN_SIN = 0.34;
/** Two arms closer than this in bearing share one mouth. */
const MERGE_BEARING = 0.45;
/** Points sampled along each rounded corner, endpoints excluded. */
const CORNER_SAMPLES = 3;
/** How far out a corner may reach before it is pulled back in. */
const CORNER_REACH = 2.2;
/**
 * The kerb radius: how tightly the corner of a junction is turned.
 *
 * Not decoration, and not optional. With no radius the mouths of two
 * perpendicular streets stop at exactly the same point and the corner of the
 * pad is a single degenerate vertex — the ring then has five coincident
 * points, the fillet between them is built along a line, and the surface
 * inside folds. Measured before this existed: a 12-33 cm step between the pad
 * and its own arms at every crossroads on the test grid.
 *
 * Real radii run from about 3 m on a residential corner to 12 m where lorries
 * turn, and they scale with the road, so this does too.
 */
const MIN_KERB_RADIUS = 2.5;
const MAX_KERB_RADIUS = 8;

/** The kerb radius a junction of these arms turns its corners at. */
export function kerbRadius(arms: Array<{ half: number }>): number {
  const widest = arms.reduce((m, arm) => Math.max(m, arm.half), 0);
  return Math.max(MIN_KERB_RADIUS, Math.min(MAX_KERB_RADIUS, widest * 0.9));
}

/** Which way a mouth's left-hand edge lies, given the way the arm points. */
function leftOf(dir: Vec2): Vec2 {
  return [dir[1], -dir[0]];
}

/**
 * How far from the node each arm stops — its carriageway, and the paving
 * beside it.
 *
 * An arm has to stop clear of every other arm, and how far clear depends on
 * the angle: crossed square, half the other road's width is enough; crossed at
 * a slant, the far kerb is further down the street than the near one. Computed
 * from the network alone — directions and widths — so it is known before any
 * geometry exists and both builders can be given it.
 *
 * The two numbers are different and both are needed. The carriageways of two
 * streets become one surface — that is what the pad is. What runs *beside*
 * them does not: a pavement carried straight through a crossing runs across
 * the other street's tarmac, which is where "тротуар поперёк дороги" comes
 * from. Measured on the offline city before this: 0.25 % of the built surface
 * was one street's carriageway under another street's pavement.
 *
 * How much further back is worth deriving rather than guessing, because
 * guessing generously takes out eighteen metres of pavement at every
 * crossroads and leaves a bald corner. A point `d` along this arm and `o`
 * across it stands `d·sinθ − o·cosθ` from the crossing street's centreline, so
 * the last of this arm's paving clears that street's carriageway at
 * `d = (half + built·|cosθ|) / sinθ`. Square on, that is just the other
 * street's half-width; at a slant it grows, which is right — a slanted
 * crossing really does have a longer mouth.
 */
export interface ArmStop {
  /** Where the carriageway ends and the junction pad begins. */
  stop: number;
  /** Where the kerb, verge and pavement beside it are interrupted. */
  sideStop: number;
}

export function junctionStops(
  arms: Array<{ dir: Vec2; half: number; built: number }>,
): ArmStop[] {
  const radius = kerbRadius(arms);
  return arms.map((arm, i) => {
    let stop = arm.half;
    let side = arm.built;
    for (let j = 0; j < arms.length; j++) {
      if (j === i) continue;
      const other = arms[j];
      // An arm is pushed back by the arms that *cross* it. The one opposite is
      // the same street carrying on through, and it crosses nothing: counted
      // as a crossing it divides by a sine of zero, and a T-junction on a
      // 6.5 m street came out nineteen metres long — the through street
      // shoving itself out of its own way.
      const gap = bearingGap(arm.dir, other.dir);
      if (gap > Math.PI - MERGE_BEARING || gap < MERGE_BEARING) continue;
      const sin = Math.abs(arm.dir[0] * other.dir[1] - arm.dir[1] * other.dir[0]);
      const cos = Math.abs(arm.dir[0] * other.dir[0] + arm.dir[1] * other.dir[1]);
      const reach = 1 / Math.max(MIN_SIN, sin);
      stop = Math.max(stop, other.half * reach);
      side = Math.max(side, (other.half + arm.built * cos) * reach);
    }
    const cap = Math.min(MAX_STOP_M, arm.half * 2 * MAX_STOP_WIDTHS);
    // The mouth stands one kerb radius back from where the carriageways stop
    // touching, which is where the corner arc leaves the kerb line.
    const carriageway = Math.min(stop, cap) + radius;
    return {
      stop: carriageway,
      sideStop: Math.max(carriageway, Math.min(side, cap * 2) + radius),

    };
  });
}

/**
 * Build the pad.
 *
 * Ring vertices are sorted by their bearing from the node rather than assembled
 * in a hand-chosen order. That is deliberate: choosing the order by hand is
 * exactly what folded the rings before, and a sort cannot fold.
 */
export function buildJunctionPart(
  nodeIndex: number, at: Vec2, ports: Port[], cls: RoadClass,
): Part | null {
  const arms = mergeArms(ports);
  if (arms.length < 3) return null;

  interface RingPoint { p: Vec2; y: number; arm: number; side: number }
  const raw: RingPoint[] = [];
  for (let i = 0; i < arms.length; i++) {
    const arm = arms[i];
    const n = leftOf(arm.dir);
    const mouth: Vec2 = [
      at[0] + arm.dir[0] * arm.stop,
      at[1] + arm.dir[1] * arm.stop,
    ];
    // Three points across the mouth, not two. The middle one carries the
    // street's crown, so the camber runs into the junction instead of stopping
    // at it: with a flat mouth the pad meets a cambered street with a step of
    // the whole crossfall down the centreline — 6.5 cm on a residential street
    // and 11 cm on a secondary one, measured, right where a car drives.
    const edge = arm.y + arm.edgeDy;
    raw.push({ p: [mouth[0] + n[0] * arm.half, mouth[1] + n[1] * arm.half], y: edge, arm: i, side: 1 });
    raw.push({ p: [mouth[0], mouth[1]], y: arm.y, arm: i, side: 0 });
    raw.push({ p: [mouth[0] - n[0] * arm.half, mouth[1] - n[1] * arm.half], y: edge, arm: i, side: -1 });
  }
  raw.sort((a, b) =>
    Math.atan2(a.p[0] - at[0], a.p[1] - at[1]) - Math.atan2(b.p[0] - at[0], b.p[1] - at[1]));

  const ring: Vec2[] = [];
  const ringY: number[] = [];
  const push = (p: Vec2, y: number) => {
    const last = ring[ring.length - 1];
    // Two vertices in the same place are not a shape, they are a crease: the
    // triangle between them has no area and whatever height it interpolates is
    // arbitrary.
    if (last && Math.hypot(last[0] - p[0], last[1] - p[1]) < 0.05) {
      ringY[ringY.length - 1] = (ringY[ringY.length - 1] + y) / 2;
      return;
    }
    ring.push(p);
    ringY.push(y);
  };
  for (let i = 0; i < raw.length; i++) {
    const here = raw[i];
    const next = raw[(i + 1) % raw.length];
    push(here.p, here.y);
    if (next.arm === here.arm) continue;

    // The corner between two different arms: where the two carriageway edges
    // would meet if they ran on, rounded.
    const corner = meet(here.p, arms[here.arm].dir, next.p, arms[next.arm].dir, at);
    if (!corner) continue;
    for (let k = 1; k <= CORNER_SAMPLES; k++) {
      const t = k / (CORNER_SAMPLES + 1);
      const u = 1 - t;
      push([
        u * u * here.p[0] + 2 * u * t * corner[0] + t * t * next.p[0],
        u * u * here.p[1] + 2 * u * t * corner[1] + t * t * next.p[1],
      ], here.y + (next.y - here.y) * t);
    }
  }
  if (ring.length < 3) return null;

  // A fan: the middle at one height, the ring at the heights its own streets
  // arrive at. Flat pads step against every approach on any real slope — half
  // a metre at every mouth, measured on a 1-in-3 hillside.
  const cols = ring.length + 1;
  const lattice = makeLattice(2, cols);
  const centreY = arms.reduce((sum, arm) => sum + arm.y, 0) / arms.length;
  for (let c = 0; c < cols; c++) {
    lattice.x[c] = at[0];
    lattice.z[c] = at[1];
    lattice.y[c] = centreY;
    const r = c % ring.length;
    lattice.x[cols + c] = ring[r][0];
    lattice.z[cols + c] = ring[r][1];
    lattice.y[cols + c] = ringY[r];
  }
  lattice.cell.fill(Role.Junction);

  const part: Part = {
    id: `junction:${nodeIndex}`,
    kind: 'junction',
    lattice,
    ports,
    edge: -1,
    node: nodeIndex,
    road: -1,
    cls,
    elevated: false,
    spine: null,
    marks: [],
    minX: 0, minZ: 0, maxX: 0, maxZ: 0,
  };
  boundsOf(part);
  return part;
}

/**
 * Where two carriageway edges would meet if they ran on.
 *
 * Pulled back when it runs away, which happens whenever two arms leave at a
 * shallow angle: the intersection then sits half a block down the street and
 * the "corner" swallows a house.
 */
function meet(a: Vec2, da: Vec2, b: Vec2, db: Vec2, node: Vec2): Vec2 | null {
  const cross = da[0] * db[1] - da[1] * db[0];
  if (Math.abs(cross) < 1e-4) return null;
  const t = ((b[0] - a[0]) * db[1] - (b[1] - a[1]) * db[0]) / cross;
  const corner: Vec2 = [a[0] + da[0] * t, a[1] + da[1] * t];
  const reach = Math.hypot(corner[0] - node[0], corner[1] - node[1]);
  const limit = Math.max(
    Math.hypot(a[0] - node[0], a[1] - node[1]),
    Math.hypot(b[0] - node[0], b[1] - node[1]),
  ) * CORNER_REACH;
  if (reach <= limit) return corner;
  const k = limit / (reach || 1);
  return [node[0] + (corner[0] - node[0]) * k, node[1] + (corner[1] - node[1]) * k];
}

interface Arm {
  dir: Vec2;
  half: number;
  stop: number;
  y: number;
  edgeDy: number;
}

/**
 * One mouth per direction, not one per way.
 *
 * A dual carriageway, or a street with a service road beside it, arrives twice
 * at almost the same bearing. Given a mouth each, the two mouths overlap and
 * the ring crosses itself. Merged, the wider one decides the mouth and the
 * pad has one opening where a driver sees one opening.
 */
function mergeArms(ports: Port[]): Arm[] {
  const sorted = [...ports].sort((a, b) =>
    Math.atan2(a.dir[0], a.dir[1]) - Math.atan2(b.dir[0], b.dir[1]));
  const out: Arm[] = [];
  for (const port of sorted) {
    const last = out[out.length - 1];
    if (last && bearingGap(last.dir, port.dir) < MERGE_BEARING) {
      if (port.half > last.half) {
        last.dir = port.dir;
        last.half = port.half;
      }
      last.stop = Math.max(last.stop, port.stop);
      last.y = (last.y + port.y) / 2;
      continue;
    }
    out.push({
      dir: port.dir, half: port.half, stop: port.stop,
      y: port.y, edgeDy: port.edgeDy,
    });
  }
  // The list wraps: the last arm may merge into the first.
  if (out.length > 2 && bearingGap(out[0].dir, out[out.length - 1].dir) < MERGE_BEARING) {
    const last = out.pop() as Arm;
    if (last.half > out[0].half) {
      out[0].dir = last.dir;
      out[0].half = last.half;
    }
    out[0].stop = Math.max(out[0].stop, last.stop);
  }
  return out;
}

function bearingGap(a: Vec2, b: Vec2): number {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1]));
  return Math.acos(dot);
}
