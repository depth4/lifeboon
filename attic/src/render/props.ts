/**
 * Street furniture: trees in the green spaces and lamps along the pavements.
 *
 * Both are instanced. The lamps carry no real light source — a few thousand
 * point lights would cost more than the rest of the scene put together — they
 * are emissive heads that come on with the night factor, which at street level
 * is indistinguishable from the real thing.
 */

import * as THREE from 'three';
import { Rng } from '../core/rng';
import { fbm } from '../core/noise';
import type { Road, Vec2 } from '../world/types';
import type { Terrain } from '../terrain/heightfield';
import type { OcclusionField } from './occlusion';

export interface Props {
  group: THREE.Group;
  setNight(nightFactor: number): void;
  dispose(): void;
}

const CANOPY_COLORS = [0x47603a, 0x4f6a3d, 0x3e5636, 0x586f43, 0x3b5540, 0x5f6c42];

/**
 * A canopy that is not a ball.
 *
 * One smooth sphere per tree reads as a lollipop from any distance, and a
 * street of lollipops is worse than no trees at all. Three overlapping lobes
 * with their vertices pushed about give a silhouette that breaks up, and
 * because every tree is one instance of the same geometry it still costs a
 * single draw call for the whole city.
 */
function canopyGeometry(): THREE.BufferGeometry {
  // [x, y, z, radius, subdivision]. Only the main lobe is subdivided: at six
  // thousand trees a canopy costs its triangle count six thousand times over,
  // and three subdivided lobes came to 540 triangles each — 3.6 million for
  // the trees alone, measured, against 750 thousand for the entire rest of the
  // city. One rounded lobe with two coarse ones beside it reads the same from
  // any distance you would look from and costs a fifth as much.
  const lobes: Array<[number, number, number, number, number]> = [
    [0, 0.25, 0, 1, 1],
    [0.52, -0.32, 0.18, 0.72, 0],
    [-0.44, -0.18, -0.4, 0.64, 0],
  ];
  const chunks: Float32Array[] = [];
  let seed = 0x2545f491;
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (const [ox, oy, oz, r, detail] of lobes) {
    const g = new THREE.IcosahedronGeometry(r, detail).toNonIndexed();
    const pos = g.getAttribute('position') as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      const k = 0.82 + rand() * 0.4;
      arr[i] = arr[i] * k + ox;
      arr[i + 1] = arr[i + 1] * k * 1.12 + oy;
      arr[i + 2] = arr[i + 2] * k + oz;
    }
    chunks.push(arr.slice());
    g.dispose();
  }

  const total = chunks.reduce((n, c) => n + c.length, 0);
  const merged = new Float32Array(total);
  let at = 0;
  for (const c of chunks) {
    merged.set(c, at);
    at += c.length;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(merged, 3));
  geom.computeVertexNormals();
  return geom;
}

export interface TreeSpot {
  x: number;
  z: number;
  scale: number;
}

