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
import { RoadNetwork } from '../src/world/network';
import { placeNetwork } from '../src/world/parts/place';
import { corridorsFrom, padsFrom } from '../src/world/parts/earth';
import { PartField } from '../src/world/partfield';
import { affords, Can, ROLE_NAMES, type Role } from '../src/world/parts';
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
// The same order `installWorld` uses: network, then parts, then the earth is
// cut to what the parts decided. Measuring against anything else would be
// measuring a city the app does not build.
const net = RoadNetwork.build(world.roads);
const placed = placeNetwork(net, world.roads, world.terrain, world.norm);
const field = new PartField(placed.parts);
world.terrain.gradeStreets(corridorsFrom(placed, world.norm), shoulder);
world.terrain.gradePads(padsFrom(placed));

console.log(`  mesh cells ${grid.spacing.toFixed(2)} m · shoulder ${shoulder.toFixed(1)} m`);

/* ------------------------------------------------------------ the network */
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
const junctionParts = placed.parts.filter((p) => p.kind === 'junction');
console.log(`  parts ${placed.parts.length} `
  + `(${placed.parts.filter((p) => p.kind === 'street').length} street, `
  + `${placed.parts.filter((p) => p.kind === 'path').length} path, `
  + `${junctionParts.length} junction) · ${field.cellCount} cells`);

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
//
// Sampled from the parts themselves rather than re-swept from the ways: the
// cell whose height is compared with the ground is the very quad the renderer
// draws, so this cannot be measuring a surface the city does not have.
const straight: number[] = [];
const crossing: number[] = [];
const outside: number[] = [];
let worstAt: { x: number; z: number; gap: number; part: string } | null = null;

for (const part of placed.parts) {
  if (part.elevated) continue;
  const { rows, cols, x, y, z, cell } = part.lattice;
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const role = cell[r * (cols - 1) + c] as Role;
      // Only where somebody stands or drives. The embankment is *meant* to
      // meet the ground — that is what an embankment is.
      if (!(affords(role) & (Can.Drive | Can.Walk))) continue;
      const i0 = r * cols + c;
      const i2 = i0 + cols + 1;
      const px = (x[i0] + x[i2]) / 2;
      const pz = (z[i0] + z[i2]) / 2;
      const drawn = (y[i0] + y[i2]) / 2;
      const ground = meshAt(px, pz);
      if (!Number.isFinite(ground)) continue;
      const gap = ground - drawn;
      // Past the loaded radius the ground mesh stops being a mesh of the data
      // and becomes a stretched skirt running to the horizon, with cells
      // hundreds of metres across. Ways run out there — OSM returns whole
      // ways — so those samples are counted apart rather than blamed on the
      // grading.
      const inCore = Math.abs(px) <= world.radius && Math.abs(pz) <= world.radius;
      if (!inCore) outside.push(gap);
      else (part.kind === 'junction' ? crossing : straight).push(gap);
      if (inCore && (!worstAt || gap > worstAt.gap)) {
        worstAt = { x: px, z: pz, gap, part: part.id };
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
    + `at (${worstAt.x.toFixed(0)}, ${worstAt.z.toFixed(0)}) on ${worstAt.part}`);
}

/* ------------------------------------------------- do the parts fit together */
{
  let samples = 0;
  let sum = 0;
  let worst = 0;
  for (const [node, ports] of placed.portsByNode) {
    if (!junctionParts.some((p) => p.node === node)) continue;
    for (const port of ports) {
      const nx = port.dir[1];
      const nz = -port.dir[0];
      for (let t = -0.8; t <= 0.8; t += 0.4) {
        const bx = port.at[0] + nx * port.half * t;
        const bz = port.at[1] + nz * port.half * t;
        const a = field.sample(bx - port.dir[0] * 0.02, bz - port.dir[1] * 0.02);
        const b = field.sample(bx + port.dir[0] * 0.02, bz + port.dir[1] * 0.02);
        if (!a || !b || !(a.can & Can.Drive) || !(b.can & Can.Drive)) continue;
        const gap = Math.abs(a.y - b.y);
        samples++;
        sum += gap;
        worst = Math.max(worst, gap);
      }
    }
  }
  console.log('');
  console.log(`  junction mouths: ${samples} sampled, mean step `
    + `${((sum / Math.max(1, samples)) * 100).toFixed(2)} cm, `
    + `worst ${(worst * 100).toFixed(1)} cm`);

  let covered = 0;
  let stacked = 0;
  let doubled = 0;
  const pairs = new Map<string, number>();
  for (let i = 0; i < 200000; i++) {
    const px = (Math.random() * 2 - 1) * world.radius;
    const pz = (Math.random() * 2 - 1) * world.radius;
    const hits = field.sampleAll(px, pz);
    if (!hits.length) continue;
    covered++;
    const paved = hits.filter((h) => (h.can & Can.Paved) !== 0);
    if (paved.length < 2) continue;
    // A deck over a street is two surfaces on purpose. Everything else is two
    // things fighting for the same square metre.
    if (paved[0].y - paved[paved.length - 1].y > 2) {
      stacked++;
      continue;
    }
    doubled++;
    const key = [...new Set(paved.map((h) => ROLE_NAMES[h.role]))].sort().join(' + ');
    pairs.set(key, (pairs.get(key) ?? 0) + 1);
  }
  console.log(`  paved surface claimed twice: ${((100 * doubled) / covered).toFixed(3)}% `
    + `of ${covered} samples (a further ${((100 * stacked) / covered).toFixed(2)}% is `
    + 'a deck stacked over a street, which is right)');
  [...pairs].sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([k, n]) =>
    console.log(`    ${k.padEnd(30)} ${((100 * n) / covered).toFixed(3)}%`));
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
