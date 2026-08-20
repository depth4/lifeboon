# The ground rewrite

The decision, the plan, and — most importantly — how we will tell whether it
came out better or worse. Written so a fresh session can start work from this
file alone.

**Status: agreed, not started.** The user's words: *"начнем с переделки системы
рельефа если сразу не можем сказать лучше это будет или хуже"* — start it,
precisely because we cannot say in advance.

---

## 1. Why

The user diagnosed this before I did, from screenshots:

> Ты берёшь рельеф и сверху ставишь дорогу с тротуаром. Но оно не тянется до
> земли. А тротуар в принципе не имеет физики. И даже так не всегда тротуар с
> дорогой выше рельефа. Может проблема в самой архитектуре?

Yes. The ground is a **regular grid**; streets, kerbs, pavements and land cover
are **separate meshes laid over it**, each tied down only by its own embankment.
Every consequence of that has now been hit at least once:

| Symptom seen | Direct cause |
|---|---|
| Car sat half a wheel deep in what the picture showed as pavement | The trench cut to carry the street is covered only by the drawn street; anything that queries the terrain instead falls into it |
| Strips of road hanging in the air at junctions | The junction mask removed the embankment, which is the only thing tying a corridor down |
| Crossings as "прямоугольные плато криво друг на друге" | Each way's profile was smoothed independently, then the ground graded to each in turn |
| Terrain poking through a street edge | A 4.9 m grid cannot follow a 13 m corridor. Measured: 0.8% of samples, up to 37 cm |
| Land cover drawn across roads | Only prevented by burying it under a grading offset |

Each was fixed individually. **The class keeps reappearing somewhere new**,
which is the signature of an architectural problem rather than a set of bugs.
In the target architecture the class cannot exist: there is nothing under the
surface to fall into, and no second surface to fight with.

## 2. What we are NOT doing

Two things were considered and rejected, with reasons, so they are not
re-litigated:

- **Not changing engine.** Three.js has nothing to do with any of this. Cesium
  is a geospatial *viewer*: ground-level driving, custom materials, a physics
  loop and a per-triangle ground partition all fight it. See DECISIONS,
  "Tried and rejected".
- **Not throwing away the heightfield.** A pure planar partition is *worse* for
  the thing the user wants later — editing terrain, building. On a grid,
  "raise this circle by two metres" is arithmetic on an array; on a partition
  whose vertices are tied to feature boundaries it is awkward. So:

> **The heightfield stays the authority for terrain. What changes is how the
> ground is turned into triangles.**

That is the whole shape of the decision. Terrain editing keeps working, and it
is the mesher — not the data model — that gets replaced.

## 3. Target architecture

**Ground level is one continuous surface.** Every square metre belongs to
exactly one polygon:

```
junction polygon | carriageway | kerb band | verge | pavement |
land cover | building plot | terrain filler
```

Neighbouring polygons **share their edge vertices exactly**, via a constrained
Delaunay triangulation. Then:

- nothing can float — there is no second surface to float over;
- terrain cannot cover a road — they are the same mesh;
- the pavement has physics for free — one surface, one height query;
- roads connect, because a junction is a real polygon and not two overlapping
  ribbons.

**Heights are decided on the network first, geometry second.** Junction nodes
get one height each (already built — `RoadProfiles.junctions`); edges
interpolate between their nodes; terrain supplies everything else; the
triangulation interpolates between them.

### Tokyo, and why this makes multi-level *easier*

A planar partition is flat by definition: one height per point of the map. An
elevated expressway over a street over a subway is **not expressible in it**,
and that is fine — it sharpens the rule:

> Everything at ground level is the one surface. Everything not at ground level
> — bridges, viaducts, tunnels — is ordinary 3D geometry above or below it, and
> only has to meet the ground at its abutments.

Today a bridge and a street *fight over the same piece of terrain*. After this,
they cannot. Tokyo gets better, not worse.

