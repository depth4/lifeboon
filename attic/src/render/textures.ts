/**
 * Procedural textures, drawn once into canvases at start-up.
 *
 * Everything here is generated — nothing is downloaded, nothing is
 * photographic, and no signage, logo or lettering is ever drawn. Facades get
 * windows and floor lines; that is the whole vocabulary.
 */

import * as THREE from 'three';
import { Rng } from '../core/rng';

/** Windows per texture tile, in both directions. */
export const WINDOWS_PER_TILE = 8;
/** Metres one texture tile covers — 8 floors of 3.2 m. */
export const TILE_METRES = WINDOWS_PER_TILE * 3.2;

/**
 * Where a window sits inside its cell, as fractions of the cell.
 * The day facade and the night light mask MUST agree on this, or lit windows
 * float beside the openings they are supposed to be shining through.
 */
const WINDOW_RECT = { left: 0.26, top: 0.3, width: 0.48, height: 0.42 };

function windowRect(col: number, row: number, cell: number) {
  return {
    x: col * cell + cell * WINDOW_RECT.left,
    y: row * cell + cell * WINDOW_RECT.top,
    w: cell * WINDOW_RECT.width,
    h: cell * WINDOW_RECT.height,
  };
}

function canvas(size: number): { c: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  return { c, ctx };
}

/**
 * Daytime facade: a light wall with recessed darker windows and a subtle
 * floor line. Used as `map`, multiplied by each building's own colour.
 */
