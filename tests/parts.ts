/**
 * The world is made of parts, and the parts have to fit.
 *
 * These are the measurements that made the case for the layer, kept as a
 * regression test because every one of them was a real defect first:
 *
 *  - a junction and the streets that reach it must be *one* surface. Before
 *    the ports existed this seam measured 14 cm on average and 110 cm at
 *    worst, which is the "перекрёстки — отдельные плато" the user has been
 *    looking at in every screenshot.
 *  - two parts must not pave the same square metre. That was 1.26 % of the
 *    built surface before the kerb radius made junction corners a shape
 *    instead of a single degenerate point.
 *  - a car and a pedestrian must read the same fragment. There is one lookup
 *    now, so the only way they can disagree is if the affordance table is
 *    wrong.
 *
 * No browser and no screenshots: a lattice is arithmetic.
 */

import { Heightfield } from '../src/terrain/heightfield';
import { RoadNetwork } from '../src/world/network';
import { PartField } from '../src/world/partfield';
import { affords, Can, Role, ROLE_NAMES } from '../src/world/parts';
import { placeNetwork } from '../src/world/parts/place';
import { NORM_RU } from '../src/world/street';
import type { Road, Vec2 } from '../src/world/types';

let failures = 0;
function check(name: string, ok: boolean, got?: unknown): void {
  if (ok) {
    console.log(`  ok   ${name}`);
  } else {
    failures++;
    console.log(`  FAIL ${name}${got === undefined ? '' : ` -> ${JSON.stringify(got)}`}`);
  }
}

/** A hillside with a fold in it: flat ground proves nothing about heights. */
function makeTerrain(span = 1400, spacing = 4): Heightfield {
  const n = Math.round(span / spacing) + 1;
  const data = new Float32Array(n * n);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const x = -span / 2 + c * spacing;
      const z = -span / 2 + r * spacing;
      data[r * n + c] = x * 0.06 + Math.sin(x / 90) * 7 + Math.cos(z / 70) * 5 + z * 0.02;
    }
  }
  return new Heightfield(data, n, n, -span / 2, -span / 2, spacing);
}

let nextId = 0;
function way(points: Vec2[], over: Partial<Road> = {}): Road {
  return {
    id: `w${nextId++}`, points, cls: 'residential', width: 6.5, lanes: 2, oneway: false,
    layer: 0, bridge: false, tunnel: false, walkable: true, drivable: true,
    isSidewalkLine: false, isCrossing: false, ...over,
  };
}

/**
 * A grid the way OpenStreetMap stores one: every street cut at every junction,
 * the pieces sharing their end points. The offline generator draws long ways
 * crossing *through* each other, which is the easy case and not the real one.
 */
function osmGrid(): Road[] {
  const roads: Road[] = [];
  const along = [-600, -400, -200, 0, 200, 400, 600];
  const across = [-600, -300, 0, 300, 600];
  for (const z of across) {
    for (let i = 0; i < along.length - 1; i++) {
      roads.push(way(
        [[along[i], z], [(along[i] + along[i + 1]) / 2, z], [along[i + 1], z]],
        {
          name: `Row ${z}`,
          cls: z === 0 ? 'secondary' : 'residential',
          width: z === 0 ? 11 : 6.5,
        },
      ));
    }
  }
  for (const x of along) {
    for (let i = 0; i < across.length - 1; i++) {
      roads.push(way([[x, across[i]], [x, (across[i] + across[i + 1]) / 2], [x, across[i + 1]]],
        { name: `Col ${x}` }));
    }
  }
  return roads;
}

const terrain = makeTerrain();
const roads = osmGrid();
const net = RoadNetwork.build(roads);
const placed = placeNetwork(net, roads, terrain, NORM_RU);
const field = new PartField(placed.parts);

const streets = placed.parts.filter((p) => p.kind === 'street');
const junctions = placed.parts.filter((p) => p.kind === 'junction');
const crossroads = net.nodes.filter((n) => n.edges.length >= 3).length;

