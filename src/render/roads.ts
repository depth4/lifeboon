/**
 * Road geometry.
 *
 * A street is built from its cross-section (see world/street.ts), not from a
 * stack of flat ribbons. The section is a list of edges walking out from the
 * crown — channel, kerb face, kerb top, verge, pavement, embankment — and each
 * one is swept along the centreline into a rail. Neighbouring rails share
 * their vertices exactly, so the whole street is one closed surface: there is
 * no seam to crack open and no pair of surfaces competing for the same pixels.
 *
 * That is the difference from what stood here before. Previously the
 * carriageway, the pavement and the markings were three separate flat sheets
 * floating at 0.28, 0.38 and 0.31 metres, and those numbers existed purely to
 * keep them out of each other's depth range. The kerb was a dark stripe
 * painted at pavement level. Now the kerb is a real 15 cm step with a vertical
 * face that catches the sun, the verge is genuinely lower than the paving
 * beside it, and the earth underneath has been cut to carry all of it
 * (terrain/heightfield.ts, `gradeStreets`).
 */

import * as THREE from 'three';
import type { Railway, Road, RoadClass, Vec2 } from '../world/types';
import type { Terrain } from '../terrain/heightfield';
import {
  ROAD_SURFACE_Y,
  bridgeProfile,
  gradedProfile,
  isUnderground,
  roadSurfaceProfile,
  type RoadProfiles,
} from '../world/roadprofile';
import {
  gradedHalfWidth, streetSection, type StreetEdge, type StreetNorm, type StreetSurface,
} from '../world/street';
import {
  inSpans, spanCuts, spansFor, spansFromJunctions, splitAt,
  type JunctionShape,
} from '../world/junctions';
import { asphaltTexture, groundTexture, pavingTexture } from './textures';
import { MappedPaths } from '../world/sidewalks';
import { GroundClaim } from './claims';
import type { OcclusionField } from './occlusion';
import type { StreetMask } from './streetmask';
import {
  KERB_FACE, KERB_TOP, MOWN_VERGE, PAVING, TURF, tintGround, tintHard,
} from './palette';

/**
 * Where the drawn surfaces sit.
 *
 * The carriageway height lives in world/roadprofile.ts, because the simulation
 * needs it too — a car has to sit on the deck that was drawn. Everything
 * across the width of the street now comes from the cross-section instead of
 * from constants here; the only survivor is the paint, which is 3 cm of
 * thermoplastic on top of the asphalt and really is just a number.
 */
const SURFACE_Y = ROAD_SURFACE_Y;
const MARKING_Y = SURFACE_Y + 0.03;

const SURFACE_COLOR: Record<RoadClass, number> = {
  motorway: 0x4a4a4e,
  trunk: 0x4c4c50,
  primary: 0x4f4f53,
  secondary: 0x515155,
  tertiary: 0x535357,
  residential: 0x565659,
  service: 0x5a5a5c,
  pedestrian: 0x8c8378,
  footway: 0x8f867a,
  cycleway: 0x6b6a63,
  steps: 0x8a8178,
  track: 0x77705f,
};


export interface RoadMeshes {
  group: THREE.Group;
  /** Where a street tree stands, in the verge, clear of every junction. */
  treeSpots: Array<{ x: number; z: number; scale: number }>;
  dispose(): void;
}

/**
 * Offset a polyline to both sides by `half`, mitring at each interior vertex.
 * Returns left and right edge point lists of the same length as `points`.
 */
export function offsetPolyline(points: Vec2[], half: number): { left: Vec2[]; right: Vec2[] } {
  const n = points.length;
  const left: Vec2[] = new Array(n);
  const right: Vec2[] = new Array(n);

  const dirs: Vec2[] = new Array(Math.max(0, n - 1));
  for (let i = 0; i < n - 1; i++) {
    const dx = points[i + 1][0] - points[i][0];
    const dz = points[i + 1][1] - points[i][1];
    const len = Math.hypot(dx, dz) || 1;
    dirs[i] = [dx / len, dz / len];
  }

  for (let i = 0; i < n; i++) {
    const dIn = dirs[Math.max(0, i - 1)] ?? [1, 0];
    const dOut = dirs[Math.min(dirs.length - 1, i)] ?? dIn;
    // Perpendiculars (right-hand side of travel).
    const pIn: Vec2 = [dIn[1], -dIn[0]];
    const pOut: Vec2 = [dOut[1], -dOut[0]];
    let mx = pIn[0] + pOut[0];
    let mz = pIn[1] + pOut[1];
    const mLen = Math.hypot(mx, mz);
    if (mLen < 1e-4) {
      // A hairpin; fall back to the incoming perpendicular.
      mx = pIn[0];
      mz = pIn[1];
    } else {
      mx /= mLen;
      mz /= mLen;
    }
    // Lengthen the mitre so the ribbon keeps its width through the corner.
    //
    // The clamp has to be in metres, not as a ratio. A ratio of 2.5 is a
    // reasonable 5 m on the edge of a carriageway and an absurd 13 m on a
    // bridge parapet five metres out — which is exactly the arrowhead that
    // grew out of every sharp bend on a bridge. Capping the *extension*
    // instead pinches a hard corner slightly and never spikes.
    const cos = mx * pIn[0] + mz * pIn[1];
    const maxExtra = 1.6;
    const scale = Math.min(
      1 + maxExtra / Math.max(Math.abs(half), 0.2),
      1 / Math.max(0.35, cos),
    );
    const ox = mx * half * scale;
    const oz = mz * half * scale;
    right[i] = [points[i][0] + ox, points[i][1] + oz];
    left[i] = [points[i][0] - ox, points[i][1] - oz];
  }
  return { left, right };
}

/**
 * Emit a ribbon between two edge lists.
 *
 * `heights` carries one ground level per polyline vertex, so the ribbon
 * follows the terrain lengthwise while staying level across its width — which
 * is how a carriageway is actually built. A single scalar height would make
 * every road on a hillside either float or bury itself.
 */
export function emitRibbon(
  left: Vec2[],
  right: Vec2[],
  heights: number[],
  color: THREE.Color,
  pos: number[],
  uv: number[],
  col: number[],
  uvScale: number,
): void {
  let travelled = 0;
  for (let i = 0; i < left.length - 1; i++) {
    const l0 = left[i], r0 = right[i], l1 = left[i + 1], r1 = right[i + 1];
    const y0 = heights[i];
    const y1 = heights[i + 1];
    const segLen = Math.hypot(l1[0] - l0[0], l1[1] - l0[1]);
    const v0 = travelled / uvScale;
    const v1 = (travelled + segLen) / uvScale;
    travelled += segLen;

    // Two triangles wound (left, right-ahead, right) so the face points up.
    // Getting this backwards makes every road vanish under backface culling.
    pos.push(
      l0[0], y0, l0[1], r1[0], y1, r1[1], r0[0], y0, r0[1],
      l0[0], y0, l0[1], l1[0], y1, l1[1], r1[0], y1, r1[1],
    );
    uv.push(0, v0, 1, v1, 1, v0, 0, v0, 0, v1, 1, v1);
    for (let k = 0; k < 6; k++) col.push(color.r, color.g, color.b);
  }
}

