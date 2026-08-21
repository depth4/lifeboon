# Data, rights, and why this is buildable

Notes on the question the project starts from: *is there anything stopping you
from rendering a real city — its architecture and its streets — in a game?*

Short answer: no general prohibition. What exists is a set of specific,
tractable constraints, and they are mostly about **data licences and service
terms**, not about the buildings themselves. This is engineering orientation
gathered while building the thing, not legal advice; for a commercial release,
have a lawyer in your jurisdiction look at it.

## 1. The map data

This is the constraint that actually decides your architecture, and it is
decided before you write any code.

| Source | Can you build a game on it? |
| --- | --- |
| **OpenStreetMap** | Yes. ODbL 1.0: use it commercially, attribute it, and share alike any *derived database*. |
| Google Maps Platform | No, in practice. The terms restrict game use; the dedicated "Maps for Games" SDK was deprecated in 2021. Photorealistic 3D Tiles have their own terms and pricing. |
| Apple / HERE / TomTom | Commercial licences, negotiated, generally not aimed at this. |
| Overture Maps | Yes — permissively licensed, and increasingly the sane choice at scale. |

### Elevation

Separate source, separate licence, and it was the one obligation this project
was quietly failing. Terrain comes from the **Terrain Tiles** open dataset on
AWS (`elevation-tiles-prod`), assembled by Mapzen/Tilezen from a dozen national
and global datasets. Checked source by source against
[the Tilezen attribution list](https://github.com/tilezen/joerd/blob/master/docs/attribution.md):

- **No source restricts commercial use or redistribution.** 3DEP, SRTM,
  GMTED2010 and ETOPO1 are US public domain; the rest are CC BY, Open
  Government Licence, or explicitly free.
- **Every source requires attribution**, and each has its own required wording.
  The app named OpenStreetMap and said nothing about where the hills came from.
  The full list now sits in the About panel under "Data".

Switching elevation provider means switching that list with it.

This project uses OpenStreetMap. Two obligations follow:

- **Attribution.** "© OpenStreetMap contributors" is displayed in the UI at all
  times, not buried in an About box.
- **Share-alike, correctly scoped.** ODbL distinguishes the *database* from a
  *Produced Work* made from it. Rendered images and the on-screen city are
  Produced Works: they need attribution, not ODbL licensing. If you redistribute
  a modified extract of the data itself, that extract stays ODbL.

## 2. The buildings

Depicting a real building that exists in public view is broadly permitted, and
this is the part people most often assume is a problem when it isn't.

- **United States.** 17 U.S.C. § 120(a) says copyright in a constructed
  architectural work does not include the right to prevent pictorial
  representations of it, where the building is ordinarily visible from a public
  place. Buildings completed before 1 December 1990 are not protected as
  architectural works at all.
- **Europe.** "Freedom of panorama" covers this, and it is *not* harmonised.
  Germany (UrhG § 59) and the UK (CDPA s.62) are broad and clearly permit it.
  France's exception is narrower and aimed at non-commercial use by natural
  persons. Italy adds cultural-heritage rules for protected property. Individual
  landmarks are enforced aggressively — the Atomium in Brussels, and the Eiffel
  Tower's *night-time illumination* (the tower itself is public domain, the
  light show is a protected work).

Even in the strict jurisdictions, note what this project actually produces: a
prism extruded from a footprint polygon, with a generic window pattern. That is
a map, not a photograph. It reproduces the *position and mass* of a building,
which is factual, and none of the protected architectural expression. The
freedom-of-panorama question sharpens as fidelity rises — photogrammetry of a
distinctive landmark is a genuinely different case from an extruded box.

**Streets are not a problem at all.** Road geometry, names and layout are facts
about the world. Every navigation app on Earth depends on that being true.

## 3. What actually needs care

In rough order of how likely it is to bite you:

0. **Attribution you forgot.** Cheapest possible failure and the easiest to
   miss: a second data source arrives, and the credit line does not grow with
   it. Every source with a licence needs its line, and the line has to be in the
   product, not in a repository file.
1. **Service usage policy.** Far and away the most common way to get into
   trouble: pointing a public site at the volunteer-run Overpass and Nominatim
   servers and hammering them. That gets you blocked, fast, and rightly. This
   client caps area size, caches for a week in IndexedDB, and fails over across
   three mirrors instead of retrying one. Anything with real traffic should self-host.
2. **Trademarks and brand imagery.** Names, logos, signage, and the trade dress
   of distinctive commercial buildings. This is a different body of law from
   copyright — it turns on confusion and implied endorsement. The cheap and
   complete fix is not to import them: `src/data/tags.ts` discards `name`,
   `brand` and `operator` for anything commercial and keeps only the category.
   Street names are kept, because a street name is geography.
3. **Privacy.** A building footprint is not personal data. It becomes personal
   data when you link it to identifiable people — occupancy, names, movements,
   photographs of a specific home. That line is why the inhabitants here are
   invented, why their homes are assigned statistically from floor area, and why
   there are no interiors: the moment you render inside someone's actual house,
   you are making a claim about a real private space.
4. **Sensitive sites.** Some jurisdictions restrict depiction of military and
   critical infrastructure. OSM already handles much of this upstream.

## 4. It is demonstrably done

Games and simulators built on real-world map data, shipping commercially:

- **Microsoft Flight Simulator** — the whole planet, aerial imagery plus
  AI-generated buildings.
- **Pokémon GO** and **Ingress** — built on OpenStreetMap.
- **Google Earth**, **Cesium**, and the ecosystem of 3D-tile globe viewers.

So the premise holds. The obstacle was never permission.

## 5. Then why doesn't The Sims do this?

Because it would be a different product, not because EA is blocked. The reasons
are design and engineering, in roughly this order:

- **The Sims is about the inside.** Its verbs are build, buy, place an object,
  route a Sim to a fridge. The product *is* interiors and the objects in them —
  which is also where the expansion-pack revenue lives. Real map data supplies
  exactly the one thing The Sims doesn't need (accurate exteriors at city scale)
  and none of the thing it is made of (interiors, which no map has).
- **Agent cost is the wrong shape.** A Sim is enormously expensive: needs,
  moods, autonomy, relationships, per-object interaction animations, a full
  animation graph. You can afford dozens. A city district needs tens of
  thousands, which forces agents roughly as cheap as the ones here — a few
  needs, a state machine, a path. Those two designs do not meet in the middle.
- **Opposite content pipelines.** The Sims is hand-authored art with tight art
  direction. A real-world simulator is procedural geometry derived from messy,
  volunteer-contributed data of wildly varying quality. You cannot art-direct
  the planet.
- **You inherit whatever the map says.** Shipping "everywhere" means shipping
  places you have never seen and cannot QA — including, unavoidably, real
  people's actual homes. That is a support and reputation surface a family
  simulator has no reason to take on.

Which is also the honest summary of this project: the city part is very
buildable, and the reason a dollhouse game doesn't do it is that it is a
different game.
