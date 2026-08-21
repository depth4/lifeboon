/**
 * The offline city.
 *
 * This is NOT a real place and is never presented as one — the HUD labels it
 * "synthetic". It exists so the simulator has something to run on when
 * OpenStreetMap is unreachable (an offline laptop, a blocked network, a
 * throttled Overpass mirror), and so the renderer and the agent simulation can
 * be exercised without depending on a public service.
 *
 * The layout is a jittered grid with a river, ring of parks and a taller
 * centre — enough structure that pathfinding, zoning and traffic behave the
 * way they do on real data.
 */

import { Rng, hashString } from '../core/rng';
import { ringArea, ringCentroid } from '../core/geo';
import { buildingCapacity } from './tags';
import { syntheticHeightfield } from '../terrain/elevation';
import { NORM_RU } from '../world/street';
import type {
  AreaFeature,
  Building,
  BuildingKind,
  Poi,
  PoiKind,
  Road,
  RoadClass,
  Vec2,
  World,
} from '../world/types';

interface Rect {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

const rectWidth = (r: Rect) => r.x1 - r.x0;
const rectDepth = (r: Rect) => r.z1 - r.z0;

function rectRing(r: Rect): Vec2[] {
  // Counter-clockwise in our (x east, z south) frame.
  return [
    [r.x0, r.z0],
    [r.x0, r.z1],
    [r.x1, r.z1],
    [r.x1, r.z0],
  ];
}

function inset(r: Rect, by: number): Rect {
  return { x0: r.x0 + by, z0: r.z0 + by, x1: r.x1 - by, z1: r.z1 - by };
}

/** Split a block into buildable lots, halving the longer side until small. */
function subdivide(rect: Rect, rng: Rng, minSide: number, out: Rect[]): void {
  const w = rectWidth(rect);
  const d = rectDepth(rect);
  if (w < minSide * 2 && d < minSide * 2) {
    out.push(rect);
    return;
  }
  if (w >= d) {
    const cut = rect.x0 + w * rng.range(0.35, 0.65);
    subdivide({ ...rect, x1: cut }, rng, minSide, out);
    subdivide({ ...rect, x0: cut }, rng, minSide, out);
  } else {
    const cut = rect.z0 + d * rng.range(0.35, 0.65);
    subdivide({ ...rect, z1: cut }, rng, minSide, out);
    subdivide({ ...rect, z0: cut }, rng, minSide, out);
  }
}

/** Street positions across one axis: irregular spacing, never perfectly regular. */
function gridLines(radius: number, rng: Rng): number[] {
  const lines: number[] = [];
  let p = -radius;
  while (p < radius) {
    lines.push(p);
    p += rng.range(65, 135);
  }
  lines.push(radius);
  return lines;
}

/** Gentle lateral drift so streets are not laser-straight. */
function drift(t: number, phase: number, amount: number): number {
  return Math.sin(t * 0.0035 + phase) * amount + Math.sin(t * 0.011 + phase * 2) * amount * 0.35;
}

export function generateCity(seedText = 'lifeboon', radius = 900): World {
  const seed = hashString(seedText);
  const rng = new Rng(seed);

  const roads: Road[] = [];
  const buildings: Building[] = [];
  const areas: AreaFeature[] = [];
  const pois: Poi[] = [];

  /* ------------------------------------------------------------- the river */
  // A band running roughly north-south, bent by the same drift function so the
  // street grid can be cut against it.
  const riverPhase = rng.range(0, 6.28);
  const riverX = (z: number) => drift(z * 2.2, riverPhase, 90) + rng.range(-0.01, 0.01) * 0 + radius * 0.28;
  const riverHalfWidth = rng.range(28, 46);

  const riverLeft: Vec2[] = [];
  const riverRight: Vec2[] = [];
  for (let z = -radius - 50; z <= radius + 50; z += 40) {
    const cx = riverX(z);
    riverLeft.push([cx - riverHalfWidth, z]);
    riverRight.push([cx + riverHalfWidth, z]);
  }
  areas.push({
    id: 'river',
    ring: riverLeft.concat(riverRight.slice().reverse()),
    holes: [],
    kind: 'water',
    priority: 5,
  });

  const inRiver = (x: number, z: number) => Math.abs(x - riverX(z)) < riverHalfWidth + 6;

  /* ------------------------------------------------------------ the grid */
  const xs = gridLines(radius, rng);
  const zs = gridLines(radius, rng);
  const xPhase = rng.range(0, 6.28);
  const zPhase = rng.range(0, 6.28);

  const classify = (index: number, total: number): RoadClass => {
    if (index === Math.floor(total / 2)) return 'primary';
    if (index % 4 === 0) return 'secondary';
    if (index % 2 === 0) return 'tertiary';
    return 'residential';
  };

  const ROAD_W: Record<string, number> = {
    primary: 14,
    secondary: 10,
    tertiary: 8,
    residential: 6.5,
  };

  // Bridges: only a couple of crossings actually span the river.
  const bridgeZs = [zs[Math.floor(zs.length * 0.25)], zs[Math.floor(zs.length * 0.6)]];

  xs.forEach((x, i) => {
    const cls = classify(i, xs.length);
    const points: Vec2[] = [];
    for (let z = -radius; z <= radius; z += 25) {
      points.push([x + drift(z, xPhase + i, 14), z]);
    }
    roads.push({
      id: `av${i}`,
      points,
      cls,
      width: ROAD_W[cls],
      lanes: Math.max(1, Math.round(ROAD_W[cls] / 3.4)),
      oneway: false,
      layer: 0,
      bridge: false,
      tunnel: false,
      name: `${i + 1}${i % 10 === 0 ? 'st' : i % 10 === 1 ? 'nd' : 'th'} Avenue`,
      walkable: true,
      drivable: true,
      isSidewalkLine: false,
      isCrossing: false,
    });
  });

  zs.forEach((z, i) => {
    const cls = classify(i, zs.length);
    const isBridge = bridgeZs.includes(z);
    // Streets that are not bridges stop at the riverbank on each side.
    const segments: Vec2[][] = [];
    let current: Vec2[] = [];
    for (let x = -radius; x <= radius; x += 25) {
      const zz = z + drift(x, zPhase + i, 14);
      if (!isBridge && inRiver(x, zz)) {
        if (current.length > 1) segments.push(current);
        current = [];
        continue;
      }
      current.push([x, zz]);
    }
    if (current.length > 1) segments.push(current);

    segments.forEach((points, s) => {
      roads.push({
        id: `st${i}_${s}`,
        points,
        cls,
        width: ROAD_W[cls],
        lanes: Math.max(1, Math.round(ROAD_W[cls] / 3.4)),
        oneway: false,
        layer: isBridge ? 1 : 0,
        bridge: isBridge,
        tunnel: false,
        name: `Street ${i + 1}`,
        walkable: true,
        drivable: true,
        isSidewalkLine: false,
        isCrossing: false,
      });
    });
  });

  /* --------------------------------------------------------------- blocks */
  const POI_BY_KIND: Partial<Record<BuildingKind, PoiKind[]>> = {
    retail: ['shopping', 'groceries', 'food'],
    commercial: ['food', 'shopping'],
    office: ['work'],
    education: ['school'],
    civic: ['culture', 'healthcare'],
    religious: ['worship'],
  };

  let buildingId = 0;
  let poiId = 0;

  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < zs.length - 1; j++) {
      const block: Rect = { x0: xs[i], z0: zs[j], x1: xs[i + 1], z1: zs[j + 1] };
      const cx = (block.x0 + block.x1) / 2;
      const cz = (block.z0 + block.z1) / 2;

      // The river eats any block it overlaps.
      if (inRiver(cx, cz) || inRiver(block.x0, cz) || inRiver(block.x1, cz)) continue;

      const distFromCentre = Math.hypot(cx, cz) / radius;
      const buildable = inset(block, 9);
      if (rectWidth(buildable) < 18 || rectDepth(buildable) < 18) continue;

      // Some blocks are green rather than built.
      const parkChance = 0.06 + distFromCentre * 0.1;
      if (rng.chance(parkChance)) {
        const green = inset(block, 7);
        areas.push({
          id: `park${i}_${j}`,
          ring: rectRing(green),
          holes: [],
          kind: rng.chance(0.7) ? 'park' : 'forest',
          priority: 2,
        });
        pois.push({
          id: `poi${poiId++}`,
          position: [cx, cz],
          kind: 'park',
          nodeIndex: -1,
        });
        continue;
      }

      const lots: Rect[] = [];
      subdivide(buildable, rng, distFromCentre < 0.35 ? 22 : 15, lots);

      for (const lot of lots) {
        // Leave the odd gap so blocks are not solid walls of masonry.
        if (rng.chance(0.12)) continue;
        const plot = inset(lot, rng.range(0.6, 2.4));
        const w = rectWidth(plot);
        const d = rectDepth(plot);
        if (w < 6 || d < 6) continue;

        const area = w * d;
        // Zoning: shops and offices in the middle, homes further out.
        let kind: BuildingKind;
        const roll = rng.next();
        if (distFromCentre < 0.28) {
          kind = roll < 0.45 ? 'office' : roll < 0.75 ? 'retail' : 'residential';
        } else if (distFromCentre < 0.55) {
          kind = roll < 0.2 ? 'retail' : roll < 0.3 ? 'office' : roll < 0.36 ? 'civic' : 'residential';
        } else {
          kind = roll < 0.08 ? 'retail' : roll < 0.12 ? 'education' : 'residential';
        }

        // Height falls off from the centre, with a few outliers.
        const centreBoost = Math.max(0, 1 - distFromCentre * 1.6);
        let levels = Math.round(
          rng.gaussian(2 + centreBoost * 9, 1.6 + centreBoost * 3),
        );
        if (kind === 'office' && rng.chance(0.12)) levels += rng.int(6, 22);
        levels = Math.max(1, Math.min(48, levels));

        const ring = rectRing(plot);
        const height = levels * 3.2 + 1.2;
        const b: Building = {
          id: `b${buildingId++}`,
          ring,
          holes: [],
          height,
          minHeight: 0,
          levels,
          kind,
          centroid: ringCentroid(ring),
          area: Math.abs(ringArea(ring)),
          capacity: buildingCapacity(kind, area, levels),
          variation: rng.next(),
        };
        buildings.push(b);

        const kinds = POI_BY_KIND[kind];
        if (kinds && rng.chance(0.55)) {
          pois.push({
            id: `poi${poiId++}`,
            position: b.centroid,
            kind: rng.pick(kinds),
            buildingId: b.id,
            nodeIndex: -1,
          });
        }
      }
    }
  }

  let roadLength = 0;
  for (const r of roads) {
    for (let k = 1; k < r.points.length; k++) {
      roadLength += Math.hypot(r.points[k][0] - r.points[k - 1][0], r.points[k][1] - r.points[k - 1][1]);
    }
  }

  return {
    buildings,
    roads: splitAtCrossings(roads),
    railways: [],
    waterways: [],
    areas,
    pois,
    audit: null,
    // Invented landscape for an invented city — it exists so the terrain
    // pipeline runs without a network, and so the offline city has hills.
    terrain: syntheticHeightfield(radius, seed),
    // The offline city is nowhere, so its street norm is a choice rather than
    // a fact. Russian practice is the one worth exercising here: it has the
    // widest verges and the tallest kerbs, so anything that goes wrong in the
    // cross-section goes wrong visibly.
    norm: NORM_RU,
    radius,
    seed,
    stats: {
      buildings: buildings.length,
      roads: roads.length,
      roadLengthKm: roadLength / 1000,
      areas: areas.length,
      pois: pois.length,
      source: 'synthetic',
      placeName: 'Offline city (generated, not a real place)',
      attribution: 'Procedurally generated — no map data used',
    },
  };
}

