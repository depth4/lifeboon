# What was tried, and what came of it

The point of this file is to stop the same ground being walked twice. A
conversation ends and everything not written down is gone; this is what
survives.

**Rules for keeping it:** one row per real decision or dead end. Record the
*reason*, not just the outcome — a fix without its reason gets undone by the
next person who thinks it looks odd. Delete rows that stop being true rather
than letting the file rot.

---

## Settled: data sources

| Question | Answer | Why |
|---|---|---|
| Where does the map come from? | OpenStreetMap via Overpass API, 3 mirrors, cached in IndexedDB with a query version in the key | Only global source with buildings, roads and land cover under an open licence. Version in the cache key because a schema change once replayed stale data and looked like a bug. |
| Where does terrain come from? | AWS terrarium tiles, `elevation-tiles-prod`, z12 ≈ 20–30 m/px | CORS `*`, no key, no rate limit. Height = `R*256 + G + B/256 - 32768`. |
| Is there a global sidewalk dataset? | **No.** Checked properly. | Only Tile2Net exists, trained on three US cities. Sidewalks must be inferred or omitted — there is no third option. Researched in response to "а ты точно проверил всевозможные источники данных". |
| Can we show real architecture and roads? | Yes | See `DATA-AND-RIGHTS.md`. OSM is ODbL; buildings visible from public places are covered by freedom of panorama in most jurisdictions and by 17 U.S.C. §120(a) in the US. |
| Can we copy real car specifications? | Yes, the numbers | Published technical specs are facts and carry no rights. What we never copy: marque, model name, badge, body shape. |

## Settled: how the world is drawn

| Problem | What it turned out to be | Fix |
|---|---|---|
| All road ribbons invisible | `emitRibbon` wound triangles face-down | Fixed winding |
| All pavements invisible (measured: 31872 verts, 0 facing up) | The winding fix corrected the function but not its callers, which passed inner-to-outer edge lists | Fixed argument order. **Argument order in `emitRibbon` is load-bearing.** |
| Pavements invisible even when wound right | Pavement `0x9a958c` vs ground `0x9a9689` — three points of blue apart | Real colour gap plus a darker kerb line |
| Water invisible | Twice: first drawn below the base plane; later, satellite DEM reads a river at bank height and buries it | Carve river beds *before* building anything on the result |
| Missing small river | Narrow rivers are **lines** (`waterway=river/stream`) in OSM, not polygons; we only queried polygons | Query and draw waterway lines as ribbons |
| Bridges as flying roads | A bridge was a road at fixed `layer * 5 m` | `bridgeProfile`: chord between endpoint ground heights + sine arch. Ends flush with the road. |
| Depth flicker on rotate/zoom | Near plane fell to 0.08 m while far stayed 3 km | Near floor 0.6 m, far tied to view distance, logarithmic depth buffer |
| Land cover fighting the ground (**two wrong diagnoses**) | First blamed on nested polygons 1 cm apart — fixed, still broken. Real cause: the ground mesh's stretched grid had 200 m facets while land cover was subdivided to 16 m and hugged the true surface. | Uniform 10 m core grid |
| Tokyo came out as floating slabs | `layer` read as altitude. It is a **stacking order**. Every `layer=1` street hung 5 m up. Invisible in thinly-mapped towns. | Only `bridge=yes` lifts. Tunnels and negative layers not drawn. |
| Camera sinking into the ground on zoom | Hard height clamp | Minimum-pitch clamp: the camera leans in and looks down |
| Agents standing still | `leisure` treated as outdoors; strollers had no wander loop | Moved `leisure` to indoor, added hop-by-hop wandering. Outdoors 1930 → 408 with 117 walking. |

## Settled: streets as geometry