console.log('--- what got placed ---');
console.log(`  ${net.nodes.length} nodes, ${net.edges.length} edges -> `
  + `${streets.length} street parts, ${junctions.length} junction parts, `
  + `${field.cellCount} cells`);
check('every drivable edge became a street part', streets.length === net.edges.length,
  { streets: streets.length, edges: net.edges.length });
check('every node with three arms became a junction', junctions.length === crossroads,
  { junctions: junctions.length, crossroads });

/* ------------------------------------------ the seam a junction makes */

console.log('--- a junction and its streets are one surface ---');
{
  let samples = 0;
  let sum = 0;
  let worst = 0;
  for (const [node, ports] of placed.portsByNode) {
    if (!junctions.some((p) => p.node === node)) continue;
    for (const port of ports) {
      const nx = port.dir[1];
      const nz = -port.dir[0];
      for (let s = -0.8; s <= 0.8; s += 0.4) {
        const bx = port.at[0] + nx * port.half * s;
        const bz = port.at[1] + nz * port.half * s;
        const inside = field.sample(bx - port.dir[0] * 0.02, bz - port.dir[1] * 0.02);
        const outside = field.sample(bx + port.dir[0] * 0.02, bz + port.dir[1] * 0.02);
        if (!inside || !outside) continue;
        // What a car crosses. A kerb standing above the channel beside it is
        // not a defect, it is a kerb.
        if (!(inside.can & Can.Drive) || !(outside.can & Can.Drive)) continue;
        const gap = Math.abs(inside.y - outside.y);
        samples++;
        sum += gap;
        worst = Math.max(worst, gap);
      }
    }
  }
  const mean = sum / Math.max(1, samples);
  console.log(`  ${samples} mouths sampled: mean step ${(mean * 100).toFixed(2)} cm, `
    + `worst ${(worst * 100).toFixed(2)} cm`);
  check('every mouth was reachable from both sides', samples > 100, samples);
  check('the mean step at a mouth is under a centimetre', mean < 0.01, mean);
  check('the worst step at a mouth is under five centimetres', worst < 0.05, worst);
}

/* ---------------------------------------------- nobody paves it twice */

console.log('--- one square metre, one owner ---');
{
  let covered = 0;
  let twice = 0;
  let pavedTwice = 0;
  const rng = mulberry(20250821);
  for (let i = 0; i < 300000; i++) {
    const x = (rng() * 2 - 1) * 700;
    const z = (rng() * 2 - 1) * 700;
    const hits = field.sampleAll(x, z);
    if (!hits.length) continue;
    covered++;
    if (hits.length > 1) {
      twice++;
      // Two embankments meeting is earthwork, not a doubled surface. Two
      // *paved* things over one point is the bug this layer exists to stop.
      const paved = hits.filter((h) => (h.can & Can.Paved) !== 0).length;
      if (paved > 1) pavedTwice++;
    }
  }
  const anyShare = twice / covered;
  const pavedShare = pavedTwice / covered;
  console.log(`  ${covered} covered samples: ${(100 * anyShare).toFixed(2)}% claimed twice, `
    + `${(100 * pavedShare).toFixed(2)}% paved twice`);
  check('under 1% of the built surface is claimed twice at all', anyShare < 0.01, anyShare);
  check('under 0.2% of it is paved twice', pavedShare < 0.002, pavedShare);
}

/* ------------------------------------------ read by a car and on foot */

console.log('--- one fragment, read by a car and by a pedestrian ---');
{
  let carriageway = 0;
  let numbered = 0;
  let walkable = 0;
  let drivable = 0;
  const rng = mulberry(7);
  for (let i = 0; i < 200000; i++) {
    const x = (rng() * 2 - 1) * 700;
    const z = (rng() * 2 - 1) * 700;
    const hit = field.sample(x, z);
    if (!hit) continue;
    if (hit.can & Can.Drive) drivable++;
    if (hit.can & Can.Walk) walkable++;
    if (hit.role === Role.Carriageway) {
      carriageway++;
      if (hit.lane >= 0) numbered++;
    }
  }
  console.log(`  drivable ${drivable}, walkable ${walkable}, `
    + `carriageway ${carriageway} of which ${numbered} in a numbered lane`);
  check('a car finds tarmac', drivable > 1000, drivable);
  check('a pedestrian finds somewhere to walk', walkable > 1000, walkable);
  check('every point of carriageway knows which lane it is',
    carriageway > 0 && numbered === carriageway, { carriageway, numbered });
}

