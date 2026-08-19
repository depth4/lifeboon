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
- **Do not decide big things alone.** They chose "ask at every fork". A fork
  is a choice that is expensive to reverse or that changes what the product
  is. Routine judgement calls are yours — asking about those wastes their
  time and the token budget.
- **Report honestly.** If a fix is unverified, say so. If a diagnosis was
  wrong, correct it in one sentence and move on.
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
- **Branch `claude/world-map-life-simulator-wthhom`.** Never push elsewhere
  without explicit permission. Never open a PR unless asked.

## The rule that has saved the most time

**Measure, do not guess.**

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
| Height stack | land cover ≤ 0.21 m · carriageway 0.28 · markings 0.31 · pavement 0.38. Keep gaps: surfaces within a few cm fight in the depth buffer. |
| Road surface | `world/roadprofile.ts` is the single source. The renderer and the car must agree, or the car sinks through bridges. |
| Grip | One number, `availableGrip()`. Driving, braking and cornering all spend from it (friction circle). Never add a second grip constant. |

## Environment

- **Overpass and Nominatim are blocked by the agent proxy.** Real cities can
  never be loaded from the sandbox — only the generated offline city. Any fix
  to the real-OSM path is unverified until the user checks it. Say so.
- Terrain tiles (`s3.amazonaws.com/elevation-tiles-prod`) work from Node but
  not from sandboxed Chromium. Proxy them via a Playwright route handler.
- Chromium: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, launch with
  `--use-gl=swiftshader --enable-unsafe-swiftshader --no-sandbox`.
  It renders at well under 1 fps. **Do not measure simulation behaviour by
  wall-clock time in that browser** — step the simulation by hand from
  `page.evaluate` instead. This cost a whole debugging detour once.
- `window.lifeboon` exposes the running app for probing from the console.
- The build stamp (git SHA + time) is shown in the app under
  "Controls & data quality". Use it to tell a stale cache from a failed fix.

## Commands

```
npm run dev        # vite dev server
npm run build      # tsc --noEmit && vite build
npm test           # 100+ checks: OSM parsing, vehicle physics, driving
npx vite preview --port 4173 --host 127.0.0.1
```

Run `npm test` before every commit. The physics numbers in its output are
regression detectors — if top speed or stopping distance moves, something
changed that should not have.

## Where things are

| Path | What |
|---|---|
| `src/data/` | Overpass fetch + cache, OSM parsing, offline city generator |
| `src/world/` | World model types, road surface profiles |
| `src/terrain/` | Heightfield, elevation tiles, waterway carving |
| `src/sim/` | Nav graph, population, vehicle physics, driver, road index |
| `src/render/` | Scene, camera, ground, roads, buildings, people, car |
| `docs/DECISIONS.md` | What was tried, what worked, what is still open |
| `docs/DATA-AND-RIGHTS.md` | Licensing analysis for map data and architecture |