/** Shift a whole profile up, for pavements and markings sitting on the road. */
function raise(profile: number[], by: number): number[] {
  return profile.map((h) => h + by);
}

/**
 * One edge of the cross-section swept along the street: a polyline with a
 * height for every point. Two neighbouring rails bound one strip of surface.
 */
interface Rail {
  pts: Vec2[];
  y: number[];
}

/**
 * Emit the strip between two rails.
 *
 * `a` must be the rail on the left-hand side of travel and `b` the one on the
 * right, because the winding below assumes it. Hand them over the wrong way
 * round and every triangle comes out face-down, which backface culling then
 * hides completely — that has happened twice in this file's history, once for
 * road ribbons and once for pavements.
 */
function emitStrip(
  a: Rail,
  b: Rail,
  colorA: THREE.Color,
  colorB: THREE.Color,
  soft: boolean,
  occlusion: OcclusionField | null,
  pos: number[],
  uv: number[],
  col: number[],
  uvScale: number,
  /** Distance across the street, in metres, at each rail. */
  acrossA: number,
  acrossB: number,
  skip: boolean[] | null = null,
): void {
  let travelled = 0;
  const n = Math.min(a.pts.length, b.pts.length);

  // Six vertices per quad, each needing its own colour: which rail it came
  // from decides the base tone, and where it is in the world decides the
  // variation. A strip painted one flat value is what made a verge read as a
  // stripe of paint rather than as the ground it is cut from.
  const push = (x: number, z: number, base: THREE.Color) => {
    STRIP_TINT.copy(base);
    const ao = occlusion?.at(x, z) ?? 0;
    if (soft) tintGround(STRIP_TINT, x, z, ao);
    else tintHard(STRIP_TINT, x, z, ao);
    col.push(STRIP_TINT.r, STRIP_TINT.g, STRIP_TINT.b);
  };

  for (let i = 0; i < n - 1; i++) {
    const a0 = a.pts[i], a1 = a.pts[i + 1];
    const b0 = b.pts[i], b1 = b.pts[i + 1];
    const ay0 = a.y[i], ay1 = a.y[i + 1];
    const by0 = b.y[i], by1 = b.y[i + 1];

    const segLen = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]);
    const v0 = travelled / uvScale;
    const v1 = (travelled + segLen) / uvScale;
    travelled += segLen;
    // The texture still advances across a skipped stretch, so paving picks up
    // on the far side of a junction where it left off rather than restarting.
    if (skip?.[i]) continue;

    pos.push(
      a0[0], ay0, a0[1], b1[0], by1, b1[1], b0[0], by0, b0[1],
      a0[0], ay0, a0[1], a1[0], ay1, a1[1], b1[0], by1, b1[1],
    );
    // Both axes in metres. Writing 0..1 across the strip instead — which is
    // what this did — stretched one texture tile over the whole width of the
    // carriageway and squeezed it into the 15 cm of a kerb face, so asphalt
    // had no grain at any distance and paving had no scale at all.
    const u0 = acrossA / uvScale;
    const u1 = acrossB / uvScale;
    uv.push(u0, v0, u1, v1, u1, v0, u0, v0, u0, v1, u1, v1);
    push(a0[0], a0[1], colorA);
    push(b1[0], b1[1], colorB);
    push(b0[0], b0[1], colorB);
    push(a0[0], a0[1], colorA);
    push(a1[0], a1[1], colorA);
    push(b1[0], b1[1], colorB);
  }
}

const STRIP_TINT = new THREE.Color();

/**
 * How far below the ground a cut end is carried before it stops.
 *
 * The wall only has to reach the earth; going further costs six triangles and
 * buys immunity. The earth under a street is graded, but a junction pad, a
 * neighbouring street's shoulder or a carved riverbank can all put it lower
 * than this end expected, and a wall that stops short is a hole you can see
 * the sky through. Buried surplus is invisible; missing surplus is a bug.
 */
const SKIRT_DEPTH_M = 0.6;

/**
 * Slope of the wedge that brings the earth up to a cut end, as run over rise.
 *
 * Three to one. The point is not the exact number, it is that there is a
 * number at all: a pavement that stops dead, drops 20 cm at a right angle and
 * then becomes grass is the single thing that reads most loudly as "this was
 * generated". Earth does not do that. It banks up to whatever it meets.
 */
const END_BATTER_RUN = 3;
const END_BATTER_MIN_M = 0.6;
const END_BATTER_MAX_M = 4;

/**
 * Which surfaces get the wedge, and which are allowed to stop dead.
 *
 * A kerb is a vertical stone and a carriageway edge is a made edge — both may
 * end square, and the carriageway *must*, because a wedge at the mouth of a
 * junction is a 12 cm dip you drive into. Everything that is earth, or that
 * earth has to meet, gets the slope.
 */
const TAPERED_END: ReadonlySet<StreetSurface> = new Set<StreetSurface>([
  'verge', 'pavement', 'batter',
]);

/** One end of one drawn run: which vertex, and which way is "outwards". */
interface RunEnd {
  at: number;
  /** +1 when the road lies behind this vertex, -1 when it lies ahead. */
  out: number;
}

/**
 * Close the end of a strip so the world does not show through it.
 *
 * A street is a surface swept along a line — a roof over the ground, tied down
 * at both sides by its embankment. Along its length it was tied down nowhere:
 * where the sweep stopped, at a junction or at the end of a way, the roof
 * ended and left its whole cross-section open. From a low angle that is a
 * ledge with daylight under it.
 *
 * Two pieces, and which you get depends on what is ending. `TAPERED_END`
 * surfaces get a wedge of earth banking up to them, then a wall from the foot
 * of that wedge down under the ground. Everything else gets the wall alone.
 * The wall is what makes this safe rather than merely tidy: it is emitted
 * unconditionally, including at the thousands of places where one OSM way
 * simply continues into the next, because there it lands inside the next way's
 * structure and is never seen. Deciding which ends are "real" would need the
 * whole connectivity graph and would be wrong the first time a way was tagged
 * oddly. A buried wall costs nothing and cannot be wrong.
 *
 * Both facings are emitted. The geometry is unindexed, so every triangle keeps
 * its own normal and neither side comes out black — and a face that turns out
 * to be visible from the side nobody predicted is exactly the failure this
 * exists to prevent.
 */
