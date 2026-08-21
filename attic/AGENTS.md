# Working on Lifeboon

For agents other than Claude Code (Codex, OpenCode, Cline, Roo Code, Gemini,
Cursor, anything that reads `AGENTS.md`).

**Read `CLAUDE.md` first — it is the real instruction file.** This one exists
because `CLAUDE.md` was written for an agent running in a locked-down sandbox,
and you are probably running on the owner's own machine, where several of its
warnings do not apply. Read it anyway; then read the differences below.

## What this project is

A browser life simulator on real OpenStreetMap data: real streets, real
terrain, a drivable car. Vite + TypeScript + Three.js, static deploy to GitHub
Pages. ~15 500 lines, no game engine.

`docs/STATE.md` is where the project stands: what is proven, what is broken
with numbers, what a rewrite should keep. Read it before proposing anything
structural. `docs/PARTS.md` is the architecture as it is now: the world is
built out of **parts** — functional units that own the ground they stand on,
cell by cell — and the renderer draws those cells rather than reading
OpenStreetMap. Anything that computes a surface height outside a part is a bug
by construction.

## Non-negotiable

- **One branch: `claude/world-map-life-simulator-wthhom`.** There is no `main`.
  The deploy workflow watches that branch and only that branch. The owner has
  one build and wants one branch — do not invent feature branches unless they
  ask.
- **`npm test` before every commit.** 167+ checks. The numbers it prints are
  regression detectors, not decoration: if top speed, stopping distance or the
  share of ground standing in a road moves, something changed that should not
  have.
- **`npm run build`** (`tsc --noEmit && vite build`) must pass.
- No building interiors, no brand names, no real people. See `CLAUDE.md`.
- Never add a constant to hold two surfaces apart. Every recurring bug in this
  project started that way.
- Replies to the owner are in **Russian**; code, comments, commits and docs are
  in **English**. They are not a programmer — explain mechanisms in plain
  language, and never hand-wave.

## What you can do that a sandboxed agent cannot

Say so when you use it, because it is the main reason to run you here:

- **Reach Overpass and Nominatim.** The Claude Code sandbox is blocked from
  both, so every fix to the real-OSM path has historically shipped unverified.
  You can load a real city directly. Do.
- **Render with a real GPU.** The sandbox runs SwiftShader at under 1 fps and
  draws no shadows at all. You can actually look at the thing, measure frame
  time, and judge shadow work.

If you do neither, you are working under the same handicap as the agent that
wrote most of this, and you should expect to reproduce its mistakes.

## Measure, do not guess

The rule that has saved the most time here, and the one most often broken:

- `npm run place -- <capture.json.gz>` measures a real town — how much ground
  stands in the roads, how the network came out. Captures live in `.tmp/captures/`.
- `tests/ground.ts` rebuilds the exact mesh the renderer would build and
  samples across every street. No browser needed; it is arithmetic.
- `window.lifeboon` exposes the running app for probing from the browser
  console: `world.terrain.heightAt/slopeAt`, `roadIndex.nearest`, and
  raycasting down onto a named mesh to ask what was actually drawn.

**And look at the picture before committing.** A release once shipped with the
whole suite green and one swapped argument that drew pavement only where the
map already had a footway. Every number was fine because no number was
measuring what was drawn.

## If you are here as a reviewer, not a writer

Read `review/BRIEF.md` and `review/PANEL.md`. The panel protocol says how
several models work on this without standing on each other.
