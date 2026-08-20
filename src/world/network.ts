/**
 * The road network: one model, built once, that everything else reads.
 *
 * Until this existed, a road was a polyline plus tags exactly as OpenStreetMap
 * drew it, and every part of the app worked out for itself what that meant.
 * The pedestrian graph welded coincident points at 0.6 m; the junction builder
 * intersected segments and clustered at 6 m; the road index had no notion of
 * connection at all. Three answers to "where do streets meet", none of them
 * agreeing, and so nowhere for a traffic light to stand — a signal has to be
 * *on* a node, and there was no one node to be on.
 *
 * Why it has to look like this, rather than like a city-building game: a
 * builder authors its own data. You click, it creates the node, and nothing is
 * ever ambiguous. We import a few hundred polylines somebody else drew, with
 * no promise that what looks joined is joined. So reading the data cannot be
 * skipped — but it can be done **once**, into the model a builder would have
 * had from the start.
 *
 * What is in here that nothing consumes yet — lanes, parking lanes, and the
 * turns between them — is deliberate. The instruction was to build with room
 * for real traffic: *"Твоя задача в будущем полностью имитировать движение
 * машин в городе, реалистичное насколько это возможно. Строй с запасом под
 * это."* Without lanes there is nothing for a car to sit in, nothing to
 * overtake into, nowhere to park, and no way to say which movement a signal is
 * holding. Adding them later means rebuilding everything above them.
 *
 * See `docs/ROAD-NETWORK.md` for the decision, the measurements behind it and
 * the order the rest is being migrated in.
 */

import type { Road, RoadClass, Vec2 } from './types';

/** Points this close together are the same place. Matches the nav graph. */
const WELD_M = 0.6;
/** Below this a movement counts as straight on rather than a turn. */
const STRAIGHT_RAD = 0.45;
/** Past this the movement is a turn back the way you came. */
const UTURN_RAD = 2.6;
/** Metres of carriageway per traffic lane. */
const LANE_M = 3.25;
/** A car parked at the kerb takes about this much of the street. */
const PARKING_LANE_M = 2.2;

export interface NetNode {
  x: number;
  z: number;
  /** Edges that begin or end here. */
  edges: number[];
}

export type LaneKind = 'driving' | 'parking';

export interface Lane {
  kind: LaneKind;
  /** True when this lane runs the way the edge is drawn. */
  forward: boolean;
  /** Metres across. */
  width: number;
  /**
   * Position across the carriageway counted from the kerb on the driving
   * side: 0 is the nearside lane, the one a car turning off uses where
   * traffic keeps right. Parking lanes are not numbered — they are -1.
   */
  fromKerb: number;
}

export interface NetEdge {
  from: number;
  to: number;
  /** Geometry from `from` to `to`, both nodes included. */
  points: Vec2[];
  length: number;
  /** Index into `streets`. */
  street: number;
  /** The OSM way this came from, for tags and names. */
  road: number;
  cls: RoadClass;
  /** Carriageway width, taken from the street rather than from this piece. */
  width: number;
  oneway: boolean;
  bridge: boolean;
  tunnel: boolean;
  layer: number;
  drivable: boolean;
  /** Empty for footways. Ordered left to right as the edge is drawn. */
  lanes: Lane[];
}

export interface Street {
  name?: string;
  cls: RoadClass;
  /** One width for the whole street, whatever its pieces claimed. */
  width: number;
  /** Traffic lanes, both directions together. */
  lanes: number;
  oneway: boolean;
  edges: number[];
}

export type TurnKind = 'straight' | 'left' | 'right' | 'uturn';

/**
 * One legal movement through a node, lane to lane.
 *
 * Nothing reads these yet. They are the shape a traffic light, a give-way rule
 * and a routed car all need: "from this lane of this edge you may enter that
 * lane of that edge" — a thing that can be held, metered or forbidden.
 */
export interface Turn {
  node: number;
  fromEdge: number;
  fromLane: number;
  toEdge: number;
  toLane: number;
  /** Signed, radians: the sign says which way the driver turns. */
  angle: number;
  kind: TurnKind;
}

