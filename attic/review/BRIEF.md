# Lifeboon — a second opinion is wanted

**Repository (public):** https://github.com/depth4/lifeboon
**Branch:** `claude/world-map-life-simulator-wthhom` (this is the project; there is no `main`)

> **Status, 2026-08-21.** The first panel's central finding — that the renderer
> derived geometry from OpenStreetMap ways at draw time, and that ground
> ownership had four incompatible representations — has been acted on.
> `render/roads.ts` and `render/claims.ts` are deleted; the world is now built
> out of **parts** (`docs/PARTS.md`), functional units that own the ground they
> stand on cell by cell. Read `docs/PARTS.md` alongside this file: the sections
> below describing the road renderer are history, kept because they are why.

You are being asked to review an architecture, not to fix a bug. The person who
owns this project is not a programmer; they have been building it with an AI
coding agent for about a week, and the same class of defect keeps coming back
after each fix. They want to know **what went wrong structurally, and what the
right shape would be.** Be blunt. A wrong-but-specific answer is more useful
here than a correct-but-generic one.

If your tooling can clone, do — everything below is in the repo, and
`docs/STATE.md` is the long version of this file.

---

## 1. What the thing is

A **browser life simulator built on real OpenStreetMap data**. You pick a real
place; it downloads the OSM ways for that area and real elevation tiles, builds
a 3D city, and you can drive a car around it. Vite + TypeScript + Three.js,
deployed to GitHub Pages. ~15 500 lines of TypeScript, no game engine.

The long-term intent, in the owner's words: a simulation dense with formulas
backed by real research — clothing affecting whether you get attacked, humidity
and air pollution affecting long-term health — and, nearer term, **realistic
city traffic**: lanes, signals, priorities, parking, courtyards. Nothing
invented where a real number exists.

Hard product constraints (settled, not up for review):

- No building interiors. Buildings are closed shells.
- No brand names. A shop's category survives import; its name does not.
- No real people. Inhabitants are invented and statistical.
- Real map data. Not procedural cities. The town the owner tests on is
  Alapaevsk, Sverdlovsk Oblast — a small Russian town with real relief.

Technical envelope:

- One WebGL canvas, target 60 fps on a laptop GPU.
- Loaded area is a disc of radius 1500 m (3 km across) for a small town.
- Measured, in view, on that town: **3.68 M triangles, 21 draw calls, 12
  meshes**. Of that the bare ground mesh is **524 288 triangles** — a 512 x 512
  grid, doubled — and it is at its cap.
- The budget is real and has bitten: 6 600 trees at 540 triangles per canopy
  once put the scene at 9.3 M triangles. Canopies were cut to 120 triangles to
  get back to 3.7 M. There is no headroom for another half-million-triangle
  surface.

---

## 2. How it is built today

```
OSM ways ─┐
          ├─► parse (tags → class, width, lanes, oneway, layer, bridge)
elevation ┘
             │
             ├─► Heightfield: 20-30 m samples, resampled to 4 m over the
             │   street bounds, rivers carved, then gradeStreets() cuts the
             │   earth down to carry every street's cross-section
             │
             ├─► RoadNetwork.build()  ← nodes/edges/streets/lanes/turns.
             │   EXISTS, TESTED, AND NOTHING RENDERS FROM IT.
             │
             └─► render/roads.ts (1333 lines): sweeps each OSM way into a
                 cross-section — channel, kerb face, kerb top, verge,
                 pavement, batter — plus end fills, junction patches, and a
                 raster of "ground claims" deciding which way is allowed to
                 build on each square metre.
```

Two design rules were adopted after earlier failures, and they did help:

- **One ground surface.** Land cover (grass, sand, forest floor) is *paint*
  sampled from a raster onto the ground mesh, not a second mesh laid over it.
  Streets *cut the ground away* rather than lying on top of it.
- **A street is a cross-section**, not a stack of flat sheets. Kerb, verge and
  pavement have real heights and real vertical faces, swept along the
  centreline.

And one rule that exists because every recurring bug started this way:
**never add a constant to hold two surfaces apart.**

---

## 3. What is measurably wrong

All numbers are from `npm run place` on a real 3 km capture of the owner's
town (458 ways, 1779 buildings, 58.3 m of relief), and from `npm test`.

### 3.1 The ground still pokes through the roads

The measurement rebuilds the exact mesh the renderer would build and samples
across every street, comparing ground height to road surface height:

