/**
 * Turning an Overpass response into the world model.
 *
 * The interesting parts are ring assembly for multipolygon relations (OSM
 * hands you a bag of unordered way fragments and expects you to stitch them)
 * and matching point-of-interest nodes to the building they sit in.
 */

import type { BBox } from '../core/geo';
import { Projection, bboxSizeM, ringArea, ringCentroid } from '../core/geo';
import { hashString } from '../core/rng';
import type {
  AreaFeature,
  Building,
  DataAudit,
  Poi,
  Railway,
  Road,
  Vec2,
  World,
} from '../world/types';
import type { Terrain } from '../terrain/heightfield';
import { FlatTerrain } from '../terrain/heightfield';
import type { OverpassElement, OverpassResponse } from './overpass';
import {
  areaKind,
  buildingCapacity,
  buildingHeight,
  buildingKind,
  isCrossing,
  isDrivable,
  isSidewalkLine,
  isWalkable,
  parseHeight,
  poiKind,
  railKind,
  railTracks,
  roadClass,
  roadWidth,
  sidewalkTag,
  type Tags,
} from './tags';

export const OSM_ATTRIBUTION = '© OpenStreetMap contributors (ODbL)';

type Ring = Vec2[];

/** Drop the duplicated closing vertex OSM includes on closed ways. */
function normaliseRing(ring: Ring): Ring {
  if (ring.length < 3) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (Math.abs(first[0] - last[0]) < 1e-6 && Math.abs(first[1] - last[1]) < 1e-6) {
    return ring.slice(0, -1);
  }
  return ring;
}

function isClosed(geom: Array<{ lat: number; lon: number }>): boolean {
  if (geom.length < 4) return false;
  const a = geom[0];
  const b = geom[geom.length - 1];
  return Math.abs(a.lat - b.lat) < 1e-9 && Math.abs(a.lon - b.lon) < 1e-9;
}

function projectGeometry(
  geom: Array<{ lat: number; lon: number }>,
  proj: Projection,
): Vec2[] {
  const out: Vec2[] = new Array(geom.length);
  for (let i = 0; i < geom.length; i++) {
    out[i] = proj.project(geom[i].lat, geom[i].lon);
  }
  return out;
}

/** Force a ring to the requested winding. */
function orient(ring: Ring, counterClockwise: boolean): Ring {
  const ccw = ringArea(ring) > 0;
  return ccw === counterClockwise ? ring : ring.slice().reverse();
}

/**
 * Stitch relation member ways into closed rings.
 *
 * Members arrive as open fragments in arbitrary order and direction. We walk
 * them greedily, joining whichever fragment starts or ends near the current
 * open end, and close a ring when we return to where we started.
 */
function assembleRings(fragments: Vec2[][]): Ring[] {
  const TOLERANCE = 0.5; // metres
  const pending = fragments.filter((f) => f.length >= 2).map((f) => f.slice());
  const rings: Ring[] = [];

  const near = (a: Vec2, b: Vec2) => Math.hypot(a[0] - b[0], a[1] - b[1]) < TOLERANCE;

  while (pending.length) {
    let current = pending.pop()!;
    let joined = true;
    while (joined && !near(current[0], current[current.length - 1])) {
      joined = false;
      for (let i = 0; i < pending.length; i++) {
        const frag = pending[i];
        const tail = current[current.length - 1];
        if (near(tail, frag[0])) {
          current = current.concat(frag.slice(1));
        } else if (near(tail, frag[frag.length - 1])) {
          current = current.concat(frag.slice(0, -1).reverse());
        } else if (near(current[0], frag[frag.length - 1])) {
          current = frag.slice(0, -1).concat(current);
        } else if (near(current[0], frag[0])) {
          current = frag.slice(1).reverse().concat(current);
        } else {
          continue;
        }
        pending.splice(i, 1);
        joined = true;
        break;
      }
    }
    const ring = normaliseRing(current);
    if (ring.length >= 3) rings.push(ring);
  }

  return rings;
}

