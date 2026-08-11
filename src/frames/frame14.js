// Scene 14 - The Ground Wakes Without Her. Beat: UNEASE. "Who is here to see it?"
//
// First of five, and the mirror of Scenes 4-8. That run walked the year while it
// still worked, one stage per scene. This one walks the same five stages, on the
// same ground, in the same shots - and shows what each of them is doing now.
// Scene 19 then breaks the clock, over something the reader has watched happen
// rather than something a caption asserted.
//
// This frame is Scene 4's marsh with the bird taken out. She is still over the
// Gulf and the season has started anyway: the snow is already gone when the
// frame opens, and the blooms are already going over by the time it ends. The
// empty branch IS the argument, so do not put a swallow in this frame to keep
// the reader company.
//
// Illustration, like all five. The lay-date and warming figures belong to Scene
// 13, the widening gap to Scene 20, the cold snaps to 21-22. This run shows it
// happening; the scenes around it carry the numbers.
import { rect } from '../engine/svg.js';
import { tree, grass, reeds, flower } from '../components/flora.js';
import { sun } from '../components/weather.js';
import { gsap } from '../engine/gsap.js';
import { seasonStrip } from '../components/timelineBar.js';
import { revealText } from '../engine/reveal.js';
import { rand } from '../engine/motion.js';

export default {
  id: 's14-ground-without-her',
  title: 'The Ground Wakes Without Her',
  act: 'III',
  mood: 'day',
  build(ctx) {
    const { scene, overlay, W, tl, narrate, camera, audio } = ctx;

    // Warmer and drier than Scene 4's cool late-winter light. Same place, a
    // season that started too soon.
    ctx.backdrop('#e9e3cd');

    // Scene 4's composition exactly - same horizon, same tree, same reeds. The
    // pairing only reads if it is recognisably the same shot.
    const GROUND = 640;
    scene.appendChild(rect(-600, GROUND, W + 1200, 900, { fill: '#7f9a5c' }));
    scene.appendChild(tree({ x: 250, y: GROUND + 20, s: 1.5, green: '#4f7040' }).node);
    scene.appendChild(reeds({ x: 1400, y: GROUND + 10, s: 1.3 }).node);

    for (let i = 0; i < 9; i++) {
      scene.appendChild(grass({ x: rand(420, 1180), y: GROUND + rand(0, 26), s: rand(0.9, 1.5) }).node);
    }

    // In Scene 4 the blooms were the last thing to arrive. Here they are open
    // before the frame starts, and they go over while the reader watches.
    const blooms = [];
    for (let i = 0; i < 5; i++) {
      const fl = flower({
        x: 480 + i * 170 + rand(-30, 30),
        y: GROUND + rand(-6, 18),
        s: rand(0.9, 1.3),
        color: '#c77fa0',
      });
      scene.appendChild(fl.node);
      fl.bloom().progress(1); // already open when we get here
      blooms.push(fl.node);
    }

    const highSun = sun({ x: 1240, y: 230, r: 54 });
    scene.appendChild(highSun.node);
    gsap.set(highSun.node, { opacity: 0.9 });

    // The year as four curves, the same instrument Scene 20 later argues with.
    // On `overlay`, outside the camera group: this frame pushes in, and a strip
    // inside `scene` would scale and drift off the top of the stage.
    const strip = seasonStrip({
      x: 380,
      y: 96,
      w: 440,
      shown: 1,
      shift: 1,
      title: 'A warmer year',
      note: 'The plants peak earlier than they used to',
    });
    overlay.appendChild(strip.node);

    camera.set({ fx: 820, fy: 400, scale: 1.05 });

    const n1 = narrate({
      willow: '&ldquo;This all starts without me now. Nobody sends word that it began.&rdquo;',
      narrator:
        'Warmth pulls the plants forward. The bloom that once waited for her opens and passes weeks before she reaches the lake.',
    });

    // Nothing arrives in this frame. Things leave: the colour goes out of the
    // blooms, and the branch stays empty the whole way through.
    tl.to({}, { duration: 1.2 })
      .add(revealText(n1.lines[0]), 0.8)
      .add(strip.revealRow(0), 1.4)
      .to(blooms, { opacity: 0.35, duration: 2.4, stagger: 0.18, ease: 'power1.in' }, 1.6)
      .add(revealText(n1.lines[1]), 3.2)
      .to({}, { duration: 1.4 });

    audio.bed('wind', { volume: 0.16 });

    ctx.scrollCue('And the air with it');
  },
};
