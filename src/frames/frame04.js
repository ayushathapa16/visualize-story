// Scene 4 - Nature's Perfect Clock. Beat: HARMONY (iconic). "What if it slipped?"
//
// Snow melts, flowers bloom, insects emerge, the nest is finished - and it all
// turns like one machine. ICONS first; the labels only arrive once the system
// has been understood (docs/direction.md).
//
// Scene 8 replays this clock running early, and Scene 9 breaks it. The three
// scenes are the same component in three states, which is the only reason the
// break costs anything.
import { natureClock } from '../components/gears.js';
import { revealText } from '../engine/reveal.js';

export default {
  id: 's4-clock',
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
    // back. Same reason in Scenes 8 and 9 - keep the three in step.
    camera.set({ fx: 800, fy: 320, scale: 0.85 });

    const n1 = narrate({
      willow: '&ldquo;Spring always knows exactly what to do.&rdquo;',
      narrator:
        'For thousands of years, spring has followed an almost perfect schedule. Plants bloom, insects emerge, birds arrive, and chicks hatch - in remarkable synchrony.',
    });

    // Watch it turn (icons only), THEN name the parts once you already get it.
    tl.to({}, { duration: 2 }) // pure observation
      .add(revealText(n1.lines[0]), 0.6)
      .add(clock.showLabels(), 2.2)
      .add(revealText(n1.lines[1]), 2.8)
      .to({}, { duration: 1.4 });

    ctx.scrollCue('Four eggs');
  },
};
