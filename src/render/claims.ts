/**
 * Who owns this square metre.
 *
 * Every way in OpenStreetMap gets a full cross-section built for it —
 * carriageway, kerb, verge, pavement — and the ways lie on top of each other.
 * Measured on Alapaevsk: **15% of the length of every drawn way has another
 * way built over the same ground.** A footway drawn straight along a secondary
 * road, a service road inside a residential street's pavement, two arms of one
 * street overlapping where they meet. Built independently, they come out as
 * asphalt over grass over paving in patches — which is the mess the user kept
 * photographing, everywhere, in every version.
 *
 * No amount of fixing one seam helps, because the seams are not the problem:
 * nothing ever decided which way the ground belonged to. So it is decided
 * here, once, before anything is drawn. Junctions claim first because a
 * crossing is the thing you see at a crossing; then ways in order of
 * importance, a main road before a lane before a footpath. Whatever is left
 * over, a way may build on. Whatever is not, it yields.
 *
 * Deliberately a raster and not a set of polygons. The question asked of it —
 * "may I build here" — is asked a few hundred thousand times per city and has
 * to be a lookup, and the alternative is exactly the polygon-clipping
 * machinery that this project has twice decided not to depend on.
 */

import { streetSection, type StreetNorm } from '../world/street';
import type { Road, RoadClass, Vec2 } from '../world/types';
import { offsetPolyline } from './roads';

/**
 * Which way wins when two claim the same ground.
 *
 * Not arbitrary: it is the order in which a person would say the ground
 * belongs to something. Where a footpath crosses a main road, the ground is
 * the main road's and the path is painted on it; where a service road runs
 * into a street, the street's pavement runs on and the service road starts at
 * its kerb.
 */
const RANK: Record<RoadClass, number> = {
  motorway: 0,
  trunk: 1,
  primary: 2,
  secondary: 3,
  tertiary: 4,
  residential: 5,
  service: 6,
  pedestrian: 7,
  cycleway: 8,
  track: 9,
  footway: 10,
  steps: 11,
};

/** Nobody owns this ground. */
export const UNCLAIMED = -1;
/** A junction owns it. Junctions are not ways and share one marker. */
export const JUNCTION = -2;
export class GroundClaim {
  private readonly owner: Int32Array;
  private readonly cols: number;
  private readonly rows: number;
  private readonly originX: number;
  private readonly originZ: number;
  private readonly cell: number;

  constructor(radius: number) {
    // Half a metre: finer than any decision made from it — the narrowest band
    // in a street section is a 15 cm kerb — and cheap enough for a 3 km town.
    this.cell = Math.max(0.5, radius / 3000);
    const span = radius * 2.4;
    this.cols = Math.max(8, Math.ceil(span / this.cell) + 1);
    this.rows = this.cols;
    this.originX = -span / 2;
    this.originZ = -span / 2;
    this.owner = new Int32Array(this.cols * this.rows).fill(UNCLAIMED);
  }

  /**
   * Stake out the ground, strongest claim first.
   *
   * `junctions` are rings; `roads` are ways, and they are sorted here rather
   * than by the caller so the order cannot drift between the two places that
   * need it.
   */
  static build(
    roads: Road[],
    norm: StreetNorm,
    radius: number,
    junctions: Vec2[][] = [],
  ): GroundClaim {
    const claim = new GroundClaim(radius);
    // Exactly the ring, not a metre more. Claiming an apron round it was tried
    // and it emptied the junctions: the approaches yielded their asphalt over
    // ground the junction then did not draw, and a crossroads came out as
    // grass. A claim may only cover what its owner actually builds.
    for (const ring of junctions) claim.stampRing(ring, JUNCTION);

    const order = roads
      .map((road, index) => ({ road, index }))
      .filter(({ road }) => road.points.length > 1 && !road.tunnel && road.layer >= 0)
      .sort((a, b) => {
        const byRank = RANK[a.road.cls] - RANK[b.road.cls];
        if (byRank !== 0) return byRank;
        const byWidth = b.road.width - a.road.width;
        if (byWidth !== 0) return byWidth;
        // Stable whatever order the data arrived in.
        return a.road.id < b.road.id ? -1 : 1;
      });

    for (const { road, index } of order) {
      // A bridge is not on the ground and claims none of it.
      if (road.bridge) continue;
      // Only the carriageway and its kerb, and that is the whole point of the
      // rule. What has to stop is grass and paving being laid over a road
      // somebody drives on — the thing that is unmistakably wrong in a
      // picture. Claiming the verge and the embankment as well is defensible
      // on paper and ruinous in practice: a service road then yields its own
      // asphalt to a neighbour's grass verge, and the city loses its streets.
      claim.stampCorridor(road.points, carriagewayHalf(road, norm), index);
    }
    return claim;
  }

