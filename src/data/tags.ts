/**
 * OSM tag interpretation.
 *
 * Two rules shape this file:
 *  - Heights come from the data when tagged, and from a plausible default for
 *    the building type when not, because most of OSM has no height at all.
 *  - Names are deliberately dropped for anything that could carry a brand.
 *    We keep the *category* (a cafe, a supermarket) and throw away the
 *    identity (which chain it is). Street names survive: they are geography.
 */

import type { BuildingKind, PoiKind, RoadClass } from '../world/types';

export type Tags = Record<string, string>;

const METRES_PER_LEVEL = 3.2;

/** Parse an OSM height value, which may carry units ("25 m", "82'"). */
export function parseHeight(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  const feet = /^([\d.]+)\s*'/.exec(trimmed);
  if (feet) return parseFloat(feet[1]) * 0.3048;
  const num = parseFloat(trimmed.replace(',', '.'));
  if (!isFinite(num) || num <= 0 || num > 900) return undefined;
  return num;
}

export function buildingKind(tags: Tags): BuildingKind {
  const b = tags.building ?? 'yes';
  const amenity = tags.amenity;

  if (tags.shop || b === 'retail' || b === 'supermarket' || b === 'kiosk' || b === 'mall') {
    return 'retail';
  }
  if (b === 'office' || b === 'commercial' || tags.office) return 'office';
  if (b === 'industrial' || b === 'warehouse' || b === 'factory' || tags.industrial) {
    return 'industrial';
  }
  if (b === 'school' || b === 'university' || b === 'college' || b === 'kindergarten') {
    return 'education';
  }
  if (amenity === 'school' || amenity === 'university' || amenity === 'college') return 'education';
  if (b === 'church' || b === 'cathedral' || b === 'chapel' || b === 'mosque' ||
      b === 'synagogue' || b === 'temple' || tags.religion) {
    return 'religious';
  }
  if (b === 'hospital' || b === 'civic' || b === 'public' || b === 'government' ||
      b === 'train_station' || b === 'museum' || amenity === 'hospital' ||
      amenity === 'townhall' || amenity === 'library') {
    return 'civic';
  }
  if (
    b === 'house' || b === 'residential' || b === 'apartments' || b === 'detached' ||
    b === 'terrace' || b === 'semidetached_house' || b === 'bungalow' || b === 'dormitory' ||
    b === 'hotel'
  ) {
    return 'residential';
  }
  if (b === 'garage' || b === 'garages' || b === 'shed' || b === 'hut' || b === 'roof' ||
      b === 'carport' || b === 'greenhouse' || b === 'service') {
    return 'other';
  }
  // Bare `building=yes` is the commonest case by far. In a city most of those
  // are places people live, so that is the useful default for the simulation.
  return 'residential';
}

/** Typical storey count when OSM does not say, by building type. */
function defaultLevels(kind: BuildingKind, area: number): number {
  switch (kind) {
    case 'residential':
      // Small footprint reads as a house, large as a block of flats.
      return area < 120 ? 2 : area < 400 ? 3 : 5;
    case 'office':
      return area < 500 ? 4 : 8;
    case 'commercial':
    case 'retail':
      return 2;
    case 'industrial':
      return 1;
    case 'education':
      return 3;
    case 'civic':
      return 3;
    case 'religious':
      return 2;
    default:
      return 1;
  }
}

export function buildingHeight(tags: Tags, kind: BuildingKind, area: number): {
  height: number;
  minHeight: number;
  levels: number;
} {
  const tagged = parseHeight(tags.height) ?? parseHeight(tags['building:height']);
  const levelsTag = parseFloat(tags['building:levels'] ?? tags.levels ?? '');
  const levels =
    isFinite(levelsTag) && levelsTag > 0 && levelsTag < 200
      ? levelsTag
      : tagged
        ? Math.max(1, Math.round(tagged / METRES_PER_LEVEL))
        : defaultLevels(kind, area);

  const height = tagged ?? levels * METRES_PER_LEVEL + (kind === 'industrial' ? 2 : 1.2);

  const minTag = parseHeight(tags.min_height);
  const minLevels = parseFloat(tags['building:min_level'] ?? '');
  const minHeight =
    minTag ?? (isFinite(minLevels) && minLevels > 0 ? minLevels * METRES_PER_LEVEL : 0);

  return { height: Math.max(2, height), minHeight: Math.min(minHeight, height - 1), levels };
}

