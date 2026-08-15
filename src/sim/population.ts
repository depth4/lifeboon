/**
 * The people.
 *
 * Each agent owns a home, usually a job, four needs that drain over the day,
 * and a small state machine that turns those into destinations. Movement is
 * along the real pedestrian graph, so where people walk is decided by the
 * actual street layout of the place you loaded.
 *
 * Note what is deliberately absent: while an agent is inside a building it is
 * simply not rendered. There is no interior to show, and none is simulated —
 * the simulation models the city, not the living room.
 */

import { Rng } from '../core/rng';
import type { SimClock } from '../core/clock';
import type { Building, Poi, PoiKind, World } from '../world/types';
import type { NavGraph } from './navgraph';

export type Activity =
  | 'sleeping'
  | 'at-home'
  | 'commuting'
  | 'working'
  | 'eating'
  | 'shopping'
  | 'leisure'
  | 'strolling'
  | 'heading-home';

/**
 * Activities during which the agent is indoors, and therefore not drawn.
 * `leisure` covers indoor venues — a cinema, a gym, a library; being outdoors
 * in a park is `strolling`, which is a different thing and stays visible.
 */
const INDOOR: ReadonlySet<Activity> = new Set<Activity>([
  'sleeping', 'at-home', 'working', 'eating', 'shopping', 'leisure',
]);

export interface Agent {
  id: number;
  name: string;
  age: number;
  /** Index into world.buildings. */
  home: number;
  /** Index into world.pois, or -1 for the unemployed and the retired. */
  job: number;
  homeNode: number;
  jobNode: number;

  x: number;
  z: number;
  heading: number;
  /** Metres per simulated second. */
  walkSpeed: number;

  activity: Activity;
  /** Sim-time (seconds since day 0) at which the current activity ends. */
  busyUntil: number;

  path: number[] | null;
  pathIndex: number;
  /** Distance already covered along the current segment, in metres. */
  segmentProgress: number;
  destinationPoi: number;
  /** Node this agent is queued to be routed to; -1 when not waiting on A*. */
  pendingGoal: number;
  /** What they will start doing once they arrive. */
  nextActivity?: Activity;
  /** Sim-time until which a stroll continues, hop by hop. */
  strollUntil: number;

  energy: number;
  hunger: number;
  social: number;
  fun: number;

  /** Per-agent animation offset so the crowd does not march in lockstep. */
  phase: number;
  colorIndex: number;

  workStart: number;
  workEnd: number;
  wakeHour: number;
  sleepHour: number;
}

const NAME_HEADS = [
  'Ari', 'Bel', 'Cor', 'Dai', 'Eri', 'Fen', 'Gwyn', 'Hal', 'Ing', 'Jor',
  'Kai', 'Lio', 'Mar', 'Nes', 'Ori', 'Pav', 'Quen', 'Ros', 'Sel', 'Tam',
  'Ulf', 'Ven', 'Wyn', 'Yar', 'Zel',
];
const NAME_TAILS = [
  'a', 'ek', 'en', 'ia', 'is', 'or', 'ra', 'sen', 'ta', 'us', 'ay', 'in', 'el',
];

/** Invented names — no real person is being modelled here. */
function makeName(rng: Rng): string {
  return rng.pick(NAME_HEADS) + rng.pick(NAME_TAILS);
}

/** Which POI categories satisfy which need. */
const LEISURE_KINDS: PoiKind[] = ['park', 'leisure', 'culture', 'sport', 'food'];
const FOOD_KINDS: PoiKind[] = ['food', 'groceries'];
const JOB_KINDS: PoiKind[] = ['work', 'shopping', 'groceries', 'food', 'school', 'healthcare', 'culture'];

export class Population {
  readonly agents: Agent[] = [];
  /** Agents currently outdoors, refreshed each update; what the renderer draws. */
  readonly visible: Agent[] = [];

  private readonly world: World;
  private readonly graph: NavGraph;
  private readonly rng: Rng;
  private readonly poisByKind = new Map<PoiKind, number[]>();
  /** Agents waiting for a route; drained a few at a time to keep frames smooth. */
  private readonly pathQueue: number[] = [];
  private pathfindsThisSecond = 0;

  constructor(world: World, graph: NavGraph, seed: number) {
    this.world = world;
    this.graph = graph;
    this.rng = new Rng(seed ^ 0x9e3779b9);

    world.pois.forEach((poi, index) => {
      // Resolve each POI to its nearest walkable node once, up front.
      poi.nodeIndex = graph.findNearest(poi.position[0], poi.position[1]);
      let list = this.poisByKind.get(poi.kind);
      if (!list) this.poisByKind.set(poi.kind, (list = []));
      list.push(index);
    });
  }

  get count(): number {
    return this.agents.length;
  }

