/**
 * Seeded pseudo-random numbers.
 *
 * Everything the simulator invents (which building somebody lives in, the shade
 * of a roof, where a tree stands) is derived from a seed so that reloading the
 * same place gives the same city back.
 */
export class Rng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0 || 1;
  }

  /** mulberry32 — small, fast, good enough for scenery and behaviour. */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(min: number, maxExclusive: number): number {
    return Math.floor(this.range(min, maxExclusive));
  }

  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }

  chance(p: number): boolean {
    return this.next() < p;
  }

  /** Roughly normal via the central limit theorem; clamped to +/- 3 sigma. */
  gaussian(mean: number, stdDev: number): number {
    const u = this.next() + this.next() + this.next() + this.next() - 2;
    return mean + Math.max(-3, Math.min(3, u * 1.4142)) * stdDev;
  }
}

/** Stable string -> 32-bit seed, so a place name always yields the same city. */
export function hashString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
