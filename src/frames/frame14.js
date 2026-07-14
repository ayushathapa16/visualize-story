// Scene 14 - Empty Sky. Beat: LOSS. "How many meals can they miss?"
//
// This is Scene 6 played again with the abundance taken out. Same nest, same
// branch, same tree, same flight path, same golden light drained grey - and one
// insect in her beak instead of a full one.
//
// The repetition IS the argument. Nothing here needs explaining if Scene 6 landed.
import { rect } from '../engine/svg.js';
import { nest } from '../components/nest.js';
import { swarm } from '../components/insects.js';
import { createWillow } from '../characters/willow.js';
import { tree, reeds } from '../components/flora.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { stillness } from '../engine/motion.js';

export default {
  id: 's14-empty-sky',
  title: 'Empty Sky',
  act: 'V',
  mood: 'day',
  build(ctx) {
    const { scene, W, H, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#c9d0cb'); // Scene 6's gold, gone out
    scene.appendChild(rect(-600, H - 120, W + 1200, 700, { fill: '#6f855a' }));
    scene.appendChild(tree({ x: 280, y: H, s: 1.6, green: '#5a7a44' }).node);
    scene.appendChild(reeds({ x: 1400, y: H - 100, s: 1.5 }).node);

    const bugs = swarm({ cx: 880, cy: 250, spread: 420, count: 70 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(0.14); // a few. Not none - never none.

    const home = nest({ x: 800, y: 470, s: 1, chickCount: 4 });
    scene.appendChild(home.node);
    home.hatch().progress(1);
    home.setGrowth(0.35, { duration: 0 }); // stalled - they should be further on
    home.setEnergy(0.7);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('tired');
    gsap.set(willow.node, { x: 800, y: 420 });

    camera.set({ fx: 800, fy: 440, scale: 1.25 });

    const n1 = narrate({
      willow: '&ldquo;I found one&hellip;&rdquo;',
      narrator:
        'The insect boom has already passed. Every trip that comes back empty makes the next day harder than the last.',
    });

    tl.add(() => home.begAll(true), 0.2)
      // Trip one: the long way out, and she finds nothing at all.
      .to(willow.node, { x: 1240, y: 210, duration: 1.6, ease: 'sine.inOut' }, 0.6)
      .add(stillness(1.2)) // hunting an empty sky
      .to(willow.node, { x: 800, y: 420, duration: 1.8, ease: 'sine.inOut' }, 3.4)
      .add(() => willow.carry(false), 3.4) // empty beak - the mirror of Scene 6
      .add(revealText(n1.lines[0]), 5.0)

      // Trip two: she finds exactly one.
      .to(willow.node, { x: 480, y: 240, duration: 1.6, ease: 'sine.inOut' }, 5.6)
      .add(() => willow.carry(true), 7.0)
      .to(willow.node, { x: 800, y: 420, duration: 1.8, ease: 'sine.inOut' }, 7.2)
      .add(() => {
        willow.carry(false);
        home.feed(0); // one chick eats. Three do not.
      }, 9.0)

      // The sky keeps thinning while she works.
      .to({ p: 0.14 }, {
        p: 0.05,
        duration: 6,
        onUpdate() { bugs.setPopulation(this.targets()[0].p); },
      }, 3)
      .to({ e: 0.7 }, {
        e: 0.4,
        duration: 2,
        onUpdate() { home.setEnergy(this.targets()[0].e); },
      }, 9.2)
      .add(revealText(n1.lines[1]), 9.6)
      .add(stillness(1.6));

    audio.stopBed('insects');
    audio.bed('wind', { volume: 0.3 });
    audio.play('chicks', { volume: 0.3 });

    ctx.scrollCue('');
  },
};
