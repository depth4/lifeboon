# Lifeboon

A city you can live in, in the browser. Real streets, real terrain, people who
live there — eventually.

It is being built **one mechanic at a time**, and nothing moves on until the
one before it is proven with a number and a picture. Real map data comes late
and only as instructions to a builder that already works: the game itself never
reads OpenStreetMap.

- **Now:** `/` — ground, and a road that presses it.
- **Before:** `/frozen/` — the previous version, which reached a real city and
  then collapsed under its own patches. Kept, working, frozen. Its source and
  its post-mortem are in `attic/`.

```
npm install
npm run dev      # http://127.0.0.1:5173
npm test         # the rules, then every mechanic
```

`CLAUDE.md` is how this project is worked on. It is short, and that is
deliberate.

## Data

When map data arrives, it will be © OpenStreetMap contributors, ODbL. Elevation
from public terrain tiles. The city is a model, not a survey: pavements,
parking and inhabitants are invented where the map is silent, and the project
says so rather than pretending otherwise.
