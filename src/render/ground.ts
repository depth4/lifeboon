/**
 * Ground: the terrain surface, and the land-cover polygons draped over it.
 *
 * The base is a single mesh whose grid is stretched outwards non-linearly —
 * roughly 20 m spacing across the loaded city, widening to hundreds of metres
 * at the horizon. That gives detail where the data actually has any, and a
 * landscape that runs to the skyline, without a separate skirt mesh and the
 * cracks that come with one.
 *
 * Land cover is draped rather than laid flat: a park triangle spanning a
 * hillside is subdivided until each piece is small enough to follow the slope,
 * because a single large flat triangle would cut straight through the hill.
 */

import * as THREE from 'three';
import type { AreaFeature, AreaKind, Vec2 } from '../world/types';
import type { Terrain } from '../terrain/heightfield';
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
 * Height above the ground surface, in metres.
 *
 * These used to be one or two centimetres, which is far inside the depth
 * buffer's error at city viewing distances — the land cover and the terrain
 * underneath fought for the same pixels and flickered. Ten to fifteen
 * centimetres is invisible to the eye at any distance you would actually look
 * from, and comfortably outside the precision the surfaces are resolved at.
 * Everything here stays below the road surface so kerbs still read correctly.
 */
const AREA_LIFT: Record<AreaKind, number> = {
  water: 0.0,
  park: 0.10,
  forest: 0.11,
  grass: 0.09,
  sand: 0.12,
  pitch: 0.14,
  cemetery: 0.11,
  parking: 0.13,
  pavement: 0.15,
};

/** Ground colours blended by steepness: turf on the flat, bare earth on slopes. */
const FLAT_GROUND = new THREE.Color(0x8a9166);
const STEEP_GROUND = new THREE.Color(0x8a7a63);
const CLIFF_GROUND = new THREE.Color(0x7d756c);

/** Grid resolution of the base mesh, per side. */
const BASE_GRID = 168;
/** How far past the loaded area the stretched grid reaches, as a multiple. */
const HORIZON_FACTOR = 5;
/**
 * Subdivide a draped triangle until its edges are shorter than this. It must
 * be finer than the terrain grid (20 m), or a land-cover triangle spans a
 * whole terrain cell and cuts through the surface it is supposed to lie on.
 */
const DRAPE_MAX_EDGE_M = 16;

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

/**
 * Non-linear grid position: near the centre this is close to `u * radius`,
 * and it accelerates towards the horizon so the far field costs almost
 * nothing. Monotonic over [-1, 1], so the grid never folds back on itself.
 */
function stretch(u: number, radius: number): number {
  return radius * (u + u * u * u * u * u * (HORIZON_FACTOR - 1));
}

