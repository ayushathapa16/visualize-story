// Scene 4 - The Ground Wakes. Beat: HARMONY. "And what comes after that?"
//
// First of five. The nest is finished and Willow is sitting on the branch above
// it, telling the year in the order it always comes: ground, air, bird, eggs,
// mouths. One stage per scene, each shown as itself and nothing more - there is
// no machinery anywhere in this run. Scene 9 is where these five turn out to
// have been a machine, and it can only do that if they were things first.
//
// Willow does the telling in this run, not the narrator. That is a deliberate
// bend of the two-voice rule and it is noted in docs/story.md - she is the one
// who has done this before, so she is the one who knows the order.
//
// Illustration, not evidence. No figure, no sourceNote(). The order of the
// season is ordinary life history and nobody here has read a paper for it.
import { rect } from '../engine/svg.js';
import { tree, grass, reeds, flower } from '../components/flora.js';
import { createWillow } from '../characters/willow.js';
import { sun } from '../components/weather.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { rand } from '../engine/motion.js';

export default {
  id: 's4-ground-wakes',
  title: 'The Ground Wakes',
  act: 'I',
  mood: 'day',
  build(ctx) {
    const { scene, W, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#dce6e4'); // late-winter light, still cool

    // The horizon sits high on purpose. Narration is pinned to the bottom of
    // the *screen* while the stage scales with the viewBox, so on a wide short
    // window the foot of the stage is caption, not world. Everything with any
    // detail in it lives above GROUND; below that is flat colour for the words
    // to sit on (CLAUDE.md: the foot of the stage belongs to the caption).
    const GROUND = 640;

    // Ground, and the last of the snow lying on it.
    scene.appendChild(rect(-600, GROUND, W + 1200, 900, { fill: '#7f9a5c' }));
    const snow = rect(-600, GROUND, W + 1200, 900, { fill: '#f2f2ee' });
    scene.appendChild(snow);

    scene.appendChild(tree({ x: 250, y: GROUND + 20, s: 1.5, green: '#4f7040' }).node);
    scene.appendChild(reeds({ x: 1400, y: GROUND + 10, s: 1.3 }).node);

    // Green comes up out of the ground: grass first, then the first blooms.
    // Flora nodes carry their own `transform` attribute, so only opacity is
    // animated on them here - the petals open through flower()'s own bloom(),
    // which drives an xform (invariant 1 in CLAUDE.md).
    const greens = [];
    for (let i = 0; i < 9; i++) {
      const bl = grass({ x: rand(420, 1180), y: GROUND + rand(0, 26), s: rand(0.9, 1.5) });
      scene.appendChild(bl.node);
      gsap.set(bl.node, { opacity: 0 });
      greens.push(bl.node);
    }
    const blooms = [];
    for (let i = 0; i < 5; i++) {
      const fl = flower({
        x: 480 + i * 170 + rand(-30, 30),
        y: GROUND + rand(-6, 18),
        s: rand(0.9, 1.3),
        color: '#c77fa0',
      });
      scene.appendChild(fl.node);
      gsap.set(fl.node, { opacity: 0 });
      blooms.push(fl);
    }

    const warmSun = sun({ x: 1240, y: 250, r: 50 });
    scene.appendChild(warmSun.node);
    gsap.set(warmSun.node, { opacity: 0.35 });

    // She watches. She is not doing anything in this run - she is remembering.
    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('hopeful');
    gsap.set(willow.node, { x: 300, y: 330 });

    camera.set({ fx: 820, fy: 400, scale: 1.05 });

    const n1 = narrate({
      willow: '&ldquo;The ground always goes first. It knows before I do.&rdquo;',
      narrator:
        'Warmth in the soil starts the season. Plants leaf out and flower before anything that eats them is flying.',
    });

    // Snow off, green up, bloom. The blooms opening IS the end of the frame.
    tl.to(snow, { opacity: 0, duration: 2, ease: 'power1.inOut' }, 0)
      .to(warmSun.node, { opacity: 0.8, duration: 2 }, 0)
      .to(greens, { opacity: 1, duration: 1.2, stagger: 0.12, ease: 'power2.out' }, 1.2)
      .add(revealText(n1.lines[0]), 1.6);
    blooms.forEach((fl, i) => {
      tl.to(fl.node, { opacity: 1, duration: 0.5 }, 2.6 + i * 0.18);
      tl.add(fl.bloom(), 2.7 + i * 0.18);
    });
    tl.add(revealText(n1.lines[1]), 4).to({}, { duration: 1.4 });

    audio.bed('wind', { volume: 0.16 });

    ctx.scrollCue('And then the air');
  },
};
