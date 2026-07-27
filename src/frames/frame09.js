// Scene 9 - The Clock Breaks. Beat: UNEASE→CONFUSION. "What does that cost her?"
//
// The wheel the reader has trusted for two scenes fractures. The gears come
// apart: flowers, insects, birds and chicks drift out of each other's teeth.
//
// The frame is deliberately short on words. It is the sound of something
// breaking, and then Scene 10 explains what broke.
import { natureClock } from '../components/gears.js';
import { revealText } from '../engine/reveal.js';
import { stillness } from '../engine/motion.js';

export default {
  id: 's9-clock-breaks',
  title: 'The Clock Breaks',
  act: 'III',
  mood: 'day',
  build(ctx) {
    const { scene, tl, narrate, camera } = ctx;

    ctx.backdrop('#e7ded0');

    const clock = natureClock({ cx: 800, cy: 300 });
    clock.showLabels();
    scene.appendChild(clock.node);
    clock.spin(1);

    // Lifted and pulled back, as in Scenes 4 and 8 - the lower station labels
    // otherwise print through the caption.
    camera.set({ fx: 800, fy: 320, scale: 0.85 });

    const n1 = narrate({
      willow: '&ldquo;I wasn&rsquo;t ready.&rdquo;',
      narrator:
        'Long-distance migrants can’t simply leave earlier. Their migration is driven by cues spread across thousands of kilometres - not by the weather waiting for them at the other end.',
    });

    // It keeps turning, and then it doesn't: a gear slips, the crack draws, and
    // the whole mechanism loses its health.
    tl.to({}, { duration: 1.4 })
      .add(clock.slip(), 1.4)
      .to(
        { h: 1 },
        {
          h: 0.35,
          duration: 3.2,
          onUpdate() {
            clock.setHealth(this.targets()[0].h);
          },
        },
        1.7
      )
      // A push, but a small one: anything past ~0.95 drives the lower station
      // labels back down into the caption band that the framing above just
      // cleared.
      .to(
        camera.state,
        { scale: 0.95, fx: 790, duration: 2.4, onUpdate: () => camera.set({}) },
        2.0
      )
      .add(revealText(n1.lines[0]), 3.0)
      .add(revealText(n1.lines[1]), 4.2)
      .add(stillness(1.6)); // hold on the broken thing

    ctx.scrollCue('What broke, exactly?');
  },
};
