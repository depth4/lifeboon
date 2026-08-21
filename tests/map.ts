/**
 * A plan of the placed parts, drawn from above.
 *
 * The user's own picture of what this architecture is for: *"соединять как
 * пути видом сверху, как в симуляторе."* This draws exactly that — every cell
 * of every part, in plan, coloured by what it is — and it needs no browser,
 * which matters because the sandbox renders the real app at well under one
 * frame per second and a screenshot of it costs a quarter of an hour.
 *
 * It is not a substitute for looking at the 3D city, and it does not pretend
 * to be. It is the check that catches the class of bug no ground metric can:
 * paving where grass should be, a junction that is not joined to its streets,
 * a corner that folds. Those are all visible in plan in one glance.
 *
 *     npm run map                      # the offline city
 *     npm run map -- capture.json.gz   # a town the user exported
 *     npm run map -- capture.json.gz 300 120 -40   # span, then centre
 */

import { gunzipSync } from 'node:zlib';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

import { fromFixture, type Fixture } from '../src/data/fixture';
import { generateCity } from '../src/data/procedural';
import { RoadNetwork } from '../src/world/network';
import { placeNetwork } from '../src/world/parts/place';
import { Role, ROLE_NAMES, type Part } from '../src/world/parts';
import type { World } from '../src/world/types';

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

const args = process.argv.slice(2);
const file = args[0] && !/^-?[\d.]+$/.test(args[0]) ? args[0] : undefined;
const nums = args.filter((a) => /^-?[\d.]+$/.test(a)).map(Number);
const span = nums[0] ?? 700;
const centreX = nums[1] ?? 0;
const centreZ = nums[2] ?? 0;

const world: World = file ? load(file) : generateCity('lifeboon', 900);
const net = RoadNetwork.build(world.roads);
const placed = placeNetwork(net, world.roads, world.terrain, world.norm);

console.log(`${world.stats.placeName}`);
console.log(`  ${net.nodes.length} nodes, ${net.edges.length} edges, `
  + `${placed.parts.filter((p) => p.kind === 'junction').length} junctions`);
console.log(`  plan: ${span} m across, centred on ${centreX}, ${centreZ}`);

/* ------------------------------------------------------------- the canvas */

const SIZE = 1400;
const scale = SIZE / span;
const pixels = new Uint8Array(SIZE * SIZE * 3);
// Bare earth, so anything the parts do not cover reads as ground.
for (let i = 0; i < pixels.length; i += 3) {
  pixels[i] = 0x6f;
  pixels[i + 1] = 0x71;
  pixels[i + 2] = 0x58;
}

const COLOR: Record<number, [number, number, number]> = {
  [Role.Carriageway]: [0x4a, 0x4a, 0x4e],
  [Role.Parking]: [0x5c, 0x5a, 0x58],
  [Role.KerbFace]: [0x6f, 0x6c, 0x66],
  [Role.KerbTop]: [0xb4, 0xaf, 0xa4],
  [Role.Verge]: [0x79, 0x81, 0x4f],
  [Role.Pavement]: [0x9d, 0x99, 0x8f],
  [Role.Junction]: [0x3f, 0x3f, 0x46],
  [Role.Crossing]: [0xc8, 0xc4, 0xba],
  [Role.Batter]: [0x86, 0x7c, 0x60],
  [Role.Parapet]: [0xa8, 0xa4, 0x9a],
  [Role.Fascia]: [0x70, 0x6d, 0x66],
};

// Painted last, so the shapes a junction makes are on top of the streets that
// reach it — which is also the order the eye needs to judge whether they meet.
const order: Part[] = [
  ...placed.parts.filter((p) => p.kind !== 'junction'),
  ...placed.parts.filter((p) => p.kind === 'junction'),
];

