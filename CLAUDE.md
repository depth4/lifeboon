# Lifeboon

A browser life simulator that runs on real OpenStreetMap data. Vite +
TypeScript + Three.js, deployed to GitHub Pages.

Read this before starting work. It is deliberately short: **everything in it
has already cost at least one session's work.** Add to it only when something
new bites, and delete anything that stops being true.

---

## Working with the person who owns this

- **They are not a programmer** — humanities background. Explain in plain
  language. Their words: "чем легче и проще ты мне объяснишь тем разумнее
  будет работа." Jargon without explanation is a failure, not a shortcut.
- **Decide engineering yourself; ask only about the product.** They originally
  said "ask at every fork", and then spent a session correcting the balance:
  *"Понимаешь это делается все вместе. Глупый вообще вопрос"*, and later
  *"Ты сам не можешь выяснить что будет правильнее?"*. A fork worth asking
  about changes **what the thing is** — allow invented interiors, which country
  we model, whether to be faithful or pretty. How to mesh the ground, which
  library to use, what to fix first: yours. Bring a recommendation, not a menu.
- **They will out-diagnose you if you hand-wave.** They worked out the layered
  ground architecture and its three failure modes from screenshots alone. Give
  them the real mechanism in plain language; they follow it and they check it.
- **Report what you could not verify, every time.** Overpass is blocked here,
  SwiftShader draws no shadows: a large share of any change is unverifiable
  from the sandbox. Saying so is not hedging, it is the honest half of the
  report.
- **Report honestly.** If a fix is unverified, say so. If a diagnosis was
  wrong, correct it in one sentence and move on.
- **They start a fresh chat often, on purpose** — their words: *"ты становишься
  хуже по мере заполнения контекста. Поэтому чаты в claude код приходится
  создавать новые."* That is a correct reading, and it makes this file and
  `docs/` the only memory the project has. Anything a new chat would have to
  be told twice belongs in here the first time. Anything the user should not
  have to repeat — like which branch to push to — must be written as a
  standing instruction, not as a question to ask again.
- Replies to them are in **Russian**. Code, comments, commits and these docs
  are in **English**.
- The long-term goal they described: a simulation dense with formulas backed
  by real research — clothing affecting whether you get attacked, humidity and
  air pollution affecting long-term health. Approach it "комплексно, долго,
  вдумчиво, постепенно". Nothing invented where a real number exists.

## Hard constraints

