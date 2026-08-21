/**
 * Building geometry.
 *
 * Footprints are extruded by hand rather than through ExtrudeGeometry: at a
 * few thousand buildings the per-shape overhead dominates, and building the
 * buffers directly lets every building land in one merged mesh (walls) plus
 * one for roofs — two draw calls for an entire district.
 *
 * Only the outside is ever built. There are no floors, no rooms and no
 * interior geometry of any kind; a building is a closed shell.
 */

import * as THREE from 'three';
import type { Building, BuildingKind, Vec2 } from '../world/types';
import type { Terrain } from '../terrain/heightfield';
import { groundRangeUnder } from '../terrain/heightfield';
import { facadeTexture, roofTexture, windowLightTexture, TILE_METRES } from './textures';

/** Metres covered by one tile of the roof texture. */
const ROOF_UV_M = 1.6;

/** Height of the base course, in metres. */
const PLINTH_M = 0.9;

/** Base wall colours per building type, varied per building. */
const WALL_PALETTE: Record<BuildingKind, [number, number][]> = {
  residential: [[0xd8cec0, 0xbfae99], [0xc9b8a8, 0xa89684], [0xd5d0c8, 0xb4ada2]],
  commercial: [[0xc9ccd2, 0xa8adb8], [0xd2d0cc, 0xb0aca6]],
  office: [[0xb9c4cd, 0x93a3b3], [0xc4c9cf, 0x9aa4ae]],
  retail: [[0xd9cfc4, 0xbba894], [0xcfc9c4, 0xaea79f]],
  industrial: [[0xb8b8b4, 0x96968f], [0xc0bcae, 0x9d9889]],
  civic: [[0xdedad2, 0xc0b9ac], [0xd0cfcb, 0xafada6]],
  education: [[0xd6cfc2, 0xb6ab98], [0xcdd2d0, 0xa9b0ad]],
  religious: [[0xd8d2c6, 0xbab19f]],
  other: [[0xc4c0b8, 0xa39e93]],
};

const ROOF_PALETTE: Record<BuildingKind, number[]> = {
  residential: [0x8a6a58, 0x7d6357, 0x6f5f57, 0x5f5b57],
  commercial: [0x6a6d72, 0x5e6166],
  office: [0x5c6268, 0x545a60],
  retail: [0x76706a, 0x655f5a],
  industrial: [0x8a8a86, 0x74746f],
  civic: [0x6e6a62, 0x5d5a54],
  education: [0x7b6a5c, 0x6a5d52],
  religious: [0x6b6257, 0x585149],
  other: [0x807a72],
};

export interface BuildingMeshes {
  walls: THREE.Mesh;
  roofs: THREE.Mesh;
  /** Set the strength of lit windows, 0 by day, 1 at night. */
  setWindowLight(intensity: number): void;
  dispose(): void;
}

/**
 * Push one triangle, flipping the winding if its normal points the wrong way.
 * Cheap insurance against inconsistently wound source data.
 */
function pushTriangle(
  pos: number[],
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  cx: number, cy: number, cz: number,
  wantUp: boolean,
): void {
  // Only the Y component of u x v matters: it tells us which way the face points.
  const ux = bx - ax, uz = bz - az;
  const vx = cx - ax, vz = cz - az;
  const ny = uz * vx - ux * vz;
  const flip = wantUp ? ny < 0 : ny > 0;
  if (flip) {
    pos.push(ax, ay, az, cx, cy, cz, bx, by, bz);
  } else {
    pos.push(ax, ay, az, bx, by, bz, cx, cy, cz);
  }
}

function lerpColor(a: number, b: number, t: number, out: THREE.Color): THREE.Color {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return out.copy(ca).lerp(cb, t);
}


/**
 * The smallest rectangle that contains a footprint, at any angle.
 *
 * A roof has to be built on *something*, and a pitched roof needs a direction
 * to run its ridge along. Real houses are close enough to rectangles that the
 * minimum-area box round the footprint gives that direction, and comparing the
 * box's area with the footprint's says how safe the assumption is: a plan that
 * fills its box is a rectangle, one that fills two thirds of it is an L and
 * gets a flat roof instead of a wrong one.
 *
 * Tested against every edge direction, which is the standard result that the
 * minimum box always shares an edge with the convex hull — and with a handful
 * of vertices per building it is cheaper than computing the hull first.
 */
