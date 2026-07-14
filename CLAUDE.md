# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An animated **scrollytelling documentary** - "One Bird's Story. Toronto's Future." - about Willow,
a Tree Swallow, and how a warming climate pulls Toronto's spring out of sync with the birds that
depend on it. Vanilla JS + Vite + GSAP + Lenis. No framework, no tests, no linter.

All 21 scenes (Acts I–VII) are built and registered in `src/frames/registry.js`. **Scene number ==
file number**: Scene 7 is `frame07.js`. Keep it that way - the moment they drift, every note in the
script points at the wrong file.

**Everything the story asserts lives in `src/data/sources.js`.** No frame hardcodes a figure or a
citation.

Scene 17 carries the project's one hard data claim (Audubon's +1.5 °C / +3.0 °C warming scenarios).
Those continental figures live in one place - `SCENARIOS` in `src/components/climate.js` - and the
Ontario map geometry is *illustrative*, not a projection. Don't state numbers the map implies but the
sources don't. **Per-species outlooks are not quotable**: Audubon's Ontario numbers are behind a
widget that isn't scrapeable, so the bird cards say nothing numeric on their face. Opening a card
shows prose plus whatever citations the author has supplied - and `facts`/`sources` in
`data/sources.js` currently ship **empty on purpose**. `panel.js` omits an empty block rather than
rendering a placeholder. Empty is the safe state; a placeholder in a citation list is
indistinguishable from a fact.

Scene 10 makes the one scientific argument, and it is weaker than it looks: the chicks still hatch
while insects are around, they just miss the **peak**. That is why the insect row is an abundance
*curve* and not a bar - a bar could only say "present / absent", which would let the chart assert an
empty sky. Don't simplify it back into a bar.

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

## The three source docs

Read these before making story/animation decisions; they are the spec:

- `docs/story.md` - the script (21 scenes, 7 acts; two voices per scene, Willow then narrator).
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
              calendar, panel
  data/       sources.js     ← every figure, citation and action claim
              coastlines.js  ← GENERATED: Natural Earth 1:50m, for globe.js
  frames/     frame01…frame21 + registry.js
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

- **Scene 1 ↔ Scene 21** - the same shoreline at dawn and dusk, sharing `parkLife` and the same
  camera path run in reverse. Move the park or the framing in one and you must move it in the other,
  or the ending stops landing.
- **Scene 6 ↔ Scene 14** - the same nest, flight and golden light, with the abundance taken out.
- **Scene 4 → 8 → 9** - one `gears.js` clock: working, running early, broken.
- **`nest.js`** is one component with a lifecycle (`buildTo` → `layEggs` → `hatch` → `setGrowth` →
  `setEnergy`), across Scenes 3, 5, 7, 15 and 21. Not five nests.

## Audio

Off by default and a graceful no-op when files are absent. Drop `wind.mp3`, `swallow-call.mp3`,
`insects.mp3`, `rain.mp3` into `src/assets/audio/` and the HUD mute toggle picks them up. Silence is
a deliberate storytelling cue - **Scene 15 stops every bed and adds none.** Don't fill it.