  /**
   * Populate the city. Homes are drawn from residential buildings in
   * proportion to how many people they could hold, so a tower block produces
   * more residents than a cottage.
   */
  spawn(targetCount: number): void {
    const homes: number[] = [];
    const weights: number[] = [];
    let totalWeight = 0;

    this.world.buildings.forEach((b, index) => {
      if (b.kind !== 'residential' || b.capacity < 1) return;
      homes.push(index);
      totalWeight += b.capacity;
      weights.push(totalWeight);
    });

    if (!homes.length) return;

    const jobPool: number[] = [];
    for (const kind of JOB_KINDS) {
      const list = this.poisByKind.get(kind);
      if (list) jobPool.push(...list);
    }

    const count = Math.min(targetCount, Math.round(totalWeight));
    for (let i = 0; i < count; i++) {
      const roll = this.rng.next() * totalWeight;
      // Binary search the cumulative weights.
      let lo = 0;
      let hi = weights.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (weights[mid] < roll) lo = mid + 1;
        else hi = mid;
      }
      const homeIndex = homes[lo];
      const agent = this.makeAgent(i, homeIndex, jobPool);
      if (agent) this.agents.push(agent);
    }
  }

  private makeAgent(id: number, homeIndex: number, jobPool: number[]): Agent | null {
    const home = this.world.buildings[homeIndex];
    const homeNode = this.graph.findNearest(home.centroid[0], home.centroid[1]);
    if (homeNode < 0) return null; // A building with no reachable street.

    const rng = this.rng;
    const age = Math.round(rng.gaussian(38, 18));
    const employed = age >= 16 && age <= 67 && rng.chance(0.78);
    const job = employed && jobPool.length ? rng.pick(jobPool) : -1;
    const jobNode = job >= 0 ? this.world.pois[job].nodeIndex : -1;

    const [hx, hz] = this.graph.nodePosition(homeNode);
    const workStart = rng.range(7, 10);

    return {
      id,
      name: makeName(rng),
      age: Math.max(1, Math.min(95, age)),
      home: homeIndex,
      job: jobNode >= 0 ? job : -1,
      homeNode,
      jobNode,
      x: hx,
      z: hz,
      heading: rng.range(0, Math.PI * 2),
      // Older people walk a little slower; everybody varies.
      walkSpeed: Math.max(0.7, rng.gaussian(1.38, 0.16) * (age > 70 ? 0.8 : 1)),
      activity: 'at-home',
      busyUntil: 0,
      path: null,
      pathIndex: 0,
      segmentProgress: 0,
      destinationPoi: -1,
      pendingGoal: -1,
      strollUntil: 0,
      energy: rng.range(0.5, 1),
      hunger: rng.range(0, 0.5),
      social: rng.range(0.3, 1),
      fun: rng.range(0.3, 1),
      phase: rng.range(0, Math.PI * 2),
      colorIndex: rng.int(0, 12),
      workStart,
      workEnd: workStart + rng.range(7, 9.5),
      wakeHour: rng.gaussian(6.9, 0.9),
      sleepHour: rng.gaussian(23, 1.1),
    };
  }

  /** Pick a nearby POI of one of the given kinds; samples a few and takes the closest. */
  private choosePoi(agent: Agent, kinds: PoiKind[], samples = 10): number {
    let best = -1;
    let bestScore = Infinity;
    for (let s = 0; s < samples; s++) {
      const kind = kinds[this.rng.int(0, kinds.length)];
      const list = this.poisByKind.get(kind);
      if (!list?.length) continue;
      const candidate = list[this.rng.int(0, list.length)];
      const poi = this.world.pois[candidate];
      if (poi.nodeIndex < 0) continue;
      const d = Math.hypot(poi.position[0] - agent.x, poi.position[1] - agent.z);
      // Mild randomisation so the same cafe is not chosen by everyone nearby.
      const score = d * this.rng.range(0.8, 1.3);
      if (score < bestScore) {
        bestScore = score;
        best = candidate;
      }
    }
    return best;
  }

  private travelTo(agent: Agent, node: number, poi: number, activity: Activity): void {
    if (node < 0) {
      // No reachable destination: stay put rather than spin on the queue.
      agent.activity = 'at-home';
      agent.busyUntil = this.lastSimTime + this.activityDuration('at-home');
      return;
    }
    agent.destinationPoi = poi;
    agent.activity = activity;
    agent.path = null;
    agent.pathIndex = 0;
    agent.segmentProgress = 0;
    agent.pendingGoal = node;
    this.pathQueue.push(agent.id);
  }

  /**
   * Decide what an agent does next. Called when they finish an activity or
   * arrive somewhere, never every frame.
   */
  private decide(agent: Agent, clock: SimClock): void {
    const hour = clock.hour;
    const now = clock.totalSeconds;
    const isWorkday = !clock.isWeekend;

    const nightTime = hour >= agent.sleepHour || hour < agent.wakeHour;
    const atHome = agent.activity === 'at-home' || agent.activity === 'sleeping';

    // A stroll is a sequence of short hops, not a single destination: somebody
    // in a park keeps moving until they are done being in the park. Without
    // this, everyone "outdoors" would stand perfectly still for half an hour.
    if (agent.activity === 'strolling' && now < agent.strollUntil && !nightTime) {
      const angle = this.rng.range(0, Math.PI * 2);
      const reach = this.rng.range(40, 150);
      const node = this.graph.findNearest(
        agent.x + Math.cos(angle) * reach,
        agent.z + Math.sin(angle) * reach,
        200,
      );
      if (node >= 0) {
        this.travelTo(agent, node, agent.destinationPoi, 'strolling');
        agent.nextActivity = 'strolling';
        return;
      }
    }

    // Night: everyone eventually goes home and sleeps.
    if (nightTime && agent.energy < 0.85) {
      if (atHome) {
        agent.activity = 'sleeping';
        agent.busyUntil = now + 3600;
        return;
      }
      this.goHome(agent);
      return;
    }

    // Hunger beats almost everything.
    if (agent.hunger > 0.72) {
      const poi = this.choosePoi(agent, FOOD_KINDS);
      if (poi >= 0) {
        this.travelTo(agent, this.world.pois[poi].nodeIndex, poi, 'commuting');
        agent.nextActivity = 'eating';
        return;
      }
      // Nowhere to eat nearby — eat at home.
      if (!atHome) {
        this.goHome(agent);
        return;
      }
      agent.activity = 'eating';
      agent.busyUntil = now + 1800;
      return;
    }

    // Work.
    if (isWorkday && agent.job >= 0 && hour >= agent.workStart && hour < agent.workEnd && agent.energy > 0.2) {
      if (agent.activity === 'working') {
        agent.busyUntil = now + 1800;
        return;
      }
      this.travelTo(agent, agent.jobNode, agent.job, 'commuting');
      agent.nextActivity = 'working';
      return;
    }

    // Worn out: go home and rest.
    if (agent.energy < 0.22) {
      if (atHome) {
        agent.activity = 'at-home';
        agent.busyUntil = now + 2400;
        return;
      }
      this.goHome(agent);
      return;
    }

    // Free time: go out, or potter about at home.
    if (agent.fun < 0.55 || agent.social < 0.5 || this.rng.chance(0.35)) {
      const poi = this.choosePoi(agent, LEISURE_KINDS);
      if (poi >= 0) {
        const kind = this.world.pois[poi].kind;
        this.travelTo(agent, this.world.pois[poi].nodeIndex, poi, 'commuting');
        // A park is enjoyed outdoors; a cinema is not.
        agent.nextActivity = kind === 'park' ? 'strolling' : 'leisure';
        return;
      }
    }

    if (atHome) {
      agent.activity = 'at-home';
      agent.busyUntil = now + this.rng.range(900, 3600);
    } else {
      this.goHome(agent);
    }
  }

  private goHome(agent: Agent): void {
    this.travelTo(agent, agent.homeNode, -1, 'heading-home');
    agent.nextActivity = 'at-home';
  }

  /** Duration of an activity once the agent arrives, in sim seconds. */
  private activityDuration(activity: Activity): number {
    switch (activity) {
      case 'working': return this.rng.range(2400, 4200);
      case 'eating': return this.rng.range(1200, 2700);
      case 'shopping': return this.rng.range(900, 2400);
      case 'leisure': return this.rng.range(2400, 6000);
      // Just a pause on a bench before wandering on; the outing's total length
      // is tracked separately by strollUntil.
      case 'strolling': return this.rng.range(15, 90);
      case 'at-home': return this.rng.range(1800, 5400);
      case 'sleeping': return this.rng.range(3600, 7200);
      default: return 1800;
    }
  }

  /** Resolve queued route requests, a bounded number per call. */
  private servicePathQueue(budget: number): void {
    let done = 0;
    while (this.pathQueue.length && done < budget) {
      const id = this.pathQueue.shift()!;
      const agent = this.agents[id];
      done++;
      if (!agent || agent.pendingGoal < 0) continue;

      const start = this.graph.findNearest(agent.x, agent.z);
      const path = this.graph.findPath(start, agent.pendingGoal);
      agent.pendingGoal = -1;

      if (!path || path.length < 2) {
        // Unreachable (an island, a gated block). Give up and settle in place.
        agent.path = null;
        agent.activity = agent.nextActivity ?? 'at-home';
        agent.busyUntil = this.lastSimTime + this.activityDuration(agent.activity);
        continue;
      }
      agent.path = path;
      agent.pathIndex = 0;
      agent.segmentProgress = 0;
      const [sx, sz] = this.graph.nodePosition(path[0]);
      agent.x = sx;
      agent.z = sz;
      this.pathfindsThisSecond++;
    }
  }

  private lastSimTime = 0;

  /** Advance every agent by `dtSim` simulated seconds. */
  update(dtSim: number, clock: SimClock): void {
    this.lastSimTime = clock.totalSeconds;
    this.pathfindsThisSecond = 0;
    // A generous but bounded routing budget: enough that rush hour flows,
    // small enough that a frame is never held hostage by A*.
    this.servicePathQueue(48);

    const now = clock.totalSeconds;
    const dayFraction = dtSim / 86400;

    this.visible.length = 0;

    for (const agent of this.agents) {
      // --- needs -------------------------------------------------------
      const asleep = agent.activity === 'sleeping';
      agent.energy = clamp01(agent.energy + (asleep ? dayFraction * 2.6 : -dayFraction * 1.15));
      agent.hunger = clamp01(agent.hunger + dayFraction * (asleep ? 0.5 : 1.5));
      agent.social = clamp01(agent.social - dayFraction * 0.8);
      agent.fun = clamp01(agent.fun - dayFraction * 0.9);

      if (agent.activity === 'eating') agent.hunger = clamp01(agent.hunger - dtSim / 1200);
      if (agent.activity === 'leisure' || agent.activity === 'strolling') {
        agent.fun = clamp01(agent.fun + dtSim / 3000);
        agent.social = clamp01(agent.social + dtSim / 4000);
      }
      if (agent.activity === 'working') agent.social = clamp01(agent.social + dtSim / 9000);

      // --- movement ----------------------------------------------------
      if (agent.path) {
        this.advanceAlongPath(agent, dtSim, now);
      } else if (agent.pendingGoal < 0 && now >= agent.busyUntil) {
        // Not walking, not waiting on a route, and done with what they were
        // doing: time to pick something new.
        this.decide(agent, clock);
      }

      if (!INDOOR.has(agent.activity)) this.visible.push(agent);
    }
  }

  private advanceAlongPath(agent: Agent, dtSim: number, now: number): void {
    const path = agent.path!;
    let remaining = agent.walkSpeed * dtSim;
    // A very large time scale could otherwise walk somebody across the map in
    // one frame; capping keeps motion readable and the loop bounded.
    remaining = Math.min(remaining, 400);

    while (remaining > 0 && agent.pathIndex < path.length - 1) {
      const [ax, az] = this.graph.nodePosition(path[agent.pathIndex]);
      const [bx, bz] = this.graph.nodePosition(path[agent.pathIndex + 1]);
      const segLength = Math.hypot(bx - ax, bz - az);
      const left = segLength - agent.segmentProgress;

      if (remaining < left) {
        agent.segmentProgress += remaining;
        const t = agent.segmentProgress / segLength;
        agent.x = ax + (bx - ax) * t;
        agent.z = az + (bz - az) * t;
        agent.heading = Math.atan2(bx - ax, bz - az);
        remaining = 0;
      } else {
        remaining -= left;
        agent.pathIndex++;
        agent.segmentProgress = 0;
        agent.x = bx;
        agent.z = bz;
      }
    }

    if (agent.pathIndex >= path.length - 1) {
      // Arrived.
      agent.path = null;
      agent.activity = agent.nextActivity ?? 'at-home';
      agent.nextActivity = undefined;
      // Starting a stroll sets how long the whole outing lasts; each hop
      // afterwards only pauses briefly before the next one.
      if (agent.activity === 'strolling' && now >= agent.strollUntil) {
        agent.strollUntil = now + this.rng.range(1200, 4200);
      }
      agent.busyUntil = now + this.activityDuration(agent.activity);
    }
  }

  /** Human-readable summary of what somebody is up to, for the inspector. */
  describe(agent: Agent): string {
    switch (agent.activity) {
      case 'sleeping': return 'Asleep at home';
      case 'at-home': return 'At home';
      case 'commuting': return agent.destinationPoi >= 0 ? 'On the way somewhere' : 'Walking';
      case 'heading-home': return 'Walking home';
      case 'working': return 'At work';
      case 'eating': return 'Having a meal';
      case 'shopping': return 'Shopping';
      case 'leisure': return 'Out enjoying themselves';
      case 'strolling': return 'Strolling outdoors';
    }
  }

  homeBuilding(agent: Agent): Building {
    return this.world.buildings[agent.home];
  }

  jobPoi(agent: Agent): Poi | null {
    return agent.job >= 0 ? this.world.pois[agent.job] : null;
  }
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
