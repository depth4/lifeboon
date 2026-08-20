/**
 * Does the earth stay under the road?
 *
 * This is the measurement the whole ground rewrite turns on, and until now it
 * could only be taken from a browser: raycast down onto the ground mesh, ask
 * the road what it drew, compare. Overpass and a GPU are both out of reach
 * from the build container, so it was taken once, by hand, and then quoted
 * from a document — 0.8% of samples poking through, worst 37 cm.
 *
 * It does not need a GPU. The ground mesh is a grid of vertices sampled from
 * the heightfield and joined by triangles, and that is arithmetic. So this
 * builds a deliberately awkward hillside, cuts streets into it exactly as the
 * app does, reconstructs the mesh the renderer would build, and samples the
 * plane of every triangle across the full width of every street.
 *
 * Two runs, and the difference between them is the point: the same scene with
 * the shoulder switched off, and with it on. The shoulder is the rule that the
 * earth may not stand higher than the back of the pavement for a cell or so
 * beyond it — see `Heightfield.gradeStreets`.
 */

import { Heightfield } from '../src/terrain/heightfield';
import { RoadProfiles, STRUCTURE_DEPTH } from '../src/world/roadprofile';
import { NORM_RU, gradedHalfWidth, sectionHeightAt, streetSection } from '../src/world/street';
import { groundGrid, shoulderFor, stretch } from '../src/render/groundgrid';
import type { Road, Vec2 } from '../src/world/types';

let failures = 0;
function check(name: string, ok: boolean, got?: unknown): void {
  if (ok) {
    console.log(`  ok   ${name}`);
  } else {
    failures++;
    console.log(`  FAIL ${name}${got === undefined ? '' : ` -> ${JSON.stringify(got)}`}`);
  }
}

const RADIUS = 400;
const RESOLUTION = 4;

/**
 * A hillside worth testing on. Three overlapping waves, so a street meets
 * slopes of every steepness at every angle instead of the gentle ramp a
 * friendly test city would give it. Gradients here reach about 1 in 3.
 */
function hill(x: number, z: number): number {
  return 10 * Math.sin(x / 70) + 7 * Math.cos(z / 55) + 3 * Math.sin((x + z) / 33);
}

function makeTerrain(): Heightfield {
  const span = RADIUS * 2;
  const n = Math.round(span / RESOLUTION) + 1;
  const data = new Float32Array(n * n);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      data[r * n + c] = hill(-RADIUS + c * RESOLUTION, -RADIUS + r * RESOLUTION);
    }
  }
  return new Heightfield(data, n, n, -RADIUS, -RADIUS, RESOLUTION);
}

function street(id: string, points: Vec2[], width = 6.5): Road {
  return {
    id, points, cls: 'residential', width, lanes: 2, oneway: false,
    layer: 0, bridge: false, tunnel: false, walkable: true, drivable: true,
    isSidewalkLine: false, isCrossing: false,
  };
}

/**
 * Points every 15 m, which is what a surveyed way looks like. A way mapped
 * with a node every 250 m is a different and easier test — the earth is cut to
 * a chord and so is the road, and the two agree by construction.
 */
function walk(from: Vec2, to: Vec2, bend = 0): Vec2[] {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const steps = Math.max(2, Math.round(len / 15));
  const out: Vec2[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const nx = -(to[1] - from[1]) / len;
    const nz = (to[0] - from[0]) / len;
    const off = bend * Math.sin(t * Math.PI * 1.5);
    out.push([
      from[0] + (to[0] - from[0]) * t + nx * off,
      from[1] + (to[1] - from[1]) * t + nz * off,
    ]);
  }
  return out;
}

// A diagonal through the relief, a wider one crossing it, and a curve — the
// three shapes that behave differently when the earth is cut for them.
const ROADS = [
  street('a', walk([-330, -140], [330, 150])),
  street('b', walk([-60, -330], [90, 330]), 9),
  street('c', walk([-300, -200], [300, -200], 120)),
];

/** The ground mesh the renderer would build, as a height you can sample. */
class GroundMesh {
  private readonly coord: Float64Array;
  private readonly height: Float64Array;
  private readonly verts: number;