interface Obb {
  cx: number;
  cz: number;
  /** Unit vector along the long axis. */
  ux: number;
  uz: number;
  halfLong: number;
  halfShort: number;
  area: number;
}

function orientedBox(ring: Vec2[]): Obb | null {
  if (ring.length < 3) return null;
  let best: Obb | null = null;

  for (let i = 0; i < ring.length; i++) {
    const p0 = ring[i];
    const p1 = ring[(i + 1) % ring.length];
    const dx = p1[0] - p0[0];
    const dz = p1[1] - p0[1];
    const len = Math.hypot(dx, dz);
    if (len < 0.2) continue;
    const ax = dx / len;
    const az = dz / len;

    let minA = Infinity, maxA = -Infinity, minB = Infinity, maxB = -Infinity;
    for (const [x, z] of ring) {
      const a = x * ax + z * az;
      const b = -x * az + z * ax;
      if (a < minA) minA = a;
      if (a > maxA) maxA = a;
      if (b < minB) minB = b;
      if (b > maxB) maxB = b;
    }
    const spanA = maxA - minA;
    const spanB = maxB - minB;
    const area = spanA * spanB;
    if (best && area >= best.area) continue;

    const midA = (minA + maxA) / 2;
    const midB = (minB + maxB) / 2;
    const longer = spanA >= spanB;
    best = {
      cx: midA * ax - midB * az,
      cz: midA * az + midB * ax,
      ux: longer ? ax : -az,
      uz: longer ? az : ax,
      halfLong: (longer ? spanA : spanB) / 2,
      halfShort: (longer ? spanB : spanA) / 2,
      area,
    };
  }
  return best;
}

/** Signed area of a ring; its sign is the winding. */
function signedArea(ring: Vec2[]): number {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return a / 2;
}

/**
 * A vertical band around a ring — the fascia under an eave, or the outside of
 * a parapet. Winding is taken from the ring's own orientation, because getting
 * it backwards makes the band vanish under backface culling rather than look
 * wrong, which is the failure this codebase has hit twice.
 */
function emitBand(
  pos: number[],
  col: number[],
  uv: number[],
  ring: Vec2[],
  yTop: number,
  yBottom: number,
  r: number,
  g: number,
  b: number,
  reference: number,
): void {
  const order = Math.sign(signedArea(ring)) === Math.sign(reference)
    ? ring
    : ring.slice().reverse();
  let travelled = 0;
  for (let i = 0; i < order.length; i++) {
    const p0 = order[i];
    const p1 = order[(i + 1) % order.length];
    const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    const u0 = travelled / ROOF_UV_M;
    const u1 = (travelled + len) / ROOF_UV_M;
    travelled += len;
    const v0 = yBottom / ROOF_UV_M;
    const v1 = yTop / ROOF_UV_M;
    pos.push(
      p0[0], yBottom, p0[1], p1[0], yTop, p1[1], p1[0], yBottom, p1[1],
      p0[0], yBottom, p0[1], p0[0], yTop, p0[1], p1[0], yTop, p1[1],
    );
    uv.push(u0, v0, u1, v1, u1, v0, u0, v0, u0, v1, u1, v1);
    for (let k = 0; k < 6; k++) col.push(r, g, b);
  }
}

/**
 * Which buildings get a pitched roof.
 *
 * Nearly every small building in a European or Russian town has one, and
 * drawing them all as flat slabs is most of why the city read as a warehouse
 * estate seen from above. Tall blocks, big industrial sheds and anything whose
 * plan is not roughly a rectangle keep the flat roof they really have.
 */
const PITCHED_KINDS: ReadonlySet<BuildingKind> = new Set<BuildingKind>([
  'residential', 'other', 'education', 'religious', 'retail', 'civic',
]);

function wantsPitch(b: Building, box: Obb | null): boolean {
  if (!box || !PITCHED_KINDS.has(b.kind)) return false;
  if (b.area > 1400 || b.height > 22) return false;
  if (box.halfShort < 2) return false;
  // How much of its own bounding box the plan fills. An L-shaped or curved
  // footprint scores low, and a ridge laid across one would float over the
  // parts of the plan it does not cover.
  return b.area / box.area > 0.74;
}