function emitEndFill(
  inner: Rail,
  outer: Rail,
  end: RunEnd,
  tangent: Vec2,
  terrain: Terrain,
  taper: boolean,
  faceColor: THREE.Color,
  earthColor: THREE.Color,
  face: { pos: number[]; uv: number[]; col: number[] },
  earth: { pos: number[]; uv: number[]; col: number[] },
): void {
  const { at } = end;
  if (at < 0 || at >= inner.pts.length || at >= outer.pts.length) return;

  let p0 = inner.pts[at];
  let p1 = outer.pts[at];
  let y0 = inner.y[at];
  let y1 = outer.y[at];
  const across = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  if (across < 1e-6) return;

  if (taper) {
    // How far the earth has to climb to reach this edge decides how far back
    // it starts climbing, so a kerb-height lip gets a short wedge and a road
    // on an embankment gets a long one.
    const drop = Math.max(
      y0 - terrain.heightAt(p0[0], p0[1]),
      y1 - terrain.heightAt(p1[0], p1[1]),
    );
    const run = Math.min(END_BATTER_MAX_M,
      Math.max(END_BATTER_MIN_M, Math.max(0, drop) * END_BATTER_RUN));
    const ox = tangent[0] * end.out * run;
    const oz = tangent[1] * end.out * run;

    const q0: Vec2 = [p0[0] + ox, p0[1] + oz];
    const q1: Vec2 = [p1[0] + ox, p1[1] + oz];
    const g0 = terrain.heightAt(q0[0], q0[1]);
    const g1 = terrain.heightAt(q1[0], q1[1]);

    quadBothWays(
      [p0[0], y0, p0[1]], [p1[0], y1, p1[1]],
      [q1[0], Math.min(g1, y1), q1[1]], [q0[0], Math.min(g0, y0), q0[1]],
      across, run, earthColor, earth, true,
    );

    // The wedge lands on the ground it was measured against; the wall below
    // carries on from there in case that ground is not where it was measured.
    p0 = q0; p1 = q1;
    y0 = Math.min(g0, y0); y1 = Math.min(g1, y1);
  }

  const foot = Math.min(
    terrain.heightAt(p0[0], p0[1]), terrain.heightAt(p1[0], p1[1]), y0, y1,
  ) - SKIRT_DEPTH_M;

  quadBothWays(
    [p0[0], y0, p0[1]], [p1[0], y1, p1[1]],
    [p1[0], foot, p1[1]], [p0[0], foot, p0[1]],
    across, Math.max(y0, y1) - foot, faceColor, face, false,
  );
}

/**
 * A quad emitted with both facings, so no end fill can ever be the invisible
 * side of a triangle. Winding here is not worth being clever about: this is
 * geometry nobody should notice, and the failure mode of getting it wrong is
 * a hole in the world.
 */
function quadBothWays(
  a: number[], b: number[], c: number[], d: number[],
  uSpan: number, vSpan: number,
  color: THREE.Color, out: { pos: number[]; uv: number[]; col: number[] },
  soft: boolean,
): void {
  const corners = [a, b, c, d];
  const uvs = [[0, 0], [uSpan, 0], [uSpan, vSpan], [0, vSpan]];
  const push = (i: number) => {
    const v = corners[i];
    out.pos.push(v[0], v[1], v[2]);
    out.uv.push(uvs[i][0], uvs[i][1]);
    STRIP_TINT.copy(color);
    if (soft) tintGround(STRIP_TINT, v[0], v[2], 0.25);
    else tintHard(STRIP_TINT, v[0], v[2], 0.3);
    out.col.push(STRIP_TINT.r, STRIP_TINT.g, STRIP_TINT.b);
  };
  for (const i of [0, 1, 2, 0, 2, 3]) push(i);
  for (const i of [0, 2, 1, 0, 3, 2]) push(i);
}

/** Two skip lists at once: a segment is skipped when either says so. */
function combine(a: boolean[] | null, b: boolean[] | null): boolean[] | null {
  if (!a) return b;
  if (!b) return a;
  return a.map((v, i) => v || b[i]);
}

/** The complement of a skip list. */
function invert(a: boolean[] | null): boolean[] | null {
  return a ? a.map((v) => !v) : null;
}

/**
 * Where the pavement band is laid as paving and where it is laid as grass.
 *
 * One function because the two are complements, and getting them the wrong way
 * round is not a subtle failure: it draws our pavement *only* where somebody
 * has already mapped one and turns it to grass everywhere else, which is a
 * doubled pavement here and a missing pavement there — both of the things the
 * user reported, from one swapped argument. It shipped like that once. The
 * only way to make that unrepeatable is to have a single place that decides,
 * with a name that says which is which, and a test on it.
 */
export function pavementBands(
  interrupted: boolean[] | null,
  shadowed: boolean[],
): { paving: boolean[] | null; verge: boolean[] | null } {
  return {
    // Paving is not laid where a surveyed footway already runs.
    paving: combine(interrupted, shadowed),
    // Grass takes exactly the stretches the paving gave up.
    verge: combine(interrupted, invert(shadowed)),
  };
}

/** Which way the way runs at a run end, as a unit vector along the centreline. */
function tangentAt(points: Vec2[], end: RunEnd): Vec2 {
  const i = end.out > 0 ? end.at - 1 : end.at;
  const a = points[Math.max(0, Math.min(points.length - 2, i))];
  const b = points[Math.max(1, Math.min(points.length - 1, i + 1))];
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const len = Math.hypot(dx, dz) || 1;
  return [dx / len, dz / len];
}

/**
 * The stations where a drawn run begins or ends.
 *
 * `skip` marks segments, not vertices, so a run of drawn segments [i0..i1]
 * needs closing at vertex i0 and at vertex i1 + 1. With no interruptions at
 * all that is simply the two ends of the way.
 */
function runEnds(vertices: number, skip: boolean[] | null): RunEnd[] {
  const out: RunEnd[] = [];
  const segments = vertices - 1;
  if (segments < 1) return out;
  for (let i = 0; i < segments; i++) {
    if (skip?.[i]) continue;
    // The road runs forward from here, so outwards is backwards.
    if (i === 0 || skip?.[i - 1]) out.push({ at: i, out: -1 });
    if (i === segments - 1 || skip?.[i + 1]) out.push({ at: i + 1, out: 1 });
  }
  return out;
}

type Buckets = Record<Bucket, { pos: number[]; uv: number[]; col: number[] }>;

/**
 * Draw a junction as one surface.
 *
 * The roadway is the ring, filled at the single height every street here
 * agreed on. Round the outside of it, on every stretch of boundary that is not
 * the mouth of a street, runs the same cross-section a street has: a kerb
 * standing proud of the asphalt, its flat top, a pavement behind it, and then
 * earth banking up to meet all of that. Which is why a crossing now reads as
 * one place rather than as two roads that happen to overlap — the corners are
 * built, not left as whatever the ground happened to be doing.
 *
 * Nothing here intersects anything with anything. Every point is constructed
 * from a direction and a width, which is the only way this survives real map
 * data: three streets meeting at four degrees, a way that doubles back on
 * itself, two nodes a centimetre apart.
 */
