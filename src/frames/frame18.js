// Scene 18 - One Bird's Story. Beat: REFLECTION→HOPE. "So what do we do?"
//
// The exact inverse of Scene 16: that scene pulled out from her nest until it
// was one of hundreds, and this one comes all the way back down to it. After an
// act of aggregates, the story remembers it is about one bird.
//
// She has one chick left. The story does not soften that, and it does not
// linger on it either - the chick is about to fly.
import { nest } from '../components/nest.js';
import { toronto } from '../components/toronto.js';
import { flock } from '../components/flock.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { stillness } from '../engine/motion.js';

export default {
  id: 's18-one-birds-story',
  title: "One Bird's Story",
  act: 'VI',
  mood: 'day',
  build(ctx) {
    const { scene, tl, narrate, camera } = ctx;

    ctx.backdrop('#cfe0e6');

    const city = toronto({ wetlandFront: true });
    scene.appendChild(city.node);

    // The city full of other birds - where Scene 17 left us.
    const others = flock({ cx: 800, cy: 300, spreadX: 700, spreadY: 220, count: 24 });
    scene.appendChild(others.node);
    others.showUpTo(24, 0.01);

    // One nest, one chick. chickCount: 1 is the story, not a shortcut.
    const home = nest({ x: 800, y: 500, s: 1, chickCount: 1 });
    scene.appendChild(home.node);
    home.hatch().progress(1);
    home.setGrowth(0.85, { duration: 0 }); // nearly ready
    home.setEnergy(0.6);

    const willow = createWillow({ scale: 0.8 });
    scene.appendChild(willow.node);
    willow.setMood('hopeful');
    gsap.set(willow.node, { x: 620, y: 450 });

    // Start on the whole city, end on the nest.
    camera.set({ fx: 800, fy: 380, scale: 0.8 });

    const n1 = narrate({
      willow: '&ldquo;I hope you&rsquo;ll find your way home too.&rdquo;',
      narrator:
        'Willow’s story is one of many already unfolding across North America - and one of the few that anyone is watching closely.',
    });

    tl
      // All the way back in.
      .to(
        camera.state,
        { fx: 800, fy: 500, scale: 1.55, duration: 6, ease: 'power2.inOut', onUpdate: () => camera.set({}) },
        0
      )
      .to(others.node, { opacity: 0.3, duration: 3 }, 1.6)
      .to(city.node, { opacity: 0.55, duration: 3 }, 2.0)
      .add(() => home.begAll(true), 3.6)
      .add(revealText(n1.lines[0]), 4.2)
      .add(stillness(0.8))
      .add(revealText(n1.lines[1]), 5.6)
      .add(stillness(1.4));

    ctx.scrollCue('What helps?');
  },
};
