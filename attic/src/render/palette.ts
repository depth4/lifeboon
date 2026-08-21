/**
 * The colours of the ground, and the variation that stops them reading as paint.
 *
 * Two things were wrong before, and they compounded. First, every material was
 * a single flat value: one green for grass, one green for the verge, one grey
 * for pavement, one black for asphalt. Nothing in the real world is one value —
 * turf alone runs through half a dozen tones across a single lawn — and a
 * render that ignores that looks like coloured plastic however good the
 * geometry is. Second, the values were too far apart and too saturated, so the
 * verge beside a road read as a painted stripe rather than as the same ground
 * the road was cut through.
 *
 * The rule here is the opposite of what it was: **little contrast between
 * materials, real variation within each one.** Every ground-like surface —
 * open ground, park, verge, embankment — starts from the same family of tones
 * and is modulated by the same noise field, sampled at the same world
 * position. Two surfaces that meet then share their mottling across the seam
 * instead of announcing it.
 */

import * as THREE from 'three';
import { fbm } from '../core/noise';

/**
 * The ground family. Desaturated, because photographed turf is: the vivid
 * greens that look right on a colour picker read as astroturf in a render.
 */
export const TURF = new THREE.Color(0x7d8358);
export const DRY_TURF = new THREE.Color(0x8e8b66);
export const EARTH = new THREE.Color(0x87765b);
export const ROCK = new THREE.Color(0x7c756b);

/** Land cover, kept deliberately close to the open ground it sits on. */
export const PARK_TURF = new THREE.Color(0x74804f);
export const FOREST_FLOOR = new THREE.Color(0x55663d);
export const MOWN_VERGE = new THREE.Color(0x79814f);
export const SAND = new THREE.Color(0xc4b795);
export const PITCH = new THREE.Color(0x6d7f4b);
export const CEMETERY = new THREE.Color(0x76804f);
export const HARDSTANDING = new THREE.Color(0x77746d);
export const WATER = new THREE.Color(0x3c5f78);

/** Paving. Pale enough to read against asphalt, not a white stripe. */
export const PAVING = new THREE.Color(0x9d998f);
export const KERB_TOP = new THREE.Color(0x918d84);
export const KERB_FACE = new THREE.Color(0x6f6c66);

/**
 * How dry and how mottled the ground is at a point.
 *
 * `dryness` runs at a couple of hundred metres — the scale at which one field
 * is greener than the next. `mottle` runs at tens of metres and is what breaks
 * up a lawn. Both are pure functions of world position, so any surface can ask
 * for them and get an answer that agrees with its neighbours.
 */
export function groundNoise(x: number, z: number): { dryness: number; mottle: number } {
  return {
    // Two scales of dryness rather than one: fields differ from each other at
    // a couple of hundred metres, and within a field the ground is drier on a
    // rise than in a hollow at a few tens of metres. With only the large scale
    // the ground still read as one tone across a whole district.
    dryness: (fbm(x, z, 260) * 0.6 + fbm(x - 1720, z + 640, 74) * 0.4) * 0.5 + 0.5,
    mottle: fbm(x + 4231, z - 991, 26) * 0.7 + fbm(x - 88, z + 305, 8) * 0.3,
  };
}

/**
 * Tint a ground-like colour for its position: drier in some places, mottled
 * everywhere, and darkened where something stands over it.
 *
 * `occlusion` is 0 in the open and 1 tight against a wall. Contact darkening is
 * what makes a building look like it is standing on the ground rather than
 * intersecting it — without it every wall meets the grass along a hard bright
 * line, which is most of why the city looked like a diagram.
 */
export function tintGround(
  out: THREE.Color,
  x: number,
  z: number,
  occlusion = 0,
  dryStrength = 0.42,
): THREE.Color {
  const { dryness, mottle } = groundNoise(x, z);
  out.lerp(DRY_TURF, dryness * dryStrength);
  // Carries the variation the texture no longer does. This is a world-space
  // field, so it never repeats however far the ground runs.
  const shade = 1 + mottle * 0.17 - occlusion * 0.34;
  out.multiplyScalar(Math.max(0.25, shade));
  return out;
}

/** The same treatment for hard surfaces, which vary less but do vary. */
export function tintHard(
  out: THREE.Color,
  x: number,
  z: number,
  occlusion = 0,
): THREE.Color {
  const { mottle } = groundNoise(x, z);
  const shade = 1 + mottle * 0.045 - occlusion * 0.3;
  out.multiplyScalar(Math.max(0.3, shade));
  return out;
}
