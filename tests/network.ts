/**
 * The road network has to be a network.
 *
 * Everything the simulation will ever want to do with traffic — route a car,
 * hold a movement at a signal, give way, park at a kerb — reads this model, so
 * the things that must be true of it are worth stating as arithmetic rather
 * than hoping. Two shapes are tested, because they are the two the world comes
 * in and they behave differently: the way OpenStreetMap stores a crossroads
 * (four ways meeting at one shared node) and the way the offline generator
 * stores one (two long ways crossing through each other).
 */

import { RoadNetwork } from '../src/world/network';
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

function way(id: string, points: Vec2[], over: Partial<Road> = {}): Road {
  return {
    id, points, cls: 'residential', width: 6.5, lanes: 2, oneway: false,
    layer: 0, bridge: false, tunnel: false, walkable: true, drivable: true,
    isSidewalkLine: false, isCrossing: false, ...over,
  };
}

/* --------------------------------------------------- a crossroads, both ways */

console.log('--- a crossroads, however the map stores it ---');
{
  // Four ways meeting at one shared node: what OpenStreetMap actually writes.
  const osm = [
    way('n', [[0, -120], [0, -40], [0, 0]], { name: 'Main' }),
    way('s', [[0, 0], [0, 40], [0, 120]], { name: 'Main' }),
    way('e', [[0, 0], [40, 0], [120, 0]], { name: 'Cross' }),
    way('w', [[-120, 0], [-40, 0], [0, 0]], { name: 'Cross' }),
  ];
  // Two long ways crossing through: what the offline generator writes.
  const generated = [
    way('ns', [[0, -120], [0, 0], [0, 120]], { name: 'Main' }),
    way('ew', [[-120, 0], [0, 0], [120, 0]], { name: 'Cross' }),
  ];

  for (const [label, roads] of [['OSM style', osm], ['generated', generated]] as const) {
    const net = RoadNetwork.build(roads);
    const middle = net.nodes.findIndex((n) => Math.hypot(n.x, n.z) < 0.5);
    const arms = middle >= 0 ? net.nodes[middle].edges.length : 0;
    console.log(`  ${label}: ${net.nodes.length} nodes, ${net.edges.length} edges, `
      + `${net.streets.length} streets, ${net.turns.length} turns`);
    check(`${label}: the crossing is one node`, middle >= 0);
    check(`${label}: with four arms on it`, arms === 4, arms);
    check(`${label}: two streets, not four ways`, net.streets.length === 2, net.streets.length);
  }
}

/* ------------------------------------------------------------------ turns */

console.log('\n--- movements through a crossroads ---');
{
  const net = RoadNetwork.build([
    way('n', [[0, -120], [0, 0]], { name: 'Main' }),
    way('s', [[0, 0], [0, 120]], { name: 'Main' }),
    way('e', [[0, 0], [120, 0]], { name: 'Cross' }),
    way('w', [[-120, 0], [0, 0]], { name: 'Cross' }),
  ]);
  const middle = net.nodes.findIndex((n) => Math.hypot(n.x, n.z) < 0.5);
  const here = net.turns.filter((t) => t.node === middle);
  const kinds = new Map<string, number>();
  for (const t of here) kinds.set(t.kind, (kinds.get(t.kind) ?? 0) + 1);
  console.log(`  ${here.length} movements: `
    + [...kinds].map(([k, n]) => `${k} ${n}`).join(', '));

  // Four arms, one lane each way: from each arm you may go left, right or on.
  check('every arm can go three ways', here.length === 12, here.length);
  check('and none of them is a U-turn', !here.some((t) => t.kind === 'uturn'));
  check('left, right and straight are all represented',
    kinds.get('left') === 4 && kinds.get('right') === 4 && kinds.get('straight') === 4,
    Object.fromEntries(kinds));
  check('every movement goes from one arm to a different one',
    here.every((t) => t.fromEdge !== t.toEdge));
  check('and every movement lands on a lane that leaves this node',
    here.every((t) => {
      const to = net.edges[t.toEdge];
      const lane = to.lanes[t.toLane];
      return lane !== undefined && (to.from === middle) === lane.forward;
    }));

  // A dead end is the one place turning round is allowed.
  const stub = RoadNetwork.build([way('only', [[0, 0], [60, 0]], { name: 'Stub' })]);
  const ends = stub.turns.filter((t) => t.kind === 'uturn');
  check('a dead end lets you turn round', ends.length > 0, ends.length);
}

/* ----------------------------------------------------------------- lanes */

console.log('\n--- lanes ---');
{
  const net = RoadNetwork.build([
    way('two-way', [[0, 0], [200, 0]], { name: 'Wide', cls: 'secondary', width: 9.5 }),
    way('one-way', [[0, 60], [200, 60]], { name: 'Narrow', width: 6.5, oneway: true }),
  ]);
  const wide = net.edges.find((e) => net.streets[e.street].name === 'Wide')!;
  const narrow = net.edges.find((e) => net.streets[e.street].name === 'Narrow')!;

  const driving = (e: typeof wide) => e.lanes.filter((l) => l.kind === 'driving');
  const parked = (e: typeof wide) => e.lanes.filter((l) => l.kind === 'parking');

  console.log(`  9.5 m secondary: ${driving(wide).length} traffic lanes, `
    + `${parked(wide).length} parking; 6.5 m one-way: `
    + `${driving(narrow).length} traffic, ${parked(narrow).length} parking`);

  check('a two-way street has lanes in both directions',
    driving(wide).some((l) => l.forward) && driving(wide).some((l) => !l.forward));
  check('a one-way street has lanes in one',
    driving(narrow).every((l) => l.forward));
  check('parking is taken out of the street, not added to it',
    net.edges.every((e) => {
      const total = e.lanes.reduce((sum, l) => sum + l.width, 0);
      return Math.abs(total - e.width) < 0.01;
    }));
  check('a narrow street still gets somewhere to park',
    parked(narrow).length >= 1, parked(narrow).length);
  check('and what is left still carries traffic',
    driving(narrow).reduce((sum, l) => sum + l.width, 0) >= 4,
    driving(narrow).reduce((sum, l) => sum + l.width, 0));
  check('every lane is numbered from the kerb it belongs to',
    driving(wide).filter((l) => l.forward).map((l) => l.fromKerb).sort().join() === '0,1');
}

/* -------------------------------------------------------- street identity */

console.log('\n--- one street, one width ---');
{
  // The complaint that started this: pieces of one street disagreeing. Where
  // the class is the same the street wins; where the class changes, the map is
  // telling us the road really is bigger and it is allowed to.
  const mistagged = RoadNetwork.build([
    way('a', [[0, 0], [300, 0]], { name: 'Serova', width: 6.5 }),
    way('b', [[300, 0], [340, 0]], { name: 'Serova', width: 9.5 }),
  ]);
  const widths = new Set(mistagged.edges.map((e) => e.width));
  check('a short mis-tagged stub yields to the rest of its street',
    widths.size === 1 && widths.has(6.5), [...widths]);

  const reclassed = RoadNetwork.build([
    way('a', [[0, 0], [300, 0]], { name: 'Serova', width: 6.5 }),
    way('b', [[300, 0], [640, 0]], { name: 'Serova', width: 9.5, cls: 'secondary' }),
  ]);
  check('but a change of class is allowed to change the width',
    new Set(reclassed.edges.map((e) => e.width)).size === 2);
}

console.log(failures ? `\n${failures} FAILURE(S)` : '\nall checks passed');
if (failures) process.exit(1);
