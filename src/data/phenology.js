// ============================================================================
// phenology.js - the tree swallow literature, and the second of the project's
// two data modules.
//
// `torontoBirds.js` is GENERATED from a downloadable dataset. This file cannot
// be: these are figures reported in the text of papers, so there is nothing to
// download and nothing to assert against. It is maintained BY HAND, and the
// discipline that replaces the build script's asserts is this:
//
//   1. Every study carries a `provenance`. `read` means someone in this repo
//      opened the paper and read it. `secondary` means they could not - the
//      figure comes from a press release and may be rounded, simplified, or
//      missing the qualifier that makes it true. A frame can therefore tell the
//      two apart in code, and so can the next person.
//   2. Every figure names what was actually MEASURED, and WHERE. Not what the
//      scene is about - what the instrument recorded. The difference between
//      "the gap between green-up and arrival" and "the gap between insects and
//      chicks" is the whole reason MISMATCH sat empty for so long.
//   3. A figure whose `measured` line cannot honestly sit next to a frame's art
//      does not go in that frame. If the caption has to soften `measured` to
//      fit, the figure is wrong for that scene.
//
// Every entry here has a matching section in docs/sources.md (§F). If you add
// one without adding that, you have removed the only record of where it came
// from.
//
// ALL OF THIS IS NEW YORK STATE except probst2026, which is southern Ontario.
// Ithaca is ~500 km from Toronto across the lake, same species, comparable
// climate. That is a fair thing to show a Toronto reader and a dishonest thing
// to call a Toronto measurement - so every label says where it was taken.
// ============================================================================

/**
 * The papers. `provenance` is load-bearing - see rule 1 above.
 * @type {Record<string, {title:string,authors:string,year:number,journal:string,url:string,provenance:'read'|'secondary',note?:string}>}
 */
export const STUDIES = {
  winkler2013: {
    title: 'Temperature effects on food supply and chick mortality in tree swallows (Tachycineta bicolor)',
    authors: 'Winkler DW, Luo MK, Rakhimberdiev E',
    year: 2013,
    journal: 'Oecologia 173: 129-138',
    url: 'https://doi.org/10.1007/s00442-013-2605-z',
    provenance: 'read',
  },
  shipley2020: {
    title: 'Birds advancing lay dates with warming springs face greater risk of chick mortality',
    authors: 'Shipley JR, Twining CW, Taff CC, Vitousek MN, Flack A, Winkler DW',
    year: 2020,
    journal: 'PNAS 117(41): 25590-25594',
    url: 'https://doi.org/10.1073/pnas.2009864117',
    provenance: 'read',
  },
  dunn1999: {
    title: 'Climate change has affected the breeding date of tree swallows throughout North America',
    authors: 'Dunn PO, Winkler DW',
    year: 1999,
    journal: 'Proc. R. Soc. B 266: 2487-2490',
    url: 'https://doi.org/10.1098/rspb.1999.0950',
    provenance: 'read',
  },
  probst2026: {
    title: 'Resource declines shape phenological and morphological responses to climate change',
    authors: 'Probst C, Yanco S, Clark I, Ziebell M, Fuirst M, Mackenzie SA, Ibáñez I',
    year: 2026,
    journal: 'PNAS 123(26): e2607714123',
    url: 'https://doi.org/10.1073/pnas.2607714123',
    provenance: 'secondary',
    note:
      'PNAS returns 403 and this paper has not been read. Its figures come from the ' +
      'University of Michigan press release and the CBC report of it.',
  },
};

/**
 * One entry per figure that reaches the screen.
 *
 * `measured` is not decoration. It is the sentence that stops a frame quietly
 * upgrading a proxy into the thing itself.
 *
 * @type {Record<string, {value:string,measured:string,scope:string,study:string}>}
 */
