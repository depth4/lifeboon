/**
 * The world model: everything downstream (geometry building, navigation,
 * agent behaviour) reads these structures and nothing else, so the real-OSM
 * loader and the offline generator can feed the same simulator.
 *
 * All coordinates are projected metres in the local tangent plane
 * (see core/geo.ts): [x = east, z = south].
 */

import type { Terrain } from '../terrain/heightfield';

export type Vec2 = [number, number];

export type BuildingKind =
  | 'residential'
  | 'commercial'
  | 'office'
  | 'retail'
  | 'industrial'
  | 'civic'
  | 'education'
  | 'religious'
  | 'other';

export interface Building {
  id: string;
  /** Outer ring, projected metres, first point not repeated at the end. */
  ring: Vec2[];
  /** Inner rings (courtyards) for multipolygon buildings. */
  holes: Vec2[][];
  /** Total height in metres from ground to roof. */
  height: number;
  /** Height at which the building starts (for parts sitting on podiums). */
  minHeight: number;
  levels: number;
  kind: BuildingKind;
  centroid: Vec2;
  /** Footprint area in square metres. */
  area: number;
  /** How many people can live here (residential) or work here (everything else). */
  capacity: number;
  /** Deterministic per-building variation, 0..1, used for colour and detailing. */
  variation: number;
}

export type RoadClass =
  | 'motorway'
  | 'trunk'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'residential'
  | 'service'
  | 'pedestrian'
  | 'footway'
  | 'cycleway'
  | 'steps'
  | 'track';

export interface Road {
  id: string;
  points: Vec2[];
  cls: RoadClass;
  /** Carriageway width in metres (excludes pavements). */
  width: number;
  lanes: number;
  oneway: boolean;
  /** OSM layer, used to stack bridges above and tunnels below ground level. */
  layer: number;
  bridge: boolean;
  tunnel: boolean;
  /** Street name — a geographic label, kept because it helps you navigate. */
  name?: string;
  /** Whether people on foot may use it. */
  walkable: boolean;
  /** Whether cars may use it. */
  drivable: boolean;
  /**
   * What the map says about pavements beside this street.
   *
   * `undefined` is the important value: it means nobody has surveyed it, NOT
   * that there is no pavement. Treating a missing tag as "no pavement" is the
   * classic way to misread OpenStreetMap, and in thinly-mapped towns it is
   * wrong almost everywhere.
   */
  sidewalk?: SidewalkTag;
  /** True when this way is itself a pavement mapped as a separate line. */
  isSidewalkLine: boolean;
  /** True when this way is a marked pedestrian crossing. */
  isCrossing: boolean;
}

export type SidewalkTag = 'both' | 'left' | 'right' | 'no' | 'separate';

export type WaterwayKind = 'river' | 'stream' | 'canal' | 'ditch' | 'drain';

/**
 * Flowing water mapped as a line rather than an area.
 *
 * Only wide rivers get a polygon in OpenStreetMap; anything narrower than a
 * few metres — which is most of them — is a single way with a width tag, if
 * that. Querying only polygons leaves a town with its ponds and no river
 * between them.
 */
export interface Waterway {
  id: string;
  points: Vec2[];
  kind: WaterwayKind;
  /** Surface width in metres, from the tag where present. */
  width: number;
  tunnel: boolean;
}

export type RailKind = 'rail' | 'light_rail' | 'tram' | 'subway' | 'disused';

export interface Railway {
  id: string;
  points: Vec2[];
  kind: RailKind;
  /** Number of parallel tracks, where the map says. */
  tracks: number;
  layer: number;
  bridge: boolean;
  tunnel: boolean;
}

/**
 * What the map actually contained for this place.
 *
 * The point of this is honesty about coverage: a district where 4% of
 * buildings have a surveyed height is a different object from one where 90%
 * do, and the simulation should not pretend otherwise.
 */
export interface DataAudit {
  buildingsTotal: number;
  buildingsWithHeight: number;
  buildingsWithLevels: number;
  buildingsGuessed: number;

  roadKmDrivable: number;
  /** Pavements and paths mapped as their own lines. */
  roadKmFootway: number;
  /** Streets carrying an explicit sidewalk=* tag, and what it says. */
  streetsTotal: number;
  streetsWithSidewalkTag: number;
  sidewalkYes: number;
  sidewalkNo: number;

  crossings: number;
  /** Heavy rail, light rail and disused track. */
  railwayKm: number;
  /** Tram, counted apart: it is street running, not a railway corridor. */
  tramKm: number;
  poisTotal: number;
}

export type AreaKind =
  | 'water'
  | 'park'
  | 'forest'
  | 'grass'
  | 'sand'
  | 'pitch'
  | 'cemetery'
  | 'parking'
  | 'pavement';

export interface AreaFeature {
  id: string;
  ring: Vec2[];
  holes: Vec2[][];
  kind: AreaKind;
  /** Draw order within the ground plane; higher paints on top. */
  priority: number;
}

/**
 * Categories only — never brand, operator or shop names. A cafe is "a cafe".
 */
export type PoiKind =
  | 'food'
  | 'groceries'
  | 'shopping'
  | 'work'
  | 'school'
  | 'healthcare'
  | 'leisure'
  | 'culture'
  | 'sport'
  | 'park'
  | 'transit'
  | 'worship';

export interface Poi {
  id: string;
  position: Vec2;
  kind: PoiKind;
  /** Building this POI sits in, when we could match one. */
  buildingId?: string;
  /** Nav-graph node nearest the door, resolved once the graph is built. */
  nodeIndex: number;
}

export interface WorldStats {
  buildings: number;
  roads: number;
  roadLengthKm: number;
  areas: number;
  pois: number;
  /** Where the data came from, shown in the UI so the two modes never blur. */
  source: 'osm' | 'synthetic';
  placeName: string;
  attribution: string;
}

export interface World {
  buildings: Building[];
  roads: Road[];
  railways: Railway[];
  waterways: Waterway[];
  areas: AreaFeature[];
  pois: Poi[];
  /** Null for the generated offline city, which has nothing to audit. */
  audit: DataAudit | null;
  /** Ground surface. FlatTerrain when no elevation data could be loaded. */
  terrain: Terrain;
  /** Half-extent of the loaded area in metres, used to size ground and fog. */
  radius: number;
  stats: WorldStats;
  seed: number;
}
