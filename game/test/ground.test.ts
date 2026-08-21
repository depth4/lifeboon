/**
 * Mechanic 1: a road presses the ground.
 *
 * The hard case comes first, and that is a rule rather than a preference. The
 * project this replaces reported a junction seam of 0.19 cm and called it
 * proven — on a grid of identical streets meeting at right angles, where
 * nothing could go wrong. The real town it then produced is what started this
 * rewrite.
 *
 * So the scene here is deliberately awkward: a hillside with a rise and a
 * hollow in it, and a road that runs diagonally across the fall of the land,
 * bends twice, and wants to be steeper than it is allowed to be. It has to cut
 * through the rise and fill across the hollow; if it only cut, the far side
 * would hang in the air.
 */

import { Ground } from '../world/ground';
import { Road, ROAD_DEPTH } from '../world/road';
import { contains } from '../world/area';
import { Canvas } from './png';

let failures = 0;
function check(name: string, ok: boolean, got?: unknown): void {
  if (ok) console.log(`  ok   ${name}`);
  else {
    failures++;
    console.log(`  FAIL ${name}${got === undefined ? '' : ` -> ${JSON.stringify(got)}`}`);
  }
}

/** A hillside, with a rise to climb over and a hollow to cross. */
const land = (x: number, z: number): number =>
  x * 0.09 + z * 0.03
  + 9 * Math.exp(-((x - 40) ** 2 + (z + 20) ** 2) / 1400)
  - 7 * Math.exp(-((x + 45) ** 2 + (z - 30) ** 2) / 1800);

const MAX_GRADE = 0.06;
const before = new Ground(300, 2, land);
const ground = new Ground(300, 2, land);
const road = new Road({
  centre: [[-120, -60], [-40, -20], [30, 10], [110, 60]],
  width: 7,
  maxGrade: MAX_GRADE,
  blend: 6,
}, ground);
road.build(ground);

console.log('--- a road on a hillside ---');
console.log(`  ${road.chainage[road.chainage.length - 1].toFixed(0)} m long, `
  + `${road.width} m wide, climbing `
  + `${(road.level[road.level.length - 1] - road.level[0]).toFixed(1)} m`);

/* ------------------------------------- does the earth carry the road? */
{
  let samples = 0;
  let over = 0;
  let worst = -Infinity;
  let sumGap = 0;
  const where: Array<{ along: number; across: number; gap: number }> = [];
  for (let along = 0; along <= road.chainage[road.chainage.length - 1]; along += 0.5) {
    for (let across = -road.width / 2; across <= road.width / 2 + 1e-9; across += 0.25) {
      const p = pointOn(road, along, across);
      if (!contains(road.area, p[0], p[1])) continue;
      // Compared against the road's own answer at this very point, not
      // against the level at the chainage this loop used to get here. Around a
      // bend those are two different numbers, and comparing one with the other
      // measures the difference between two parametrisations rather than
      // anything about the earth. That mistake cost a wrong diagnosis: the
      // "overshoot" sat exactly at the bends and did not move when the ground
      // was pressed wider, which is the tell.
      const gap = ground.heightAt(p[0], p[1]) - (road.heightAt(p[0], p[1]) - ROAD_DEPTH);
      samples++;
      sumGap += gap;
      if (gap > 1e-6) { over++; where.push({ along, across, gap }); }
      worst = Math.max(worst, gap);
    }
  }
  console.log(`  under the road: ${samples} samples, ${over} where the earth stands `
    + `above where it should, worst ${(worst * 100).toFixed(2)} cm, `
    + `mean ${(100 * sumGap / samples).toFixed(2)} cm`);
  where.sort((a, b) => b.gap - a.gap);
  console.log('  the worst of them: ' + where.slice(0, 5)
    .map((w) => `${(w.gap * 100).toFixed(1)}cm at ${w.along.toFixed(0)}m along, `
      + `${w.across.toFixed(2)}m across`).join('; '));
  const bends = road.chainage.slice(1, -1).map((c) => c.toFixed(0)).join(', ');
  console.log(`  the road bends at ${bends} m`);
  // Two centimetres, and the number has a cause rather than a margin: what is
  // left sits at the two bends, on the outside edge, where the surface has a
  // crease in it and a 2 m grid of heights cannot follow a crease. It goes
  // away when the ground learns to be finer where something is built, which is
  // a mechanic of its own and not this one. Everywhere else it is zero.
  check('the earth carries the road, within what the grid can express',
    worst < 0.02, worst);
  check('and on average the earth is below the road, not above it',
    sumGap / samples <= 0, sumGap / samples);
  check('and that is measured over the whole road', samples > 5000, samples);
}