export const FIGURES = {
  // --- Winkler et al. 2013 -------------------------------------------------
  insectPeakTemp: {
    value: '18.5 °C',
    measured: 'Daily maximum temperature at which flying-insect abundance peaks',
    scope: 'Ithaca, New York, daily insect sampling 1989-2011',
    scopeShort: 'Ithaca NY, 1989-2011',
    study: 'winkler2013',
  },
  coldSnapDefinition: {
    value: 'consecutive days below 18.5 °C',
    measured: 'The paper’s own definition of a cold snap; runs of one, two and three days were tested',
    scope: 'Ithaca, New York, 1986-2011',
    scopeShort: 'Ithaca NY, 1986-2011',
    study: 'winkler2013',
  },
  // PARKED ON PURPOSE, and it is the only unused figure in either hand-written
  // data module. It belongs to Scene 25 by subject - about one year in three is
  // a year when half the nests fledge nothing - and Scene 25 deliberately shows
  // ONE line (nestFailureRise). A second statistic over a nest that has stopped
  // moving is the frame arguing with itself. Kept here because it is read,
  // correct and cited in docs/sources.md §F1; if Scene 25 ever gains a drawer,
  // this is the first thing that goes in it.
  highMortalityYears: {
    value: 'about 1 year in 3',
    measured: 'Years in which fewer than half of nesting attempts fledged even one chick',
    scope: 'upstate New York, 2,261 nests, 1986-2011',
    scopeShort: 'Ithaca NY, 1986-2011',
    study: 'winkler2013',
  },

  // --- Shipley et al. 2020 -------------------------------------------------
  layDateTrendNY: {
    value: 'about 13 days earlier',
    measured: 'Advance in tree swallow lay date, ~3 days per decade',
    scope: 'two sites near Ithaca, New York, 11,236 chicks in 2,041 nests, 1972-2015',
    scopeShort: 'Ithaca NY, 1972-2015',
    study: 'shipley2020',
  },
  layingSeasonWarming: {
    value: '1.9 °C',
    measured:
      'Rise in May-to-early-June temperature - the weeks when the swallows lay - against a ' +
      'rise of only 0.51 °C in the mean annual temperature',
    scope: 'Ithaca, New York, 1989-2015 vs 1963-1988',
    scopeShort: 'Ithaca NY, 1989-2015',
    study: 'shipley2020',
  },
  coldSnapRisk: {
    value: '11.5% → 19.6%',
    measured:
      'Chance that a nestling meets a cold snap - once every ten years becoming once every ' +
      'five. The cold snaps did not change; the hatch dates moved into them',
    scope: 'Ithaca, New York, nestlings of the 1970s vs those hatched since 2011',
    scopeShort: 'Ithaca NY, 1972-2015',
    study: 'shipley2020',
  },
  coldSnapCost: {
    value: 'more than half',
    measured: 'Drop in offspring survival caused by a single 1-2 day cold-snap event',
    scope: 'Ithaca, New York, 1972-2015',
    scopeShort: 'Ithaca NY, 1972-2015',
    study: 'shipley2020',
  },
  fledgedAfterVsBefore: {
    value: '3.78 vs 2.67 chicks',
    measured:
      'Chicks fledged per nest when the brood hatched after the year’s last cold snap, ' +
      'against nests that hatched before it - about one chick',
    scope: 'Ithaca, New York, 1972-2015',
    scopeShort: 'Ithaca NY, 1972-2015',
    study: 'shipley2020',
  },
  nestFailureRise: {
    value: '15.8% → 33.2%',
    measured: 'Proportion of nests failing completely',
    scope: 'Ithaca, New York, 1989 to 2015',
    scopeShort: 'Ithaca NY, 1989-2015',
    study: 'shipley2020',
  },
  coldSnapsUnchanged: {
    value: 'unchanged for 125 years',
    measured:
      'Seasonal pattern of 1-, 2- and 3-day cold snaps below 18.5 °C. The insect record over ' +
      '25 years shows no long-term trend either',
    scope: 'Ithaca, New York',
    scopeShort: 'Ithaca NY',
    study: 'shipley2020',
  },

  // --- Dunn & Winkler 1999 -------------------------------------------------
  layDateAdvanceContinental: {
    value: 'up to 9 days earlier',
    measured: 'Advance in tree swallow laying date, with rising spring air temperature',
    scope: '3,450 nest records across North America, 1959-1991',
    scopeShort: 'North America, 1959-1991',
    study: 'dunn1999',
  },

  // --- Probst et al. 2026 - SECONDARY, see the module header ---------------
  ontarioInsectLoss: {
    value: '62%',
    measured: 'Decline in insect biomass',
    scope: 'Long Point Bird Observatory, southern Ontario, 1977-2011',
    scopeShort: 'Long Point, Ontario, 1977-2011',
    study: 'probst2026',
  },
  ontarioMismatchRate: {
    value: 'more than 3 days per decade',
    measured:
      'Widening gap between tree swallow breeding and peak insect emergence',
    scope: 'Long Point Bird Observatory, southern Ontario, since 1977',
    scopeShort: 'Long Point, Ontario, since 1977',
    study: 'probst2026',
  },
};