/** Classic ray-casting point-in-polygon. */
export function pointInRing(p: Vec2, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

interface Accumulator {
  buildings: Building[];
  roads: Road[];
  railways: Railway[];
  areas: AreaFeature[];
  poiSeeds: Array<{ id: string; position: Vec2; kind: NonNullable<ReturnType<typeof poiKind>> }>;
  /** Coverage counters, gathered while parsing rather than re-derived later. */
  buildingsWithHeight: number;
  buildingsWithLevels: number;
  crossingNodes: number;
}

function addBuilding(
  acc: Accumulator,
  id: string,
  outer: Ring,
  holes: Ring[],
  tags: Tags,
): Building | undefined {
  const ring = orient(outer, true);
  const area = Math.abs(ringArea(ring));
  // Sub-8 m² outlines are almost always bins, kiosks or mapping noise.
  if (area < 8 || ring.length < 3) return undefined;

  const kind = buildingKind(tags);
  const { height, minHeight, levels } = buildingHeight(tags, kind, area);

  // Track where the height came from, so the UI can be honest about coverage.
  if (parseHeight(tags.height) ?? parseHeight(tags['building:height'])) {
    acc.buildingsWithHeight++;
  } else if (tags['building:levels'] || tags.levels) {
    acc.buildingsWithLevels++;
  }

  const building: Building = {
    id,
    ring,
    holes: holes.map((h) => orient(h, false)),
    height,
    minHeight,
    levels,
    kind,
    centroid: ringCentroid(ring),
    area,
    capacity: buildingCapacity(kind, area, levels),
    variation: (hashString(id) % 1000) / 1000,
  };
  acc.buildings.push(building);
  return building;
}

function addArea(acc: Accumulator, id: string, outer: Ring, holes: Ring[], tags: Tags): void {
  const info = areaKind(tags);
  if (!info) return;
  const ring = orient(outer, true);
  if (ring.length < 3 || Math.abs(ringArea(ring)) < 20) return;
  acc.areas.push({
    id,
    ring,
    holes: holes.map((h) => orient(h, false)),
    kind: info.kind,
    priority: info.priority,
  });
}

function handleWay(el: OverpassElement, proj: Projection, acc: Accumulator): void {
  const tags = el.tags ?? {};
  const geom = el.geometry;
  if (!geom || geom.length < 2) return;

  const rail = railKind(tags);
  if (rail) {
    acc.railways.push({
      id: `w${el.id}`,
      points: projectGeometry(geom, proj),
      kind: rail,
      tracks: railTracks(tags),
      layer: parseInt(tags.layer ?? '0', 10) || 0,
      bridge: !!tags.bridge && tags.bridge !== 'no',
      tunnel: !!tags.tunnel && tags.tunnel !== 'no',
    });
    return;
  }

  const cls = roadClass(tags);
  if (cls) {
    const { width, lanes } = roadWidth(tags, cls);
    const points = projectGeometry(geom, proj);
    acc.roads.push({
      id: `w${el.id}`,
      points,
      cls,
      width,
      lanes,
      oneway: tags.oneway === 'yes' || tags.oneway === '1' || tags.junction === 'roundabout',
      layer: parseInt(tags.layer ?? '0', 10) || 0,
      bridge: !!tags.bridge && tags.bridge !== 'no',
      tunnel: !!tags.tunnel && tags.tunnel !== 'no',
      name: tags.name,
      walkable: isWalkable(cls, tags),
      drivable: isDrivable(cls, tags),
      sidewalk: sidewalkTag(tags),
      isSidewalkLine: isSidewalkLine(tags),
      isCrossing: isCrossing(tags),
    });
    return;
  }

  if (!isClosed(geom)) return;
  const ring = normaliseRing(projectGeometry(geom, proj));
  if (ring.length < 3) return;

  if (tags.building) {
    const b = addBuilding(acc, `w${el.id}`, ring, [], tags);
    // A shop or amenity mapped on the building outline is a POI at its door.
    const kind = b ? poiKind(tags) : undefined;
    if (b && kind) acc.poiSeeds.push({ id: `w${el.id}p`, position: b.centroid, kind });
    return;
  }

  addArea(acc, `w${el.id}`, ring, [], tags);
}

function handleRelation(el: OverpassElement, proj: Projection, acc: Accumulator): void {
  const tags = el.tags ?? {};
  const members = el.members;
  if (!members?.length) return;

  const outerFragments: Vec2[][] = [];
  const innerFragments: Vec2[][] = [];
  for (const m of members) {
    if (m.type !== 'way' || !m.geometry || m.geometry.length < 2) continue;
    const pts = projectGeometry(m.geometry, proj);
    if (m.role === 'inner') innerFragments.push(pts);
    else outerFragments.push(pts);
  }

  const outers = assembleRings(outerFragments);
  const inners = assembleRings(innerFragments);
  if (!outers.length) return;

  // Assign each hole to the outer ring that contains it.
  for (let i = 0; i < outers.length; i++) {
    const outer = outers[i];
    const holes = inners.filter((h) => pointInRing(h[0], outer));
    const id = `r${el.id}${i > 0 ? `_${i}` : ''}`;
    if (tags.building) addBuilding(acc, id, outer, holes, tags);
    else addArea(acc, id, outer, holes, tags);
  }
}

function handleNode(el: OverpassElement, proj: Projection, acc: Accumulator): void {
  if (el.lat === undefined || el.lon === undefined) return;
  const tags = el.tags ?? {};
  if (tags.highway === 'crossing') {
    acc.crossingNodes++;
    return;
  }
  const kind = poiKind(tags);
  if (!kind) return;
  acc.poiSeeds.push({ id: `n${el.id}`, position: proj.project(el.lat, el.lon), kind });
}

/**
 * Link POIs to buildings. A POI inside a footprint belongs to it; one just
 * outside (a mapped entrance, a pavement kiosk) attaches to the nearest
 * building within 25 m so agents have somewhere to walk to.
 */
function attachPois(
  seeds: Accumulator['poiSeeds'],
  buildings: Building[],
): Poi[] {
  const pois: Poi[] = [];
  // Coarse grid so we do not test every POI against every building.
  const CELL = 60;
  const grid = new Map<string, Building[]>();
  const cellKey = (x: number, z: number) => `${Math.floor(x / CELL)}:${Math.floor(z / CELL)}`;
  for (const b of buildings) {
    const key = cellKey(b.centroid[0], b.centroid[1]);
    let bucket = grid.get(key);
    if (!bucket) grid.set(key, (bucket = []));
    bucket.push(b);
  }

  for (const seed of seeds) {
    const [x, z] = seed.position;
    let contained: Building | undefined;
    let nearest: Building | undefined;
    let bestDist = 25;
    const cx = Math.floor(x / CELL);
    const cz = Math.floor(z / CELL);

    search: for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        for (const b of grid.get(`${cx + dx}:${cz + dz}`) ?? []) {
          if (pointInRing(seed.position, b.ring)) {
            contained = b;
            break search;
          }
          const d = Math.hypot(b.centroid[0] - x, b.centroid[1] - z);
          if (d < bestDist) {
            bestDist = d;
            nearest = b;
          }
        }
      }
    }

    const match = contained ?? nearest;
    pois.push({
      id: seed.id,
      position: seed.position,
      kind: seed.kind,
      buildingId: match?.id,
      nodeIndex: -1,
    });
  }
  return pois;
}

