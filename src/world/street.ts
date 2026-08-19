/**
 * What a street is made of, measured across its width.
 *
 * Until now a street was a flat ribbon of asphalt with two more flat ribbons
 * floating beside it at hand-picked heights, and the heights existed for one
 * reason only: to stop the surfaces flickering through each other. Nothing in
 * that arrangement was a fact about streets. A kerb that is a dark stripe
 * painted at pavement level has no edge to catch the light, the grass verge
 * that every Russian residential street has did not exist at all, and on a
 * hillside the whole stack floated above ground that knew nothing about it.
 *
 * A real street is a *cross-section*: a sequence of strips running out from
 * the crown of the carriageway, each at its own height, and the ground beneath
 * is cut and filled until it carries them. That is what this file describes.
 * `terrain.gradeStreets` then makes the earth match, and the renderer extrudes
 * the section along the centreline. Once the ground is graded, no surface has
 * to be lifted to stay out of another's way — they cannot overlap, because
 * each one occupies a different piece of the cross-section.
 *
 * The numbers are norms, not taste, and norms are national. Russian practice
 * (SP 42.13330, the town-planning code) puts a grass verge between the
 * carriageway and the pavement on most residential streets and stands the kerb
 * 15 cm proud; Dutch practice usually has no verge at all and a cycleway
 * instead. So the table is per country, chosen from where the city is, and a
 * second country is a table rather than a rewrite.
 */

import type { Road, RoadClass } from './types';

export type StreetSurface =
  | 'carriageway'
  | 'kerb'
  | 'verge'
  | 'pavement'
  | 'batter'
  | 'parapet'
  | 'fascia';

/**
 * One edge of the cross-section.
 *
 * `surface` names the strip that *ends* at this edge, so a section reads as a
 * list of edges walking outwards from the crown. Heights are relative to the
 * crown of the carriageway, which is the height the simulation knows as the
 * road surface — a car drives on the crown.
 */
export interface StreetEdge {
  /** Distance from the centreline, metres. */
  offset: number;
  /** Height above the crown, metres. Negative where the road falls away. */
  dy: number;
  surface: StreetSurface;
}

export interface StreetNorm {
  name: string;
  /** How far the kerb stands above the channel at the edge of the road. */
  kerbReveal: number;
  /** Width of the kerb stone itself. */
  kerbWidth: number;
  /** Crossfall of the carriageway, as a fraction: 0.02 is a 2% camber. */
  crossfall: number;
  /** Grass strip between kerb and pavement, metres. */
  verge: Record<RoadClass, number>;
  /** Pavement width, metres. Zero means the class does not get one. */
  pavement: Record<RoadClass, number>;
  /**
   * How far the embankment runs from the back of the pavement before it meets
   * untouched ground. Without it a graded street stands in a trench with
   * vertical walls.
   */
  batter: number;
  /** Width of a footpath or cycleway mapped as a way of its own. */
  path: Record<RoadClass, number>;
}

const NO_VERGE: Record<RoadClass, number> = {
  motorway: 0, trunk: 0, primary: 0, secondary: 0, tertiary: 0,
  residential: 0, service: 0, pedestrian: 0, footway: 0, cycleway: 0,
  steps: 0, track: 0,
};

/**
 * Russian practice. Verges are wide and near-universal, which is most of why
 * a Russian residential street looks nothing like a Dutch one even when both
 * are 6.5 m of asphalt between the same kind of blocks.
 */
export const NORM_RU: StreetNorm = {
  name: 'RU',
  kerbReveal: 0.15,
  kerbWidth: 0.15,
  crossfall: 0.02,
  verge: {
    ...NO_VERGE,
    trunk: 3, primary: 3, secondary: 2.5, tertiary: 2, residential: 1.5,
  },
  pavement: {
    ...NO_VERGE,
    trunk: 3, primary: 3, secondary: 2.25, tertiary: 2.25, residential: 1.5,
  },
  batter: 2.5,
  path: {
    ...NO_VERGE,
    pedestrian: 6, footway: 2, cycleway: 2.4, steps: 2, track: 3.2,
  },
};

/**
 * The default elsewhere: pavement straight off the kerb, no verge. Closer to
 * north-western Europe, and a safer guess than a Russian verge in a city that
 * has never had one.
 */
export const NORM_DEFAULT: StreetNorm = {
  ...NORM_RU,
  name: 'default',
  kerbReveal: 0.12,
  verge: { ...NO_VERGE, trunk: 1.5, primary: 1, secondary: 0.6 },
  pavement: {
    ...NO_VERGE,
    trunk: 3, primary: 3, secondary: 2.5, tertiary: 2.2, residential: 1.8,
  },
  batter: 2,
};

/**
 * Which national norm applies at a given place.
 *
 * A bounding box is all we have — there is no country in the OSM extract we
 * download — so this is a coarse test against Russia's longitude span and the
 * latitudes it occupies. Wrong for a handful of neighbours, and cheap to
 * replace later with a proper point-in-country lookup.
 */
