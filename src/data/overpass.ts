/**
 * Talking to OpenStreetMap.
 *
 * Overpass is a public, volunteer-funded service, so this module is written to
 * be a polite client: one request per area, results cached in IndexedDB for a
 * week, mirrors tried in turn on failure, and a bounded area so we never ask
 * for a whole country by accident.
 */

import type { BBox, LatLon } from '../core/geo';
import { bboxSizeM } from '../core/geo';

const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

/** Largest area we will ask for, in metres across. Beyond this the browser
 *  chokes on geometry long before Overpass does. */
export const MAX_SPAN_M = 6000;

export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
  geometry?: Array<{ lat: number; lon: number }>;
  members?: Array<{
    type: string;
    ref: number;
    role: string;
    geometry?: Array<{ lat: number; lon: number }>;
  }>;
}

export interface OverpassResponse {
  elements: OverpassElement[];
}

/**
 * The one query we run. `out geom` inlines coordinates on ways and relation
 * members, which saves a second round trip to resolve node references.
 */
function buildQuery(bbox: BBox): string {
  const b = `${bbox.south.toFixed(6)},${bbox.west.toFixed(6)},${bbox.north.toFixed(6)},${bbox.east.toFixed(6)}`;
  return `[out:json][timeout:90];
(
  way["building"](${b});
  relation["building"]["type"="multipolygon"](${b});
  way["highway"](${b});
  way["railway"](${b});
  node["highway"="crossing"](${b});
  way["natural"~"^(water|wood|scrub|grassland|sand|beach)$"](${b});
  way["waterway"="riverbank"](${b});
  relation["natural"="water"]["type"="multipolygon"](${b});
  way["landuse"~"^(grass|forest|meadow|village_green|cemetery|recreation_ground|reservoir|basin)$"](${b});
  way["leisure"~"^(park|garden|pitch|playground|sports_centre)$"](${b});
  way["amenity"~"^(parking|grave_yard)$"](${b});
  node["amenity"](${b});
  node["shop"](${b});
  node["leisure"](${b});
  node["office"](${b});
  node["tourism"~"^(museum|gallery|hotel)$"](${b});
  node["railway"="station"](${b});
);
out body geom qt;`;
}

/* ------------------------------------------------------------------ cache */

const DB_NAME = 'lifeboon-osm';
const STORE = 'areas';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

async function cacheGet(key: string): Promise<OverpassResponse | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => {
      const row = req.result as { at: number; data: OverpassResponse } | undefined;
      if (row && Date.now() - row.at < CACHE_TTL_MS) resolve(row.data);
      else resolve(null);
    };
    req.onerror = () => resolve(null);
  });
}

async function cachePut(key: string, data: OverpassResponse): Promise<void> {
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put({ at: Date.now(), data }, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

function cacheKey(bbox: BBox): string {
  return [bbox.south, bbox.west, bbox.north, bbox.east].map((v) => v.toFixed(5)).join(',');
}

/* ----------------------------------------------------------------- fetch */

export class OverpassError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'OverpassError';
  }
}

export interface FetchOptions {
  signal?: AbortSignal;
  onProgress?: (message: string) => void;
}

export async function fetchArea(bbox: BBox, opts: FetchOptions = {}): Promise<OverpassResponse> {
  const size = bboxSizeM(bbox);
  if (Math.max(size.width, size.height) > MAX_SPAN_M) {
    throw new OverpassError(
      `Area is ${Math.round(Math.max(size.width, size.height))} m across; the limit is ${MAX_SPAN_M} m.`,
    );
  }

  const key = cacheKey(bbox);
  const cached = await cacheGet(key);
  if (cached) {
    opts.onProgress?.('Loaded from local cache');
    return cached;
  }

  const query = buildQuery(bbox);
  let lastError: unknown;

  for (let i = 0; i < MIRRORS.length; i++) {
    const url = MIRRORS[i];
    try {
      opts.onProgress?.(
        i === 0 ? 'Querying OpenStreetMap…' : `Mirror ${i + 1} of ${MIRRORS.length}…`,
      );
      const res = await fetch(url, {
        method: 'POST',
        body: new URLSearchParams({ data: query }),
        signal: opts.signal,
      });
      if (!res.ok) {
        // 429/504 mean the mirror is busy; the next one may not be.
        throw new OverpassError(`${url} returned HTTP ${res.status}`);
      }
      const json = (await res.json()) as OverpassResponse;
      if (!json || !Array.isArray(json.elements)) {
        throw new OverpassError('Malformed response from Overpass');
      }
      await cachePut(key, json);
      return json;
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') throw err;
      lastError = err;
    }
  }

  throw new OverpassError(
    'Could not reach any OpenStreetMap mirror. Check your connection, or switch to the offline city.',
    lastError,
  );
}

/* -------------------------------------------------------------- geocoding */

export interface GeocodeResult {
  name: string;
  lat: number;
  lon: number;
}

/** Look a place up by name. Nominatim asks for a descriptive UA/Referer. */
export async function geocode(query: string, signal?: AbortSignal): Promise<GeocodeResult[]> {
  const url = `${NOMINATIM}?${new URLSearchParams({
    q: query,
    format: 'jsonv2',
    limit: '5',
    addressdetails: '0',
  })}`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new OverpassError(`Place search failed (HTTP ${res.status})`);
  const rows = (await res.json()) as Array<{ display_name: string; lat: string; lon: string }>;
  return rows.map((r) => ({
    name: r.display_name,
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
  }));
}

export function centreOf(bbox: BBox): LatLon {
  return { lat: (bbox.south + bbox.north) / 2, lon: (bbox.west + bbox.east) / 2 };
}