| Problem | What it turned out to be | Fix |
|---|---|---|
| The city "looked like buggy porridge" | Streets were three flat sheets floating at 0.28 / 0.31 / 0.38 m, and those numbers existed only to keep them out of each other's depth range. A kerb was a dark stripe painted at pavement level, so it had no edge to catch light and cast no shadow. Nothing in the arrangement was a fact about streets. | A street is now a **cross-section** — channel, kerb face, kerb top, verge, pavement, embankment — swept along the centreline as one continuous surface with shared vertices. Measured across a residential street: crown 0, channel −6.5 cm, kerb top +8.5, verge +4.5, pavement +8.5, embankment tying to ground at 8.9 m out. |
| Land cover drawn across roads | Everything was draped on untouched ground and separated by lift constants | The earth is **graded** to carry the street (cut and fill) before anything is built on it, so a park polygon crossing a road lies buried under the road structure. No lift constant does any work any more. |
| Grading dug a trench round every street | The first version cut to one flat depth, leaving the pavement half a metre above its surroundings | The cut follows the **shape of the section**, so ground under a pavement 8 cm above the crown is itself 8 cm higher. On level land the surroundings stay level. |
| Grading a 20 m elevation grid did nothing useful | A residential corridor is ~10 m wide; cutting that into a 20 m grid sags a block rather than carrying a road | `Heightfield.refinedTo(4 m)` first. Costs under a megabyte for a kilometre-wide city and adds no information — it just gives the grid somewhere to put detail that is added afterwards. |
| Grass growing across main roads | The section ran unbroken through every junction | `world/junctions.ts`: paving stops where another carriageway crosses, the minor road's asphalt gives way to the major one, and lane markings break. Ways are split exactly at each junction boundary so the interruption is the junction's size, not the straight's. |
| Ground mesh standing 1.1 m above a road the heightfield put 0.4 m below it | The mesh's core grid spans **2 × radius**, not radius. The first fix used the wrong factor and gave 8 m facets where 4 were wanted. | Derive `cells` from `2 * radius / (CORE_FRACTION * terrain.resolution)`. Measured: worst ground-over-road went 120 cm → 31 cm. |
| A bridge deck buried in a hillside | The arch is a sine, so a point a third of the way along gets only ~87% of it — but the arch was sized from the bare deficit, which clears the obstacle only if the obstacle sits at mid-span | Size it by `deficit / sin(t·π)`. Measured on the offline city: 120 cm of hill above the deck → 29 cm. |
| Grass hanging over the river | `carveTo` cut the bed to full depth right up to the outline, so the bank was a vertical wall and no ground mesh could follow it (4.8 m of daylight measured at the water's edge) | The bed shelves up to meet the bank over 8 m, via a chamfer distance transform on the water mask. Line waterways get a parabolic channel for the same reason. |
| The city as a square slab on a billiard table | `heightAt` clamped to the edge outside the loaded area, so the surroundings were four flat quadrants at the corner heights joined by ruled ramps — measured at exactly 17.06 m from 1 km out to the horizon in one direction | Invent the surroundings: release the edge sample towards the region's mean and add three octaves of value noise, ramped in from zero at the boundary so no measured sample is ever contradicted. Amplitude comes from the relief the city itself has. |

## Settled: the car

| Decision | Reasoning |
|---|---|
| Split physics by **axis**, not by vehicle | Longitudinal (engine, gears, resistance, grip) runs for every vehicle. Lateral detail only near the camera. One car definition, one set of numbers: a distant car and the player's car agree on top speed and on whether they climb the hill. |
| Torque curve is a parabola through the two published peaks | Manufacturers publish peak torque and peak power and nothing between. A parabola through both reproduces top speed and acceleration closely enough. Validated: microcar 117 km/h vs quoted 130, 0–100 in 34 s vs quoted 24. |
| Wear scales existing parameters, never a separate system | A tired car is then genuinely a different car to drive, not the same car with a warning light — and it costs nothing, the multiplications were happening anyway. |
| Steering limited by **grip**, not by a speed curve | `v² tan(δ) / L` must stay under what the tyres have. Falls out of the same friction number as wheelspin and stopping distance, so ice makes the car vague for the same reason it makes it slow to stop. Slow-speed turning circle measured at 3.33 m against 3.33 m predicted. |
| Friction circle, not a flat cornering tax | The first version reserved 15% of grip for cornering *always*, even coasting, and penalised off-road grip twice. It felt like the car refused to turn. Now: one budget, shared. Cornering at 25 m/s went 4.36 → 8.30 m/s². |
| Reverse reuses the same physics with a one-gear box | Its 35 km/h ceiling is then the ratio and the rev limiter, not a number somebody picked. |
| A car inside a building footprint may drive out | Footprints and streets overlap in real data — arcades, gateways, courtyard service roads. The first version welded the car to the spot forever the moment it spawned in one. |

## Open questions

| Question | Status |
|---|---|
| Do we allow **invented** interiors? | Raised twice, never answered. The user's own wish list (furnishing a flat, sitting in a bar) requires interiors; the stated rule forbids them. Needs a decision before any indoor feature. |
| Sidewalks: infer them, or leave streets bare? | User said "сначала пройдись по данным, потом делай уже нормальные тротуары". Data audit done: Alapaevsk has 0 of 187 streets with a sidewalk tag; Amsterdam has 1349 of 2477. No global dataset exists. Decision still pending. |
| Calibrating guessed building heights | Alapaevsk: 0% surveyed heights, 97% guessed by us. GHS-BUILT-H is a 100 m global raster that could calibrate the guess. Shares plumbing with the terrain tile loader. Not started. |
| Bridge-to-road seam | Bridge ends use raw terrain; the connecting road uses the smoothed profile. They can differ by up to 0.6 m — a visible step at every bridge. Known, not fixed. The bridge is also the one way that is not graded, so a neighbouring street's fill can rise against its abutment. |
| A long river carved to one level | `carveWaterways` takes the lowest ground around a water polygon's whole outline and cuts the entire thing to it. For a 1.9 km river crossing 50 m of relief that is a gorge, not a river. Line waterways already get a downhill profile; polygons need the same. **This is the largest remaining "стык".** |
| Junction shape | Paving now stops at a junction, but there are no corner radii, no splayed entries, no stop lines, and no junction polygon. The crossing reads correctly from above and blockily from the ground. |
| Ground beyond the loaded area | Terrain is invented and continuous, but there is no land cover, no field pattern and no woodland out there — one flat colour to the horizon. |
| Land cover coverage | Measured on the offline city: 13% of the loaded area falls inside any land-cover polygon, 33% inside a building. The remaining half is bare ground colour. Real OSM is usually worse. The user has authorised inventing it from norms; nothing is built yet. |
| Traffic | Deferred by the user. IDM + MOBIL discussed as the model. `RoadIndex` was built with this in mind. |
| Collisions | Only building walls. No pedestrians, no vehicle-to-vehicle, no crash model — a car is stopped by a wall, not crumpled by it. |

## Tried and rejected

| Idea | Why not |
|---|---|
| Switching from Three.js to CesiumJS | Every bug measured so far is in our own geometry generation, not in the renderer. Cesium is a geospatial *viewer*: it brings a globe, terrain LOD, 3D Tiles streaming and OSM buildings, but ground-level driving, a custom ground partition, our own materials and a physics loop all fight it. What is worth borrowing later is the *streaming format* (3D Tiles, for which there is a mature three.js implementation from NASA JPL), not the renderer. |
| Streaming the whole country from Overpass | Overpass is a query service under fair-use limits; a continuous drive would hammer it and get blocked. Moscow to Vladivostok needs pre-tiled data — Protomaps ships the planet as one ~120 GB PMTiles archive served by HTTP range requests, and Overture has 2.6 bn buildings with estimated heights. Both are a data-pipeline project, not a rendering one, and the base picture comes first. |
| GitHub Pages `enablement: true` in the workflow | "Resource not accessible by integration" — the workflow token cannot create a Pages site. The user enabled Pages by hand. |
| Treating a missing `sidewalk` tag as "no sidewalk" | The classic way to misread OSM. Missing means *unsurveyed*. In thinly-mapped towns that is almost everywhere. The audit distinguishes the two. |
| Drawing tram track on a ballast bed | Trams run embedded in the carriageway. Gravel down the middle of an Amsterdam street was the wrong picture entirely. Tram is also counted separately in the audit. |
