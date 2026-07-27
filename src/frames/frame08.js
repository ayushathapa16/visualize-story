// Scene 8 - An Earlier Spring. Beat: UNEASE. "Where is she?"
//
// The same seasonal clock as Scene 4, running the same sequence - but early. The
// flowers bloom, the insects emerge, and the swallow's slot on the wheel comes
// round to nothing, because she is still somewhere over the Gulf.
//
// The clock is the SAME component (gears.js). If this were a new drawing the
// audience would read it as a new idea; it has to be the machine they already
// trust, visibly running ahead of itself.
//
// THE STORY'S SPINE, and until now the only frame making the piece's central
// claim - "spring has crept steadily earlier" - with nothing behind it. It now
// carries the measurement: tree swallow lay dates near Ithaca advanced about 13
// days between 1972 and 2015, roughly 3 days per decade (Shipley et al. 2020),
// against a continental baseline of up to 9 days over 1959-1991 (Dunn & Winkler
// 1999). Both are this species. Neither is Toronto, and the labels say so.
//
// The thermometer's ticks stay BARE. It printed "+1 °C"/"+2 °C" until 2026-07-27
// with no source; that is still true, because no observed Ontario warming figure
// has been found. Shipley's 1.9 °C is Ithaca, in May and early June only, and
// this instrument has an arbitrary 0-1 scale that figure does not map onto -
// putting it on the ticks would be a worse lie than leaving them blank. It rides
// in the evidence box instead, where its scope can travel with it.
//
// There is no chart on this stage and there is no room for one. The clock owns
// x 470-970 (ring 180 plus 64-wide gears plus station labels), the thermometer
// owns the right margin, Willow flies up the left one, and the foot of the
// stage belongs to the caption. The figures ride as a source note at the head
// of the stage and inside the evidence box - which is what direction.md's
// "Data Integration" note actually asks for: one sentence, early, to remind the
// audience the story is real.
import { rect } from '../engine/svg.js';
import { natureClock } from '../components/gears.js';
import { thermometer } from '../components/thermometer.js';
import { sourceNote } from '../components/chart.js';
import { FIGURES, citeFigure } from '../data/phenology.js';
// Aliased, because this frame is the one place two data modules meet: the
// swallow figures are New York State (phenology) and the warming figure is
// Ontario (context). Keeping the two names apart is what stops a later edit
// quietly attributing one module's number to the other's study.
import { FIGURES as CONTEXT, citeFigure as citeContext } from '../data/context.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText, revealData } from '../engine/reveal.js';

export default {
  id: 's8-earlier-spring',
  title: 'An Earlier Spring',
  act: 'III',
  mood: 'day',
  build(ctx) {
    const { scene, overlay, tl, narrate, annotate, camera } = ctx;

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

    // Overlay, outside the camera: this frame pulls back to 0.85 and a note
    // inside `scene` would shrink toward the middle. Raw viewBox coordinates,
    // head of the stage, inside the x 330-1270 portrait band.
    overlay.appendChild(
      sourceNote(
        `Tree swallow lay dates have moved ${FIGURES.layDateTrendNY.value} - about 3 days per decade`,
        { x: 380, y: 60 }
      )
    );
    overlay.appendChild(sourceNote(citeFigure('layDateTrendNY'), { x: 380, y: 84 }));

    // NOT "something feels different this year". The whole argument of the piece
    // is that this is gradual - a drift across decades, not one strange spring.
    // A single bad year is weather, and weather is something a bird survives.
    const n1 = narrate({
      willow: '&ldquo;Every year, spring is a little further ahead of me.&rdquo;',
      narrator:
        'This did not happen in one season. As temperatures have climbed decade after decade, spring has crept steadily earlier - and the harmony that held it together has been slowly pulled apart.',
    });

    // The 1.9 °C is the figure that makes the whole scene make sense, and it is
    // easy to get wrong in exactly one way: Ithaca's MEAN ANNUAL temperature
    // rose only 0.51 °C over the same interval. The warming is concentrated in
    // the weeks that matter. Quote both, or the number sounds implausible.
    const evidence = annotate(
      `Warming pulls the season forward a little at a time: leaves open sooner, and the insects
       that feed on them emerge sooner too. Year on year, the drift accumulates.<br/>
       In the weeks when Tree Swallows lay - May into early June - temperatures rose
       <strong>${FIGURES.layingSeasonWarming.value}</strong>, against just
       <strong>0.51&thinsp;°C</strong> for the year as a whole. Across North America their laying
       had already moved <strong>${FIGURES.layDateAdvanceContinental.value}</strong> between 1959
       and 1991.<br/>
       Ontario&rsquo;s own springs have warmed
       <strong>${CONTEXT.ontarioSpringWarming.value}</strong> since 1948.<br/>
       <em>Swallow figures: New York State. Warming: ${citeContext('ontarioSpringWarming')}.
       Neither is Toronto.</em>`,
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