export function buildProps(
  treeSpots: TreeSpot[],
  roads: Road[],
  seed: number,
  terrain: Terrain,
  radius = 900,
  occlusion: OcclusionField | null = null,
  maxTrees = 20000,
): Props {
  const group = new THREE.Group();
  group.name = 'props';
  const rng = new Rng(seed ^ 0x5bf03635);
  const disposables: Array<{ dispose(): void }> = [];

  /* --------------------------------------------------------------- trees */
  // Everything the map named, plus everything it did not.
  //
  // OpenStreetMap records parks and woodland and almost no individual trees,
  // so a city drawn only from the data has bare ground between its buildings
  // — which is not what any inhabited place looks like. Where the ground is
  // neither built on nor paved, trees and scrub go in at a density the noise
  // field decides, so some yards are wooded and some are open.
  const all = treeSpots.concat(scatterFreeGround(radius, occlusion, rng));
  const trees = all.length > maxTrees ? thinOut(all, maxTrees, rng) : all;

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  if (trees.length) {
    const trunkGeom = new THREE.CylinderGeometry(0.11, 0.22, 2.8, 6);
    trunkGeom.translate(0, 1.4, 0);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x54443a, roughness: 1 });
    const trunks = new THREE.InstancedMesh(trunkGeom, trunkMat, trees.length);

    const canopyGeom = canopyGeometry();
    canopyGeom.scale(1.9, 1.9, 1.9);
    canopyGeom.translate(0, 4.1, 0);
    const canopyMat = new THREE.MeshStandardMaterial({ roughness: 0.98, flatShading: true });
    const canopies = new THREE.InstancedMesh(canopyGeom, canopyMat, trees.length);

    trees.forEach((spot, i) => {
      dummy.position.set(spot.x, terrain.heightAt(spot.x, spot.z), spot.z);
      dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
      dummy.scale.setScalar(spot.scale);
      dummy.updateMatrix();
      trunks.setMatrixAt(i, dummy.matrix);
      canopies.setMatrixAt(i, dummy.matrix);
      color.set(rng.pick(CANOPY_COLORS));
      color.offsetHSL(rng.range(-0.02, 0.02), rng.range(-0.06, 0.04), rng.range(-0.07, 0.07));
      canopies.setColorAt(i, color);
    });

    trunks.castShadow = true;
    canopies.castShadow = true;
    canopies.receiveShadow = true;
    trunks.name = 'props:trunks';
    canopies.name = 'props:canopies';
    group.add(trunks, canopies);
    disposables.push(trunkGeom, trunkMat, canopyGeom, canopyMat, trunks, canopies);
  }

  /* --------------------------------------------------------------- lamps */
  const lampPositions = lampSpots(roads, rng);
  let headMat: THREE.MeshStandardMaterial | null = null;

  if (lampPositions.length) {
    const poleGeom = new THREE.CylinderGeometry(0.06, 0.09, 4.6, 5);
    poleGeom.translate(0, 2.3, 0);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x3a3d42, roughness: 0.7, metalness: 0.4 });
    const poles = new THREE.InstancedMesh(poleGeom, poleMat, lampPositions.length);

    const headGeom = new THREE.SphereGeometry(0.19, 8, 6);
    headGeom.translate(0, 4.6, 0);
    headMat = new THREE.MeshStandardMaterial({
      color: 0x2c2e33,
      emissive: new THREE.Color(0xffd9a0),
      emissiveIntensity: 0,
      roughness: 0.5,
    });
    const heads = new THREE.InstancedMesh(headGeom, headMat, lampPositions.length);

    lampPositions.forEach((p, i) => {
      dummy.position.set(p[0], terrain.heightAt(p[0], p[1]), p[1]);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      poles.setMatrixAt(i, dummy.matrix);
      heads.setMatrixAt(i, dummy.matrix);
    });

    poles.castShadow = true;
    poles.name = 'props:lamp-poles';
    heads.name = 'props:lamp-heads';
    group.add(poles, heads);
    disposables.push(poleGeom, poleMat, poles, headGeom, headMat, heads);
  }

  return {
    group,
    setNight(nightFactor: number) {
      if (headMat) headMat.emissiveIntensity = nightFactor * 3.2;
    },
    dispose() {
      for (const d of disposables) d.dispose();
    },
  };
}

/** Evenly spaced lamps down the pavement side of ordinary streets. */
function lampSpots(roads: Road[], rng: Rng): Vec2[] {
  const SPACING = 32;
  const spots: Vec2[] = [];

  for (const road of roads) {
    if (!road.drivable || road.cls === 'service' || road.cls === 'motorway') continue;
    if (road.layer !== 0) continue;
    const offset = road.width / 2 + 1.1;

    let carry = rng.range(0, SPACING);
    for (let i = 0; i < road.points.length - 1; i++) {
      const [x0, z0] = road.points[i];
      const [x1, z1] = road.points[i + 1];
      const dx = x1 - x0;
      const dz = z1 - z0;
      const len = Math.hypot(dx, dz);
      if (len < 0.01) continue;
      const nx = dz / len;
      const nz = -dx / len;

      let t = carry;
      while (t < len) {
        const f = t / len;
        spots.push([x0 + dx * f + nx * offset, z0 + dz * f + nz * offset]);
        t += SPACING;
      }
      carry = t - len;
    }
    if (spots.length > 20000) break;
  }
  return spots;
}

/**
 * Trees on ground that nothing else has claimed.
 *
 * The grid is jittered rather than regular, because a regular one shows
 * through as rows however dense it is, and the density comes from the same
 * kind of noise field the ground colour does — so a wooded corner of a block
 * is wooded in both.
 */
function scatterFreeGround(
  radius: number,
  occlusion: OcclusionField | null,
  rng: Rng,
): TreeSpot[] {
  const out: TreeSpot[] = [];
  if (!occlusion) return out;

  const STEP = 9;
  for (let z = -radius; z <= radius; z += STEP) {
    for (let x = -radius; x <= radius; x += STEP) {
      const px = x + rng.range(-STEP * 0.45, STEP * 0.45);
      const pz = z + rng.range(-STEP * 0.45, STEP * 0.45);
      if (px * px + pz * pz > radius * radius) continue;
      if (occlusion.isBlocked(px, pz)) continue;
      // 0 in the open parts of a block, up towards 1 in its corners.
      const density = fbm(px + 3300, pz - 1200, 95) * 0.5 + 0.5;
      if (rng.next() > density * 0.62) continue;
      out.push({ x: px, z: pz, scale: 0.7 + rng.next() * 0.85 });
    }
  }
  return out;
}

/** Uniformly drop items to fit a budget, keeping the distribution even. */
function thinOut<T>(items: T[], limit: number, rng: Rng): T[] {
  const keep = limit / items.length;
  const out: T[] = [];
  for (const item of items) {
    if (rng.next() < keep) out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}
