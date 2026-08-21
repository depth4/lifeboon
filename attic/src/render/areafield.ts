/**
 * Land cover as paint on the ground rather than sheets laid over it.
 *
 * A park used to be its own mesh, draped on the terrain and lifted a few
 * centimetres clear of it so the two would not flicker; a lawn inside that
 * park was lifted again, and so on up a stack that reached 21 cm. Every one of
 * those numbers existed to keep two surfaces out of each other's way, and the
 * road then had to be built above the whole stack and the earth dug out
 * beneath it to hide the polygons that crossed a street. Nothing in that
 * arrangement was a fact about land.
 *
 * Land cover is not a thing standing on the ground. It *is* the ground —
 * grass, gravel, sand, mown turf — so here it is what the ground is made of:
 * a raster of what covers each square, sampled by the ground mesh as it is
 * built. One surface, one height, nothing to lift and nothing to hide.
 *
 * The cost is honest and worth stating: a boundary can only be as sharp as
 * the mesh that carries it, so a park edge is now soft to within a cell
 * instead of geometrically exact. That is acceptable *for land cover
 * specifically* — the palette deliberately keeps these tones close together,
 * because the edge of a park in the world is a fence and a change of mowing,
 * not a change of colour. It would not be acceptable for a kerb, which is why
 * streets keep their own geometry and cut the ground away instead.
 */

import * as THREE from 'three';
import type { AreaFeature, AreaKind, Vec2 } from '../world/types';
import {
  CEMETERY, FOREST_FLOOR, HARDSTANDING, PARK_TURF, PAVING, PITCH, SAND, TURF, WATER,
} from './palette';

/**
 * Land cover, deliberately close to the open ground it sits on.
 *
 * These used to be a spread of saturated greens a long way apart from each
 * other and from the base ground, which made every polygon boundary a visible
 * edge — a park read as a green rectangle painted on a different green. Real
 * land cover differs in tone, not in hue.
 */
export const AREA_COLOR: Record<AreaKind, THREE.Color> = {
  water: WATER,
  park: PARK_TURF,
  forest: FOREST_FLOOR,
  grass: TURF,
  sand: SAND,
  pitch: PITCH,
  cemetery: CEMETERY,
  parking: HARDSTANDING,
  pavement: PAVING,
};

/** Which kinds are soft ground, and so get the full turf variation. */
export const SOFT: ReadonlySet<AreaKind> = new Set<AreaKind>([
  'park', 'forest', 'grass', 'pitch', 'cemetery',
]);

/** How many levels of containment are worth resolving. */
const MAX_NESTING = 3;

export function triangulate(
  ring: Vec2[],
  holes: Vec2[][],
): { flat: THREE.Vector2[]; faces: number[][] } | null {
  if (ring.length < 3) return null;
  const contour = ring.map(([x, z]) => new THREE.Vector2(x, z));
  const holeVecs = holes.map((h) => h.map(([x, z]) => new THREE.Vector2(x, z)));
  try {
    const faces = THREE.ShapeUtils.triangulateShape(contour, holeVecs);
    return { flat: contour.concat(...holeVecs), faces };
  } catch {
    return null;
  }
}