function emitJunction(
  shape: JunctionShape,
  roads: Road[],
  norm: StreetNorm,
  terrain: Terrain,
  buckets: Buckets,
  occlusion: OcclusionField | null,
): void {
  const ring = shape.ring;
  if (ring.length < 3) return;

  // The widest street decides how the junction is finished, the same way it
  // decides the height: a crossroads of a main road and a lane gets the main
  // road's pavement round it.
  let cls: RoadClass = 'residential';
  let widest = -1;
  for (const a of shape.approaches) {
    if (a.half > widest) {
      widest = a.half;
      cls = roads[a.road].cls;
    }
  }

  const reveal = norm.kerbReveal;
  const pave = norm.pavement[cls];
  // Every vertex of the ring has its own height: the mouths sit where their
  // streets actually arrive, the corners ease between them, and the middle is
  // the level they were all levelled to. A flat junction meets a street
  // climbing away from it in a step the size of that climb.
  const ringY = shape.ringY.length === ring.length
    ? shape.ringY : ring.map(() => shape.height);

  // --- the roadway ---------------------------------------------------------
  const [crownColor, edgeColor] = stripColors('carriageway', cls, false);
  const asphalt = buckets.asphalt;
  const uvScale = UV_SCALE.carriageway;
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    const a = ring[i];
    const b = ring[j];
    emitFace(
      [[shape.x, shape.height, shape.z], [a[0], ringY[i], a[1]], [b[0], ringY[j], b[1]]],
      [crownColor, edgeColor, edgeColor],
      false, occlusion, asphalt, uvScale,
    );
  }

  // --- kerb, pavement and the earth behind them ---------------------------
  const [kerbFaceIn, kerbFaceOut] = stripColors('kerb', cls, true);
  const [kerbTopIn, kerbTopOut] = stripColors('kerb', cls, false);
  const [paveIn, paveOut] = stripColors('pavement', cls, false);
  const [, earth] = stripColors('batter', cls, false);

  /**
   * Which way is "outwards" at each vertex of the boundary, mitred.
   *
   * Three attempts, and the reasons both earlier ones failed are the reason
   * this one is per *vertex*:
   *
   * - Radial from the middle collapses to a spike wherever the boundary runs
   *   straight out from the centre, which it does at the ends of every kerb
   *   fillet. Those spikes were the torn grey shapes in every junction corner.
   * Mitring the offset at each vertex instead was tried and measured worse —
   * a tight corner needs the mitre lengthened by the cosine of half its turn,
   * and lengthening it pushes the band out over the approaching street. So:
   * perpendicular to each stretch, and the small overlap where two stretches
   * meet is left alone as the cheaper of two errors.
   */
  const edgeNormal = (a: Vec2, b: Vec2): Vec2 => {
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const len = Math.hypot(dx, dz) || 1;
    const n: Vec2 = [-dz / len, dx / len];
    const mx = (a[0] + b[0]) / 2 - shape.x;
    const mz = (a[1] + b[1]) / 2 - shape.z;
    return n[0] * mx + n[1] * mz >= 0 ? n : [-n[0], -n[1]];
  };
  for (let i = 0; i < ring.length; i++) {
    if (shape.mouth[i]) continue;
    const j = (i + 1) % ring.length;
    const a = ring[i];
    const b = ring[j];
    const span = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (span < 0.05) continue;
    const na = edgeNormal(a, b);
    const nb = na;
    const ya = ringY[i];
    const yb = ringY[j];
    const kerbA = ya + reveal;
    const kerbB = yb + reveal;

    const at = (p: Vec2, n: Vec2, off: number, h: number): number[] =>
      [p[0] + n[0] * off, h, p[1] + n[1] * off];

    // The kerb face, standing out of the asphalt. Both facings: it is a thin
    // wall and which side you see it from depends on the corner's curvature.
    emitQuad(at(a, na, 0, ya), at(b, nb, 0, yb),
      at(b, nb, 0, kerbB), at(a, na, 0, kerbA),
      kerbFaceIn, kerbFaceOut, false, occlusion, buckets.paving,
      span, reveal, true);

    // Its top, then the pavement behind it.
    emitQuad(at(a, na, 0, kerbA), at(b, nb, 0, kerbB),
      at(b, nb, norm.kerbWidth, kerbB), at(a, na, norm.kerbWidth, kerbA),
      kerbTopIn, kerbTopOut, false, occlusion, buckets.paving,
      span, norm.kerbWidth, false);

    let back = norm.kerbWidth;
    if (pave > 0) {
      emitQuad(at(a, na, back, kerbA), at(b, nb, back, kerbB),
        at(b, nb, back + pave, kerbB), at(a, na, back + pave, kerbA),
        paveIn, paveOut, false, occlusion, buckets.paving,
        span, pave, false);
      back += pave;
    }

    // Earth banking up to the back of it, so the corner never ends in a step.
    const outerA = at(a, na, back, kerbA);
    const outerB = at(b, nb, back, kerbB);
    const runA = at(a, na, back + norm.batter, kerbA);
    const runB = at(b, nb, back + norm.batter, kerbB);
    runA[1] = Math.min(kerbA, terrain.heightAt(runA[0], runA[2]));
    runB[1] = Math.min(kerbB, terrain.heightAt(runB[0], runB[2]));
    emitQuad(outerA, outerB, runB, runA, earth, earth, true, occlusion,
      buckets.soil, span, norm.batter, false);

    // And a wall under that, for the same reason every other end has one.
    const footA = [runA[0], runA[1] - SKIRT_DEPTH_M, runA[2]];
    const footB = [runB[0], runB[1] - SKIRT_DEPTH_M, runB[2]];
    emitQuad(runA, runB, footB, footA, earth, earth, true, occlusion,
      buckets.soil, span, SKIRT_DEPTH_M, true);
  }
}

/** One triangle, wound so it faces up, with a colour per corner. */
function emitFace(
  p: number[][],
  colors: THREE.Color[],
  soft: boolean,
  occlusion: OcclusionField | null,
  out: { pos: number[]; uv: number[]; col: number[] },
  uvScale: number,
): void {
  const up = (p[1][0] - p[0][0]) * (p[2][2] - p[0][2])
    - (p[2][0] - p[0][0]) * (p[1][2] - p[0][2]);
  const order = up < 0 ? [0, 1, 2] : [0, 2, 1];
  for (const i of order) {
    const v = p[i];
    out.pos.push(v[0], v[1], v[2]);
    out.uv.push(v[0] / uvScale, v[2] / uvScale);
    STRIP_TINT.copy(colors[i]);
    const ao = occlusion?.at(v[0], v[2]) ?? 0;
    if (soft) tintGround(STRIP_TINT, v[0], v[2], ao);
    else tintHard(STRIP_TINT, v[0], v[2], ao);
    out.col.push(STRIP_TINT.r, STRIP_TINT.g, STRIP_TINT.b);
  }
}

