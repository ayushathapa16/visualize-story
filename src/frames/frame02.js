// Scene 2 - The Journey. Beat: WONDER→CONNECTION. "How does she find her way?"
//
// The camera pulls up off Toronto until the city is a dot on a planet. The globe
// turns, the Americas come round, and her whole migration draws itself.
//
// The globe is paper-cut, not photoreal (see components/globe.js) - the piece has
// one visual language. What "realistic" earns us here is scale: the point of the
// scene is that the journey is planetary, and Toronto is the far end of it.
//
// THE NARRATION HERE WAS FACTUALLY WRONG until 2026-07-27: it said Tree
// Swallows winter in "Central and South America", and globe.js drew the route
// from Brazil to match. They do not go to South America at all. Knight et al.
// 2019 (docs/sources.md §G3) tracked 133 birds and put the nonbreeding range at
// the Gulf of Mexico, Florida, Mexico, Central America and the Caribbean - and
// eastern-flyway birds, which is Toronto's population, in Florida and the
// Caribbean. Both the sentence and the route are fixed, and the frame now
// carries the citation for it.
import { globe } from '../components/globe.js';
import { sourceNote } from '../components/chart.js';
import { citeFigure } from '../data/context.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';

export default {
  id: 's2-journey',
  title: 'The Journey',
  act: 'I',
  mood: 'night', // space; the narration stays light against the dark
  build(ctx) {
    const { scene, overlay, tl, narrate, camera, reduced } = ctx;

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
        'Tree Swallows spend the winter around the Gulf of Mexico, Florida and the Caribbean, then travel thousands of kilometres north every spring to breed.',
    });

    // Overlay, in raw viewBox coordinates: this frame pulls back hard (2.6 ->
    // 1.0) and anything in `scene` would swing across the stage with the globe.
    // x=380 clears the portrait crop (x 330-1270).
    //
    // The line names the METHOD rather than restating the range the narrator
    // just gave. A reader who has just been told where she winters does not
    // need it twice; what they cannot get from the sentence is that somebody
    // put trackers on the birds and found out.
    overlay.appendChild(
      sourceNote('Tracked with geolocators, from Alaska to Nova Scotia to North Carolina', {
        x: 380,
        y: 60,
      })
    );
    overlay.appendChild(sourceNote(citeFigure('wintering'), { x: 380, y: 84 }));

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