export function buildBuildingMeshes(
  buildings: Building[],
  terrain: Terrain,
): BuildingMeshes {
  const wallPos: number[] = [];
  const wallUv: number[] = [];
  const wallColor: number[] = [];

  const roofPos: number[] = [];
  const roofColor: number[] = [];
  const roofUv: number[] = [];

  const colorScratch = new THREE.Color();
  const roofScratch = new THREE.Color();

  for (const b of buildings) {
    const palette = WALL_PALETTE[b.kind];
    const pair = palette[Math.floor(b.variation * palette.length) % palette.length];
    lerpColor(pair[0], pair[1], (b.variation * 7.3) % 1, colorScratch);
    // Convert to linear space once; the merged geometry carries raw floats.
    const wr = colorScratch.r, wg = colorScratch.g, wb = colorScratch.b;

    const roofChoices = ROOF_PALETTE[b.kind];
    roofScratch.set(roofChoices[Math.floor(b.variation * 13) % roofChoices.length]);
    const rr = roofScratch.r, rg = roofScratch.g, rb = roofScratch.b;

    // Seat the building in the ground. The floor goes at the highest point
    // under the footprint so it never sinks into the hill, and the walls run
    // down past the lowest so no gap opens on the downhill side — which is
    // exactly what a real building on a slope does with its foundations.
    const ground = groundRangeUnder(b.ring, terrain);
    const floor = ground.high;
    const y0 = floor + b.minHeight;
    const y1 = floor + b.height;
    const skirt = ground.low - 0.4;

    // --- walls, outer ring and any courtyards ---------------------------
    const rings: Vec2[][] = [b.ring, ...b.holes];
    for (const ring of rings) {
      let travelled = 0;
      for (let i = 0; i < ring.length; i++) {
        const p0 = ring[i];
        const p1 = ring[(i + 1) % ring.length];
        const dx = p1[0] - p0[0];
        const dz = p1[1] - p0[1];
        const len = Math.hypot(dx, dz);
        if (len < 0.05) continue;

        const u0 = travelled / TILE_METRES;
        const u1 = (travelled + len) / TILE_METRES;
        // Texture from the floor upward, so window rows line up with storeys
        // regardless of how deep the foundation skirt runs.
        const v0 = (y0 - floor) / TILE_METRES;
        const v1 = (y1 - floor) / TILE_METRES;
        travelled += len;

        // A = bottom p0, B = bottom p1, C = top p1, D = top p0.
        // (A, C, B) and (A, D, C) wind outward for this ring orientation.
        // The wall starts at the skirt, below ground, so a sloping site shows
        // masonry rather than a triangle of daylight.
        const wallBase = b.minHeight > 0 ? y0 : skirt;

        // Split the wall at the top of the plinth.
        //
        // Almost every building has a base course in a different material —
        // render, stone, painted concrete — and it is darker than the wall
        // above it because it collects the weather and the traffic spray. It
        // is also the thing that makes a building look planted rather than
        // dropped: an unbroken face from eaves to grass reads as a cut-out.
        const plinthTop = Math.min(y0 + PLINTH_M, y1 - 0.5);
        const vPlinth = (plinthTop - floor) / TILE_METRES;

        wallPos.push(
          p0[0], wallBase, p0[1], p1[0], plinthTop, p1[1], p1[0], wallBase, p1[1],
          p0[0], wallBase, p0[1], p0[0], plinthTop, p0[1], p1[0], plinthTop, p1[1],
        );
        wallUv.push(u0, v0, u1, vPlinth, u1, v0, u0, v0, u0, vPlinth, u1, vPlinth);
        for (let k = 0; k < 6; k++) wallColor.push(wr * 0.72, wg * 0.71, wb * 0.7);

        wallPos.push(
          p0[0], plinthTop, p0[1], p1[0], y1, p1[1], p1[0], plinthTop, p1[1],
          p0[0], plinthTop, p0[1], p0[0], y1, p0[1], p1[0], y1, p1[1],
        );
        wallUv.push(u0, vPlinth, u1, v1, u1, vPlinth, u0, vPlinth, u0, v1, u1, v1);
        for (let k = 0; k < 6; k++) wallColor.push(wr, wg, wb);
      }
    }

    // --- roof ------------------------------------------------------------
    const box = orientedBox(b.ring);
    const ringWinding = signedArea(b.ring);

    if (wantsPitch(b, box) && box) {
      // A hipped roof on the footprint's own bounding box: a ridge down the
      // long axis, two slopes falling to the eaves and a hip closing each end.
      // Hipped rather than gabled because it needs no end walls, which keeps
      // it correct on a plan that is only approximately the box it was built
      // from — a gable would leave a triangle of daylight at each end.
      const OVERHANG = 0.38;
      const halfL = box.halfLong + OVERHANG;
      const halfW = box.halfShort + OVERHANG;
      // A 30 degree pitch, which is what most of Europe builds: the rise is
      // the half-span times tan(30). Using the half-span itself, which is what
      // this did first, gives 45 degrees and turns every house into a tent.
      const rise = Math.min(halfW * 0.577, 4.2);
      const eaveY = y1;
      const ridgeY = y1 + rise;

      const at = (u: number, v: number): Vec2 => [
        box.cx + box.ux * u - box.uz * v,
        box.cz + box.uz * u + box.ux * v,
      ];
      const c00 = at(-halfL, -halfW);
      const c10 = at(halfL, -halfW);
      const c11 = at(halfL, halfW);
      const c01 = at(-halfL, halfW);
      const rA = at(-halfL + halfW, 0);
      const rB = at(halfL - halfW, 0);

      // Roof UVs run in the box's own frame, so courses lie across the slope
      // on every face instead of following the compass.
      const uvOf = (p: Vec2): [number, number] => {
        const dx = p[0] - box.cx;
        const dz = p[1] - box.cz;
        return [
          (dx * box.ux + dz * box.uz) / ROOF_UV_M,
          (-dx * box.uz + dz * box.ux) / ROOF_UV_M,
        ];
      };
      const slope = (
        a: Vec2, ay: number, bb: Vec2, by: number, cc: Vec2, cy: number,
        tone: number,
      ) => {
        const before = roofPos.length;
        pushTriangle(roofPos, a[0], ay, a[1], bb[0], by, bb[1], cc[0], cy, cc[1], true);
        // pushTriangle may have swapped two vertices to fix the winding, so
        // the UVs are read back off the positions it actually wrote rather
        // than assumed from the arguments.
        for (let k = 0; k < 3; k++) {
          const [u, v] = uvOf([roofPos[before + k * 3], roofPos[before + k * 3 + 2]]);
          roofUv.push(u, v);
        }
        for (let k = 0; k < 3; k++) roofColor.push(rr * tone, rg * tone, rb * tone);
      };

      // Two long slopes, split into triangles, and a hip at each end. The two
      // long faces get slightly different tones: on any real roof one side has
      // had more sun and more weather than the other.
      slope(c00, eaveY, c10, eaveY, rB, ridgeY, 1.0);
      slope(c00, eaveY, rB, ridgeY, rA, ridgeY, 1.0);
      slope(c11, eaveY, c01, eaveY, rA, ridgeY, 0.9);
      slope(c11, eaveY, rA, ridgeY, rB, ridgeY, 0.9);
      slope(c01, eaveY, c00, eaveY, rA, ridgeY, 0.95);
      slope(c10, eaveY, c11, eaveY, rB, ridgeY, 0.95);

      // The eave: without the fascia the roof is a sheet of paper laid on the
      // walls, and its edge is the line the eye reads a house's shape from.
      emitBand(
        roofPos, roofColor, roofUv, [c00, c10, c11, c01], eaveY, eaveY - 0.22,
        rr * 0.68, rg * 0.68, rb * 0.68, ringWinding,
      );
    } else {
      const contour = b.ring.map(([x, z]) => new THREE.Vector2(x, z));
      const holes = b.holes.map((h) => h.map(([x, z]) => new THREE.Vector2(x, z)));
      let faces: number[][];
      try {
        faces = THREE.ShapeUtils.triangulateShape(contour, holes);
      } catch {
        continue; // Self-intersecting footprint; the walls alone still read fine.
      }
      const flat = contour.concat(...holes);
      // A flat roof still has an upstand round its edge — a parapet — and
      // drawing the deck flush with the wall top is what made every block look
      // like a slab cut off with a knife.
      const PARAPET = b.height > 6 ? 0.55 : 0.3;
      const deck = y1 + PARAPET * 0.35;
      for (const face of faces) {
        const a = flat[face[0]];
        const c0 = flat[face[1]];
        const c1 = flat[face[2]];
        if (!a || !c0 || !c1) continue;
        const before = roofPos.length;
        pushTriangle(
          roofPos,
          a.x, deck, a.y,
          c0.x, deck, c0.y,
          c1.x, deck, c1.y,
          true,
        );
        for (let k = 0; k < 3; k++) {
          roofUv.push(roofPos[before + k * 3] / ROOF_UV_M, roofPos[before + k * 3 + 2] / ROOF_UV_M);
        }
        // Roof decks are gravel and bitumen, not the colour of roof tiles.
        for (let k = 0; k < 3; k++) roofColor.push(rr * 0.86, rg * 0.86, rb * 0.86);
      }
      emitBand(
        roofPos, roofColor, roofUv, b.ring, y1 + PARAPET, y1 - 0.05,
        wr * 0.92, wg * 0.92, wb * 0.92, ringWinding,
      );
      // The coping on top of the parapet catches the light along the skyline.
      emitBand(
        roofPos, roofColor, roofUv, b.ring, y1 + PARAPET, y1 + PARAPET - 0.06,
        wr * 1.06, wg * 1.06, wb * 1.06, ringWinding,
      );
    }
  }

  const facade = facadeTexture();
  const lights = windowLightTexture();

  const wallGeom = new THREE.BufferGeometry();
  wallGeom.setAttribute('position', new THREE.Float32BufferAttribute(wallPos, 3));
  wallGeom.setAttribute('uv', new THREE.Float32BufferAttribute(wallUv, 2));
  wallGeom.setAttribute('color', new THREE.Float32BufferAttribute(wallColor, 3));
  wallGeom.computeVertexNormals();
  wallGeom.computeBoundingSphere();

  const wallMat = new THREE.MeshStandardMaterial({
    map: facade,
    emissiveMap: lights,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0,
    vertexColors: true,
    roughness: 0.82,
    metalness: 0.02,
  });

  const roofSkin = roofTexture();

  const roofGeom = new THREE.BufferGeometry();
  roofGeom.setAttribute('position', new THREE.Float32BufferAttribute(roofPos, 3));
  roofGeom.setAttribute('uv', new THREE.Float32BufferAttribute(roofUv, 2));
  roofGeom.setAttribute('color', new THREE.Float32BufferAttribute(roofColor, 3));
  roofGeom.computeVertexNormals();
  roofGeom.computeBoundingSphere();

  const roofMat = new THREE.MeshStandardMaterial({
    map: roofSkin,
    vertexColors: true,
    roughness: 0.95,
    metalness: 0,
  });

  const walls = new THREE.Mesh(wallGeom, wallMat);
  walls.castShadow = true;
  walls.receiveShadow = true;
  walls.name = 'buildings:walls';

  const roofs = new THREE.Mesh(roofGeom, roofMat);
  roofs.castShadow = true;
  roofs.receiveShadow = true;
  roofs.name = 'buildings:roofs';

  return {
    walls,
    roofs,
    setWindowLight(intensity: number) {
      wallMat.emissiveIntensity = intensity;
    },
    dispose() {
      wallGeom.dispose();
      roofGeom.dispose();
      wallMat.dispose();
      roofMat.dispose();
      roofSkin.dispose();
      facade.dispose();
      lights.dispose();
    },
  };
}