/** A quad a→b→c→d, up-facing unless it is a wall, in which case both ways. */
function emitQuad(
  a: number[], b: number[], c: number[], d: number[],
  colorNear: THREE.Color, colorFar: THREE.Color,
  soft: boolean,
  occlusion: OcclusionField | null,
  out: { pos: number[]; uv: number[]; col: number[] },
  uSpan: number, vSpan: number,
  bothWays: boolean,
): void {
  const corners = [a, b, c, d];
  const colors = [colorNear, colorNear, colorFar, colorFar];
  const uvs = [[0, 0], [uSpan, 0], [uSpan, vSpan], [0, vSpan]];
  const push = (i: number) => {
    const v = corners[i];
    out.pos.push(v[0], v[1], v[2]);
    out.uv.push(uvs[i][0], uvs[i][1]);
    STRIP_TINT.copy(colors[i]);
    const ao = occlusion?.at(v[0], v[2]) ?? 0;
    if (soft) tintGround(STRIP_TINT, v[0], v[2], ao);
    else tintHard(STRIP_TINT, v[0], v[2], ao);
    out.col.push(STRIP_TINT.r, STRIP_TINT.g, STRIP_TINT.b);
  };

  if (bothWays) {
    for (const i of [0, 1, 2, 0, 2, 3]) push(i);
    for (const i of [0, 2, 1, 0, 3, 2]) push(i);
    return;
  }
  const up = (b[0] - a[0]) * (c[2] - a[2]) - (c[0] - a[0]) * (b[2] - a[2]);
  const order = up < 0 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2];
  for (const i of order) push(i);
}

/** Which merged mesh a surface belongs to. Three materials cover the street. */
type Bucket = 'asphalt' | 'paving' | 'soil';

const BUCKET_OF: Record<StreetSurface, Bucket> = {
  carriageway: 'asphalt',
  kerb: 'paving',
  pavement: 'paving',
  verge: 'soil',
  batter: 'soil',
  parapet: 'paving',
  fascia: 'paving',
};

/**
 * Every strip is shaded across its width, not filled with one value.
 *
 * A real street is darker in the gutter than at the crown, because that is
 * where the dirt collects; the kerb face is darker at its foot than at its
 * top; the verge is worn where it meets the kerb and greener at the back. All
 * of that costs nothing — the vertices are being written anyway — and it is
 * the difference between a street and a diagram of one.
 *
 * The verge and the embankment come out of the shared ground palette, so they
 * carry the same mottling as the grass they border. They used to be their own
 * saturated green, which is what made every road look like it had been painted
 * with margin lines.
 */
const shade = (c: THREE.Color, k: number) => c.clone().multiplyScalar(k);

/**
 * The two widths of a street that are actually paved.
 *
 * `full` is everything built — carriageway, kerb, verge, pavement — and it is
 * what covers the ground along a straight. `carriageway` is the asphalt and
 * its kerb alone, which is all that survives through a junction: the verge and
 * the pavement stop there so the crossing is not carpeted in grass. Cutting
 * the ground needs both, because the two are interrupted on different spans.
 */
function pavedHalfWidths(section: StreetEdge[]): { full: number; carriageway: number } {
  const full = gradedHalfWidth(section);
  let carriageway = section[0].offset;
  for (const edge of section) {
    if (edge.surface === 'carriageway' || edge.surface === 'kerb') {
      carriageway = Math.max(carriageway, edge.offset);
    }
  }
  return { full, carriageway: Math.min(carriageway, full) };
}