```
mesh cells 8.14 m · shoulder 13.0 m
away from crossings : 1.72% of 702856 samples poke through, worst 953.8 cm
at a crossing       : 2.10% of 102689 samples poke through, worst  86.8 cm
past the loaded edge: 2.96% of 188532 samples poke through, worst  71.2 cm
```

On a **synthetic** hillside test scene the same measurement is **0.00 %**.
The gap between 0.00 % and 1.72 % is the whole problem in one number.

### 3.2 Why: the ground mesh cannot be fine enough

The ground is a uniform grid, capped at 512 × 512 cells because 512² vertices
is already ~524 k triangles for bare ground. For a 1500 m radius that cap
yields **8.14 m cells**. A street is 6.5–13 m wide with a **15 cm** kerb.

So the terrain cannot represent a street cut at all, and the code compensates:
under the built width the earth is cut *flat* to the lowest point of the
section, and for ~1.6 cells (13 m!) past the built edge the earth is forbidden
to stand higher than the back of the pavement. That "shoulder" rule is the only
reason poke-through is rare rather than constant — and it flattens a 13 m strip
of countryside beside every road.

**This is the question we most want an answer to.** A uniform grid clearly
cannot win. Constrained Delaunay over the whole ground with street edges as
constraints was considered and rejected as too big a rewrite; adaptive/quadtree
terrain and a separate high-resolution corridor mesh were not seriously
evaluated. What would you do, given a browser, Three.js, and a triangle budget?

### 3.3 The renderer reads OSM, not a model

`render/roads.ts` derives geometry from ways at draw time. Consequences:

- Two parallel OSM ways — a service road drawn 4 m from the street it serves —
  both build a full cross-section over the same earth. Road surfaces overlap
  each other over **1.30 %** of their area (down from 2.52 % after adding the
  ground-claim raster). The remaining overlap is spread evenly along parallel
  ways, *not* concentrated at junctions.
- Bad map data cannot be corrected once, because there is no "once": there is
  no model between the data and the triangles.
- A `RoadNetwork` model was written (nodes, edges, streets, lanes, turns;
  902 nodes / 1136 edges / 605 streets / 1937 lanes / 3868 turns on the test
  town) and is fully tested — **but the renderer still ignores it.**

### 3.4 Three different notions of "where two streets meet"

`navgraph` welds coincident points at 0.6 m, `junctions` clusters them at 6 m,
`roadindex` has no notion at all, `network` welds at its own tolerance. They
disagree, and each disagreement has produced a visible defect.

### 3.5 Rivers are carved to one level

`carveWaterways` cuts an entire water polygon down to a single elevation. A
river that falls 6 m along its length becomes a gorge; a street beside it hangs
in the air. **9.5 m** — the single largest geometry error in the city, from
about four lines of code.

### 3.6 Nothing for courtyards, parking areas, or traffic

OSM maps no Russian *дворы* (courtyards — enclosed residential yards, in
practice packed solid with parked cars). 129 of the town's 243 service roads
lead inward and simply stop. Cars follow a navigation graph, not lanes; there
are no signals, no priorities, no give-way, no queueing.

---

## 4. Things already tried that did not work

Please don't propose these; they are burnt ground:

- **Lifting one surface above another** by a constant to avoid z-fighting or
  poke-through. Every recurring bug in this project started here.
- **A second mesh for land cover** over the ground. Replaced by paint on the
  one surface.
- **Polygon boolean operations for junctions.** Rejected for robustness;
  junction rings are built constructively from approach bearings and widths.
  (Was that the right call? Genuinely unsure.)
- **Kerb fillets curving inward** at a junction. The paved area is the *union*
  of two bands, so the corner is reflex and the fillet must reach **outward**.
  Getting it backwards folded 265 of 454 junction rings.
- **Parking as extra width.** Widened every residential street by 4 m and
  invented 29 000 spaces in a town of 37 000 people. Parking now comes *out
  of* the carriageway width.
- **Treating a bridge as a junction** with the road it flies over: 10.2 m of
  earth raised under a deck.
- **Widening the ground cut to save triangles.** An overshoot is a hole
  through the world to the sky.

---

## 5. The direction currently proposed

The owner's own proposal, which the agent agreed with:

