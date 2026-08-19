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

import type { Terrain } from '../terrain/heightfield';
import { smoothProfile } from '../terrain/heightfield';
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
  const CLEARANCE = 3.5;
  let needed = 0;
  for (let i = 0; i < n; i++) {
    const t = cumulative[i] / total;
    const chord = startY + (endY - startY) * t;
    const below = terrain.heightAt(points[i][0], points[i][1]);
    needed = Math.max(needed, below + CLEARANCE - chord);
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
