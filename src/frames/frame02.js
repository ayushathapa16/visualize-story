// Scene 2 - The Journey. Beat: WONDER→CONNECTION. "How does she find her way?"
//
// The camera pulls up off Toronto until the city is a dot on a planet. The globe
// turns, the Americas come round, and her whole migration draws itself.
//
// The globe is paper-cut, not photoreal (see components/globe.js) - the piece has
// one visual language. What "realistic" earns us here is scale: the point of the
// scene is that the journey is planetary, and Toronto is the far end of it.
import { globe } from '../components/globe.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';

export default {
  id: 's2-journey',
  title: 'The Journey',
  act: 'I',
  mood: 'night', // space; the narration stays light against the dark
  build(ctx) {
    const { scene, tl, narrate, camera, reduced } = ctx;

    ctx.backdrop('#0f1621');

    const earth = globe();
    scene.appendChild(earth.node);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('hopeful');
    gsap.set(willow.node, { opacity: 0 });

    // We arrive pushed hard into the globe's north - roughly where Scene 1 left
    // us - and pull back to see the whole planet.
    camera.set({ fx: 700, fy: 200, scale: 2.6 });

    const n1 = narrate({
      willow: '&ldquo;I&rsquo;ve been flying for weeks. Somehow&hellip; I always find my way back.&rdquo;',
      narrator:
        'Tree Swallows spend the winter in Central and South America, then travel thousands of kilometres north every spring to breed.',
    });

    tl
      // Toronto becomes Canada becomes the world.
      // Framed a little below the globe's centre, which lifts the sphere on
      // screen and keeps its lower limb (and the South America label) out of the
      // caption band. Tuned against CY/R in globe.js - move one, move both.
      .to(
        camera.state,
        { fx: 800, fy: 420, scale: 1.0, duration: 4, ease: 'power2.inOut', onUpdate: () => camera.set({}) },
        0
      )
      // The planet turns the Americas into view.
      .to(
        { s: 0 },
        {
          s: 1,
          duration: 3.4,
          ease: 'power2.inOut',
          onUpdate() {
            earth.setSpin(this.targets()[0].s);
          },
        },
        1.2
      )

      // Only once it has stopped turning does the route draw - south to north,
      // the direction she actually flies.
      .to(
        { p: 0 },
        {
          p: 1,
          duration: 5,
          ease: 'none',
          onUpdate() {
            earth.drawTo(this.targets()[0].p);
          },
        },
        4.8
      )
      .to(willow.node, { opacity: 1, duration: 0.6 }, 4.8)
      .add(willow.flyAlong(earth.flightPath, { duration: 5, ease: 'none' }), 4.8)

      .add(revealText(n1.lines[0]), 5.4)
      .add(revealText(n1.lines[1]), 6.6)
      .to({}, { duration: 1.4 });

    // Under reduced motion the scrub still resolves, but make sure the frame's
    // resting state is the finished journey rather than a blank globe.
    if (reduced) {
      earth.setSpin(1);
      earth.drawTo(1);
      gsap.set(willow.node, { opacity: 1 });
    }

    ctx.scrollCue('She lands');
  },
};
