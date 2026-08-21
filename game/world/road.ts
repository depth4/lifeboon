/**
 * A road.
 *
 * A line, a width, and a rule about how steep it is allowed to be. From those
 * three it works out its own surface, and then it presses the ground to carry
 * it.
 *
 * The important thing it does **not** have: any knowledge of other roads, of
 * junctions, of what the map says, or of how it will be drawn. A second road
 * laid across this one needs no agreement between them — where they overlap is
 * a question about two areas, and `world/area.ts` answers it.
 */

import { stroke, type Area, type Vec2 } from './area';
import type { Ground } from './ground';

/** How far below the finished surface the earth sits: the road's structure. */
export const ROAD_DEPTH = 0.35;

export interface RoadSpec {
  centre: Vec2[];
  /** Metres, kerb to kerb. */
  width: number;
  /**
   * The steepest gradient the road may run at, as a fraction.
   *
   * This is the whole of "a road keeps its own height and slope": it follows
   * the land where the land is gentle enough, and cuts or fills where it is
   * not. 8% is a steep town street; motorways hold 4%.
   */
  maxGrade?: number;
  /** How far past its edge the ground eases back to untouched land. */
  blend?: number;
}

export class Road {
  readonly centre: Vec2[];
  readonly width: number;
  readonly blend: number;
  /** Distance from the start of the line to each of its points. */
  readonly chainage: number[];
  /** Finished surface height at each of those points. */
  readonly level: number[];
  readonly area: Area;

  constructor(spec: RoadSpec, ground: Ground) {
    this.centre = spec.centre;
    this.width = spec.width;
    this.blend = spec.blend ?? 4;
    this.chainage = chainageOf(spec.centre);
    this.level = levelsFor(spec.centre, this.chainage, ground, spec.maxGrade ?? 0.08);
    this.area = stroke(spec.centre, spec.width / 2);
  }

  /**
   * Height of the finished road at a point.
   *
   * Asked for points inside the area and for points a little outside it, since
   * the ground eases back over a few metres and has to know what it is easing
   * away from.
   */
  heightAt(x: number, z: number): number {
    const at = this.nearest(x, z);
    return at.level;
  }

  /** Where a point sits on the road: how far along, how far across. */
  nearest(x: number, z: number): { along: number; across: number; level: number } {
    const last = this.centre.length - 2;
    let bestDist = Infinity;
    let along = 0;
    for (let i = 0; i <= last; i++) {
      const a = this.centre[i];
      const b = this.centre[i + 1];
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const lenSq = dx * dx + dz * dz;
      if (lenSq < 1e-12) continue;
      const raw = ((x - a[0]) * dx + (z - a[1]) * dz) / lenSq;
      const t = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      const d = Math.hypot(x - (a[0] + dx * t), z - (a[1] + dz * t));
      if (d >= bestDist) continue;
      bestDist = d;
      // Past either end the chainage is allowed to run on, so the surface
      // carries on at the gradient it arrived with instead of stopping dead.
      // A road that flattens at its last metre puts a crease in the ground —
      // measured, 2.7 cm of earth standing over the tarmac at the road's end,
      // and no grid can follow a crease.
      const run = i === 0 && raw < 0 ? raw
        : i === last && raw > 1 ? raw
        : t;
      along = this.chainage[i] + Math.sqrt(lenSq) * run;
    }
    return { along, across: bestDist, level: this.levelAt(along) };
  }

  /** Surface height a given distance along the road. */
  levelAt(along: number): number {
    const chain = this.chainage;
    let i = 1;
    while (i < chain.length - 1 && chain[i] < along) i++;
    const span = chain[i] - chain[i - 1];
    // Not clamped: outside the road's own length this extrapolates along the
    // end gradient, which is what an embankment does — it runs on past the
    // last metre of surfacing and tapers, rather than ending in a step.
    const t = span < 1e-9 ? 0 : (along - chain[i - 1]) / span;
    return this.level[i - 1] + (this.level[i] - this.level[i - 1]) * t;
  }

  /** Steepest gradient anywhere along it, as a fraction. */
  get steepest(): number {
    let worst = 0;
    for (let i = 1; i < this.level.length; i++) {
      const run = this.chainage[i] - this.chainage[i - 1];
      if (run < 1e-9) continue;
      worst = Math.max(worst, Math.abs(this.level[i] - this.level[i - 1]) / run);
    }
    return worst;
  }

  /** Lay this road into the ground: the earth takes the shape it needs. */
  build(ground: Ground): void {
    ground.press(this.area, (x, z) => this.heightAt(x, z), ROAD_DEPTH, this.blend);
  }
}

function chainageOf(line: Vec2[]): number[] {
  const out = [0];
  for (let i = 1; i < line.length; i++) {
    out.push(out[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]));
  }
  return out;
}

/**
 * The surface the road will actually have.
 *
 * Start from the land as it is, then walk the line forwards and backwards
 * pulling any step that is too steep back to the limit, until nothing is too
 * steep. Two passes are not enough on a long line — one pass can only push a
 * correction one way — so it repeats until it settles, which on real ground
 * takes a handful of rounds.
 *
 * What comes out follows the ground closely where the ground is gentle, and
 * departs from it exactly where it must: a cutting through the top of a rise,
 * an embankment across a dip.
 */
function levelsFor(
  line: Vec2[], chain: number[], ground: Ground, maxGrade: number,
): number[] {
  const level = line.map(([x, z]) => ground.heightAt(x, z));

  for (let round = 0; round < 64; round++) {
    let moved = 0;
    for (let i = 1; i < level.length; i++) {
      const run = chain[i] - chain[i - 1];
      const limit = run * maxGrade;
      const step = level[i] - level[i - 1];
      if (Math.abs(step) <= limit) continue;
      // Split the correction between the two ends, so a single stubborn hill
      // does not drag the whole road up to meet it.
      const excess = (Math.abs(step) - limit) / 2;
      const sign = Math.sign(step);
      level[i] -= sign * excess;
      level[i - 1] += sign * excess;
      moved += excess;
    }
    if (moved < 1e-6) break;
  }
  return level;
}
