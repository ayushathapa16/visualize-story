// Scene 10 - Phenological Mismatch. Beat: CONFUSION (the strongest viz).
//
// The one scene in the piece that makes a scientific claim, so it is the one
// that has to be most careful about what it says.
//
// The claim is NOT "the chicks hatch into an empty sky". They don't. They hatch
// into a sky that still has insects in it - just far fewer than the few days of
// peak abundance a brood of four is built around. That is why the insect row is
// an abundance curve rather than a bar: only a curve can show "still there, but
// past the peak" (see components/timelineBar.js).
//
// The term arrives last, and it is a button: the definition, the mechanism and
// the papers live in the drawer, so the scene itself never has to lecture.
import { text } from '../engine/svg.js';
import { phenologyBars } from '../components/timelineBar.js';
import { panelTrigger } from '../components/panel.js';
import { MISMATCH } from '../data/sources.js';
import { createWillow } from '../characters/willow.js';
import { gsap } from '../engine/gsap.js';
import { revealText, revealTerm } from '../engine/reveal.js';

export default {
  id: 's10-mismatch',
  title: 'Phenological Mismatch',
  act: 'III',
  mood: 'day',
  build(ctx) {
    const { scene, tl, narrate, camera, stage } = ctx;

    ctx.backdrop('#efe7d2');

    // The header sits ABOVE the chart, not beside it - level with the Plants row
    // it prints straight through the first curve.
    const hdrStyle = {
      x: 520,
      y: 112,
      'font-size': 28,
      'font-family': 'var(--font-sans)',
      'font-weight': 700,
    };
    const hdrBefore = text('A normal year', { ...hdrStyle, fill: 'var(--ink-soft)' });
    const hdrAfter = text('A warmer year', { ...hdrStyle, fill: '#c0392b', opacity: 0 });
    scene.appendChild(hdrBefore);
    scene.appendChild(hdrAfter);

    const bars = phenologyBars({ x: 520, y: 132, w: 680 });
    scene.appendChild(bars.node);
    bars.setShift(0);

    const willow = createWillow({ scale: 0.55 });
    scene.appendChild(willow.node);
    willow.setMood('worried');
    gsap.set(willow.node, { x: 300, y: 560 });

    // This frame stacks three tall things in one column - the biggest chart in
    // the piece, the clickable term, and a two-voice caption. They collide the
    // moment any of them drifts, so the framing is deliberately pulled back and
    // the term is parked in the one clear band between the axis and the caption.
    camera.set({ fx: 830, fy: 360, scale: 0.86 });

    const n1 = narrate({
      willow: '&ldquo;The insects were already disappearing when my babies needed them most.&rdquo;',
      narrator:
        'Scientists call this a phenological mismatch. The chicks still hatch while insects are around - but the peak abundance that once fed a whole brood has already passed.',
    });

    // The term, and the way in. It is a real button (DOM over the stage), so it
    // is reachable by keyboard and hidden by ?nolabels along with the rest of
    // the text.
    // No `top` here on purpose: the stylesheet places this one. It has to sit in
    // the clear band between the chart's axis and the caption on a wide screen,
    // and move above the chart entirely on a short or portrait one - and an
    // inline position from here would beat the media query that does that.
    const trigger = panelTrigger({
      stage,
      label: 'Phenological Mismatch',
      content: MISMATCH,
    });
    trigger.classList.add('panel-trigger--term');
    gsap.set(trigger, { opacity: 0 });

    tl
      // Rest: everything overlaps, and the peak sits right where the chicks are.
      .to({}, { duration: 1.2 })

      // Only the insect curve moves. Everything else stays exactly where it was -
      // that is the entire argument of the scene.
      .to(
        { s: 0 },
        {
          s: 1,
          duration: 4,
          ease: 'power1.inOut',
          onUpdate() {
            bars.setShift(this.targets()[0].s);
          },
        },
        1.2
      )
      .to(hdrBefore, { opacity: 0, duration: 0.6 }, 2.2)
      .to(hdrAfter, { opacity: 1, duration: 0.6 }, 2.6)

      .add(revealText(n1.lines[0]), 5.4)
      .add(revealText(n1.lines[1]), 6.4)

      // Named only once the chart has already made the point.
      .add(revealTerm(trigger), 7.6)
      .to({}, { duration: 1.4 });

    ctx.scrollCue('So when should she lay?');
  },
};