console.log('--- what may be done where ---');
{
  const table: Array<[Role, number, number]> = [
    [Role.Carriageway, Can.Drive | Can.Paved, Can.Walk],
    [Role.Parking, Can.Drive | Can.Park | Can.Paved, Can.Walk],
    [Role.Pavement, Can.Walk | Can.Paved, Can.Drive],
    [Role.Verge, Can.Walk, Can.Drive | Can.Paved],
    [Role.Crossing, Can.Drive | Can.Walk | Can.Paved, 0],
    [Role.Batter, 0, Can.Drive | Can.Walk | Can.Paved],
  ];
  for (const [role, must, mustNot] of table) {
    const can = affords(role);
    check(`${ROLE_NAMES[role]}: what it affords`,
      (can & must) === must && (can & mustNot) === 0, can);
  }
}

/* ------------------------------------------------------- a lone T junction */

console.log('--- a T junction, on its own ---');
{
  const t = [
    way([[-100, 0], [0, 0]], { name: 'Through' }),
    way([[0, 0], [100, 0]], { name: 'Through' }),
    way([[0, 0], [0, 100]], { name: 'Side' }),
  ];
  const tnet = RoadNetwork.build(t);
  const tplaced = placeNetwork(tnet, t, makeTerrain(400), NORM_RU);
  const pad = tplaced.parts.find((p) => p.kind === 'junction');
  check('the T is one junction part', !!pad);
  if (pad) {
    const spanX = pad.maxX - pad.minX;
    const spanZ = pad.maxZ - pad.minZ;
    console.log(`  pad ${spanX.toFixed(1)} m by ${spanZ.toFixed(1)} m, `
      + `${pad.lattice.cols - 1} cells round the ring`);
    // Wide enough for a corner radius, and nowhere near "half a block".
    check('the pad is bigger than the streets that make it', spanX > 7 && spanZ > 7,
      { spanX, spanZ });
    check('and it is not half a block wide', spanX < 30 && spanZ < 30, { spanX, spanZ });
    check('its arms all stop at it', pad.ports.every((p) => p.stop > 0),
      pad.ports.map((p) => p.stop));
  }
}

/* ------------------------------------------------ a bridge is not a junction */

console.log('--- a bridge passes, it does not meet ---');
{
  const b = [
    way([[-100, 0], [0, 0], [100, 0]], { name: 'Under' }),
    way([[0, -100], [0, 0], [0, 100]], { name: 'Over', bridge: true, layer: 1 }),
  ];
  const bnet = RoadNetwork.build(b);
  const bplaced = placeNetwork(bnet, b, makeTerrain(400), NORM_RU);
  const bfield = new PartField(bplaced.parts);
  const hits = bfield.sampleAll(0, 0);
  console.log(`  over the crossing point: ${hits.length} surfaces, `
    + hits.map((h) => `${ROLE_NAMES[h.role]}@${h.y.toFixed(2)}`).join(', '));
  check('both the deck and the street below are there', hits.length >= 2, hits.length);
  if (hits.length >= 2) {
    check('the deck stands clear of the street it flies over',
      hits[0].y - hits[hits.length - 1].y > 3, hits[0].y - hits[hits.length - 1].y);
    const under = bfield.sampleNear(0, 0, hits[hits.length - 1].y);
    check('a car underneath is given the street, not the deck',
      !!under && Math.abs(under.y - hits[hits.length - 1].y) < 0.01);
  }
}

/** A small deterministic generator, so a failure can be reproduced. */
function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

console.log(failures === 0 ? '\nall parts checks passed' : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
