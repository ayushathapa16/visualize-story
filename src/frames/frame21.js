// Scene 21 - One Last Flight. The story closes where it opened.
//
// The surviving chick climbs to the rim, hesitates, and goes. The camera follows
// it out over the park and the lake, and comes to rest on open water at sunset -
// the exact framing Scene 1 started from, at the other end of the day.
//
// The mirror is the whole point, so it is built out of the same parts, not
// re-drawn: the same parkLife (in 'dusk'), the same toronto, the same nest, and
// Scene 1's camera move run backwards (800,470 → 1150,620). If you move the park
// in Scene 1, move it here.
import { rect, el } from '../engine/svg.js';
import { toronto } from '../components/toronto.js';
import { parkLife } from '../components/parkLife.js';
import { nest } from '../components/nest.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { ripple, rand } from '../engine/motion.js';
import { revealText } from '../engine/reveal.js';
import { stillness } from '../engine/motion.js';

export default {
  id: 's21-one-last-flight',
  title: 'One Last Flight',
  act: 'VII',
  mood: 'day',
  build(ctx) {
    const { scene, overlay, W, H, tl, narrate, camera, audio, reduced } = ctx;

    ctx.backdrop('#e0834f');

    const grad = el('linearGradient', { id: 'duskSky', x1: '0', y1: '0', x2: '0', y2: '1' }, [
      el('stop', { offset: '0%', 'stop-color': '#7d6a9c' }),
      el('stop', { offset: '52%', 'stop-color': '#e8955e' }),
      el('stop', { offset: '100%', 'stop-color': '#f4cf92' }),
    ]);
    scene.appendChild(el('defs', {}, [grad]));
    scene.appendChild(rect(-W, -H, W * 3, H * 2, { fill: 'url(#duskSky)' }));

    // Same city, same waterfront, same park as Scene 1 - and, as there, its own
    // sky is switched off so the dusk gradient behind it shows through.
    const city = toronto({ wetlandFront: true });
    scene.appendChild(city.node);
    gsap.set(city.layers.sky, { opacity: 0 });
    gsap.set(city.node, { filter: 'brightness(0.66) saturate(0.85)' }); // silhouetted against the sunset

    // The same water band (toronto draws it at y 650-740), lit from the other
    // end of the day.
    const glints = [];
    for (let i = 0; i < 20; i++) {
      const gl = rect(rand(-100, W + 100), rand(662, 726), rand(40, 120), 3, {
        fill: '#f7d9a0',
        opacity: 0.5,
        rx: 2,
      });
      glints.push(gl);
      scene.appendChild(gl);
    }
    if (!reduced) ripple(glints, { dur: 5 });

    // The same people, at the end of their day. Same ground and water lines as
    // Scene 1 - this is the half of the mirror that has to match.
    const park = parkLife({ mood: 'dusk', shoreY: 800, waterY: 700, animate: !reduced });
    scene.appendChild(park.node);

    // The nest she built in Scene 3, with the one chick that made it.
    const home = nest({ x: 700, y: 470, s: 0.9, chickCount: 1 });
    scene.appendChild(home.node);
    home.hatch().progress(1);
    home.setGrowth(1, { duration: 0 }); // fully feathered - it is ready
    home.setEnergy(0.75);
    const fledgling = home.chicks[0];

    const willow = createWillow({ scale: 0.7 });
    scene.appendChild(willow.node);
    willow.setMood('hopeful');
    gsap.set(willow.node, { x: 560, y: 400 });

    // The fade sits ABOVE the camera, so the camera pull can't drag it aside.
    const blackout = rect(-W, -H, W * 3, H * 3, { fill: '#10131a', opacity: 0 });
    overlay.appendChild(blackout);

    // We start where Scene 18 left us: close on the nest.
    camera.set({ fx: 720, fy: 470, scale: 1.5 });

    // The two voices are split across the fade, because they are lit differently.
    // Willow speaks over the sunset, in the story's normal dark ink. The closing
    // narration lands in the dark AFTER the blackout, so it needs light ink -
    // this frame's mood is 'day', which would otherwise paint it near-black on
    // near-black.
    const n1 = narrate({ willow: '&ldquo;I&rsquo;ll see you next spring.&rdquo;' });
    const nEnd = narrate(
      {
        narrator:
          'Every spring, millions of birds choose Toronto. Whether they can keep calling it home depends, in part, on the choices we make now.',
      },
      'center',
      'narration--on-dark'
    );

    tl
      // It climbs to the rim of the nest.
      .add(fledgling.xf.to({ x: 60, y: -34, rotation: -6 }, { duration: 1.4, ease: 'power1.out' }), 0.4)

      // And hesitates. This pause is the scene - do not tighten it.
      .add(stillness(1.6))

      // And goes.
      .add(fledgling.xf.to({ x: 300, y: -190, rotation: -16 }, { duration: 2, ease: 'power2.out' }), 3.4)
      .add(fledgling.xf.to({ x: 900, y: -300, rotation: -8 }, { duration: 3, ease: 'sine.inOut' }), 5.2)
      .to(fledgling.node, { opacity: 0.55, duration: 2.5 }, 6.4)

      // Willow lifts after it, and the camera goes with them - out over the
      // park, over the water. Scene 1's glide, run in reverse.
      .to(willow.node, { x: 1150, y: 300, duration: 5, ease: 'sine.inOut' }, 4.4)
      // Scene 1's opening framing, arrived at from the other direction.
      .to(
        camera.state,
        {
          fx: 1150,
          fy: 640,
          scale: 1.35,
          duration: 7,
          ease: 'power1.inOut',
          onUpdate: () => camera.set({}),
        },
        3.4
      )

      .add(revealText(n1.lines[0]), 6.0)
      .add(stillness(1.2))

      // Out. Her line goes with the light.
      .to(n1.box, { opacity: 0, duration: 1.4 }, 8.6)
      .to(blackout, { opacity: 1, duration: 3, ease: 'power2.inOut' }, 8.8)

      // And the last words arrive in the dark.
      .add(revealText(nEnd.lines[0]), 11.0)
      .add(stillness(2));

    // The Scene 1 call, returning. Now you know whose it is.
    audio.play('swallow-call');
    audio.bed('wind', { volume: 0.28 });

    ctx.scrollCue('');
  },
};
