# Where this project stands

Written at the point where the user said they would probably start again from
a clean slate. It is the honest inventory: what exists, what is proven, what is
broken, what a rewrite should keep and what it should burn.

Read `CLAUDE.md` first for how to work here. This file is the *state*.

---

## 1. In one paragraph

Lifeboon loads a real place from OpenStreetMap, builds terrain under it from
real elevation tiles, and draws a 3D city you can drive a car around. About
15 500 lines of TypeScript. The world model, the terrain, the car physics and
the OSM tag interpretation are solid and measured. The **renderer draws
directly from OSM ways**, and that is the architectural fault line: every
recurring bug — ground poking through roads, doubled pavements, junctions that
are separate plateaux, overlapping road surfaces — comes from geometry being
derived from map data at draw time instead of from a world model that owns the
ground it stands on. A road network model (`src/world/network.ts`) was built
as the beginning of the fix; nothing renders from it yet.

---

## 2. What exists

| Area | Files | State |
|---|---|---|
| OSM import | `data/osm.ts`, `data/tags.ts` (936 lines together) | **Solid.** Tag interpretation is the most hard-won code here: what a way is worth, how wide, how many lanes, what a building's height is from `levels`/`height`/feet. Tested. |
| Overpass fetch + cache | `data/overpass.ts` | Works in a browser. **Blocked by the agent proxy**, so never verifiable from the sandbox. |
| Place capture | `data/fixture.ts`, `tests/place.ts` | **Solid and important.** Exports the parsed world + raw terrain to one gzipped file (~0.2 MB for a small town) and reads it back. This is the only way a real town can be measured or looked at from the sandbox. |
| Offline city | `data/procedural.ts` | Generates a fake city for tests. Useful, but the **wrong topology**: long ways crossing through each other, where OSM splits every street at every junction. |
| Terrain | `terrain/heightfield.ts` (884), `terrain/elevation.ts` | **Solid.** Real 20–30 m elevation, resampled to 4 m over the street bounds, then `gradeStreets` cuts the earth to carry the streets and `gradePads` warps junction pads. The shoulder rule (earth may not stand above the back of the pavement for ~1 mesh cell past the built edge) is what makes poke-through structurally rare rather than accidentally rare. |
| Waterways | `terrain/waterways.ts` | **Broken.** See §4.1. |
| Road cross-section | `world/roadprofile.ts` (489), `world/street.ts` | **Solid.** A street is a swept profile — channel, kerb face, kerb top, verge, pavement, batter — with real heights and real vertical faces. Computed once on un-graded ground and shared by renderer, grading and car. |
| Junctions | `world/junctions.ts` (812) | **Half solid.** The shape construction (approach bearings, outward kerb fillets, warped ring, `junctionHeightAt`) is right: 1 folded ring out of 454. The *discovery* half duplicates what the network already knows. |
| Road network | `world/network.ts` (547) | **New, tested, unused by the renderer.** Nodes / edges / streets / lanes / turns, welded from shared OSM points. Alapaevsk: 902 nodes, 1136 edges, 605 streets, 1937 lanes, 3868 turns, 132 crossroads, 288 T-junctions, 205 dead ends, 91.1 km of kerbside parking. |
| Ground | `render/ground.ts`, `groundgrid.ts`, `areafield.ts`, `streetmask.ts`, `claims.ts` | **One surface.** Land cover is paint sampled from a raster, not a mesh over the earth; streets cut the ground away rather than lying on it; `claims.ts` decides which way owns each square metre so two ways stop drawing over each other. |
| Roads renderer | `render/roads.ts` (1333) | **The problem child.** Sweeps OSM ways directly into geometry, with end fills, junction patches, band yielding and ownership tests bolted on. Every rule in `CLAUDE.md` about lifts and cuts exists because of this file. |
| Buildings, props, people | `render/buildings.ts` (547), `props.ts`, `people.ts` | Work. Closed shells, no interiors, no brands. Triangle budget matters: instanced props multiply. |
| Look | `render/palette.ts`, `textures.ts` | Works. Little contrast between materials, real variation within each, all varied by one world-space noise. |
| Car | `sim/vehicle.ts`, `sim/driver.ts` | **Solid and validated against real numbers**: top speed ~130 km/h for a city microcar, 0–100 scaling with power/weight, braking distance from 60, a 12 % hill costing most of the speed, one grip number spent by driving, braking and cornering together. |
| Navigation | `sim/navgraph.ts`, `sim/roadindex.ts` | Works, but is a *third* notion of where streets meet. See §4.4. |
| Population | `sim/population.ts` (529) | Invented, statistical inhabitants. |
| Tests | `tests/` × 5 suites, 138+ checks | `npm test`. All green. `tests/ground.ts` needs no browser: it rebuilds the mesh the renderer would build and samples across every street — arithmetic, not screenshots. |

