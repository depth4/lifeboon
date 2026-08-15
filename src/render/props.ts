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
import type { Road, Vec2 } from '../world/types';

export interface Props {
  group: THREE.Group;
  setNight(nightFactor: number): void;
  dispose(): void;
}

const CANOPY_COLORS = [0x4e7a3a, 0x5c8a42, 0x436b34, 0x6b9450, 0x3f6b46];

export interface TreeSpot {
  x: number;
  z: number;
  scale: number;
}

export function buildProps(
  treeSpots: TreeSpot[],
  roads: Road[],
  seed: number,
  maxTrees = 12000,
): Props {
  const group = new THREE.Group();
  group.name = 'props';
  const rng = new Rng(seed ^ 0x5bf03635);
  const disposables: Array<{ dispose(): void }> = [];

  /* --------------------------------------------------------------- trees */
  const trees = treeSpots.length > maxTrees
    ? thinOut(treeSpots, maxTrees, rng)
    : treeSpots;

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  if (trees.length) {
    const trunkGeom = new THREE.CylinderGeometry(0.13, 0.2, 2.4, 5);
    trunkGeom.translate(0, 1.2, 0);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5b463a, roughness: 1 });
    const trunks = new THREE.InstancedMesh(trunkGeom, trunkMat, trees.length);

    const canopyGeom = new THREE.IcosahedronGeometry(1.7, 0);
    canopyGeom.scale(1, 1.15, 1);
    canopyGeom.translate(0, 3.5, 0);
    const canopyMat = new THREE.MeshStandardMaterial({ roughness: 0.95, flatShading: true });
    const canopies = new THREE.InstancedMesh(canopyGeom, canopyMat, trees.length);

    trees.forEach((spot, i) => {
      dummy.position.set(spot.x, 0, spot.z);
      dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
      dummy.scale.setScalar(spot.scale);
      dummy.updateMatrix();
      trunks.setMatrixAt(i, dummy.matrix);
      canopies.setMatrixAt(i, dummy.matrix);
      color.set(rng.pick(CANOPY_COLORS));
      color.offsetHSL(0, 0, rng.range(-0.05, 0.05));
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
      dummy.position.set(p[0], 0, p[1]);
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
