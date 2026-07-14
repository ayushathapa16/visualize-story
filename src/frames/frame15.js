// Scene 15 - Silence. Beat: LOSS (the bottom). "Is this just her?"
//
// Rain. A nest that has stopped moving. One chick that still does, barely.
//
// NO AUDIO BED. Every previous frame has handed the next one a sound, and this
// one hands it nothing - the wind, the insects and the chicks are all stopped on
// entry and nothing replaces them. Silence is the cue (CLAUDE.md); do not fill
// it. Frames 1 and 12 of the old cut used the same device and it is the reason
// this frame lands.
//
// It is also the only frame in the piece that holds still. stillness() is doing
// as much work here as any animation.
import { rect } from '../engine/svg.js';
import { nest } from '../components/nest.js';
import { tree } from '../components/flora.js';
import { cloud, precip } from '../components/weather.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { stillness } from '../engine/motion.js';

export default {
  id: 's15-silence',
  title: 'Silence',
  act: 'V',
  mood: 'day',
  build(ctx) {
    const { scene, W, H, tl, narrate, camera, audio } = ctx;

    const sky = ctx.backdrop('#aab3b2');
    scene.appendChild(rect(-600, H - 120, W + 1200, 700, { fill: '#5f7350' }));
    scene.appendChild(tree({ x: 280, y: H, s: 1.6, green: '#4a6539' }).node);

    const clouds = [
      cloud({ x: 300, y: 150, s: 1.5, dark: true }),
      cloud({ x: 820, y: 120, s: 1.8, dark: true }),
      cloud({ x: 1300, y: 170, s: 1.4, dark: true }),
    ];
    clouds.forEach((c) => scene.appendChild(c.node));

    const rain = precip({ w: W, h: H, count: 90, type: 'rain' });
    scene.appendChild(rain.node);

    const home = nest({ x: 800, y: 470, s: 1, chickCount: 4 });
    scene.appendChild(home.node);
    home.hatch().progress(1);
    home.setGrowth(0.35, { duration: 0 });
    home.setEnergy(0.35);

    const willow = createWillow({ scale: 0.6 });
    scene.appendChild(willow.node);
    willow.setMood('tired');
    gsap.set(willow.node, { x: 700, y: 420 });

    // As close as the piece ever gets. There is nothing else to look at.
    camera.set({ shot: 'close', fx: 800, fy: 470, scale: 1.6 });

    const n1 = narrate({
      willow: '&ldquo;Please&hellip; stay with me.&rdquo;',
      narrator:
        'Climate change does not always arrive dramatically. Sometimes it arrives quietly - one missed meal at a time.',
    });

    tl.add(() => rain.start(), 0.2)
      .to(sky, { attr: { fill: '#8f9a9a' }, duration: 3 }, 0)

      // They stop begging. That is the whole event of this frame: the sound
      // stops, and the nest keeps not moving.
      .add(() => home.begAll(false), 1.4)
      .to({ e: 0.35 }, {
        e: 0.12,
        duration: 3.4,
        ease: 'power1.in',
        onUpdate() { home.setEnergy(this.targets()[0].e); },
      }, 1.6)

      .add(stillness(1.6))
      .add(revealText(n1.lines[0]), 4.4)
      .add(stillness(1.2))
      .add(revealText(n1.lines[1]), 6.4)
      .add(stillness(2)); // hold. Do not cut away early.

    // Everything the story has been playing so far is switched off, and nothing
    // takes its place.
    audio.stopBed('insects');
    audio.stopBed('dawn-chorus');
    audio.stopBed('wind');

    ctx.scrollCue('');
  },
};
