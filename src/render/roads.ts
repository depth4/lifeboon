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
import { streetSection, type StreetNorm, type StreetSurface } from '../world/street';
import { inSpans, junctionSpans, spanCuts, spansFor, splitAt } from '../world/junctions';
import { asphaltTexture, groundTexture, pavingTexture } from './textures';
import type { OcclusionField } from './occlusion';
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

export function buildRoadMeshes(
  roads: Road[],
  terrain: Terrain,
  profiles: RoadProfiles,
  norm: StreetNorm,
  occlusion: OcclusionField | null = null,
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
  const junctions = junctionSpans(roads);

  for (const road of roads) {
    if (road.points.length < 2) continue;
    // Underpasses and metro lines are below the streets, not on them.
    if (isUnderground(road)) continue;

    const rawProfile = profiles.get(road) ?? roadSurfaceProfile(road, terrain);
    const section = streetSection(road, norm);
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

      // Argument order is load-bearing: the first rail must be the one on the
      // left of travel. On the right-hand side that is the inner rail; on the
      // left-hand side it is the outer one, and the colours swap with it.
      emitStrip(prevRight, railRight, inner, outer, soft, occlusion,
        bucket.pos, bucket.uv, bucket.col, uvScale, acrossIn, acrossOut, skip);
      emitStrip(railLeft, prevLeft, outer, inner, soft, occlusion,
        bucket.pos, bucket.uv, bucket.col, uvScale, acrossOut, acrossIn, skip);

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
  }

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
