/**
 * Where the road surface actually is.
 *
 * This used to live inside the renderer, which was fine while nothing but
 * triangles cared. A car changes that: it has to sit on the deck that was
 * drawn, not on the raw terrain underneath it, or it sinks through every
 * bridge it crosses. So the profile is a fact about the world, computed once
 * here and read by both the geometry builder and the simulation.
 *
 * Heights are metres above the loaded area's reference level.
 */

import type { GroundPad, StreetCorridor, Terrain } from '../terrain/heightfield';
import { smoothProfile } from '../terrain/heightfield';
import { gradedHalfWidth, streetSection, type StreetNorm } from './street';
import {
  buildJunctions, inSpans, junctionHeightAt, spanCuts, spansFor,
  spansFromJunctions, splitAt, warpRing, type JunctionShape,
} from './junctions';
import type { Road, Vec2 } from './types';

/** Height above ground per OSM layer, so stacked structures clear each other. */
export const LAYER_HEIGHT = 5;

/**
 * How far the carriageway sits above the ground surface.
 *
 * A built road stands a little proud of the earth beside it — that is what the
 * sub-base and the kerb foundation add up to. It used to be 0.28 m because
 * land cover was drawn as a stack of sheets over the ground reaching 0.21 m,
 * and the road had to clear all of them. Land cover is paint on the ground
 * now, so this is back to being a fact about roads.
 */
export const ROAD_SURFACE_Y = 0.12;

/**
 * The thickness of the road structure: how far the earth is cut below the
 * crown so the built section has something to sit in.
 *
 * This used to be 0.34 m and it was not a fact about roads either — it was a
 * hiding place. Every land-cover polygon that crossed a street was drawn
 * anyway, and the only thing stopping grass appearing across the asphalt was
 * that the grass had been buried under a third of a metre of nothing. That
 * trench then had to be covered by the drawn street, so anything that asked
 * the terrain instead of the street — the car, a pedestrian, a tree — fell
 * into it. The car sitting half a wheel deep in a pavement was exactly this.
 *
 * Nothing hides under a road any more, so the gap is the structure and only
 * the structure. It is kept at twelve centimetres rather than nothing because
 * two surfaces at the same height flicker against each other at city viewing
 * distances, and because the road bed genuinely is below the road.
 */
export const STRUCTURE_DEPTH = 0.12;

/**
 * Spacing the ground is resampled to before streets are cut into it.
 *
 * Elevation tiles arrive at 20-30 m per sample. A residential corridor is
 * about ten metres wide, so cutting one into a 20 m grid would not carry a
 * road — it would sag the whole block. Four metres is fine enough that a
 * street trench is a street trench, and costs well under a megabyte for a
 * kilometre-wide city.
 */
export const GRADING_GRID_M = 4;

/**
 * Roads are graded: real ones are cut and filled so they do not follow every
 * bump of the hillside. Sampling the terrain vertex by vertex gives a road
 * that ripples exactly as much as the elevation data is noisy.
 *
 * We smooth the profile, then clamp how far it may stray from the real ground
 * so a road on a steep hillside never ends up on stilts or in a trench.
 */
export function gradedProfile(
  points: Vec2[],
  terrain: Terrain,
  lift: number,
  maxDeviation = 0.6,
): number[] {
  const raw = points.map(([x, z]) => terrain.heightAt(x, z));
  const smoothed = smoothProfile(raw, 3);
  const out = new Array<number>(raw.length);
  for (let i = 0; i < raw.length; i++) {
    const drift = Math.max(-maxDeviation, Math.min(maxDeviation, smoothed[i] - raw[i]));
    out[i] = raw[i] + drift + lift;
  }
  return out;
}

/**
 * The height profile of a bridge deck.
 *
 * A bridge is not a road at a fixed altitude — that was the old behaviour and
 * it produced exactly what it sounds like, a slab of tarmac hanging in the air
 * with no connection to either bank. A deck starts and ends at the ground it
 * meets, and arches between just enough to clear whatever it spans, so the
 * approaches join the ordinary road surface without a step.
 */