export function facadeTexture(): THREE.Texture {
  const SIZE = 512;
  const { c, ctx } = canvas(SIZE);
  const cell = SIZE / WINDOWS_PER_TILE;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Faint vertical banding so large blank walls are not perfectly flat.
  for (let x = 0; x < SIZE; x += 4) {
    ctx.fillStyle = `rgba(0,0,0,${0.012 + Math.random() * 0.012})`;
    ctx.fillRect(x, 0, 2, SIZE);
  }

  for (let row = 0; row < WINDOWS_PER_TILE; row++) {
    // Floor slab line.
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.fillRect(0, row * cell, SIZE, Math.max(2, cell * 0.05));

    for (let col = 0; col < WINDOWS_PER_TILE; col++) {
      const { x, y, w, h } = windowRect(col, row, cell);

      // Glass: darker than the wall, but sky reflects off it, so a flat black
      // rectangle reads as a hole. A vertical gradient with a bright reveal at
      // the head of the opening is what makes it look like glazing.
      const glass = ctx.createLinearGradient(0, y, 0, y + h);
      glass.addColorStop(0, 'rgba(0,0,0,0.34)');
      glass.addColorStop(0.45, 'rgba(0,0,0,0.27)');
      glass.addColorStop(1, 'rgba(0,0,0,0.36)');
      ctx.fillStyle = glass;
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.fillRect(x, y, w, Math.max(1, h * 0.1));
      // Frame, and a sill catching the light below the opening.
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = Math.max(1, cell * 0.025);
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.13)';
      ctx.fillRect(x - cell * 0.02, y + h, w + cell * 0.04, Math.max(1, cell * 0.035));
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Night-time emissive mask: only some windows are lit, and they are lit in
 * slightly different tones. Black elsewhere, so the wall itself never glows.
 */
export function windowLightTexture(seed = 12345): THREE.Texture {
  const SIZE = 512;
  const { c, ctx } = canvas(SIZE);
  const cell = SIZE / WINDOWS_PER_TILE;
  const rng = new Rng(seed);

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, SIZE, SIZE);

  for (let row = 0; row < WINDOWS_PER_TILE; row++) {
    for (let col = 0; col < WINDOWS_PER_TILE; col++) {
      if (!rng.chance(0.42)) continue;
      const { x, y, w, h } = windowRect(col, row, cell);
      // Warm domestic light, occasionally cooler (an office still working).
      const warm = rng.chance(0.75);
      const r = warm ? 255 : 210;
      const g = warm ? rng.int(200, 235) : 228;
      const b = warm ? rng.int(140, 185) : 255;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, w, h);
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Value noise on a canvas, in pixels. Everything below is built from it.
 *
 * Per-pixel random noise — which is what these textures used to be — carries
 * no structure at all: at any distance where more than one texel lands in a
 * pixel it averages to a flat tone, so the surface reads as plastic from two
 * metres away and from two hundred. Real surfaces have features at every scale
 * from a grain of aggregate to a patch of repair, and a texture has to as well
 * or it may as well not be there.
 */
function noiseField(size: number, cell: number, seed: number): Float32Array {
  const rng = new Rng(seed);
  const cols = Math.ceil(size / cell) + 2;
  const grid = new Float32Array(cols * cols);
  for (let i = 0; i < grid.length; i++) grid[i] = rng.next();

  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    const fy = y / cell;
    const iy = Math.floor(fy);
    let ty = fy - iy;
    ty = ty * ty * (3 - 2 * ty);
    for (let x = 0; x < size; x++) {
      const fx = x / cell;
      const ix = Math.floor(fx);
      let tx = fx - ix;
      tx = tx * tx * (3 - 2 * tx);
      const a = grid[iy * cols + ix];
      const b = grid[iy * cols + ix + 1];
      const c = grid[(iy + 1) * cols + ix];
      const d = grid[(iy + 1) * cols + ix + 1];
      const top = a + (b - a) * tx;
      const bot = c + (d - c) * tx;
      out[y * size + x] = top + (bot - top) * ty;
    }
  }
  return out;
}

/** Sum several octaves of `noiseField`, normalised to 0..1. */
function fractal(size: number, cells: number[], weights: number[], seed: number): Float32Array {
  const out = new Float32Array(size * size);
  let total = 0;
  cells.forEach((cell, i) => {
    const layer = noiseField(size, cell, seed + i * 7919);
    const w = weights[i];
    total += w;
    for (let j = 0; j < out.length; j++) out[j] += layer[j] * w;
  });
  for (let j = 0; j < out.length; j++) out[j] /= total;
  return out;
}

function finish(c: HTMLCanvasElement, anisotropy = 8): THREE.Texture {
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  return tex;
}

/**
 * Asphalt.
 *
 * One tile covers about 3.2 m (see UV_SCALE in render/roads.ts), so at 512 px
 * a pixel is 6 mm and the structure has to run from single stones a few pixels
 * across up to patches of a metre. Three things are drawn: the aggregate, the
 * broad unevenness of a surface that has been laid and re-laid, and a few
 * cracks, which are what the eye actually uses to judge that a road is a road.
 */
export function asphaltTexture(): THREE.Texture {
  const SIZE = 512;
  const { c, ctx } = canvas(SIZE);
  const rng = new Rng(31);

  const grain = fractal(SIZE, [2, 5, 13], [0.5, 0.3, 0.2], 11);
  // Kept weak: anything at the scale of the tile tiles visibly on a long road.
  const patch = fractal(SIZE, [70, 170], [0.45, 0.55], 23);

  const img = ctx.createImageData(SIZE, SIZE);
  for (let i = 0; i < SIZE * SIZE; i++) {
    // Multiplied against the vertex colour, so this is a lightness field
    // around 1 rather than a colour: 0.82 to 1.10 is a strong-looking road
    // without the texture fighting the material underneath it.
    const v = 0.84 + grain[i] * 0.2 + (patch[i] - 0.5) * 0.04;
    const n = Math.round(Math.min(1, v) * 255);
    img.data[i * 4] = n;
    img.data[i * 4 + 1] = n;
    img.data[i * 4 + 2] = Math.round(Math.min(1, v * 0.995) * 255);
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  // Cracks: a few meandering dark lines, drawn wrapping so tiles still join.
  ctx.lineCap = 'round';
  for (let k = 0; k < 5; k++) {
    ctx.strokeStyle = `rgba(0,0,0,${0.1 + rng.next() * 0.12})`;
    ctx.lineWidth = 1 + rng.next() * 1.6;
    let x = rng.range(0, SIZE);
    let y = rng.range(0, SIZE);
    let dir = rng.range(0, Math.PI * 2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let step = 0; step < 26; step++) {
      dir += rng.range(-0.7, 0.7);
      x = (x + Math.cos(dir) * 18 + SIZE) % SIZE;
      y = (y + Math.sin(dir) * 18 + SIZE) % SIZE;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  return finish(c);
}

/**
 * Paving and kerbstone: slabs with joints, each slab a slightly different tone.
 * One tile is about 1.1 m, so four slabs across reads as 27 cm units — close
 * to what is actually laid.
 */
export function pavingTexture(): THREE.Texture {
  const SIZE = 512;
  const { c, ctx } = canvas(SIZE);
  const rng = new Rng(77);
  const SLABS = 4;
  const cell = SIZE / SLABS;

  const grain = fractal(SIZE, [3, 11], [0.6, 0.4], 43);
  const img = ctx.createImageData(SIZE, SIZE);
  for (let i = 0; i < SIZE * SIZE; i++) {
    const v = 0.88 + grain[i] * 0.18;
    const n = Math.round(Math.min(1, v) * 255);
    img.data[i * 4] = n;
    img.data[i * 4 + 1] = n;
    img.data[i * 4 + 2] = n;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  for (let row = 0; row < SLABS; row++) {
    for (let col = 0; col < SLABS; col++) {
      // Every slab was cast in a different batch and has weathered
      // differently — but in tone, not in hue. Randomising the channels
      // separately, which is what this did first, gave a pavement of pink and
      // green slabs.
      const light = rng.chance(0.5);
      ctx.fillStyle = `rgba(${light ? 255 : 0},${light ? 255 : 0},${light ? 255 : 0},${rng.range(0.02, 0.07)})`;
      ctx.fillRect(col * cell, row * cell, cell, cell);
    }
  }

  // Joints, and the shadow one side of them casts into the other.
  ctx.strokeStyle = 'rgba(0,0,0,0.24)';
  ctx.lineWidth = Math.max(1.5, cell * 0.028);
  for (let i = 0; i <= SLABS; i++) {
    const p = i * cell;
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, SIZE); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(SIZE, p); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = Math.max(1, cell * 0.018);
  for (let i = 0; i <= SLABS; i++) {
    const p = i * cell + cell * 0.022;
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, SIZE); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(SIZE, p); ctx.stroke();
  }
  return finish(c);
}

/**
 * Turf, used for open ground and for the verge beside a road.
 *
 * A tile is a couple of metres, so this is clumps rather than blades: bare
 * patches, tufts that catch the light, and the broad unevenness of ground that
 * nobody mows to a stripe.
 */
export function groundTexture(): THREE.Texture {
  const SIZE = 512;
  const { c, ctx } = canvas(SIZE);
  // Only detail finer than the tile itself.
  //
  // A texture repeats; a noise field sampled at world position does not. Put
  // anything at the scale of the tile into the texture and it shows up as a
  // grid across a field — which is exactly what a low camera over open ground
  // showed. So the texture carries clumps and the *colour* carries everything
  // larger, out of the same field the roads and the land cover use.
  const clump = fractal(SIZE, [4, 9, 22], [0.4, 0.35, 0.25], 5);

  const img = ctx.createImageData(SIZE, SIZE);
  for (let i = 0; i < SIZE * SIZE; i++) {
    const v = 0.84 + clump[i] * 0.22;
    const lift = Math.min(1, v);
    img.data[i * 4] = Math.round(lift * 250);
    img.data[i * 4 + 1] = Math.round(Math.min(1, v * 1.03) * 255);
    img.data[i * 4 + 2] = Math.round(lift * 236);
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return finish(c);
}

/**
 * Roof covering: courses of tile or sheet, laid across the slope.
 *
 * A roof drawn as flat colour is a triangle of paint, and roofs are the single
 * largest thing you see of a town from above — half the frame at any useful
 * viewing angle. What makes one read as a roof is the run of courses and the
 * shadow each one casts on the next, so that is what is drawn: the horizontal
 * line every course length, a lighter edge above it, and enough grain that a
 * whole roof plane is never one value.
 */
export function roofTexture(): THREE.Texture {
  const SIZE = 512;
  const { c, ctx } = canvas(SIZE);
  const rng = new Rng(131);
  // One tile is 1.6 m across (see ROOF_UV_M), so eight courses is 20 cm each.
  const COURSES = 8;
  const cell = SIZE / COURSES;

  const grain = fractal(SIZE, [3, 9, 30], [0.4, 0.35, 0.25], 97);
  const img = ctx.createImageData(SIZE, SIZE);
  for (let i = 0; i < SIZE * SIZE; i++) {
    const v = 0.84 + grain[i] * 0.22;
    const n = Math.round(Math.min(1, v) * 255);
    img.data[i * 4] = n;
    img.data[i * 4 + 1] = Math.round(Math.min(1, v * 0.99) * 255);
    img.data[i * 4 + 2] = Math.round(Math.min(1, v * 0.97) * 255);
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  for (let row = 0; row < COURSES; row++) {
    const y = row * cell;
    // The shadow the course above throws down onto this one.
    const grad = ctx.createLinearGradient(0, y, 0, y + cell * 0.4);
    grad.addColorStop(0, 'rgba(0,0,0,0.30)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, SIZE, cell * 0.4);
    // The lit lip of the course itself.
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.fillRect(0, y + cell - Math.max(1, cell * 0.09), SIZE, Math.max(1, cell * 0.09));

    // Broken vertical joints, so the courses are units and not stripes.
    const perRow = 9;
    const offset = rng.range(0, cell);
    for (let k = 0; k < perRow; k++) {
      const x = ((k * SIZE) / perRow + offset) % SIZE;
      ctx.fillStyle = 'rgba(0,0,0,0.13)';
      ctx.fillRect(x, y + cell * 0.12, Math.max(1, SIZE * 0.0035), cell * 0.82);
    }
  }
  return finish(c);
}
