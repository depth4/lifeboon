/**
 * Road geometry.
 *
 * Each centreline is widened into a ribbon with mitred joints, which keeps
 * corners closed without the fan of triangles a naive per-segment quad needs.
 * Carriageways, pavements and lane markings are three merged meshes.
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
} from '../world/roadprofile';
import { asphaltTexture } from './textures';

/**
 * Layer heights above the ground surface.
 *
 * The carriageway height itself lives in world/roadprofile.ts, because the
 * simulation needs it too — a car has to sit on the deck that was drawn. The
 * kerb sits above the carriageway; against land cover it stands 17 cm proud,
 * which is about right, and against bare ground more, which is the price of
 * keeping every surface out of the others' depth noise.
 */
const SURFACE_Y = ROAD_SURFACE_Y;
const MARKING_Y = 0.31;
const PAVEMENT_Y = 0.38;
/** Width of the kerb strip that separates carriageway from pavement. */
const KERB_WIDTH = 0.3;

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

/**
 * Pavement has to read as pavement against bare ground (0x9a9689 in
 * render/ground.ts). The two used to differ by three points of blue, which is
 * invisible — keep a real gap here, and let the darker kerb draw the edge.
 */
const PAVEMENT_COLOR = 0xc0bcb4;
const KERB_COLOR = 0x8f8a83;

export interface RoadMeshes {
  group: THREE.Group;
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
    // Lengthen the mitre so the ribbon keeps its width through the corner,
    // clamped so a sharp turn does not shoot a spike across the map.
    const cos = mx * pIn[0] + mz * pIn[1];
    const scale = Math.min(2.5, 1 / Math.max(0.4, cos));
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

export function buildRoadMeshes(roads: Road[], terrain: Terrain): RoadMeshes {
  const surfPos: number[] = [];
  const surfUv: number[] = [];
  const surfCol: number[] = [];

  const pavePos: number[] = [];
  const paveUv: number[] = [];
  const paveCol: number[] = [];

  const markPos: number[] = [];
  const markUv: number[] = [];
  const markCol: number[] = [];

  const color = new THREE.Color();
  const paveColor = new THREE.Color(PAVEMENT_COLOR);
  const kerbColor = new THREE.Color(KERB_COLOR);
  const markColor = new THREE.Color(0xd8d2c4);

  for (const road of roads) {
    if (road.points.length < 2) continue;
    // Underpasses and metro lines are below the streets, not on them.
    if (isUnderground(road)) continue;
    const half = road.width / 2;
    const profile = roadSurfaceProfile(road, terrain);

    const { left, right } = offsetPolyline(road.points, half);
    color.set(SURFACE_COLOR[road.cls]);
    emitRibbon(left, right, profile, color, surfPos, surfUv, surfCol, 8);

    // Pavements flank anything cars use; footpaths are already pavement.
    //
    // Argument order is load-bearing. emitRibbon winds its triangles assuming
    // the first list is the one offsetPolyline calls `left`; hand it an
    // inner-to-outer pair on the left-hand side and every triangle comes out
    // face-down, which backface culling then hides completely. That is exactly
    // what happened here — pavements were built for every street in the world
    // and none of them were ever drawn.
    if (road.drivable && road.cls !== 'service') {
      const paveWidth = road.cls === 'primary' || road.cls === 'secondary' ? 3 : 2.2;
      const kerb = offsetPolyline(road.points, half + KERB_WIDTH);
      const outer = offsetPolyline(road.points, half + paveWidth);

      // Kerb first: a dark line along the edge of the carriageway is what
      // makes the pavement beside it legible as a separate surface.
      const paveProfile = raise(profile, PAVEMENT_Y - SURFACE_Y);
      emitRibbon(kerb.left, left, paveProfile, kerbColor, pavePos, paveUv, paveCol, 2);
      emitRibbon(right, kerb.right, paveProfile, kerbColor, pavePos, paveUv, paveCol, 2);

      emitRibbon(outer.left, kerb.left, paveProfile, paveColor, pavePos, paveUv, paveCol, 6);
      emitRibbon(kerb.right, outer.right, paveProfile, paveColor, pavePos, paveUv, paveCol, 6);
    }

    // A dashed centre line on roads big enough to have one.
    if (road.drivable && road.lanes >= 2 && road.width >= 7 && !road.oneway) {
      const centre = offsetPolyline(road.points, 0.16);
      emitDashedLine(
        centre.left, centre.right, raise(profile, MARKING_Y - SURFACE_Y),
        markColor, markPos, markUv, markCol,
      );
    }
  }

  const asphalt = asphaltTexture();

  const group = new THREE.Group();
  group.name = 'roads';

  const surfaceMat = new THREE.MeshStandardMaterial({
    map: asphalt,
    vertexColors: true,
    roughness: 0.96,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  const paveMat = new THREE.MeshStandardMaterial({
    map: asphalt,
    vertexColors: true,
    roughness: 0.95,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: -3,
    polygonOffsetUnits: -3,
  });
  const markMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
  });

  const meshes: THREE.Mesh[] = [];
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
    mesh.name = name;
    group.add(mesh);
    meshes.push(mesh);
    geoms.push(geom);
  };

  add(surfPos, surfUv, surfCol, surfaceMat, 'roads:surface', true);
  add(pavePos, paveUv, paveCol, paveMat, 'roads:pavement', true);
  add(markPos, markUv, markCol, markMat, 'roads:markings', false);

  return {
    group,
    dispose() {
      for (const g of geoms) g.dispose();
      surfaceMat.dispose();
      paveMat.dispose();
      markMat.dispose();
      asphalt.dispose();
    },
  };
}

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
      if (cycle < DASH) {
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