/**
 * Cut the generated ways at their crossings, the way OpenStreetMap stores them.
 *
 * The offline city drew long streets straight through one another, which is
 * the *wrong shape* for testing anything: OSM splits every street at every
 * junction and joins the pieces end to end, and it is that shared end point
 * that tells the network where a junction is. With crossing-through ways the
 * network finds no junctions at all — measured on this city: 114 nodes, 57
 * edges, not one crossroads — so the offline city silently exercised only the
 * easiest half of the code and every junction bug had to be found on a real
 * town instead.
 *
 * Bridges are left alone on purpose. A deck crosses without meeting, and
 * cutting it at the street below would invent exactly the junction that a
 * bridge exists not to be.
 */
function splitAtCrossings(roads: Road[]): Road[] {
  const passing = (road: Road) => road.bridge || road.tunnel || road.layer !== 0;
  // Where each way has to gain a point: distance along it, and the point.
  const cuts = roads.map(() => [] as Array<{ at: number; p: Vec2 }>);

  for (let a = 0; a < roads.length; a++) {
    if (passing(roads[a])) continue;
    for (let b = a + 1; b < roads.length; b++) {
      if (passing(roads[b])) continue;
      const pa = roads[a].points;
      const pb = roads[b].points;
      for (let i = 0; i < pa.length - 1; i++) {
        for (let j = 0; j < pb.length - 1; j++) {
          const hit = meet(pa[i], pa[i + 1], pb[j], pb[j + 1]);
          if (!hit) continue;
          cuts[a].push({ at: i + hit.ta, p: hit.p });
          cuts[b].push({ at: j + hit.tb, p: hit.p });
        }
      }
    }
  }

  const out: Road[] = [];
  roads.forEach((road, index) => {
    const mine = cuts[index]
      .filter((c) => c.at > 0.02 && c.at < road.points.length - 1.02)
      .sort((x, y) => x.at - y.at);
    if (!mine.length) {
      out.push(road);
      return;
    }

    // Rebuild the way with the crossing points in it, remembering which of its
    // points are junctions, then break it there.
    const points: Vec2[] = [];
    const breaks: number[] = [];
    let next = 0;
    for (let i = 0; i < road.points.length; i++) {
      points.push(road.points[i]);
      while (next < mine.length && mine[next].at < i + 1) {
        breaks.push(points.length);
        points.push(mine[next].p);
        next++;
      }
    }

    let start = 0;
    let piece = 0;
    for (const at of [...breaks, points.length - 1]) {
      if (at <= start) continue;
      const slice = points.slice(start, at + 1);
      if (slice.length >= 2) {
        out.push({ ...road, id: `${road.id}#${piece++}`, points: slice });
      }
      start = at;
    }
  });
  return out;
}

/** Where two segments cross, if they do, and how far along each. */
function meet(
  a0: Vec2, a1: Vec2, b0: Vec2, b1: Vec2,
): { ta: number; tb: number; p: Vec2 } | null {
  const ax = a1[0] - a0[0];
  const az = a1[1] - a0[1];
  const bx = b1[0] - b0[0];
  const bz = b1[1] - b0[1];
  const det = ax * bz - az * bx;
  if (Math.abs(det) < 1e-9) return null;
  const ta = ((b0[0] - a0[0]) * bz - (b0[1] - a0[1]) * bx) / det;
  const tb = ((b0[0] - a0[0]) * az - (b0[1] - a0[1]) * ax) / det;
  if (ta <= 0 || ta >= 1 || tb <= 0 || tb >= 1) return null;
  return { ta, tb, p: [a0[0] + ax * ta, a0[1] + az * ta] };
}