export function bridgeProfile(
  points: Vec2[],
  terrain: Terrain,
  lift: number,
  layer: number,
): number[] {
  const n = points.length;
  const startY = terrain.heightAt(points[0][0], points[0][1]);
  const endY = terrain.heightAt(points[n - 1][0], points[n - 1][1]);

  // Distance along the way, so the arch is shaped by length rather than by
  // how finely the way happens to be drawn.
  const cumulative = new Array<number>(n).fill(0);
  for (let i = 1; i < n; i++) {
    cumulative[i] = cumulative[i - 1] +
      Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  const total = cumulative[n - 1] || 1;

  // How high the deck must ride to clear the ground and any water beneath it.
  //
  // The arch is a sine, so a point a quarter of the way along only gets 70% of
  // it. Sizing the arch by the bare deficit therefore clears the obstacle only
  // when the obstacle happens to sit at mid-span; anywhere else the deck goes
  // through it. Measured on the offline city: a rise a third of the way along
  // a 250 m bridge came out 1.2 m above the deck, so the road ran through the
  // hillside. Dividing by the sine at that point is what actually guarantees
  // the clearance, wherever the high ground is.
  const CLEARANCE = 3.5;
  let needed = 0;
  for (let i = 0; i < n; i++) {
    const t = cumulative[i] / total;
    const chord = startY + (endY - startY) * t;
    const below = terrain.heightAt(points[i][0], points[i][1]);
    const deficit = below + CLEARANCE - chord;
    if (deficit <= 0) continue;
    // Guarded: at the very ends the sine is zero and the deck is flush with
    // the ground by design, so no arch can or should lift it there.
    const lift = Math.sin(t * Math.PI);
    if (lift < 0.08) continue;
    needed = Math.max(needed, deficit / lift);
  }
  // A long viaduct needs a real arch; a short canal crossing needs almost none.
  const arch = Math.max(0, Math.min(needed, 12));

  // `layer=1` is simply what OSM puts on any bridge — it means "above the
  // thing I cross", which the arch has already accounted for. Only genuinely
  // stacked structures, layer 2 and up, get lifted again.
  const stacked = Math.max(0, layer - 1) * LAYER_HEIGHT;

  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    const t = cumulative[i] / total;
    const chord = startY + (endY - startY) * t;
    // Sine keeps both ends flush with the ground and lifts only the middle.
    out[i] = chord + Math.sin(t * Math.PI) * arch + lift + stacked;
  }
  return out;
}

/**
 * Surface height at every point of a way: one number per entry in
 * `road.points`. Bridges arch; everything else follows graded terrain.
 *
 * `layer` deliberately does NOT lift anything here. This is the single most
 * misread tag in OpenStreetMap: it is a *stacking order* saying which way
 * passes over which where they cross, not an altitude. Only `bridge=yes` means
 * a way is physically off the ground, and only for the length of the bridge.
 *
 * Treating layer as height put every `layer=1` street five metres in the air.
 * In a lightly-mapped town almost nothing carries the tag and it never showed;
 * in Tokyo, where a large share of the network is layered, it turned the city
 * into a pile of floating slabs. The layer value is still used, but only where
 * it means something physical: genuinely stacked bridge decks, below.
 */
export function roadSurfaceProfile(road: Road, terrain: Terrain): number[] {
  if (road.bridge) return bridgeProfile(road.points, terrain, ROAD_SURFACE_Y, road.layer);
  return gradedProfile(road.points, terrain, ROAD_SURFACE_Y);
}

/**
 * Whether a way is underground and should simply not be drawn.
 *
 * A tunnel used to be drawn as an ordinary road pressed against the surface,
 * which meant every underpass and every metro line was painted on top of the
 * streets above it. A negative layer without a tunnel tag is the same thing
 * mapped differently — underground car parks, subways, service passages.
 *
 * Not drawing them leaves a road that visibly disappears into a portal and
 * comes out the other side, which is honest: we do not model what is under the
 * ground, so we should not pretend to.
 */
export function isUnderground(way: { tunnel: boolean; layer: number }): boolean {
  return way.tunnel || way.layer < 0;
}

/**
 * Every way's finished surface height, computed once.
 *
 * This has to exist because grading and drawing must not disagree. The
 * renderer used to ask for a profile, the road index asked again later, and
 * both read it straight off the terrain — fine while nothing changed the
 * terrain. The moment streets started cutting into the ground, a profile
 * computed after grading would describe a road built on a road, sinking
 * `STRUCTURE_DEPTH` further with every reload. So profiles are taken from the
 * untouched ground first, and everything downstream reads these.
 */
export class RoadProfiles {
  private readonly byId = new Map<string, number[]>();
  /** Where streets meet: one height, one boundary, every approach on it. */
  private readonly nodes: JunctionShape[] = [];

  constructor(roads: Road[], terrain: Terrain) {
    for (const road of roads) {
      if (road.points.length < 2) continue;
      this.byId.set(road.id, roadSurfaceProfile(road, terrain));
    }
    this.nodes = levelToJunctions(roads, this.byId);
  }

  /** The junctions, for anything that needs to know where they are. */
  get junctions(): readonly JunctionShape[] {
    return this.nodes;
  }