export function inRing(p: Vec2, ring: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/**
 * How many other land-cover polygons contain this one.
 *
 * Bounding boxes filter the candidates first, so this stays cheap even with a
 * few thousand areas; only a handful survive to the point-in-polygon test.
 * Nesting used to decide how far a polygon was lifted; now it decides paint
 * order, which is the same information used for something that is true.
 */
export function nestingDepths(areas: AreaFeature[]): number[] {
  const boxes = areas.map((a) => {
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const [x, z] of a.ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    return { minX, maxX, minZ, maxZ, span: (maxX - minX) * (maxZ - minZ) };
  });

  return areas.map((a, i) => {
    const me = boxes[i];
    // A representative interior point: the first vertex is on the boundary, so
    // nudge towards the middle of the bounding box.
    const px = (a.ring[0][0] + (me.minX + me.maxX) / 2) / 2;
    const pz = (a.ring[0][1] + (me.minZ + me.maxZ) / 2) / 2;

    let depth = 0;
    for (let j = 0; j < areas.length && depth < MAX_NESTING; j++) {
      if (j === i) continue;
      const other = boxes[j];
      // Only something strictly larger can contain us.
      if (other.span <= me.span) continue;
      if (px < other.minX || px > other.maxX || pz < other.minZ || pz > other.maxZ) continue;
      if (inRing([px, pz], areas[j].ring)) depth++;
    }
    return depth;
  });
}

/** What one sample of the field says about the ground there. */
export interface AreaSample {
  /** How much of this point is land cover rather than open ground, 0..1. */
  cover: number;
  /** How soft that cover is: 1 is turf, 0 is gravel or paving. */
  soft: number;
}

export class AreaField {
  private readonly rgb: Float32Array;
  private readonly cover: Float32Array;
  private readonly soft: Float32Array;
  private readonly cols: number;
  private readonly rows: number;
  private readonly originX: number;
  private readonly originZ: number;
  private readonly cell: number;
  /** Filled by `sample`; reused so building a ground mesh allocates nothing. */
  readonly result: AreaSample = { cover: 0, soft: 1 };

  constructor(areas: AreaFeature[], radius: number) {
    // No finer than the mesh that will read it: the ground grid is matched to
    // the elevation data at a few metres, and a boundary cannot be sharper
    // than the vertices carrying it however finely it is rasterised here.
    this.cell = Math.max(1.5, radius / 400);
    const span = radius * 2.2;
    this.cols = Math.max(8, Math.ceil(span / this.cell) + 1);
    this.rows = this.cols;
    this.originX = -span / 2;
    this.originZ = -span / 2;
    const n = this.cols * this.rows;
    this.rgb = new Float32Array(n * 3);
    this.cover = new Float32Array(n);
    this.soft = new Float32Array(n);

    // Outermost first, so a lawn inside a park inside a recreation ground
    // paints over its container instead of being hidden by it. This is what
    // the nesting lift used to buy, without the lift.
    const depths = nestingDepths(areas);
    const order = areas.map((_, i) => i).sort((a, b) => depths[a] - depths[b]);

    for (const i of order) {
      const area = areas[i];
      // Standing water is a surface of its own, at its own level, and it is
      // the one land cover that is genuinely not the ground.
      if (area.kind === 'water') continue;
      const tri = triangulate(area.ring, area.holes);
      if (!tri) continue;
      const color = AREA_COLOR[area.kind];
      const soft = SOFT.has(area.kind) ? 1 : 0;
      for (const face of tri.faces) {
        const a = tri.flat[face[0]];
        const b = tri.flat[face[1]];
        const c = tri.flat[face[2]];
        if (!a || !b || !c) continue;
        this.paint([a.x, a.y], [b.x, b.y], [c.x, c.y], color, soft);
      }
    }
  }

  /**
   * What covers this point, blended across the raster.
   *
   * Bilinear rather than nearest, so a boundary comes out as a soft change of
   * tone over a couple of metres instead of a staircase along the grid.
   */
  sample(x: number, z: number, out: THREE.Color): number {
    const fx = (x - this.originX) / this.cell;
    const fz = (z - this.originZ) / this.cell;
    if (fx < 0 || fz < 0 || fx >= this.cols - 1 || fz >= this.rows - 1) {
      this.result.cover = 0;
      this.result.soft = 1;
      return 0;
    }
    const c = Math.floor(fx);
    const r = Math.floor(fz);
    const tx = fx - c;
    const tz = fz - r;

    const i00 = r * this.cols + c;
    const i01 = i00 + 1;
    const i10 = i00 + this.cols;
    const i11 = i10 + 1;
    const w00 = (1 - tx) * (1 - tz);
    const w01 = tx * (1 - tz);
    const w10 = (1 - tx) * tz;
    const w11 = tx * tz;

    const cover = this.cover[i00] * w00 + this.cover[i01] * w01
      + this.cover[i10] * w10 + this.cover[i11] * w11;
    this.result.cover = cover;
    if (cover <= 0.001) {
      this.result.soft = 1;
      return 0;
    }

    // Colour and softness are averaged over the covered part only, or a park
    // beside open ground would fade towards black at its edge rather than
    // towards the grass next to it.
    const inv = 1 / cover;
    out.setRGB(
      (this.rgb[i00 * 3] * this.cover[i00] * w00 + this.rgb[i01 * 3] * this.cover[i01] * w01
        + this.rgb[i10 * 3] * this.cover[i10] * w10 + this.rgb[i11 * 3] * this.cover[i11] * w11) * inv,
      (this.rgb[i00 * 3 + 1] * this.cover[i00] * w00 + this.rgb[i01 * 3 + 1] * this.cover[i01] * w01
        + this.rgb[i10 * 3 + 1] * this.cover[i10] * w10 + this.rgb[i11 * 3 + 1] * this.cover[i11] * w11) * inv,
      (this.rgb[i00 * 3 + 2] * this.cover[i00] * w00 + this.rgb[i01 * 3 + 2] * this.cover[i01] * w01
        + this.rgb[i10 * 3 + 2] * this.cover[i10] * w10 + this.rgb[i11 * 3 + 2] * this.cover[i11] * w11) * inv,
    );
    this.result.soft = (this.soft[i00] * this.cover[i00] * w00 + this.soft[i01] * this.cover[i01] * w01
      + this.soft[i10] * this.cover[i10] * w10 + this.soft[i11] * this.cover[i11] * w11) * inv;
    return cover;
  }

  private paint(a: Vec2, b: Vec2, c: Vec2, color: THREE.Color, soft: number): void {
    const minX = Math.min(a[0], b[0], c[0]);
    const maxX = Math.max(a[0], b[0], c[0]);
    const minZ = Math.min(a[1], b[1], c[1]);
    const maxZ = Math.max(a[1], b[1], c[1]);

    const c0 = Math.max(0, Math.floor((minX - this.originX) / this.cell));
    const c1 = Math.min(this.cols - 1, Math.ceil((maxX - this.originX) / this.cell));
    const r0 = Math.max(0, Math.floor((minZ - this.originZ) / this.cell));
    const r1 = Math.min(this.rows - 1, Math.ceil((maxZ - this.originZ) / this.cell));
    if (c1 < c0 || r1 < r0) return;

    const area = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
    if (Math.abs(area) < 1e-9) return;
    const s = area > 0 ? 1 : -1;

    for (let r = r0; r <= r1; r++) {
      const z = this.originZ + r * this.cell;
      for (let col = c0; col <= c1; col++) {
        const x = this.originX + col * this.cell;
        if (((b[0] - a[0]) * (z - a[1]) - (x - a[0]) * (b[1] - a[1])) * s < 0) continue;
        if (((c[0] - b[0]) * (z - b[1]) - (x - b[0]) * (c[1] - b[1])) * s < 0) continue;
        if (((a[0] - c[0]) * (z - c[1]) - (x - c[0]) * (a[1] - c[1])) * s < 0) continue;
        const i = r * this.cols + col;
        this.rgb[i * 3] = color.r;
        this.rgb[i * 3 + 1] = color.g;
        this.rgb[i * 3 + 2] = color.b;
        this.cover[i] = 1;
        this.soft[i] = soft;
      }
    }
  }
}
