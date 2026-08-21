/**
 * The ground: one surface, with holes where the streets are.
 *
 * It is a single mesh whose grid is stretched outwards non-linearly — matched
 * to the elevation data across the loaded city, widening to hundreds of metres
 * at the horizon. That gives detail where the data actually has any, and a
 * landscape that runs to the skyline, without a separate skirt mesh and the
 * cracks that come with one.
 *
 * Two things used to be laid *over* this surface and are not any more:
 *
 * - **Land cover** was a second mesh of draped polygons, lifted clear of the
 *   ground so the two would not flicker. It is paint now (`areafield.ts`):
 *   the ground is made of grass here and gravel there, which is what land
 *   cover actually is.
 * - **Streets** are still their own geometry, because a kerb is a real edge
 *   and a mesh at four-metre spacing cannot express one. So instead the earth
 *   is *cut away* under them: where paving was laid, this mesh has no
 *   triangles at all (`streetmask.ts`). Nothing is stacked, nothing has to be
 *   lifted to stay out of anything else's way, and there is no surface hidden
 *   under the road for a car or a pedestrian to fall into.
 *
 * What remains laid over the ground is standing water, which genuinely is a
 * separate surface at its own level.
 */

import * as THREE from 'three';
import type { AreaFeature, Vec2, Waterway } from '../world/types';
import type { Terrain } from '../terrain/heightfield';
import { fbm } from '../core/noise';
import { groundTexture } from './textures';
import { emitRibbon, offsetPolyline } from './ribbon';
import type { OcclusionField } from './occlusion';
import type { StreetMask } from './streetmask';
import { AREA_COLOR, AreaField, inRing, triangulate } from './areafield';
import { groundGrid, stretch } from './groundgrid';
import { EARTH, ROCK, TURF, tintGround, tintHard } from './palette';

export interface GroundMeshes {
  group: THREE.Group;
  /** Points inside parks and woodland, for scattering trees. */
  treeSpots: Array<{ x: number; z: number; scale: number }>;
  /**
   * How many ground quads were cut away under paving.
   *
   * Reported rather than logged, because the way anything is checked in this
   * project is by asking the running app from the console. Zero on a world
   * with no streets; zero on a world *with* streets means the mask never
   * reached the mesh, which is worth knowing.
   */
  cutQuads: number;
  dispose(): void;
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
  mask: StreetMask | null = null,
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
  const { cells } = groundGrid(radius, terrain.resolution);
  const verts = cells + 1;
  const positions = new Float32Array(verts * verts * 3);
  const colors = new Float32Array(verts * verts * 3);
  const uvs = new Float32Array(verts * verts * 2);
  const scratch = new THREE.Color();
  const cover = new THREE.Color();

  // What the ground is made of, wherever the map says something. Sampled per
  // vertex rather than drawn as its own polygons, which is the whole of the
  // land-cover rewrite.
  const field = new AreaField(areas, radius);

  // The grid is symmetric, so one axis of positions serves both.
  const coord = new Float64Array(verts);
  for (let c = 0; c < verts; c++) coord[c] = stretch((c / cells) * 2 - 1, radius);

  for (let r = 0; r < verts; r++) {
    const z = coord[r];
    for (let c = 0; c < verts; c++) {
      const x = coord[c];
      const i = r * verts + c;

      const h = terrain.heightAt(x, z);
      positions[i * 3] = x;
      positions[i * 3 + 1] = h;
      positions[i * 3 + 2] = z;

      // Steepness decides the bare surface: turf, then bare earth, then rock.
      const slope = terrain.slopeAt(x, z);
      scratch.copy(TURF);
      if (slope > 0.08) {
        scratch.lerp(EARTH, Math.min(1, (slope - 0.08) / 0.22));
      }
      if (slope > 0.32) {
        scratch.lerp(ROCK, Math.min(1, (slope - 0.32) / 0.4));
      }

      // Then what the map says covers it. The blend is what the polygon edge
      // costs us: a boundary is now as sharp as the mesh, no sharper. For land
      // cover that is right — a park ends in a fence and a change of mowing.
      const amount = field.sample(x, z, cover);
      if (amount > 0.001) scratch.lerp(cover, Math.min(1, amount));

      // And then the noise field decides how dry and how mottled it is here,
      // which is what stops a square kilometre of open ground being one value.
      // Hard surfaces get the harder variation, the same as when a car park
      // was its own mesh.
      const ao = occlusion?.at(x, z) ?? 0;
      if (field.result.soft > 0.5 || amount <= 0.001) tintGround(scratch, x, z, ao);
      else tintHard(scratch, x, z, ao);
      countryside(scratch, x, z, radius);
      colors[i * 3] = scratch.r;
      colors[i * 3 + 1] = scratch.g;
      colors[i * 3 + 2] = scratch.b;

      uvs[i * 2] = x / 40;
      uvs[i * 2 + 1] = z / 40;
    }
  }

  // Triangles, minus the ones the streets have taken.
  //
  // A quad is dropped only when all four of its corners are far enough inside
  // the paving that the whole quad must be too — see `streetmask.ts` for why
  // that is a proof rather than a margin. Anything not proven stays: a cut
  // that overshoots is a window through the world to the sky, which is a far
  // worse failure than a few triangles hidden under a road.
  const indices: number[] = [];
  let cutQuads = 0;
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const a = r * verts + c;
      const b = a + 1;
      const d = a + verts;
      const e = d + 1;

