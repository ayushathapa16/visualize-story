// Scene 11 - The Sky is Alive. Beat: HARMONY. "Can this last?"
//
// Golden evening over the wetland, and the air is thick with insects. She hunts
// on the wing and comes back with a full beak, twice.
//
// This is the abundance the rest of the story removes. Scene 24 is this frame
// with the sky emptied - same nest, same branch, same flight, nothing in the
// beak. It only hurts if this one lands first.
//
// The one figure this frame carries is the insect/temperature peak, 18.5 °C.
// It is deliberately introduced HERE, on the good evening, because Scene 22
// re-reads the same number from the other side: a cold snap is days spent below
// it. Same instrument, twice - which is why neither frame invents its own.
import { rect } from '../engine/svg.js';
import { sourceNote } from '../components/chart.js';
import { FIGURES, citeFigure } from '../data/phenology.js';
import { nest } from '../components/nest.js';
import { swarm } from '../components/insects.js';
import { createWillow } from '../characters/willow.js';
import { tree, reeds } from '../components/flora.js';
import { sun } from '../components/weather.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';

export default {
  id: 's11-sky-alive',
  title: 'The Sky is Alive',
  act: 'II',
  mood: 'day',
  build(ctx) {
    const { scene, overlay, W, H, tl, narrate, camera, audio } = ctx;

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
    home.hatch().progress(1); // they hatched in Scene 10
    home.setEnergy(0.95);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('happy');
    gsap.set(willow.node, { x: 800, y: 420 });

    camera.set({ fx: 800, fy: 430, scale: 1.2 });

    // On overlay, outside the camera group: this frame runs a 1.2x push, and a
    // citation inside `scene` would be scaled off the top of the stage.
    //
    // The peak temperature is the one number this frame carries, and it is the
    // same 18.5 °C that Scene 22 turns into a cold snap. Saying it here, while
    // the sky is full, is what makes Scene 22's version land - it is the same
    // instrument reading, once from the good side and once from the bad.
    overlay.appendChild(
      sourceNote(
        `Flying-insect abundance peaks at a daily maximum of ${FIGURES.insectPeakTemp.value}`,
        { x: 380, y: 60 }
      )
    );
    overlay.appendChild(sourceNote(citeFigure('insectPeakTemp'), { x: 380, y: 84 }));

    // "A single family may eat thousands of them in a day" used to sit here. It
    // was an assertion with no source anywhere in the repo, and the tree swallow
    // literature does not give a provisioning rate - Winkler et al. 2013 counted
    // insects and chicks, never feeds per day. What that paper DOES give is the
    // mechanism, which is the better sentence anyway: this sky is not reliably
    // full, it is full because it is warm.
    const n1 = narrate({
      willow: '&ldquo;There&rsquo;s enough food for everyone today.&rdquo;',
      narrator:
        'Tree Swallows feed almost entirely on flying insects - and how many are flying is set by the temperature. On a warm evening the air is thick with them.',
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
