// Scene 7 - Four Small Beginnings. Beat: HARMONY. "And what wakes them?"
//
// Fourth of five (see frame04.js). The quiet one. Four eggs into the cup she
// built, and then a held beat where nothing moves at all - stillness() - because
// the waiting is the part of the year that has no picture.
//
// Scene 10 is the one that hatches them. This frame lays and stops, so the two
// don't tell the same beat twice: here the eggs are the *stage in the order*,
// there they are her family. Same nest either way (nest.js, one lifecycle).
import { rect } from '../engine/svg.js';
import { nest } from '../components/nest.js';
import { tree } from '../components/flora.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { stillness } from '../engine/motion.js';

export default {
  id: 's7-four-beginnings',
  title: 'Four Small Beginnings',
  act: 'I',
  mood: 'day',
  build(ctx) {
    const { scene, W, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#d9e7d0');

    // High horizon, flat foot - the caption owns the bottom. See frame04.js.
    const GROUND = 640;
    scene.appendChild(rect(-600, GROUND, W + 1200, 900, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 280, y: GROUND + 20, s: 1.5, green: '#4f7040' }).node);

    const home = nest({ x: 800, y: 430, s: 1, chickCount: 4 });
    scene.appendChild(home.node);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('hopeful');
    gsap.set(willow.node, { x: 640, y: 360 });

    // The closest framing in the run, but only just: a harder push drags the
    // nest down into the caption on a short window.
    camera.set({ fx: 800, fy: 400, scale: 1.15 });

    const n1 = narrate({
      willow: '&ldquo;Now I wait. Nobody ever watches this part.&rdquo;',
      narrator:
        'Eggs are laid within days of arrival. How long she sits on them sets the day the chicks meet the world.',
    });

    tl.add(home.layEggs({ stagger: 0.5 }), 0.4)
      .add(revealText(n1.lines[0]), 1.8)
      .to(willow.node, { x: 800, y: 378, duration: 1.2, ease: 'sine.inOut' }, 2.4)
      // She settles onto them and the frame goes completely still.
      .add(stillness(1.6), 3.4)
      .add(revealText(n1.lines[1]), 4.4)
      .to({}, { duration: 1.4 });

    audio.bed('wind', { volume: 0.12 });

    ctx.scrollCue('Four mouths');
  },
};