---

## 3. The numbers, today

Measured on the user's own 3 km Alapaevsk capture (`npm run place`), 458 ways,
1779 buildings, 58.3 m of relief:

```
mesh cells 8.14 m · shoulder 13.0 m
away from crossings : 1.72% of 702856 samples poke through, worst 953.8 cm, typical gap 18.9 cm
at a crossing       : 2.10% of 102689 samples poke through, worst  86.8 cm, typical gap 14.2 cm
past the loaded edge: 2.96% of 188532 samples poke through, worst  71.2 cm, typical gap 20.9 cm
```

On the synthetic hillside in `tests/ground.ts` the same measurement is
**0.00 %** (worst −4 cm). That gap between a clean test scene and a dirty real
town is the most useful single fact in this file, and §4.2 is why.

Other measured facts:

- Road surfaces overlapping each other: **2.52 % → 1.30 %** (rasterised at
  25 cm over a 300 m window). Remaining pairs are paving+verge, paving+surface,
  surface+verge, spread evenly — **not** concentrated at junctions.
- Folded junction rings: 265 of 454 → **1 of 454**.
- Bridges treated as junctions: 10.2 m of earth raised under one deck → gone.
- Car sinking into pedestrian paving: −20 cm → **0**.

---

## 4. What is still wrong

### 4.1 The river (worst single defect: 9.5 m)

`carveWaterways` cuts an entire water polygon down to **one** level. A river
that drops 6 m along its length becomes a gorge, and a street beside it hangs
in the air. This is the largest geometry error in the whole city and it is
caused by four lines of code. A river must be carved along its **flow**, level
falling with the channel.

### 4.2 A big city gets a coarse mesh

The ground mesh is capped, so a 3 km radius means **8.14 m cells** and a
**13 m shoulder**. Grading then has to flatten a strip far wider than the
street to keep the earth below the pavement. The synthetic test uses 4 m cells
and comes out perfect; the real town does not. Any fix that is validated only
on the test scene is validated on the easy case.

### 4.3 The renderer reads OSM, not a model

`render/roads.ts` decides geometry from ways. So two parallel OSM ways (a
service road drawn 4 m from the street it serves) both build a full
cross-section over the same earth, and the only defence is a raster of ground
claims applied afterwards. **This is the architectural fault**, and everything
in §4.2–§4.5 is downstream of it.

### 4.4 Three notions of "where streets meet"

`navgraph` welds at 0.6 m, `junctions` clusters at 6 m, `roadindex` has no
notion at all, `network` welds at its own tolerance. They disagree, and each
disagreement is a class of bug. There must be exactly one.

### 4.5 Nothing for courtyards or parking areas

OSM maps no Russian дворы. 129 of Alapaevsk's 243 service roads lead inward
and stop. The model has no concept of a `Place` — an area with entrances from
network nodes, filled with parked cars — so those roads lead nowhere and the
city reads as empty.

### 4.6 Boolean geometry, hand-rolled four times

