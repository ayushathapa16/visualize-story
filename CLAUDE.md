# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An animated **scrollytelling documentary** - "One Bird's Story. Toronto's Future." - about Willow,
a Tree Swallow, and how a warming climate pulls Toronto's spring out of sync with the birds that
depend on it. Vanilla JS + Vite + GSAP + Lenis. No framework, no tests, no linter.

All 24 scenes (Acts I–VII) are built and registered in `src/frames/registry.js`. **Scene number ==
file number**: Scene 7 is `frame07.js`. Keep it that way - the moment they drift, every note in the
script points at the wrong file.

**Everything the story asserts lives in `src/data/sources.js`** (prose and citations),
**`src/data/torontoBirds.js`** (the Filazzola figures), **`src/data/phenology.js`** (the tree
swallow literature) and **`src/data/context.js`** (everything that is not about Willow - Ontario
climate, continental bird abundance, global insect trends, native plants). No frame hardcodes a
number or a citation. `torontoBirds.js` is **generated** - see "The data" below; never hand-edit it.

### Illustration vs. evidence

The piece has two registers, and confusing them is the one unrecoverable mistake here.

**The register is no longer positional.** It used to be: Scenes 19–21 were evidence and everything
else was illustration. As of 2026-07-28 **seventeen** scenes are evidence-backed — 2, 6, 8, 10, 11,
12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 — first because the tree swallow phenology literature
turned out to have papers about this exact species and mechanism (`docs/sources.md` §F), and then
because the scenes at the two ends of the piece got sources of their own (§G). So you can no longer
tell which register you are in from the scene number.

The scenes still carrying no figure are 1, 3, 4, 5, 7, 9 and 24, and that is a list of **open
gaps**, not a design. Each one asserts something ordinary about tree swallow life history - cavity
nesting, clutch size, nestling growth, migration cues - that is certainly true and that nobody here
has read a paper for. The nearest sources are paywalled (Birds of the World) or uncited hobbyist
pages. If you find open-access sources for those, they belong on those frames.

**What tells you instead: is there a citation on the stage?**

- **Illustrative art** teaches a shape and is never labelled with a number it can't support. The
  Ontario range blobs, Scene 10's abundance curves, Scene 9's timeline bars, Scene 16's flock.
- **Evidence** is any figure a reader can read, and it carries `sourceNote()` from
  `components/chart.js` **on the stage** — not in a drawer. A number on screen without a visible
  source is a bug.

The two can now share a frame, and several do: Scene 12's cold snap is illustrative art carrying a
cited claim about the mechanism it depicts. That is allowed. What is not allowed is letting a
citation next to a picture imply the picture is data — Scene 10 cites how fast the gap is widening
and still must never label its curves with an axis, because nobody has published that curve.

**Where the figures live.** Three data modules, and none is optional:

- `src/data/torontoBirds.js` — **generated** by `scripts/build-data.py`, asserts on every headline
  number. Never hand-edit.
- `src/data/phenology.js` — **hand-maintained**, the tree swallow literature. Figures reported in
  the text of papers, so there is nothing to download and no assert to write. What replaces the
  assert: every figure names what was **measured** and where, and every study carries a
  `provenance` of `read` or `secondary`. Read that file's header before adding to it.
- `src/data/context.js` — **hand-maintained**, same rules, everything that is *not* about Willow:
  Ontario's observed warming, the continental bird declines, the global insect trend, the
  native-plant threshold (`docs/sources.md` §G). It is separate from `phenology.js` on purpose -
  that module's header is a promise about what is inside it, and frames rely on that promise when
  they reach for a figure. Its scopes are the widest in the project (a province, a continent, the
  world, a suburb of Washington DC), so its labels do the most work.

**One figure in the piece is `secondary`** — Probst et al. 2026's Long Point numbers (Scenes 10 and
14). PNAS is paywalled; the figures come from the press release and nobody here has read the paper.
That was a deliberate call, recorded under the 🟡 tag in `docs/sources.md`. It is not a precedent.
If you get institutional access, read it and either promote it or correct what is on screen.

**All the phenology work is New York State except Long Point, which is southern Ontario.** Not one
of it is a Toronto measurement, and every label on screen says where it was taken. Do not drop the
scope to make a line fit.

Scene 17 carries the Audubon claim (+1.5 °C / +3.0 °C warming scenarios). Those continental figures
live in one place - `SCENARIOS` in `src/components/climate.js` - and the Ontario map geometry is
*illustrative*, not a projection. **Audubon's Ontario numbers remain unquotable**: they sit behind a
widget that isn't scrapeable (re-confirmed 2026-07), so no card shows an Audubon statistic.