export function buildGround(
  areas: AreaFeature[],
  radius: number,
  seed: number,
  terrain: Terrain,
  waterLevels: Map<string, number> = new Map(),
): GroundMeshes {
  const group = new THREE.Group();
  group.name = 'ground';

  const texture = groundTexture();
  texture.repeat.set(radius / 6, radius / 6);

  const geoms: THREE.BufferGeometry[] = [];
  const mats: THREE.Material[] = [];

  /* --------------------------------------------------- the terrain surface */
  const cells = BASE_GRID;
  const verts = cells + 1;
  const positions = new Float32Array(verts * verts * 3);
  const colors = new Float32Array(verts * verts * 3);
  const uvs = new Float32Array(verts * verts * 2);
  const scratch = new THREE.Color();

  for (let r = 0; r < verts; r++) {
    const v = (r / cells) * 2 - 1;
    const z = stretch(v, radius);
    for (let c = 0; c < verts; c++) {
      const u = (c / cells) * 2 - 1;
      const x = stretch(u, radius);
      const i = r * verts + c;

      const h = terrain.heightAt(x, z);
      positions[i * 3] = x;
      positions[i * 3 + 1] = h;
      positions[i * 3 + 2] = z;

      // Steepness decides the surface: grass, then earth, then bare rock.
      const slope = terrain.slopeAt(x, z);
      scratch.copy(FLAT_GROUND);
      if (slope > 0.08) {
        scratch.lerp(STEEP_GROUND, Math.min(1, (slope - 0.08) / 0.22));
      }
      if (slope > 0.32) {
        scratch.lerp(CLIFF_GROUND, Math.min(1, (slope - 0.32) / 0.4));
      }
      colors[i * 3] = scratch.r;
      colors[i * 3 + 1] = scratch.g;
      colors[i * 3 + 2] = scratch.b;

      uvs[i * 2] = x / 40;
      uvs[i * 2 + 1] = z / 40;
    }
  }

  const indices: number[] = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const a = r * verts + c;
      const b = a + 1;
      const d = a + verts;
      const e = d + 1;
      // Wound so the surface faces up.
      indices.push(a, d, b, b, d, e);
    }
  }

  const baseGeom = new THREE.BufferGeometry();
  baseGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  baseGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  baseGeom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  baseGeom.setIndex(indices);
  baseGeom.computeVertexNormals();
  baseGeom.computeBoundingSphere();

  const baseMat = new THREE.MeshStandardMaterial({
    map: texture,
    vertexColors: true,
    roughness: 1,
    metalness: 0,
  });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.receiveShadow = true;
  base.name = 'ground:base';
  group.add(base);
  geoms.push(baseGeom);
  mats.push(baseMat);

  /* ------------------------------------------------------------ land cover */
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
    const isWater = area.kind === 'water';
    color.set(AREA_COLOR[area.kind]);
    const lift = AREA_LIFT[area.kind];

    // Standing water is level, and its surface goes exactly where the bed was
    // carved for it — recomputing it here from the now-carved terrain would
    // put it at the bottom of the channel instead of at the bank.
    const waterLevel = isWater
      ? waterLevels.get(area.id) ?? lowestUnder(area.ring, terrain)
      : 0;

    for (const face of tri.faces) {
      const a = tri.flat[face[0]];
      const b = tri.flat[face[1]];
      const c = tri.flat[face[2]];
      if (!a || !b || !c) continue;

      // Wind so the face points up.
      const ny = (b.y - a.y) * (c.x - a.x) - (b.x - a.x) * (c.y - a.y);
      const p0: Vec2 = [a.x, a.y];
      const p1: Vec2 = ny < 0 ? [c.x, c.y] : [b.x, b.y];
      const p2: Vec2 = ny < 0 ? [b.x, b.y] : [c.x, c.y];

      if (isWater) {
        waterPos.push(p0[0], waterLevel, p0[1], p1[0], waterLevel, p1[1], p2[0], waterLevel, p2[1]);
      } else {
        drapeTriangle(p0, p1, p2, terrain, lift, landPos, landCol, color, 0);
      }
    }

    // Scatter trees through green space, denser in woodland.
    if (area.kind === 'forest' || area.kind === 'park') {
      scatterTrees(area, area.kind === 'forest' ? 0.006 : 0.0016, rand, treeSpots);
    }
  }

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

/**
 * Emit a triangle that follows the ground, splitting it until every edge is
 * short enough that the flat piece hugs the slope. Depth is bounded so a
 * pathological polygon cannot explode the vertex count.
 */
function drapeTriangle(
  a: Vec2,
  b: Vec2,
  c: Vec2,
  terrain: Terrain,
  lift: number,
  pos: number[],
  col: number[],
  color: THREE.Color,
  depth: number,
): void {
  const longest = Math.max(
    Math.hypot(b[0] - a[0], b[1] - a[1]),
    Math.hypot(c[0] - b[0], c[1] - b[1]),
    Math.hypot(a[0] - c[0], a[1] - c[1]),
  );

  if (longest > DRAPE_MAX_EDGE_M && depth < 6) {
    const ab: Vec2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const bc: Vec2 = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
    const ca: Vec2 = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2];
    drapeTriangle(a, ab, ca, terrain, lift, pos, col, color, depth + 1);
    drapeTriangle(ab, b, bc, terrain, lift, pos, col, color, depth + 1);
    drapeTriangle(ca, bc, c, terrain, lift, pos, col, color, depth + 1);
    drapeTriangle(ab, bc, ca, terrain, lift, pos, col, color, depth + 1);
    return;
  }

  pos.push(
    a[0], terrain.heightAt(a[0], a[1]) + lift, a[1],
    b[0], terrain.heightAt(b[0], b[1]) + lift, b[1],
    c[0], terrain.heightAt(c[0], c[1]) + lift, c[1],
  );
  for (let k = 0; k < 3; k++) col.push(color.r, color.g, color.b);
}

function lowestUnder(ring: Vec2[], terrain: Terrain): number {
  let min = Infinity;
  for (const [x, z] of ring) {
    const h = terrain.heightAt(x, z);
    if (h < min) min = h;
  }
  return isFinite(min) ? min : 0;
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