export function normFor(lat: number, lon: number): StreetNorm {
  const inRussia = lat > 41 && lat < 78 && ((lon > 19 && lon < 180) || lon < -168);
  return inRussia ? NORM_RU : NORM_DEFAULT;
}

/** Whether this class of way carries motor traffic and so gets a full street. */
function isStreet(road: Road): boolean {
  return road.drivable;
}

/**
 * The half-section of a way, walking outwards from the centreline.
 *
 * Only one side is described; the renderer mirrors it. `sidewalk === 'no'` is
 * the one tag honoured here, because it is a survey result rather than a
 * silence — a missing tag still means "nobody looked", and guessing a pavement
 * for those is the existing behaviour and a separate open question.
 */
export function streetSection(road: Road, norm: StreetNorm): StreetEdge[] {
  const half = road.width / 2;

  if (!isStreet(road)) {
    // A footpath is a paved strip laid on the ground, with no kerb to stand on.
    const width = norm.path[road.cls] || road.width;
    const edges: StreetEdge[] = [
      { offset: 0, dy: 0, surface: 'carriageway' },
      { offset: width / 2, dy: 0, surface: 'carriageway' },
      { offset: width / 2 + 0.6, dy: -0.08, surface: 'batter' },
    ];
    return edges;
  }

  const crown = norm.crossfall * half;

  // A bridge has no ground beside it to tie into, so it must not be given the
  // embankment that every other street gets. Left in, the batter runs from the
  // deck down to whatever `heightAt` says — which over a river is the bed —
  // and the crossing grows a pair of grass walls hanging in mid-air with a
  // cliff at each end. What a deck has instead is a parapet and a fascia: a
  // wall to stop you falling off, and the thickness of the structure below it.
  if (road.bridge) {
    const kerb = -crown + norm.kerbReveal;
    const walkway = half + norm.kerbWidth + 1.2;
    return [
      { offset: 0, dy: 0, surface: 'carriageway' },
      { offset: half, dy: -crown, surface: 'carriageway' },
      { offset: half, dy: kerb, surface: 'kerb' },
      { offset: half + norm.kerbWidth, dy: kerb, surface: 'kerb' },
      { offset: walkway, dy: kerb, surface: 'pavement' },
      // Inner face of the parapet, its coping, then the whole outside of the
      // structure in one drop: parapet, deck edge and the slab beneath it.
      { offset: walkway, dy: kerb + 0.95, surface: 'parapet' },
      { offset: walkway + 0.28, dy: kerb + 0.95, surface: 'parapet' },
      { offset: walkway + 0.28, dy: kerb - 0.95, surface: 'fascia' },
    ];
  }

  const edges: StreetEdge[] = [
    // The crown stands above the channel by the camber, so the carriageway
    // sheds water the way a built road does. The crown is the height the
    // simulation calls the road surface, so a car sits on it exactly.
    { offset: 0, dy: 0, surface: 'carriageway' },
    { offset: half, dy: -crown, surface: 'carriageway' },
  ];

  // The kerb: a vertical face out of the channel, then the flat top of the
  // stone. This is the piece that was missing entirely, and it is what makes a
  // street read as a street from eye level — it catches the sun on one side of
  // the road and lies in its own shadow on the other.
  const kerbTop = -crown + norm.kerbReveal;
  edges.push({ offset: half, dy: kerbTop, surface: 'kerb' });
  edges.push({ offset: half + norm.kerbWidth, dy: kerbTop, surface: 'kerb' });

  let offset = half + norm.kerbWidth;
  const verge = norm.verge[road.cls];
  const pavement = road.sidewalk === 'no' ? 0 : norm.pavement[road.cls];

  if (verge > 0) {
    // Soil sits a little below the paving it borders, which is why a verge
    // holds water and a pavement does not.
    offset += verge;
    edges.push({ offset, dy: kerbTop - 0.04, surface: 'verge' });
  }
  if (pavement > 0) {
    offset += pavement;
    edges.push({ offset, dy: kerbTop, surface: 'pavement' });
  }

  // The embankment, tying whatever we built back into untouched ground. Its
  // outer height is resolved against the terrain by the renderer, so the seam
  // is exact rather than approximately right.
  edges.push({ offset: offset + norm.batter, dy: Number.NaN, surface: 'batter' });
  return edges;
}

/** Total half-width of a street including everything beside the carriageway. */
export function sectionHalfWidth(section: StreetEdge[]): number {
  return section[section.length - 1].offset;
}

/**
 * Half-width of the part that is actually built — paving and verge, but not
 * the embankment. This is the width the earth is cut to.
 */
export function gradedHalfWidth(section: StreetEdge[]): number {
  for (let i = section.length - 1; i >= 0; i--) {
    if (section[i].surface !== 'batter') return section[i].offset;
  }
  return section[0].offset;
}