The bird cards *do* now carry figures, from the Filazzola dataset - but only for the three species
that are actually in it. **Tree Swallow, Common Loon and Barn Swallow are not modelled for Toronto**
(dropped by the paper's AUC < 0.70 filter), so their cards say exactly that instead of showing a
number. Willow's own card has no figure, and that is correct. Don't substitute a congener.

Scene 10 makes the one scientific argument, and it is weaker than it looks: the chicks still hatch
while insects are around, they just miss the **peak**. That is why the insect row is an abundance
*curve* and not a bar - a bar could only say "present / absent", which would let the chart assert an
empty sky. Don't simplify it back into a bar. **Scene 10's argument is not in the Filazzola paper**
- that paper is about species turnover, not phenology - so no figure of its ever goes in
`MISMATCH`. Attaching its numbers there would be a citation that doesn't support its claim.

`MISMATCH.facts` shipped **empty** for most of this project's life, and that was the correct state
while nothing supported it. It is now filled from `phenology.js` — Mayor et al. 2017 (green-up vs
arrival, continental) and Probst et al. 2026 (breeding vs insect peak, Long Point). Every label
states what was measured, because the first of those is a proxy and the second is secondhand.
Empty is still the safe state: `panel.js` omits an empty `facts`/`sources` block entirely, so
deleting a fact you can't stand behind costs nothing.

## The data

Scenes 16 and 19–21 run on **Filazzola et al. 2024, PLOS ONE 19(3):e0299217** (CC BY 4.0) plus the
IUCN Red List assessments bundled with it. Scenes 6, 8, 10, 11, 12 and 14 run on the tree swallow
phenology papers in `docs/sources.md` §F, via `src/data/phenology.js`. `docs/sources.md` is the
record of what has actually been read, what has only been found, and what was taken from a press
release; read it before citing anything.

```bash
python3 scripts/build-data.py    # → src/data/torontoBirds.js  (run by hand, needs network)
```

The script downloads the paper's CSVs, filters to Toronto, joins IUCN, and **asserts** on every
number that reaches the screen (888 / 159 / 40 / 360 / 195 / 354 / 218 / 154 / 141 / 6 VU / 18 NT /
138 decreasing). If an assert fires the upstream data moved - stop and re-verify. Do not relax it.

Three things that must keep being said, because each one is easy to get wrong:

1. **This is turnover, not migration.** The paper models which species have a suitable *climate* in
   a city. It says nothing about arrival dates or flyways. Never label anything from it "migration".
2. **Suitability is not abundance.** Values are MaxEnt predicted occurrence (0–1). Not bird counts,
   not probabilities of seeing one.
3. **The 0.5 presence cut is ours**, not the paper's - its own per-species threshold isn't
   published. Headline numbers come from the paper's table; only shape comes from our cut. Scene 20
   says so on its face.

The IUCN layer (Scene 21, and the status lines on the bird cards) is **IUCN's assessment, not a
finding of the paper**, and its labels say so. The paper's own caveat travels with it: at-risk
species were *not* necessarily the ones most vulnerable to climate change.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview
```

There is **no test suite and no linter**. `npm run build` is the only automated check; it catches
import/syntax errors but not runtime or visual regressions. Verify visually (below).

## Verifying changes

Animation bugs are invisible to the build. After any change to a frame, component, or the engine,
drive the page in a real browser and look at it:

- `http://localhost:5173/?nolabels` - the **Memory Test**. Hides all narration/labels/annotations.
  Per `docs/direction.md`, the story must still read from the visuals alone. This is the project's
  primary quality bar, not a nice-to-have.
- Toggle OS **reduce motion** - frames must settle into readable end states.
- Check a **portrait/phone viewport and a short desktop viewport** - most layout bugs found so far
  were captions colliding with in-SVG labels, and they only appear at certain aspect ratios
  (in-SVG text scales with the viewBox; narration is DOM text pinned to `bottom: 9vh`, so they
  converge on short viewports - and a frame's camera zoom magnifies the collision).

**Two hard layout constraints, both learned the expensive way on Scenes 19–21 - and they now bind
the eight scenes that carry `sourceNote()` lines too:**

- **Portrait shows only viewBox x ≈ 330–1270.** `base.css` scales the stage 1.7× on a portrait
  screen and crops the margins. Full height is visible; horizontal space is not. Anything with a
  label - a chart especially - must live inside that band or a phone reader loses it off the edge.
- **The foot of the stage belongs to the caption.** Narration is pinned to `bottom: 9vh` in *screen*
  space while SVG text scales with the viewBox, so on a 1440×620 window the caption climbs to about
  viewBox y 700. Citations and axis furniture go **above** the chart, not below it.

## The three source docs

Read these before making story/animation decisions; they are the spec:

- `docs/story.md` - the script (two voices per scene, Willow then narrator).
- `docs/sources.md` - **what has been read and what has not.** Every claim's provenance, tagged
  verified / lead-only. Consult it before citing anything; a paper nobody here has read is worse
  than one fewer citation.
- `docs/direction.md` - **the north star.** Show before explaining; animate before labeling;
  one idea per frame; three motion tiers; every frame ends on a question. Motion decisions should
  cite this.
- `docs/reference-image/animation-helper.png` - the paper-cut visual language and palette.

## Architecture

```
src/
  engine/     camera, motion, scroll, reveal, morph, audio, xform, svg, frame, hit, gsap
  characters/ willow (mood system), chick (growth + energy dials)
  components/ toronto, parkLife, globe, gears, timelineBar, thermometer, nest,
              weather, insects, flora, flock, birdCards, climate,
              calendar, panel, chart (real data - always with sourceNote())
  data/       sources.js     ← prose, per-species facts, every citation
              torontoBirds.js ← GENERATED by scripts/build-data.py - Filazzola figures
              phenology.js   ← HAND-MAINTAINED - the tree swallow literature (Scenes 6-15)
              context.js     ← HAND-MAINTAINED - everything not about Willow (2, 8, 14, 18, 22-23)
              coastlines.js  ← GENERATED: Natural Earth 1:50m, for globe.js
  frames/     frame01…frame24 + registry.js
  state.js    the reader's Scene 11 choice, read by Scene 12
  ui/         progress (HUD)
  styles/     tokens.css, base.css
```

**Frame lifecycle.** `main.js` walks `frames/registry.js` and calls `engine/frame.js:mountFrame()`
per spec. Each frame becomes a tall `<section>` containing a **sticky** SVG stage; the section's
extra height is the scroll distance its GSAP timeline scrubs across (pinning is CSS `position:
sticky`, not ScrollTrigger pin). A frame module default-exports `{ id, title, act, mood, build(ctx) }`.

**The `ctx` handed to `build()`** is the whole API a frame needs: `scene` (the camera group - append
world art here), `backdrop(fill)`, `camera`, `tl` (the frame's scrubbed timeline), `narrate()`,
`annotate()`, `scrollCue()`, `audio`, `W`/`H` (viewBox 1600×900), `reduced`.

`narrate()` takes either plain lines or the two-voice scene format,
`narrate({ willow, narrator })`. Willow reacts; the narrator explains. Willow speaks first - the
other order explains before showing.

**Anything clickable is a DOM node over the stage, never SVG inside it.** The stage `<svg>` is
`aria-hidden` (it is a decorative animation), so a focusable element inside it is unreachable by
assistive tech. `engine/hit.js` projects an SVG element's box into a real `<button>` for cases like
the bird cards; `panel.js` and `calendar.js` are plain DOM. Every new text/UI overlay must also be
added to the `body.nolabels` list in `base.css`, or it leaks into the Memory Test.

**Stage layer order** is `backdrop` < `camera` < `overlay` (paper grain). Backdrops live *outside*
the camera group on purpose - a camera push must not be able to drag the sky off-screen and expose
the page behind it. Ground/sky planes overscan far past the viewBox because the stage uses
`preserveAspectRatio="meet"` (fitting, not cropping - `slice` showed a phone only a sliver of the
1600-unit-wide scene).

**Direction-guide concepts are engine primitives**, so frames stay declarative:
`engine/camera.js` (wide/medium/close/macro shots), `engine/motion.js` (`drift`/`sway`/`bob` ambient
loops + `stillness()` for held emotional beats), `engine/reveal.js` (labels/data withheld until the
animation has earned them), `engine/morph.js`.

## Two invariants that are easy to break

**1. `engine/xform.js` owns every rotation and scale. Never mix a `transform` attribute with a GSAP
transform on the same element.**

GSAP animates SVG via CSS transforms, and a percentage `transform-origin` resolves against the
*viewBox*, not the element - so pivots land far off-screen (this made the gears vanish).
`transform-box: fill-box` is *not* a fix: the SVG `transform` attribute maps to the same CSS
property, so fill-box re-interprets attribute `rotate()`s and scrambles them (it destroyed the gear
teeth). GSAP's CSS transform also silently *overrides* a `transform` attribute on the same element.

The resolution: **draw art around its own local (0,0)** - a wing around its shoulder, a gear around
its centre - and let `xform(el, {x, y, rotation, scale})` write the `transform` attribute directly.
Rotation/scale are then exactly about the pivot, with no origin to get wrong.

- Rotating or scaling something? Use `xform()`.
- Translating only (no origin ambiguity)? GSAP `x`/`y` is fine, via `place()` in `engine/svg.js`.
- Static and never animated? A `transform` attribute is fine (e.g. the `clock`/`nest` root nodes).

**2. Assets are reused across frames on purpose.** The same nest, branch, skyline, gears and the same
Willow recur. Per the direction guide, that familiarity is what builds attachment - don't fork a
component to tweak one frame; parameterize it. The structural pairs the story is *built* on:

- **Scene 1 ↔ Scene 24** - the same shoreline at dawn and dusk, sharing `parkLife` and the same
  camera path run in reverse. Move the park or the framing in one and you must move it in the other,
  or the ending stops landing.
- **Scene 6 ↔ Scene 14** - the same nest, flight and golden light, with the abundance taken out.
- **Scene 4 → 8 → 9** - one `gears.js` clock: working, running early, broken.
- **`nest.js`** is one component with a lifecycle (`buildTo` → `layEggs` → `hatch` → `setGrowth` →
  `setEnergy`), across Scenes 3, 5, 7, 15 and 24. Not five nests.

## Audio

Off by default and a graceful no-op when files are absent. Drop `wind.mp3`, `swallow-call.mp3`,
`insects.mp3`, `rain.mp3` into `src/assets/audio/` and the HUD mute toggle picks them up. Silence is
a deliberate storytelling cue - **Scene 15 stops every bed and adds none.** Don't fill it.