/** The study behind a figure. Throws rather than render an uncited number. */
export function studyFor(key) {
  const f = FIGURES[key];
  if (!f) throw new Error(`phenology: no figure "${key}"`);
  const s = STUDIES[f.study];
  if (!s) throw new Error(`phenology: figure "${key}" cites unknown study "${f.study}"`);
  return s;
}

/**
 * The on-stage citation line for a figure. It always carries WHERE the
 * measurement was taken, because none of these were taken in Toronto.
 *
 * IT IS DELIBERATELY SHORT, and there is a hard reason. A portrait screen shows
 * only viewBox x 330-1270 - about 940 units - and sourceNote() renders at
 * font-size 15, which is roughly 120 characters of Inter. The first draft of
 * this function returned the full scope plus the journal and volume; every one
 * of the eight lines built from it ran between 1030 and 1760 units and would
 * have walked off the side of a phone. So: `scopeShort`, first author, year.
 * The full scope and the journal live in the drawer and in docs/sources.md.
 *
 * THE BUDGET, for anyone adding a line: claim <= ~115 characters, and the cite
 * goes on its own line beneath it. Do not concatenate the two.
 *
 * Deliberately does NOT mark secondary sources on the stage. The attribution is
 * correct either way - the finding is the paper's - and "we didn't read this"
 * is a note to the next maintainer, not to the reader. It lives in
 * docs/sources.md, in STUDIES[].provenance, and in the drawer via caveatFor().
 */
export function citeFigure(key) {
  const f = FIGURES[key];
  const s = studyFor(key);
  const first = s.authors.split(',')[0].split(' ')[0];
  return `${f.scopeShort} · ${first} et al. ${s.year}`;
}

/** Drawer-shaped `{label, value}` - the same form MISMATCH.facts uses. */
export function factFor(key, label) {
  const f = FIGURES[key];
  return { label: label || f.measured, value: `${f.value} (${f.scope})` };
}

/** `{title, authors, year, url}` - the shape panelContent's `sources` wants. */
export function sourceFor(key) {
  const s = studyFor(key);
  return { title: s.title, authors: s.authors, year: s.year, url: s.url };
}

/**
 * The sentence a drawer shows when a figure came from a press release rather
 * than the paper. Returns null for a read source, so callers can spread it in
 * unconditionally and get nothing when there is nothing to say.
 */
export function caveatFor(key) {
  const s = studyFor(key);
  if (s.provenance !== 'secondary') return null;
  return (
    `This figure is reported by <em>${s.title}</em> (${s.authors.split(',')[0]} et al., ` +
    `${s.year}). The paper is paywalled and we have not read it - the number comes from the ` +
    `authors&rsquo; institutional press release, which is a summary and may be less precise ` +
    `than the paper itself.`
  );
}
