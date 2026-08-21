/**
 * Real elevation, from the AWS "terrarium" terrain tiles.
 *
 * These are ordinary 256x256 PNGs where the height is packed into the colour
 * channels, published as open data with permissive CORS, and derived from
 * SRTM, ASTER and national surveys. No key, no account, no per-request cost —
 * which is why they are the right source for something that runs entirely in
 * a browser.
 *
 * Resolution is around 20-30 m per pixel at the zoom we use, so this gives a
 * city its hills and valleys, not its kerbs.
 */

import type { BBox } from '../core/geo';
import { Projection } from '../core/geo';
import type { AreaFeature, Waterway } from '../world/types';
import { Heightfield } from './heightfield';
import type { Terrain } from './heightfield';

const TILE_URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium';
const TILE_SIZE = 256;

/** Metres between output samples. Finer than this is inventing detail. */
const SAMPLE_SPACING_M = 20;

export const ELEVATION_ATTRIBUTION =
  'Elevation: AWS Terrain Tiles (SRTM, ASTER, national surveys)';

interface TileId {
  z: number;
  x: number;
  y: number;
}

function tileFor(lat: number, lon: number, z: number): TileId {
  const n = 2 ** z;
  const latRad = (lat * Math.PI) / 180;
  return {
    z,
    x: Math.floor(((lon + 180) / 360) * n),
    y: Math.floor(
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
    ),
  };
}