export function parseOsm(
  response: OverpassResponse,
  bbox: BBox,
  placeName: string,
  terrain: Terrain = new FlatTerrain(),
): World {
  const proj = Projection.fromBBox(bbox);
  const acc: Accumulator = {
    buildings: [], roads: [], railways: [], areas: [], poiSeeds: [],
    buildingsWithHeight: 0, buildingsWithLevels: 0, crossingNodes: 0,
  };

  for (const el of response.elements) {
    switch (el.type) {
      case 'way':
        handleWay(el, proj, acc);
        break;
      case 'relation':
        handleRelation(el, proj, acc);
        break;
      case 'node':
        handleNode(el, proj, acc);
        break;
    }
  }

  // Paint big ground cover first so parks sit on top of woodland, and so on.
  acc.areas.sort((a, b) => a.priority - b.priority || Math.abs(ringArea(b.ring)) - Math.abs(ringArea(a.ring)));

  const pois = attachPois(acc.poiSeeds, acc.buildings);

  const size = bboxSizeM(bbox);
  const radius = Math.max(size.width, size.height) / 2;

  const audit = buildAudit(acc, pois.length);
  const roadLength =
    acc.roads.reduce((sum, r) => sum + polylineLength(r.points), 0);

  return {
    buildings: acc.buildings,
    roads: acc.roads,
    railways: acc.railways,
    areas: acc.areas,
    pois,
    audit,
    terrain,
    radius,
    seed: hashString(`${bbox.south.toFixed(4)},${bbox.west.toFixed(4)}`),
    stats: {
      buildings: acc.buildings.length,
      roads: acc.roads.length,
      roadLengthKm: roadLength / 1000,
      areas: acc.areas.length,
      pois: pois.length,
      source: 'osm',
      placeName,
      attribution: OSM_ATTRIBUTION,
    },
  };
}

