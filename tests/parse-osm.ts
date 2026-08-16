/**
 * Exercises the OSM import path against a hand-built Overpass response.
 * The live path cannot be reached from the build container, so this stands in:
 * it covers the shapes that actually break parsers — multipolygons with holes,
 * unclosed ways, height tags in odd units — and the brand-stripping rule.
 */
import { parseOsm } from '../src/data/osm';
import type { OverpassResponse } from '../src/data/overpass';

const bbox = { south: 52.369, west: 4.894, north: 52.371, east: 4.897 };

// ~30 m square at the centre of the bbox.
const dLat = 30 / 110574;
const dLon = 30 / (111320 * Math.cos((52.37 * Math.PI) / 180));
const lat0 = 52.3700;
const lon0 = 4.8950;

const square = (la: number, lo: number, s = 1) => [
  { lat: la, lon: lo },
  { lat: la + dLat * s, lon: lo },
  { lat: la + dLat * s, lon: lo + dLon * s },
  { lat: la, lon: lo + dLon * s },
  { lat: la, lon: lo }, // closed, as Overpass returns it
];

const response: OverpassResponse = {
  elements: [
    // 1. Bare building=yes, no height at all — the commonest case in OSM.
    { type: 'way', id: 1, tags: { building: 'yes' }, geometry: square(lat0, lon0) },

    // 2. Tagged levels; should be 5 * 3.2 + margin.
    {
      type: 'way',
      id: 2,
      tags: { building: 'apartments', 'building:levels': '5' },
      geometry: square(lat0 + dLat * 2, lon0),
    },

    // 3. Height in feet, which parseHeight has to convert.
    {
      type: 'way',
      id: 3,
      tags: { building: 'office', height: "82'" },
      geometry: square(lat0 + dLat * 4, lon0),
    },

    // 4. Multipolygon building with a courtyard: two unordered, reversed
    //    fragments for the outer ring, which the stitcher must reassemble.
    {
      type: 'relation',
      id: 10,
      tags: { building: 'residential', type: 'multipolygon' },
      members: [
        {
          type: 'way', ref: 101, role: 'outer',
          geometry: [
            { lat: lat0 + dLat * 8, lon: lon0 + dLon * 4 },
            { lat: lat0 + dLat * 8, lon: lon0 },
            { lat: lat0 + dLat * 4 * 1.0 + dLat * 4, lon: lon0 },
          ].slice(0, 2).concat([{ lat: lat0 + dLat * 8, lon: lon0 }]),
        },
        // Second fragment given tail-first, to force a reversal.
        {
          type: 'way', ref: 102, role: 'outer',
          geometry: [
            { lat: lat0 + dLat * 8, lon: lon0 },
            { lat: lat0 + dLat * 6, lon: lon0 },
            { lat: lat0 + dLat * 6, lon: lon0 + dLon * 4 },
            { lat: lat0 + dLat * 8, lon: lon0 + dLon * 4 },
          ],
        },
        {
          type: 'way', ref: 103, role: 'inner',
          geometry: square(lat0 + dLat * 6.5, lon0 + dLon * 1, 1),
        },
      ],
    },

    // 5. A street: unclosed way, must become a road and not an area.
    {
      type: 'way',
      id: 4,
      tags: { highway: 'residential', name: 'Testgracht', lanes: '2' },
      geometry: [
        { lat: lat0 - dLat, lon: lon0 - dLon * 2 },
        { lat: lat0 - dLat, lon: lon0 + dLon * 6 },
      ],
    },

    // 6. A footpath, walkable but not drivable.
    {
      type: 'way',
      id: 5,
      tags: { highway: 'footway' },
      geometry: [
        { lat: lat0 - dLat * 2, lon: lon0 - dLon * 2 },
        { lat: lat0 - dLat * 2, lon: lon0 + dLon * 6 },
      ],
    },

    // 7. Water.
    {
      type: 'way',
      id: 6,
      tags: { natural: 'water' },
      geometry: square(lat0 - dLat * 6, lon0, 3),
    },

    // 8. A branded cafe sitting inside building 1. The brand must not survive.
    {
      type: 'node',
      id: 7,
      lat: lat0 + dLat * 0.5,
      lon: lon0 + dLon * 0.5,
      tags: { amenity: 'cafe', name: 'Starbucks', brand: 'Starbucks', operator: 'Starbucks EMEA' },
    },

    // 9. A shop with no recognised category beyond `shop`.
    {
      type: 'node',
      id: 8,
      lat: lat0 + dLat * 2.5,
      lon: lon0 + dLon * 0.5,
      tags: { shop: 'supermarket', name: 'Albert Heijn' },
    },

    // 10. Something we do not model at all — must be dropped silently.
    { type: 'node', id: 9, lat: lat0, lon: lon0, tags: { man_made: 'surveillance' } },

    // 11. Railway: track, not a road, and never walkable.
    {
      type: 'way',
      id: 11,
      tags: { railway: 'rail', tracks: '2' },
      geometry: [
        { lat: lat0 - dLat * 9, lon: lon0 - dLon * 3 },
        { lat: lat0 - dLat * 9, lon: lon0 + dLon * 7 },
      ],
    },

    // 12. A street that has been surveyed and does have pavements.
    {
      type: 'way',
      id: 12,
      tags: { highway: 'residential', sidewalk: 'both' },
      geometry: [
        { lat: lat0 + dLat * 10, lon: lon0 },
        { lat: lat0 + dLat * 10, lon: lon0 + dLon * 5 },
      ],
    },

    // 13. A street surveyed as having none — a different fact from silence.
    {
      type: 'way',
      id: 13,
      tags: { highway: 'residential', sidewalk: 'no' },
      geometry: [
        { lat: lat0 + dLat * 12, lon: lon0 },
        { lat: lat0 + dLat * 12, lon: lon0 + dLon * 5 },
      ],
    },

    // 14. A pavement mapped as its own line.
    {
      type: 'way',
      id: 14,
      tags: { highway: 'footway', footway: 'sidewalk' },
      geometry: [
        { lat: lat0 + dLat * 10.4, lon: lon0 },
        { lat: lat0 + dLat * 10.4, lon: lon0 + dLon * 5 },
      ],
    },

    // 15. A marked crossing.
    {
      type: 'node',
      id: 15,
      lat: lat0 + dLat * 10,
      lon: lon0 + dLon * 2,
      tags: { highway: 'crossing' },
    },

    // 16. Railway platform — tagged `railway` but not track; must be ignored.
    {
      type: 'way',
      id: 16,
      tags: { railway: 'platform' },
      geometry: square(lat0 - dLat * 11, lon0, 1),
    },
  ],
};