/** Fractional pixel position of a coordinate inside its tile. */
function pixelFor(lat: number, lon: number, z: number): { x: number; y: number } {
  const n = 2 ** z * TILE_SIZE;
  const latRad = (lat * Math.PI) / 180;
  return {
    x: ((lon + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  };
}

/**
 * Zoom whose pixels land nearest our sample spacing. Going finer just
 * resamples the same source data; going coarser loses real landscape.
 */
function zoomFor(lat: number): number {
  const metresPerPixelAtZ0 = 156543.03392 * Math.cos((lat * Math.PI) / 180);
  const ideal = Math.log2(metresPerPixelAtZ0 / SAMPLE_SPACING_M);
  return Math.max(9, Math.min(13, Math.round(ideal)));
}

/** Decoded tiles for this session; the PNGs themselves sit in the HTTP cache. */
const tileCache = new Map<string, Float32Array>();

function decodeTerrarium(image: HTMLImageElement): Float32Array {
  const canvas = document.createElement('canvas');
  canvas.width = TILE_SIZE;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not read elevation tile: no 2D context');
  ctx.drawImage(image, 0, 0, TILE_SIZE, TILE_SIZE);
  const pixels = ctx.getImageData(0, 0, TILE_SIZE, TILE_SIZE).data;

  const out = new Float32Array(TILE_SIZE * TILE_SIZE);
  for (let i = 0; i < out.length; i++) {
    const o = i * 4;
    // The terrarium encoding, straight from the spec.
    out[i] = pixels[o] * 256 + pixels[o + 1] + pixels[o + 2] / 256 - 32768;
  }
  return out;
}

async function loadTile(id: TileId, signal?: AbortSignal): Promise<Float32Array> {
  const key = `${id.z}/${id.x}/${id.y}`;
  const cached = tileCache.get(key);
  if (cached) return cached;

  const data = await new Promise<Float32Array>((resolve, reject) => {
    const image = new Image();
    // Required, or the canvas is tainted and the pixels cannot be read back.
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      try {
        resolve(decodeTerrarium(image));
      } catch (err) {
        reject(err);
      }
    };
    image.onerror = () => reject(new Error(`Elevation tile ${key} failed to load`));
    signal?.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
    image.src = `${TILE_URL}/${key}.png`;
  });

  tileCache.set(key, data);
  return data;
}

export interface ElevationOptions {
  signal?: AbortSignal;
  onProgress?: (message: string) => void;
}

/**
 * Build a heightfield covering the loaded area.
 *
 * Sampling walks the output grid and asks each point which tile pixel it falls
 * in, rather than reprojecting whole tiles. It costs a little arithmetic per
 * sample and saves a class of subtle projection bugs.
 *
 * Heights come back relative to the middle of the area, so a town at 150 m
 * above sea level still renders around y = 0.
 */
export async function fetchHeightfield(
  bbox: BBox,
  opts: ElevationOptions = {},
): Promise<Heightfield> {
  const proj = Projection.fromBBox(bbox);
  const z = zoomFor(proj.originLat);

  // The output grid, in projected metres, covering the bbox corners.
  const [westX, northZ] = proj.project(bbox.north, bbox.west);
  const [eastX, southZ] = proj.project(bbox.south, bbox.east);
  const minX = Math.min(westX, eastX);
  const minZ = Math.min(northZ, southZ);
  const width = Math.abs(eastX - westX);
  const depth = Math.abs(southZ - northZ);

  const cols = Math.max(2, Math.ceil(width / SAMPLE_SPACING_M) + 1);
  const rows = Math.max(2, Math.ceil(depth / SAMPLE_SPACING_M) + 1);

  // Which tiles does the area touch?
  const corners = [
    tileFor(bbox.north, bbox.west, z),
    tileFor(bbox.north, bbox.east, z),
    tileFor(bbox.south, bbox.west, z),
    tileFor(bbox.south, bbox.east, z),
  ];
  const minTileX = Math.min(...corners.map((t) => t.x));
  const maxTileX = Math.max(...corners.map((t) => t.x));
  const minTileY = Math.min(...corners.map((t) => t.y));
  const maxTileY = Math.max(...corners.map((t) => t.y));

  const needed: TileId[] = [];
  for (let x = minTileX; x <= maxTileX; x++) {
    for (let y = minTileY; y <= maxTileY; y++) needed.push({ z, x, y });
  }

  opts.onProgress?.(
    `Reading elevation (${needed.length} tile${needed.length === 1 ? '' : 's'})…`,
  );

  const tiles = new Map<string, Float32Array>();
  const loaded = await Promise.all(
    needed.map(async (id) => ({ id, data: await loadTile(id, opts.signal) })),
  );
  for (const { id, data } of loaded) tiles.set(`${id.z}/${id.x}/${id.y}`, data);

  const out = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    const worldZ = minZ + r * SAMPLE_SPACING_M;
    for (let c = 0; c < cols; c++) {
      const worldX = minX + c * SAMPLE_SPACING_M;
      const { lat, lon } = proj.unproject(worldX, worldZ);
      const px = pixelFor(lat, lon, z);

      const tileX = Math.floor(px.x / TILE_SIZE);
      const tileY = Math.floor(px.y / TILE_SIZE);
      const tile = tiles.get(`${z}/${tileX}/${tileY}`);
      if (!tile) continue;

      // Bilinear inside the tile keeps the 20 m grid from looking stepped.
      const fx = px.x - tileX * TILE_SIZE;
      const fy = px.y - tileY * TILE_SIZE;
      const x0 = Math.min(TILE_SIZE - 1, Math.max(0, Math.floor(fx)));
      const y0 = Math.min(TILE_SIZE - 1, Math.max(0, Math.floor(fy)));
      const x1 = Math.min(TILE_SIZE - 1, x0 + 1);
      const y1 = Math.min(TILE_SIZE - 1, y0 + 1);
      const tx = fx - x0;
      const ty = fy - y0;

      const h00 = tile[y0 * TILE_SIZE + x0];
      const h10 = tile[y0 * TILE_SIZE + x1];
      const h01 = tile[y1 * TILE_SIZE + x0];
      const h11 = tile[y1 * TILE_SIZE + x1];
      const top = h00 + (h10 - h00) * tx;
      const bottom = h01 + (h11 - h01) * tx;
      out[r * cols + c] = top + (bottom - top) * ty;
    }
  }

  // Re-centre on the middle of the area.
  const centreIndex = Math.floor(rows / 2) * cols + Math.floor(cols / 2);
  const datum = out[centreIndex];
  for (let i = 0; i < out.length; i++) out[i] -= datum;

  return new Heightfield(out, cols, rows, minX, minZ, SAMPLE_SPACING_M);
}