function polylineLength(points: Vec2[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  return total;
}

/**
 * Summarise what the map actually contained.
 *
 * Deliberately reports "unsurveyed" separately from "surveyed as absent" for
 * pavements, because conflating the two is what makes a thinly-mapped town
 * look like a town with no pavements.
 */
function buildAudit(acc: Accumulator, poisTotal: number): DataAudit {
  let roadKmDrivable = 0;
  let roadKmFootway = 0;
  let streetsTotal = 0;
  let streetsWithSidewalkTag = 0;
  let sidewalkYes = 0;
  let sidewalkNo = 0;
  let crossingWays = 0;

  for (const road of acc.roads) {
    const km = polylineLength(road.points) / 1000;
    if (road.isCrossing) crossingWays++;

    if (road.drivable) {
      roadKmDrivable += km;
      // Only streets that could plausibly have a pavement are worth counting.
      if (road.cls !== 'service' && road.cls !== 'motorway' && road.cls !== 'trunk') {
        streetsTotal++;
        if (road.sidewalk) {
          streetsWithSidewalkTag++;
          if (road.sidewalk === 'no') sidewalkNo++;
          else if (road.sidewalk !== 'separate') sidewalkYes++;
        }
      }
    } else if (road.cls === 'footway' || road.cls === 'pedestrian' || road.cls === 'steps') {
      roadKmFootway += km;
    }
  }

  // Trams are reported separately: in a city with a tram network they
  // dominate the total, and reading that as "100 km of railway" is misleading.
  let railwayKm = 0;
  let tramKm = 0;
  for (const line of acc.railways) {
    const km = polylineLength(line.points) / 1000;
    if (line.kind === 'tram') tramKm += km;
    else railwayKm += km;
  }

  return {
    buildingsTotal: acc.buildings.length,
    buildingsWithHeight: acc.buildingsWithHeight,
    buildingsWithLevels: acc.buildingsWithLevels,
    buildingsGuessed:
      acc.buildings.length - acc.buildingsWithHeight - acc.buildingsWithLevels,
    roadKmDrivable,
    roadKmFootway,
    streetsTotal,
    streetsWithSidewalkTag,
    sidewalkYes,
    sidewalkNo,
    crossings: acc.crossingNodes + crossingWays,
    railwayKm,
    tramKm,
    poisTotal,
  };
}
