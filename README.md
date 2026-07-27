# One Bird's Story. Toronto's Future.

An animated **scrollytelling documentary** about **Willow**, a Tree Swallow, and how a warming
climate is pulling Toronto's spring out of sync with the birds that depend on it.

You scroll, and a season of Willow's life plays out as one continuous animation - no chapters to
click, no charts to study. It is built to feel less like an infographic and more like a short
animated film: you are meant to *care about Willow first*, and understand the science second, almost
by accident.

The whole piece makes one argument, in a single line:

> Nature runs on timing. Warming breaks the timing. And a number small enough to sound harmless is
> large enough to empty a city's sky.

- Story script: [`docs/story.md`](docs/story.md)
- Direction guide (the north star for pacing/animation): [`docs/direction.md`](docs/direction.md)
- Full walkthrough + a frank note on which data is real: [`docs/story-and-data.md`](docs/story-and-data.md)

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

---

# The Story

26 frames, 7 acts, narrated in the first person by Willow. Narration is deliberately sparse - the
animation is meant to carry ~80% of the story, so the words only deepen what you are already
watching.

## Act I - Home (Frames 1–4)

The mood is calm, warm, and curious. We meet her before we meet the problem.

1. **Darkness.** A black screen. Wind. A single distant swallow call. *"Every spring, millions of
   birds return to Toronto. This is the story of one of them."*
2. **The Journey.** A glowing migration path draws itself from South America, up through Central
   America and the United States, across Lake Ontario, to Toronto - and Willow flies it. *"I fly
   thousands of kilometres to spend my summer in Toronto."*
3. **Meet Your Summer Neighbour.** Paper-cut Toronto: CN Tower, waterfront, wetlands, parks, people.
   She glides through it. *"Toronto is your home. It's **mine** too."* - the line that makes the city
   shared, and the reason the ending lands.
4. **My Routine.** A season timeline, April → July: arrive, build, lay, raise. Nothing is wrong yet.
   *"Nature always knew what came next."*

## Act II - Nature's Clock (Frames 5–7)

The mood turns beautiful and predictable - so that breaking it will hurt.

5. **Nature's Clock.** The signature image: meshed gears, each a spring event - flowers bloom,
   insects emerge, the swallow arrives, eggs hatch, chicks are fed. You see the icons turning in
   sync first; the labels only appear once you already understand the machine.
6. **A Good Year.** The nest. Four chicks hatch into a sky thick with insects; the parents return
   loaded with food. This is what a working year feels like - you have to feel the abundance here,
   or its loss means nothing later.
7. **The First Crack.** One gear slips. Slowly. A crack draws itself across the clock. No
   explanation. *"But something has changed."*

## Act III - The Clock Breaks (Frames 8–14)

Uneasy, confusing, quietly stressful. The timing comes apart.

8. **Spring Arrives Earlier.** A thermometer climbs **+1 °C → +2 °C**. Trees green, flowers open,
   insects emerge - while Willow is still out over the water, flying north. *"Spring is arriving
   before I do."* (Remember this thermometer - Frame 20 comes back for it.)
9. **The Timeline Shifts.** The strongest chart in the piece. Four bars - flowers, insects, bird,
   chicks - all overlapping. Then **only the insect bar slides earlier**, and the overlap opens into
   a gap. Only once the gap is undeniable does the term appear: **phenological mismatch**.
10. **I Have to Hurry.** She lands into a spring already underway and starts nesting at once. *"If I
    wait, my chicks may miss the food they need."*
11. **Then Everything Changes.** Dark clouds, cold rain, snow. The insects stop flying. The sky
    empties. Silence.
12. **Hungry Chicks.** The parents search and return with one insect, then none. The chicks go
    quiet. *"My babies are hungry."*
13. **The Chain Reaction.** Cold → insects stop → parents search longer → less food → slower
    growth → lower survival.