> Build a proper city-simulator system first — editable terrain, a road tool,
> junctions, signals — the way *Cities: Skylines* works. Then import OSM only
> as **lines and nodes**, and lay the simulator's own system on top of them.
> Stop drawing the city *from* data; lay a designed city *onto* data.

Concretely that would mean: a road is **placed**, not drawn — one builder
operation welds it into the network, cuts the terrain, and claims the ground
under it, and the renderer reads only the model. Terraforming becomes a world
operation rather than a pre-pass. The importer's only job becomes OSM → nodes
and edges, with all correction of bad data happening in the model.

**We want this challenged, not confirmed.** In particular:

- Is a full "build then import" rewrite justified, or is there a cheaper change
  to the current pipeline that removes the same class of defect?
- Cities: Skylines has authored, well-behaved geometry. OSM does not — ways
  overlap, disagree about width, and split arbitrarily. Does laying a
  simulator's road system onto imported lines actually work, or does the
  reconciliation problem simply move?
- What is the right boundary between "model" and "geometry" for something that
  must eventually simulate traffic, pedestrians, parking and courtyards?

---

## 6. Questions, in the order we care about them

1. **Terrain vs. streets.** Given a browser, Three.js, a scene already at
   3.68 M triangles of which the ground is 524 288 and capped, a 3 km area and
   15 cm kerbs: what is the right ground representation? Uniform grid + shoulder rule (today), constrained Delaunay
   with street edges as constraints, adaptive quadtree / clipmap, a separate
   corridor mesh stitched to a coarse terrain — or something else?
2. **Who owns a square metre?** Should the road be part of the ground surface
   (one triangulation, roads embedded), or a separate mesh with the ground cut
   out (today)? What makes poke-through *structurally impossible* rather than
   statistically rare?
3. **Rewrite or repair?** Is §5 right? If yes, what is the migration order
   that keeps something shippable at every step? If no, what is the cheaper
   fix?
4. **OSM reconciliation.** Known-good algorithms for: merging parallel ways
   that represent one road, reconciling widths along a named street,
   identifying which service roads bound a courtyard, deciding where a
   junction really is. This is a solved problem in some GIS literature; we do
   not know it.
5. **Junction geometry.** Constructive from bearings (today) vs. offsetting +
   boolean union with a robust library. Which survives real OSM?
6. **Traffic.** What traffic model reaches a whole small town in a browser at
   60 fps — microscopic car-following per vehicle, mesoscopic queues per lane,
   or a hybrid keyed to what the camera can see?
7. **Rivers.** How should a waterway be carved so its bed falls along the flow
   instead of sitting at one level?
8. **The cheap win.** If you could make one change this week, what single
   change most improves what the owner actually sees on screen?

---

## 7. What a useless answer looks like

So the review is worth the tokens:

- "Use a proper architecture / separate concerns / add an ECS." Say *which*
  boundary is wrong and what replaces it.
- "Write more tests." There are 138 checks and a measurement harness that
  rebuilds the renderer's own mesh; the failures being discussed were found by
  those measurements, not missed by them.
- "Use a game engine." It ships to GitHub Pages as a static site and must stay
  a web page.
- Restating §3 back to us. We measured it; we want to know what to do.

Answers that cite a specific technique, paper, library, or a named game's
approach — and say what it costs — are what we are after.

---

## 8. What to read, if you read code

Ordered by how much it will tell you:

| File | Lines | Why |
|---|---|---|
| `src/render/roads.ts` | 1333 | The problem child. Everything wrong is visible here. |
| `src/terrain/heightfield.ts` | 884 | `gradeStreets` / `gradePads`: the shoulder rule, the grading maths. |
| `src/world/junctions.ts` | 812 | Junction discovery and constructive shape. |
| `src/world/network.ts` | 547 | The model that exists but is not used. |
| `src/world/roadprofile.ts` | 489 | The single source of the cross-section. |
| `src/render/claims.ts` | 211 | Ground ownership, applied as a raster afterwards. |
| `src/render/groundgrid.ts` | 137 | The grid formula and the 512-cell cap. |
| `tests/ground.ts` | 439 | How the numbers in §3.1 are produced. |
| `docs/STATE.md` | — | The long version of this brief. |
| `docs/GROUND-REWRITE.md` | — | Why the ground became one surface. |
| `docs/ROAD-NETWORK.md` | — | Why the network model was written. |

`review/CORE-CODE.md` in this folder is those source files concatenated, if
uploading one file is easier than cloning.