- **No building interiors.** Buildings are closed shells.
  (Open question, never resolved: their own wish list — furnishing a flat,
  sitting in a bar — needs interiors. The rule may need refining to "no
  interiors derived from map data".)
- **No brands.** Shop and business names are discarded on import; only the
  category survives. A cafe is "a cafe".
- **No real people.** Inhabitants are invented and statistical.
- **One branch: `claude/world-map-life-simulator-wthhom`.** This is not a
  preference to check, it is a standing instruction from the user: *"Мне нужно
  чтобы я всегда работал с одной веткой. Мне так удобнее. У меня нет 2
  параллельных билдов."* There is no `main` in this repository; this branch is
  the project.

  **`.github/workflows/deploy.yml` watches it and only it.** Web sessions do
  not: the harness invents a fresh `claude/<slug>` branch per session and tells
  you to work there. Pushing only there deploys nothing — the user reloads the
  site and sees the old build. That has now happened twice.

  So **every push goes to both places**, without asking:

  ```
  git push -u origin <the branch the harness named>
  git push origin HEAD:claude/world-map-life-simulator-wthhom
  ```

  The second is a fast-forward as long as the session started from this branch,
  which it does. If it is ever rejected, stop and ask rather than forcing.

  Then **delete session branches whose commits are on the deploy branch**
  (`git merge-base --is-ancestor` first, to be sure nothing is lost). They
  accumulate one per chat otherwise, which is the thing the user objected to.

  Never open a PR unless asked. Before reporting that anything is live: confirm
  the workflow run for your SHA succeeded, and quote that SHA — it is in the
  top bar, and a stale cache looks exactly like a fix that did not work.

## The rule that has saved the most time

**Measure, do not guess.**

…and **look at the picture before committing.** Those are two rules, not one,
and the second was learnt the hard way. A change went out with the whole test
suite green that drew the street's pavement *only* where the map already had a
footway and turned it to grass everywhere else — a doubled pavement in one
place and a missing one in the next, from one swapped argument. Every number
was fine, because no number was measuring what was drawn. The user found it by
looking, one release later, and asked why nothing ever changes from version to
version. It was a fair question: the answer was that the visible half of the
work was never checked.

The capture makes checking it cheap now. Load the user's own town in the
sandbox browser (`.tmp/look.mjs` pattern: import the file through the About
panel, put the camera where the change should show, screenshot) and look. Two
minutes, and it catches the class of bug that no ground metric can.

Every rendering bug here was found by querying the live scene from Playwright
— counting normal signs, sampling vertex colours, comparing heights — not by
looking at it. Three times a confident-sounding diagnosis was wrong and only
measurement caught it. Budget the extra tool call; it is cheaper than a wrong
fix plus the round trip to find out it was wrong.

Corollary: **test on a hard city, not an easy one.** The `layer`-as-altitude
bug survived because Alapaevsk and Amsterdam barely use the tag. Tokyo does,
and the city came out as floating slabs.

## Invariants

| Thing | Rule |
|---|---|
| Coordinates | Projected metres, local ENU tangent plane. `x` = east, `z` = south, `y` = up. |
| Heading | Forward is `(sin h, 0, cos h)`. Increasing `h` turns **left**. Car meshes use `rotation.order = 'YXZ'`. |
| Triangle winding | Counter-clockwise seen from outside. Backface culling is on; wrong winding makes geometry silently invisible. This has happened twice. |
| OSM `layer` | A **stacking order**, not an altitude. Only `bridge=yes` lifts anything. See `world/roadprofile.ts`. |
| Underground | `tunnel=yes` or `layer < 0` → not drawn, not in the road index. |
| Ground level | **One surface.** Land cover is paint on the ground (`render/areafield.ts`), not a mesh over it; streets cut the ground away (`render/streetmask.ts`) rather than lying on it. Adding a second surface over the same square metre, or a constant to hold two apart, is how every recurring bug in this project started. |
| Streets | A street is a **cross-section** (`world/street.ts`), not a stack of flat sheets. Kerb, verge and pavement have real heights and real vertical faces. Never add a "lift" constant to keep two surfaces apart — give them different places in the section instead. |
| Grading | The earth is **cut to carry the streets** (`Heightfield.gradeStreets`) before anything is built on it. Under the built width it is cut flat, to the lowest point of the section — a 4 m grid cannot follow a 15 cm kerb. |
| The shoulder | For about one **ground-mesh** cell past a street's built edge, the earth may not stand higher than the back of the pavement. This is the only reason ground stops poking through road edges, and it must be sized from `groundGrid()` in `render/groundgrid.ts`, never from the elevation resolution — on a big city the mesh is capped and its cells are coarser. |
| Cutting the ground | A ground quad may be dropped only where **proven** to lie under paving: four corners at least one cell inside the paved region. An overshoot is a window through the world to the sky. Never widen the cut to save triangles. |
| Road surface | `world/roadprofile.ts` is the single source. Profiles are computed **once, on un-graded ground**, and shared by the renderer, the grading and the car. Recompute one afterwards and you get a road built on a road. |
| Terrain grid | Elevation arrives at 20-30 m. `resampled(4 m, streetBounds)` before grading: refined so a street cut is a street cut, and **grown to cover every way**, because grading can only write into the array it has and OSM ways run past the bbox. The mesh grid formula lives in `render/groundgrid.ts` and nowhere else — the core spans **2 × radius**. |
| Grip | One number, `availableGrip()`. Driving, braking and cornering all spend from it (friction circle). Never add a second grip constant. |
| Surface colour | Every material that touches the earth comes from `render/palette.ts` and is varied by the same world-space noise. **Little contrast between materials, real variation within each.** A surface painted one flat value reads as plastic whatever the geometry is. |
| Textures | A texture may only carry detail *finer than its own tile*. Anything at the tile's scale repeats visibly across open ground. Larger variation belongs in vertex colours, which are sampled in world space and never repeat. |
| Triangle budget | Instanced props multiply: a canopy's triangle count is paid once per tree. 6 600 trees at 540 triangles was 3.6 M — more than the whole rest of the city. Measure `renderer.info.render.triangles` after any change to an instanced mesh. |

## Environment

- **Overpass and Nominatim are blocked by the agent proxy.** Real cities can
  never be *downloaded* from the sandbox. But they no longer have to be:

  **Ask the user for a capture.** In the running site, About → "Save this
  place" writes the loaded area — streets, buildings, land cover and the
  terrain under them — to one gzipped file, around 0.2 MB for a small town.
  They attach it to a message; you read it with `npm run place -- <file>`,
  which reports the same measurements `tests/ground.ts` reports, and you can
  load it back into the app with the "Load a saved place" button beside it and
  *look* at their town in the sandbox browser.

  This was the single biggest hole in how this project was worked on. Before
  it, every fix to the real-OSM path shipped unverified and the user found the
  bugs by looking at the deployed site. Ask for a capture before guessing.

  The offline city is also the **wrong shape** for testing junctions: it draws
  long streets crossing each other, where OSM splits every street at every
  junction and joins the pieces end to end. Both topologies are covered in
  `tests/ground.ts`; a capture covers the real one.
- Terrain tiles (`s3.amazonaws.com/elevation-tiles-prod`) work from Node but
  not from sandboxed Chromium. Proxy them via a Playwright route handler.
- Chromium: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, launch with
  `--use-gl=swiftshader --enable-unsafe-swiftshader --no-sandbox`.
  It renders at well under 1 fps. **Do not measure simulation behaviour by
  wall-clock time in that browser** — step the simulation by hand from
  `page.evaluate` instead. This cost a whole debugging detour once.
  **SwiftShader draws no shadows at all.** Everything is configured and the
  shadow map is allocated; nothing appears. Judging shadow work from a
  sandbox screenshot is impossible — check the triangle counts and the light
  parameters, and have the user look at the real thing.
- `window.lifeboon` exposes the running app for probing from the console. The
  useful probes are `world.terrain.heightAt/slopeAt`, `roadIndex.nearest`, and
  raycasting straight down onto a named mesh to ask what was actually drawn.
- The build stamp (git SHA + time) sits in the **top bar**, beside the place
  name, and also in the About panel. Always tell the user which SHA to expect;
  a stale cache and a fix that did not work look exactly alike.

## Probes that have actually caught things

Written down because each of these overturned a confident wrong diagnosis.
Drive them from Playwright, waiting ~9 s per frame (SwiftShader is that slow).

- **What is really drawn here?** Raycast straight down onto a named mesh
  (`ground:base`, `roads:surface`, `buildings:roofs`) and compare with what the
  code thinks. This found the ground standing 1.1 m above a road the
  heightfield put 0.4 m below it.
- **Does the simulation agree with the picture?** `roadIndex.nearest().surfaceY`
  versus that raycast, sampled across the full street width, reported as
  median and 95th percentile. This is how "the car sits in the texture" was
  turned from a complaint into a one-line cause.
- **Which way do the triangles face?** Walk a geometry's position buffer and
  count normals by sign. Zero down-facing roof triangles proved the planes
  hanging over the street were legitimately visible, not a winding bug — after
  two wrong guesses.
- **Is this thing on?** Hide a mesh (`mesh.visible = false`), screenshot, and
  compare. Settles "is that artefact even coming from this object" in one step.
- **What is the range of this noise?** Bundle the module with esbuild and run it
  in Node over 200 k samples. `fbm` turned out to have a standard deviation of
  0.275, not 1 — which is why the quantised field parcels came out invisible.
- **What does a real town measure?** `npm run place -- capture.json.gz`, on a
  file the user exported from the running site. It found, within a minute of
  existing, that a bridge was being treated as a junction with the street it
  flew over — 10 m of earth raised under it — which no synthetic scene had
  ever produced.
- **Does the ground stand in the road?** `tests/ground.ts`, and it needs no
  browser at all: the ground mesh is grid vertices sampled from the heightfield
  and joined by triangles, which is arithmetic. Build a hard hillside, cut
  streets into it, reconstruct the mesh the renderer would build, sample across
  every street. This is now a regression test rather than a one-off
  measurement, and writing it immediately found a 47 cm bug that had been in
  the grading all along.

## Commands

```
npm run dev        # vite dev server
npm run build      # tsc --noEmit && vite build
npm test           # 100+ checks: OSM parsing, vehicle physics, driving, ground
npm run place -- f # measure a capture the user exported from the site
npx vite preview --port 4173 --host 127.0.0.1
```

Run `npm test` before every commit. The numbers in its output are regression
detectors, not decoration: if top speed, stopping distance, or the share of
ground standing in a road moves, something changed that should not have.

## Where things are

| Path | What |
|---|---|
| `src/data/` | Overpass fetch + cache, OSM parsing, offline city generator |
| `src/render/groundgrid.ts` | The ground mesh's grid: the one place the core-spacing formula lives |
| `src/render/areafield.ts` | Land cover, as paint the ground mesh samples |
| `src/render/streetmask.ts` | Where paving really went, so the ground can be cut away under it |
| `src/world/` | World model types, road profiles, street cross-sections, junctions |
| `src/world/network.ts` | The road network: nodes, edges, streets, lanes, turns. The start of the architecture everything else should move onto |
| `src/render/claims.ts` | Which way owns each square metre of ground, so two ways stop building over each other |
| `src/terrain/` | Heightfield, elevation tiles, waterway carving |
| `src/sim/` | Nav graph, population, vehicle physics, driver, road index |
| `src/render/` | Scene, camera, ground, roads, buildings, people, car |
| `docs/STATE.md` | **Read this first.** Where the project stands in full: what is proven, what is broken with numbers, what a rewrite should keep and what it should burn |
| `docs/GROUND-REWRITE.md` | Why the ground is one surface, how the street cuts it, the measurements, and what is still wrong (crossings) |
| `docs/ROAD-NETWORK.md` | Why roads became a network, the model, and the order to migrate onto it |
| `docs/DECISIONS.md` | What was tried, what worked, what is still open |
| `docs/DATA-AND-RIGHTS.md` | Licensing analysis for map data and architecture |
| `AGENTS.md` | The same project, for agents that are not Claude Code — they run on the user's own machine, so Overpass works and the GPU is real |
| `review/BRIEF.md` | The project framed for an outside reviewer: what is broken, with numbers, and the questions worth asking |
| `review/PANEL.md` | How several models work on this at once: one writer, several advisors, and measurements settle it |
