/**
 * The world model: everything downstream (geometry building, navigation,
 * agent behaviour) reads these structures and nothing else, so the real-OSM
 * loader and the offline generator can feed the same simulator.
 *
 * All coordinates are projected metres in the local tangent plane
 * (see core/geo.ts): [x = east, z = south].
 */

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
  areas: AreaFeature[];
  pois: Poi[];
  /** Half-extent of the loaded area in metres, used to size ground and fog. */
  radius: number;
  stats: WorldStats;
  seed: number;
}
