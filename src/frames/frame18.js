// Scene 18 - The Mouths Open Late. Beat: UNEASE→CONFUSION. "Then what breaks?"
//
// Last of five (see frame14.js), and Scene 8 run again in a worse year. Same
// nest, same hatch, same single feeding trip out and back. What differs is what
// the sky has in it and what she brings home: Scene 8 ended with the brood at
// 0.95 energy, this one ends at 0.6, and the difference is the whole run.
//
// The chicks are not starving and the sky is not empty. They are past the peak.
// Keep the swarm at the level Scene 15 left it and the brood short rather than
// failing - the failures belong to Scenes 20-22, where the figures are.
//
// This hands straight to Scene 19: the reader has now watched all five links
// slip, so the clock can break over something they have seen.
import { rect } from '../engine/svg.js';
import { swarm } from '../components/insects.js';
import { nest } from '../components/nest.js';
import { tree, reeds } from '../components/flora.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { seasonStrip } from '../components/timelineBar.js';
import { revealText } from '../engine/reveal.js';
import { stillness } from '../engine/motion.js';

export default {
  id: 's18-mouths-open-late',
  title: 'The Mouths Open Late',
  act: 'III',
  mood: 'day',
  build(ctx) {
    const { scene, overlay, W, tl, narrate, camera, audio } = ctx;

    // Scene 8's warm light, gone a little thin.
    ctx.backdrop('#e6ddc4');

    const GROUND = 640;
    scene.appendChild(rect(-600, GROUND, W + 1200, 900, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 280, y: GROUND + 20, s: 1.5, green: '#4f7040' }).node);
    scene.appendChild(reeds({ x: 1400, y: GROUND, s: 1.3 }).node);

    // Scene 8 had this full. Same swarm, same place, past its peak.
    const bugs = swarm({ cx: 1050, cy: 290, spread: 250, count: 50 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(0.45);

    const home = nest({ x: 800, y: 430, s: 1, chickCount: 4 });
    scene.appendChild(home.node);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('worried');
    gsap.set(willow.node, { x: 800, y: 378 });

    // The year as four curves, the same instrument Scene 20 later argues with.
    // On `overlay`, outside the camera group: this frame pushes in, and a strip
    // inside `scene` would scale and drift off the top of the stage.
    const strip = seasonStrip({
      x: 380,
      y: 96,
      w: 440,
      shown: 4,
      shift: 1,
      title: 'A warmer year',
      note: 'The chicks have not moved either',
    });
    overlay.appendChild(strip.node);
    strip.showRows(3);

    camera.set({ fx: 800, fy: 395, scale: 1.15 });

    const n1 = narrate({
      willow: '&ldquo;They open their mouths right on time. It is the sky that moved.&rdquo;',
      narrator:
        'The chicks hatch on the schedule her body keeps. The days of most food have already passed over the marsh.',
    });

    tl.add(home.hatch({ stagger: 0.3 }), 0.3)
      .add(() => home.begAll(true), 1.8)
      .add(strip.revealRow(3), 1.4)
      .add(revealText(n1.lines[0]), 2)
      // The same trip as Scene 8, and it is worth less. She is out longer and
      // comes back with something smaller.
      .to(willow.node, { x: 1080, y: 290, duration: 1.2, ease: 'sine.inOut' }, 2.4)
      .add(() => willow.carry(true), 4)
      .to(willow.node, { x: 800, y: 378, duration: 1.2, ease: 'sine.inOut' }, 4.1)
      .add(() => {
        willow.carry(false);
        home.feed(0);
        home.setEnergy(0.6); // Scene 8 settled at 0.95
      }, 5.3)
      .add(revealText(n1.lines[1]), 5.6)
      .add(stillness(1.2)); // they are still begging when the frame ends

    audio.bed('insects', { volume: 0.1 });

    ctx.scrollCue('What is holding it together?');
  },
};