export interface NetworkOptions {
  /** Right-hand traffic. Decides which side the nearside lane is on. */
  driveOnRight?: boolean;
  /**
   * Whether to give streets kerbside parking where the class allows it.
   *
   * It has to be invented. OpenStreetMap maps kerbside parking with
   * `parking:lane:*` tags on the street, and Alapaevsk — a town of 37 000 —
   * has four mapped parking areas in three kilometres and no lane tags at
   * all, while the street view shows cars at the kerb on every block.
   */
  parking?: boolean;
}

export class RoadNetwork {
  readonly nodes: NetNode[] = [];
  readonly edges: NetEdge[] = [];
  readonly streets: Street[] = [];
  readonly turns: Turn[] = [];
  readonly driveOnRight: boolean;

  private constructor(driveOnRight: boolean) {
    this.driveOnRight = driveOnRight;
  }

  static build(roads: Road[], options: NetworkOptions = {}): RoadNetwork {
    const driveOnRight = options.driveOnRight ?? true;
    const net = new RoadNetwork(driveOnRight);
    const nodeAt = weldNodes(roads, net);
    splitIntoEdges(roads, net, nodeAt);
    groupIntoStreets(net, roads);
    layOutLanes(net, driveOnRight, options.parking ?? true);
    connectTurns(net, driveOnRight);
    return net;
  }

  /** Unit direction of an edge at whichever end meets `node`, pointing away. */
  directionAt(edge: number, node: number): Vec2 {
    const e = this.edges[edge];
    const pts = e.points;
    const [a, b] = e.from === node
      ? [pts[0], pts[1]]
      : [pts[pts.length - 1], pts[pts.length - 2]];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const len = Math.hypot(dx, dz) || 1;
    return [dx / len, dz / len];
  }
}

/* ------------------------------------------------------------- topology */

const cellKey = (x: number, z: number): string =>
  `${Math.round(x / WELD_M)},${Math.round(z / WELD_M)}`;

/**
 * Weld coincident way points into nodes.
 *
 * This is the method the data actually supports: OpenStreetMap joins ways by
 * giving them a shared node, not by making them cross. Checked against the
 * alternative on a real town — intersecting the segments instead finds 454 of
 * the 458 places where two at-grade drivable ways share a point, so it is not
 * *wrong*, it is a second answer to a question the data already answers.
 *
 * A point becomes a node when more than one way touches it, or when it is the
 * end of a way: a dead end is a place too, and an edge has to finish
 * somewhere.
 */
function weldNodes(roads: Road[], net: RoadNetwork): Map<string, number> {
  const touching = new Map<string, Set<number>>();
  const ends = new Set<string>();

  roads.forEach((road, index) => {
    if (road.points.length < 2) return;
    road.points.forEach((p, i) => {
      const k = cellKey(p[0], p[1]);
      let set = touching.get(k);
      if (!set) touching.set(k, (set = new Set()));
      set.add(index);
      if (i === 0 || i === road.points.length - 1) ends.add(k);
    });
  });

  const nodeAt = new Map<string, number>();
  for (const [k, ways] of touching) {
    if (ways.size < 2 && !ends.has(k)) continue;
    nodeAt.set(k, net.nodes.length);
    net.nodes.push({ x: 0, z: 0, edges: [] });
  }

  // A node sits on a point that is really on the ways, not at the centre of
  // whatever cell the welding happened to put it in.
  for (const road of roads) {
    for (const p of road.points) {
      const at = nodeAt.get(cellKey(p[0], p[1]));
      if (at === undefined) continue;
      net.nodes[at].x = p[0];
      net.nodes[at].z = p[1];
    }
  }
  return nodeAt;
}