  constructor(radius: number, resolution: number, sample: (x: number, z: number) => number) {
    const { cells } = groundGrid(radius, resolution);
    this.verts = cells + 1;
    this.coord = new Float64Array(this.verts);
    for (let i = 0; i < this.verts; i++) {
      this.coord[i] = stretch((i / cells) * 2 - 1, radius);
    }
    this.height = new Float64Array(this.verts * this.verts);
    for (let r = 0; r < this.verts; r++) {
      for (let c = 0; c < this.verts; c++) {
        this.height[r * this.verts + c] = sample(this.coord[c], this.coord[r]);
      }
    }
  }

  /** Where a ray straight down would meet the drawn triangles. NaN outside. */
  at(x: number, z: number): number {
    const c = this.cellOf(x);
    const r = this.cellOf(z);
    if (c < 0 || r < 0) return Number.NaN;
    const tx = (x - this.coord[c]) / (this.coord[c + 1] - this.coord[c]);
    const tz = (z - this.coord[r]) / (this.coord[r + 1] - this.coord[r]);
    const h = (col: number, row: number) => this.height[row * this.verts + col];
    // The quad is split from its lower-left corner to its upper-right one,
    // matching the winding the mesh is built with.
    if (tx + tz <= 1) {
      const a = h(c, r);
      return a + (h(c + 1, r) - a) * tx + (h(c, r + 1) - a) * tz;
    }
    const e = h(c + 1, r + 1);
    return e + (h(c, r + 1) - e) * (1 - tx) + (h(c + 1, r) - e) * (1 - tz);
  }

  private cellOf(v: number): number {
    let lo = 0;
    let hi = this.verts - 1;
    if (v < this.coord[lo] || v > this.coord[hi]) return -1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (this.coord[mid] <= v) lo = mid; else hi = mid;
    }
    return lo;
  }
}

interface Overshoot {
  samples: number;
  /** Share of samples where the earth stands above the street drawn on it. */
  poking: number;
  /** The worst gap, positive when the ground is above the street. */
  worst: number;
  /** Typical gap; should be about the thickness of the road structure. */
  median: number;
}

/** Everything needed to ask what a street draws at a point. */
interface Built {
  road: Road;
  section: ReturnType<typeof streetSection>;
  half: number;
  levels: number[];
}

/**
 * The highest paving drawn at a point, and how many streets are laying it.
 *
 * The highest, because where two streets overlap it is the upper one you see
 * and the lower one is buried under it. This is the surface the earth is not
 * allowed to stand above.
 *
 * The count is what separates the two questions this test asks. Over one
 * street the earth has one level to get below and can always do it. Where two
 * streets overlap they have each cut the earth to their own level, and if
 * those levels differ, one of them is left with ground standing in it — no
 * amount of shoulder fixes that, only making a crossing one surface at one
 * height does.
 */
function drawnAt(
  built: Built[], x: number, z: number, reach: number,
): { y: number; streets: number } {
  let y = Number.NaN;
  let streets = 0;
  for (const b of built) {
    const pts = b.road.points;
    let covers = false;
    let near = false;
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i];
      const [bx, bz] = pts[i + 1];
      const len2 = (bx - ax) ** 2 + (bz - az) ** 2;
      if (len2 < 1e-9) continue;
      let t = ((x - ax) * (bx - ax) + (z - az) * (bz - az)) / len2;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const d = Math.hypot(x - (ax + (bx - ax) * t), z - (az + (bz - az) * t));
      // Close enough that this street's cut reaches the point through one cell
      // of the mesh, even where its own paving stops short of it.
      if (d <= b.half + reach) near = true;
      if (d > b.half) continue;
      covers = true;
      const crown = b.levels[i] + (b.levels[i + 1] - b.levels[i]) * t;
      const here = crown + sectionHeightAt(b.section, d);
      if (!(here <= y)) y = here;
    }
    if (near || covers) streets++;
  }
  return { y, streets };
}

/**
 * Cut the streets in, rebuild the mesh, and ask how often the ground stands
 * above the paving drawn on it.
 *
 * Crossings are reported apart from straights, because they are a different
 * problem and only one of the two is claimed to be solved here. Two streets
 * meeting on a slope still each cut the earth to their own level, and where
 * those levels differ the loser ends up with ground above it. A junction has
 * to become one polygon at one height before that can go to zero.
 */
