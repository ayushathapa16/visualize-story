// Scene 19 - Sharing the City. Beat: HOPE (earned, not offered). "What can I do?"
//
// The first frame in the piece where a number goes UP. Native flowers bloom
// across ordinary front gardens, insects come back to them, and she feeds.
//
// This is Scene 6's mechanism running forwards again: flowers → insects → food.
// The reader already knows how that chain works because the story spent an act
// taking it apart. Nothing here needs explaining.
import { rect } from '../engine/svg.js';
import { toronto } from '../components/toronto.js';
import { flower, grass, tree } from '../components/flora.js';
import { swarm } from '../components/insects.js';
import { sun } from '../components/weather.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { rand } from '../engine/motion.js';

export default {
  id: 's19-sharing-the-city',
  title: 'Sharing the City',
  act: 'VII',
  mood: 'day',
  build(ctx) {
    const { scene, W, H, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#cfe0e6');

    const city = toronto({ wetlandFront: false });
    scene.appendChild(city.node);
    gsap.set(city.node, { opacity: 0.5 }); // the city is the backdrop now, not the subject

    const theSun = sun({ x: 240, y: 160, r: 50 });
    scene.appendChild(theSun.node);

    // A strip of gardens across the bottom - front yards, not a nature reserve.
    scene.appendChild(rect(-600, H - 190, W + 1200, 700, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 180, y: H - 60, s: 1.2, green: '#4f7040' }).node);
    scene.appendChild(tree({ x: 1460, y: H - 60, s: 1.1, green: '#4f7040' }).node);
    for (let i = 0; i < 9; i++) {
      scene.appendChild(grass({ x: rand(80, W - 80), y: H - 150 + rand(0, 30), s: rand(0.8, 1.4) }).node);
    }

    // The flowers: closed, until they aren't.
    const COLORS = ['#e0a93b', '#c77fa0', '#b5482e', '#e8c34a', '#a86fb0'];
    const flowers = [];
    for (let i = 0; i < 14; i++) {
      const f = flower({
        x: 120 + i * 105 + rand(-18, 18),
        y: H - 130 + rand(-20, 30),
        s: rand(1.1, 1.7),
        color: COLORS[i % COLORS.length],
      });
      scene.appendChild(f.node);
      flowers.push(f);
    }

    // The insects that the flowers bring back.
    const bugs = swarm({ cx: 820, cy: 420, spread: 480, count: 60 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(0.05);

    const willow = createWillow({ scale: 0.65 });
    scene.appendChild(willow.node);
    willow.setMood('hopeful');
    gsap.set(willow.node, { x: -140, y: 420 });

    camera.set({ fx: 800, fy: 520, scale: 1.05 });

    const n1 = narrate({
      willow: '&ldquo;This helps more than you know.&rdquo;',
      narrator:
        'Native plants feed the insects that Tree Swallows depend on. An ornamental lawn feeds almost nothing.',
    });

    // The gardens come in, one after another, the way a street actually changes:
    // one yard at a time.
    flowers.forEach((f, i) => {
      tl.add(f.bloom(), 0.4 + i * 0.16);
    });

    tl
      // And the sky answers.
      .to(
        { p: 0.05 },
        {
          p: 0.9,
          duration: 3.4,
          ease: 'power1.out',
          onUpdate() {
            bugs.setPopulation(this.targets()[0].p);
          },
        },
        1.8
      )
      .add(revealText(n1.lines[0]), 2.6)

      // She hunts the street. Three passes, and she catches something on each.
      .to(willow.node, { x: 520, y: 380, duration: 1.6, ease: 'sine.inOut' }, 3.0)
      .add(() => willow.carry(true), 4.4)
      .to(willow.node, { x: 1000, y: 440, duration: 1.6, ease: 'sine.inOut' }, 4.6)
      .add(() => willow.carry(false), 6.0)
      .to(willow.node, { x: 1500, y: 360, duration: 1.6, ease: 'sine.inOut' }, 6.2)

      .add(revealText(n1.lines[1]), 5.2)
      .to({}, { duration: 1.4 });

    audio.bed('insects', { volume: 0.28 });
    audio.bed('dawn-chorus', { volume: 0.22 });

    ctx.scrollCue('What else?');
  },
};
