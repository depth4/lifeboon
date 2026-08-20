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

import { fbm } from '../core/noise';
import type { Vec2 } from '../world/types';

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
  /**
   * Cut and fill the ground so it carries the streets given.
   *
   * `shoulder` is how far past the built edge of a street the earth is
   * forbidden to stand higher than the street — it must be at least one cell
   * of whatever mesh will draw this field. See `Heightfield.gradeStreets`.
   * Flat ground has nothing to grade and answers false.
   */
  gradeStreets(corridors: StreetCorridor[], shoulder?: number): boolean;
  /**
   * Flatten the ground under each junction to the one height every street
   * there agreed on. See `Heightfield.gradePads`.
   */
  gradePads(pads: GroundPad[]): boolean;
}

/**
 * A junction's claim on the earth: a polygon, flat, at one height.
 *
 * A street is a ribbon and can be described by a centreline and a width. A
 * junction cannot — it is a place, with a boundary, and the difference matters
 * as soon as it is drawn. It used to be graded as a disc of the widest
 * street's radius, which flattened ground well outside the crossing in some
 * directions and not far enough in others; and because the disc was applied
 * after the streets and lost every tie to them, the earth under a crossing
 * still followed each street's own gradient. Drawn flat and graded sloping,
 * the two disagreed by up to 14 cm — measured, in `tests/ground.ts`.
 */
export interface GroundPad {
  /** The junction boundary, in world metres. */
  ring: Vec2[];
  /**
   * The finished surface inside it, which is not flat: a junction is levelled
   * at its middle and each street climbs away from there at its own gradient,
   * so the mouths sit at their own heights and the surface warps between them.
   */
  heightAt(x: number, z: number): number;
  /** How far below that the earth is cut, as for a street. */
  depth: number;
  /** How far outside the ring the correction fades to nothing. */
  blend: number;
}

/**
 * One street's claim on the earth beneath it.
 *
 * `levels` is the finished height of the carriageway crown at each point of
 * `points`, computed before any grading happens so that grading and drawing
 * cannot drift apart. `depth` is how far below the crown the earth is cut —
 * the road structure sits in that gap, and so does every land-cover polygon
 * that happens to overlap the street, which is what stops a park from being
 * drawn across a road.
 */
export interface StreetCorridor {
  points: Array<[number, number]>;
  /** Half-width of the built section: paving and verge, not the embankment. */
  halfWidth: number;
  /** How far past that the correction fades out — the embankment. */
  blend: number;
  levels: number[];
  depth: number;
  /**
   * The finished surface across the street, as [distance from centre, height
   * above the crown] pairs.
   *
   * The earth is cut to follow this shape rather than to one flat depth. Cut
   * flat, the ground beside a pavement ends up half a metre below it and every
   * street in the city sits in a shallow green trench — which is what happened
   * the first time. Following the shape means a pavement 8 cm above the crown
   * gets ground 8 cm higher under it, and on level land the surroundings stay
   * level.
   */
  shape: Array<[number, number]>;
}

/** Height of a cross-section at a distance from the centre; flat beyond it. */
function shapeAt(shape: Array<[number, number]>, dist: number): number {
  if (!shape.length) return 0;
  if (dist <= shape[0][0]) return shape[0][1];
  for (let i = 1; i < shape.length; i++) {
    if (dist <= shape[i][0]) {
      const [d0, y0] = shape[i - 1];
      const [d1, y1] = shape[i];
      const t = d1 === d0 ? 1 : (dist - d0) / (d1 - d0);
      return y0 + (y1 - y0) * t;
    }
  }
  return shape[shape.length - 1][1];
}

/**
 * How deep standing water is cut below its surface, and how far the bed takes
 * to get there from the bank. Both are scenery rather than survey: satellite
 * elevation does not resolve a river bed at all, so any number here is
 * invented — but a shelving bank is closer to every real river than a slot.
 */
const CARVE_DEPTH_M = 1.2;
const BANK_SHELF_M = 8;

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

  gradeStreets(): boolean {
    return false;
  }

  gradePads(): boolean {
    return false;
  }
}

export class Heightfield implements Terrain {
  private low = 0;
  private high = 0;
  private mean = 0;

