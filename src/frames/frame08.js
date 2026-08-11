// Scene 8 - Mouths to Fill. Beat: HARMONY. "What holds all of that together?"
//
// Last of five (see frame04.js). The eggs open, four mouths go up, and she
// makes one trip out into the full sky and back with something in her beak.
//
// This is the whole setup for Scene 9. The reader has now met all five stages
// as things - a bloom, a swarm, a bird, four eggs, four mouths - and the next
// frame is where those same five turn out to have been one machine. Keep every
// trace of machinery out of here, or the reveal has nothing left to reveal.
import { rect } from '../engine/svg.js';
import { swarm } from '../components/insects.js';
import { nest } from '../components/nest.js';
import { tree, reeds } from '../components/flora.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';

export default {
  id: 's8-mouths-to-fill',
  title: 'Mouths to Fill',
  act: 'I',
  mood: 'day',
  build(ctx) {
    const { scene, W, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#e8dcbe');

    // High horizon, flat foot - the caption owns the bottom. See frame04.js.
    const GROUND = 640;
    scene.appendChild(rect(-600, GROUND, W + 1200, 900, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 280, y: GROUND + 20, s: 1.5, green: '#4f7040' }).node);
    scene.appendChild(reeds({ x: 1400, y: GROUND, s: 1.3 }).node);

    const bugs = swarm({ cx: 1050, cy: 290, spread: 250, count: 50 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(1);

    const home = nest({ x: 800, y: 430, s: 1, chickCount: 4 });
    scene.appendChild(home.node);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('curious');
    gsap.set(willow.node, { x: 800, y: 378 });

    camera.set({ fx: 800, fy: 395, scale: 1.15 });

    const n1 = narrate({
      willow: '&ldquo;Four mouths open at once, and the sky has to be ready for them.&rdquo;',
      narrator:
        'Chicks hatch into the weeks when insects are thickest. Everything that happened before this is what puts the food in the air.',
    });

    tl.add(home.hatch({ stagger: 0.3 }), 0.3)
      .add(() => home.begAll(true), 1.8)
      .add(revealText(n1.lines[0]), 2)
      // One trip: out into the swarm, back with something.
      .to(willow.node, { x: 1080, y: 290, duration: 1, ease: 'sine.inOut' }, 2.4)
      .add(() => willow.carry(true), 3.4)
      .to(willow.node, { x: 800, y: 378, duration: 1, ease: 'sine.inOut' }, 3.6)
      .add(() => {
        willow.carry(false);
        home.feed(0);
        home.setEnergy(0.95);
      }, 4.6)
      .add(revealText(n1.lines[1]), 5.2)
      .to({}, { duration: 1.4 });

    audio.bed('insects', { volume: 0.18 });

    ctx.scrollCue('All of it at once');
  },
};
