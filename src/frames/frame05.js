// Scene 5 - The Air Fills. Beat: HARMONY. "So who comes next?"
//
// Second of five (see frame04.js for what this run is doing). The same wetland
// a beat later: the warmth that opened the flowers brings the insects up off
// the water. The frame is one number going up, and nothing else.
//
// Deliberately NOT Scene 11's golden feeding evening. That frame is abundance
// she is eating; this one is abundance arriving, before she has chicks to feed
// with it. Different light, no prey in the beak, and she stays on the branch.
//
// Illustration. No figure on this stage - 18.5 °C belongs to Scene 11, where it
// is introduced once and re-read in Scene 22.
import { rect } from '../engine/svg.js';
import { swarm } from '../components/insects.js';
import { tree, reeds, grass } from '../components/flora.js';
import { createWillow } from '../characters/willow.js';
import { sun } from '../components/weather.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { rand } from '../engine/motion.js';

export default {
  id: 's5-air-fills',
  title: 'The Air Fills',
  act: 'I',
  mood: 'day',
  build(ctx) {
    const { scene, W, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#e4e9d8');

    // High horizon, flat foot: the bottom of the stage is the caption's, not
    // the world's. See frame04.js.
    const GROUND = 640;
    scene.appendChild(rect(-600, GROUND, W + 1200, 900, { fill: '#7f9a5c' }));
    // The water they come off.
    scene.appendChild(rect(-600, GROUND + 40, W + 1200, 900, { fill: '#8fb2b8' }));
    scene.appendChild(tree({ x: 250, y: GROUND + 20, s: 1.5, green: '#4f7040' }).node);
    scene.appendChild(reeds({ x: 1400, y: GROUND, s: 1.4 }).node);
    for (let i = 0; i < 6; i++) {
      scene.appendChild(grass({ x: rand(430, 1170), y: GROUND + rand(0, 22), s: rand(0.9, 1.3) }).node);
    }

    const warmSun = sun({ x: 1240, y: 250, r: 50 });
    scene.appendChild(warmSun.node);
    gsap.set(warmSun.node, { opacity: 0.75 });

    // Nothing in the air yet. The whole frame is this number going up.
    const bugs = swarm({ cx: 850, cy: 380, spread: 300, count: 60 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(0);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('curious');
    gsap.set(willow.node, { x: 300, y: 330 });

    camera.set({ fx: 820, fy: 400, scale: 1.05 });

    const n1 = narrate({
      willow:
        '&ldquo;Then the air starts to hum. That sound is the whole reason I fly this far.&rdquo;',
      narrator: 'The same warmth brings the insects up, a few steps behind the plants.',
    });

    // Fill the sky in stages, so the reader watches a count rise rather than a
    // swarm switch on.
    tl.to({ p: 0 }, {
      p: 1,
      duration: 3,
      ease: 'power1.in',
      onUpdate() {
        bugs.setPopulation(this.targets()[0].p);
      },
    }, 0)
      .add(revealText(n1.lines[0]), 1.4)
      .add(() => willow.setMood('happy'), 2.4)
      .add(revealText(n1.lines[1]), 3.6)
      .to({}, { duration: 1.4 });

    audio.bed('insects', { volume: 0.22 });

    ctx.scrollCue('And then me');
  },
};