/** Roughly how many people a building holds, used to seed the population. */
export function buildingCapacity(kind: BuildingKind, area: number, levels: number): number {
  const floorArea = area * levels;
  switch (kind) {
    case 'residential':
      return Math.max(1, Math.round(floorArea / 55));
    case 'office':
      return Math.max(1, Math.round(floorArea / 22));
    case 'retail':
    case 'commercial':
      return Math.max(1, Math.round(floorArea / 60));
    case 'education':
      return Math.max(2, Math.round(floorArea / 90));
    case 'civic':
      return Math.max(1, Math.round(floorArea / 70));
    case 'industrial':
      return Math.max(1, Math.round(floorArea / 150));
    case 'religious':
      return Math.max(1, Math.round(floorArea / 200));
    default:
      return 0;
  }
}

const ROAD_CLASSES: Record<string, RoadClass> = {
  motorway: 'motorway',
  motorway_link: 'motorway',
  trunk: 'trunk',
  trunk_link: 'trunk',
  primary: 'primary',
  primary_link: 'primary',
  secondary: 'secondary',
  secondary_link: 'secondary',
  tertiary: 'tertiary',
  tertiary_link: 'tertiary',
  unclassified: 'residential',
  residential: 'residential',
  living_street: 'residential',
  service: 'service',
  pedestrian: 'pedestrian',
  footway: 'footway',
  path: 'footway',
  cycleway: 'cycleway',
  steps: 'steps',
  track: 'track',
};

export function roadClass(tags: Tags): RoadClass | undefined {
  const hw = tags.highway;
  if (!hw) return undefined;
  return ROAD_CLASSES[hw];
}

/** Default carriageway widths in metres, per class. */
const ROAD_WIDTH: Record<RoadClass, number> = {
  motorway: 14,
  trunk: 12,
  primary: 11,
  secondary: 9.5,
  tertiary: 8,
  residential: 6.5,
  service: 4.2,
  pedestrian: 6,
  footway: 2,
  cycleway: 2.4,
  steps: 2,
  track: 3.2,
};

export function roadWidth(tags: Tags, cls: RoadClass): { width: number; lanes: number } {
  const lanesTag = parseFloat(tags.lanes ?? '');
  const lanes = isFinite(lanesTag) && lanesTag > 0 && lanesTag < 12 ? lanesTag : undefined;
  const widthTag = parseHeight(tags.width);
  if (widthTag) return { width: Math.max(1.5, widthTag), lanes: lanes ?? Math.max(1, Math.round(widthTag / 3.2)) };
  if (lanes) return { width: Math.max(2, lanes * 3.2), lanes };
  const w = ROAD_WIDTH[cls];
  return { width: w, lanes: Math.max(1, Math.round(w / 3.2)) };
}

const WALKABLE: ReadonlySet<RoadClass> = new Set<RoadClass>([
  'residential', 'service', 'pedestrian', 'footway', 'cycleway', 'steps', 'track',
  'tertiary', 'secondary', 'primary',
]);
const DRIVABLE: ReadonlySet<RoadClass> = new Set<RoadClass>([
  'motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'residential', 'service',
]);

export function isWalkable(cls: RoadClass, tags: Tags): boolean {
  if (tags.foot === 'no' || tags.access === 'private' || tags.access === 'no') return false;
  if (tags.foot === 'yes' || tags.foot === 'designated') return true;
  return WALKABLE.has(cls);
}

export function isDrivable(cls: RoadClass, tags: Tags): boolean {
  if (tags.motor_vehicle === 'no' || tags.access === 'no') return false;
  return DRIVABLE.has(cls);
}

/**
 * Map amenity/shop/leisure tags onto the small set of categories the
 * simulation understands. Anything unrecognised is dropped rather than
 * guessed at.
 */
