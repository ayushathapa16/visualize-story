// Scene 17 - Sooner Is Not Soon Enough. Beat: UNEASE. "Is it enough?"
//
// Fourth of five (see frame14.js), and the one that stops this being a story
// about a bird who did nothing. Tree Swallows HAVE shifted: they lay earlier
// than they used to. Scene 13 carries the measurement of it. This frame carries
// the feeling of it - she does everything faster than Scene 7 showed, and the
// season has still moved further than she has.
//
// So the eggs go in quicker than Scene 7's slow stagger, and the held beat that
// followed them there is shorter and less restful here. Same nest, same shot,
// less time.
//
// Careful not to reach for the cold-snap material: laying earlier is what puts
// nestlings into cold snaps, and that is Scenes 21-22's subject, with the
// figures. Do not preview it here without them.
import { rect } from '../engine/svg.js';
import { nest } from '../components/nest.js';
import { tree } from '../components/flora.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { stillness } from '../engine/motion.js';

export default {
  id: 's17-sooner-not-enough',
  title: 'Sooner Is Not Soon Enough',
  act: 'III',
  mood: 'day',
  build(ctx) {
    const { scene, W, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#dfe2c8');

    // Scene 7's composition.
    const GROUND = 640;
    scene.appendChild(rect(-600, GROUND, W + 1200, 900, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 280, y: GROUND + 20, s: 1.5, green: '#4f7040' }).node);

    const home = nest({ x: 800, y: 430, s: 1, chickCount: 4 });
    scene.appendChild(home.node);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('worried');
    gsap.set(willow.node, { x: 640, y: 360 });

    camera.set({ fx: 800, fy: 400, scale: 1.15 });

    const n1 = narrate({
      willow: '&ldquo;I do everything sooner than my mother did. It is still not soon enough.&rdquo;',
      narrator:
        'Tree Swallows have shifted. They lay earlier than they used to, and the season has moved further still, so the gap keeps opening.',
    });

    // Half Scene 7's stagger: she is hurrying, and the hurry is visible.
    tl.add(home.layEggs({ stagger: 0.24 }), 0.3)
      .add(revealText(n1.lines[0]), 1.4)
      .to(willow.node, { x: 800, y: 378, duration: 0.9, ease: 'sine.inOut' }, 1.8)
      // Scene 7 held here for 1.6. This year she gets half of that.
      .add(stillness(0.8), 2.7)
      .add(revealText(n1.lines[1]), 3.4)
      .to({}, { duration: 1.4 });

    audio.bed('wind', { volume: 0.12 });

    ctx.scrollCue('And still late');
  },
};
