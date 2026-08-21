# The attic

This is the previous version of Lifeboon: about 15 000 lines that got as far as
a real city, drawn from live OpenStreetMap data, with terrain, buildings and a
drivable car — and then collapsed under the weight of its own corrections.

It is kept, not deleted, because the mistakes are worth more than the code.

## What is worth reading

| File | Why |
|---|---|
| `docs/STATE.md` | The honest inventory: what worked, what was broken, with numbers |
| `docs/DECISIONS.md` | What was tried and what it cost |
| `review/BRIEF.md` | The project handed to an outside reviewer, and what they said |
| `docs/GROUND-REWRITE.md` | Why the ground is one surface and not a stack |
| `docs/ROAD-NETWORK.md` | Why roads had to become a graph |

## What is worth taking, eventually

Not by importing it — the build forbids that — but by reading it and writing it
again, small and on purpose:

- `src/data/tags.ts` and `src/data/osm.ts` — how to read an OpenStreetMap tag.
  Roughly 900 lines of hard-won knowledge about what the map actually says.
- `src/terrain/elevation.ts` — fetching and stitching real elevation tiles.
- `src/sim/vehicle.ts` and `src/sim/driver.ts` — car physics, checked against
  real numbers: top speed, 0–100, braking distance, the cost of a hill.
- `src/data/fixture.ts` — saving a real place to one file, so it can be
  measured without a network.

## Why it failed, in one sentence

Geometry was derived from map data at the moment of drawing, by four different
modules that each had their own idea of which square metre belonged to what;
every fix restored information the model had never held.

The frozen, working build of it is served at `/frozen/`.
