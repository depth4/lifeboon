# The road network

The decision, the model, and the order it gets built in. Written so a fresh
session can pick this up from this file alone.

**Status: agreed, being built.** Agreed with the user on 2026-08-20, after
they read the measurements below and said: *"ну где ты видел чтобы дорога
расширялась. Скорее всего несовершенность данных которые мы должны
исправлять. Твоя задача в будущем полностью имитировать движение машин в
городе, реалистичное насколько это возможно. Строй с запасом под это."*

---

## 1. Why

The user diagnosed it before I did, again:

> Проебался на этапе архитектуры, базовой системы. А потом по очереди
> добавляешь для нее правила, костыли и запреты, чтобы ее исправить. […] У
> тебя вообще дорога на уровне синтаксиса понимает что она дорога и она единая
> система? как ты потом планируешь прокладывать маршруты для авто и пешеходов,
> ставить светофоры и прочие правила ПДД, если ты изначально не закладываешь
> логику в мир.

No, it does not. A `Road` is a polyline plus tags, exactly as it arrived from
OpenStreetMap. There is no node, no lane, no turn, no "this street continues
into that one". Everything downstream re-derives what it needs, and the three
re-derivations disagree with each other.

**Measured on the user's own capture of Alapaevsk** (`npm run place`):

| Who decides where streets meet | How | Tolerance |
|---|---|---|
| `sim/navgraph.ts` | welds coincident points | 0.6 m |
| `world/junctions.ts` | intersects segments, clusters | 6 m |
| `sim/roadindex.ts` | it does not — a hash of loose segments | — |

Three node sets that do not line up. A traffic light has to stand on a node;
there is no one node to stand on.

And with no entity above the way, a street is not one thing:

| Measured | Alapaevsk |
|---|---|
| Named streets split into several ways | 36 |
| …whose pieces disagree on width or class | **15 (42%)** |
| Worst | улица Серова, 6.5 m becoming 9.5 m mid-street |

That is the "дорога странно меняется в течение пути" visible in the user's
screenshots. It is not a rendering bug; the model genuinely says the street
changes width halfway along.

**What was *not* wrong**, checked before blaming it: junction *discovery*. The
geometric method finds 454 of the 458 places where two at-grade drivable ways
share a node — 99%. The data is read correctly. What is missing is a model to
read it *into*.

## 2. What this is not

**Not "be a city builder".** A builder authors its own data: you click, it
creates the node, and nothing is ambiguous. We import 341 polylines somebody
else drew, with no guarantee that what looks joined is joined. The lesson from
a builder is not that the problem is easy — it is that the *model* should be
the one a builder has from birth, and it should be built **once**.

**Not throwing away this year's work.** The street cross-section, the earth
grading, the shoulder rule, the measurement harness and the place capture are
all inputs to this. What gets deleted is finding junctions again in every
module.

## 3. The model

```
Street   one name, one class, one width, a chain of edges
Node     a place where edges meet; later: priority, signals, roundabout
Edge     one stretch between two nodes; carries lanes
Lane     index across the carriageway, direction, width, kind (driving/parking)
Turn     from (edge, lane) to (edge, lane) through a node
Place    NOT BUILT YET — an area reached from a node: a courtyard, a car park
```

**A parking lane is taken out of the street, not added to it.** Written the
other way it widened every residential street in Alapaevsk by four metres and
claimed 174 km of kerbside parking — 29 000 cars in a town of 37 000. On a
6.5 m street nobody builds a lay-by: the car stands on the carriageway and
everyone squeezes past, which is what the street view shows. Corrected, the
same town measures 91 km of kerbside parking on 125 km of street.

**`Place` is the piece still missing, and it is a different shape.** Kerbside
parking is linear; a Russian courtyard is an area with an entrance, and it is
where most of a town's cars actually stand. OpenStreetMap does not map
courtyards at all — it maps the way in. Measured on Alapaevsk:

| | |
|---|---|
| Service roads | 243 edges, 20.1 km |
| …that lead inward and nowhere else — yard driveways | **129** |
| Mapped parking areas in the whole 3 km | 4 (1 566 m²) |
| Courtyards mapped | none |

So a courtyard has to be inferred, like the pavements and the kerbside
parking: the enclosed ground between blocks of flats, entered by a service road
that dead-ends into it. A `Place` then has a boundary, one or more entrances
from network nodes, and a capacity — and a car's route becomes street → service
edge → place, which is how somebody actually drives home.

`Turn` is the piece that does not pay for itself today and is built anyway.
It is where a traffic light lives, where "give way" lives, where a route
becomes a sequence of decisions rather than a sequence of points. Building it
later means rebuilding the rest.

**Lanes are explicit**, on the user's instruction: the goal is to imitate real
traffic as closely as possible, and without lanes overtaking, turning by rule
and signal control are decoration.

**The street wins over the way.** Where OSM's pieces disagree, the street takes
one width and one class — length-weighted, so the longest agreement wins. This
is us correcting the data, deliberately, and it is the user's call: *"скорее
всего несовершенность данных которые мы должны исправлять."*

## 4. The order it is built in

The user's own framing, and it is right:

> Может не допустим продумать все в болванке — маршруты, переходы, зебры и
> потом уже наложить на рельеф.

1. **Topology, flat.** Weld points into nodes, split ways into edges, group
   edges into streets, reconcile width and class, derive lanes, build turns.
   No heights anywhere.
2. **Shapes, still flat.** Junction polygons from each node's real approaches;
   edge corridors trimmed to them.
3. **Heights, on the network.** A node gets one height; an edge interpolates
   between its two; a bridge arches between its abutments.
4. **The earth, last.** Grade to what the network decided, then build meshes.

Everything today happens in the order 2-4 with step 1 missing, which is why
each new case needs a new rule: the rule is restoring information the model
never held.

## 5. How we will tell it worked

Same discipline as the ground rewrite: numbers on the user's own capture,
before and after.

| Metric | Now | Target |
|---|---|---|
| Streets whose pieces disagree on width | 15 of 36 | 0 |
| Distinct notions of "where streets meet" | 3 | 1 |
| Junction rings that fold over themselves | 1 of 454 | 0 |
| Ground standing in a road, away from crossings | 1.71% of samples | under 0.5% |
| Turns modelled | none | one per legal movement |

## 6. Order of migration, so nothing is wasted

| # | Step | Useful on its own? |
|---|---|---|
| 1 | Build the network beside the existing code, and measure it | Yes — it is the audit |
| 2 | Junction shapes read the network's nodes and approaches | Yes — fixes street identity at crossings |
| 3 | Street reconciliation feeds the cross-section | Yes — the visible width jumps go |
| 4 | `RoadIndex` answers "which lane" instead of "which polyline" | Needed for traffic |
| 5 | `NavGraph` becomes the pedestrian side of the same network | Removes the third node set |
| 6 | Signals and priorities hang on nodes and turns | The point of all of it |
