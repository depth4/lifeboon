/**
 * Areas: the ground a thing occupies, as a polygon.
 *
 * Everything built in this world is an area. A road is an area. A pavement is
 * an area. Where two areas meet is decided by **boolean operations on
 * polygons**, computed by a library, and never by rules about where one band
 * should stop and another begin.
 *
 * That is not a style preference. The project this replaces rejected polygon
 * booleans as a technique and then reimplemented them by hand five times, in
 * five representations that disagreed with one another; every "the pavement is
 * doubled here and missing there" bug lived in the gaps between them. The rule
 * here is: if the question is "which ground belongs to what", the answer comes
 * from `union` or `difference` below, or it does not get answered.
 */

import clip from 'polygon-clipping';
import type { Geom } from 'polygon-clipping';
import earcut from 'earcut';

export type Vec2 = [number, number];
/** A closed loop of points. The first point is not repeated at the end. */
export type Ring = Vec2[];
/** One outer ring and any number of holes. */
export type Polygon = Ring[];
/** What every operation here returns: zero or more polygons. */
export type Area = Polygon[];

export const EMPTY: Area = [];

export function union(...areas: Area[]): Area {
  const live = areas.filter((a) => a.length > 0);
  if (live.length === 0) return EMPTY;
  if (live.length === 1) return live[0];
  return clip.union(live[0] as Geom, ...live.slice(1) as Geom[]) as Area;
}

export function difference(from: Area, ...cut: Area[]): Area {
  if (from.length === 0) return EMPTY;
  const live = cut.filter((a) => a.length > 0);
  if (live.length === 0) return from;
  return clip.difference(from as Geom, ...live as Geom[]) as Area;
}

export function intersection(a: Area, b: Area): Area {
  if (a.length === 0 || b.length === 0) return EMPTY;
  return clip.intersection(a as Geom, b as Geom) as Area;
}

/**
 * The area a line covers when given a width.
 *
 * Built as the **union of simple pieces** — one rectangle per segment, one
 * many-sided disc at each bend — rather than by an offsetting algorithm. Two
 * reasons, and both were learnt the expensive way: a union of convex pieces
 * cannot fold over itself however sharp the corner, and the disc at a bend is
 * the corner radius, so a rounded corner comes out of the construction instead
 * of being drawn by hand afterwards.
 */
export function stroke(line: Vec2[], half: number, sides = 24): Area {
  if (line.length < 2 || half <= 0) return EMPTY;
  const pieces: Area[] = [];

  for (let i = 0; i < line.length - 1; i++) {
    const [ax, az] = line[i];
    const [bx, bz] = line[i + 1];
    const dx = bx - ax;
    const dz = bz - az;
    const len = Math.hypot(dx, dz);
    if (len < 1e-9) continue;
    const nx = (dz / len) * half;
    const nz = (-dx / len) * half;
    pieces.push([[[
      [ax + nx, az + nz], [bx + nx, bz + nz],
      [bx - nx, bz - nz], [ax - nx, az - nz],
    ]]]);
  }
  // A disc at every interior joint. Without it a bend leaves a wedge of
  // uncovered ground on the outside of the turn.
  for (let i = 1; i < line.length - 1; i++) {
    pieces.push(disc(line[i], half, sides));
  }
  return union(...pieces);
}

export function disc(at: Vec2, radius: number, sides = 12): Area {
  const ring: Ring = [];
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    ring.push([at[0] + Math.cos(a) * radius, at[1] + Math.sin(a) * radius]);
  }
  return [[ring]];
}

/** Whether a point is inside the area. */
export function contains(area: Area, x: number, z: number): boolean {
  for (const polygon of area) {
    if (!inRing(polygon[0], x, z)) continue;
    let inHole = false;
    for (let h = 1; h < polygon.length; h++) {
      if (inRing(polygon[h], x, z)) { inHole = true; break; }
    }
    if (!inHole) return true;
  }
  return false;
}

/**
 * How far a point lies outside the area, in metres. Zero inside it.
 *
 * What the ground needs in order to ease back to untouched land: the thing
 * being built decides the height under itself exactly, and gives it up over
 * the next few metres.
 */
export function distanceOutside(area: Area, x: number, z: number): number {
  if (contains(area, x, z)) return 0;
  let best = Infinity;
  for (const polygon of area) {
    for (const ring of polygon) {
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i];
        const b = ring[(i + 1) % ring.length];
        best = Math.min(best, distanceToSegment(x, z, a, b));
      }
    }
  }
  return best;
}

/** Total surface, in square metres. Holes count against it. */
export function area(of: Area): number {
  let total = 0;
  for (const polygon of of) {
    polygon.forEach((ring, index) => {
      total += (index === 0 ? 1 : -1) * Math.abs(ringArea(ring));
    });
  }
  return total;
}

/**
 * Triangles covering the area, as [x, z] pairs three at a time.
 *
 * Heights are not decided here: whatever owns the area says how high its
 * surface is at a point, and that is asked per vertex. An area is a *plan*,
 * and keeping it that way is what lets the same polygon be paved, grassed or
 * pressed into the earth without three versions of it existing.
 */
export function triangulate(of: Area): Vec2[] {
  const out: Vec2[] = [];
  for (const polygon of of) {
    const flat: number[] = [];
    const holes: number[] = [];
    polygon.forEach((ring, index) => {
      if (index > 0) holes.push(flat.length / 2);
      for (const [x, z] of ring) flat.push(x, z);
    });
    const indices = earcut(flat, holes, 2);
    for (const i of indices) out.push([flat[i * 2], flat[i * 2 + 1]]);
  }
  return out;
}

/* ------------------------------------------------------------- arithmetic */

function inRing(ring: Ring, x: number, z: number): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i];
    const [xj, zj] = ring[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function distanceToSegment(x: number, z: number, a: Vec2, b: Vec2): number {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const lenSq = dx * dx + dz * dz;
  if (lenSq < 1e-12) return Math.hypot(x - a[0], z - a[1]);
  let t = ((x - a[0]) * dx + (z - a[1]) * dz) / lenSq;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return Math.hypot(x - (a[0] + dx * t), z - (a[1] + dz * t));
}

function ringArea(ring: Ring): number {
  let sum = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    sum += a[0] * b[1] - b[0] * a[1];
  }
  return sum / 2;
}