  /**
   * The junctions' claim on the earth: flat, inside their own boundary.
   *
   * Separate from `corridors` and applied after them, because a junction is a
   * polygon rather than a ribbon and because at a crossing it is the junction
   * that gets drawn. Without this the earth under a crossing keeps following
   * each street's own gradient while the crossing is drawn flat on top of it,
   * and the two disagree by however much the streets were climbing — measured
   * at 14 cm on a 1-in-3 hillside before this existed.
   */
  pads(apron = 2.5): GroundPad[] {
    return this.nodes
      .filter((node) => node.ring.length >= 3)
      .map((node) => ({
        // Graded a little wider than it is drawn. A mesh cell straddling the
        // drawn boundary would otherwise have one corner on the junction and
        // one on a street climbing away from it, and the plane between them
        // rises through the asphalt. Widening the flat part costs an apron of
        // a couple of metres, which is what a junction has anyway.
        ring: node.ring.map(([x, z]) => {
          const dx = x - node.x;
          const dz = z - node.z;
          const len = Math.hypot(dx, dz) || 1;
          return [x + (dx / len) * apron, z + (dz / len) * apron] as [number, number];
        }),
        heightAt: (x: number, z: number) => junctionHeightAt(node, x, z),
        depth: STRUCTURE_DEPTH,
        blend: 3,
      }));
  }

  /** Surface height at every point of a way, or null if it was not indexed. */
  get(road: Road): number[] | null {
    return this.byId.get(road.id) ?? null;
  }

  /**
   * The corridors the earth has to be cut to.
   *
   * A bridge is deliberately absent: its deck is metres above the ground and
   * cutting a trench under one would dig a hole in the riverbank for no
   * reason. Underground ways are absent for the same reason in reverse — we
   * do not draw them, so we must not shape the surface around them either.
   */
  corridors(roads: Road[], norm: StreetNorm): StreetCorridor[] {
    const out: StreetCorridor[] = [];
    // A street cuts the earth over exactly the stretches where it is drawn,
    // and stops where the junction begins — the same spans the renderer uses.
    //
    // It used to cut the whole way through, junctions included, so at every
    // crossing two corridors claimed the same earth at two different levels
    // and the stronger claim won. That is where "прямоугольные плато криво
    // друг на друге" came from, and no amount of drawing the junction properly
    // fixes it while the earth underneath is still being fought over.
    const spans = spansFromJunctions(roads, this.nodes);

    for (const road of roads) {
      if (road.bridge || isUnderground(road)) continue;
      const levels = this.byId.get(road.id);
      if (!levels) continue;
      const section = streetSection(road, norm);
      const shape = section
        // The embankment edge is deliberately dropped: its height is whatever
        // the untouched ground turns out to be, which is the question grading
        // is answering, not an input to it.
        .filter((e) => !Number.isNaN(e.dy))
        .map((e) => [e.offset, e.dy] as [number, number]);
      const claim = {
        halfWidth: gradedHalfWidth(section),
        blend: Math.max(1.5, norm.batter),
        depth: STRUCTURE_DEPTH,
        shape,
      };

      const mine = spansFor(spans, road);
      if (!mine.sides.length) {
        out.push({ ...claim, points: road.points, levels });
        continue;
      }

      const line = splitAt(road.points, levels, spanCuts(mine));
      let run: { points: Vec2[]; levels: number[] } | null = null;
      for (let i = 0; i < line.points.length - 1; i++) {
        const mid = (line.distances[i] + line.distances[i + 1]) / 2;
        if (inSpans(mine.sides, mid)) {
          if (run && run.points.length > 1) out.push({ ...claim, ...run });
          run = null;
          continue;
        }
        if (!run) run = { points: [line.points[i]], levels: [line.heights[i]] };
        run.points.push(line.points[i + 1]);
        run.levels.push(line.heights[i + 1]);
      }
      if (run && run.points.length > 1) out.push({ ...claim, ...run });
    }
    // Where two corridors claim the same ground equally hard — a crossroads —
    // the first claim is the one that stands, so the bigger road goes first
    // and carries the side street across it rather than being dug through.
    out.sort((a, b) => b.halfWidth - a.halfWidth);

    return out;
  }
}

/** How far apart two crossings may be and still be the same junction. */
const NODE_MERGE_M = 6;
/** How far a street may be lifted or dropped to meet its junctions. */
const MAX_LEVELLING_M = 0.9;

/**
 * Make every street that meets at a junction agree on the height there.
 *
 * Each way's profile was smoothed independently from the terrain, so two
 * streets crossing at a point could differ by tens of centimetres — and then
 * the ground was graded to each of them in turn, with the strongest claim
 * winning. That is precisely a set of rectangular plateaus laid crookedly over
 * one another, which is what a crossroads looked like: two roads at two
 * heights with a step between them instead of a crossing.
 *
 * A junction is one place, so it gets one height, and every way that reaches
 * it is bent to arrive there. The bend is spread between a way's junctions, so
 * nothing kinks; and it is capped, so a junction can never drag a street
 * somewhere the terrain will not carry it.
 */