const counted = new Map<number, number>();
for (const part of order) {
  const { rows, cols, x, z, cell } = part.lattice;
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const role = cell[r * (cols - 1) + c];
      const rgb = COLOR[role];
      if (!rgb) continue;
      counted.set(role, (counted.get(role) ?? 0) + 1);
      const i0 = r * cols + c;
      const i1 = i0 + 1;
      const i2 = i0 + cols + 1;
      const i3 = i0 + cols;
      // Same split as the renderer and the field: 0-1-2 and 0-2-3.
      triangle(x[i0], z[i0], x[i1], z[i1], x[i2], z[i2], rgb);
      triangle(x[i0], z[i0], x[i2], z[i2], x[i3], z[i3], rgb);
    }
  }
  // The lines the lane model asks for, so it is visible that they follow lanes.
  for (const mark of part.marks) {
    for (let r = 0; r < rows - 1; r += 2) {
      const a = r * cols + mark.col;
      const b = a + cols;
      line(x[a], z[a], x[b], z[b], mark.kind === 'centre' ? [232, 228, 216] : [200, 196, 186]);
    }
  }
}

console.log('  cells drawn: ' + [...counted]
  .sort((a, b) => b[1] - a[1])
  .map(([role, n]) => `${ROLE_NAMES[role]} ${n}`)
  .join(', '));

const out = '.tmp/plan.png';
mkdirSync('.tmp', { recursive: true });
writeFileSync(out, png(pixels, SIZE, SIZE));
console.log(`  wrote ${out}`);

/* ------------------------------------------------------------ rasterising */

function px(x: number, z: number): [number, number] {
  return [(x - centreX) * scale + SIZE / 2, (z - centreZ) * scale + SIZE / 2];
}

function put(cx: number, cy: number, rgb: [number, number, number]): void {
  if (cx < 0 || cy < 0 || cx >= SIZE || cy >= SIZE) return;
  const i = (cy * SIZE + cx) * 3;
  pixels[i] = rgb[0];
  pixels[i + 1] = rgb[1];
  pixels[i + 2] = rgb[2];
}

function triangle(
  ax: number, az: number, bx: number, bz: number, cx: number, cz: number,
  rgb: [number, number, number],
): void {
  const [x0, y0] = px(ax, az);
  const [x1, y1] = px(bx, bz);
  const [x2, y2] = px(cx, cz);
  const minX = Math.max(0, Math.floor(Math.min(x0, x1, x2)));
  const maxX = Math.min(SIZE - 1, Math.ceil(Math.max(x0, x1, x2)));
  const minY = Math.max(0, Math.floor(Math.min(y0, y1, y2)));
  const maxY = Math.min(SIZE - 1, Math.ceil(Math.max(y0, y1, y2)));
  const det = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
  if (Math.abs(det) < 1e-9) return;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const rx = x + 0.5 - x0;
      const ry = y + 0.5 - y0;
      const u = (rx * (y2 - y0) - ry * (x2 - x0)) / det;
      const v = (ry * (x1 - x0) - rx * (y1 - y0)) / det;
      if (u < 0 || v < 0 || u + v > 1) continue;
      put(x, y, rgb);
    }
  }
}

function line(
  ax: number, az: number, bx: number, bz: number, rgb: [number, number, number],
): void {
  const [x0, y0] = px(ax, az);
  const [x1, y1] = px(bx, bz);
  const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0));
  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    put(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t), rgb);
  }
}

/* ------------------------------------------------------------- PNG, by hand */

function png(rgb: Uint8Array, width: number, height: number): Buffer {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 3 + 1)] = 0;
    Buffer.from(rgb.buffer, y * width * 3, width * 3)
      .copy(raw, y * (width * 3 + 1) + 1);
  }
  const chunks = [
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header(width, height)),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ];
  return Buffer.concat(chunks);
}

function header(width: number, height: number): Buffer {
  const b = Buffer.alloc(13);
  b.writeUInt32BE(width, 0);
  b.writeUInt32BE(height, 4);
  b[8] = 8;
  b[9] = 2;
  return b;
}

function chunk(kind: string, body: Buffer): Buffer {
  const b = Buffer.alloc(body.length + 12);
  b.writeUInt32BE(body.length, 0);
  b.write(kind, 4, 'ascii');
  body.copy(b, 8);
  b.writeUInt32BE(crc32(b.subarray(4, 8 + body.length)) >>> 0, 8 + body.length);
  return b;
}

function crc32(buf: Buffer): number {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ -1;
}

function load(path: string): World {
  const raw = readFileSync(path);
  const text = raw[0] === 0x1f && raw[1] === 0x8b
    ? gunzipSync(raw).toString('utf8') : raw.toString('utf8');
  return fromFixture(JSON.parse(text) as Fixture);
}
