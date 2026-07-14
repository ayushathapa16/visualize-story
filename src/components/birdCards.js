// ============================================================================
// birdCards.js - Toronto's bird neighbours (Scene 17).
//
// The cards still carry NO per-species statistics on their face. Audubon
// publishes species vulnerability, but the Ontario figures sit behind an
// interactive widget this project hasn't verified bird-by-bird, and a card is
// exactly the place where an invented category would look like a fact.
//
// What's new is that a card can now be OPENED: the outlook and any citations
// live in the drawer (components/panel.js), sourced from data/sources.js, which
// currently ships them empty on purpose. So the card face asserts nothing, and
// the drawer asserts only what the author has actually supplied.
// ============================================================================

import { g, path, rect, circle, text } from '../engine/svg.js';
import { gsap } from '../engine/gsap.js';
import { hitTarget } from '../engine/hit.js';
import { openPanel } from './panel.js';
import { speciesByName } from '../data/sources.js';

export const NEIGHBOURS = [
  { name: 'Tree Swallow', color: 'var(--willow-back)', belly: '#f6f1e4' },
  { name: 'Canada Jay', color: '#8a97a6', belly: '#f2efe6' },
  { name: 'Common Loon', color: '#2e4a5e', belly: '#efe9db' },
  { name: 'Bobolink', color: '#3a3327', belly: '#e6cf83' },
  { name: 'Wood Thrush', color: '#9a6b45', belly: '#efe2cc' },
  { name: 'Barn Swallow', color: '#3f6ea0', belly: '#e8b98d' },
];

/** A small perched bird, drawn around its own (0,0). */
function perched(color, belly) {
  return g({ class: 'card__bird' }, [
    path('M-30,4 C -34,-8 -20,-20 -2,-20 C 16,-20 26,-10 26,2 C 26,12 10,18 -8,18 C -22,18 -28,12 -30,4 Z', { fill: color }),
    path('M-14,8 C -2,16 14,14 22,4 C 16,14 -2,18 -14,12 Z', { fill: belly }),
    circle(20, -18, 12, { fill: color }),
    path('M30,-19 L44,-16 L30,-13 Z', { fill: '#201d18' }),
    circle(24, -21, 2.4, { fill: '#12100c' }),
    path('M-30,2 C -44,-2 -52,2 -58,8 C -46,6 -38,6 -28,8 Z', { fill: color }), // tail
  ]);
}

/**
 * @param {Object} [o]
 * @param {Array} [o.list]
 * @param {number} [o.x] @param {number} [o.y]  top-left of the card grid
 * @param {number} [o.cols]
 * @param {Object} [o.ctx] frame ctx - pass it to make the cards openable. Without
 *   it they render as the plain reveal-on-scroll grid they always were.
 * @returns {{ node, cards, reveal(stagger), sync() }}
 */
export function birdCards({ list = NEIGHBOURS, x = 220, y = 210, cols = 3, ctx = null } = {}) {
  const node = g({ class: 'bird-cards' });
  const cw = 360;
  const ch = 230;
  const gap = 28;
  const hits = [];

  const cards = list.map((b, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = x + col * (cw + gap);
    const cy = y + row * (ch + gap);

    // Two nodes on purpose: the OUTER group holds the static `transform`
    // attribute that places the card, and the INNER group is the only thing
    // GSAP touches. Animating `y` on the outer node would write a CSS transform
    // that silently overrides the attribute and stack every card at the origin
    // (engine/xform.js explains why).
    const slot = g({ class: 'bird-card', transform: `translate(${cx} ${cy})` });
    const card = g({ class: 'bird-card__inner' }, [
      rect(0, 0, cw, ch, { rx: 10, fill: 'var(--paper)', filter: 'url(#paperShadow)' }),
      rect(0, 0, cw, 8, { rx: 4, fill: b.color }),
    ]);

    const art = perched(b.color, b.belly);
    art.setAttribute('transform', `translate(${cw / 2} ${ch / 2 - 12}) scale(1.7)`);
    card.appendChild(art);

    card.appendChild(
      text(b.name, {
        x: cw / 2,
        y: ch - 26,
        'font-size': 24,
        'font-family': 'var(--font-sans)',
        'font-weight': 600,
        fill: 'var(--ink)',
        'text-anchor': 'middle',
      })
    );

    gsap.set(card, { opacity: 0, y: 18 });
    slot.appendChild(card);
    node.appendChild(slot);

    // The hit target covers the SLOT, not the card: the slot's transform is
    // static, while `card` is the node GSAP slides up on reveal. Anchoring the
    // button to a moving box would leave it 18px adrift of the art.
    if (ctx) {
      const species = speciesByName(b.name);
      hits.push(
        hitTarget({
          svg: ctx.svg,
          stage: ctx.stage,
          target: slot,
          cls: 'hit--card',
          label: `${b.name} - read the outlook`,
          onActivate: () =>
            openPanel({
              title: b.name,
              // If the species isn't in sources.js we say so plainly rather than
              // opening an empty drawer that looks like a loading bug.
              body: species
                ? [species.blurb]
                : ['Details for this species haven’t been added yet.'],
              facts: species ? species.facts : [],
              sources: species ? species.sources : [],
            }),
        })
      );
    }

    return card;
  });

  /** Cards arrive one after another - the flock becoming individuals again. */
  function reveal({ stagger = 0.22, dur = 0.7 } = {}) {
    return gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: dur,
      stagger,
      ease: 'power2.out',
    });
  }

  /** Re-measure the hit targets (call after a camera move settles). */
  function sync() {
    hits.forEach((h) => h.sync());
  }

  return { node, cards, reveal, sync };
}