export function poiKind(tags: Tags): PoiKind | undefined {
  const amenity = tags.amenity;
  const shop = tags.shop;
  const leisure = tags.leisure;
  const tourism = tags.tourism;
  const office = tags.office;
  const healthcare = tags.healthcare;

  if (amenity === 'cafe' || amenity === 'restaurant' || amenity === 'fast_food' ||
      amenity === 'bar' || amenity === 'pub' || amenity === 'food_court' ||
      amenity === 'ice_cream' || amenity === 'biergarten') {
    return 'food';
  }
  if (shop === 'supermarket' || shop === 'convenience' || shop === 'greengrocer' ||
      shop === 'bakery' || shop === 'butcher' || shop === 'grocery' ||
      amenity === 'marketplace') {
    return 'groceries';
  }
  if (shop) return 'shopping';
  if (amenity === 'school' || amenity === 'kindergarten' || amenity === 'university' ||
      amenity === 'college' || amenity === 'language_school') {
    return 'school';
  }
  if (amenity === 'hospital' || amenity === 'clinic' || amenity === 'doctors' ||
      amenity === 'pharmacy' || amenity === 'dentist' || healthcare) {
    return 'healthcare';
  }
  if (amenity === 'library' || amenity === 'theatre' || amenity === 'cinema' ||
      amenity === 'arts_centre' || amenity === 'community_centre' ||
      tourism === 'museum' || tourism === 'gallery') {
    return 'culture';
  }
  if (leisure === 'fitness_centre' || leisure === 'sports_centre' ||
      leisure === 'swimming_pool' || leisure === 'pitch' || leisure === 'stadium') {
    return 'sport';
  }
  if (leisure === 'park' || leisure === 'garden' || leisure === 'playground' ||
      leisure === 'dog_park') {
    return 'park';
  }
  if (amenity === 'place_of_worship') return 'worship';
  if (amenity === 'bus_station' || tags.railway === 'station' ||
      tags.public_transport === 'station' || amenity === 'ferry_terminal') {
    return 'transit';
  }
  if (office || amenity === 'bank' || amenity === 'post_office' ||
      amenity === 'townhall' || amenity === 'courthouse') {
    return 'work';
  }
  if (leisure) return 'leisure';
  return undefined;
}

/** Human-readable label for a POI category. Category only — never a brand. */
export const POI_LABEL: Record<PoiKind, string> = {
  food: 'Cafe / restaurant',
  groceries: 'Food shop',
  shopping: 'Shop',
  work: 'Workplace',
  school: 'School',
  healthcare: 'Healthcare',
  leisure: 'Leisure',
  culture: 'Culture',
  sport: 'Sport',
  park: 'Park',
  transit: 'Transit stop',
  worship: 'Place of worship',
};

/** Ground-cover areas we care about, with their paint order. */
export function areaKind(tags: Tags): { kind: import('../world/types').AreaKind; priority: number } | undefined {
  if (tags.natural === 'water' || tags.waterway === 'riverbank' ||
      tags.landuse === 'reservoir' || tags.landuse === 'basin' || tags.water) {
    return { kind: 'water', priority: 5 };
  }
  if (tags.leisure === 'park' || tags.leisure === 'garden' ||
      tags.landuse === 'village_green' || tags.landuse === 'recreation_ground') {
    return { kind: 'park', priority: 2 };
  }
  if (tags.natural === 'wood' || tags.landuse === 'forest') {
    return { kind: 'forest', priority: 2 };
  }
  if (tags.landuse === 'grass' || tags.landuse === 'meadow' ||
      tags.natural === 'grassland' || tags.natural === 'scrub') {
    return { kind: 'grass', priority: 1 };
  }
  if (tags.natural === 'sand' || tags.natural === 'beach') {
    return { kind: 'sand', priority: 3 };
  }
  if (tags.leisure === 'pitch' || tags.leisure === 'playground') {
    return { kind: 'pitch', priority: 4 };
  }
  if (tags.landuse === 'cemetery' || tags.amenity === 'grave_yard') {
    return { kind: 'cemetery', priority: 2 };
  }
  if (tags.amenity === 'parking') {
    return { kind: 'parking', priority: 3 };
  }
  return undefined;
}
