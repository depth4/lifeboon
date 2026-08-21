/**
 * Drawing parts.
 *
 * This renderer is deliberately stupid, and that is the whole point of it. It
 * knows nothing about OpenStreetMap, nothing about junctions, nothing about
 * which way owns which square metre. It is handed a list of parts that have
 * already been placed, and it turns their cells into triangles.
 *
 * `render/roads.ts` — the file this replaces for streets — is 1333 lines
 * because it was doing the opposite: reading ways, working out where they
 * crossed, suppressing bands that would have collided, filling the gaps it had
 * just made. Every one of those decisions has moved up into `world/parts/`,
 * where it is made once, before anything is drawn.
 *
 * The quad split here — corners 0-1-2 and 0-2-3 — is the same split
 * `world/partfield.ts` uses to answer "how high is the ground here". If the
 * two ever diverge, the car will drive on a surface a centimetre away from the
 * one you can see, which is the exact bug this architecture exists to make
 * impossible.
 */

import * as THREE from 'three';
import { affords, Can, Role, type Part } from '../world/parts';
import type { RoadClass } from '../world/types';
import type { OcclusionField } from './occlusion';
import type { StreetMask } from './streetmask';
import { asphaltTexture, groundTexture, pavingTexture } from './textures';
import {
  KERB_FACE, KERB_TOP, MOWN_VERGE, PAVING, TURF, tintGround, tintHard,
} from './palette';

const SURFACE_COLOR: Record<RoadClass, number> = {
  motorway: 0x4a4a4e,
  trunk: 0x4a4a4e,
  primary: 0x4c4c50,
  secondary: 0x4e4e51,
  tertiary: 0x4f4f52,
  residential: 0x515154,
  service: 0x545451,
  pedestrian: 0x8e8a80,
  footway: 0x8e8a80,
  cycleway: 0x6b6660,
  steps: 0x8e8a80,
  track: 0x6f685c,
};

/** Which merged mesh a role belongs to. Three materials cover the whole street. */
type Bucket = 'asphalt' | 'paving' | 'soil';

const BUCKET_OF: readonly Bucket[] = (() => {
  const b: Bucket[] = new Array(12).fill('asphalt');
  b[Role.KerbFace] = 'paving';
  b[Role.KerbTop] = 'paving';
  b[Role.Pavement] = 'paving';
  b[Role.Parapet] = 'paving';
  b[Role.Fascia] = 'paving';
  b[Role.Verge] = 'soil';
  b[Role.Batter] = 'soil';
  return b;
})();

/**
 * Metres per texture tile, per role.
 *
 * A texture may only carry detail finer than its own tile: anything at the
 * tile's own scale repeats visibly across open ground. Asphalt is laid in wide
 * passes and reads coarse; paving slabs are small; grass wants a tile fine
 * enough that you cannot count the repeats from a car.
 */
const UV_SCALE: readonly number[] = (() => {
  const u: number[] = new Array(12).fill(3.2);
  u[Role.KerbFace] = 0.8;
  u[Role.KerbTop] = 0.8;
  u[Role.Pavement] = 1.1;
  u[Role.Verge] = 2.4;
  u[Role.Batter] = 2.4;
  u[Role.Parapet] = 1.4;
  u[Role.Fascia] = 2.2;
  return u;
})();

/** Soft surfaces take the turf variation; hard ones take the quieter version. */
const SOFT: readonly boolean[] = (() => {
  const s: boolean[] = new Array(12).fill(false);
  s[Role.Verge] = true;
  s[Role.Batter] = true;
  return s;
})();

export interface PartMeshes {
  group: THREE.Group;
  /** Where a street tree stands: in the verge, clear of every junction. */
  treeSpots: Array<{ x: number; z: number; scale: number }>;
  triangles: number;
  dispose(): void;
}

const TINT = new THREE.Color();

function shade(color: THREE.Color, by: number): THREE.Color {
  return color.clone().multiplyScalar(by);
}

/** The colour a role is painted, before the world-space variation is added. */
function colorOf(role: Role, cls: RoadClass): THREE.Color {
  switch (role) {
    case Role.Carriageway:
    case Role.Junction:
    case Role.Crossing:
      return new THREE.Color(SURFACE_COLOR[cls]);
    // Where the cars stand, the tarmac is older and less swept than the lane
    // beside it. It is the same asphalt; it just never gets driven smooth.
    case Role.Parking:
      return shade(new THREE.Color(SURFACE_COLOR[cls]), 1.06);
    case Role.KerbFace:
      return shade(KERB_FACE, 0.9);
    case Role.KerbTop:
      return KERB_TOP;
    case Role.Pavement:
      return PAVING;
    case Role.Verge:
      return MOWN_VERGE;
    case Role.Batter:
      return TURF;
    case Role.Parapet:
      return shade(PAVING, 0.94);
    case Role.Fascia:
      return shade(PAVING, 0.66);
    default:
      return PAVING;
  }
}

