// Scene 6 - The Sky is Alive. Beat: HARMONY. "Can this last?"
//
// Golden evening over the wetland, and the air is thick with insects. She hunts
// on the wing and comes back with a full beak, twice.
//
// This is the abundance the rest of the story removes. Scene 14 is this frame
// with the sky emptied - same nest, same branch, same flight, nothing in the
// beak. It only hurts if this one lands first.
import { rect } from '../engine/svg.js';
import { nest } from '../components/nest.js';
import { swarm } from '../components/insects.js';
import { createWillow } from '../characters/willow.js';
import { tree, reeds } from '../components/flora.js';
import { sun } from '../components/weather.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';

export default {
  id: 's6-sky-alive',
  title: 'The Sky is Alive',
  act: 'II',
  mood: 'day',
  build(ctx) {
    const { scene, W, H, tl, narrate, camera, audio } = ctx;

    ctx.backdrop('#f0c187'); // golden evening
    scene.appendChild(rect(-600, H - 120, W + 1200, 700, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 280, y: H, s: 1.6, green: '#4f7040' }).node);
    scene.appendChild(reeds({ x: 1400, y: H - 100, s: 1.5 }).node);

    const lowSun = sun({ x: 1300, y: 240, r: 54 });
    scene.appendChild(lowSun.node);
    gsap.set(lowSun.node, { opacity: 0.8 });

    // Thousands of them - midges, mosquitoes, flies, coming off the water.
    const bugs = swarm({ cx: 880, cy: 250, spread: 420, count: 70 });
    scene.appendChild(bugs.node);
    bugs.setPopulation(0);

    const home = nest({ x: 800, y: 470, s: 1, chickCount: 4 });
    scene.appendChild(home.node);
    home.hatch().progress(1); // they hatched in Scene 5
    home.setEnergy(0.95);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('happy');
    gsap.set(willow.node, { x: 800, y: 420 });

    camera.set({ fx: 800, fy: 430, scale: 1.2 });

    const n1 = narrate({
      willow: '&ldquo;There&rsquo;s enough food for everyone today.&rdquo;',
      narrator:
        'Tree Swallows feed almost entirely on flying insects. A single family may eat thousands of them in a day.',
    });

    tl
      // The sky fills.
      .to(
        { p: 0 },
        {
          p: 1,
          duration: 2.4,
          onUpdate() {
            bugs.setPopulation(this.targets()[0].p);
          },
        },
        0.2
      )
      .add(revealText(n1.lines[0]), 1.2);

    // Two feeding runs. Out into the swarm, catch, home, deliver. The full beak
    // is the whole frame - no narration required to read it.
    const RUNS = [
      { t: 2.4, to: { x: 1080, y: 240 }, chick: 0 },
      { t: 5.0, to: { x: 620, y: 220 }, chick: 2 },
    ];
    for (const r of RUNS) {
      tl.to(willow.node, { ...r.to, duration: 1.1, ease: 'sine.inOut' }, r.t)
        .add(() => willow.carry(true), r.t + 1.1) // she has one
        .to(willow.node, { x: 800, y: 420, duration: 1.1, ease: 'sine.inOut' }, r.t + 1.2)
        .add(() => {
          willow.carry(false);
          home.feed(r.chick);
        }, r.t + 2.3);
    }

    tl.add(revealText(n1.lines[1]), 4.4).to({}, { duration: 1.4 });

    audio.bed('insects', { volume: 0.32 });
    audio.bed('dawn-chorus', { volume: 0.2 });

    ctx.scrollCue('Watch them grow');
  },
};
