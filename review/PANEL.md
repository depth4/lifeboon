# The panel: how several models work on this without ruining it

Four models were proposed: DeepSeek, Qwen, Gemini and Claude Opus. This is the
protocol for using them together. It exists because the obvious arrangement —
point them all at the repository and let them work — fails, and fails
expensively for an owner who is not a programmer and cannot untangle what four
agents did to the same file.

---

## The rule

**One writer. Several advisors. The measurements decide.**

- Exactly **one** agent has write access to the branch at a time. Today that is
  the agent in Claude Code, because it holds the project's history and the
  standing instructions. It could be another; what matters is that it is one.
- Everyone else **reads and answers**. They never touch files. Their output is
  text, and it lands in `review/answers/` so the repository keeps it.
- When advisors disagree, the disagreement is **not** settled by consensus,
  authority, or how confident an answer sounds. It is settled by running
  `npm test` and `npm run place`, and by looking at the screen.

That third point is the only reason this works at all. This project already has
a measurement harness that rebuilds the renderer's own mesh and counts how much
ground stands in the roads. Without it, four models produce four confident
opinions and no way to choose. With it, an opinion is a hypothesis and there is
a way to kill it.

## Roles

| Model | What it is for | Why |
|---|---|---|
| **Opus** | Architecture, diagnosis, deciding what to build, writing the code | Holds the history and the standing instructions; the expensive one, so spend it on decisions, not typing |
| **Gemini** | "Read everything and find what contradicts what" | Long context: it can hold the whole repository at once, which no other role needs and nothing else does as well |
| **DeepSeek / Qwen** | Mechanical work in a throwaway checkout: write tests, port code, run measurements and report numbers | Cheap enough to be interrupted and thrown away; the work is verifiable by running it |
| **Any of them** | Second opinion on a specific question from `BRIEF.md` §6 | Different training, different blind spots. The point is disagreement, not agreement |

## The loop

1. **Question.** The writer states one, in writing, with the numbers needed to
   answer it. `review/BRIEF.md` is the template: what is built, what is broken
   with figures, what has already been tried, what a useless answer looks like.
2. **Panel.** The owner hands that file to each advisor with the prompt in
   `review/ASK.md`. Same file to all of them — a panel where each member saw
   different evidence tells you nothing.
3. **Collect.** Each answer is saved verbatim as
   `review/answers/<model>-<topic>.md`. Verbatim matters: a summarised answer
   cannot be checked later against what the model actually said.
4. **Cross-read.** Advisors are then shown *each other's* answers and asked
   which they now think is wrong and why. This is the step that separates a
   real argument from four polite essays, and it is where the disagreements
   worth having show up.
5. **Decide and measure.** The writer picks, implements the smallest version of
   it that can be measured, and runs the numbers. If the numbers do not move,
   the idea was wrong, however good it sounded.
6. **Record.** The outcome goes into `docs/DECISIONS.md` — what was tried, what
   came of it. That file is why the same wrong idea does not get proposed for
   the third time.

## How to tell an advisor read the brief

A reviewer that did not read it praises the code's comments back to you. This
has already happened once: a review called the approach "mature and
hermetic" while the brief in front of it recorded 1.72 % of ground standing
above the road surface and a worst case of 9.5 m.

**The test:** does the answer contain a number from the brief? If not, it
reviewed the craftsmanship of the code instead of the architecture, and the
answer is worth nothing on the question asked. Hand it the numbers and ask
again.

## What not to do

- **Do not run two agents against the same working tree.** Not on different
  branches either, unless the owner asked for it: they have said plainly they
  want one branch and one build. Advisors get a separate throwaway clone or
  nothing.
- **Do not ask models to "discuss with each other".** They will converge on
  something agreeable. Force a specific disagreement instead: give each one the
  others' answers and ask which is wrong.
- **Do not accept an answer with no cost attached.** "Use constrained Delaunay"
  is not an answer. "Use constrained Delaunay, it costs roughly N triangles at
  this area, here is what breaks" is.
- **Do not let an advisor's answer straight into the code.** It has not run the
  tests, has not seen the town, and does not know what has already failed here.

## Plumbing

- The repository is **public**: https://github.com/depth4/lifeboon — any model
  with web access can be pointed at it directly. Nothing needs to be uploaded.
- One API key for several models: **OpenRouter** routes to most of them, so
  DeepSeek, Qwen and Gemini can be reached from one account and one bill.
- One interface for several models: **OpenCode**, **Cline** or **Roo Code**
  take an API key and let the model be switched per task, so the cheap ones do
  the mechanical work in the same editor.
- Instruction files, kept deliberately separate rather than duplicated:
  `CLAUDE.md` (Claude Code, sandbox-aware), `AGENTS.md` (everything else,
  running on a real machine with real network and a real GPU), `docs/STATE.md`
  (where the project stands), `review/BRIEF.md` (the review framing).
