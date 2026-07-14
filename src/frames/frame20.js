// Scene 20 - Small Actions Matter. Beat: RESPONSIBILITY (invited, never demanded).
//
// Five things, each one a small causal chain - because the whole story has been
// one. The reader does not need to be told why leaving the leaves matters; they
// watched an act of television about what happens when the insects don't come.
//
// The copy lives in ACTIONS (data/sources.js) with everything else the story
// asserts. Each claim is mechanistic (it produces insects, or habitat), never a
// quantified outcome - we cannot say how many birds a front garden saves, so we
// don't.
import { g, rect, text } from '../engine/svg.js';
import { ACTIONS } from '../data/sources.js';
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
  id: 's20-small-actions',
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
