// Scene 17 - The Birds of Toronto. Beat: THE TURN. "Is this still just a bird story?"
//
// The flock resolves into individuals, and each one can be opened.
//
// This frame carries the project's ONE hard data claim - Audubon's +1.5 °C /
// +3.0 °C figures - and the rules around it have not changed just because the
// cards are now clickable:
//
//   - The continental figures are sourced and quotable, and they live in
//     SCENARIOS (components/climate.js), not in this file.
//   - The per-species outlooks are NOT quotable. Audubon's Ontario numbers sit
//     behind an interactive widget that isn't scrapeable, so the cards say
//     nothing numeric. What a card opens is prose, plus whatever citations the
//     author has actually supplied in data/sources.js - which currently ships
//     empty, so the drawers render prose and nothing else. That is the correct
//     failure mode: silence, not a plausible-looking number.
//
// The camera is deliberately STATIC. engine/hit.js measures each card's box in
// screen space and re-measures on resize; a camera push would slide the art out
// from under its own button.
import { birdCards } from '../components/birdCards.js';
import { SCENARIOS } from '../data/sources.js';
import { revealText, revealData } from '../engine/reveal.js';

export default {
  id: 's17-birds-of-toronto',
  title: 'The Birds of Toronto',
  act: 'VI',
  mood: 'day',
  build(ctx) {
    const { scene, tl, narrate, annotate, camera, audio } = ctx;

    ctx.backdrop('#e7e0ca');

    // Passing ctx is what makes the cards openable (see birdCards.js).
    const cards = birdCards({ x: 200, y: 190, cols: 3, ctx });
    scene.appendChild(cards.node);

    // Framed slightly high so the bottom row clears the two-voice caption band
    // on short viewports. Set once and left alone - see the note above.
    camera.set({ fx: 800, fy: 470, scale: 0.94 });

    const n1 = narrate({
      willow: '&ldquo;These are my neighbours.&rdquo;',
      narrator:
        'Climate change affects every species differently. Some are expected to lose breeding habitat; others are expected to shift north. Open a card to read its outlook.',
    });

    const evidence = annotate(
      `<strong>${SCENARIOS.vulnerableAt3} of ${SCENARIOS.speciesStudied}</strong> North American bird species are
       vulnerable to extinction at <strong>+3&thinsp;°C</strong> - they may lose more than half their range.
       Hold warming to <strong>+1.5&thinsp;°C</strong> and nearly <strong>${SCENARIOS.savedAt15}</strong> of them are
       no longer at risk.<br/><em>Audubon, Survival by Degrees</em>`,
      // Below the grid and hard left: the HUD's act chip owns the top-left
      // corner, and the centred caption owns the middle of the lower band.
      { left: '3%', top: '63%' }
    );

    tl.add(cards.reveal({ stagger: 0.26, dur: 0.8 }), 0.2)
      // The cards slide up as they arrive; re-measure once they've landed so the
      // hit targets sit exactly on the art.
      .call(() => cards.sync(), null, 2.6)
      .add(revealText(n1.lines[0]), 0.8)
      .add(revealText(n1.lines[1]), 2.2)
      // The number lands last, on a grid the reader has already met as neighbours.
      .add(revealData(evidence), 3.6)
      .to({}, { duration: 1.6 });

    audio.play('swallow-call');

    ctx.scrollCue('Back to one bird');
  },
};
