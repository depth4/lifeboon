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

/** Asphalt: slightly noisy grey so roads are not flat colour up close. */
export function asphaltTexture(): THREE.Texture {
  const SIZE = 256;
  const { c, ctx } = canvas(SIZE);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, SIZE, SIZE);
  const img = ctx.getImageData(0, 0, SIZE, SIZE);
  const rng = new Rng(7);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = 226 + rng.int(0, 30);
    img.data[i] = n;
    img.data[i + 1] = n;
    img.data[i + 2] = n;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Grass/ground speckle, reused for parks and the base plane. */
export function groundTexture(): THREE.Texture {
  const SIZE = 256;
  const { c, ctx } = canvas(SIZE);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, SIZE, SIZE);
  const rng = new Rng(99);
  for (let i = 0; i < 5000; i++) {
    const shade = 200 + rng.int(0, 56);
    ctx.fillStyle = `rgba(${shade},${shade},${shade},0.5)`;
    ctx.fillRect(rng.range(0, SIZE), rng.range(0, SIZE), rng.range(1, 3), rng.range(1, 3));
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
