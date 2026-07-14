// ============================================================================
// registry.js - ordered scenes of the story. 21 scenes, Acts I–VII.
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

export const FRAMES = [
  s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11,
  s12, s13, s14, s15, s16, s17, s18, s19, s20, s21,
];

// Acts, for the HUD label. (Roman-numeral act → human title.)
export const ACTS = {
  I: 'Act I · Home',
  II: 'Act II · New Life',
  III: 'Act III · Something Changes',
  IV: 'Act IV · The Gamble',
  V: 'Act V · Hunger',
  VI: "Act VI · I'm Not Alone",
  VII: 'Act VII · What We Can Do',
};