  get minHeight(): number {
    return this.low;
  }

  get maxHeight(): number {
    return this.high;
  }

  /**
   * Below about three metres across a whole district the "relief" is DEM
   * noise rather than landscape, and rendering it just makes roads wobble.
   */
  get hasRelief(): boolean {
    return this.high - this.low >= 3;
  }

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
    this.recomputeBounds();
  }

  /**
   * Bilinear sample inside the loaded area; invented landscape outside it.
   *
   * Clamping to the edge — which is what this did — turns everything past the
   * data into four flat quadrants at the corner heights, joined by ruled ramps
   * along the axes. Measured: from 1 km out to the horizon the ground sat at
   * exactly 17.06 m in one direction and −13.5 m in the other, with a straight
   * tan streak where a steep boundary sample was smeared to infinity. The city
   * read as a square slab dropped on a billiard table, which is the single
   * loudest thing wrong with the picture from any distance.
   *
   * We have no data out there and never will: the download is a bounding box.
   * So the surroundings are invented — rolling ground that starts from
   * whatever the edge of the real data says and drifts away from it, at an
   * amplitude taken from the relief the city itself has. It is not a claim
   * about the world; it is scenery, and it is honest scenery in that it never
   * touches, and never contradicts, a single measured sample.
   */
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
    const edge = top + (bottom - top) * tz;

    const outX = Math.max(0, -fx, fx - (this.cols - 1));
    const outZ = Math.max(0, -fz, fz - (this.rows - 1));
    if (outX === 0 && outZ === 0) return edge;

    const beyond = Math.hypot(outX, outZ) * this.resolution;
    // Nothing at all at the boundary, so the seam cannot be seen; fully
    // invented a few hundred metres out, where nobody can check.
    const ramp = 1 - Math.exp(-beyond / 260);
    // Let go of the edge sample as we leave, or every boundary value is
    // extruded outwards as a straight streak running to the horizon — which is
    // exactly what the tan stripe across the old landscape was.
    const base = edge + (this.mean - edge) * ramp;
    return base + fbm(x, z) * this.surroundingsAmplitude * ramp;
  }

  /**
   * How tall the invented hills are: taken from the relief the loaded area
   * actually has, so a town on a plain keeps its plain and a town in a valley
   * gets valley sides. Floored so a dead-flat city is not ringed by a dead-flat
   * void, and capped so noisy elevation data cannot raise mountains.
   */
  private get surroundingsAmplitude(): number {
    return Math.min(70, Math.max(9, (this.high - this.low) * 0.55));
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
   * Cut a channel through the surface.
   *
   * Satellite elevation does not resolve a river bed: at 20-30 m per sample the
   * ground inside a waterway reads at roughly bank level, so a water surface
   * laid at the level of its banks ends up buried by the terrain around it.
   * Lowering the samples inside the polygon is what makes the water visible —
   * and it is also closer to the truth, because there really is a channel there.
   *
   * `level` is the water surface. The bed is cut below it by CARVE_DEPTH_M in
   * open water, shelving up towards the bank over BANK_SHELF_M.
   *
   * Only ever lowers, so a valley the data did capture is left alone.
   */
  carveTo(ring: Array<[number, number]>, level: number): boolean {
    if (ring.length < 3) return false;

    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const [x, z] of ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }

    const c0 = Math.max(0, Math.floor((minX - this.originX) / this.resolution) - 1);
    const c1 = Math.min(this.cols - 1, Math.ceil((maxX - this.originX) / this.resolution) + 1);
    const r0 = Math.max(0, Math.floor((minZ - this.originZ) / this.resolution) - 1);
    const r1 = Math.min(this.rows - 1, Math.ceil((maxZ - this.originZ) / this.resolution) + 1);

    const w = c1 - c0 + 1;
    const h = r1 - r0 + 1;
    if (w < 1 || h < 1) return false;

    // How far each sample lies inside the water, in samples. A bed cut to full
    // depth right up to the outline gives a vertical wall, and no ground mesh
    // can follow a wall: measured 4.8 m of daylight between the drawn ground
    // and the heightfield at the water's edge, with grass hanging over the
    // river. Real banks shelve, so the bed is deepest in the middle and rises
    // to meet the bank — which the mesh can follow and which is also true.
    const inside = new Uint8Array(w * h);
    for (let r = 0; r < h; r++) {
      const z = this.originZ + (r + r0) * this.resolution;
      for (let c = 0; c < w; c++) {
        const x = this.originX + (c + c0) * this.resolution;
        if (pointInRing(x, z, ring)) inside[r * w + c] = 1;
      }
    }

    // Carve one ring of samples *outside* the outline as well.
    //
    // The ground mesh interpolates between samples, so if the last carved
    // sample sits on the outline itself the surface crosses the water plane
    // somewhere inside the drawn polygon — and because that crossing wanders
    // between one grid row and the next, the shoreline comes out as a row of
    // green teeth biting into the water. Carving past the edge moves the
    // crossing outside the polygon, where nothing is drawn over it.
    const dilated = new Uint8Array(w * h);
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (!inside[r * w + c]) continue;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const rr = r + dr, cc = c + dc;
            if (rr < 0 || cc < 0 || rr >= h || cc >= w) continue;
            dilated[rr * w + cc] = 1;
          }
        }
      }
    }

    const dist = new Float32Array(w * h);
    for (let i = 0; i < dist.length; i++) dist[i] = dilated[i] ? Infinity : 0;
    chamfer(dist, w, h);

    // The shelf runs about eight metres, or one sample if the water is
    // narrower than the grid — a ditch has no room for a beach.
    const shelf = Math.max(1, BANK_SHELF_M / this.resolution);
    let changed = false;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const d = dist[r * w + c];
        if (d <= 0) continue;
        // Never quite zero, or the bed meets the water surface exactly at the
        // shoreline and the two fight for the same pixels along every bank.
        const t = Math.max(0.12, Math.min(1, d / shelf));
        let bed = level - CARVE_DEPTH_M * t;
        // Whatever the shelf says, anything actually under the drawn water has
        // to be under it by a clear margin.
        if (inside[r * w + c]) bed = Math.min(bed, level - 0.2);
        const i = (r + r0) * this.cols + (c + c0);
        if (this.data[i] > bed) {
          this.data[i] = bed;
          changed = true;
        }
      }
    }
    return changed;
  }

  /**
   * Cut a channel along a line — a narrow river, which OSM maps as a way
   * rather than a polygon. `levels` gives the water surface at each point;
   * the bed is cut to `depth` below it.
   */
  carveAlong(
    points: Array<[number, number]>,
    halfWidth: number,
    levels: number[],
    depth: number,
  ): boolean {
    let changed = false;
    const reach = halfWidth + this.resolution;

    for (let i = 0; i < points.length - 1; i++) {
      const [ax, az] = points[i];
      const [bx, bz] = points[i + 1];
      const segLen2 = (bx - ax) ** 2 + (bz - az) ** 2;
      if (segLen2 < 1e-6) continue;

      const c0 = Math.max(0, Math.floor((Math.min(ax, bx) - reach - this.originX) / this.resolution));
      const c1 = Math.min(this.cols - 1, Math.ceil((Math.max(ax, bx) + reach - this.originX) / this.resolution));
      const r0 = Math.max(0, Math.floor((Math.min(az, bz) - reach - this.originZ) / this.resolution));
      const r1 = Math.min(this.rows - 1, Math.ceil((Math.max(az, bz) + reach - this.originZ) / this.resolution));

      for (let r = r0; r <= r1; r++) {
        const z = this.originZ + r * this.resolution;
        for (let c = c0; c <= c1; c++) {
          const x = this.originX + c * this.resolution;
          // Distance to the segment, and how far along it we are.
          let t = ((x - ax) * (bx - ax) + (z - az) * (bz - az)) / segLen2;
          t = t < 0 ? 0 : t > 1 ? 1 : t;
          const px = ax + (bx - ax) * t;
          const pz = az + (bz - az) * t;
          if ((x - px) ** 2 + (z - pz) ** 2 > halfWidth * halfWidth) continue;

          // Deepest down the middle, rising to nothing at the bank, for the
          // same reason as carveTo: a slot with vertical sides is not a
          // stream, and it is not something a ground mesh can draw.
          const across = Math.hypot(x - px, z - pz) / halfWidth;
          const level = levels[i] + (levels[i + 1] - levels[i]) * t - depth * (1 - across * across);
          const idx = r * this.cols + c;
          if (this.data[idx] > level) {
            this.data[idx] = level;
            changed = true;
          }
        }
      }
    }
    return changed;
  }

  /**
   * A copy of this field resampled to a finer spacing.
   *
   * Satellite elevation arrives at 20-30 m per sample, which is fine for a
   * hillside and useless for a street: a residential corridor is about ten
   * metres across, so a trench cut into a 20 m grid would sag a whole
   * neighbourhood instead of carrying one road. Nothing new is learned by
   * interpolating — the landscape is exactly as detailed as it was — but the
   * grid becomes fine enough to hold detail that is *added* afterwards, which
   * is what grading and river carving both do.
   *
   * Returns this field unchanged when it is already fine enough, so the cost
   * is paid once and only where it buys something.
   */
  refinedTo(spacing: number): Heightfield {
    return this.resampled(spacing, {
      minX: this.originX,
      minZ: this.originZ,
      maxX: this.originX + (this.cols - 1) * this.resolution,
      maxZ: this.originZ + (this.rows - 1) * this.resolution,
    });
  }

  /**
   * A copy at a new spacing, covering at least the given box.
   *
   * Growing matters as much as refining. Grading can only write into the array
   * it has, and a way that runs past the edge of the downloaded elevation —
   * which OpenStreetMap ways routinely do, and which the offline city does by
   * eighteen metres — is then a street with untouched hillside standing in it.
   * Measured on the generated city: 3.7 m of earth through a residential road
   * near the boundary, and nothing wrong with the grading at all.
   *
   * Outside the old array the samples come from `heightAt`, which invents the
   * surroundings continuously from the real data, so the join is seamless and
   * no measured sample is contradicted.
   */
  resampled(spacing: number, box: { minX: number; minZ: number; maxX: number; maxZ: number }): Heightfield {
    const originX = Math.min(this.originX, box.minX);
    const originZ = Math.min(this.originZ, box.minZ);
    const width = Math.max(this.originX + (this.cols - 1) * this.resolution, box.maxX) - originX;
    const depth = Math.max(this.originZ + (this.rows - 1) * this.resolution, box.maxZ) - originZ;
    // Square cells, or slopeAt and the grading reach stop meaning one thing.
    const step = Math.min(spacing, this.resolution);
    if (step >= this.resolution * 0.99
      && originX >= this.originX - 1e-6 && originZ >= this.originZ - 1e-6
      && width <= (this.cols - 1) * this.resolution + 1e-6
      && depth <= (this.rows - 1) * this.resolution + 1e-6) {
      return this;
    }

    const cols = Math.max(2, Math.round(width / step) + 1);
    const rows = Math.max(2, Math.round(depth / step) + 1);
    const data = new Float32Array(cols * rows);
    for (let r = 0; r < rows; r++) {
      const z = originZ + r * step;
      for (let c = 0; c < cols; c++) {
        data[r * cols + c] = this.heightAt(originX + c * step, z);
      }
    }
    return new Heightfield(data, cols, rows, originX, originZ, step);
  }

  /**
   * Cut and fill the earth so it carries the streets.
   *
   * A road is not laid on a hillside, it is cut into one: the engineer removes
   * earth on the uphill side and piles it on the downhill until the
   * carriageway sits at the grade they chose. We were drawing the ribbon and
   * leaving the ground alone, which is why every surface in the city had to
   * float at a hand-picked height to stay out of the others' way, and why a
   * park polygon could be drawn straight across a street.
   *
   * Grading fixes both at once. Inside a corridor the ground is pushed the
   * whole way to `crown - depth`; from there the correction fades to nothing
   * across `blend`, which is the embankment. Anything else drawn on the ground
   * — grass, parks, parking — then lies in the gap under the road structure
   * instead of fighting it for the same pixels.
   *
   * Claims are gathered before any of them is applied, and the strongest wins.
   * Applying them one road at a time would let a side street's embankment
   * re-cut a main road that had already been graded through the same junction.
   */
  gradeStreets(corridors: StreetCorridor[], shoulder = this.shoulderReach()): boolean {
    if (!corridors.length) return false;

    const n = this.cols * this.rows;
    const weight = new Float32Array(n);
    const target = new Float32Array(n);
    // Which corridor last claimed a node, and from how far away.
    //
    // Between two different streets the strongest claim wins and ties go to
    // whichever came first, which is why the list is sorted widest-first: a
    // side street must not dig through a main road at a crossing. But *within*
    // one street the tie-break has to be distance, and getting that wrong was
    // a real bug. Every segment of a way claims the ground around it, and a
    // point past the end of a segment is measured from that end — so on a
    // street running downhill, the segment above a node claimed it at its own
    // higher level and the segment the node actually lies on could not correct
    // it, because both claims were equally strong. Measured on a 12% grade:
    // the earth left standing 47 cm above its own carriageway.
    const owner = new Int32Array(n).fill(-1);
    const claimed = new Float32Array(n);
    // The shoulder lid: the highest the earth may stand this close to a
    // street. Infinity means no street near enough to have an opinion.
    const lid = new Float32Array(n).fill(Infinity);

    for (let ci = 0; ci < corridors.length; ci++) {
      const road = corridors[ci];
      const { points, halfWidth, blend, levels, depth, shape } = road;
      if (points.length < 2 || levels.length !== points.length) continue;
      const reach = halfWidth + Math.max(blend, shoulder);
      // Height of the outermost built edge — the back of the pavement. This is
      // what the earth beside the street may not rise above.
      const edgeDy = shapeAt(shape, halfWidth);
      // The lowest point of the finished section, which is the channel at the
      // edge of the carriageway. Under the built width the earth is cut flat
      // to this, because a grid four metres across cannot follow a kerb 15 cm
      // tall: asked to, it puts a node at kerb height beside one at channel
      // height and the plane between them rises through the asphalt. Measured
      // on a 12% grade: 5 cm of ground standing in the carriageway. Flat is
      // also what is actually under a road — a sub-base, not a moulding of the
      // surface above it. Past the built width the section is followed again,
      // so the ground beside a pavement stays where a pavement leaves it.
      let minDy = 0;
      for (const [, dy] of shape) if (dy < minDy) minDy = dy;

      for (let i = 0; i < points.length - 1; i++) {
        const [ax, az] = points[i];
        const [bx, bz] = points[i + 1];
        const segLen2 = (bx - ax) ** 2 + (bz - az) ** 2;
        if (segLen2 < 1e-9) continue;

        const c0 = Math.max(0, Math.floor((Math.min(ax, bx) - reach - this.originX) / this.resolution));
        const c1 = Math.min(this.cols - 1, Math.ceil((Math.max(ax, bx) + reach - this.originX) / this.resolution));
        const r0 = Math.max(0, Math.floor((Math.min(az, bz) - reach - this.originZ) / this.resolution));
        const r1 = Math.min(this.rows - 1, Math.ceil((Math.max(az, bz) + reach - this.originZ) / this.resolution));

        for (let r = r0; r <= r1; r++) {
          const z = this.originZ + r * this.resolution;
          for (let c = c0; c <= c1; c++) {
            const x = this.originX + c * this.resolution;

            let t = ((x - ax) * (bx - ax) + (z - az) * (bz - az)) / segLen2;
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            const px = ax + (bx - ax) * t;
            const pz = az + (bz - az) * t;
            const dist = Math.hypot(x - px, z - pz);
            if (dist > reach) continue;

            const idx = r * this.cols + c;
            const crown = levels[i] + (levels[i + 1] - levels[i]) * t;

            // The cut itself. Full inside the built width, easing to nothing
            // across the embankment. Smoothstep rather than a straight ramp,
            // so the shoulder rounds off instead of showing a crease.
            if (dist <= halfWidth + blend) {
              let w = 1;
              if (dist > halfWidth) {
                const u = (dist - halfWidth) / blend;
                w = 1 - u * u * (3 - 2 * u);
              }
              const better = w > weight[idx]
                || (w === weight[idx] && owner[idx] === ci && dist < claimed[idx]);
              if (better) {
                weight[idx] = w;
                owner[idx] = ci;
                claimed[idx] = dist;
                target[idx] = crown + (dist <= halfWidth ? minDy : shapeAt(shape, dist)) - depth;
              }
            }

            // The shoulder, which is the whole reason ground stopped poking
            // through the edge of a road.
            //
            // Grading writes heights at grid nodes, but the edge of a street
            // is a line that never runs along one. A cell with one corner on
            // the pavement and the other on the hillside is drawn as a plane
            // between the two, and where the hillside corner is higher that
            // plane rises over the road inside the cell — 0.8% of samples, up
            // to 37 cm, and no amount of extra grid resolution removes it,
            // only shrinks it.
            //
            // So the earth is forbidden to stand higher than the back of the
            // pavement for a cell or so beyond it. Both ends of any straddling
            // cell are then at or below the street, and a plane between two
            // points below the road cannot rise above it. This is what a real
            // road has too: a cutting has a shoulder before the slope starts.
            if (dist <= halfWidth + shoulder) {
              const here = crown + edgeDy - depth;
              if (here < lid[idx]) lid[idx] = here;
            }
          }
        }
      }
    }

    let changed = false;
    for (let i = 0; i < n; i++) {
      const w = weight[i];
      const cap = lid[i];
      if (w <= 0 && cap === Infinity) continue;
      let next = w > 0 ? this.data[i] * (1 - w) + target[i] * w : this.data[i];
      // A node that is itself road bed already sits where its own section put
      // it. Capping it again would let a neighbouring street's shoulder dig
      // through a road that had just been built.
      if (w < 0.999 && cap < next) next = cap;
      if (next !== this.data[i]) {
        this.data[i] = next;
        changed = true;
      }
    }
    if (changed) this.recomputeBounds();
    return changed;
  }

  /**
   * How far past the built edge of a street the shoulder reaches, when the
   * caller does not say.
   *
   * It has to be at least as wide as one cell of whatever mesh will draw this
   * field, or a cell can still straddle from road to untouched hillside — and
   * on a large city the mesh is capped and its cells come out coarser than
   * this field, which is why the renderer passes its own number in. Four
   * metres is the floor: a narrower shelf than that is not a shoulder, it is
   * a kerb.
   */
  private shoulderReach(): number {
    return Math.max(4, this.resolution * 1.6);
  }

  /**
   * Flatten the earth under each junction to the height drawn there.
   *
   * Applied after the streets and overriding them, because at a crossing the
   * junction is the thing that is drawn and the streets are the things that
   * stop at it. Outside the ring the correction eases off across `blend`.
   *
   * Deliberately *not* capping the earth beyond the ring the way a street's
   * shoulder does. A street's neighbours are level with it; a junction's are
   * climbing away from it at their own gradient, and holding them down to the
   * junction's level for a shoulder's width dug a trench under every approach
   * — measured at 58 cm on a 1-in-3 hillside. The straddling cell is dealt
   * with by grading a slightly larger ring than the one that gets drawn, which
   * `RoadProfiles.pads` does; here the rule is simply "inside is flat, outside
   * eases off".
   */
  gradePads(pads: GroundPad[]): boolean {
    if (!pads.length) return false;
    let changed = false;

    for (const pad of pads) {
      if (pad.ring.length < 3) continue;
      const reach = pad.blend;

      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      for (const [x, z] of pad.ring) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
      }

      const c0 = Math.max(0, Math.floor((minX - reach - this.originX) / this.resolution));
      const c1 = Math.min(this.cols - 1, Math.ceil((maxX + reach - this.originX) / this.resolution));
      const r0 = Math.max(0, Math.floor((minZ - reach - this.originZ) / this.resolution));
      const r1 = Math.min(this.rows - 1, Math.ceil((maxZ + reach - this.originZ) / this.resolution));

      for (let r = r0; r <= r1; r++) {
        const z = this.originZ + r * this.resolution;
        for (let c = c0; c <= c1; c++) {
          const x = this.originX + c * this.resolution;
          const idx = r * this.cols + c;
          const target = pad.heightAt(x, z) - pad.depth;

          if (pointInRing(x, z, pad.ring)) {
            if (this.data[idx] !== target) {
              this.data[idx] = target;
              changed = true;
            }
            continue;
          }

          const dist = distanceToRing(x, z, pad.ring);
          if (dist > reach) continue;

          if (dist > pad.blend) continue;
          const u = dist / pad.blend;
          const w = 1 - u * u * (3 - 2 * u);
          const next = this.data[idx] * (1 - w) + target * w;
          if (next !== this.data[idx]) {
            this.data[idx] = next;
            changed = true;
          }
        }
      }
    }

    if (changed) this.recomputeBounds();
    return changed;
  }

  /**
   * The field as plain numbers, for writing to a file.
   *
   * `round` is applied to every sample: a millimetre is finer than any
   * elevation source resolves and it halves the size of a capture, which
   * matters because a capture has to travel through a chat message.
   */
  snapshot(round: (v: number) => number = (v) => v): {
    cols: number; rows: number; originX: number; originZ: number;
    resolution: number; data: number[];
  } {
    const data = new Array<number>(this.data.length);
    for (let i = 0; i < this.data.length; i++) data[i] = round(this.data[i]);
    return {
      cols: this.cols,
      rows: this.rows,
      originX: this.originX,
      originZ: this.originZ,
      resolution: this.resolution,
      data,
    };
  }

  /** Rebuild a field from `snapshot`. */
  static fromSnapshot(s: {
    cols: number; rows: number; originX: number; originZ: number;
    resolution: number; data: number[];
  }): Heightfield {
    return new Heightfield(
      Float32Array.from(s.data), s.cols, s.rows, s.originX, s.originZ, s.resolution);
  }

  /** Call after carving; the stored bounds are otherwise stale. */
  recomputeBounds(): void {
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] < min) min = this.data[i];
      if (this.data[i] > max) max = this.data[i];
      sum += this.data[i];
    }
    this.low = isFinite(min) ? min : 0;
    this.high = isFinite(max) ? max : 0;
    this.mean = this.data.length ? sum / this.data.length : 0;
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

