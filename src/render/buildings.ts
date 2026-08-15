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
import { facadeTexture, windowLightTexture, TILE_METRES } from './textures';

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

export function buildBuildingMeshes(buildings: Building[]): BuildingMeshes {
  const wallPos: number[] = [];
  const wallUv: number[] = [];
  const wallColor: number[] = [];

  const roofPos: number[] = [];
  const roofColor: number[] = [];

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

    const y0 = b.minHeight;
    const y1 = b.height;

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
        const v0 = y0 / TILE_METRES;
        const v1 = y1 / TILE_METRES;
        travelled += len;

        // A = bottom p0, B = bottom p1, C = top p1, D = top p0.
        // (A, C, B) and (A, D, C) wind outward for this ring orientation.
        wallPos.push(
          p0[0], y0, p0[1], p1[0], y1, p1[1], p1[0], y0, p1[1],
          p0[0], y0, p0[1], p0[0], y1, p0[1], p1[0], y1, p1[1],
        );
        wallUv.push(u0, v0, u1, v1, u1, v0, u0, v0, u0, v1, u1, v1);
        for (let k = 0; k < 6; k++) wallColor.push(wr, wg, wb);
      }
    }

    // --- roof ------------------------------------------------------------
    const contour = b.ring.map(([x, z]) => new THREE.Vector2(x, z));
    const holes = b.holes.map((h) => h.map(([x, z]) => new THREE.Vector2(x, z)));
    let faces: number[][];
    try {
      faces = THREE.ShapeUtils.triangulateShape(contour, holes);
    } catch {
      continue; // Self-intersecting footprint; the walls alone still read fine.
    }
    const flat = contour.concat(...holes);
    for (const face of faces) {
      const a = flat[face[0]];
      const c0 = flat[face[1]];
      const c1 = flat[face[2]];
      if (!a || !c0 || !c1) continue;
      pushTriangle(
        roofPos,
        a.x, y1, a.y,
        c0.x, y1, c0.y,
        c1.x, y1, c1.y,
        true,
      );
      for (let k = 0; k < 3; k++) roofColor.push(rr, rg, rb);
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

  const roofGeom = new THREE.BufferGeometry();
  roofGeom.setAttribute('position', new THREE.Float32BufferAttribute(roofPos, 3));
  roofGeom.setAttribute('color', new THREE.Float32BufferAttribute(roofColor, 3));
  roofGeom.computeVertexNormals();
  roofGeom.computeBoundingSphere();

  const roofMat = new THREE.MeshStandardMaterial({
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
