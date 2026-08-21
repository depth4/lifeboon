/**
 * Walking along a line: chainage, resampling, tangents, trimming.
 *
 * Small and shared, because every part builder needs the same four things and
 * writing them again per builder is how two pieces of the same street end up
 * disagreeing about where their common end is.
 */

import type { Vec2 } from '../types';

/** Distance from the start of the line to each of its points. */
export function chainage(points: Vec2[]): number[] {
  const out = new Array<number>(points.length);
  out[0] = 0;
  for (let i = 1; i < points.length; i++) {
    out[i] = out[i - 1] + Math.hypot(
      points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  return out;
}

/** The point at a given distance along the line. */
export function pointAt(points: Vec2[], chain: number[], at: number): Vec2 {
  const total = chain[chain.length - 1];
  const d = Math.max(0, Math.min(total, at));
  let i = 1;
  while (i < chain.length - 1 && chain[i] < d) i++;
  const span = chain[i] - chain[i - 1];
  const t = span <= 1e-9 ? 0 : (d - chain[i - 1]) / span;
  return [
    points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t,
    points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t,
  ];
}

/**
 * Unit direction at a distance along the line.
 *
 * Taken from the segment the point sits on rather than from a window around
 * it: a street part's columns are laid out on this normal, and smoothing it
 * would let two adjacent rows lean different ways and pinch the lattice.
 */
export function tangentAt(points: Vec2[], chain: number[], at: number): Vec2 {
  const total = chain[chain.length - 1];
  const d = Math.max(0, Math.min(total, at));
  let i = 1;
  while (i < chain.length - 1 && chain[i] < d) i++;
  const dx = points[i][0] - points[i - 1][0];
  const dz = points[i][1] - points[i - 1][1];
  const len = Math.hypot(dx, dz) || 1;
  return [dx / len, dz / len];
}

/** Interpolate a per-point value at a distance along the line. */
export function valueAt(values: number[], chain: number[], at: number): number {
  const total = chain[chain.length - 1];
  const d = Math.max(0, Math.min(total, at));
  let i = 1;
  while (i < chain.length - 1 && chain[i] < d) i++;
  const span = chain[i] - chain[i - 1];
  const t = span <= 1e-9 ? 0 : (d - chain[i - 1]) / span;
  return values[i - 1] + (values[i] - values[i - 1]) * t;
}

/**
 * Where to put the rows of a part's lattice, between two distances along it.
 *
 * Every original vertex of the line is kept — a bend the map drew must be a
 * bend in the mesh — and long straights are filled in at `step`, because a
 * lattice row is also where the surface may follow the ground, and a hundred
 * metres of road with two rows cannot follow anything.
 */
export function rowsBetween(chain: number[], from: number, to: number, step: number): number[] {
  const lo = Math.max(0, from);
  const hi = Math.min(chain[chain.length - 1], to);
  if (hi - lo < 1e-6) return [];

  const stops = new Set<number>([lo, hi]);
  for (const c of chain) if (c > lo + 1e-6 && c < hi - 1e-6) stops.add(c);

  const sorted = [...stops].sort((a, b) => a - b);
  const out: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const span = sorted[i + 1] - sorted[i];
    const pieces = Math.max(1, Math.round(span / step));
    for (let k = 0; k < pieces; k++) out.push(sorted[i] + (span * k) / pieces);
  }
  out.push(sorted[sorted.length - 1]);
  return out;
}