const world = parseOsm(response, bbox, 'Test area');

let failures = 0;
function check(label: string, ok: boolean, detail?: unknown) {
  if (ok) {
    console.log(`  ok   ${label}`);
  } else {
    failures++;
    console.log(`  FAIL ${label}${detail !== undefined ? ` -> ${JSON.stringify(detail)}` : ''}`);
  }
}

console.log('buildings:', world.buildings.length, 'roads:', world.roads.length,
  'areas:', world.areas.length, 'pois:', world.pois.length);

check('4 buildings parsed (3 ways + 1 relation)', world.buildings.length === 4, world.buildings.length);
check('1 water area', world.areas.filter((a) => a.kind === 'water').length === 1);
// One street, one footway, two surveyed streets, one mapped pavement line.
check('5 roads', world.roads.length === 5, world.roads.length);
check('2 POIs kept, unmodelled node dropped', world.pois.length === 2, world.pois.length);

const b1 = world.buildings.find((b) => b.id === 'w1')!;
check('bare building=yes gets a plausible inferred height',
  b1.height > 4 && b1.height < 25, b1.height);
check('bare building=yes footprint is ~900 m2', Math.abs(b1.area - 900) < 60, b1.area);
check('bare building=yes treated as residential', b1.kind === 'residential', b1.kind);
check('residential building has capacity', b1.capacity >= 1, b1.capacity);

const b2 = world.buildings.find((b) => b.id === 'w2')!;
check('building:levels=5 -> ~17 m', Math.abs(b2.height - 17.2) < 0.5, b2.height);
check('building:levels=5 -> 5 levels', b2.levels === 5, b2.levels);

