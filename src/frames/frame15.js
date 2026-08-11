// Scene 15 - The Air Fills, and Empties. Beat: UNEASE. "So what is left?"
//
// Second of five (see frame14.js). Scene 5's wetland, still with no bird in it.
// The insects come up exactly as they did there, and then they thin out again
// before anyone is here to eat them.
//
// THE SWARM MUST NOT REACH ZERO. It settles at about half. The chicks of this
// story do not hatch into an empty sky - they hatch past the peak, which is a
// smaller claim and the only one the literature supports (CLAUDE.md, and the
// same reason Scene 20's insect row is a curve and not a bar). An empty sky here
// would be the frame telling a lie the charts later have to walk back.
import { rect } from '../engine/svg.js';
import { swarm } from '../components/insects.js';
import { tree, reeds, grass } from '../components/flora.js';
import { sun } from '../components/weather.js';
import { gsap } from '../engine/gsap.js';
import { seasonStrip } from '../components/timelineBar.js';
import { revealText } from '../engine/reveal.js';
import { rand } from '../engine/motion.js';

export default {
  id: 's15-air-empties',
  title: 'The Air Fills, and Empties',
  act: 'III',
  mood: 'day',
  build(ctx) {
    const { scene, overlay, W, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#e9e6d0');

    // Scene 5's composition, warmer light. Same horizon, same water, same reeds.
    const GROUND = 640;
    scene.appendChild(rect(-600, GROUND, W + 1200, 900, { fill: '#7f9a5c' }));
    scene.appendChild(rect(-600, GROUND + 40, W + 1200, 900, { fill: '#8fb2b8' }));
    scene.appendChild(tree({ x: 250, y: GROUND + 20, s: 1.5, green: '#4f7040' }).node);
    scene.appendChild(reeds({ x: 1400, y: GROUND, s: 1.4 }).node);
    for (let i = 0; i < 6; i++) {
      scene.appendChild(grass({ x: rand(430, 1170), y: GROUND + rand(0, 22), s: rand(0.9, 1.3) }).node);
    }

    const warmSun = sun({ x: 1240, y: 240, r: 52 });
    scene.appendChild(warmSun.node);
    gsap.set(warmSun.node, { opacity: 0.85 });

    const bugs = swarm({ cx: 850, cy: 380, spread: 300, count: 60 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(0);

    // The year as four curves, the same instrument Scene 20 later argues with.
    // On `overlay`, outside the camera group: this frame pushes in, and a strip
    // inside `scene` would scale and drift off the top of the stage.
    const strip = seasonStrip({
      x: 380,
      y: 96,
      w: 440,
      shown: 2,
      shift: 1,
      title: 'A warmer year',
      note: 'The insects have moved with them',
    });
    overlay.appendChild(strip.node);
    strip.showRows(1);

    camera.set({ fx: 820, fy: 400, scale: 1.05 });

    const n1 = narrate({
      willow: '&ldquo;The hum is still there when I land. It is just quieter than it was.&rdquo;',
      narrator:
        'The insects follow the same warmth. Their best days come and go earlier now, so what is left when she needs it is the far side of the rise.',
    });

    // Up to full, a short peak, then back down to about half - and it happens
    // with the branch empty, which is the point.
    const level = { p: 0 };
    tl.to(level, {
      p: 1,
      duration: 2,
      ease: 'power1.in',
      onUpdate() {
        bugs.setPopulation(level.p);
      },
    }, 0)
      .add(revealText(n1.lines[0]), 1.2)
      .add(strip.revealRow(1), 1.6)
      .to({}, { duration: 0.8 }) // the peak, and nobody here for it
      .to(level, {
        p: 0.45,
        duration: 2.2,
        ease: 'power1.inOut',
        onUpdate() {
          bugs.setPopulation(level.p);
        },
      }, 2.8)
      .add(revealText(n1.lines[1]), 3.6)
      .to({}, { duration: 1.4 });

    audio.bed('insects', { volume: 0.18 });

    ctx.scrollCue('But I am not');
  },
};
