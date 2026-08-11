// Scene 9 - Nature's Perfect Clock. Beat: HARMONY (iconic). "What if it slipped?"
//
// The payoff of Scenes 4-8. The reader has met all five stages one at a time,
// as themselves: a bloom, a swarm, a bird, four eggs, four mouths. Here those
// same five arrive on an empty stage and grow gears underneath them. The parts
// turn out to have been one machine the whole time.
//
// The machinery is deliberately absent until this frame. An earlier pass parked
// a gear in the corner of Scenes 4-8 and it read as a cog floating over a marsh,
// which is worse than no callback at all.
//
// Because the stages are already known, the labels can arrive earlier than they
// used to. What must not change is the order: it still turns before it is named
// (docs/direction.md).
//
// Scene 13 replays this clock running early, and Scene 19 breaks it. The three
// scenes are the same component in three states, which is the only reason the
// break costs anything.
import { natureClock } from '../components/gears.js';
import { revealText } from '../engine/reveal.js';

export default {
  id: 's9-clock',
  title: "Nature's Perfect Clock",
  act: 'I',
  mood: 'day',
  build(ctx) {
    const { scene, tl, narrate, camera } = ctx;

    ctx.backdrop('#efe7d2');

    const clock = natureClock({ cx: 800, cy: 300 });
    scene.appendChild(clock.node);
    clock.spin(1); // ambient: it is a working clock, and it works

    // The clock's station labels sit ~256 units out from its centre, so the two
    // lower ones ("Eggs hatch", "Swallow arrives") drop straight into the
    // two-voice caption band unless the dial is lifted and the framing pulled
    // back. Same reason in Scenes 13 and 19 - keep the three in step.
    camera.set({ fx: 800, fy: 320, scale: 0.85 });

    const n1 = narrate({
      willow: '&ldquo;Spring always knows exactly what to do.&rdquo;',
      narrator:
        'For thousands of years, spring has followed an almost perfect schedule. Plants bloom, insects emerge, birds arrive, and chicks hatch - in remarkable synchrony.',
    });

    // The five things arrive, become parts, mesh - and only then get named.
    tl.add(clock.assembleFromIcons(), 0)
      .add(revealText(n1.lines[0]), 1.6)
      .to({}, { duration: 1.4 }) // it turns, meshed, before anything is labelled
      .add(clock.showLabels(), 3.4)
      .add(revealText(n1.lines[1]), 4)
      .to({}, { duration: 1.4 });

    ctx.scrollCue('Four eggs');
  },
};
