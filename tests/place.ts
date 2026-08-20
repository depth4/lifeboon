/**
 * Measure a real town, from a capture taken in the browser.
 *
 * Overpass cannot be reached from the build container, so until now every
 * measurement in this project was taken on the generated offline city — which
 * is not only unreal but the wrong *shape*: it draws long streets crossing
 * each other, where OpenStreetMap splits every street at every junction and
 * joins the pieces end to end.
 *
 * The browser can reach Overpass, so the browser exports (About → "Save this
 * place") and this reads what it wrote:
 *
 *     npm run place -- path/to/lifeboon-somewhere.json.gz
 *
 * It reports the same numbers `tests/ground.ts` reports on the synthetic
 * hillside, plus what the town is made of. Nothing here is a pass/fail: it is
 * a measurement of somewhere real, and the point is to look at it.
 */

import { gunzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

import { fromFixture, type Fixture } from '../src/data/fixture';
import { Heightfield } from '../src/terrain/heightfield';
import { carveWaterways } from '../src/terrain/elevation';
import { RoadProfiles } from '../src/world/roadprofile';
import { gradedHalfWidth, sectionHeightAt, streetSection } from '../src/world/street';
import { junctionHeightAt } from '../src/world/junctions';
import { RoadNetwork } from '../src/world/network';
import { groundGrid, shoulderFor, stretch } from '../src/render/groundgrid';
import { GRADING_GRID_M } from '../src/world/roadprofile';
import type { Vec2 } from '../src/world/types';

const path = process.argv[2];
if (!path) {
  console.error('usage: npm run place -- <capture.json.gz>');
  process.exit(2);
}

const raw = readFileSync(path);
const text = raw[0] === 0x1f && raw[1] === 0x8b
  ? gunzipSync(raw).toString('utf8') : raw.toString('utf8');
const world = fromFixture(JSON.parse(text) as Fixture);

console.log(`--- ${world.stats.placeName} ---`);
console.log(`  ${world.radius * 2} m across · ${world.roads.length} ways · `
  + `${world.buildings.length} buildings · ${world.areas.length} land-cover areas`);
console.log(`  norm ${world.norm.name} · terrain `
  + (world.terrain instanceof Heightfield
    ? `${world.terrain.resolution.toFixed(1)} m samples, `
      + `relief ${(world.terrain.maxHeight - world.terrain.minHeight).toFixed(1)} m`
    : 'flat (none loaded)'));

if (world.terrain instanceof Heightfield) {
  world.terrain = world.terrain.resampled(GRADING_GRID_M, streetBounds());
}
const grid = groundGrid(world.radius, world.terrain.resolution);
const shoulder = shoulderFor(grid.spacing);
// Exactly the order `installWorld` uses: river beds are carved before any
// profile is taken off the ground, or a road over a river is measured against
// a surface the app never had.
const water = carveWaterways(world.terrain, world.areas, world.waterways);
void water;
const profiles = new RoadProfiles(world.roads, world.terrain);
world.terrain.gradeStreets(profiles.corridors(world.roads, world.norm), shoulder);
world.terrain.gradePads(profiles.pads());

console.log(`  mesh cells ${grid.spacing.toFixed(2)} m · shoulder ${shoulder.toFixed(1)} m`);

/* ------------------------------------------------------------ the network */
const net = RoadNetwork.build(world.roads);
const turnKinds = new Map<string, number>();
for (const t of net.turns) turnKinds.set(t.kind, (turnKinds.get(t.kind) ?? 0) + 1);
let parkingKm = 0;
let trafficLanes = 0;
for (const e of net.edges) {
  for (const l of e.lanes) {
    if (l.kind === 'parking') parkingKm += e.length / 1000;
    else trafficLanes++;
  }
}
const arms = new Map<number, number>();
for (const n of net.nodes) {
  const k = n.edges.filter((e) => net.edges[e].drivable).length;
  arms.set(k, (arms.get(k) ?? 0) + 1);
}
console.log(`  network: ${net.nodes.length} nodes, ${net.edges.length} edges, `
  + `${net.streets.length} streets, ${trafficLanes} lanes, ${net.turns.length} turns `
  + `(${[...turnKinds].map(([k, n]) => `${n} ${k}`).join(', ')})`);
console.log(`  crossroads ${arms.get(4) ?? 0}, T-junctions ${arms.get(3) ?? 0}, `
  + `dead ends ${arms.get(1) ?? 0} · kerbside parking ${parkingKm.toFixed(1)} km`);
console.log(`  junctions ${profiles.junctions.length}, approaches `
  + `${profiles.junctions.reduce((n, j) => n + j.approaches.length, 0)}`);

/* --------------------------------------------- the mesh, as it would build */
const verts = grid.cells + 1;
const coord = new Float64Array(verts);
for (let i = 0; i < verts; i++) coord[i] = stretch((i / grid.cells) * 2 - 1, world.radius);
const height = new Float64Array(verts * verts);
for (let r = 0; r < verts; r++) {
  for (let c = 0; c < verts; c++) height[r * verts + c] = world.terrain.heightAt(coord[c], coord[r]);
}
const cellOf = (v: number): number => {
  if (v < coord[0] || v > coord[verts - 1]) return -1;
  let lo = 0;
  let hi = verts - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (coord[mid] <= v) lo = mid; else hi = mid;
  }
  return lo;
};
const meshAt = (x: number, z: number): number => {
  const c = cellOf(x);
  const r = cellOf(z);
  if (c < 0 || r < 0) return Number.NaN;
  const tx = (x - coord[c]) / (coord[c + 1] - coord[c]);
  const tz = (z - coord[r]) / (coord[r + 1] - coord[r]);
  const h = (col: number, row: number) => height[row * verts + col];
  if (tx + tz <= 1) {
    const a = h(c, r);
    return a + (h(c + 1, r) - a) * tx + (h(c, r + 1) - a) * tz;
  }
  const e = h(c + 1, r + 1);
  return e + (h(c, r + 1) - e) * (1 - tx) + (h(c + 1, r) - e) * (1 - tz);
};