14. **Searching Farther.** Top-down: the search radius around the nest expands and expands, each
    trip longer than the last. *"Every extra minute searching for food is one less minute feeding
    my family."*

## Act IV - A Gamble (Frames 15–17)

There is no longer a right move.

15. **Every Spring is a Guess.** A weather wheel - warm, cold, rain, heat - spins and never lands.
    Willow waits beside it. *"Every spring… I have to guess, and hope I guessed right."*
16. **Interactive Choice.** *The only clickable moment in the whole piece.* **Should Willow lay her
    eggs now?** - *Lay eggs now* / *Wait longer*.
    - Lay now → the eggs hatch straight into a cold snap; the insects stop. Hungry chicks.
    - Wait → no cold snap, but the insect boom peaks and drains away while she's still on eggs; she
      hatches into an empty sky. Hungry chicks.

    **Both answers lose - that is the point.** You aren't being tested; you're being shown that the
    choice itself has stopped working. (Scroll past without clicking and it plays a path for you.)
17. **No Perfect Choice.** The wheel stops. Nothing is resolved. *"Breeding has become a gamble."*

## Act V - I'm Not Alone (Frames 18–21)

The camera lifts off Willow and the story widens from one bird to a whole community - and this is
where the science lands.

18. **Zoom Out.** The camera pulls back: one bird becomes several, becomes many, becomes a skyline
    full of them. *"My story isn't unique."*
19. **Toronto's Bird Neighbours.** Six species as cards - Tree Swallow, Canada Jay, Common Loon,
    Bobolink, Wood Thrush, Barn Swallow. *"None of us makes the journey alone. We all keep the same
    appointment with spring."*
20. **Two Degrees - the turn, and the frame the whole piece is built toward.** Frame 8's thermometer
    returns, and you recognise it: it read +1 °C / +2 °C, and you'd already decided that was a small
    number. Then its scale is **re-labelled to +1.5 °C and +3.0 °C** - the warming scenarios science
    actually models.
    > *One degree. Two degrees. It sounds like nothing at all.*

    The mercury climbs to +1.5 °C and Ontario's bird ranges dim and creep north; it holds there -
    the survivable outcome. Then it climbs to +3.0 °C and the ranges collapse and pull away from
    Toronto entirely.
    > *It is enough to put hundreds of birds in danger.*

    Only now, after the map has already made the argument, does the number appear: **389 of 604**
    North American bird species are vulnerable at +3 °C; hold warming to +1.5 °C and **nearly 150**
    of them are no longer at risk.
21. **A Different Sound.** Split screen, one shared skyline. Left: today, Willow, her song. Right:
    future Toronto, different birds, a visibly different song-shape. *"A warmer world doesn't only
    change where we live. It changes what your city sounds like."*

## Act VI - The Future (Frames 22–23)

Reflection, then a turn toward hope.

22. **The Empty Nest.** The same nest, the same branch, at sunset - empty. The frame holds on the
    emptiness long enough to hurt, and then one swallow glides in and lands. *"I come back hoping
    Toronto still feels like home."*
23. **My Children.** The fledglings take their first flight and dissolve into the skyline - flying
    *into* the city, not away from it. *"I hope my children will too."*

## Act VII - A Shared Home (Frames 24–26)

24. **This City Belongs to All of Us.** The park, the people, the birds overhead, in one frame.
    *"Toronto belongs to all of us."*
25. **What You Can Do.** Four cards, each a small causal chain in the story's own grammar: plant
    native wildflowers → more insects → more food; leave fallen leaves; reduce pesticides; volunteer
    at Tommy Thompson Park. *"The smallest things can call the insects home."*
26. **Closing Scene.** Golden sunset. Willow crosses the skyline one last time, the screen fades to
    black - and the swallow call from Frame 1 returns, in the dark, except now you know whose it is.
    > *Toronto is your home. It's ours too. The future of Toronto's birds depends on the choices we
    > make today.*