  /** Which way owns this point: a road index, `JUNCTION`, or `UNCLAIMED`. */
  ownerAt(x: number, z: number): number {
    const c = Math.round((x - this.originX) / this.cell);
    const r = Math.round((z - this.originZ) / this.cell);
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return UNCLAIMED;
    return this.owner[r * this.cols + c];
  }

  /**
   * May this way build here?
   *
   * True on its own ground and on ground nobody wanted. A way never builds on
   * a junction: at a crossing the crossing is what you see.
   */
  mayBuild(road: number, x: number, z: number): boolean {
    const owner = this.ownerAt(x, z);
    return owner === road || owner === UNCLAIMED;
  }

  /**
   * Lay a corridor of a given half-width along a polyline.
   *
   * Offset with the same function the renderer sweeps its section with, so
   * the claim and the geometry agree at bends. A mitre carries the outer edge
   * further out than the half-width on the outside of every corner — ground
   * the renderer then builds on and nobody had claimed.
   *
   * Segment by segment and not by distance to the whole line, so the claim
   * stops exactly where the way stops. A round cap past the last point would
   * claim ground the next way of the same street could not then build on, and
   * the street would come out with a gap at every joint.
   */
  private stampCorridor(points: Vec2[], half: number, owner: number): void {
    if (half <= 0 || points.length < 2) return;
    const { left, right } = offsetPolyline(points, half);
    for (let i = 0; i < points.length - 1; i++) {
      this.stampRing([left[i], left[i + 1], right[i + 1], right[i]], owner);
    }
  }

  /** Lay a ring. Only cells nobody has taken change hands. */
  private stampRing(ring: Vec2[], owner: number): void {
    if (ring.length < 3) return;
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const [x, z] of ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    const c0 = Math.max(0, Math.floor((minX - this.originX) / this.cell));
    const c1 = Math.min(this.cols - 1, Math.ceil((maxX - this.originX) / this.cell));
    const r0 = Math.max(0, Math.floor((minZ - this.originZ) / this.cell));
    const r1 = Math.min(this.rows - 1, Math.ceil((maxZ - this.originZ) / this.cell));

    for (let r = r0; r <= r1; r++) {
      const z = this.originZ + r * this.cell;
      for (let c = c0; c <= c1; c++) {
        const x = this.originX + c * this.cell;
        const at = r * this.cols + c;
        if (this.owner[at] !== UNCLAIMED) continue;
        if (inRing(x, z, ring)) this.owner[at] = owner;
      }
    }
  }
}

/** The paved half-width a way will not give up: asphalt and its kerb. */
function carriagewayHalf(road: Road, norm: StreetNorm): number {
  const section = streetSection(road, norm);
  let widest = road.width / 2;
  for (const edge of section) {
    if (edge.surface === 'carriageway' || edge.surface === 'kerb') {
      widest = Math.max(widest, edge.offset);
    }
  }
  return widest;
}

function inRing(x: number, z: number, ring: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i];
    const [xj, zj] = ring[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}
