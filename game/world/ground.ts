/**
 * The ground.
 *
 * A grid of heights and one operation on it: **press**. Something built takes
 * the ground under itself to the height it needs, and gives it back over the
 * next few metres.
 *
 * That is the whole model, and it is deliberately the whole model. In the
 * project this replaces the ground had a mesh, a paint raster, an ownership
 * raster, a paved-area raster, a grading pass, a shoulder rule and a set of
 * cutting rules, all answering versions of "whose earth is this". Here the
 * earth belongs to whatever pressed it, because it was pressed.
 */

import { distanceOutside, type Area } from './area';

export class Ground {
  /** Metres from one sample to the next. */
  readonly spacing: number;
  /** Samples across, and down. Square. */
  readonly samples: number;
  /** World coordinate of sample 0. */
  readonly origin: number;
  private readonly height: Float64Array;

  constructor(size: number, spacing: number, shape: (x: number, z: number) => number) {
    this.spacing = spacing;
    this.samples = Math.round(size / spacing) + 1;
    this.origin = -size / 2;
    this.height = new Float64Array(this.samples * this.samples);
    for (let r = 0; r < this.samples; r++) {
      for (let c = 0; c < this.samples; c++) {
        this.height[r * this.samples + c] = shape(this.coord(c), this.coord(r));
      }
    }
  }

  /** World coordinate of a sample index, along either axis. */
  coord(index: number): number {
    return this.origin + index * this.spacing;
  }

  /**
   * Height at any point, interpolated across the cell it falls in.
   *
   * Split corner 0-1-2 and 0-2-3, which is how the mesh is built as well. Two
   * different splits of one cell give two different heights inside it, and
   * that difference is exactly the kind of centimetre lie that ends up with a
   * car sitting in the tarmac.
   */
  heightAt(x: number, z: number): number {
    const fx = (x - this.origin) / this.spacing;
    const fz = (z - this.origin) / this.spacing;
    const c = clamp(Math.floor(fx), 0, this.samples - 2);
    const r = clamp(Math.floor(fz), 0, this.samples - 2);
    const tx = clamp(fx - c, 0, 1);
    const tz = clamp(fz - r, 0, 1);
    const h = (col: number, row: number) => this.height[row * this.samples + col];
    if (tx + tz <= 1) {
      const a = h(c, r);
      return a + (h(c + 1, r) - a) * tx + (h(c, r + 1) - a) * tz;
    }
    const d = h(c + 1, r + 1);
    return d + (h(c, r + 1) - d) * (1 - tx) + (h(c + 1, r) - d) * (1 - tz);
  }

  /**
   * Take the ground under an area to the height that area needs.
   *
   * `surface` is the finished height of the thing standing there; `depth` is
   * how far below it the earth sits, which is the thickness of what is built.
   * Outside the area the correction eases away over `blend` metres, so a road
   * on a hillside cuts into the slope above it and fills below it instead of
   * standing in a trench with vertical walls.
   *
   * Both directions matter and neither is optional: pressing only downwards
   * leaves the uphill side standing over the road, pressing only upwards
   * leaves the downhill side hanging under it.
   */
  press(
    area: Area,
    surface: (x: number, z: number) => number,
    depth: number,
    blend: number,
  ): void {
    // The earth that carries something reaches a little past it, and how far
    // is arithmetic rather than taste. A point inside the area sits in a grid
    // cell whose corners are up to `spacing · √2` away; unless all four of
    // those corners are pressed, the surface between them is interpolated
    // partly from untouched ground and rises through what stands on it.
    // Measured before this line existed, on a 2 m grid under a 7 m road:
    // 2 931 of 14 592 samples with earth above the road, worst 37.9 cm.
    // A shade over √2, because at exactly √2 the worst case is an equality and
    // floating point falls on both sides of it.
    const grip = this.spacing * 1.6;

    for (let r = 0; r < this.samples; r++) {
      const z = this.coord(r);
      for (let c = 0; c < this.samples; c++) {
        const x = this.coord(c);
        const outside = distanceOutside(area, x, z);
        if (outside > grip + blend) continue;
        const wanted = surface(x, z) - depth;
        const ease = outside <= grip ? 1 : smooth(1 - (outside - grip) / blend);
        const at = r * this.samples + c;
        this.height[at] += (wanted - this.height[at]) * ease;
      }
    }
  }

  /** Lowest and highest ground, for framing a camera or sizing a legend. */
  get range(): { low: number; high: number } {
    let low = Infinity;
    let high = -Infinity;
    for (const h of this.height) {
      if (h < low) low = h;
      if (h > high) high = h;
    }
    return { low, high };
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** Smoothstep, so the seam where the correction dies out has no crease in it. */
function smooth(t: number): number {
  const k = clamp(t, 0, 1);
  return k * k * (3 - 2 * k);
}
