/**
 * Turning the world into triangles.
 *
 * Nothing here decides anything. The ground knows its heights, the road knows
 * its area and its surface; this asks them and builds the geometry. If a
 * question about *what* is where ever needs answering in this file, it is in
 * the wrong file.
 */

import * as THREE from 'three';
import { triangulate } from '../world/area';
import type { Ground } from '../world/ground';
import type { Road } from '../world/road';

const GRASS = new THREE.Color(0x7d8358);
const ASPHALT = new THREE.Color(0x4c4c50);

/** The ground, as the grid it is. */
export function groundMesh(ground: Ground): THREE.Mesh {
  const n = ground.samples;
  const positions = new Float32Array(n * n * 3);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const i = (r * n + c) * 3;
      const x = ground.coord(c);
      const z = ground.coord(r);
      positions[i] = x;
      positions[i + 1] = ground.heightAt(x, z);
      positions[i + 2] = z;
    }
  }
  // Split each cell 0-1-2 and 0-2-3, the same way `Ground.heightAt` does, so
  // what you can see and what anything standing on it is told are one surface.
  const indices: number[] = [];
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      const a = r * n + c;
      const b = a + 1;
      const d = a + n;
      const e = d + 1;
      indices.push(a, d, b, b, d, e);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    color: GRASS, roughness: 1, metalness: 0, flatShading: false,
  }));
  mesh.receiveShadow = true;
  mesh.name = 'ground';
  return mesh;
}

/**
 * The road surface: its area, triangulated, each vertex given the height the
 * road says it has there.
 *
 * There is no lift, no offset and no polygon-offset trick keeping it above the
 * earth. The earth was pressed to sit below it, so there is nothing to fight.
 */
export function roadMesh(road: Road): THREE.Mesh {
  const flat = triangulate(road.area);
  const positions = new Float32Array(flat.length * 3);
  flat.forEach(([x, z], i) => {
    positions[i * 3] = x;
    positions[i * 3 + 1] = road.heightAt(x, z);
    positions[i * 3 + 2] = z;
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    color: ASPHALT, roughness: 0.95, metalness: 0, side: THREE.DoubleSide,
  }));
  mesh.receiveShadow = true;
  mesh.name = 'road';
  return mesh;
}