/* ----------------------------------------- is the road a road, not a ramp? */
{
  console.log(`  steepest gradient ${(road.steepest * 100).toFixed(2)}%, `
    + `allowed ${(MAX_GRADE * 100).toFixed(0)}%`);
  check('the road is never steeper than it is allowed to be',
    road.steepest <= MAX_GRADE + 1e-6, road.steepest);

  // It must follow the land, not flatten it. Measured as how much of the
  // original relief along the line survives into the finished surface.
  const raw = road.centre.map(([x, z]) => land(x, z));
  const rawRange = Math.max(...raw) - Math.min(...raw);
  const builtRange = Math.max(...road.level) - Math.min(...road.level);
  console.log(`  land along the line rises ${rawRange.toFixed(1)} m; `
    + `the road rises ${builtRange.toFixed(1)} m`);
  check('the road follows the land rather than levelling it',
    builtRange > rawRange * 0.5, { rawRange, builtRange });
}

/* -------------------------------------------- is anything else disturbed? */
{
  let touched = 0;
  let checked = 0;
  let worst = 0;
  for (let z = -140; z <= 140; z += 2) {
    for (let x = -140; x <= 140; x += 2) {
      const { across } = road.nearest(x, z);
      if (across < road.width / 2 + road.blend + 4) continue;
      checked++;
      const moved = Math.abs(ground.heightAt(x, z) - before.heightAt(x, z));
      if (moved > 1e-6) touched++;
      worst = Math.max(worst, moved);
    }
  }
  console.log(`  beyond the road and its blend: ${checked} samples, `
    + `${touched} moved, worst ${(worst * 100).toFixed(3)} cm`);
  check('ground the road has nothing to do with is left alone', touched === 0, touched);
}

/* --------------------------------------------------------- the picture */
drawCut();

console.log(failures === 0 ? '\nmechanic 1 holds' : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);

/** A point on the road: so far along it, so far across it. */
function pointOn(r: Road, along: number, across: number): [number, number] {
  const chain = r.chainage;
  let i = 1;
  while (i < chain.length - 1 && chain[i] < along) i++;
  const a = r.centre[i - 1];
  const b = r.centre[i];
  const span = chain[i] - chain[i - 1];
  const t = span < 1e-9 ? 0 : (along - chain[i - 1]) / span;
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const len = Math.hypot(dx, dz) || 1;
  return [
    a[0] + dx * t + (dz / len) * across,
    a[1] + dz * t + (-dx / len) * across,
  ];
}

/**
 * The evidence you can look at: the land as it was, the land as it is, and the
 * road standing on it, cut along the road's own line.
 */
function drawCut(): void {
  const W = 1200;
  const H = 420;
  const canvas = new Canvas(W, H, [246, 244, 238]);
  const total = road.chainage[road.chainage.length - 1];
  const { low, high } = ground.range;
  const top = high + 4;
  const bottom = low - 4;
  const toY = (h: number) => H - ((h - bottom) / (top - bottom)) * H;
  const toX = (s: number) => (s / total) * W;

  for (let s = 0; s <= total; s += total / W) {
    const p = pointOn(road, s, 0);
    const x = toX(s);
    // The earth as it stands now, filled down to the bottom of the picture.
    canvas.column(x, toY(ground.heightAt(p[0], p[1])), H, [178, 164, 132]);
    // Where it was before the road touched it.
    canvas.set(x, toY(before.heightAt(p[0], p[1])), [150, 120, 96]);
    // The road surface.
    canvas.column(x, toY(road.levelAt(s)), toY(road.levelAt(s)) + 4, [64, 64, 68]);
  }
  canvas.write('.pictures/mechanic-1-cut.png');
  console.log('  wrote .pictures/mechanic-1-cut.png — original ground is the thin '
    + 'dark line, the earth now is the fill, the road is the dark band');
}
