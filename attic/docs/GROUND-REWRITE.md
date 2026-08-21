# The ground

Why the ground was rebuilt the way it was, what it is now, how we know it is
better, and what is still wrong. Written so a fresh session can start from this
file alone.

**Status: done and measured**, except crossings — see §6.

---

## 1. What the user asked for, and why the answer changed

The original plan in this file was to replace the ground mesher with a
constrained Delaunay triangulation: one planar partition, every square metre
belonging to exactly one polygon. It was agreed, and then the user asked the
question that changed it:

> А точно ли нам стоит переделывать всю архитектуру. Если допустим я хочу
> сделать чтобы можно было прокладывать дороги, садить деревья, тераформировать
> землю. […] Наверное все таки усадки дорог поверх рельефа?

They were right on both halves.

**The terraforming already existed.** `Heightfield.gradeStreets` has cut the
earth to carry the streets since the cross-section work. That was never the
missing piece.

**And the editing goal argues against a partition.** On a grid, "raise this
circle by two metres" is arithmetic over an array, local and instant. On a
triangulation whose vertices are tied to feature boundaries, laying one new
road means re-triangulating a neighbourhood — doable, but not while somebody
is dragging the mouse. A partition is the right architecture for a world that
is imported and looked at. A grid is the right architecture for a world that is
*edited*, and that is the world being built here.

So the real problem was never "who moves whom". It was **how many surfaces
cover one square metre.** There were three:

| Mesh | What it was |
|---|---|
| `ground:base` | the terrain grid |
| `ground:landcover` | parks, lawns, car parks, draped and lifted clear |
| `roads:surface` and friends | the street |

Terraforming did not remove the second and third, it only spread them apart in
height — land cover 6–21 cm up a nesting stack, the road at 28 cm, and a 34 cm
trench dug under the road so the stack would fit beneath it. Every recurring
bug came out of that arrangement: the car fell into the trench, grass was drawn
across asphalt, the earth stood through a road edge.

**Three surfaces became one.** That is the whole change.

## 2. What it is now

- **Land cover is paint, not a sheet** (`render/areafield.ts`). The ground is
  made of grass here and gravel there; there is no second mesh and no lift
  constant anywhere. The cost is that a boundary is only as sharp as the mesh
  carrying it, which is acceptable *for land cover* — the palette deliberately
  keeps these tones close, because a park ends in a fence and a change of
  mowing, not a change of colour. It is not acceptable for a kerb, which is why
  streets keep their own geometry.
- **Streets cut the ground away** (`render/streetmask.ts`). The road builder
  records the paving it actually laid — after junctions have interrupted it —
  and the ground mesh drops every quad it can *prove* lies under paving. The
  proof: a quad whose four corners are all at least one cell inside the paved
  region is entirely inside it, because every point of a square is within half
  its width of a corner. Anything not proven keeps its triangles; a cut that
  overshoots is a window through the world to the sky, which is far worse than
  a few hidden triangles.
- **The trench is gone.** `STRUCTURE_DEPTH` is 12 cm — the road structure, and
  nothing else. Nothing hides under a road any more, so there is nothing to
  fall into: measured across every street in the generated city, the earth sits
  18 cm under the surface the car stands on.
- **A street cuts a shoulder.** For about one mesh cell beyond its built edge,
  the earth may not stand higher than the back of the pavement. This is the
  rule that makes poking through structurally impossible rather than unlikely,
  and it is what a real cutting has too. See §4.
- **The elevation array is grown to cover the streets.** Grading can only write
  into the array it has, and ways run past the edge of the downloaded
  elevation. That alone was 3.7 m of hillside standing in a road.

## 3. Why a shoulder, and not a finer grid

Grading writes heights at grid nodes. The edge of a street is a line, and it
never runs along one. A cell with one corner on the pavement and the other on
the hillside is drawn as a plane between them, and where the hillside corner is
higher, that plane rises over the road inside the cell.

**Refining the grid shrinks this and never removes it** — the straddling cell
exists at every resolution. Forbidding the earth to stand higher than the
street for a cell beyond its edge removes it outright: both ends of any
straddling cell are then at or below the street, and a plane between two points
below the road cannot rise above it.

