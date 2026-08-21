/**
 * Ribbons: a polyline given a width and turned into triangles.
 *
 * The two oldest pieces of geometry code in the project, kept because three
 * quite different things still need them — the railway, the ground's water
 * surfaces, and the mask that records where paving went. They used to live in
 * `render/roads.ts`, which no longer exists: streets are built from parts now
 * (`world/parts/`), and a part carries its own lattice rather than being swept
 * here at draw time.
 */

import * as THREE from 'three';
import type { Vec2 } from '../world/types';

/**
 * Offset a polyline to both sides by `half`, mitring at each interior vertex.
 * Returns left and right edge point lists of the same length as `points`.
 */
export function offsetPolyline(points: Vec2[], half: number): { left: Vec2[]; right: Vec2[] } {
  const n = points.length;
  const left: Vec2[] = new Array(n);
  const right: Vec2[] = new Array(n);

  const dirs: Vec2[] = new Array(Math.max(0, n - 1));
  for (let i = 0; i < n - 1; i++) {
    const dx = points[i + 1][0] - points[i][0];
    const dz = points[i + 1][1] - points[i][1];
    const len = Math.hypot(dx, dz) || 1;
    dirs[i] = [dx / len, dz / len];
  }

  for (let i = 0; i < n; i++) {
    const dIn = dirs[Math.max(0, i - 1)] ?? [1, 0];
    const dOut = dirs[Math.min(dirs.length - 1, i)] ?? dIn;
    // Perpendiculars (right-hand side of travel).
    const pIn: Vec2 = [dIn[1], -dIn[0]];
    const pOut: Vec2 = [dOut[1], -dOut[0]];
    let mx = pIn[0] + pOut[0];
    let mz = pIn[1] + pOut[1];
    const mLen = Math.hypot(mx, mz);
    if (mLen < 1e-4) {
      // A hairpin; fall back to the incoming perpendicular.
      mx = pIn[0];
      mz = pIn[1];
    } else {
      mx /= mLen;
      mz /= mLen;
    }
    // Lengthen the mitre so the ribbon keeps its width through the corner.
    //
    // The clamp has to be in metres, not as a ratio. A ratio of 2.5 is a
    // reasonable 5 m on the edge of a carriageway and an absurd 13 m on a
    // bridge parapet five metres out — which is exactly the arrowhead that
    // grew out of every sharp bend on a bridge. Capping the *extension*
    // instead pinches a hard corner slightly and never spikes.
    const cos = mx * pIn[0] + mz * pIn[1];
    const maxExtra = 1.6;
    const scale = Math.min(
      1 + maxExtra / Math.max(Math.abs(half), 0.2),
      1 / Math.max(0.35, cos),
    );
    const ox = mx * half * scale;
    const oz = mz * half * scale;
    right[i] = [points[i][0] + ox, points[i][1] + oz];
    left[i] = [points[i][0] - ox, points[i][1] - oz];
  }
  return { left, right };
}

/**
 * Emit a ribbon between two edge lists.
 *
 * `heights` carries one ground level per polyline vertex, so the ribbon
 * follows the terrain lengthwise while staying level across its width — which
 * is how a carriageway is actually built. A single scalar height would make
 * every road on a hillside either float or bury itself.
 */
export function emitRibbon(
  left: Vec2[],
  right: Vec2[],
  heights: number[],
  color: THREE.Color,
  pos: number[],
  uv: number[],
  col: number[],
  uvScale: number,
): void {
  let travelled = 0;
  for (let i = 0; i < left.length - 1; i++) {
    const l0 = left[i], r0 = right[i], l1 = left[i + 1], r1 = right[i + 1];
    const y0 = heights[i];
    const y1 = heights[i + 1];
    const segLen = Math.hypot(l1[0] - l0[0], l1[1] - l0[1]);
    const v0 = travelled / uvScale;
    const v1 = (travelled + segLen) / uvScale;
    travelled += segLen;

    // Two triangles wound (left, right-ahead, right) so the face points up.
    // Getting this backwards makes every road vanish under backface culling.
    pos.push(
      l0[0], y0, l0[1], r1[0], y1, r1[1], r0[0], y0, r0[1],
      l0[0], y0, l0[1], l1[0], y1, l1[1], r1[0], y1, r1[1],
    );
    uv.push(0, v0, 1, v1, 1, v0, 0, v0, 0, v1, 1, v1);
    for (let k = 0; k < 6; k++) col.push(color.r, color.g, color.b);
  }
}
