// ============================================================================
// registry.js - ordered scenes of the story. 34 scenes, Acts I–VII.
//
// Scenes 4-8 are Willow walking the five stages of the year one at a time, so
// that the clock in Scene 9 is an assembly of parts the reader already knows
// rather than a diagram handed to them whole.
//
// Scenes 14-18 are that same run again, in a warmer year, one link at a time
// coming out of step - so that the clock in Scene 19 breaks over something the
// reader has watched rather than something a caption asserts.
//
// Act VI-B (29-31) is the data movement: three scenes of published numbers,
// dropped in after "my story isn't unique" and before the call to action. It is
// the only stretch of the piece where a chart is evidence rather than
// illustration, and every frame in it carries its citation on the stage.
//
// File number == scene number, deliberately: frameNN.js IS Scene NN in
// docs/story.md. Keep it that way - the moment they drift, every note in the
// script points at the wrong file.
// ============================================================================

import s1 from './frame01.js';
import s2 from './frame02.js';
import s3 from './frame03.js';
import s4 from './frame04.js';
import s5 from './frame05.js';
import s6 from './frame06.js';
import s7 from './frame07.js';
import s8 from './frame08.js';
import s9 from './frame09.js';
import s10 from './frame10.js';
import s11 from './frame11.js';
import s12 from './frame12.js';
import s13 from './frame13.js';
import s14 from './frame14.js';
import s15 from './frame15.js';
import s16 from './frame16.js';
import s17 from './frame17.js';
import s18 from './frame18.js';
import s19 from './frame19.js';
import s20 from './frame20.js';
import s21 from './frame21.js';
import s22 from './frame22.js';
import s23 from './frame23.js';
import s24 from './frame24.js';
import s25 from './frame25.js';
import s26 from './frame26.js';
import s27 from './frame27.js';
import s28 from './frame28.js';
import s29 from './frame29.js';
import s30 from './frame30.js';
import s31 from './frame31.js';
import s32 from './frame32.js';
import s33 from './frame33.js';
import s34 from './frame34.js';

export const FRAMES = [
  s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17,
  s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34,
];

// Acts, for the HUD label. (Roman-numeral act → human title.)
export const ACTS = {
  I: 'Act I · Home',
  II: 'Act II · New Life',
  III: 'Act III · Something Changes',
  IV: 'Act IV · The Gamble',
  V: 'Act V · Hunger',
  VI: "Act VI · I'm Not Alone",
  'VI-B': 'Act VI · The Evidence',
  VII: 'Act VII · What We Can Do',
};
