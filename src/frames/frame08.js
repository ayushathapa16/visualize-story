// Scene 8 - An Earlier Spring. Beat: UNEASE. "Where is she?"
//
// The same seasonal clock as Scene 4, running the same sequence - but early. The
// flowers bloom, the insects emerge, and the swallow's slot on the wheel comes
// round to nothing, because she is still somewhere over the Gulf.
//
// The clock is the SAME component (gears.js). If this were a new drawing the
// audience would read it as a new idea; it has to be the machine they already
// trust, visibly running ahead of itself.
import { rect } from '../engine/svg.js';
import { natureClock } from '../components/gears.js';
import { thermometer } from '../components/thermometer.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText, revealData } from '../engine/reveal.js';

export default {
  id: 's8-earlier-spring',
  title: 'An Earlier Spring',
  act: 'III',
  mood: 'day',
  build(ctx) {
    const { scene, tl, narrate, annotate, camera } = ctx;

    ctx.backdrop('#eae2cc');

    const clock = natureClock({ cx: 720, cy: 300 });
    clock.showLabels(); // we already learned these in Scene 4
    scene.appendChild(clock.node);
    clock.spin(1);

    const thermo = thermometer({ x: 1300, y: 210, h: 340 });
    scene.appendChild(thermo.node);
    thermo.setLevel(0.18);

    // Willow, small and low and still a long way south. She is not in this
    // picture yet, and that is the picture.
    //
    // Kept in the LEFT margin, not under the clock: the caption band is centred,
    // and creeping north up the middle of the stage flies her straight through
    // her own line.
    const willow = createWillow({ scale: 0.42 });
    scene.appendChild(willow.node);
    willow.setMood('worried');
    gsap.set(willow.node, { x: 220, y: 830 });

    // Lifted and pulled back: the clock's lower station labels would otherwise
    // land in the caption band (see Scene 4).
    camera.set({ fx: 800, fy: 320, scale: 0.85 });

    // NOT "something feels different this year". The whole argument of the piece
    // is that this is gradual - a drift across decades, not one strange spring.
    // A single bad year is weather, and weather is something a bird survives.
    const n1 = narrate({
      willow: '&ldquo;Every year, spring is a little further ahead of me.&rdquo;',
      narrator:
        'This did not happen in one season. As temperatures have climbed decade after decade, spring has crept steadily earlier - and the harmony that held it together has been slowly pulled apart.',
    });

    const evidence = annotate(
      'Warming pulls the season forward a little at a time: leaves open sooner, and the insects that feed on them emerge sooner too. Year on year, the drift accumulates.',
      { left: '4%', top: '14%' }
    );

    tl
      // It warms, and the wheel runs ahead of itself.
      .to(
        { v: 0.18 },
        {
          v: 0.78,
          duration: 4,
          ease: 'none',
          onUpdate() {
            thermo.setLevel(this.targets()[0].v);
          },
        },
        0
      )
      .add(() => clock.spin(2.6), 1.2) // the season, sped up
      .add(revealText(n1.lines[0]), 1.8)

      // She is still coming. She cannot read a thermometer in Ontario from the
      // Gulf of Mexico, and the wheel is not waiting for her.
      .to(willow.node, { y: 660, duration: 4, ease: 'sine.inOut' }, 1.0)

      .add(revealText(n1.lines[1]), 3.4)
      .add(revealData(evidence), 4.2)
      .to({}, { duration: 1.2 });

    ctx.scrollCue('And then it slips');
  },
};
