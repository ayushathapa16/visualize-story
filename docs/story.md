# One Bird's Story. Toronto's Future.

The script. **21 scenes, 7 acts.** Scene number == frame file: Scene 7 is
`src/frames/frame07.js`. Keep it that way - the moment they drift, every note in
here points at the wrong file.

Every scene has two voices:

- **Willow** - she reacts. She never explains, and she never says a number.
- **Narrator** - the explanation, once the animation has already made the point.

Willow speaks first in every scene. Reversing that order explains before showing,
which `docs/direction.md` forbids.

---

## ACT I — HOME

### Scene 1 — A Quiet Morning
**Visual.** Black. Wind, distant birds, waves. The sun comes up over Lake Ontario
and the camera glides west across the water toward Tommy Thompson Park. Cyclists,
kayakers and dog-walkers start their morning. A Tree Swallow flies into frame.

> **Willow:** "Every spring… I come home."
>
> **Narrator:** Every spring, millions of birds return to Toronto after journeys
> that span entire continents. This city is home to us. It is home to them too.

*Scene 21 is this shot in reverse, at sunset. They share `parkLife` and the camera
path on purpose. Move the park here and you must move it there.*

### Scene 2 — The Journey
**Visual.** The camera pulls up until Toronto is a dot on a planet. The globe
turns, the Americas come round, and her migration draws itself along the Atlantic
Flyway - South America to Lake Ontario.

> **Willow:** "I've been flying for weeks. Somehow… I always find my way back."
>
> **Narrator:** Tree Swallows spend the winter in Central and South America, then
> travel thousands of kilometres north every spring to breed.

*Real Natural Earth coastlines on a true orthographic projection, drawn in the
piece's flat palette - precise geography, one visual language. It carries no
distances or bearings, so it asserts nothing it can't support.*

### Scene 3 — Building a Home
**Visual.** She lands and works. Grass, feathers, twigs, ferried in one trip at a
time. The nest cup grows under the reader's own scroll.

> **Willow:** "This looks like a good place to raise my family."
>
> **Narrator:** Tree Swallows depend on cavities and nest boxes to raise their
> young. Finding a safe home is the first challenge of every breeding season.

*This is the nest the whole story then happens in - Scene 5 lays in it, Scene 7
grows in it, Scene 15 goes quiet in it, Scene 21 fledges out of it.*

### Scene 4 — Nature's Perfect Clock
**Visual.** Snow melts, flowers bloom, insects emerge, the nest is finished - all
turning like one machine. Icons first; labels only once the system is understood.

> **Willow:** "Spring always knows exactly what to do."
>
> **Narrator:** For thousands of years, spring has followed an almost perfect
> schedule. Plants bloom, insects emerge, birds arrive, and chicks hatch - in
> remarkable synchrony.

---

## ACT II — NEW LIFE

### Scene 5 — New Beginnings
**Visual.** Four eggs, one at a time. Days pass in the light. Then they crack.

> **Willow:** "Welcome to Toronto, little ones."
>
> **Narrator:** Tree Swallow chicks grow quickly. For the first weeks of their
> lives they depend entirely on their parents for food.

### Scene 6 — The Sky is Alive
**Visual.** Golden evening. The air is thick with midges and flies. She hunts on
the wing and comes back with a full beak.

> **Willow:** "There's enough food for everyone today."
>
> **Narrator:** Tree Swallows feed almost entirely on flying insects. A single
> family may eat thousands of them in a day.

*This is the abundance the rest of the story removes. Scene 14 is this frame with
the sky emptied - same nest, same flight, nothing in the beak. It only hurts if
this one lands first.*

### Scene 7 — Growing Strong
**Visual.** Every feeding trip makes them bigger. Feathers come in, eyes open,
wings start to stretch - all driven by the scroll.

> **Willow:** "You're getting so big."
>
> **Narrator:** Good timing gives Tree Swallow chicks the best possible start.
> When insects are plentiful, the young grow fast.

