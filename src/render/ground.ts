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
import type { AreaFeature, AreaKind, Vec2, Waterway } from '../world/types';
import type { Terrain } from '../terrain/heightfield';
import { groundTexture } from './textures';
import { emitRibbon, offsetPolyline } from './roads';
import type { OcclusionField } from './occlusion';
import {
  CEMETERY, EARTH, FOREST_FLOOR, HARDSTANDING, PARK_TURF, PAVING, PITCH,
  ROCK, SAND, TURF, WATER, tintGround, tintHard,
} from './palette';

/**
 * Land cover, deliberately close to the open ground it sits on.
 *
 * These used to be a spread of saturated greens a long way apart from each
 * other and from the base ground, which made every polygon boundary a visible
 * edge — a park read as a green rectangle painted on a different green. Real
 * land cover differs in tone, not in hue: the boundary of a park is a fence
 * and a change of mowing, not a change of colour.
 */
const AREA_COLOR: Record<AreaKind, THREE.Color> = {
  water: WATER,
  park: PARK_TURF,
  forest: FOREST_FLOOR,
  grass: TURF,
  sand: SAND,
  pitch: PITCH,
  cemetery: CEMETERY,
  parking: HARDSTANDING,
  pavement: PAVING,
};

/** Which kinds are soft ground, and so get the full turf variation. */
const SOFT: ReadonlySet<AreaKind> = new Set<AreaKind>([
  'park', 'forest', 'grass', 'pitch', 'cemetery',
]);

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
  park: 0.07,
  forest: 0.07,
  grass: 0.06,
  sand: 0.08,
  pitch: 0.09,
  cemetery: 0.07,
  parking: 0.08,
  pavement: 0.09,
};

/**
 * Extra height per level of nesting.
 *
 * Land-cover polygons in OpenStreetMap sit inside one another routinely — a
 * lawn inside a park inside a recreation ground — and two overlapping surfaces
 * a centimetre apart is the same z-fighting as before, just between two greens
 * instead of green and soil. Separating by how deeply a polygon is nested puts
 * each one cleanly above whatever contains it, and nesting is rarely more than
 * two or three deep, so the stack stays shallow enough to pass under the road.
 */
const NESTING_STEP = 0.04;
const MAX_NESTING = 3;


/**
 * Grid resolution of the base mesh, per side.
 *
 * Derived from the elevation data rather than fixed, because the ground now
 * carries detail finer than the satellite ever saw: carved river beds and the
 * trench cut for every street. A mesh coarser than the field it samples cuts
 * the corners off both, and measurement found the result — the base mesh
 * standing 1.1 m above a road that the heightfield put 0.4 m below it, so
 * grass came through the asphalt at two dozen places along the river.
 *
 * Bounded at both ends: fine enough to matter, never so fine that a wide
 * city pays for detail nobody can see.
 */
const MIN_BASE_GRID = 160;
const MAX_BASE_GRID = 512;
/** How far past the loaded area the stretched grid reaches, as a multiple. */
const HORIZON_FACTOR = 5;
/**
 * Share of the grid spent on the loaded area itself.
 *
 * The rest runs out to the horizon. Getting this wrong is what caused stable
 * z-fighting across the outer half of every city: the old curve widened
 * smoothly from the centre, so by 750 m out the ground was made of 40 m
 * facets and by 1300 m of 200 m facets, while land cover was subdivided to
 * 16 m and hugged the real surface. A flat 200 m triangle misses real terrain
 * by metres, so the two surfaces crossed each other again and again.
 */
const CORE_FRACTION = 0.72;
/**
 * Subdivide a draped triangle until its edges are shorter than this. It must
 * be finer than the base mesh, or a land-cover triangle spans a whole terrain
 * cell and cuts through the surface it is supposed to lie on.
 */
const DRAPE_MAX_EDGE_M = 8;

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
 * Grid position along one axis.
 *
 * Uniform across the loaded area, at a spacing matched to the elevation data,
 * so the ground is exactly as detailed as the data it is drawn from. Only
 * beyond the data — where the heightfield clamps and we are extrapolating
 * anyway — does spacing widen, and there it widens fast so the horizon costs
 * almost nothing. Monotonic over [-1, 1], so the grid never folds back.
 */
function stretch(u: number, radius: number): number {
  const a = Math.abs(u);
  const sign = u < 0 ? -1 : 1;
  if (a <= CORE_FRACTION) return sign * (a / CORE_FRACTION) * radius;
  const t = (a - CORE_FRACTION) / (1 - CORE_FRACTION);
  return sign * radius * (1 + t * (HORIZON_FACTOR - 1) * (0.3 + 0.7 * t));
}

/**
 * How many other land-cover polygons contain this one.
 *
 * Bounding boxes filter the candidates first, so this stays cheap even with a
 * few thousand areas; only a handful survive to the point-in-polygon test.
 */
function nestingDepths(areas: AreaFeature[]): number[] {
  const boxes = areas.map((a) => {
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const [x, z] of a.ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    return { minX, maxX, minZ, maxZ, span: (maxX - minX) * (maxZ - minZ) };
  });

  return areas.map((a, i) => {
    const me = boxes[i];
    // A representative interior point: the first vertex is on the boundary, so
    // nudge towards the middle of the bounding box.
    const px = (a.ring[0][0] + (me.minX + me.maxX) / 2) / 2;
    const pz = (a.ring[0][1] + (me.minZ + me.maxZ) / 2) / 2;

    let depth = 0;
    for (let j = 0; j < areas.length && depth < MAX_NESTING; j++) {
      if (j === i) continue;
      const other = boxes[j];
      // Only something strictly larger can contain us.
      if (other.span <= me.span) continue;
      if (px < other.minX || px > other.maxX || pz < other.minZ || pz > other.maxZ) continue;
      if (inRing([px, pz], areas[j].ring)) depth++;
    }
    return depth;
  });
}

