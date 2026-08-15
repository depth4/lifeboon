/**
 * Ground: the base plane, and the land-cover polygons (water, parks, woodland,
 * pitches, car parks) painted on top of it.
 *
 * Everything is stacked in a few centimetres of height rather than fought over
 * with depth bias alone, which keeps large overlapping polygons stable when the
 * camera pulls back to a few kilometres.
 */

import * as THREE from 'three';
import type { AreaFeature, AreaKind, Vec2 } from '../world/types';
import { groundTexture } from './textures';

const AREA_COLOR: Record<AreaKind, number> = {
  water: 0x3d6b8a,
  park: 0x7fa05c,
  forest: 0x5f7f47,
  grass: 0x8db067,
  sand: 0xd9cba3,
  pitch: 0x6f9558,
  cemetery: 0x7d9464,
  parking: 0x76736e,
  pavement: 0x9a958c,
};

/**
 * Height above the base plane, in metres. Ordering matches the paint priority
 * in data/tags.ts: water is last and therefore highest, so a river is never
 * covered by a landuse polygon that happens to overlap its bank. Everything
 * here stays below the road surface (0.06 m), so bridges read correctly.
 */
const AREA_Y: Record<AreaKind, number> = {
  water: 0.030,
  park: 0.012,
  forest: 0.014,
  grass: 0.010,
  sand: 0.016,
  pitch: 0.020,
  cemetery: 0.014,
  parking: 0.018,
  pavement: 0.022,
};

export interface GroundMeshes {
  group: THREE.Group;
  /** Points inside parks and woodland, for scattering trees. */
  treeSpots: Array<{ x: number; z: number; scale: number }>;
  dispose(): void;
}

function triangulate(ring: Vec2[], holes: Vec2[][]): { flat: THREE.Vector2[]; faces: number[][] } | null {
  if (ring.length < 3) return null;
  const contour = ring.map(([x, z]) => new THREE.Vector2(x, z));
  const holeVecs = holes.map((h) => h.map(([x, z]) => new THREE.Vector2(x, z)));
  try {
    const faces = THREE.ShapeUtils.triangulateShape(contour, holeVecs);
    return { flat: contour.concat(...holeVecs), faces };
  } catch {
    return null;
  }
}

export function buildGround(areas: AreaFeature[], radius: number, seed: number): GroundMeshes {
  const group = new THREE.Group();
  group.name = 'ground';

  const texture = groundTexture();
  texture.repeat.set(radius / 6, radius / 6);

  // --- base plane -------------------------------------------------------
  // Generously oversized so the horizon never shows an edge.
  const baseSize = radius * 6;
  const baseGeom = new THREE.PlaneGeometry(baseSize, baseSize);
  baseGeom.rotateX(-Math.PI / 2);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x9a9689,
    map: texture,
    roughness: 1,
    metalness: 0,
  });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = -0.02;
  base.receiveShadow = true;
  base.name = 'ground:base';
  group.add(base);

  // --- land cover -------------------------------------------------------
  const landPos: number[] = [];
  const landCol: number[] = [];
  const waterPos: number[] = [];
  const treeSpots: GroundMeshes['treeSpots'] = [];

  const color = new THREE.Color();
  let treeSeed = seed >>> 0;
  const rand = () => {
    treeSeed = (treeSeed * 1664525 + 1013904223) >>> 0;
    return treeSeed / 4294967296;
  };

  for (const area of areas) {
    const tri = triangulate(area.ring, area.holes);
    if (!tri) continue;
    const y = AREA_Y[area.kind];
    const isWater = area.kind === 'water';
    color.set(AREA_COLOR[area.kind]);

    for (const face of tri.faces) {
      const a = tri.flat[face[0]];
      const b = tri.flat[face[1]];
      const c = tri.flat[face[2]];
      if (!a || !b || !c) continue;

      // Wind so the face points up.
      const ny = (b.y - a.y) * (c.x - a.x) - (b.x - a.x) * (c.y - a.y);
      const target = isWater ? waterPos : landPos;
      if (ny < 0) {
        target.push(a.x, y, a.y, c.x, y, c.y, b.x, y, b.y);
      } else {
        target.push(a.x, y, a.y, b.x, y, b.y, c.x, y, c.y);
      }
      if (!isWater) for (let k = 0; k < 3; k++) landCol.push(color.r, color.g, color.b);
    }

    // Scatter trees through green space, denser in woodland.
    if (area.kind === 'forest' || area.kind === 'park') {
      scatterTrees(area, area.kind === 'forest' ? 0.006 : 0.0016, rand, treeSpots);
    }
  }

  const geoms: THREE.BufferGeometry[] = [baseGeom];
  const mats: THREE.Material[] = [baseMat];

  if (landPos.length) {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(landPos, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(landCol, 3));
    geom.computeVertexNormals();
    geom.computeBoundingSphere();
    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      metalness: 0,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.receiveShadow = true;
    mesh.name = 'ground:landcover';
    group.add(mesh);
    geoms.push(geom);
    mats.push(mat);
  }

  if (waterPos.length) {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(waterPos, 3));
    geom.computeVertexNormals();
    geom.computeBoundingSphere();
    const mat = new THREE.MeshStandardMaterial({
      color: AREA_COLOR.water,
      roughness: 0.15,
      metalness: 0.35,
      transparent: true,
      opacity: 0.92,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.receiveShadow = true;
    mesh.name = 'ground:water';
    group.add(mesh);
    geoms.push(geom);
    mats.push(mat);
  }

  return {
    group,
    treeSpots,
    dispose() {
      for (const g of geoms) g.dispose();
      for (const m of mats) m.dispose();
      texture.dispose();
    },
  };
}

/** Rejection-sample points inside a polygon at the given density per m². */
function scatterTrees(
  area: AreaFeature,
  density: number,
  rand: () => number,
  out: GroundMeshes['treeSpots'],
): void {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const [x, z] of area.ring) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }
  const bboxArea = (maxX - minX) * (maxZ - minZ);
  if (!isFinite(bboxArea) || bboxArea <= 0) return;

  const attempts = Math.min(1400, Math.round(bboxArea * density));
  for (let i = 0; i < attempts; i++) {
    const x = minX + rand() * (maxX - minX);
    const z = minZ + rand() * (maxZ - minZ);
    if (!inRing([x, z], area.ring)) continue;
    let inHole = false;
    for (const hole of area.holes) {
      if (inRing([x, z], hole)) { inHole = true; break; }
    }
    if (inHole) continue;
    out.push({ x, z, scale: 0.7 + rand() * 0.8 });
  }
}

function inRing(p: Vec2, ring: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
