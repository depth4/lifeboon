/**
 * Road geometry.
 *
 * Each centreline is widened into a ribbon with mitred joints, which keeps
 * corners closed without the fan of triangles a naive per-segment quad needs.
 * Carriageways, pavements and lane markings are three merged meshes.
 */

import * as THREE from 'three';
import type { Road, RoadClass, Vec2 } from '../world/types';
import { asphaltTexture } from './textures';

/** Height above ground per layer, so bridges clear what they cross. */
const LAYER_HEIGHT = 5;
const SURFACE_Y = 0.06;
const MARKING_Y = 0.09;
const PAVEMENT_Y = 0.15;

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

const PAVEMENT_COLOR = 0x9a958c;

export interface RoadMeshes {
  group: THREE.Group;
  dispose(): void;
}

/**
 * Offset a polyline to both sides by `half`, mitring at each interior vertex.
 * Returns left and right edge point lists of the same length as `points`.
 */
function offsetPolyline(points: Vec2[], half: number): { left: Vec2[]; right: Vec2[] } {
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

/** Emit a ribbon between two edge lists into position/uv/colour arrays. */
function emitRibbon(
  left: Vec2[],
  right: Vec2[],
  y: number,
  color: THREE.Color,
  pos: number[],
  uv: number[],
  col: number[],
  uvScale: number,
): void {
  let travelled = 0;
  for (let i = 0; i < left.length - 1; i++) {
    const l0 = left[i], r0 = right[i], l1 = left[i + 1], r1 = right[i + 1];
    const segLen = Math.hypot(l1[0] - l0[0], l1[1] - l0[1]);
    const v0 = travelled / uvScale;
    const v1 = (travelled + segLen) / uvScale;
    travelled += segLen;

    // Two triangles wound (left, right-ahead, right) so the face points up.
    // Getting this backwards makes every road vanish under backface culling.
    pos.push(
      l0[0], y, l0[1], r1[0], y, r1[1], r0[0], y, r0[1],
      l0[0], y, l0[1], l1[0], y, l1[1], r1[0], y, r1[1],
    );
    uv.push(0, v0, 1, v1, 1, v0, 0, v0, 0, v1, 1, v1);
    for (let k = 0; k < 6; k++) col.push(color.r, color.g, color.b);
  }
}

export function buildRoadMeshes(roads: Road[]): RoadMeshes {
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
  const markColor = new THREE.Color(0xd8d2c4);

  for (const road of roads) {
    if (road.points.length < 2) continue;
    const yBase = road.layer * LAYER_HEIGHT;
    const half = road.width / 2;

    const { left, right } = offsetPolyline(road.points, half);
    color.set(SURFACE_COLOR[road.cls]);
    emitRibbon(left, right, yBase + SURFACE_Y, color, surfPos, surfUv, surfCol, 8);

    // Pavements flank anything cars use; footpaths are already pavement.
    if (road.drivable && road.cls !== 'service') {
      const paveWidth = road.cls === 'primary' || road.cls === 'secondary' ? 3 : 2.2;
      const outer = offsetPolyline(road.points, half + paveWidth);
      emitRibbon(left, outer.left, yBase + PAVEMENT_Y, paveColor, pavePos, paveUv, paveCol, 6);
      emitRibbon(outer.right, right, yBase + PAVEMENT_Y, paveColor, pavePos, paveUv, paveCol, 6);
    }

    // A dashed centre line on roads big enough to have one.
    if (road.drivable && road.lanes >= 2 && road.width >= 7 && !road.oneway) {
      const centre = offsetPolyline(road.points, 0.16);
      emitDashedLine(centre.left, centre.right, yBase + MARKING_Y, markColor, markPos, markUv, markCol);
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

/** Centre lines: 3 m of paint, 6 m of gap, walked along the ribbon. */
function emitDashedLine(
  left: Vec2[],
  right: Vec2[],
  y: number,
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
        pos.push(
          l0[0], y, l0[1], r1[0], y, r1[1], r0[0], y, r0[1],
          l0[0], y, l0[1], l1[0], y, l1[1], r1[0], y, r1[1],
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
