// Scene 7 - Growing Strong. Beat: HARMONY (the peak). "What could take this away?"
//
// Every feeding trip makes them bigger. The reader's scroll IS the growth: each
// delivery advances nest.setGrowth(), so feathers come in, eyes open, and wings
// start to stretch under their own thumb.
//
// This is the top of the story's arc. Everything after Scene 8 is subtraction.
import { rect } from '../engine/svg.js';
import { nest } from '../components/nest.js';
import { swarm } from '../components/insects.js';
import { createWillow } from '../characters/willow.js';
import { tree } from '../components/flora.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { stillness } from '../engine/motion.js';

export default {
  id: 's7-growing',
  title: 'Growing Strong',
  act: 'II',
  mood: 'day',
  build(ctx) {
    const { scene, W, H, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#dfe9d2');
    scene.appendChild(rect(-600, H - 120, W + 1200, 700, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 280, y: H, s: 1.6, green: '#4f7040' }).node);

    const bugs = swarm({ cx: 1150, cy: 230, spread: 300, count: 50 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(0.9);

    const home = nest({ x: 800, y: 470, s: 1, chickCount: 4 });
    scene.appendChild(home.node);
    home.hatch().progress(1);
    home.setEnergy(1);
    home.setGrowth(0, { duration: 0 }); // newly hatched: blind, bald

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('happy');
    gsap.set(willow.node, { x: 800, y: 420 });

    // Close, and it gets closer - by the end we are right on top of them, which
    // is what makes the size change readable at all.
    camera.set({ fx: 800, fy: 470, scale: 1.5 });

    const n1 = narrate({
      willow: '&ldquo;You&rsquo;re getting so big.&rdquo;',
      narrator:
        'Good timing gives Tree Swallow chicks the best possible start. When insects are plentiful, the young grow fast.',
    });

    // Five trips. Each one feeds them and each one advances the growth dial.
    const TRIPS = 5;
    for (let i = 0; i < TRIPS; i++) {
      const t = i * 1.4;
      tl.to(willow.node, { x: 1120, y: 250, duration: 0.6, ease: 'sine.inOut' }, t)
        .add(() => willow.carry(true), t + 0.6)
        .to(willow.node, { x: 800, y: 420, duration: 0.6, ease: 'sine.inOut' }, t + 0.7)
        .add(() => {
          willow.carry(false);
          home.feed(i);
        }, t + 1.3)
        // …and they are a little bigger than they were.
        .to(
          { gr: i / TRIPS },
          {
            gr: (i + 1) / TRIPS,
            duration: 0.7,
            ease: 'none',
            onUpdate() {
              home.setGrowth(this.targets()[0].gr, { duration: 0 });
            },
          },
          t + 1.3
        );
    }

    tl.add(revealText(n1.lines[0]), 3.0)
      // Pull back a touch: they fill the nest now in a way they didn't.
      .to(camera.state, { scale: 1.3, duration: 2, onUpdate: () => camera.set({}) }, TRIPS * 1.4 - 1)
      .add(() => home.begAll(true), TRIPS * 1.4)
      .add(revealText(n1.lines[1]), TRIPS * 1.4 + 0.4)
      .add(stillness(1.4));

    audio.bed('insects', { volume: 0.28 });
    audio.play('chicks', { volume: 0.4 });

    ctx.scrollCue('But something is changing');
  },
};