/** Cut every way at its nodes; each piece between two nodes is an edge. */
function splitIntoEdges(roads: Road[], net: RoadNetwork, nodeAt: Map<string, number>): void {
  roads.forEach((road, index) => {
    if (road.points.length < 2) return;

    let start = 0;
    for (let i = 1; i < road.points.length; i++) {
      const here = nodeAt.get(cellKey(road.points[i][0], road.points[i][1]));
      if (here === undefined) continue;

      const from = nodeAt.get(cellKey(road.points[start][0], road.points[start][1]));
      if (from === undefined || from === here) {
        start = i;
        continue;
      }

      const points = road.points.slice(start, i + 1);
      let length = 0;
      for (let k = 0; k < points.length - 1; k++) {
        length += Math.hypot(
          points[k + 1][0] - points[k][0], points[k + 1][1] - points[k][1]);
      }
      if (length < 0.2) {
        start = i;
        continue;
      }

      const edge = net.edges.length;
      net.edges.push({
        from,
        to: here,
        points,
        length,
        street: -1,
        road: index,
        cls: road.cls,
        width: road.width,
        oneway: road.oneway,
        bridge: road.bridge,
        tunnel: road.tunnel,
        layer: road.layer,
        drivable: road.drivable,
        lanes: [],
      });
      net.nodes[from].edges.push(edge);
      net.nodes[here].edges.push(edge);
      start = i;
    }
  });
}

/* -------------------------------------------------------------- streets */

/**
 * Gather edges into streets, and make each street one thing.
 *
 * Grouped by name **and class**, and the reason is a measurement that
 * overturned the rule this was first written to enforce. The complaint was a
 * street that visibly widens halfway along — улица Серова, 6.5 m becoming
 * 9.5 m — and the instruction was that the data must be wrong and we should
 * correct it. It is not wrong. Alapaevsk has no `width` tag on a single
 * street: every width in the town is this project's own default for the
 * class, and Серова is two ways, one tagged `residential` and one tagged
 * `secondary`. The map is saying the road really does get bigger there,
 * which it does.
 *
 * So a change of class is allowed to change the width, and what has to be
 * fixed is the *step*: a real road widens over tens of metres, not at a point.
 * That taper belongs to the geometry and is not done here. What is fixed here
 * is the other case — pieces of one street, all the same class, disagreeing —
 * where the value covering the most metres wins, so a short mis-tagged stub
 * yields to the rest of the street rather than the other way about.
 *
 * Only named streets are gathered. An unnamed service road is its own thing:
 * welding every unnamed lane in a district into one "street" would invent an
 * identity the data never claimed.
 */
function groupIntoStreets(net: RoadNetwork, roads: Road[]): void {
  const groups = new Map<string, number[]>();
  const loose: number[] = [];

  net.edges.forEach((edge, index) => {
    const name = roads[edge.road].name?.trim();
    if (!name) {
      loose.push(index);
      return;
    }
    const key = `${name} ${edge.cls} ${edge.bridge} ${edge.tunnel}`;
    const list = groups.get(key) ?? [];
    list.push(index);
    groups.set(key, list);
  });

  const add = (edges: number[], name?: string) => {
    const width = commonest(edges.map((e) => [net.edges[e].width, net.edges[e].length]));
    const cls = commonest(edges.map((e) => [net.edges[e].cls, net.edges[e].length]));
    const oneway = commonest(edges.map((e) => [net.edges[e].oneway, net.edges[e].length]));
    const street = net.streets.length;
    net.streets.push({
      name, cls, width, oneway, lanes: laneCount(cls, width, oneway), edges,
    });
    for (const e of edges) {
      net.edges[e].street = street;
      net.edges[e].width = width;
      net.edges[e].cls = cls;
      net.edges[e].oneway = oneway;
    }
  };

  for (const [key, edges] of groups) add(edges, key.split(' ')[0]);
  for (const edge of loose) add([edge]);
}

/** The value covering the most metres. */
function commonest<T>(weighted: Array<[T, number]>): T {
  const total = new Map<T, number>();
  for (const [value, weight] of weighted) {
    total.set(value, (total.get(value) ?? 0) + weight);
  }
  let best = weighted[0][0];
  let most = -1;
  for (const [value, weight] of total) {
    if (weight > most) {
      most = weight;
      best = value;
    }
  }
  return best;
}