      if (mask) {
        const span = Math.max(coord[c + 1] - coord[c], coord[r + 1] - coord[r]);
        if (span <= mask.maxCutSpan
          && mask.isDeep(coord[c], coord[r])
          && mask.isDeep(coord[c + 1], coord[r])
          && mask.isDeep(coord[c], coord[r + 1])
          && mask.isDeep(coord[c + 1], coord[r + 1])) {
          cutQuads++;
          continue;
        }
      }

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

  /* ------------------------------------------- standing water, and planting */
  // Water is the one land cover that is genuinely not the ground: it is a
  // level surface at its own height, with a bed carved out beneath it. So it
  // keeps its own mesh. Everything else has already been painted into the
  // ground above.
  const waterPos: number[] = [];
  const treeSpots: GroundMeshes['treeSpots'] = [];

  let treeSeed = seed >>> 0;
  const rand = () => {
    treeSeed = (treeSeed * 1664525 + 1013904223) >>> 0;
    return treeSeed / 4294967296;
  };

  for (const area of areas) {
    if (area.kind === 'water') {
      const tri = triangulate(area.ring, area.holes);
      if (!tri) continue;

      // Standing water is level, and its surface goes exactly where the bed
      // was carved for it — recomputing it here from the now-carved terrain
      // would put it at the bottom of the channel instead of at the bank.
      const waterLevel = waterLevels.get(area.id) ?? lowestUnder(area.ring, terrain);

      for (const face of tri.faces) {
        const a = tri.flat[face[0]];
        const b = tri.flat[face[1]];
        const c = tri.flat[face[2]];
        if (!a || !b || !c) continue;

        // Wind so the face points up.
        const ny = (b.y - a.y) * (c.x - a.x) - (b.x - a.x) * (c.y - a.y);
        const p1 = ny < 0 ? c : b;
        const p2 = ny < 0 ? b : c;
        waterPos.push(
          a.x, waterLevel, a.y,
          p1.x, waterLevel, p1.y,
          p2.x, waterLevel, p2.y,
        );
      }
      continue;
    }

    // Scatter trees through green space, denser in woodland.
    if (area.kind === 'forest' || area.kind === 'park') {
      scatterTrees(area, area.kind === 'forest' ? 0.006 : 0.0016, rand, treeSpots);
    }
  }

  // --- rivers and streams, which are lines rather than areas --------------
  const flowColor = AREA_COLOR.water.clone();
  for (const flow of waterways) {
    if (flow.tunnel || flow.points.length < 2) continue;
    const profile = flowLevels.get(flow.id)
      ?? flow.points.map(([x, z]) => terrain.heightAt(x, z));
    const { left, right } = offsetPolyline(flow.points, flow.width / 2);
    emitRibbon(left, right, profile, flowColor, waterPos, [], [], 8);
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
    cutQuads,
    dispose() {
      for (const g of geoms) g.dispose();
      for (const m of mats) m.dispose();
      texture.dispose();
    },
  };
}

/**
 * Beyond the city, the ground is farmland rather than lawn.
 *
 * Inside the loaded area the variation has streets and buildings to break it
 * up. Outside there is nothing at all, and the same gentle mottling that reads
 * as a lawn between two houses reads as a billiard table when it runs
 * unbroken to the horizon. Real country is parcelled: fields of different
 * crops, in different states, with hard edges between them. This is a coarse
 * imitation of that — bands wide enough to be fields, quantised so they have
 * edges — faded in from the boundary so it never touches the city itself.
 */
function countryside(out: THREE.Color, x: number, z: number, radius: number): void {
  const d = Math.hypot(x, z);
  const t = Math.min(1, Math.max(0, (d - radius * 0.9) / (radius * 0.8)));
  if (t <= 0) return;

  // fbm is not uniform over [-1, 1]: measured, it has a standard deviation of
  // 0.275 and only 15% of the ground is past 0.4. Quantising it raw put nearly
  // half the countryside in the same parcel and the rest one step away, so the
  // fields came out almost the colour of each other. Scaling to unit deviation
  // first is what makes the parcels distinct.
  const q = fbm(x * 0.72 + 5100, z * 1.35 - 2400, 320) * 3.4;
  const step = Math.max(-1, Math.min(1, Math.round(q) / 2));
  const crop = fbm(x - 9100, z + 3300, 130);
  out.lerp(FIELD_A, Math.max(0, step) * 0.7 * t);
  out.lerp(FIELD_B, Math.max(0, -step) * 0.62 * t);

  // The margin between two fields — a hedge, a ditch, a track — is what makes
  // farmland read as farmland rather than as one large lawn. It is a darker
  // line wherever the parcel function crosses from one step to the next.
  const toEdge = Math.abs(q - Math.round(q));
  const hedge = Math.max(0, 1 - toEdge / 0.07);
  out.multiplyScalar((1 + crop * 0.1 * t) * (1 - hedge * 0.3 * t));
}

const FIELD_A = new THREE.Color(0x9a9264);
const FIELD_B = new THREE.Color(0x6c7a4a);

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