Two details that cost measurement to find:

- The shoulder must be at least one cell **of the mesh that draws the ground**,
  not of the elevation field. On a large city the mesh grid is capped at 512
  and its cells come out coarser than the field. The formula lives in one place
  (`render/groundgrid.ts`) and both callers read it.
- Under the built width the earth is cut **flat**, to the lowest point of the
  section. A four-metre grid cannot follow a 15 cm kerb: asked to, it puts a
  node at kerb height beside one at channel height and the plane between them
  comes up through the asphalt. Flat is also what is actually under a road.

## 4. The bug this uncovered

Every segment of a way claims the ground around it, and a point past the end of
a segment is measured from that end. Ties between equally strong claims went to
whichever came first. So on a street running downhill, the segment *above* a
node claimed it at its own higher level, and the segment the node actually lies
on could not correct it. Measured on a 12% grade: **47 cm of earth left
standing in the street's own carriageway.**

Within one way the tie-break is now distance. Between different ways it is
still first-come — the corridors are sorted widest-first so a side street
cannot dig through a main road at a crossing.

## 5. The numbers

Measured two ways, which agree. The metric is: sample across the full built
width of every street, take the ground surface the renderer draws, and subtract
the street surface drawn there. Positive means the earth is standing in the
road.

**`tests/ground.ts`** — a hillside with 1-in-3 gradients, three streets cut
into it, the mesh reconstructed exactly as the renderer builds it. This runs in
Node, in the test suite, on every commit. It did not need a GPU and never did.

| | share poking through | worst |
|---|---|---|
| Shoulder off (the old behaviour) | 3.45% | 94 cm |
| Shoulder on, away from crossings | **0.00%** | −4 cm |
| Shoulder on, at crossings | 0.91% | 61 cm |

**The generated city, in the browser**, 531 325 samples across every drivable
street:

| Where | share poking through | worst | typical gap |
|---|---|---|---|
| Straights | **0 of 273 484** | −10 cm | −18 cm |
| Crossings | 0.89% | 83 cm | −18 cm |
| Within 45 m of carved water | 1.46% | 4.5 m | −18 cm |

And the cost, same city, same camera, old build against new:

| | before | after |
|---|---|---|
| Triangles in view | 3 721 832 | 3 676 156 |
| Draw calls | 22 | 21 |
| `ground:base` triangles | 524 288 | 522 132 |
| `ground:landcover` | 43 520 triangles | gone |
| Meshes | 13 | 12 |

Cheaper, not dearer. The offline city has 54 streets over a 900 m radius, so
only 1 078 quads were cut; a real dense city cuts far more.

## 6. What is still wrong

**Crossings.** Two streets meeting on a slope have each cut the earth to their
own level, and where those levels differ one of them is left with ground
standing in it. It is bounded — the junction levelling caps how far apart two
streets at one junction may be — and it is 0.9% of the samples at crossings.
No shoulder fixes it. **A junction has to become one polygon at one height**,
which is the next piece of work: real shapes with corner radii instead of
ribbons cut off square, built constructively from the approach directions and
widths rather than by any boolean operation.

**The river.** `carveWaterways` cuts a water polygon's whole outline to the
lowest ground around it, so a river crossing real relief becomes a gorge with
14 m walls, and a road running into it has hillside standing in it. This is the
largest single number in the table above and it is not a ground-mesh problem at
all — it is the known open question in DECISIONS, and line waterways already
have the downhill profile that polygons need.

**Land-cover boundaries are mesh-sharp.** Deliberate, and argued for in §2, but
if a small feature — a playground, a pitch — reads as mush, the answer is a thin
edge ribbon where the boundary should be hard, not a return to draped sheets.

## 7. And if a partition is ever needed after all

The staged plan for it still holds, and stages 1–3 remain worth doing on their
own: a first-class street graph, junction polygons, and building the ground in
tiles (which is also what editing wants — rebuild one tile, not the world).
The rollback rule is now the entry rule: **the measurements in §5 are the bar.**
A partition has to beat 0.00% on straights and fix crossings to be worth its
cost. Today nothing else does fix crossings, so junction polygons come first
and the question can be asked again afterwards.