/* ------------------------------------------- ground against what is drawn */
const straight: number[] = [];
const crossing: number[] = [];
const outside: number[] = [];
let worstAt: { x: number; z: number; gap: number; road: string } | null = null;
for (const road of world.roads) {
  if (road.bridge || road.points.length < 2) continue;
  const levels = profiles.get(road);
  if (!levels) continue;
  const section = streetSection(road, world.norm);
  const half = gradedHalfWidth(section);

  for (let i = 0; i < road.points.length - 1; i++) {
    const [ax, az] = road.points[i];
    const [bx, bz] = road.points[i + 1];
    const len = Math.hypot(bx - ax, bz - az);
    if (len < 1e-6) continue;
    const nx = (bz - az) / len;
    const nz = -(bx - ax) / len;
    const steps = Math.max(1, Math.round(len / 3));

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const cx = ax + (bx - ax) * t;
      const cz = az + (bz - az) * t;
      const crown = levels[i] + (levels[i + 1] - levels[i]) * t;

      const junction = profiles.junctions.find(
        (j) => Math.hypot(cx - j.x, cz - j.z) < j.radius);

      for (let d = -half; d <= half + 1e-6; d += 0.5) {
        const x = cx + nx * d;
        const z = cz + nz * d;
        const ground = meshAt(x, z);
        if (!Number.isFinite(ground)) continue;
        const drawn = junction
          ? junctionHeightAt(junction, x, z)
          : crown + sectionHeightAt(section, d);
        const gap = ground - drawn;
        // Past the loaded radius the ground mesh stops being a mesh of the
        // data and becomes a stretched skirt running to the horizon, with
        // cells hundreds of metres across. Ways run out there — OSM returns
        // whole ways — so those samples are counted apart rather than blamed
        // on the grading.
        const inCore = Math.abs(x) <= world.radius && Math.abs(z) <= world.radius;
        if (!inCore) outside.push(gap);
        else (junction ? crossing : straight).push(gap);
        if (inCore && (!worstAt || gap > worstAt.gap)) {
          worstAt = { x, z, gap, road: road.id };
        }
      }
    }
  }
}

const report = (name: string, deltas: number[]) => {
  if (!deltas.length) {
    console.log(`  ${name}: no samples`);
    return;
  }
  const sorted = [...deltas].sort((a, b) => a - b);
  const over = sorted.filter((d) => d > 0);
  console.log(`  ${name}: ${((over.length / sorted.length) * 100).toFixed(2)}% of `
    + `${sorted.length} samples poke through, worst ${(sorted[sorted.length - 1] * 100).toFixed(1)} cm, `
    + `typical gap ${(-sorted[Math.floor(sorted.length / 2)] * 100).toFixed(1)} cm`);
};

console.log('');
report('away from crossings', straight);
report('at a crossing      ', crossing);
report('past the loaded edge', outside);
if (worstAt) {
  console.log(`  worst inside the loaded area: ${(worstAt.gap * 100).toFixed(0)} cm `
    + `at (${worstAt.x.toFixed(0)}, ${worstAt.z.toFixed(0)}) on way ${worstAt.road}`);
}

/** Every way's extent, so the terrain is grown to cover them as the app does. */
function streetBounds(): { minX: number; maxX: number; minZ: number; maxZ: number } | undefined {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  const eat = (points: Vec2[]) => {
    for (const [x, z] of points) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
  };
  for (const r of world.roads) eat(r.points);
  for (const w of world.waterways) eat(w.points);
  return isFinite(minX) ? { minX, maxX, minZ, maxZ } : undefined;
}
