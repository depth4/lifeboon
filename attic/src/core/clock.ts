/**
 * Simulation clock.
 *
 * Tracks an in-world date/time that advances faster than wall-clock time, and
 * derives the sun position that drives lighting and the sky.
 */

export const SECONDS_PER_DAY = 86400;

export class SimClock {
  /** Seconds elapsed since the start of the simulated day 0. */
  private elapsed: number;
  /** In-world seconds per real second. */
  timeScale: number;
  paused = false;

  /** Latitude the sun is computed for; set when a place is loaded. */
  latitude = 50;
  /** Day of the year (0-364), affects the sun's declination. */
  dayOfYear = 172;

  constructor(startHour = 7, timeScale = 120) {
    this.elapsed = startHour * 3600;
    this.timeScale = timeScale;
  }

  advance(realDeltaSeconds: number): number {
    if (this.paused) return 0;
    // Cap the step so a tab that was backgrounded does not teleport the world.
    const step = Math.min(realDeltaSeconds, 0.25) * this.timeScale;
    this.elapsed += step;
    return step;
  }

  get totalSeconds(): number {
    return this.elapsed;
  }

  /** Seconds since local midnight. */
  get secondsOfDay(): number {
    return ((this.elapsed % SECONDS_PER_DAY) + SECONDS_PER_DAY) % SECONDS_PER_DAY;
  }

  /** Hours since local midnight, fractional. */
  get hour(): number {
    return this.secondsOfDay / 3600;
  }

  get day(): number {
    return Math.floor(this.elapsed / SECONDS_PER_DAY);
  }

  get weekday(): number {
    return this.day % 7;
  }

  get isWeekend(): boolean {
    return this.weekday >= 5;
  }

  setHour(hour: number): void {
    this.elapsed = this.day * SECONDS_PER_DAY + hour * 3600;
  }

  formatTime(): string {
    const h = Math.floor(this.hour);
    const m = Math.floor((this.hour - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  formatDay(): string {
    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return `${names[this.weekday]} · day ${this.day + 1}`;
  }

  /**
   * Sun direction as a unit vector in world space (+X east, +Y up, -Z north).
   * A standard solar-position approximation: good enough that shadows fall the
   * right way and the golden hour lands at a believable time.
   */
  sunDirection(): { x: number; y: number; z: number; altitude: number } {
    const latRad = (this.latitude * Math.PI) / 180;
    // Solar declination over the year.
    const decl = 0.409 * Math.sin((2 * Math.PI * (this.dayOfYear - 81)) / 365);
    // Hour angle: zero at solar noon, +/- pi at midnight.
    const hourAngle = ((this.hour - 12) / 12) * Math.PI;

    const sinAlt =
      Math.sin(latRad) * Math.sin(decl) + Math.cos(latRad) * Math.cos(decl) * Math.cos(hourAngle);
    const altitude = Math.asin(Math.max(-1, Math.min(1, sinAlt)));

    const cosAz =
      (Math.sin(decl) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * Math.cos(altitude) || 1e-6);
    let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAz)));
    // Before solar noon the sun is in the east.
    if (hourAngle > 0) azimuth = 2 * Math.PI - azimuth;

    // Azimuth is measured from north, clockwise through east.
    return {
      x: Math.cos(altitude) * Math.sin(azimuth),
      y: Math.sin(altitude),
      z: -Math.cos(altitude) * Math.cos(azimuth),
      altitude,
    };
  }
}