interface Buffers {
  pos: number[];
  uv: number[];
  col: number[];
}

export function buildPartMeshes(
  parts: Part[],
  occlusion: OcclusionField | null = null,
  mask: StreetMask | null = null,
): PartMeshes {
  const buckets: Record<Bucket, Buffers> = {
    asphalt: { pos: [], uv: [], col: [] },
    paving: { pos: [], uv: [], col: [] },
    soil: { pos: [], uv: [], col: [] },
  };
  const treeSpots: Array<{ x: number; z: number; scale: number }> = [];
  const paint: Buffers = { pos: [], uv: [], col: [] };

  for (const part of parts) {
    const { rows, cols, x, y, z, cell } = part.lattice;
    // Distance along and across, so a texture tile is a tile of real ground
    // rather than a fraction of however finely this part happens to be drawn.
    const along = new Float64Array(rows);
    for (let r = 1; r < rows; r++) {
      const a = r * cols;
      const b = (r - 1) * cols;
      along[r] = along[r - 1] + Math.hypot(x[a] - x[b], z[a] - z[b]);
    }

    for (let r = 0; r < rows - 1; r++) {
      let across = 0;
      for (let c = 0; c < cols - 1; c++) {
        const at = r * (cols - 1) + c;
        const role = cell[at] as Role;
        const i0 = r * cols + c;
        const i1 = i0 + 1;
        const i2 = i0 + cols + 1;
        const i3 = i0 + cols;
        const width = Math.hypot(x[i1] - x[i0], z[i1] - z[i0]);
        const rise = Math.abs(y[i1] - y[i0]);
        const step = Math.hypot(width, rise);
        if (role === Role.None) {
          across += step;
          continue;
        }

        const out = buckets[BUCKET_OF[role]];
        const scale = UV_SCALE[role];
        const soft = SOFT[role];
        const base = colorOf(role, part.cls);
        const uv: Array<[number, number]> = [
          [along[r] / scale, across / scale],
          [along[r] / scale, (across + step) / scale],
          [along[r + 1] / scale, (across + step) / scale],
          [along[r + 1] / scale, across / scale],
        ];
        const corners = [i0, i1, i2, i3];

        const push = (k: number) => {
          const i = corners[k];
          out.pos.push(x[i], y[i], z[i]);
          out.uv.push(uv[k][0], uv[k][1]);
          TINT.copy(base);
          const ao = occlusion?.at(x[i], z[i]) ?? 0;
          if (soft) tintGround(TINT, x[i], z[i], ao);
          else tintHard(TINT, x[i], z[i], ao);
          out.col.push(TINT.r, TINT.g, TINT.b);
        };

        // The ground is cut away under paving, and this is where it learns
        // where the paving actually went — from the very quad being drawn,
        // rather than from a reconstruction of it off the centrelines. Getting
        // that reconstruction wrong at junctions is what used to leave the
        // earth standing in the road.
        if (mask && (affords(role) & Can.Paved)) {
          mask.stampQuad(
            [x[i0], z[i0]], [x[i1], z[i1]], [x[i2], z[i2]], [x[i3], z[i3]],
          );
        }

        // Backface culling is on, so a quad wound the wrong way is invisible.
        // Decided per quad from the sign of the cross product rather than
        // assumed from the column order: a lattice may be laid out either way
        // round and a junction fan is laid out both ways in one part.
        const up = (x[i1] - x[i0]) * (z[i2] - z[i0]) - (x[i2] - x[i0]) * (z[i1] - z[i0]);
        const order = up < 0 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2];
        for (const k of order) push(k);

        // A street tree every dozen-odd metres of verge, spaced by real
        // distance rather than by lattice row: rows are as far apart as eight
        // metres on a straight and centimetres round a bend, and counting rows
        // plants an avenue on one and a thicket on the other.
        if (role === Role.Verge && width > 1.2
          && Math.floor(along[r] / TREE_SPACING_M)
            !== Math.floor(along[r + 1] / TREE_SPACING_M)) {
          treeSpots.push({
            x: (x[i0] + x[i2]) / 2,
            z: (z[i0] + z[i2]) / 2,
            scale: 0.8 + ((r * 13 + c * 7) % 40) / 100,
          });
        }
        across += step;
      }
    }

    markings(part, along, paint);
  }

  const asphalt = asphaltTexture();
  const paving = pavingTexture();
  const soil = groundTexture();

  const group = new THREE.Group();
  group.name = 'roads';

  const materials = {
    asphalt: new THREE.MeshStandardMaterial({
      map: asphalt, vertexColors: true, roughness: 0.96, metalness: 0,
    }),
    paving: new THREE.MeshStandardMaterial({
      map: paving, vertexColors: true, roughness: 0.9, metalness: 0,
    }),
    soil: new THREE.MeshStandardMaterial({
      map: soil, vertexColors: true, roughness: 1, metalness: 0,
    }),
  };

  const markMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    // Paint is three centimetres of thermoplastic on top of the asphalt, which
    // is below the depth buffer's ability to tell them apart at city distances.
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });

  const geoms: THREE.BufferGeometry[] = [];
  let triangles = 0;
  const names: Record<Bucket, string> = {
    asphalt: 'roads:surface',
    paving: 'roads:paving',
    soil: 'roads:verge',
  };

  for (const bucket of ['asphalt', 'paving', 'soil'] as const) {
    const data = buckets[bucket];
    if (!data.pos.length) continue;
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(data.pos, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(data.uv, 2));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(data.col, 3));
    geom.computeVertexNormals();
    geom.computeBoundingSphere();
    const mesh = new THREE.Mesh(geom, materials[bucket]);
    mesh.receiveShadow = true;
    // The kerb is the one piece of street furniture tall enough to cast a
    // shadow worth having: it is what draws the edge of the road at low sun.
    mesh.castShadow = bucket === 'paving';
    mesh.name = names[bucket];
    group.add(mesh);
    geoms.push(geom);
    triangles += data.pos.length / 9;
  }

  if (paint.pos.length) {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(paint.pos, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(paint.uv, 2));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(paint.col, 3));
    geom.computeBoundingSphere();
    const mesh = new THREE.Mesh(geom, markMat);
    mesh.name = 'roads:markings';
    group.add(mesh);
    geoms.push(geom);
    triangles += paint.pos.length / 9;
  }

  return {
    group,
    treeSpots,
    triangles,
    dispose() {
      for (const g of geoms) g.dispose();
      for (const m of Object.values(materials)) m.dispose();
      markMat.dispose();
      asphalt.dispose();
      paving.dispose();
      soil.dispose();
    },
  };
}

