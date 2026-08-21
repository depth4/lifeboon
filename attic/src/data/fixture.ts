/**
 * Take a loaded place out of the browser, and put it back.
 *
 * This exists because of one hard fact about how this project is worked on:
 * **Overpass and Nominatim are unreachable from the agent sandbox.** Every
 * session so far has been able to test against the generated offline city and
 * nothing else, so every fix to the real-OSM path shipped unverified and the
 * user found the bugs by looking at the deployed site. The generated city is
 * also the wrong shape: it draws long streets that cross each other, where
 * OpenStreetMap splits every street at every junction and joins the pieces end
 * to end. Whole classes of bug simply cannot occur in the test city.
 *
 * The browser can reach Overpass. So the browser exports: one file holding the
 * parsed world and the terrain it was measured on, which can be attached to a
 * message and loaded straight back — into the app, to look at, and into the
 * Node tests, to measure. A real town becomes a fixture.
 *
 * What is *not* in here is the raw Overpass response. This is the parsed
 * world — the thing every renderer, the grading and the simulation actually
 * read — so it reproduces geometry exactly while staying small enough to send.
 * Nothing about the import path is captured; that has its own fixture in
 * `tests/parse-osm.ts`.
 */

import { FlatTerrain, Heightfield, type Terrain } from '../terrain/heightfield';
import { NORM_DEFAULT, NORM_RU, type StreetNorm } from '../world/street';
import type {
  AreaFeature, Building, DataAudit, Poi, Railway, Road, Waterway, World, WorldStats,
} from '../world/types';

/** Bumped when the shape changes in a way an older file cannot satisfy. */
export const FIXTURE_VERSION = 1;

export interface TerrainSnapshot {
  cols: number;
  rows: number;
  originX: number;
  originZ: number;
  resolution: number;
  /** Row-major heights in metres. */
  data: number[];
}

export interface Fixture {
  lifeboon: number;
  /** When it was taken, so an old file in a chat can be recognised as old. */
  taken: string;
  place: string;
  radius: number;
  seed: number;
  norm: string;
  stats: WorldStats;
  audit: DataAudit | null;
  buildings: Building[];
  roads: Road[];
  railways: Railway[];
  waterways: Waterway[];
  areas: AreaFeature[];
  pois: Poi[];
  terrain: TerrainSnapshot | null;
}

/**
 * Round to centimetres on the way out.
 *
 * Positions arrive with sixteen digits of float noise, which is fifteen more
 * than a kerb needs and roughly half the size of the file. Rounded to a
 * centimetre, nothing downstream can tell the difference: the finest thing in
 * the world model is a 15 cm kerb reveal.
 */
const cm = (v: number): number => Math.round(v * 100) / 100;
const mm = (v: number): number => Math.round(v * 1000) / 1000;
const ring = (points: Array<[number, number]>): Array<[number, number]> =>
  points.map(([x, z]) => [cm(x), cm(z)] as [number, number]);

export function toFixture(world: World, terrain: Terrain, place: string): Fixture {
  return {
    lifeboon: FIXTURE_VERSION,
    taken: new Date().toISOString(),
    place,
    radius: world.radius,
    seed: world.seed,
    norm: world.norm.name,
    stats: world.stats,
    audit: world.audit,
    buildings: world.buildings.map((b) => ({
      ...b,
      ring: ring(b.ring),
      holes: b.holes.map(ring),
      centroid: [cm(b.centroid[0]), cm(b.centroid[1])],
      height: mm(b.height),
      minHeight: mm(b.minHeight),
      area: cm(b.area),
    })),
    roads: world.roads.map((r) => ({ ...r, points: ring(r.points) })),
    railways: world.railways.map((r) => ({ ...r, points: ring(r.points) })),
    waterways: world.waterways.map((w) => ({ ...w, points: ring(w.points) })),
    areas: world.areas.map((a) => ({ ...a, ring: ring(a.ring), holes: a.holes.map(ring) })),
    pois: world.pois.map((p) => ({
      ...p, position: [cm(p.position[0]), cm(p.position[1])] as [number, number],
    })),
    terrain: terrain instanceof Heightfield ? terrain.snapshot(mm) : null,
  };
}

export function fromFixture(fixture: Fixture): World {
  if (fixture.lifeboon !== FIXTURE_VERSION) {
    throw new Error(
      `This file is a version ${fixture.lifeboon} capture and this build reads `
      + `version ${FIXTURE_VERSION}. Re-export it from the running site.`);
  }
  const norm: StreetNorm = fixture.norm === NORM_RU.name ? NORM_RU : NORM_DEFAULT;
  const terrain: Terrain = fixture.terrain
    ? Heightfield.fromSnapshot(fixture.terrain)
    : new FlatTerrain();

  return {
    buildings: fixture.buildings,
    roads: fixture.roads,
    railways: fixture.railways,
    waterways: fixture.waterways,
    areas: fixture.areas,
    pois: fixture.pois,
    audit: fixture.audit,
    terrain,
    radius: fixture.radius,
    norm,
    stats: fixture.stats,
    seed: fixture.seed,
  };
}

/** A sensible file name: place, size and date, safe on every filesystem. */
export function fixtureName(fixture: Fixture): string {
  const slug = fixture.place
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '') || 'place';
  const day = fixture.taken.slice(0, 10);
  return `lifeboon-${slug}-${Math.round(fixture.radius * 2)}m-${day}.json.gz`;
}

/**
 * Gzip on the way out, because the whole point is that this has to travel
 * through a chat message. A town comes out around a megabyte of JSON and a
 * fifth of that compressed. Browsers without CompressionStream get the plain
 * file rather than an error.
 */
export async function packFixture(fixture: Fixture): Promise<{ blob: Blob; name: string }> {
  const json = JSON.stringify(fixture);
  const name = fixtureName(fixture);
  const Compression = (globalThis as { CompressionStream?: typeof CompressionStream })
    .CompressionStream;
  if (!Compression) {
    return { blob: new Blob([json], { type: 'application/json' }), name: name.replace(/\.gz$/, '') };
  }
  const stream = new Blob([json]).stream().pipeThrough(new Compression('gzip'));
  return { blob: await new Response(stream).blob(), name };
}

/** Read a file the user picked, gzipped or not. */
export async function unpackFixture(file: Blob): Promise<Fixture> {
  const head = new Uint8Array(await file.slice(0, 2).arrayBuffer());
  const gzipped = head[0] === 0x1f && head[1] === 0x8b;
  if (!gzipped) return JSON.parse(await file.text()) as Fixture;

  const Decompression = (globalThis as { DecompressionStream?: typeof DecompressionStream })
    .DecompressionStream;
  if (!Decompression) throw new Error('This browser cannot read a gzipped capture.');
  const stream = file.stream().pipeThrough(new Decompression('gzip'));
  return JSON.parse(await new Response(stream).text()) as Fixture;
}
