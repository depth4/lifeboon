# Lifeboon

A browser life simulator that runs on the **real world map**. Load any place on
Earth by name; its actual streets, building footprints and heights, parks and
water are pulled from OpenStreetMap and built into a 3D city you can fly over at
two kilometres or walk down at eye level. Then a few thousand invented
inhabitants live in it — they have homes, jobs, needs and routines, and they walk
the real street network to get where they are going.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # typecheck + production bundle into dist/
```

No API keys, no accounts, no build-time data. Everything is fetched at runtime
from public OpenStreetMap services and cached locally in IndexedDB.

## What it does

- **Real geometry.** Building outlines are extruded to their tagged `height` or
  `building:levels`; where OSM has no height (most of the world), a plausible one
  is inferred from the building's type and footprint size. Streets become
  ribbons with pavements and lane markings, at their tagged widths.
- **Continuous zoom.** One camera from roughly 3 km up down to 2.4 m above the
  pavement, with no mode switch and no reload. The near and far planes are
  recomputed from altitude every frame, which is what keeps depth precision
  usable across that range.
- **A day.** The sun's position is computed from the loaded latitude, the time
  of day and the day of the year, so shadows fall where they really would.
  Window lights and street lamps come on at dusk.
- **People who are doing something.** Each agent has a home (a real mapped
  building), usually a job (a real mapped amenity), four needs that drain at
  different rates, and a state machine that turns those into destinations. Paths
  are A* over the walkable street graph. Click anyone to see who they are and
  what they are up to; then follow them.

## Three things it deliberately does not do

These are constraints on the design, not oversights.

1. **No interiors.** Buildings are closed shells — outside surfaces only. When
   an agent is at home, at work, eating or shopping, they are inside, and they
   are simply not rendered. The simulation models a city, not a living room.
2. **No brands.** Shop, cafe, operator and business names are discarded during
   import (`src/data/tags.ts`). Only the *category* survives, so a cafe is "a
   cafe". No signage, logos or lettering is drawn anywhere.
3. **No real people.** Inhabitants are invented and statistical. A building's
   population is estimated from its floor area; who actually lives at an address
   is not known to this program and is not modelled.

See [docs/DATA-AND-RIGHTS.md](docs/DATA-AND-RIGHTS.md) for why the architecture
and street layout are fine to show, and why the three items above are the ones
worth being careful about.

## Offline city

If OpenStreetMap cannot be reached — offline, a blocked network, every mirror
busy — the app falls back to a procedurally generated city and labels it
`SYNTHETIC` in the header. It is never presented as a real place. It also makes
the renderer and the simulation testable without depending on a public service.

## How it is put together

```
src/
  core/      projection to a local metric plane, seeded RNG, sim clock + sun
  data/      Overpass client & cache, OSM parsing, tag interpretation,
             the offline city generator
  world/     the world model everything else reads
  sim/       pedestrian graph (welding + CSR + A*), population & behaviour
  render/    building extrusion, road ribbons, ground, procedural textures,
             instanced people with a GPU walk cycle, camera, sky & light
  ui/        HUD, inspector, search
```

A few decisions worth knowing about:

- **Everything merges.** All buildings become two meshes (walls, roofs), all
  roads become three (surface, pavement, markings). A district is a handful of
  draw calls rather than thousands.
- **People are one draw call.** A single `InstancedMesh`; the walk cycle runs in
  the vertex shader, swinging limbs around the hip and shoulder from a
  per-instance phase. No skinning, no per-agent objects.
- **Pathfinding is budgeted.** Route requests queue and are serviced a fixed
  number per frame, so rush hour never holds a frame hostage. The graph is
  compressed-sparse-row over typed arrays and A* allocates nothing per query.
- **Winding matters.** Roads and ground are flat horizontal ribbons; get the
  triangle order backwards and they vanish under backface culling rather than
  looking wrong. Both emitters now document their orientation.

## Being a good citizen of the OSM services

Overpass and Nominatim are volunteer-funded. This client asks for one bounded
area at a time (capped at 6 km across), caches every response in IndexedDB for a
week, and falls through three mirrors rather than retrying one. If you deploy
this anywhere with traffic, run your own Overpass instance or switch to a
vector-tile source — do not point a public site at the community servers.

## Licence

Code: MIT. Map data: © OpenStreetMap contributors, ODbL.
