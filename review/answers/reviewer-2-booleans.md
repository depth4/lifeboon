# Reviewer 2 — hand-rolled booleans, and `RoadNetwork` as dead weight

**Date:** 2026-08-21
**Given:** `review/CORE-CODE.md` (12 files). Says it can fetch further files by
raw URL on request. Had not read `docs/` at the time of writing.
**Status:** verified against the source. Correct, and sharper than anything in
`docs/STATE.md` was before it.

## What it said, verbatim on the substance

> Того, что ты приложил (особенно `roads.ts` на 1333 строки, `heightfield.ts`,
> `claims.ts` и `junctions.ts`), мне хватило с головой, чтобы на 95%
> диагностировать архитектурный тупик. Я увидел, как именно вы пытаетесь
> "запилить" булевы операции вручную, почему земля торчит сквозь асфальт и
> почему `RoadNetwork` лежит мёртвым грузом.

It also stated, correctly, that it cannot `git clone`, and that a bare
repository link in a chat gets it the README and a top-level file list and
nothing more.

## Verified

Counted in the source rather than taken on trust. Four representations of
"which square metre is covered by what", none reconcilable:

- `world/junctions.ts` — constructive union, analytic (29 references to
  fillets and meet points).
- `render/claims.ts` — `Int32Array` ownership raster, cell
  `max(0.5, radius/3000)` = **0.5 m** at a 1500 m radius.
- `render/streetmask.ts` — `Uint8Array` paved raster, cell
  `max(1, radius/500)` = **3 m** at the same radius. Six times coarser than
  the other raster, answering nearly the same question.
- `render/roads.ts` — per-segment boolean arrays: `combine`, `invert`,
  `pavementBands`, the per-band `yielded` test.

`RoadNetwork` being dead weight was already recorded (`STATE.md` §3.3, brief
§3.3), so that half is confirmation rather than discovery — but it is
confirmation from something that read the code, not the claim.

## Why it matters

`docs/DECISIONS.md` records polygon booleans as **tried and rejected**, on
robustness grounds. That rejection did not avoid the complexity; it scattered
it across four representations that disagree. The reviewer is challenging a
settled decision, which is what the brief asked reviewers to do, and the
challenge holds.

Recorded as `STATE.md` §4.6.

## Not yet established

- "95 % diagnosed" carries no cost, no measurement and no migration order.
- It has not seen `docs/`, so it does not know what has already been tried,
  and does not yet know the 8.14 m ground-mesh cell that constrains any answer
  to question 1 of the brief.
- A boolean library still has to survive real OSM at a scale where 454
  junctions are built per town. That was the original objection and it has not
  been answered.

## Also said, and wrong

> у Claude Opus — 200 тысяч [токенов контекста]

Claude Opus 5's context window is 1M tokens. The whole repository fits.