export function buildRoadMeshes(
  roads: Road[],
  terrain: Terrain,
  profiles: RoadProfiles,
  norm: StreetNorm,
  occlusion: OcclusionField | null = null,
  mask: StreetMask | null = null,
  radius = 1200,
): RoadMeshes {
  const buckets: Record<Bucket, { pos: number[]; uv: number[]; col: number[] }> = {
    asphalt: { pos: [], uv: [], col: [] },
    paving: { pos: [], uv: [], col: [] },
    soil: { pos: [], uv: [], col: [] },
  };

  const markPos: number[] = [];
  const markUv: number[] = [];
  const markCol: number[] = [];
  const treeSpots: RoadMeshes['treeSpots'] = [];
  let treeSeed = 0x9e3779b9;
  const treeRand = () => {
    treeSeed = (Math.imul(treeSeed, 1664525) + 1013904223) >>> 0;
    return treeSeed / 4294967296;
  };

  // Paint is not white. Thermoplastic that has been on a road for a winter is
  // a warm off-grey, and rendering it at full white was another reason every
  // street read as a diagram.
  const markColor = new THREE.Color(0xb9b3a4);

  // Where streets cross, the paving has to stop; without this the verge runs
  // straight over the main road and the city grows grass across its junctions.
  // The spans come from the junction shapes themselves, so a street stops
  // exactly on the boundary of the thing that is drawn there — not a metre or
  // two away from it, which is a gap you can see through.
  const junctions = spansFromJunctions(roads, profiles.junctions);

  // Pavements somebody has already surveyed, so this does not draw a second
  // one beside each of them.
  const mapped = new MappedPaths(roads);
  if (mapped.count) {
    console.info(`[streets] ${mapped.count} mapped footways; streets defer to them`);
  }

  // Who owns which square metre. Decided before anything is drawn, because
  // 15% of the length of every way in a real town has another way built over
  // the same ground and nothing had ever chosen between them.
  const claim = GroundClaim.build(
    roads, norm, radius, profiles.junctions.map((j) => j.ring as Vec2[]));

  // The junctions themselves, drawn once each as a single surface. Kept in
  // their own meshes rather than merged into the streets', so a measurement
  // can tell junction geometry from street geometry — which is the difference
  // between knowing what overlaps what and guessing at it.
  const junctionBuckets: Buckets = {
    asphalt: { pos: [], uv: [], col: [] },
    paving: { pos: [], uv: [], col: [] },
    soil: { pos: [], uv: [], col: [] },
  };
  for (const shape of profiles.junctions) {
    emitJunction(shape, roads, norm, terrain, junctionBuckets, occlusion);
  }

  roads.forEach((road, roadIndex) => {
    if (road.points.length < 2) return;
    // Underpasses and metro lines are below the streets, not on them.
    if (isUnderground(road)) return;

    const rawProfile = profiles.get(road) ?? roadSurfaceProfile(road, terrain);
    const section = streetSection(road, norm);
    const sectionReach = gradedHalfWidth(section) + 3;
    const spans = spansFor(junctions, road);

    // Split the way exactly where each junction begins, so an interruption is
    // the size of the junction rather than the size of whichever straight
    // happened to pass through it.
    const line = splitAt(road.points, rawProfile, spanCuts(spans));
    const profile = line.heights;
    const segments = line.points.length - 1;

    const mid = new Array<number>(segments);
    for (let i = 0; i < segments; i++) {
      mid[i] = (line.distances[i] + line.distances[i + 1]) / 2;
    }
    const skipSides = spans.sides.length
      ? mid.map((d) => inSpans(spans.sides, d))
      : null;
    const skipCarriageway = spans.carriageway.length
      ? mid.map((d) => inSpans(spans.carriageway, d))
      : null;

    // Stretches where somebody's mapped footway already runs beside this
    // street. Our own pavement band stays in the section — the kerb, the
    // levels and the grading all depend on it — but it is laid as verge there
    // instead of as paving, so the street has one pavement and not two.
    const pavedElsewhere = mapped.count && !road.bridge
      ? line.points.slice(0, -1).map((_, i) => {
        const a = line.points[i];
        const b = line.points[i + 1];
        return mapped.covers((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, sectionReach);
      })
      : null;

    // Tell the ground what was paved here, so it can cut itself away under it.
    //
    // This is done from the drawn geometry rather than from the centreline
    // because the two differ exactly where it matters: paving stops at a
    // junction, and cutting the earth out of a gap that nothing covers would
    // leave a window through the world. A bridge is left out entirely — its
    // deck is metres above ground that is none of its business.
    if (mask && !road.bridge) {
      const paved = pavedHalfWidths(section);
      mask.stampCorridor(line.points, paved.full, skipSides);
      if (paved.carriageway < paved.full) {
        mask.stampCorridor(line.points, paved.carriageway, skipCarriageway);
      }
    }

    // The wedge that brings earth up to a cut end is earth, so it is coloured
    // and bucketed as the embankment is rather than as the slab it meets.
    const [, earthColor] = stripColors('batter', road.cls, false);

    // Every edge of the section, swept. Offset 0 is the crown, shared by both
    // sides, so it is built once and both halves grow outwards from it.
    const crown: Rail = { pts: line.points, y: profile.map((h) => h + section[0].dy) };

    let prevLeft = crown;
    let prevRight = crown;

    for (let k = 1; k < section.length; k++) {
      const edge = section[k];
      const { left, right } = offsetPolyline(line.points, edge.offset);

      // A NaN height means "wherever the ground is" — the outer lip of the
      // embankment, which has to land exactly on the terrain or the street
      // finishes in a step. Everything else is a fixed rise off the crown.
      const heightsFor = (pts: Vec2[]): number[] =>
        Number.isNaN(edge.dy)
          ? pts.map(([x, z]) => terrain.heightAt(x, z))
          : profile.map((h) => h + edge.dy);

      const railLeft: Rail = { pts: left, y: heightsFor(left) };
      const railRight: Rail = { pts: right, y: heightsFor(right) };

      // A strip whose two edges sit at the same offset is a vertical face —
      // the kerb — and it is shaded darker than the flat top above it.
      const vertical = edge.offset === section[k - 1].offset;
      const [inner, outer] = stripColors(edge.surface, road.cls, vertical);
      const soft = SOFT_SURFACE.has(edge.surface);
      const bucket = buckets[BUCKET_OF[edge.surface]];
      const uvScale = UV_SCALE[edge.surface];
      const skip = road.bridge
        ? null
        : edge.surface === 'carriageway' ? skipCarriageway : skipSides;
      const acrossIn = section[k - 1].offset;
      const acrossOut = edge.offset;
      const pavementHere = edge.surface === 'pavement' && pavedElsewhere !== null;

      // This band, on this side, over ground somebody else owns is not drawn.
      //
      // Only the soft parts ask. A carriageway and its kerb are what the claim
      // is protecting, so they never yield — asked to, a street gives up its
      // own asphalt to a neighbour's verge and the town loses its roads.
      // A bridge is exempt: it is not on the ground at all.
      const yielded = (rail: Rail, prev: Rail): boolean[] | null => {
        if (road.bridge) return null;
        if (edge.surface === 'carriageway' || edge.surface === 'kerb') return null;
        const out: boolean[] = [];
        for (let i = 0; i < line.points.length - 1; i++) {
          // Both edges of the band and its middle. Judging a band by its
          // centre alone lets half of it lie on somebody else's ground, and
          // half a band is exactly the size of the patches that were showing.
          const mx = (prev.pts[i][0] + prev.pts[i + 1][0]) / 2;
          const mz = (prev.pts[i][1] + prev.pts[i + 1][1]) / 2;
          const ox = (rail.pts[i][0] + rail.pts[i + 1][0]) / 2;
          const oz = (rail.pts[i][1] + rail.pts[i + 1][1]) / 2;
          out.push(!claim.mayBuild(roadIndex, mx, mz)
            || !claim.mayBuild(roadIndex, ox, oz)
            || !claim.mayBuild(roadIndex, (mx + ox) / 2, (mz + oz) / 2));
        }
        return out;
      };
      const yieldRight = yielded(railRight, prevRight);
      const yieldLeft = yielded(railLeft, prevLeft);
      const bands = pavementHere
        ? pavementBands(skip, pavedElsewhere)
        : { paving: skip, verge: null };

      // Argument order is load-bearing: the first rail must be the one on the
      // left of travel. On the right-hand side that is the inner rail; on the
      // left-hand side it is the outer one, and the colours swap with it.
      emitStrip(prevRight, railRight, inner, outer, soft, occlusion,
        bucket.pos, bucket.uv, bucket.col, uvScale, acrossIn, acrossOut,
        combine(bands.paving, yieldRight));
      emitStrip(railLeft, prevLeft, outer, inner, soft, occlusion,
        bucket.pos, bucket.uv, bucket.col, uvScale, acrossOut, acrossIn,
        combine(bands.paving, yieldLeft));

      // The same band again as verge, over the stretches the first call left
      // out: where the map already has a footway, this strip is grass.
      //
      // The two skip lists are complements and the order of them is the whole
      // behaviour. Written the other way round — and it shipped that way once
      // — the paving appears *only* where somebody's footway already is and
      // the verge takes over everywhere else, which is both complaints at
      // once: two pavements side by side here, and no pavement at all there.
      if (pavementHere && pavedElsewhere) {
        const [vergeIn, vergeOut] = stripColors('verge', road.cls, false);
        emitStrip(prevRight, railRight, vergeIn, vergeOut, true, occlusion,
          buckets.soil.pos, buckets.soil.uv, buckets.soil.col,
          UV_SCALE.verge, acrossIn, acrossOut, combine(bands.verge, yieldRight));
        emitStrip(railLeft, prevLeft, vergeOut, vergeIn, true, occlusion,
          buckets.soil.pos, buckets.soil.uv, buckets.soil.col,
          UV_SCALE.verge, acrossOut, acrossIn, combine(bands.verge, yieldLeft));
      }

      // Close both ends of every stretch that was actually drawn. A vertical
      // face has no place in the palette of its own, so it takes the band's
      // colour a third darker — the same trick the kerb face uses.
      const wall = shade(outer, 0.66);
      const taper = TAPERED_END.has(edge.surface);
      for (const end of runEnds(line.points.length, combine(skip, yieldRight))) {
        emitEndFill(prevRight, railRight, end, tangentAt(line.points, end), terrain,
          taper, wall, earthColor, bucket, buckets.soil);
      }
      for (const end of runEnds(line.points.length, combine(skip, yieldLeft))) {
        emitEndFill(railLeft, prevLeft, end, tangentAt(line.points, end), terrain,
          taper, wall, earthColor, bucket, buckets.soil);
      }

      prevLeft = railLeft;
      prevRight = railRight;
    }

    // Street trees, standing in the verge.
    //
    // A town without them is the giveaway that a city was generated rather
    // than built: real streets are lined with trees almost everywhere people
    // live, and OpenStreetMap records almost none of them, so they have to be
    // put where the norm says they go. The verge is where they go — that is
    // most of what a verge is for — and they stop at junctions, where the
    // paving they stand in stops too.
    const vergeWidth = norm.verge[road.cls];
    if (road.drivable && vergeWidth >= 1.4 && !road.bridge && road.cls !== 'service') {
      const stand = road.width / 2 + norm.kerbWidth + vergeWidth * 0.55;
      const SPACING = 13;
      let carry = treeRand() * SPACING;
      for (let i = 0; i < segments; i++) {
        const [x0, z0] = line.points[i];
        const [x1, z1] = line.points[i + 1];
        const dx = x1 - x0;
        const dz = z1 - z0;
        const len = Math.hypot(dx, dz);
        if (len < 0.01) continue;
        const nx = dz / len;
        const nz = -dx / len;
        let t = carry;
        while (t < len) {
          const d = line.distances[i] + t;
          // Clear of the junction by a tree's own width as well as the
          // crossing's: a trunk planted right on the corner of an intersection
          // stands in the middle of the other road's carriageway.
          const CLEAR = 5;
          if (!inSpans(spans.sides, d) &&
              !inSpans(spans.sides, d - CLEAR) &&
              !inSpans(spans.sides, d + CLEAR)) {
            const f = t / len;
            const side = treeRand() < 0.5 ? 1 : -1;
            // Not every gap has a tree in it: a street planted on a perfect
            // grid reads as wallpaper.
            if (treeRand() > 0.22) {
              treeSpots.push({
                x: x0 + dx * f + nx * stand * side,
                z: z0 + dz * f + nz * stand * side,
                scale: 0.85 + treeRand() * 0.5,
              });
            }
          }
          t += SPACING * (0.75 + treeRand() * 0.5);
        }
        carry = Math.max(0, t - len);
      }
    }

    // A dashed centre line on roads big enough to have one. Paint stops at a
    // junction: running a lane line through a crossroads is not what is on the
    // ground anywhere.
    if (road.drivable && road.lanes >= 2 && road.width >= 7 && !road.oneway) {
      const centre = offsetPolyline(line.points, 0.16);
      emitDashedLine(
        centre.left, centre.right, raise(profile, MARKING_Y - SURFACE_Y),
        markColor, markPos, markUv, markCol, spans.sides,
      );
    }
  });

  const asphalt = asphaltTexture();
  const paving = pavingTexture();
  const soil = groundTexture();

  const group = new THREE.Group();
  group.name = 'roads';

  const surfaceMat = new THREE.MeshStandardMaterial({
    map: asphalt,
    vertexColors: true,
    roughness: 0.96,
    metalness: 0,
  });
  const paveMat = new THREE.MeshStandardMaterial({
    map: paving,
    vertexColors: true,
    roughness: 0.9,
    metalness: 0,
  });
  const soilMat = new THREE.MeshStandardMaterial({
    map: soil,
    vertexColors: true,
    roughness: 1,
    metalness: 0,
  });
  const markMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });

  const geoms: THREE.BufferGeometry[] = [];

  const add = (
    pos: number[], uv: number[], col: number[],
    mat: THREE.Material, name: string, receiveShadow: boolean,
  ) => {
    if (!pos.length) return;
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geom.computeVertexNormals();
    geom.computeBoundingSphere();
    const mesh = new THREE.Mesh(geom, mat);
    mesh.receiveShadow = receiveShadow;
    // The kerb is the one piece of street furniture tall enough to cast a
    // shadow worth having: it is what draws the edge of the road at low sun.
    mesh.castShadow = name === 'roads:paving';
    mesh.name = name;
    group.add(mesh);
    geoms.push(geom);
  };

  add(buckets.asphalt.pos, buckets.asphalt.uv, buckets.asphalt.col, surfaceMat, 'roads:surface', true);
  add(buckets.paving.pos, buckets.paving.uv, buckets.paving.col, paveMat, 'roads:paving', true);
  add(buckets.soil.pos, buckets.soil.uv, buckets.soil.col, soilMat, 'roads:verge', true);
  add(junctionBuckets.asphalt.pos, junctionBuckets.asphalt.uv, junctionBuckets.asphalt.col,
    surfaceMat, 'junction:surface', true);
  add(junctionBuckets.paving.pos, junctionBuckets.paving.uv, junctionBuckets.paving.col,
    paveMat, 'junction:paving', true);
  add(junctionBuckets.soil.pos, junctionBuckets.soil.uv, junctionBuckets.soil.col,
    soilMat, 'junction:verge', true);
  add(markPos, markUv, markCol, markMat, 'roads:markings', false);

  return {
    group,
    treeSpots,
    dispose() {
      for (const g of geoms) g.dispose();
      surfaceMat.dispose();
      paveMat.dispose();
      soilMat.dispose();
      markMat.dispose();
      asphalt.dispose();
      paving.dispose();
      soil.dispose();
    },
  };
}