---

# Is the data real?

**The numbers stated on screen are real and sourced; the charts and maps are illustrative, and are
deliberately never labelled with numbers they can't support.**

The piece makes exactly **one** hard quantitative claim - Frame 20 - and every figure in it comes
from the National Audubon Society's *Survival by Degrees* (2019): 389 of 604 North American species
vulnerable at +3 °C, "may lose more than half their range" (their definition), and nearly 150 no
longer at risk if warming is held to +1.5 °C. Even the +1.5 / +2.0 / +3.0 °C scale is real - those
are the scenarios Audubon models. The numbers live in one place, `SCENARIOS` in
[`src/components/climate.js`](src/components/climate.js).

Everything else is either a real scientific *concept* rendered as a picture (phenological mismatch
in Frame 9) or an illustrative visual carrying no numbers (the shrinking range-blobs on Frame 20's
Ontario map are paper-cut, **not** projected ranges). The full accounting - including one Ontario
tree-swallow study left out because its source couldn't be verified - is in
[`docs/story-and-data.md`](docs/story-and-data.md).

---

# How it's built

Vanilla JS + Vite + GSAP + Lenis. No framework, no tests, no linter.

```
src/
  engine/     camera, motion tiers, scroll, reveal, morph, audio, xform, svg helpers
  characters/ willow (mood system), chick
  components/ toronto, gears, timelineBar, thermometer, nest, flowDiagram,
              weather, insects, flora, migration, weatherWheel, choice,
              flock, birdCards, climate, songBars
  frames/     frame01…frame26 + registry
```

Each frame is a tall `<section>` with a sticky SVG stage; the extra section height is the scroll
distance its GSAP timeline scrubs across. A frame declares a **camera** shot (wide / medium /
close / macro / zoom-out), three **motion tiers** (primary / secondary / ambient), minimal
narration, and deferred data - so the visuals carry the story and labels arrive only once they've
been earned.

**Assets are reused on purpose.** The same nest, branch, skyline, and Willow recur across frames;
that familiarity is what builds attachment, so components are parameterized rather than forked.

### Two conventions worth knowing

1. **`engine/xform.js` owns every rotation and scale.** GSAP animates SVG through CSS transforms,
   and a percentage `transform-origin` resolves against the *viewBox*, not the element - so pivots
   land far off-screen. (`transform-box: fill-box` isn't a fix either: the SVG `transform` attribute
   maps to the same CSS property and scrambles attribute `rotate()`s.) Instead, art is drawn around
   its **own local (0,0)** - a wing around its shoulder, a gear around its centre - and `xform()`
   writes the `transform` attribute directly. Never mix a `transform` attribute with a GSAP
   transform on the same element. (This is also why cards animated by GSAP use a static outer
   wrapper + an animated inner group.)

2. **Backdrops live outside the camera group** (`ctx.backdrop(fill)`), so a camera push can't drag
   the sky off-screen. Ground planes overscan well past the viewBox because the stage uses
   `preserveAspectRatio="meet"` (fitting, not cropping - a phone would otherwise see a sliver).

## Checks

Animation bugs are invisible to the build; `npm run build` only catches import/syntax errors. Verify
visually:

- **Memory Test** - `http://localhost:5173/?nolabels` hides all text. Per the direction guide, the
  story must still read from the visuals alone. This is the primary quality bar.
- **Reduced motion** - honours `prefers-reduced-motion`; frames settle into readable end states.
- **Portrait + short viewports** - the known failure mode is captions colliding with in-SVG labels,
  so check phone and short-desktop aspect ratios.
- **Sound** - off by default. Drop `wind.mp3`, `swallow-call.mp3`, `insects.mp3`, `rain.mp3` into
  `src/assets/audio/` and the mute toggle picks them up; without them it stays silent. Silence is a
  deliberate storytelling cue in Frames 1, 11, and 12 - don't fill it.
