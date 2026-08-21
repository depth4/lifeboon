/**
 * Writing a picture, without a browser.
 *
 * Looking at the result is the check that catches what no number does, and it
 * has to be cheap or it does not happen. This is forty lines and a second, and
 * it needs no GPU: a raw RGB buffer, deflated, wrapped in the four chunks a
 * PNG needs.
 */

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export type Rgb = [number, number, number];

export class Canvas {
  readonly width: number;
  readonly height: number;
  private readonly pixels: Uint8Array;

  constructor(width: number, height: number, background: Rgb) {
    this.width = width;
    this.height = height;
    this.pixels = new Uint8Array(width * height * 3);
    for (let i = 0; i < this.pixels.length; i += 3) {
      this.pixels[i] = background[0];
      this.pixels[i + 1] = background[1];
      this.pixels[i + 2] = background[2];
    }
  }

  set(x: number, y: number, rgb: Rgb): void {
    const cx = Math.round(x);
    const cy = Math.round(y);
    if (cx < 0 || cy < 0 || cx >= this.width || cy >= this.height) return;
    const i = (cy * this.width + cx) * 3;
    this.pixels[i] = rgb[0];
    this.pixels[i + 1] = rgb[1];
    this.pixels[i + 2] = rgb[2];
  }

  line(x0: number, y0: number, x1: number, y1: number, rgb: Rgb, thickness = 1): void {
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      for (let o = 0; o < thickness; o++) this.set(x, y + o - (thickness - 1) / 2, rgb);
    }
  }

  /** Fill the column between two heights: what a cross-section is made of. */
  column(x: number, top: number, bottom: number, rgb: Rgb): void {
    const lo = Math.min(top, bottom);
    const hi = Math.max(top, bottom);
    for (let y = Math.floor(lo); y <= Math.ceil(hi); y++) this.set(x, y, rgb);
  }

  write(path: string): void {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, encode(this.pixels, this.width, this.height));
  }
}

function encode(rgb: Uint8Array, width: number, height: number): Buffer {
  const stride = width * 3 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0;
    Buffer.from(rgb.buffer, y * width * 3, width * 3).copy(raw, y * stride + 1);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function chunk(kind: string, body: Buffer): Buffer {
  const out = Buffer.alloc(body.length + 12);
  out.writeUInt32BE(body.length, 0);
  out.write(kind, 4, 'ascii');
  body.copy(out, 8);
  let crc = -1;
  const covered = out.subarray(4, 8 + body.length);
  for (let i = 0; i < covered.length; i++) {
    crc = CRC_TABLE[(crc ^ covered[i]) & 0xff] ^ (crc >>> 8);
  }
  out.writeUInt32BE((crc ^ -1) >>> 0, 8 + body.length);
  return out;
}
