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
| Bridge-to-road seam | Bridge ends use raw terrain; the connecting road uses the smoothed profile. They can differ by up to 0.6 m — a visible step at every bridge. Known, not fixed. |
| Traffic | Deferred by the user. IDM + MOBIL discussed as the model. `RoadIndex` was built with this in mind. |
| Collisions | Only building walls. No pedestrians, no vehicle-to-vehicle, no crash model — a car is stopped by a wall, not crumpled by it. |

## Tried and rejected

| Idea | Why not |
|---|---|
| GitHub Pages `enablement: true` in the workflow | "Resource not accessible by integration" — the workflow token cannot create a Pages site. The user enabled Pages by hand. |
| Treating a missing `sidewalk` tag as "no sidewalk" | The classic way to misread OSM. Missing means *unsurveyed*. In thinly-mapped towns that is almost everywhere. The audit distinguishes the two. |
| Drawing tram track on a ballast bed | Trams run embedded in the carriageway. Gravel down the middle of an Amsterdam street was the wrong picture entirely. Tram is also counted separately in the audit. |