*Top of the arc. Everything after Scene 8 is subtraction.*

---

## ACT III — SOMETHING CHANGES

### Scene 8 — An Earlier Spring
**Visual.** The same clock as Scene 4, running the same sequence - but early. The
swallow's slot on the wheel comes round to nothing, because she is still over the
Gulf.

> **Willow:** "Every year, spring is a little further ahead of me."
>
> **Narrator:** This did not happen in one season. As temperatures have climbed
> decade after decade, spring has crept steadily earlier - and the harmony that
> held it together has been slowly pulled apart.

> ⚠️ **Not "something feels different this year."** The drift is gradual - decades,
> not one strange spring. A single bad year is weather, and weather is something a
> bird survives. The whole argument depends on this reading as accumulation.

### Scene 9 — The Clock Breaks
**Visual.** The wheel fractures. Flowers, insects, birds and chicks drift out of
each other's teeth.

> **Willow:** "I wasn't ready."
>
> **Narrator:** Long-distance migrants can't simply leave earlier. Their migration
> is driven by cues spread across thousands of kilometres - not by the weather
> waiting for them at the other end.

### Scene 10 — Phenological Mismatch
**Visual.** A normal year against a warmer one. The insect abundance **curve**
slides earlier; the chicks' hatch date does not move. There is still overlap - but
the peak has gone by before the chicks need it.

> **Willow:** "The insects were already disappearing when my babies needed them
> most."
>
> **Narrator:** Scientists call this a phenological mismatch. The chicks still
> hatch while insects are around - but the peak abundance that once fed a whole
> brood has already passed.

**The term is a button.** It opens a drawer with the mechanism and the papers
(`src/data/sources.js` → `MISMATCH`).

> ⚠️ **The claim is NOT "the chicks hatch into an empty sky."** They don't. That is
> exactly why the insect row is a curve and not a bar: only a curve can say "still
> there, but past the peak". Do not simplify it back into a bar - a bar would let
> the chart assert something the science doesn't.

---

## ACT IV — THE GAMBLE

### Scene 11 — A Difficult Decision
**Visual.** The reader picks Willow's laying date from a calendar: early (6 May),
her usual (18 May), or late (29 May). No outcome preview on hover, no recommended
option - you commit before you are allowed to see what it costs. That is the
position the bird is in.

> **Willow:** "Should I start now… or wait?"
>
> **Narrator:** Every spring, Tree Swallows face a decision they cannot win
> outright. Laying too early and laying too late both carry a cost.

*Default if the reader scrolls past (or is running `?nolabels`): her usual date.
It's what she'd do without us.*

### Scene 12 — Three Springs
**Visual.** The pick plays out. Early → a cold snap catches the brood. Usual → a
warm spring, and they do well. Late → the insect peak has already gone.

> **Willow:** "I can't predict what spring will do."
>
> **Narrator:** Climate change has made spring less predictable. A decision that
> was once reliable has become a gamble.

> One of the three outcomes is genuinely good, and that matters. If every road led
> to disaster the scene would be rigged, and the reader would feel it. The point is
> not that she always loses - it's that she cannot know which spring she is in.

---

## ACT V — HUNGER

### Scene 13 — Searching Further
**Visual.** Top-down. The search radius grows with every trip, and every trip takes
longer than the last.

> **Willow:** "Where did all the insects go? How will I feed my children now?"
>
> **Narrator:** Cold weather keeps flying insects grounded. Even when insects are
> present, Tree Swallows often cannot catch enough of them to feed a brood.

### Scene 14 — Empty Sky
**Visual.** Scene 6 again, with the abundance taken out. Same nest, same branch,
same flight - and one insect in her beak instead of a full one.

> **Willow:** "I found one…"
>
> **Narrator:** The insect boom has already passed. Every trip that comes back
> empty makes the next day harder than the last.

*The sky is thin, never empty. Never none.*