/**
 * Spatial index for picking: click the ground, find which footprint you hit.
 * Buildings are not individually raycastable once merged, so this stands in.
 */
export class BuildingIndex {
  private readonly cells = new Map<number, number[]>();
  private readonly size = 60;

  constructor(private readonly buildings: Building[]) {
    buildings.forEach((b, index) => {
      // Register every cell the bounding box touches, not just the centroid,
      // so long buildings are found from either end.
      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      for (const [x, z] of b.ring) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
      }
      for (let cx = Math.floor(minX / this.size); cx <= Math.floor(maxX / this.size); cx++) {
        for (let cz = Math.floor(minZ / this.size); cz <= Math.floor(maxZ / this.size); cz++) {
          const key = (cx + 32768) * 65536 + (cz + 32768);
          let bucket = this.cells.get(key);
          if (!bucket) this.cells.set(key, (bucket = []));
          bucket.push(index);
        }
      }
    });
  }

  at(x: number, z: number): Building | null {
    const key = (Math.floor(x / this.size) + 32768) * 65536 + (Math.floor(z / this.size) + 32768);
    for (const index of this.cells.get(key) ?? []) {
      const b = this.buildings[index];
      if (pointInPolygon([x, z], b.ring)) return b;
    }
    return null;
  }
}

function pointInPolygon(p: Vec2, ring: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