/**
 * The pair of colours a strip runs between: inner edge first, outer second.
 * "Inner" means nearer the centre of the road on both sides, because the
 * section is mirrored.
 */
function stripColors(
  surface: StreetSurface,
  cls: RoadClass,
  vertical: boolean,
): [THREE.Color, THREE.Color] {
  switch (surface) {
    case 'carriageway': {
      const asphalt = new THREE.Color(SURFACE_COLOR[cls]);
      return [asphalt, shade(asphalt, 0.88)];
    }
    case 'kerb':
      return vertical
        ? [shade(KERB_FACE, 0.82), KERB_FACE]
        : [KERB_TOP, shade(KERB_TOP, 0.96)];
    case 'pavement':
      return [PAVING, shade(PAVING, 0.95)];
    case 'verge':
      return [shade(MOWN_VERGE, 0.9), MOWN_VERGE];
    case 'batter':
      return [shade(MOWN_VERGE, 0.96), TURF];
    case 'parapet':
      return [shade(PAVING, 0.86), shade(PAVING, 1.02)];
    case 'fascia':
      // Concrete in permanent shade under its own deck, darkening downwards.
      return [shade(PAVING, 0.78), shade(PAVING, 0.5)];
  }
}

/** Soft surfaces take the turf variation; hard ones take the quieter version. */
const SOFT_SURFACE: ReadonlySet<StreetSurface> = new Set<StreetSurface>(['verge', 'batter']);