const b3 = world.buildings.find((b) => b.id === 'w3')!;
check("height 82' converted from feet to ~25 m", Math.abs(b3.height - 24.99) < 0.3, b3.height);
check('office kind detected', b3.kind === 'office', b3.kind);

const rel = world.buildings.find((b) => b.id.startsWith('r10'))!;
check('multipolygon relation became a building', !!rel);
check('relation outer ring stitched from fragments', rel && rel.ring.length >= 4, rel?.ring.length);
check('relation courtyard kept as a hole', rel && rel.holes.length === 1, rel?.holes.length);

const street = world.roads.find((r) => r.id === 'w4')!;
check('street name kept (geography, not a brand)', street.name === 'Testgracht', street.name);
check('street is drivable and walkable', street.drivable && street.walkable);
check('2 lanes -> ~6.4 m wide', Math.abs(street.width - 6.4) < 0.3, street.width);

const path = world.roads.find((r) => r.id === 'w5')!;
check('footway walkable but not drivable', path.walkable && !path.drivable);

const cafe = world.pois.find((p) => p.id === 'n7')!;
check('cafe categorised as food', cafe.kind === 'food', cafe.kind);
check('cafe matched to the building it sits in', cafe.buildingId === 'w1', cafe.buildingId);
check('no brand survives on the POI object',
  !JSON.stringify(cafe).toLowerCase().includes('starbucks'), cafe);

const shop = world.pois.find((p) => p.id === 'n8')!;
check('supermarket categorised as groceries', shop.kind === 'groceries', shop.kind);
check('no brand anywhere in the parsed world',
  !JSON.stringify(world).toLowerCase().includes('albert heijn'));

// --- railways -------------------------------------------------------------
check('one railway parsed, platform ignored', world.railways.length === 1, world.railways.length);
check('railway track count read', world.railways[0]?.tracks === 2, world.railways[0]?.tracks);
check('railway is not a road', !world.roads.some((r) => r.id === 'w11'));

// --- pavement provenance --------------------------------------------------
const surveyedYes = world.roads.find((r) => r.id === 'w12')!;
const surveyedNo = world.roads.find((r) => r.id === 'w13')!;
check('sidewalk=both read', surveyedYes.sidewalk === 'both', surveyedYes.sidewalk);
check('sidewalk=no read', surveyedNo.sidewalk === 'no', surveyedNo.sidewalk);
check(
  'a street with no sidewalk tag stays undefined, not "no"',
  street.sidewalk === undefined,
  street.sidewalk,
);
check('footway=sidewalk flagged as its own pavement line',
  world.roads.find((r) => r.id === 'w14')?.isSidewalkLine === true);

// --- the coverage audit ---------------------------------------------------
const audit = world.audit!;
check('audit produced for OSM data', !!audit);
check('audit counts all buildings', audit.buildingsTotal === 4, audit.buildingsTotal);
check('audit counts the surveyed height', audit.buildingsWithHeight === 1, audit.buildingsWithHeight);
check('audit counts storey-only buildings', audit.buildingsWithLevels === 1, audit.buildingsWithLevels);
check('audit counts guessed heights', audit.buildingsGuessed === 2, audit.buildingsGuessed);
check('audit counts pavement-capable streets', audit.streetsTotal === 3, audit.streetsTotal);
check('audit counts surveyed streets', audit.streetsWithSidewalkTag === 2, audit.streetsWithSidewalkTag);
check('audit splits present vs absent pavements',
  audit.sidewalkYes === 1 && audit.sidewalkNo === 1, [audit.sidewalkYes, audit.sidewalkNo]);
check('audit counts crossings', audit.crossings === 1, audit.crossings);
check('audit measures railway length', audit.railwayKm > 0.2 && audit.railwayKm < 0.4, audit.railwayKm);
check('audit measures separately-mapped footways', audit.roadKmFootway > 0, audit.roadKmFootway);

check('stats report the OSM source', world.stats.source === 'osm');
check('attribution present', world.stats.attribution.includes('OpenStreetMap'));
check('radius derived from bbox (~110 m half-height)',
  world.radius > 90 && world.radius < 130, world.radius);

console.log(failures ? `\n${failures} FAILURE(S)` : '\nall checks passed');
process.exit(failures ? 1 : 0);