### Scene 15 — Silence
**Visual.** Rain. A nest that has stopped moving. One chick that still does, barely.

> **Willow:** "Please… stay with me."
>
> **Narrator:** Climate change does not always arrive dramatically. Sometimes it
> arrives quietly - one missed meal at a time.

> **No audio bed.** Every other frame hands the next one a sound; this one hands it
> nothing, and nothing replaces it. Silence is the cue - do not fill it.

---

## ACT VI — I'M NOT ALONE

### Scene 16 — Zooming Out
**Visual.** The camera leaves her nest and keeps going until it is over the
province. Her nest turns out to be one of hundreds.

> **Willow:** "I'm not the only one."
>
> **Narrator:** Many bird species are facing the same squeeze as the climate warms -
> and they are not all facing it in the same way.

*The nests scattered across Ontario are a picture of "many", not a census. Nothing
here is captioned with a number, and it must not be.*

### Scene 17 — The Birds of Toronto
**Visual.** The flock resolves into individuals: Tree Swallow, Bobolink, Canada
Jay, Common Loon, Wood Thrush, Barn Swallow. **Each card opens** onto that
species' outlook.

> **Willow:** "These are my neighbours."
>
> **Narrator:** Climate change affects every species differently. Some are expected
> to lose breeding habitat; others are expected to shift north. Open a card to read
> its outlook.

> This scene carries the project's **one hard data claim** - Audubon's +1.5 °C /
> +3.0 °C figures, which live in `SCENARIOS` (`src/components/climate.js`) and
> nowhere else.
>
> The **per-species** outlooks are *not* quotable: Audubon's Ontario numbers sit
> behind an interactive widget that isn't scrapeable, so the cards say nothing
> numeric on their face. A card opens onto prose, plus whatever citations the
> author has actually supplied in `src/data/sources.js` - which ships **empty** on
> purpose. Empty is the safe state, and the panel omits an empty block rather than
> showing a placeholder. A placeholder in a citation list is indistinguishable from
> a fact.

---

### Scene 18 — One Bird's Story
**Visual.** The inverse of Scene 16: all the way back down from the city to her
nest, and the one chick that made it.

> **Willow:** "I hope you'll find your way home too."
>
> **Narrator:** Willow's story is one of many already unfolding across North
> America - and one of the few that anyone is watching closely.

---

## ACT VII — WHAT WE CAN DO

### Scene 19 — Sharing the City
**Visual.** The first frame in the piece where a number goes **up**. Native flowers
bloom across ordinary front gardens; the insects come back to them; she feeds.

> **Willow:** "This helps more than you know."
>
> **Narrator:** Native plants feed the insects that Tree Swallows depend on. An
> ornamental lawn feeds almost nothing.

*Scene 6's chain running forwards: flowers → insects → food. The reader already
knows how it works, because the story spent an act taking it apart.*

### Scene 20 — Small Actions Matter
**Visual.** Five cards: plant native, skip the pesticide, leave the leaves, restore
wetland, monitor a nest box at Tommy Thompson Park.

> **Willow:** "Thank you for looking after our home."
>
> **Narrator:** Small actions, repeated across a city, add up to healthier habitat
> for birds and the insects they live on.

*Copy lives in `ACTIONS` (`src/data/sources.js`). Every claim is mechanistic - it
produces insects, or habitat - and never a quantified outcome. We cannot say how
many birds a front garden saves, so we don't.*

### Scene 21 — One Last Flight
**Visual.** The surviving chick climbs to the rim of the nest, hesitates, and goes.
The camera follows it out over the park and the lake and comes to rest on open
water at sunset - the exact framing Scene 1 started from, at the other end of the
day. Fade to black; the closing line lands in the dark.

> **Willow:** "I'll see you next spring."
>
> **Narrator:** Every spring, millions of birds choose Toronto. Whether they can
> keep calling it home depends, in part, on the choices we make now.

*The hesitation before it flies is the scene. Do not tighten it.*