export function buildGround(
  areas: AreaFeature[],
  radius: number,
  seed: number,
  terrain: Terrain,
  waterLevels: Map<string, number> = new Map(),
  waterways: Waterway[] = [],
  flowLevels: Map<string, number[]> = new Map(),
  occlusion: OcclusionField | null = null,
): GroundMeshes {
  const group = new THREE.Group();
  group.name = 'ground';

  const texture = groundTexture();
  // The UVs below are metres/40, so a repeat of 10 puts one tile every four
  // metres. It used to be radius/6 — about 150 — which tiled the speckle every
  // 27 cm: far below a pixel at any distance you would look from, so it
  // averaged to flat grey and the ground had no detail at all.
  texture.repeat.set(10, 10);

  const geoms: THREE.BufferGeometry[] = [];
  const mats: THREE.Material[] = [];

  /* --------------------------------------------------- the terrain surface */
  // One facet per elevation sample across the loaded area, so the mesh is
  // exactly as detailed as the surface it is drawn from and no more.
  //
  // The core of the grid — a CORE_FRACTION share of the cells — spans the
  // full 2 * radius of the loaded area, not half of it. Getting that factor
  // wrong put the facets at 8 m when they were meant to be at 4, and left the
  // mesh ramping across a carved riverbank that the heightfield resolved
  // sharply: measured 4.8 m of daylight between the two at the water's edge.
  const cells = Math.max(
    MIN_BASE_GRID,
    Math.min(MAX_BASE_GRID, Math.round((2 * radius) / (CORE_FRACTION * Math.max(2, terrain.resolution)))),
  );
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

      // Steepness decides the surface: turf, then bare earth, then rock —
      // and then the noise field decides how dry and how mottled it is here,
      // which is what stops a square kilometre of open ground being one value.
      const slope = terrain.slopeAt(x, z);
      scratch.copy(TURF);
      if (slope > 0.08) {
        scratch.lerp(EARTH, Math.min(1, (slope - 0.08) / 0.22));
      }
      if (slope > 0.32) {
        scratch.lerp(ROCK, Math.min(1, (slope - 0.32) / 0.4));
      }
      tintGround(scratch, x, z, occlusion?.at(x, z) ?? 0);
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

  const depths = nestingDepths(areas);

  areas.forEach((area, areaIndex) => {
    const tri = triangulate(area.ring, area.holes);
    if (!tri) return;
    const isWater = area.kind === 'water';
    color.copy(AREA_COLOR[area.kind]);
    const soft = SOFT.has(area.kind);
    const lift = AREA_LIFT[area.kind] + depths[areaIndex] * NESTING_STEP;

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
        drapeTriangle(p0, p1, p2, terrain, lift, landPos, landCol, color, soft, occlusion, 0);
      }
    }

    // Scatter trees through green space, denser in woodland.
    if (area.kind === 'forest' || area.kind === 'park') {
      scatterTrees(area, area.kind === 'forest' ? 0.006 : 0.0016, rand, treeSpots);
    }
  });

  // --- rivers and streams, which are lines rather than areas --------------
  const flowColor = AREA_COLOR.water.clone();
  for (const flow of waterways) {
    if (flow.tunnel || flow.points.length < 2) continue;
    const profile = flowLevels.get(flow.id)
      ?? flow.points.map(([x, z]) => terrain.heightAt(x, z));
    const { left, right } = offsetPolyline(flow.points, flow.width / 2);
    emitRibbon(left, right, profile, flowColor, waterPos, [], [], 8);
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
      color: AREA_COLOR.water.clone(),
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
  soft: boolean,
  occlusion: OcclusionField | null,
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
    drapeTriangle(a, ab, ca, terrain, lift, pos, col, color, soft, occlusion, depth + 1);
    drapeTriangle(ab, b, bc, terrain, lift, pos, col, color, soft, occlusion, depth + 1);
    drapeTriangle(ca, bc, c, terrain, lift, pos, col, color, soft, occlusion, depth + 1);
    drapeTriangle(ab, bc, ca, terrain, lift, pos, col, color, soft, occlusion, depth + 1);
    return;
  }

  pos.push(
    a[0], terrain.heightAt(a[0], a[1]) + lift, a[1],
    b[0], terrain.heightAt(b[0], b[1]) + lift, b[1],
    c[0], terrain.heightAt(c[0], c[1]) + lift, c[1],
  );
  // Per vertex, not per polygon: a park the size of a district painted in one
  // value is exactly the flatness this is here to remove, and sampling the
  // same field the open ground uses means the two share their mottling across
  // the boundary instead of meeting at a visible edge.
  for (const p of [a, b, c]) {
    DRAPE_TINT.copy(color);
    const ao = occlusion?.at(p[0], p[1]) ?? 0;
    if (soft) tintGround(DRAPE_TINT, p[0], p[1], ao);
    else tintHard(DRAPE_TINT, p[0], p[1], ao);
    col.push(DRAPE_TINT.r, DRAPE_TINT.g, DRAPE_TINT.b);
  }
}

const DRAPE_TINT = new THREE.Color();

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