On cost: a partition spends triangles where there is detail and none where
there is not. The present uniform 512×512 grid spends the same on central Tokyo
and on an empty field. Expect this to be *cheaper* in a dense city and much
cheaper in a sparse one — but **measure it, do not assume it** (§5).

### The hard part, and how to avoid it

The dangerous approach is general polygon boolean operations (union every pair
of overlapping corridors). Robustness against real OSM geometry — self-
intersecting rings, duplicate nodes, zero-length segments — is where that dies.

**Use a constructive junction instead.** Build the street *network* first
(nodes + edges), then:

1. For each node, construct the junction polygon directly from the approach
   directions and widths — no boolean needed.
2. Cut each edge's corridor to stop at its two junction polygons.
3. Feed all resulting polygons to one CDT as constraints.

Constructive, not boolean. This is how procedural road-network generators do it
and it is far more robust.

Library: `cdt2d` is the maintained option; `poly2tri` is the alternative and is
older. Neither is in the project yet — adding a dependency needs the user's
nod, and both are MIT (see DATA-AND-RIGHTS for why that matters).

## 4. The plan, ordered so nothing is wasted

Stages 1–3 improve the picture **under the current architecture** and are
exactly the foundation the new one needs. Nothing in them is thrown away if the
rewrite is abandoned at any point.

| # | Step | Useful without the rewrite? |
|---|---|---|
| 1 | **Street network**: nodes and edges as a first-class model, one height per node. Half-built already: `RoadProfiles.junctions` and `world/junctions.ts`. Finish it into a real graph. | Yes |
| 2 | **Junction polygons**: real shapes with corner radii instead of ribbons cut off square. | Yes — fixes the blocky crossings visible today |
| 3 | **Tile the ground build**: build ground in tiles rather than one mesh. | Yes — and it is what streaming Moscow→Vladivostok needs anyway |
| 4 | **CDT mesher behind a flag**: new builder alongside the old, switchable at runtime. | This is the fork |
| 5 | **Move features into the partition** one at a time: streets, then water, then land cover, then plots. | |
| 6 | **Delete the old builder** once the metrics in §5 say it is better. | |

## 5. How we will tell better from worse

This is the point of the whole document. **Do not ship on impression.** Every
metric below is already measurable with the probe recipes in CLAUDE.md, and
several were used to find the bugs listed in §1. Record the numbers for the old
builder before starting stage 4, and compare on the *same* city and camera.

| Metric | How | Current value (offline city) | Target |
|---|---|---|---|
| Ground poking through a street | Raycast down onto `ground:*` at points across every street; count where it is above where the car stands | 0.8% of samples, worst 37 cm | **0** — structurally impossible |
| Car vs drawn surface | `roadIndex.nearest().surfaceY` vs raycast, across the full street width | median 0 cm, p95 15 cm | p95 under 3 cm |
| Triangles per frame | `renderer.info.render.triangles` | 3.5 M | no worse; expect better |
| Ground vertices | `ground:base` position count | 263 k | expect lower for the same detail |
| Build time | wall clock in `installWorld` | measure before starting | no worse than 2× |
| Draw calls | `renderer.info.render.calls` | 22 | no worse |

**Rollback rule:** the old builder stays until the new one wins on *poking
through* and *car vs drawn* without losing more than 2× on build time. If it
cannot, we keep the flag off and write down why — that is a legitimate outcome
and the staged order means stages 1–3 are still banked.

## 6. Build a hard test case first

Overpass is blocked from the sandbox, so the offline generator is the only
thing that can be tested here. It is currently too easy: gentle grid, few
junctions, near-right angles.

**Before stage 4, add a stress mode to `src/data/procedural.ts`:** dense short
blocks, junctions at 20–30°, several ways meeting at one node, a roundabout,
crossing bridges at different layers, a river with a real gradient. Every metric
in §5 gets measured on that, not on the friendly city.

Real Tokyo, real Alapaevsk: only the user can check those. Say so in every
report.