function measure(shoulder: number, spacing: number): { straights: Overshoot; junctions: Overshoot } {
  const terrain = makeTerrain();
  const profiles = new RoadProfiles(ROADS, terrain);
  terrain.gradeStreets(profiles.corridors(ROADS, NORM_RU), shoulder);
  const mesh = new GroundMesh(RADIUS, RESOLUTION, (x, z) => terrain.heightAt(x, z));

  const built: Built[] = [];
  for (const road of ROADS) {
    const levels = profiles.get(road);
    if (!levels) continue;
    const section = streetSection(road, NORM_RU);
    built.push({ road, section, half: gradedHalfWidth(section), levels });
  }


  const straight: number[] = [];
  const junction: number[] = [];

  for (const b of built) {
    const pts = b.road.points;
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i];
      const [bx, bz] = pts[i + 1];
      const len = Math.hypot(bx - ax, bz - az);
      if (len < 1e-6) continue;
      const steps = Math.max(1, Math.round(len / 1.5));
      const nx = (bz - az) / len;
      const nz = -(bx - ax) / len;

      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const cx = ax + (bx - ax) * t;
        const cz = az + (bz - az) * t;
        for (let d = -b.half; d <= b.half + 1e-6; d += 0.25) {
          const x = cx + nx * d;
          const z = cz + nz * d;
          const drawn = drawnAt(built, x, z, spacing * 1.5);
          const ground = mesh.at(x, z);
          if (!Number.isFinite(ground) || !Number.isFinite(drawn.y)) continue;
          (drawn.streets > 1 ? junction : straight).push(ground - drawn.y);
        }
      }
    }
  }

  return { straights: summarise(straight), junctions: summarise(junction) };
}

function summarise(deltas: number[]): Overshoot {
  const sorted = [...deltas].sort((a, b) => a - b);
  return {
    samples: sorted.length,
    poking: sorted.length ? sorted.filter((d) => d > 0).length / sorted.length : 0,
    worst: sorted.length ? sorted[sorted.length - 1] : 0,
    median: sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0,
  };
}

const report = (name: string, o: Overshoot) =>
  console.log(`  ${name}: ${(o.poking * 100).toFixed(2)}% of ${o.samples} samples poke through, `
    + `worst ${(o.worst * 100).toFixed(1)} cm, typical gap ${(-o.median * 100).toFixed(1)} cm`);

console.log('--- ground against the streets drawn on it ---');

const grid = groundGrid(RADIUS, RESOLUTION);
console.log(`  mesh core spacing ${grid.spacing.toFixed(2)} m over ${grid.cells} cells`);

// The shoulder off: the earth is cut for the street but allowed to stand as
// high as it likes right beside it, which is the arrangement this rewrite
// replaced.
const without = measure(0.01, grid.spacing);
report('shoulder off ', without.straights);

const shoulder = shoulderFor(grid.spacing);
const withIt = measure(shoulder, grid.spacing);
report(`shoulder ${shoulder.toFixed(1)} m`, withIt.straights);
report('where two meet', withIt.junctions);

check('without a shoulder the ground does poke through the streets',
  without.straights.poking > 0.002, without.straights.poking);
check('and it pokes through by more than a kerb is tall',
  without.straights.worst > 0.15, without.straights.worst);

check('with a shoulder, nothing pokes through anywhere',
  withIt.straights.worst <= 0, withIt.straights.worst);
// Crossings are the piece this change does not finish, and saying so with a
// number is more use than claiming it did. Two streets meeting on a slope each
// cut the earth to their own level; where those differ the lower one has
// ground standing in it. It is bounded — the levelling caps how far apart two
// streets at one junction may be — and it is what junction polygons are for.
check('at a crossing the earth is at worst a street-levelling out',
  withIt.junctions.worst < 1.0, withIt.junctions.worst);
check('and a crossing is mostly below its paving even so',
  withIt.junctions.poking < 0.05, withIt.junctions.poking);
check('and the street is not left standing on a plinth either',
  -withIt.straights.median < STRUCTURE_DEPTH + 0.25, -withIt.straights.median);

console.log(failures ? `\n${failures} FAILURE(S)` : '\nall checks passed');
if (failures) process.exit(1);
