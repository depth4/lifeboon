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

import type { StreetCorridor, Terrain } from '../terrain/heightfield';
import { smoothProfile } from '../terrain/heightfield';
import { gradedHalfWidth, streetSection, type StreetNorm } from './street';
import type { Road, Vec2 } from './types';

/** Height above ground per OSM layer, so stacked structures clear each other. */
export const LAYER_HEIGHT = 5;

/**
 * How far the carriageway sits above the ground surface.
 *
 * Land cover tops out at 0.21 m (render/ground.ts: its own lift plus up to
 * three levels of nesting), so the carriageway starts above that.
 */
export const ROAD_SURFACE_Y = 0.28;

/**
 * How far the earth is cut below the crown of the carriageway.
 *
 * The road structure lives in this gap — sub-base, kerb foundation — and so
 * does anything else the map happens to drape over the same ground. That is
 * the point: a park polygon crossing a street now lies buried under the road
 * instead of being drawn on top of it, and no lift constant is needed to
 * arrange the two. Deep enough to clear the land-cover stack (0.21 m) with
 * room to spare.
 */
export const GRADE_DEPTH = 0.34;

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
 * `GRADE_DEPTH` further with every reload. So profiles are taken from the
 * untouched ground first, and everything downstream reads these.
 */
export class RoadProfiles {
  private readonly byId = new Map<string, number[]>();

  constructor(roads: Road[], terrain: Terrain) {
    for (const road of roads) {
      if (road.points.length < 2) continue;
      this.byId.set(road.id, roadSurfaceProfile(road, terrain));
    }
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
    for (const road of roads) {
      if (road.bridge || isUnderground(road)) continue;
      const levels = this.byId.get(road.id);
      if (!levels) continue;
      const section = streetSection(road, norm);
      out.push({
        points: road.points,
        halfWidth: gradedHalfWidth(section),
        blend: Math.max(1.5, norm.batter),
        levels,
        depth: GRADE_DEPTH,
        // The embankment edge is deliberately dropped: its height is whatever
        // the untouched ground turns out to be, which is the question grading
        // is answering, not an input to it.
        shape: section
          .filter((e) => !Number.isNaN(e.dy))
          .map((e) => [e.offset, e.dy] as [number, number]),
      });
    }
    // Where two corridors claim the same ground equally hard — a crossroads —
    // the first claim is the one that stands, so the bigger road goes first
    // and carries the side street across it rather than being dug through.
    out.sort((a, b) => b.halfWidth - a.halfWidth);
    return out;
  }
}
