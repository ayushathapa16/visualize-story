// Scene 5 - New Beginnings. Beat: HARMONY. "Who will feed them?"
//
// Four eggs, one at a time. Days pass in the light. Then they crack.
// Same nest as Scene 3 - the one the reader watched her weave.
import { rect, el } from '../engine/svg.js';
import { nest } from '../components/nest.js';
import { tree } from '../components/flora.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { stillness } from '../engine/motion.js';

export default {
  id: 's5-new-beginnings',
  title: 'New Beginnings',
  act: 'II',
  mood: 'day',
  build(ctx) {
    const { scene, W, H, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#d9e7d0');
    scene.appendChild(rect(-600, H - 120, W + 1200, 700, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 280, y: H, s: 1.6, green: '#4f7040' }).node);

    // "Days pass" - a light wash that swings warm and cool and warm again, so
    // time moves without a caption having to say so.
    const dayWash = rect(-W, -H, W * 3, H * 3, { fill: '#f0c187', opacity: 0 });
    scene.appendChild(dayWash);

    const home = nest({ x: 800, y: 470, s: 1, chickCount: 4 });
    scene.appendChild(home.node);

    const willow = createWillow({ scale: 0.6 });
    scene.appendChild(willow.node);
    willow.setMood('hopeful');
    gsap.set(willow.node, { x: 640, y: 400 });

    camera.set({ fx: 800, fy: 460, scale: 1.5 });

    const n1 = narrate({
      willow: '&ldquo;Welcome to Toronto, little ones.&rdquo;',
      narrator:
        'Tree Swallow chicks grow quickly. For the first weeks of their lives they depend entirely on their parents for food.',
    });

    tl
      // The eggs arrive, one by one.
      .add(home.layEggs({ stagger: 0.45 }), 0.3)
      .add(stillness(0.8), 2.4)

      // Days passing over the clutch.
      .to(dayWash, { opacity: 0.28, duration: 1.2, ease: 'sine.inOut' }, 2.6)
      .to(dayWash, { opacity: 0, duration: 1.2, ease: 'sine.inOut' }, 3.8)
      .to(dayWash, { opacity: 0.22, duration: 1.2, ease: 'sine.inOut' }, 5.0)
      .to(dayWash, { opacity: 0, duration: 1.2, ease: 'sine.inOut' }, 6.2)

      // And then they crack.
      .add(home.hatch({ stagger: 0.3 }), 6.6)
      .add(() => audio.play('chicks', { volume: 0.45 }), 7.4)
      .add(() => home.begAll(true), 8.0)
      .add(revealText(n1.lines[0]), 8.2)
      .add(revealText(n1.lines[1]), 9.2)
      .add(stillness(1.2));

    audio.bed('dawn-chorus', { volume: 0.2 });

    ctx.scrollCue('They are hungry');
  },
};