function levelToJunctions(roads: Road[], profiles: Map<string, number[]>): JunctionShape[] {
  const shapes = buildJunctions(roads, undefined, NODE_MERGE_M);
  if (!shapes.length) return [];

  /** Per road: the height it must have at a distance along it. */
  const targets = new Map<number, Array<{ at: number; height: number }>>();

  const sampleAt = (road: Road, at: number): number | null => {
    const profile = profiles.get(road.id);
    if (!profile) return null;
    let travelled = 0;
    for (let i = 0; i < road.points.length - 1; i++) {
      const len = Math.hypot(
        road.points[i + 1][0] - road.points[i][0],
        road.points[i + 1][1] - road.points[i][1],
      );
      if (at <= travelled + len || i === road.points.length - 2) {
        const t = len < 1e-6 ? 0 : Math.max(0, Math.min(1, (at - travelled) / len));
        return profile[i] + (profile[i + 1] - profile[i]) * t;
      }
      travelled += len;
    }
    return profile[profile.length - 1];
  };

  const levelled: JunctionShape[] = [];
  for (const shape of shapes) {
    let sum = 0;
    let count = 0;
    const counted = new Set<number>();
    for (const a of shape.approaches) {
      // Two approaches per way through a junction; the way has one height here.
      if (counted.has(a.road)) continue;
      counted.add(a.road);
      const road = roads[a.road];
      // A bridge deck is an arch tied to its abutments; it does not get bent
      // to suit a road passing underneath it.
      if (road.bridge) continue;
      const h = sampleAt(road, a.at);
      if (h === null) continue;
      // Weighted by width: a main road decides the level of the crossing and
      // the side street comes to meet it, not the other way about.
      sum += h * road.width;
      count += road.width;
    }
    if (count === 0) continue;

    shape.height = sum / count;
    levelled.push(shape);

    for (const road of counted) {
      if (roads[road].bridge) continue;
      const at = shape.approaches.find((a) => a.road === road)!.at;
      let list = targets.get(road);
      if (!list) targets.set(road, (list = []));
      list.push({ at, height: shape.height });
    }
  }

  // Apply the corrections: a delta per junction, interpolated along the way.
  for (const [roadIndex, list] of targets) {
    const road = roads[roadIndex];
    const profile = profiles.get(road.id);
    if (!profile) continue;

    const deltas = list
      .map(({ at, height }) => {
        const here = sampleAt(road, at);
        if (here === null) return null;
        const d = height - here;
        return { at, delta: Math.max(-MAX_LEVELLING_M, Math.min(MAX_LEVELLING_M, d)) };
      })
      .filter((d): d is { at: number; delta: number } => d !== null)
      .sort((a, b) => a.at - b.at);
    if (!deltas.length) continue;

    let travelled = 0;
    for (let i = 0; i < road.points.length; i++) {
      if (i > 0) {
        travelled += Math.hypot(
          road.points[i][0] - road.points[i - 1][0],
          road.points[i][1] - road.points[i - 1][1],
        );
      }
      profile[i] += deltaAt(deltas, travelled);
    }
  }

  // Levelling moved the ways, so both the height each junction agreed on and
  // the heights its streets arrive at have moved with them. Re-reading them
  // costs nothing and is what keeps the surface that gets drawn at exactly the
  // height the streets now reach it at.
  for (const shape of levelled) {
    let sum = 0;
    let count = 0;
    const counted = new Set<number>();
    for (const a of shape.approaches) {
      const road = roads[a.road];
      // The mouth is `stop` metres out along the way, in whichever direction
      // this approach runs.
      const h = sampleAt(road, a.at + a.sign * a.stop);
      a.mouthY = h ?? shape.height;
      if (counted.has(a.road) || road.bridge) continue;
      counted.add(a.road);
      const middle = sampleAt(road, a.at);
      if (middle === null) continue;
      sum += middle * road.width;
      count += road.width;
    }
    if (count > 0) shape.height = sum / count;
    warpRing(shape);
  }

  return levelled;
}

/** The correction at a distance along a way: interpolated, flat past the ends. */
function deltaAt(deltas: Array<{ at: number; delta: number }>, at: number): number {
  if (at <= deltas[0].at) return deltas[0].delta;
  const last = deltas[deltas.length - 1];
  if (at >= last.at) return last.delta;
  for (let i = 1; i < deltas.length; i++) {
    if (at <= deltas[i].at) {
      const a = deltas[i - 1];
      const b = deltas[i];
      const span = b.at - a.at;
      const t = span <= 1e-6 ? 1 : (at - a.at) / span;
      return a.delta + (b.delta - a.delta) * t;
    }
  }
  return last.delta;
}
