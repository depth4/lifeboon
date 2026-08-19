/**
 * Deterministic value noise.
 *
 * Every natural surface varies at several scales at once, and a renderer that
 * paints each material as one flat colour reads as plastic no matter how good
 * the geometry underneath is. This is the cheapest way to get that variation:
 * hashed value noise, so it costs no memory, needs no texture, and gives the
 * same landscape every time the same city loads.
 *
 * Shared rather than duplicated because the ground, the verge beside a road
 * and the invented land beyond the city all have to agree — a grass verge
 * whose colour is computed differently from the grass it borders shows up as
 * a painted stripe, which is exactly what it looked like.
 */

export function hash2(ix: number, iz: number): number {
  let h = Math.imul(ix, 374761393) + Math.imul(iz, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Smooth value noise in [0, 1] at the given wavelength in metres. */
export function valueNoise(x: number, z: number, wavelength: number): number {
  const fx = x / wavelength;
  const fz = z / wavelength;
  const ix = Math.floor(fx);
  const iz = Math.floor(fz);
  let tx = fx - ix;
  let tz = fz - iz;
  // Smoothstep, or the lattice the noise was built on shows as a grid of creases.
  tx = tx * tx * (3 - 2 * tx);
  tz = tz * tz * (3 - 2 * tz);

  const a = hash2(ix, iz);
  const b = hash2(ix + 1, iz);
  const c = hash2(ix, iz + 1);
  const d = hash2(ix + 1, iz + 1);
  const top = a + (b - a) * tx;
  const bottom = c + (d - c) * tx;
  return top + (bottom - top) * tz;
}

/** Three octaves of rolling variation, centred on zero, in [-1, 1]. */
export function fbm(x: number, z: number, baseWavelength = 1400): number {
  const n =
    valueNoise(x, z, baseWavelength) * 0.55 +
    valueNoise(x + 811, z - 517, baseWavelength * 0.37) * 0.3 +
    valueNoise(x - 233, z + 907, baseWavelength * 0.136) * 0.15;
  return n * 2 - 1;
}
