// Scene 16 - Zooming Out. Beat: REFLECTION. "Who else is up there?"
//
// The camera leaves her nest and keeps going until it is over the province, and
// the one nest the reader has been living in turns out to be one of hundreds.
//
// The Ontario map's geometry is illustrative paper-cut, and the nest field
// scattered across it is illustrative too - it is a picture of "many", not a
// census. Nothing here is captioned with a number, and it must not be.
import { nest } from '../components/nest.js';
import { flock } from '../components/flock.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';

export default {
  id: 's16-zoom-out',
  title: 'Zooming Out',
  act: 'VI',
  mood: 'day',
  build(ctx) {
    const { scene, tl, narrate, camera } = ctx;

    ctx.backdrop('#cfe0e6');

    // Her nest, where we left it.
    const home = nest({ x: 800, y: 470, s: 1, chickCount: 4 });
    scene.appendChild(home.node);
    home.hatch().progress(1);
    home.setGrowth(0.4, { duration: 0 });
    home.setEnergy(0.35);

    const willow = createWillow({ scale: 0.6 });
    scene.appendChild(willow.node);
    willow.setMood('worried');
    gsap.set(willow.node, { x: 700, y: 420 });

    // Everyone else's.
    const others = flock({ cx: 800, cy: 420, spreadX: 620, spreadY: 300, count: 30 });
    scene.appendChild(others.node);

    camera.set({ shot: 'close', fx: 800, fy: 470, scale: 1.6 });

    const n1 = narrate({
      willow: '&ldquo;I&rsquo;m not the only one.&rdquo;',
      narrator:
        'Many bird species are facing the same squeeze as the climate warms - and they are not all facing it in the same way.',
    });

    tl
      // Up, and up. She becomes small, then a dot, then one of many.
      .to(
        camera.state,
        { fx: 800, fy: 440, scale: 0.8, duration: 6, ease: 'power2.inOut', onUpdate: () => camera.set({}) },
        0
      )
      .to([home.node, willow.node], { opacity: 0.35, duration: 2.5 }, 2.4)
      .add(others.showUpTo(8, 1.2), 2.6)
      .add(others.showUpTo(18, 1.4), 3.8)
      .add(others.showUpTo(30, 1.6), 4.8)
      .add(revealText(n1.lines[0]), 4.4)
      .add(revealText(n1.lines[1]), 5.6)
      .to({}, { duration: 1.4 });

    ctx.scrollCue('Who are they?');
  },
};