Found by an outside reviewer reading the source, and it is sharper than
anything in this file was: polygon boolean operations were **rejected** as a
technique (see §6), and then reimplemented four times, in four representations
that cannot be reconciled with one another.

| Where | Representation | Resolution |
|---|---|---|
| `world/junctions.ts` | Constructive union of two street bands: approach bearings, meet points, outward fillets | exact, analytic |
| `render/claims.ts` | Ownership raster, `Int32Array` of way indices | `max(0.5, radius/3000)` = **0.5 m** at a 1500 m radius |
| `render/streetmask.ts` | Paved-area raster, `Uint8Array` | `max(1, radius/500)` = **3 m** at the same radius |
| `render/roads.ts` | Per-segment boolean arrays: `combine`, `invert`, `pavementBands`, the per-band `yielded` test | one flag per segment of one way |

All four answer versions of the same question — *which square metre is covered
by what* — and they answer it differently. The two rasters differ by a factor
of six in cell size alone. Every "the pavement is doubled here and missing
there" bug lives in the gaps between these four.

This reframes §4.3. The renderer reading OSM is the cause; **this** is the
shape the damage took. And it puts the rejection of a real boolean library back
on the table: refusing the technique did not avoid the complexity, it scattered
it.

### 4.7 No traffic worth the name

Cars follow a nav graph, not lanes. No signals, no priorities, no give-way, no
queueing. The lane and turn model exists to make this possible; none of it is
wired up.

---

## 5. The architecture question, and the honest answer

The user's own proposal, in their words:

> «Мы решим все проблемы, если сначала сделаем графику, систему для обычного
> симулятора вроде City Skylines. С тераформацией рельефа, светофорами и так
> далее. И уже потом будем строить не в точь в точь от данных. А будем
> отдельно экспортировать их в систему линий и узлов. И уже поверх них
> накладывать обычную систему симулятора.»

**This is correct.** It is not a preference, it is the difference between
bugs that get fixed and bugs that get negotiated with. Concretely it means:

1. **A road is *placed*, not *drawn*.** One builder function puts a road into
   the world: it welds into the network, cuts the terrain, and claims the
   ground it stands on — in one operation, at build time. Whether a human
   placed it in an editor or an importer placed it from OSM is irrelevant to
   everything downstream.
2. **Terraforming is a world operation**, not a pre-pass. The terrain is
   editable; placing a road edits it; nothing later has to negotiate about
   whose earth is whose.
3. **The importer's only job** is OSM → nodes, edges, class, width hints. All
   correction — reconciling a street's widths, welding junctions, fixing bad
   tags, discarding a way that duplicates another — happens in the model,
   before geometry exists. Bad data is corrected once, in one place.
4. **The renderer reads the model and never reads OSM.**

What this buys, beyond tidiness: the whole class of "ground pokes through the
road" becomes *structurally impossible* rather than statistically rare,
because the road owns the ground under it and there is no second opinion. And
lanes, signals, parking, courtyards and traffic stop being features to add —
they are properties of a model that already exists.

### Keep, on a clean slate

Rewriting these would be pure waste; they are correct and paid for:

- `data/tags.ts` + `data/osm.ts` — tag interpretation, ~900 lines of knowledge.
- `data/fixture.ts` + `tests/place.ts` — without the capture there is no way to
  verify anything against a real town from a sandbox.
- `terrain/elevation.ts` — tile fetch and mosaic.
- `terrain/heightfield.ts` — the grading maths, the shoulder rule, the
  `owner`/`claimed` tie-break that fixed a measured 47 cm bug.
- `world/roadprofile.ts`, `world/street.ts` — the cross-section.
- `world/network.ts` — this is the *start of the new architecture*, not part of
  the old one.
- `world/junctions.ts`, the shape half: outward kerb fillets, ring warping,
  `junctionHeightAt`.
- `sim/vehicle.ts`, `sim/driver.ts` — validated against real numbers.
- `render/palette.ts`, `render/textures.ts`, `render/groundgrid.ts`.
- Every test.