/**
 * How many traffic lanes a street has.
 *
 * OSM's `lanes` tag is unreliable and usually missing — in Alapaevsk it is
 * present on four ways out of 341 — so this comes from the width and the
 * class, which is what a surveyor would do from a photograph: about 3.25 m of
 * carriageway per lane, never fewer than one each way on a two-way street.
 */
function laneCount(cls: RoadClass, width: number, oneway: boolean): number {
  if (!CARRIES_TRAFFIC.has(cls)) return 0;
  const byWidth = Math.round(width / LANE_M);
  return Math.max(oneway ? 1 : 2, Math.min(8, byWidth));
}

const CARRIES_TRAFFIC: ReadonlySet<RoadClass> = new Set<RoadClass>([
  'motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'residential', 'service',
]);

/**
 * Streets that get cars parked along them, and on how many sides.
 *
 * Invented, because the map does not say. Kerbside parking is mapped with
 * `parking:lane:*` tags, and a Russian town of 37 000 has none of them — four
 * mapped parking areas in three kilometres, 1 566 m² between them — while the
 * street view of the same town has a car at the kerb on almost every
 * residential block. A city with no parked cars reads as a model of a city.
 *
 * **A parking lane is taken out of the street, not added to it.** That is the
 * whole difference between this being right and being nonsense: written the
 * other way it widened every residential street in Alapaevsk by four metres
 * and claimed 174 km of kerbside parking, which is 29 000 cars in a town of
 * 37 000 people. On a 6.5 m street nobody builds a lay-by — the car stands on
 * the carriageway and everyone else squeezes past, which is exactly what the
 * street view shows. A proper bay cut into the pavement is a different thing
 * and belongs to the few places the map really marks.
 */
const PARKING_SIDES: Partial<Record<RoadClass, number>> = {
  primary: 1,
  secondary: 1,
  tertiary: 2,
  residential: 2,
};
/**
 * How much carriageway has to survive a parked car.
 *
 * Not "the street must be wide enough to spare a lane" — that rule gave a
 * 6.5 m residential street no parking at all, and the street view of exactly
 * such a street has a car at the kerb on every block. What actually happens is
 * that the car stands there and the remaining four metres carry both
 * directions, one at a time. Four metres is the floor: below it the street is
 * a single track and a parked car closes it.
 */
const PARKING_MIN_TRAFFIC_M = 4;

/* ---------------------------------------------------------------- lanes */

/**
 * Lay lanes across each edge.
 *
 * Ordered left to right as the edge is drawn, which is the order a renderer
 * wants; each traffic lane also knows how far it is from the kerb on the
 * driving side, which is the order the rules of the road are written in — the
 * nearside lane is the one that turns off, the offside one turns across.
 *
 * Parking lanes sit outside the traffic lanes, against the kerb, because that
 * is where a parked car is. They are lanes rather than scenery so that a car
 * can later be told to occupy one, pull out of one, or be blocked by one.
 */
function layOutLanes(net: RoadNetwork, driveOnRight: boolean, parking: boolean): void {
  for (const edge of net.edges) {
    const street = net.streets[edge.street];
    if (!street || street.lanes === 0) continue;

    // How much of the street is given over to parked cars, and how much is
    // left to drive on. Taken out of the width, never added to it.
    const wanted = parking && !edge.bridge && !edge.tunnel
      ? PARKING_SIDES[street.cls] ?? 0 : 0;
    const spare = edge.width - PARKING_MIN_TRAFFIC_M;
    const sides = Math.max(0, Math.min(wanted, Math.floor(spare / PARKING_LANE_M)));
    const carriageway = edge.width - sides * PARKING_LANE_M;

    const traffic = street.lanes;
    const width = carriageway / traffic;
    const backward = street.oneway ? 0 : Math.floor(traffic / 2);
    const lanes: Lane[] = [];

    for (let i = 0; i < traffic; i++) {
      // With traffic on the right, the lanes on the left of the drawn
      // direction are the oncoming ones.
      const forward = driveOnRight ? i >= backward : i < traffic - backward;
      lanes.push({ kind: 'driving', forward, width, fromKerb: 0 });
    }

    // Distance from the kerb, counted separately for each direction.
    let f = 0;
    let b = 0;
    for (let i = 0; i < traffic; i++) {
      const lane = driveOnRight ? lanes[traffic - 1 - i] : lanes[i];
      if (lane.forward) lane.fromKerb = f++;
    }
    for (let i = 0; i < traffic; i++) {
      const lane = driveOnRight ? lanes[i] : lanes[traffic - 1 - i];
      if (!lane.forward) lane.fromKerb = b++;
    }

    if (sides >= 1) {
      lanes.push({ kind: 'parking', forward: true, width: PARKING_LANE_M, fromKerb: -1 });
    }
    if (sides >= 2) {
      lanes.unshift({ kind: 'parking', forward: false, width: PARKING_LANE_M, fromKerb: -1 });
    }
    edge.lanes = lanes;
  }
}

