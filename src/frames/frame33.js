// Scene 33 - Small Actions Matter. Beat: RESPONSIBILITY (invited, never demanded).
//
// Five things, each one a small causal chain - because the whole story has been
// one. The reader does not need to be told why leaving the leaves matters; they
// watched an act of television about what happens when the insects don't come.
//
// The copy lives in ACTIONS (data/sources.js) with everything else the story
// asserts. Four of the five claims are mechanistic (the action produces insects,
// or habitat) and carry no number - we cannot say how many birds a front garden
// saves, so we don't.
//
// THE FIFTH IS DIFFERENT, as of 2026-07-27. "Plant native" now states a measured
// threshold, because one study measured exactly that chain end to end (Narango
// et al. 2018 - see docs/sources.md §G5), and it carries a citation on the stage
// for it. The asymmetry is the point and should survive: a number appears on the
// one card that earned one, which is what makes the silence on the other four
// mean something rather than read as a house style.
import { g, rect, text } from '../engine/svg.js';
import { ACTIONS } from '../data/sources.js';
import { sourceNote } from '../components/chart.js';
import { citeFigure as citeContext } from '../data/context.js';
import { gsap } from '../engine/gsap.js';
import { revealText } from '../engine/reveal.js';

const ICONS = {
  native: '🌼',
  pesticide: '🚫',
  leaves: '🍂',
  wetland: '💧',
  monitor: '🔭',
};

/** One paper card. Static outer transform; GSAP only ever touches the inner g. */
function actionCard(a, x, y, w, h) {
  const slot = g({ class: 'action-card', transform: `translate(${x} ${y})` });
  const card = g({ class: 'action-card__inner' }, [
    rect(0, 0, w, h, { rx: 10, fill: 'var(--paper)', filter: 'url(#paperShadow)' }),
    rect(0, 0, 8, h, { rx: 4, fill: 'var(--sage)' }),
  ]);

  card.appendChild(text(ICONS[a.id] || '🌿', { x: 34, y: 58, 'font-size': 36 }));
  card.appendChild(
    text(a.title, {
      x: 96,
      y: 48,
      'font-size': 23,
      'font-family': 'var(--font-sans)',
      'font-weight': 600,
      fill: 'var(--ink)',
    })
  );

  // Wrap the body by hand - SVG text has no line box, so a long sentence would
  // simply run off the card and keep going.
  const words = a.body.split(' ');
  const lines = [];
  let line = '';
  for (const wd of words) {
    if ((line + wd).length > 46) {
      lines.push(line.trim());
      line = '';
    }
    line += `${wd} `;
  }
  if (line.trim()) lines.push(line.trim());

  lines.slice(0, 3).forEach((ln, i) => {
    card.appendChild(
      text(ln, {
        x: 96,
        y: 80 + i * 26,
        'font-size': 18,
        'font-family': 'var(--font-sans)',
        fill: 'var(--ink-soft)',
      })
    );
  });

  gsap.set(card, { opacity: 0, y: 16 });
  slot.appendChild(card);
  return { slot, card };
}

export default {
  id: 's33-small-actions',
  title: 'Small Actions Matter',
  act: 'VII',
  mood: 'day',
  build(ctx) {
    const { scene, tl, narrate, camera } = ctx;

    ctx.backdrop('#e7e2cc');

    const cw = 620;
    const ch = 168;
    const gap = 24;
    const cards = ACTIONS.map((a, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      // The fifth card has no partner, so centre it under the other four rather
      // than leaving it hanging in the left column.
      const lonely = i === ACTIONS.length - 1 && ACTIONS.length % 2 === 1;
      const x = lonely ? 180 + (cw + gap) / 2 : 180 + col * (cw + gap);
      const c = actionCard(a, x, 190 + row * (ch + gap), cw, ch);
      scene.appendChild(c.slot);
      return c.card;
    });

    camera.set({ fx: 800, fy: 470, scale: 0.88 });

    // The "Plant native" card is the only one of the five carrying a number, so
    // it is the only one that needs a citation - and a card that small cannot
    // hold one (its body is clipped to three wrapped lines). It goes here, at
    // the head of the stage, where the rest of the piece puts its citations.
    //
    // Positioned in `scene` rather than `overlay` because this frame's camera is
    // set once and never moves; y=104 sits above the card grid, which starts at
    // y=190, and x=380 clears the portrait crop.
    scene.appendChild(sourceNote(citeContext('nativePlantThreshold'), { x: 380, y: 104 }));

    const n1 = narrate({
      willow: '&ldquo;Thank you for looking after our home.&rdquo;',
      narrator:
        'Small actions, repeated across a city, add up to healthier habitat for birds and the insects they live on.',
    });

    tl.to(cards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.3, ease: 'power2.out' }, 0.3)
      .add(revealText(n1.lines[0]), 1.6)
      .add(revealText(n1.lines[1]), 2.8)
      .to({}, { duration: 1.6 });

    ctx.scrollCue('One last flight');
  },
};
