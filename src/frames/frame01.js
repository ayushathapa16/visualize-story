// Scene 1 - A Quiet Morning. Beat: WONDER. "Whose story is this?"
//
// Black. Then the sun comes up over the lake, the camera glides west across the
// water into Tommy Thompson Park, the city wakes up, and a Tree Swallow arrives.
//
// Scene 22 plays this move in reverse at sunset, out of the same parts. The
// ending only lands if the viewer recognises the place - so if you move the park
// or the camera path here, move them there too.
import { rect, el, circle, g } from '../engine/svg.js';
import { toronto } from '../components/toronto.js';
import { parkLife } from '../components/parkLife.js';
import { sun } from '../components/weather.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { ripple, rand } from '../engine/motion.js';
import { revealText } from '../engine/reveal.js';

export default {
  id: 's1-quiet-morning',
  title: 'A Quiet Morning',
  act: 'I',
  // 'day': the narration only arrives once the sun is up, so it wants dark ink.
  // The opening black is handled by the blackout below, and the title card is
  // light-on-dark by its own styling.
  mood: 'day',
  build(ctx) {
    const { scene, overlay, W, H, tl, narrate, camera, audio, reduced } = ctx;

    ctx.backdrop('#0d1218');

    // Sky: night -> dawn. We recolour the gradient's stops rather than swapping a
    // fill, so the horizon warms from the bottom up the way a sunrise does.
    const grad = el('linearGradient', { id: 'dawnSky', x1: '0', y1: '0', x2: '0', y2: '1' }, [
      el('stop', { offset: '0%', 'stop-color': '#0d1218' }),
      el('stop', { offset: '55%', 'stop-color': '#243447' }),
      el('stop', { offset: '100%', 'stop-color': '#3d4a5c' }),
    ]);
    scene.appendChild(el('defs', {}, [grad]));
    const stops = [...grad.children];
    scene.appendChild(rect(-W, -H, W * 3, H * 2, { fill: 'url(#dawnSky)' }));

    const stars = g({ class: 'stars' });
    for (let i = 0; i < 50; i++) {
      stars.appendChild(
        circle(rand(0, W), rand(0, H * 0.45), rand(0.6, 1.7), { fill: '#cfd6e2', opacity: rand(0.25, 0.6) })
      );
    }
    scene.appendChild(stars);

    // The sun, in a wrapper. sun() writes its own `transform` attribute to place
    // itself, so GSAP must never touch the sun node directly - a CSS transform
    // silently overrides the attribute and the sun teleports to the origin
    // (engine/xform.js). Animate the wrapper instead.
    const sunWrap = g({ class: 'sun-wrap' });
    sunWrap.appendChild(sun({ x: 1080, y: 760, r: 62 }).node);
    scene.appendChild(sunWrap);
    gsap.set(sunWrap, { opacity: 0 });

    // The city, the waterfront and the park all come from toronto() - including
    // its own sky, which we switch off so the dawn gradient above shows through.
    // Everything after this point is drawn ON TOP of the water band it provides.
    const city = toronto({ wetlandFront: true });
    scene.appendChild(city.node);
    gsap.set(city.layers.sky, { opacity: 0 });
    gsap.set(city.node, { filter: 'brightness(0.3) saturate(0.6)' }); // still in the dark

    // Sunlight on the water. The band toronto draws sits at y 650-740.
    const glints = [];
    for (let i = 0; i < 20; i++) {
      const gl = rect(rand(-100, W + 100), rand(662, 726), rand(40, 120), 3, {
        fill: '#f0c187',
        opacity: 0,
        rx: 2,
      });
      glints.push(gl);
      scene.appendChild(gl);
    }
    if (!reduced) ripple(glints, { dur: 5 });

    // The morning: cyclists and dog-walkers on the green, kayakers on the water.
    const park = parkLife({ mood: 'dawn', shoreY: 800, waterY: 700, animate: !reduced });
    scene.appendChild(park.node);
    gsap.set(park.node, { opacity: 0 });

    const willow = createWillow({ scale: 0.75 });
    scene.appendChild(willow.node);
    willow.setMood('tired'); // weeks of flying; she is nearly home
    gsap.set(willow.node, { x: W + 160, y: 300, opacity: 0 });

    // The blackout lives ABOVE the camera (with the grain), so the camera glide
    // can't drag it aside and expose the page behind it. Only the scrubbed
    // timeline animates it - a second tween on the same property from the intro
    // timeline would fight it and leave the whole scene dimmed.
    const blackout = rect(-W, -H, W * 3, H * 3, { fill: '#05070a', opacity: 1 });
    overlay.appendChild(blackout);

    // Pushed in on open water, east of the park. Scene 22 comes to rest here.
    camera.set({ fx: 1150, fy: 640, scale: 1.35 });

    const title = document.createElement('div');
    title.className = 'intro-title';
    title.innerHTML =
      '<h1>One Bird&rsquo;s Story.<br/>Toronto&rsquo;s Future.</h1><p>Scroll to begin</p>';
    ctx.stage.appendChild(title);

    const n1 = narrate({
      willow: '&ldquo;Every spring&hellip; I come home.&rdquo;',
      narrator:
        'Every spring, millions of birds return to Toronto after journeys that span entire continents. This city is home to us. It is home to them too.',
    });

    // The title greets the viewer on the black immediately - it is the story's
    // cover, so it must not wait on a scroll position to appear.
    gsap
      .timeline({ delay: 0.4 })
      .fromTo(title.querySelector('h1'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' })
      .fromTo(title.querySelector('p'), { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.5');

    tl
      // The dark lifts.
      .to(blackout, { opacity: 0, duration: 2.4, ease: 'power2.out' }, 0)
      .to(title, { opacity: 0, duration: 0.8 }, 0.6)

      // Sunrise: the sky warms from the horizon up and the sun climbs out of the
      // lake, emerging from behind the water band.
      .to(stops[0], { attr: { 'stop-color': '#3d5170' }, duration: 4.5, ease: 'none' }, 0)
      .to(stops[1], { attr: { 'stop-color': '#96a7b8' }, duration: 4.5, ease: 'none' }, 0)
      .to(stops[2], { attr: { 'stop-color': '#f2cb95' }, duration: 4.5, ease: 'none' }, 0)
      .to(stars, { opacity: 0, duration: 2.5, ease: 'power2.in' }, 0.4)
      .to(sunWrap, { opacity: 1, duration: 1.6 }, 0.8)
      .to(sunWrap, { y: -430, duration: 7, ease: 'power1.out' }, 0.8)
      .to(city.node, { filter: 'brightness(1) saturate(1)', duration: 4.5, ease: 'power2.out' }, 1.0)
      .to(glints, { opacity: 0.5, duration: 2, stagger: 0.05 }, 2.0)

      // The glide: west across the water, into the park. Scene 22 mirrors this.
      .to(
        camera.state,
        { fx: 800, fy: 560, scale: 1.0, duration: 6, ease: 'power1.inOut', onUpdate: () => camera.set({}) },
        1.2
      )

      // The city gets up.
      .to(park.node, { opacity: 1, duration: 2.4, ease: 'power2.out' }, 3.2)

      // And into all of that, a Tree Swallow.
      .to(willow.node, { opacity: 1, duration: 1 }, 4.6)
      .to(willow.node, { x: 700, y: 380, duration: 4, ease: 'sine.inOut' }, 4.6)

      .add(revealText(n1.lines[0]), 6.0)
      .add(revealText(n1.lines[1]), 7.0)
      .to({}, { duration: 1.4 }); // hold - let the morning be

    audio.bed('wind', { volume: 0.3 });
    audio.bed('dawn-chorus', { volume: 0.18 });
    audio.play('swallow-call');

    ctx.scrollCue('Where has she come from?');
  },
};