/* ---------------------------------------------------------------- turns */

/**
 * Every legal movement through every node.
 *
 * Lane assignment follows the ordinary convention: the nearside lane may turn
 * off or continue, the offside lane may turn across or continue, and where
 * there is one lane each way it may do everything. A U-turn is only allowed
 * where there is nowhere else to go, which is what a dead end is. Parking
 * lanes carry nobody through a junction.
 */
function connectTurns(net: RoadNetwork, driveOnRight: boolean): void {
  net.nodes.forEach((node, nodeIndex) => {
    const arms = node.edges.filter((e) => net.edges[e].drivable);
    if (arms.length === 0) return;

    for (const fromEdge of arms) {
      const from = net.edges[fromEdge];
      const arriving = from.lanes
        .map((lane, index) => ({ lane, index }))
        .filter(({ lane }) => lane.kind === 'driving'
          && (from.to === nodeIndex) === lane.forward);
      if (!arriving.length) continue;
      const inDir = net.directionAt(fromEdge, nodeIndex);

      for (const toEdge of arms) {
        const to = net.edges[toEdge];
        const leaving = to.lanes
          .map((lane, index) => ({ lane, index }))
          .filter(({ lane }) => lane.kind === 'driving'
            && (to.from === nodeIndex) === lane.forward);
        if (!leaving.length) continue;

        const outDir = net.directionAt(toEdge, nodeIndex);
        // Measured from "back the way we came" round to "out along this edge".
        const angle = signedAngle([-inDir[0], -inDir[1]], outDir);
        const kind = classify(angle, driveOnRight);
        if (toEdge === fromEdge && !(kind === 'uturn' && arms.length === 1)) continue;

        for (const { lane, index } of arriving) {
          if (!allowed(kind, lane.fromKerb, arriving.length)) continue;
          const target = leaving.reduce((best, cur) =>
            Math.abs(cur.lane.fromKerb - lane.fromKerb)
              < Math.abs(best.lane.fromKerb - lane.fromKerb) ? cur : best);
          net.turns.push({
            node: nodeIndex,
            fromEdge,
            fromLane: index,
            toEdge,
            toLane: target.index,
            angle,
            kind,
          });
        }
      }
    }
  });
}

function signedAngle(a: Vec2, b: Vec2): number {
  return Math.atan2(a[0] * b[1] - a[1] * b[0], a[0] * b[0] + a[1] * b[1]);
}

function classify(angle: number, driveOnRight: boolean): TurnKind {
  const magnitude = Math.abs(angle);
  if (magnitude > UTURN_RAD) return 'uturn';
  if (magnitude < STRAIGHT_RAD) return 'straight';
  // z runs south here, so a positive angle turns towards the driver's left;
  // the sign flips with which side traffic keeps.
  const left = driveOnRight ? angle > 0 : angle < 0;
  return left ? 'left' : 'right';
}

/** Which lanes a movement may be made from, counted out from the kerb. */
function allowed(kind: TurnKind, fromKerb: number, lanes: number): boolean {
  if (lanes <= 1) return true;
  if (kind === 'right') return fromKerb === 0;
  if (kind === 'left' || kind === 'uturn') return fromKerb === lanes - 1;
  return true;
}
