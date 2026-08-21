# Lifeboon

A city you can live in, built **one mechanic at a time**, in the browser.
Vite + TypeScript + Three.js, deployed to GitHub Pages.

Real map data comes later and only as *instructions* to a builder that already
works. The game never reads OpenStreetMap.

Read this whole file. It is short on purpose: the file it replaces was 260
lines, and the rules that got broken were the ones nobody read to the end of.

---

## The attic

`attic/` is the previous version of this project — about 15 000 lines that got
as far as a real city and then collapsed under its own patches. It is kept
because the mistakes in it are worth having. `attic/docs/STATE.md` is the
honest inventory; `attic/review/BRIEF.md` is an outside opinion on why it went
wrong.

**It is not a source of code.** Anything wanted from it has to be read,
understood and rewritten here as its own small thing. `npm test` fails if
anything under `game/` imports from it.

The frozen build of it is served at `/frozen/` and still works.

## How we work

1. **One mechanic at a time.** The next does not start until this one is
   proven. Proven means a **number** and a **picture**, both committed.
2. **The hard case comes first.** Each mechanic's test opens with the awkward
   scene, not the tidy one. The previous project reported a 0.19 cm seam on a
   grid of identical streets and shipped a broken city; that is the mistake
   this rule exists for.
3. **The game never reads map data.** Checked by `game/test/isolation.ts`.
4. **Geometry comes from a library.** Union, difference, offsetting,
   triangulation: `polygon-clipping` and `earcut`. The previous project
   rejected polygon booleans and then hand-rolled them five times. If the
   question is "which ground belongs to what", the answer comes from a boolean
   operation or it does not get answered.
5. **Never add a constant to hold two things apart.** If two surfaces fight,
   they have the wrong *places*, not the wrong heights.
6. **Measure, do not guess.** Every claim about what is wrong arrives with the
   number that shows it. Three confident diagnoses in one afternoon were each
   disproved by a measurement taken minutes later.
7. **Look at the picture before committing.** `npm test` writes to
   `.pictures/`; the browser takes fifteen seconds.
8. **Files stay under ~300 lines.** A 1 333-line file was re-read whole every
   session, and that is where the mess collected.

## Working with the person who owns this

- **Not a programmer** — humanities background. Explain the mechanism in plain
  language; they follow it and they check it. Jargon without explanation is a
  failure.
- **Replies to them are in Russian.** Code, comments, commits and docs are in
  English.
- **Decide engineering yourself. Ask only about the product** — what the thing
  *is*. How to mesh the ground is yours; whether a city has invented interiors
  is theirs.
- **Report what you could not verify, every time.** Overpass is blocked from
  this sandbox. Saying so is the honest half of the report, not hedging.
- They start fresh chats often and on purpose. This file and `game/` are the
  only memory the project has.

## Hard constraints

- No building interiors. No brand names — a cafe is "a cafe". No real people.
- **One branch: `claude/world-map-life-simulator-wthhom`.** The deploy workflow
  watches it and only it. A web session gets its own `claude/<slug>` branch, so
  **push to both**, always:
  ```
  git push -u origin <the branch the harness named>
  git push origin HEAD:claude/world-map-life-simulator-wthhom
  ```
  Never open a PR unless asked. Before saying anything is live: check the
  workflow run for your SHA and quote the SHA.

## Commands

```
npm run dev      # vite dev server
npm run build    # tsc --noEmit && vite build
npm test         # the isolation rule, then every mechanic
```

## Where things are

| Path | What |
|---|---|
| `game/world/area.ts` | Ground as polygons. Every "whose ground is this" question |
| `game/world/ground.ts` | The heightfield and its one operation: `press` |
| `game/world/road.ts` | A road: a line, a width, a slope limit |
| `game/render/` | Turning the world into triangles. Decides nothing |
| `game/test/` | One file per mechanic. The hard case first |
| `.pictures/` | What each mechanic looks like. Committed on purpose |

## Mechanics, in order

1. ✅ **Ground, and a road that presses it.**
2. Two roads crossing — the junction falls out of a union, nothing builds it.
3. A pavement beside the road.
4. Kerbs.
5. Buildings.
6. Save and load the world's own file.
7. The importer: OpenStreetMap → that file. A real city, at last.
8. Cars on lanes. Then people.
