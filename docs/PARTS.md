# Parts: the world as functional units

The architecture the user asked for, in their words:

> «Надо чтобы дорога как будто имела сетку, нет? Чтобы её фрагмент был
> отдельный и читался что пешеходом, что машиной как дорога. Чтобы потом её
> можно было строить поверх рельефа и соединять как пути видом сверху, как в
> симуляторе. И также с домами, столбами, тротуарами. Всё это функциональные
> единицы.»

This is the same diagnosis `docs/STATE.md` §4.3 and §5 arrived at, and the same
one an outside reviewer arrived at independently. It is right, and this file is
what it turned into.

**Status: built and rendering.** Streets and junctions are placed as parts and
drawn from them; `render/roads.ts` no longer exists. Buildings, props and
railways are not parts yet.

---

## 1. The one-sentence version

A **part** is one piece of world with one owner: a stretch of street, a
junction, later a building or a lamp post. It owns the ground it stands on,
cell by cell, and every cell says what it is and what may be done on it. The
renderer draws those cells; the car asks the same cells what is under its
wheels; a pedestrian asks the same cells whether they may walk there. There is
no second representation to disagree with.

## 2. Why the old way could not be fixed

`render/roads.ts` swept geometry directly from OpenStreetMap ways, at draw
time. So did the terrain grading, from its own reading. So did the road index
the car used. So did the pedestrian graph. Four readings of the same lines,
each with its own tolerances, and `docs/STATE.md` §4.6 counted **four separate
representations of ground ownership** in the codebase, disagreeing with one
another by as much as a factor of six in resolution.

Every recurring bug in this project lived in the gaps between those four:
ground poking through roads, doubled pavements, junctions that read as separate
plateaux, road surfaces drawn over each other. Each was fixed with a rule, and
each rule was restoring information the model never held.

## 3. The model

```
Part      one piece of world: a lattice, some ports, a kind
Lattice   rows along it, columns across it; a role per cell
Role      what a cell is: carriageway, parking, kerb face, kerb top,
          verge, pavement, junction, crossing, batter, parapet, fascia
Can       what may be done there: drive, walk, park, paved
Port      a mouth: a place, a heading, a width, a height, on a network node
```

**The lattice is the point.** A street part's rows run along the street and its
columns run across it, and the columns are the cross-section *and the lanes*:
kerb, verge and pavement on the outside, one column per traffic lane in the
middle. So "how high is the tarmac here", "which lane am I in" and "may I walk
here" are one lookup into the same grid the renderer drew from.

A zero-width cell is legal and normal — the vertical face of a kerb is exactly
that, two columns at the same offset and different heights.

**Ports are how parts connect.** A port is computed once, in the placement
pass, from the network alone: before any geometry exists. The junction is built
from the ports of the streets that reach it, and those streets are trimmed back
to the same ports. Two parts cannot fight over a square metre because the
boundary between them was decided before either was built.

## 4. The order things happen in

`world/parts/place.ts`, and the order is load-bearing:

1. **Every node gets one height.** Not three, which is what
   `docs/ROAD-NETWORK.md` §1 measured.
2. **Every edge gets a crown profile**, pinned to its two nodes, computed on
   **un-graded** ground. Recomputing one after grading describes a road built
   on top of a road.
3. **Every arm of every junction gets one port**: where the carriageway stops,
   and — separately — where the paving beside it stops.
4. **Streets are built back from those ports; junctions are built out of them.**
5. **Then** the earth is cut to what the parts decided
   (`world/parts/earth.ts`), and only then is anything drawn.

## 5. What it measures

On the OSM-shaped test grid on a hillside (`tests/parts.ts`):

| | before | after |
|---|---|---|
| Step between a junction and its own arms, mean | 14.3 cm | **0.19 cm** |
| …worst | 110 cm | **0.51 cm** |
| Built surface claimed twice | 1.26 % | **0.28 %** |
| …*paved* twice | — | **0.03 %** |
| Carriageway that knows which lane it is | none | **all of it** |

On the offline city (which now has OSM topology — see §7): 843 parts, 263
junctions, 3 435 turns; 0.39 % of the built surface paved twice, plus 0.6 %
that is a bridge deck stacked over a street, which is correct.

Two defects were found by these measurements and fixed:

- **A junction with no kerb radius is not a shape.** With the mouths stopping
  exactly where the carriageways stop touching, the four corner points of a
  crossroads coincide, the ring degenerates and the surface folds. Real kerb
  radii are 3–12 m and scale with the road; so does this one.
- **A bridge welded into a junction.** Two ways crossing at the same projected
  point became one node, and a junction was built where a deck flies over a
  street. Interior points of a bridge or tunnel way no longer weld — its
  abutments still do, and they are its two ends.

## 6. What is still wrong

- **The junction owns only the tarmac, not the corner.** Kerb, verge and
  pavement are interrupted through a crossing rather than turned round it, so a
  junction corner is bare ground where a real one has a rounded pavement. The
  interruption is derived rather than guessed — `junctionStops` works out where
  this arm's paving last lies over the crossing street's carriageway — but the
  right answer is for the junction part to carry a kerb ring and corner
  pavements of its own.
- **Two streets meeting at a two-armed node are not mitred.** Their sections
  overlap in the corner. Small, and mostly embankment.
- **Buildings, props and railways are not parts.** A building is a functional
  unit with a footprint and a door; a lamp post is a functional unit standing
  in a verge. Both should be placed the same way.
- **Crossings are a role with nothing producing it.** `Role.Crossing` exists
  and affords both driving and walking; nothing builds one yet.
- **`world/junctions.ts` and `RoadProfiles` are still alive**, used by
  `tests/ground.ts`. `tests/place.ts` has moved onto parts; `tests/ground.ts`
  has not.

## 7. Where the code is

| Path | What |
|---|---|
| `src/world/parts.ts` | The model: `Part`, `Lattice`, `Role`, `Can`, `Port` |
| `src/world/parts/place.ts` | The placement pass — the one operation |
| `src/world/parts/street.ts` | A stretch of street, from a network edge |
| `src/world/parts/junction.ts` | A junction, from a network node and its ports |
| `src/world/parts/earth.ts` | What the parts ask of the terrain |
| `src/world/parts/polyline.ts` | Chainage, resampling, tangents |
| `src/world/partfield.ts` | The one spatial index over every cell |
| `src/render/parts.ts` | Drawing parts. Deliberately stupid |
| `tests/parts.ts` | The measurements above, as a regression test |

`src/data/procedural.ts` now cuts the offline city's ways at their crossings,
the way OpenStreetMap stores them. Before that the generated city had no
junctions at all — 114 nodes and not one crossroads — so it silently exercised
only the easy half of the code, and every junction bug had to be found on a
real town instead.