/** How far apart street trees stand along a verge. */
const TREE_SPACING_M = 15;

/** Half the width of a painted line, in metres. */
const PAINT_HALF = 0.06;
const CENTRE_PAINT = new THREE.Color(0xd8d2c4);
const LANE_PAINT = new THREE.Color(0xc9c3b6);

/**
 * Paint the lines the lane model asks for.
 *
 * One dash per row of the lattice, covering the first third of it. Rows are
 * eight metres apart at most, so that comes out near enough to the 3 m of
 * paint and 6 m of gap a real centre line is marked in, and it costs no
 * subdivision: the dash lives on the same vertices the surface does, so it
 * follows the camber and the gradient exactly instead of floating over them.
 */
function markings(part: Part, along: Float64Array, out: Buffers): void {
  if (!part.marks.length) return;
  const { rows, cols, x, y, z } = part.lattice;

  for (const mark of part.marks) {
    const color = mark.kind === 'centre' ? CENTRE_PAINT : LANE_PAINT;
    for (let r = 0; r < rows - 1; r++) {
      const a = r * cols + mark.col;
      const b = a + cols;
      const span = along[r + 1] - along[r];
      if (span < 0.2) continue;
      const t = Math.min(1, 3 / span);

      const ax = x[a];
      const az = z[a];
      const bx = ax + (x[b] - ax) * t;
      const bz = az + (z[b] - az) * t;
      const ay = y[a];
      const by = ay + (y[b] - ay) * t;
      const dx = bx - ax;
      const dz = bz - az;
      const len = Math.hypot(dx, dz) || 1;
      const nx = (dz / len) * PAINT_HALF;
      const nz = (-dx / len) * PAINT_HALF;

      const corners = [
        [ax - nx, ay, az - nz],
        [ax + nx, ay, az + nz],
        [bx + nx, by, bz + nz],
        [bx - nx, by, bz - nz],
      ];
      const up = (corners[1][0] - corners[0][0]) * (corners[2][2] - corners[0][2])
        - (corners[2][0] - corners[0][0]) * (corners[1][2] - corners[0][2]);
      const order = up < 0 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2];
      for (const k of order) {
        out.pos.push(corners[k][0], corners[k][1], corners[k][2]);
        out.uv.push(0, 0);
        out.col.push(color.r, color.g, color.b);
      }
    }
  }
}
