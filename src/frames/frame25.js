// Scene 25 - Silence. Beat: LOSS (the bottom). "Is this just her?"
//
// Rain. A nest that has stopped moving. One chick that still does, barely.
//
// NO AUDIO BED. Every previous frame has handed the next one a sound, and this
// one hands it nothing - the wind, the insects and the chicks are all stopped on
// entry and nothing replaces them. Silence is the cue (CLAUDE.md); do not fill
// it. Frames 1 and 22 of the old cut used the same device and it is the reason
// this frame lands.
//
// It is also the only frame in the piece that holds still. stillness() is doing
// as much work here as any animation.
import { rect } from '../engine/svg.js';
import { sourceNote } from '../components/chart.js';
import { FIGURES, citeFigure } from '../data/phenology.js';
import { nest } from '../components/nest.js';
import { tree } from '../components/flora.js';
import { cloud, precip } from '../components/weather.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';
import { stillness } from '../engine/motion.js';

export default {
  id: 's25-silence',
  title: 'Silence',
  act: 'V',
  mood: 'day',
  build(ctx) {
    const { scene, overlay, W, H, tl, narrate, camera, audio } = ctx;

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

    // ONE figure, and it arrives last.
    //
    // This frame is the bottom of the story and the only one that holds still,
    // so the temptation is to stack the evidence up here - Shipley et al. can
    // support three separate lines about failed nests. It gets one. The nest has
    // already stopped moving; a reader who is looking at that does not need to
    // be handed a second number to feel it, and the frame's whole method is
    // subtraction.
    //
    // It also fades in AFTER both narration lines rather than sitting at the
    // head of the stage from the start, because a statistic waiting above a
    // silent nest tells the reader how the scene ends before it ends.
    //
    // Overlay, not `scene`: this frame runs the hardest push in the piece
    // (scale 1.6), and a line inside the camera group would be thrown clean off
    // the top of the stage.
    const cite = [
      sourceNote(
        `Nests that failed completely, near Ithaca: ${FIGURES.nestFailureRise.value}`,
        { x: 380, y: 60 }
      ),
      sourceNote(citeFigure('nestFailureRise'), { x: 380, y: 84 }),
    ];
    cite.forEach((c) => {
      c.setAttribute('opacity', '0');
      overlay.appendChild(c);
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
      // 0.85 is sourceNote()'s own resting opacity - matched deliberately, so
      // this line looks like every other citation in the piece and not like a
      // caption of its own.
      .to(cite, { attr: { opacity: 0.85 }, duration: 1.2, ease: 'sine.out' }, 7.6)
      .add(stillness(2)); // hold. Do not cut away early.

    // Everything the story has been playing so far is switched off, and nothing
    // takes its place.
    audio.stopBed('insects');
    audio.stopBed('dawn-chorus');
    audio.stopBed('wind');

    ctx.scrollCue('');
  },
};