/** Ray-casting point-in-polygon, on raw coordinates. */
function pointInRing(x: number, z: number, ring: Array<[number, number]>): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], zi = ring[i][1];
    const xj = ring[j][0], zj = ring[j][1];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
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

/**
 * Two-pass chamfer distance transform, in samples, over a grid seeded with 0
 * outside the shape and Infinity inside. Approximate — diagonals count as 1.41
 * — which is ample for shelving a riverbank.
 */
function chamfer(dist: Float32Array, w: number, h: number): void {
  const D = 1;
  const DD = Math.SQRT2;
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const i = r * w + c;
      if (dist[i] === 0) continue;
      let best = dist[i];
      if (c > 0) best = Math.min(best, dist[i - 1] + D);
      if (r > 0) best = Math.min(best, dist[i - w] + D);
      if (r > 0 && c > 0) best = Math.min(best, dist[i - w - 1] + DD);
      if (r > 0 && c < w - 1) best = Math.min(best, dist[i - w + 1] + DD);
      dist[i] = best;
    }
  }
  for (let r = h - 1; r >= 0; r--) {
    for (let c = w - 1; c >= 0; c--) {
      const i = r * w + c;
      if (dist[i] === 0) continue;
      let best = dist[i];
      if (c < w - 1) best = Math.min(best, dist[i + 1] + D);
      if (r < h - 1) best = Math.min(best, dist[i + w] + D);
      if (r < h - 1 && c < w - 1) best = Math.min(best, dist[i + w + 1] + DD);
      if (r < h - 1 && c > 0) best = Math.min(best, dist[i + w - 1] + DD);
      dist[i] = best;
    }
  }
}

/** Shortest distance from a point to a ring's boundary. */
function distanceToRing(x: number, z: number, ring: Vec2[]): number {
  let best = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, az] = ring[j];
    const [bx, bz] = ring[i];
    const vx = bx - ax;
    const vz = bz - az;
    const len2 = vx * vx + vz * vz;
    let t = len2 < 1e-9 ? 0 : ((x - ax) * vx + (z - az) * vz) / len2;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const d = Math.hypot(x - (ax + vx * t), z - (az + vz * t));
    if (d < best) best = d;
  }
  return best;
}
