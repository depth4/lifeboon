/**
 * Terrain sampling.
 *
 * Everything that needs to sit on the ground — buildings, roads, trees, people,
 * the camera — asks a Terrain for the height at a point. There are two
 * implementations: a real sampled heightfield, and a flat one that answers zero
 * for every query, so the entire renderer works unchanged when no elevation
 * data is available.
 *
 * Heights are in metres, relative to the loaded area's reference level rather
 * than sea level: a city sitting at 150 m would otherwise push everything far
 * from the origin for no benefit, and the camera and depth ranges are all tuned
 * around a world centred on zero.
 */

export interface Terrain {
  /** Ground height at a projected point, in metres. */
  heightAt(x: number, z: number): number;
  /** Steepest slope at a point, as a gradient (rise over run). */
  slopeAt(x: number, z: number): number;
  /** Lowest and highest ground in the loaded area. */
  readonly minHeight: number;
  readonly maxHeight: number;
  /** True when there is enough variation to be worth rendering as relief. */
  readonly hasRelief: boolean;
  /** Metres between samples; the finest detail the data can express. */
  readonly resolution: number;
}

/** Ground at zero everywhere. Used when elevation data is unavailable. */
export class FlatTerrain implements Terrain {
  readonly minHeight = 0;
  readonly maxHeight = 0;
  readonly hasRelief = false;
  readonly resolution = Infinity;

  heightAt(): number {
    return 0;
  }

  slopeAt(): number {
    return 0;
  }
}

export class Heightfield implements Terrain {
  readonly minHeight: number;
  readonly maxHeight: number;
  readonly hasRelief: boolean;

  /**
   * @param data    row-major samples, `cols * rows`, in metres
   * @param originX world x of column 0
   * @param originZ world z of row 0
   * @param spacing metres between samples in both directions
   */
  constructor(
    private readonly data: Float32Array,
    private readonly cols: number,
    private readonly rows: number,
    private readonly originX: number,
    private readonly originZ: number,
    readonly resolution: number,
  ) {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < data.length; i++) {
      if (data[i] < min) min = data[i];
      if (data[i] > max) max = data[i];
    }
    this.minHeight = min;
    this.maxHeight = max;
    // Below about three metres across a whole district, the "relief" is DEM
    // noise rather than landscape, and rendering it just makes roads wobble.
    this.hasRelief = max - min >= 3;
  }

  /** Bilinear sample, clamped to the edge outside the loaded area. */
  heightAt(x: number, z: number): number {
    const fx = (x - this.originX) / this.resolution;
    const fz = (z - this.originZ) / this.resolution;

    const x0 = Math.floor(fx);
    const z0 = Math.floor(fz);
    const tx = fx - x0;
    const tz = fz - z0;

    const h00 = this.sample(x0, z0);
    const h10 = this.sample(x0 + 1, z0);
    const h01 = this.sample(x0, z0 + 1);
    const h11 = this.sample(x0 + 1, z0 + 1);

    const top = h00 + (h10 - h00) * tx;
    const bottom = h01 + (h11 - h01) * tx;
    return top + (bottom - top) * tz;
  }

  private sample(col: number, row: number): number {
    const c = col < 0 ? 0 : col >= this.cols ? this.cols - 1 : col;
    const r = row < 0 ? 0 : row >= this.rows ? this.rows - 1 : row;
    return this.data[r * this.cols + c];
  }

  slopeAt(x: number, z: number): number {
    const d = this.resolution;
    const dx = (this.heightAt(x + d, z) - this.heightAt(x - d, z)) / (2 * d);
    const dz = (this.heightAt(x, z + d) - this.heightAt(x, z - d)) / (2 * d);
    return Math.hypot(dx, dz);
  }

  /**
   * Lowest ground under a set of points.
   *
   * This is what seats a building: a footprint on a slope has to start at the
   * downhill corner, or the uphill side of the building floats.
   */
  minUnder(points: Array<[number, number]>): number {
    let min = Infinity;
    for (const [x, z] of points) {
      const h = this.heightAt(x, z);
      if (h < min) min = h;
    }
    return isFinite(min) ? min : 0;
  }
}

/**
 * Ground range under a footprint: the floor goes at the top of it so the
 * building never sinks, and the walls run down to the bottom so no gap opens
 * on the downhill side.
 */
export function groundRangeUnder(
  points: Array<[number, number]>,
  terrain: Terrain,
): { low: number; high: number } {
  let low = Infinity;
  let high = -Infinity;
  for (const [x, z] of points) {
    const h = terrain.heightAt(x, z);
    if (h < low) low = h;
    if (h > high) high = h;
  }
  if (!isFinite(low)) return { low: 0, high: 0 };
  return { low, high };
}

/**
 * Smooth a sequence of ground heights the way a road engineer would: real
 * roads cut through humps and fill hollows rather than following every bump,
 * and draping a polyline straight onto a DEM gives a visibly wobbling ribbon.
 *
 * A few passes of a small moving average is enough at DEM resolution, and the
 * result stays close enough to the ground that the road never floats.
 */
export function smoothProfile(heights: number[], passes = 3): number[] {
  if (heights.length < 3) return heights.slice();
  let current = heights.slice();
  for (let pass = 0; pass < passes; pass++) {
    const next = current.slice();
    for (let i = 1; i < current.length - 1; i++) {
      next[i] = current[i - 1] * 0.25 + current[i] * 0.5 + current[i + 1] * 0.25;
    }
    current = next;
  }
  return current;
}