/**
 * A believable landscape for the generated offline city.
 *
 * Not a real place and never presented as one — it exists so the terrain
 * pipeline can be exercised without a network, and so the offline city has
 * hills to sit on like a real one would.
 */
export function syntheticHeightfield(radius: number, seed: number): Heightfield {
  const spacing = SAMPLE_SPACING_M;
  const cols = Math.ceil((radius * 2) / spacing) + 1;
  const rows = cols;
  const data = new Float32Array(cols * rows);

  // A couple of broad ridges plus finer variation; amplitudes chosen to land
  // near the 40-60 m of relief a real hillside town has across a few km.
  const s = (seed % 1000) / 1000;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = -radius + c * spacing;
      const z = -radius + r * spacing;
      const h =
        Math.sin(x * 0.0018 + s * 6.3) * 14 +
        Math.cos(z * 0.0022 + s * 3.1) * 12 +
        Math.sin((x + z) * 0.0009 + s) * 9 +
        Math.sin(x * 0.006 + z * 0.004) * 2.5;
      data[r * cols + c] = h;
    }
  }

  const centre = data[Math.floor(rows / 2) * cols + Math.floor(cols / 2)];
  for (let i = 0; i < data.length; i++) data[i] -= centre;

  return new Heightfield(data, cols, rows, -radius, -radius, spacing);
}


/**
 * Cut river and lake beds into the terrain.
 *
 * Satellite elevation does not see under water: at 20-30 m per sample a river
 * reads at roughly the height of its own banks. Laying a flat water surface at
 * that level leaves it buried by the surrounding grid, which is why water
 * shows only in the few places the data happens to dip. Carving the channel
 * fixes the picture and is also closer to the truth — there is a channel there.
 *
 * Returns the surface level chosen for each water feature, keyed by id, so the
 * renderer draws the water exactly where the bed was cut.
 */
export function carveWaterways(
  terrain: Terrain,
  areas: AreaFeature[],
  waterways: Waterway[] = [],
): { areaLevels: Map<string, number>; flowLevels: Map<string, number[]> } {
  const levels = new Map<string, number>();
  const flowLevels = new Map<string, number[]>();
  if (!(terrain instanceof Heightfield)) return { areaLevels: levels, flowLevels };

  for (const area of areas) {
    if (area.kind !== 'water' || area.ring.length < 3) continue;

    // The bank is the honest reference: the lowest ground around the outline.
    let level = Infinity;
    for (const [x, z] of area.ring) {
      const h = terrain.heightAt(x, z);
      if (h < level) level = h;
    }
    if (!isFinite(level)) continue;

    // The bed goes below the surface so the water reads as water rather than
    // as a decal fighting the ground for the same pixels. How far below, and
    // how the bank shelves up to meet it, is carveTo's business.
    terrain.carveTo(area.ring, level);
    levels.set(area.id, level);
  }

  // Narrow rivers are lines, and a line needs a profile rather than one level:
  // water runs downhill. Taking a running minimum from the higher end
  // guarantees it never flows uphill, whatever noise the elevation data has.
  for (const flow of waterways) {
    if (flow.tunnel || flow.points.length < 2) continue;

    const raw = flow.points.map(([x, z]) => terrain.heightAt(x, z));
    const startsHigher = raw[0] >= raw[raw.length - 1];
    const profile = raw.slice();
    if (startsHigher) {
      for (let i = 1; i < profile.length; i++) {
        profile[i] = Math.min(profile[i], profile[i - 1]);
      }
    } else {
      for (let i = profile.length - 2; i >= 0; i--) {
        profile[i] = Math.min(profile[i], profile[i + 1]);
      }
    }

    // A stream cuts a shallower channel than a river.
    const depth = Math.max(0.6, Math.min(2.5, flow.width * 0.25));
    terrain.carveAlong(flow.points, flow.width / 2 + 1, profile, depth);
    flowLevels.set(flow.id, profile);
  }

  if (levels.size || flowLevels.size) terrain.recomputeBounds();
  return { areaLevels: levels, flowLevels };
}
