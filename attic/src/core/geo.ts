/**
 * Geographic helpers.
 *
 * The simulator works on a city-sized area (a few km across), so instead of a
 * full map projection we drop a local East-North-Up tangent plane at the centre
 * of the loaded area. Distortion at this scale is well under a metre, which is
 * far below anything the renderer or the simulation cares about.
 *
 * World-space convention (three.js, right-handed, Y up):
 *   +X = east, +Y = up, -Z = north.
 */

export interface LatLon {
  lat: number;
  lon: number;
}

export interface BBox {
  south: number;
  west: number;
  north: number;
  east: number;
}

/** Metres per degree of latitude (WGS84 mean, good to ~0.1% anywhere). */
const M_PER_DEG_LAT = 110574;
/** Metres per degree of longitude at the equator. */
const M_PER_DEG_LON_EQ = 111320;

export class Projection {
  readonly originLat: number;
  readonly originLon: number;
  private readonly mPerDegLon: number;

  constructor(originLat: number, originLon: number) {
    this.originLat = originLat;
    this.originLon = originLon;
    this.mPerDegLon = M_PER_DEG_LON_EQ * Math.cos((originLat * Math.PI) / 180);
  }

  static fromBBox(bbox: BBox): Projection {
    return new Projection((bbox.south + bbox.north) / 2, (bbox.west + bbox.east) / 2);
  }

  /** Geographic -> local metres. Returns [x (east), z (south-positive, i.e. -north)]. */
  project(lat: number, lon: number): [number, number] {
    const x = (lon - this.originLon) * this.mPerDegLon;
    const z = -(lat - this.originLat) * M_PER_DEG_LAT;
    return [x, z];
  }

  /** Local metres -> geographic. */
  unproject(x: number, z: number): LatLon {
    return {
      lat: this.originLat - z / M_PER_DEG_LAT,
      lon: this.originLon + x / this.mPerDegLon,
    };
  }
}

/** Great-circle-ish distance in metres between two points (flat-earth, city scale). */
export function metresBetween(a: LatLon, b: LatLon): number {
  const midLat = ((a.lat + b.lat) / 2) * (Math.PI / 180);
  const dx = (b.lon - a.lon) * M_PER_DEG_LON_EQ * Math.cos(midLat);
  const dy = (b.lat - a.lat) * M_PER_DEG_LAT;
  return Math.hypot(dx, dy);
}

/** Build a bbox of the given radius (metres) around a point. */
export function bboxAround(centre: LatLon, radiusM: number): BBox {
  const dLat = radiusM / M_PER_DEG_LAT;
  const dLon = radiusM / (M_PER_DEG_LON_EQ * Math.cos((centre.lat * Math.PI) / 180));
  return {
    south: centre.lat - dLat,
    west: centre.lon - dLon,
    north: centre.lat + dLat,
    east: centre.lon + dLon,
  };
}

/** Approximate width/height of a bbox in metres. */
export function bboxSizeM(bbox: BBox): { width: number; height: number } {
  const midLat = ((bbox.south + bbox.north) / 2) * (Math.PI / 180);
  return {
    width: (bbox.east - bbox.west) * M_PER_DEG_LON_EQ * Math.cos(midLat),
    height: (bbox.north - bbox.south) * M_PER_DEG_LAT,
  };
}

/** Signed area of a closed ring in projected metres (positive = counter-clockwise). */
export function ringArea(points: Array<[number, number]>): number {
  let sum = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    sum += (points[j][0] - points[i][0]) * (points[j][1] + points[i][1]);
  }
  return sum / 2;
}

/** Centroid of a closed ring; falls back to the vertex average for degenerate rings. */
export function ringCentroid(points: Array<[number, number]>): [number, number] {
  let cx = 0;
  let cy = 0;
  let area = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const cross = points[j][0] * points[i][1] - points[i][0] * points[j][1];
    area += cross;
    cx += (points[j][0] + points[i][0]) * cross;
    cy += (points[j][1] + points[i][1]) * cross;
  }
  area /= 2;
  if (Math.abs(area) < 1e-6) {
    let sx = 0;
    let sy = 0;
    for (const p of points) {
      sx += p[0];
      sy += p[1];
    }
    return [sx / points.length, sy / points.length];
  }
  return [cx / (6 * area), cy / (6 * area)];
}