### Burn

- `render/roads.ts` as it stands. Replaced by "render the network".
- `world/junctions.ts`, the discovery half (`findCrossings`) — the network
  already knows where ways meet.
- `render/claims.ts` — ground ownership becomes intrinsic to placement, not a
  raster applied afterwards.
- `terrain/waterways.ts` — rewrite along the flow.

### The order to build in

1. Terrain that can be edited: heightfield + `cut(polygon, profile)`.
2. The network as the *only* source of roads (half exists already).
3. The builder: place a road → weld + cut + claim, one operation.
4. Render the network. Nothing renders from OSM.
5. The importer: OSM → builder calls. All correction lives here.
6. Junctions as first-class network objects: priorities, then signals.
7. `Place`: courtyards and car parks as areas attached to network nodes.
8. Traffic on lanes.

Each step is shippable and visible. Step 4 is where the user would first see
the difference.

---

## 6. What was tried and did not work

So it is not tried again:

- **Lifting one surface above another** to stop z-fighting or poke-through.
  Every recurring bug in this project started with a constant added to hold two
  surfaces apart. Give them different places in a cross-section instead.
- **A second mesh for land cover** over the ground. Became paint on the one
  ground surface.
- **Kerb fillets curving inwards** at a junction. The paved area is the *union*
  of two bands, so the corner is reflex and the fillet reaches **outwards**.
  Getting this backwards folded 265 of 454 rings.
- **Parking as extra width.** Widened every residential street by 4 m and
  invented 29 000 spaces in a town of 37 000 people. Parking comes *out of*
  the street width.
- **Treating a bridge as a junction** with the street it flies over. 10.2 m of
  earth raised under a deck.
- **Widening the ground cut to save triangles.** An overshoot is a window
  through the world to the sky.
- **Judging a band by its centre line.** Half of it then lies on somebody
  else's ground.
- **Measuring overlap on a 1.5 m grid.** Counted adjacent bands as stacked and
  reported 14 % where the truth was 2.5 %. A renderer was nearly rewritten on
  that number.

---

## 7. How to not waste the next session

The process lessons cost more than the code did.

- **Measure, do not guess.** Three confident diagnoses in one session were
  disproved by measurements taken minutes later: that junction discovery was
  wrong (it was 99 % right), that overlap concentrated at junctions (it is
  spread evenly), that the junction/approach seam was the cause (it is parallel
  ways, 15.1 % of sampled length).
- **Look at the picture before committing.** A release shipped with the whole
  suite green and one swapped argument that drew pavement only where the map
  already had a footway and grass everywhere else. No number was measuring what
  was drawn. Load the user's capture in the sandbox browser and screenshot it —
  two minutes.
- **Ask for a capture before guessing** about real-world data. Overpass is
  blocked here; the capture is the only real town available.
- **Test on a hard city.** The `layer`-as-altitude bug survived because
  Alapaevsk and Amsterdam barely use the tag; Tokyo does.
- **Write the rule down here, not in a new constant.** If a fix needs a rule to
  hold, the rule belongs in `CLAUDE.md`, and if it needs a crutch to hold, the
  architecture is wrong.

---

## 8. Working with more than one model

Relevant because a hard week of Opus costs a week of allowance. Split by what
the work actually is:

- **Architecture, diagnosis, anything where being wrong is expensive** —
  the strongest model available, in short focused chats.
- **Mechanical work** — writing tests, moving code, renames, wiring, running
  measurements and reporting the numbers — a cheaper model does this as well
  and burns allowance far slower. In Claude Code, `/model` switches.
- **Reading the whole repo at once** — a long-context model is genuinely
  better at "find every place that disagrees about X" than a strong model with
  a small window.
- **The real saving is not the model.** It is fewer wrong hypotheses, which
  means measuring first; and smaller files, because `roads.ts` at 1333 lines is
  re-read into context every session that touches roads.