/**
 * Metres per texture tile, per surface. Asphalt is laid in wide passes and
 * reads coarse; paving slabs are small; grass wants a tile fine enough that
 * you cannot see it repeat from a car.
 */
const UV_SCALE: Record<StreetSurface, number> = {
  carriageway: 3.2,
  kerb: 0.8,
  pavement: 1.1,
  verge: 2.4,
  batter: 2.4,
  parapet: 1.4,
  fascia: 2.2,
};

/**
 * Railways: a ballast bed with rails on top.
 *
 * Track is not part of the pedestrian graph — people do not walk along the
 * railway — but it matters visually out of all proportion to its length,
 * because in a small town the line is often the thing that decides which side
 * of it you live on.
 */
export function buildRailwayMeshes(railways: Railway[], terrain: Terrain): RoadMeshes {
  const pos: number[] = [];
  const uv: number[] = [];
  const col: number[] = [];

  const ballastColor = new THREE.Color(0x6b6259);
  const railColor = new THREE.Color(0x9a9186);
  const sleeperColor = new THREE.Color(0x4f463c);
  const TRACK_GAUGE = 1.52;
  const TRACK_SPACING = 4.2;

  for (const line of railways) {
    if (line.points.length < 2) continue;
    // Underground track is not visible from here — and `layer` alone never
    // lifted anything, so an elevated line has to say `bridge=yes` to fly.
    if (isUnderground(line) || line.kind === 'subway') continue;

    const tracks = Math.max(1, Math.min(6, line.tracks));
    // Rail tolerates far less gradient than a road, so its profile is smoothed
    // harder and allowed to stray further from the ground — which is precisely
    // why real lines run in cuttings and on embankments.
    const profile = line.bridge
      ? bridgeProfile(line.points, terrain, SURFACE_Y, line.layer)
      : gradedProfile(line.points, terrain, SURFACE_Y, 4);

    // Trams run embedded in the carriageway, not on a ballast bed — laying
    // gravel down the middle of a city street is the wrong picture entirely.
    // Only heavy rail gets ballast.
    const embedded = line.kind === 'tram';
    if (!embedded) {
      const halfBed = (tracks * TRACK_SPACING) / 2 + 0.8;
      const bed = offsetPolyline(line.points, halfBed);
      const bedColor = line.kind === 'disused' ? sleeperColor : ballastColor;
      emitRibbon(bed.left, bed.right, profile, bedColor, pos, uv, col, 4);
    }

    // Two rails per track, offset from the line's centre. Embedded tram rail
    // sits just proud of the asphalt; ballasted rail sits on top of the bed.
    const railY = raise(profile, (embedded ? MARKING_Y + 0.01 : MARKING_Y) - SURFACE_Y);
    const spacing = embedded ? TRACK_GAUGE + 1.2 : TRACK_SPACING;
    for (let t = 0; t < tracks; t++) {
      const centre = (t - (tracks - 1) / 2) * spacing;
      for (const side of [-1, 1]) {
        const railCentre = centre + (side * TRACK_GAUGE) / 2;
        // A rail head is ~7 cm wide; widen it so it survives at distance.
        const inner = offsetPolyline(line.points, railCentre - 0.09);
        const outer = offsetPolyline(line.points, railCentre + 0.09);
        emitRibbon(inner.right, outer.right, railY, railColor, pos, uv, col, 4);
      }
    }
  }

  const group = new THREE.Group();
  group.name = 'railways';
  const geoms: THREE.BufferGeometry[] = [];
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.9,
    metalness: 0.25,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });

  if (pos.length) {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geom.computeVertexNormals();
    geom.computeBoundingSphere();
    const mesh = new THREE.Mesh(geom, mat);
    mesh.receiveShadow = true;
    mesh.name = 'railways:track';
    group.add(mesh);
    geoms.push(geom);
  }

  return {
    group,
    // Railways are not planted with street trees.
    treeSpots: [],
    dispose() {
      for (const g of geoms) g.dispose();
      mat.dispose();
    },
  };
}

/** Centre lines: 3 m of paint, 6 m of gap, walked along the ribbon. */
function emitDashedLine(
  left: Vec2[],
  right: Vec2[],
  heights: number[],
  color: THREE.Color,
  pos: number[],
  uv: number[],
  col: number[],
  gaps: Array<[number, number]> = [],
): void {
  const DASH = 3;
  const GAP = 6;
  let distance = 0;

  for (let i = 0; i < left.length - 1; i++) {
    const segLen = Math.hypot(left[i + 1][0] - left[i][0], left[i + 1][1] - left[i][1]);
    if (segLen < 0.01) continue;

    let t = 0;
    while (t < segLen) {
      const cycle = (distance + t) % (DASH + GAP);
      if (cycle < DASH && !inSpans(gaps, distance + t)) {
        const runEnd = Math.min(segLen, t + (DASH - cycle));
        const a = t / segLen;
        const b = runEnd / segLen;
        const l0: Vec2 = [
          left[i][0] + (left[i + 1][0] - left[i][0]) * a,
          left[i][1] + (left[i + 1][1] - left[i][1]) * a,
        ];
        const l1: Vec2 = [
          left[i][0] + (left[i + 1][0] - left[i][0]) * b,
          left[i][1] + (left[i + 1][1] - left[i][1]) * b,
        ];
        const r0: Vec2 = [
          right[i][0] + (right[i + 1][0] - right[i][0]) * a,
          right[i][1] + (right[i + 1][1] - right[i][1]) * a,
        ];
        const r1: Vec2 = [
          right[i][0] + (right[i + 1][0] - right[i][0]) * b,
          right[i][1] + (right[i + 1][1] - right[i][1]) * b,
        ];
        // Interpolate the ground height across the dash as well, or paint
        // floats off the tarmac wherever the street runs downhill.
        const ya = heights[i] + (heights[i + 1] - heights[i]) * a;
        const yb = heights[i] + (heights[i + 1] - heights[i]) * b;
        pos.push(
          l0[0], ya, l0[1], r1[0], yb, r1[1], r0[0], ya, r0[1],
          l0[0], ya, l0[1], l1[0], yb, l1[1], r1[0], yb, r1[1],
        );
        uv.push(0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1);
        for (let k = 0; k < 6; k++) col.push(color.r, color.g, color.b);
        t = runEnd + 0.001;
      } else {
        t += DASH + GAP - cycle;
      }
    }
    distance += segLen;
  }
}
