// Scene 16 - I Leave When The Light Says. Beat: UNEASE. "Then what does she do?"
//
// Third of five (see frame14.js), and the mechanism at the centre of the whole
// piece. Scene 6's shot: she comes in from the south and lands on the branch
// above her nest, flying exactly as well and exactly as punctually as she did
// there. Nothing about her is late. The marsh is early.
//
// The difference from Scene 6 is what she lands into: the swarm is at the
// thinned level Scene 15 left it at, not full. Same flight, worse year.
//
// Scene 19 states the general rule - long-distance migrants cannot simply leave
// earlier. This frame is the concrete version of it, so keep the two from saying
// the same sentence twice: here it is daylight and a wintering ground thousands
// of kilometres away, there it is the principle.
import { rect } from '../engine/svg.js';
import { swarm } from '../components/insects.js';
import { nest } from '../components/nest.js';
import { tree, reeds } from '../components/flora.js';
import { createWillow } from '../characters/willow.js';
import { sun } from '../components/weather.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';

export default {
  id: 's16-when-light-says',
  title: 'I Leave When The Light Says',
  act: 'III',
  mood: 'day',
  build(ctx) {
    const { scene, W, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#d5dfd4');

    // Scene 6's composition.
    const GROUND = 640;
    scene.appendChild(rect(-600, GROUND, W + 1200, 900, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 250, y: GROUND + 20, s: 1.5, green: '#4f7040' }).node);
    scene.appendChild(reeds({ x: 1400, y: GROUND, s: 1.3 }).node);

    // The sun she actually navigates by. It is the only thing in this frame
    // that reaches her before she gets here.
    const daySun = sun({ x: 1240, y: 220, r: 52 });
    scene.appendChild(daySun.node);
    gsap.set(daySun.node, { opacity: 0.9 });

    // Scene 6 had this at full. It is the same air, later in its own year.
    const bugs = swarm({ cx: 880, cy: 320, spread: 320, count: 55 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(0.45);

    const home = nest({ x: 800, y: 450, s: 1, chickCount: 4 });
    scene.appendChild(home.node);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('tired');
    gsap.set(willow.node, { x: W + 220, y: 250 });

    camera.set({ fx: 820, fy: 390, scale: 1 });

    const n1 = narrate({
      willow:
        '&ldquo;Nothing down there tells me what the lake is doing. I leave when the light says to leave.&rdquo;',
      narrator:
        'Her departure is set by day length and by the weather where she winters, thousands of kilometres away. It is the one part of the year that cannot answer to a spring that started without her.',
    });

    // The same approach and the same landing as Scene 6, beat for beat. Only
    // her mood on arrival differs - there she settled hopeful, here she does
    // not settle at all.
    tl.to(willow.node, { x: 880, y: 300, duration: 2.4, ease: 'sine.out' }, 0)
      .add(revealText(n1.lines[0]), 1.2)
      .to(willow.node, { x: 810, y: 385, duration: 1.1, ease: 'sine.inOut' }, 2.4)
      .add(() => willow.setMood('worried'), 3.4)
      .add(revealText(n1.lines[1]), 4)
      .to({}, { duration: 1.4 });

    audio.bed('wind', { volume: 0.18 });

    ctx.scrollCue('Sooner, then');
  },
};
