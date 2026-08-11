// ============================================================================
// context.js - the figures that are NOT about Willow, and the third of the
// project's data modules.
//
// `torontoBirds.js` is generated from a dataset. `phenology.js` is the tree
// swallow literature. This file is everything else the story leans on: the
// climate Toronto has actually observed, what has happened to North American
// birds as a whole, what has happened to insects as a whole, and the one
// measured claim behind Act VII's advice.
//
// WHY IT IS A SEPARATE FILE. `phenology.js` opens with a promise about what is
// inside it - tree swallows, New York and Long Point - and frames rely on that
// promise when they reach for a figure. Dropping a continental bird count or an
// Ontario temperature into it would quietly break that, and the first casualty
// would be the scope discipline that module exists to enforce. So: same rules,
// separate home.
//
// THE RULES ARE `phenology.js`'S RULES, and they are not optional here:
//
//   1. Every study carries a `provenance`. `read` means someone in this repo
//      opened it. Everything in this file is `read` - unlike §F, none of it had
//      to be taken from a press release. If that ever stops being true, the
//      `secondary` machinery is already here and `caveatFor()` will say so.
//   2. Every figure names what was MEASURED and WHERE. Not what the scene is
//      about - what the instrument recorded.
//   3. A figure whose `measured` line cannot honestly sit next to a frame's art
//      does not go in that frame.
//
// Every entry has a matching section in docs/sources.md (§G).
//
// SCOPE, and it is wider here than in phenology.js. Nothing in this file is a
// Toronto measurement either:
//   - ontarioSpringWarming / ontarioAnnualWarming ... the province of Ontario
//   - birdLoss / aerialInsectivoreLoss ................ the US + Canada
//   - terrestrialInsectTrend ......................... the world
//   - nativePlantThreshold ........................... Washington DC, and a
//     different bird with a different diet
// Every label built from them says so, and `scopeShort` is what puts it on the
// stage rather than in a footnote nobody opens.
// ============================================================================

/**
 * `cite` is the on-stage short form, and it is explicit rather than derived.
 * phenology.js builds its equivalent by taking the first word of the first
 * author - which works for "Winkler DW" and breaks on the two studies here: a
 * ten-author government report has no recognisable first author at all, and
 * "van Klink R" would come out as "van et al." That is the kind of error nobody
 * notices in review and every reader notices on screen.
 *
 * @type {Record<string, {title:string,authors:string,year:number,journal:string,url:string,cite:string,provenance:'read'|'secondary',note?:string}>}
 */
export const STUDIES = {
  cccr2019: {
    title: "Canada's Changing Climate Report, Chapter 4: Temperature and precipitation across Canada",
    authors: 'Zhang X, Flato G, Kirchmeier-Young M, Vincent L, Wan H, Wang X, Rong R, Fyfe J, Li G, Kharin VV',
    year: 2019,
    journal: 'Government of Canada, Ottawa',
    url: 'https://changingclimate.ca/CCCR2019/chapter/4-0/',
    cite: 'Canada\'s Changing Climate Report',
    provenance: 'read',
  },
  rosenberg2019: {
    title: 'Decline of the North American avifauna',
    authors:
      'Rosenberg KV, Dokter AM, Blancher PJ, Sauer JR, Smith AC, Smith PA, Stanton JC, Panjabi A, Helft L, Parr M, Marra PP',
    year: 2019,
    journal: 'Science 366: 120-124',
    url: 'https://doi.org/10.1126/science.aaw1313',
    cite: 'Rosenberg et al. 2019',
    provenance: 'read',
  },
  knight2019: {
    title:
      'Nonbreeding season movements of a migratory songbird are related to declines in resource availability',
    authors: 'Knight SM, Gow EA, Bradley DW, Clark RG, Bélisle M, Norris DR',
    year: 2019,
    journal: 'The Auk: Ornithological Advances 136: ukz028',
    url: 'https://doi.org/10.1093/auk/ukz028',
    cite: 'Knight et al. 2019',
    provenance: 'read',
  },
  vanklink2020: {
    title:
      'Meta-analysis reveals declines in terrestrial but increases in freshwater insect abundances',
    authors: 'van Klink R, Bowler DE, Gongalsky KB, Swengel AB, Gentile A, Chase JM',
    year: 2020,
    journal: 'Science 368: 417-420',
    url: 'https://doi.org/10.1126/science.aax9931',
    cite: 'van Klink et al. 2020',
    provenance: 'read',
  },
  narango2018: {
    title: 'Nonnative plants reduce population growth of an insectivorous bird',
    authors: 'Narango DL, Tallamy DW, Marra PP',
    year: 2018,
    journal: 'PNAS 115(45): 11549-11554',
    url: 'https://doi.org/10.1073/pnas.1809259115',
    cite: 'Narango et al. 2018',
    provenance: 'read',
  },
};

/**
 * One entry per figure that reaches the screen.
 * @type {Record<string, {value:string,measured:string,scope:string,scopeShort:string,study:string}>}
 */
export const FIGURES = {
  // --- Canada's Changing Climate Report 2019, Table 4.1 --------------------
  // The piece's ONLY regional climate measurement. Everything else about
  // temperature on this site is either a global scenario (Audubon) or a New
  // York State observation.
  ontarioSpringWarming: {
    value: '1.5 °C',
    measured:
      'Observed rise in Ontario’s mean SPRING temperature - the season the swallows lay in. ' +
      'The annual mean rose less, 1.3 °C',
    scope: 'the province of Ontario, 1948-2016, observed (not projected)',
    scopeShort: 'Ontario, 1948-2016',
    study: 'cccr2019',
  },
  // There is no separate `ontarioAnnualWarming` entry, and there was one for
  // about an hour. The annual figure (1.3 °C) makes the same "the warming is
  // concentrated in the season that matters" argument that Scene 13's box
  // already makes far better with Ithaca's 1.9 °C against 0.51 °C - so on a
  // phone it bought a third repetition of one idea at the cost of three lines
  // over the artwork. It lives inside `measured` below, where the drawer and
  // docs/sources.md §G1 can still reach it, and off the stage.

  // --- Rosenberg et al. 2019 ----------------------------------------------
  // The aerial-insectivore row is the one that matters here: it is Willow's own
  // functional group, measured, in a paper that was read in full.
  aerialInsectivoreLoss: {
    value: '32%',
    measured:
      'Net loss of breeding birds among the 26 aerial insectivore species - the guild that ' +
      'feeds on flying insects, as Willow does. 73% of those species are declining',
    scope: 'continental United States and Canada, 1970-2017, 156.8 million birds',
    scopeShort: 'US + Canada, 1970-2017',
    study: 'rosenberg2019',
  },
  birdLoss: {
    value: '2.9 billion',
    measured: 'Net loss of breeding birds across the avifauna as a whole - 29% of the 1970 total',
    scope: '529 species, continental United States and Canada, 1970-2017',
    scopeShort: 'US + Canada, 1970-2017',
    study: 'rosenberg2019',
  },

  // --- Knight et al. 2019 --------------------------------------------------
  // Scene 2 said "Central and South America" until 2026-07-27. It was wrong.
  wintering: {
    value: 'the Gulf of Mexico, Florida, Mexico, Central America and the Caribbean',
    measured:
      'The species’ nonbreeding range. Birds from the eastern flyway - Toronto’s end of it - ' +
      'winter in Florida and the Caribbean',
    scope: '133 light-level geolocators, 12 breeding sites from Alaska to Nova Scotia',
    scopeShort: '133 geolocators, 12 sites',
    study: 'knight2019',
  },

  // --- van Klink et al. 2020 ----------------------------------------------
  // Used on Scene 24 to make the 62% Long Point figure SMALLER. See §G4.
  terrestrialInsectTrend: {
    value: 'about 9% per decade',
    measured:
      'Average decline in terrestrial insect abundance, 0.92% per year. Trends vary widely even ' +
      'between adjacent sites, and freshwater insects rose over the same period',
    scope: '166 long-term surveys, 1,676 sites, 41 countries, 1925-2018',
    scopeShort: '1,676 sites worldwide',
    study: 'vanklink2020',
  },

  // --- Narango et al. 2018 -------------------------------------------------
  // The only measured claim in Act VII. Different bird, different diet, so the
  // label says which bird - see §G5.
  nativePlantThreshold: {
    value: '70%',
    measured:
      'Share of plant biomass that had to be NATIVE for a chickadee population to sustain ' +
      'itself. Below that, the birds raised fewer young or did not breed at all',
    scope: 'Carolina Chickadees in residential yards, Washington DC, 2000-2016',
    scopeShort: 'Carolina Chickadee, Washington DC',
    study: 'narango2018',
  },
};

/** The study behind a figure. Throws rather than render an uncited number. */
export function studyFor(key) {
  const f = FIGURES[key];
  if (!f) throw new Error(`context: no figure "${key}"`);
  const s = STUDIES[f.study];
  if (!s) throw new Error(`context: figure "${key}" cites unknown study "${f.study}"`);
  return s;
}

/**
 * The on-stage citation line. Same budget as phenology.js's version, and for
 * the same hard reason: a portrait screen shows only viewBox x 330-1270, and
 * sourceNote() renders at font-size 15 - roughly 120 characters of Inter.
 *
 * THE BUDGET: claim <= ~115 characters, cite on its own line beneath it. Never
 * concatenate the two.
 */
export function citeFigure(key) {
  const f = FIGURES[key];
  const s = studyFor(key);
  return `${f.scopeShort} · ${s.cite}`;
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
 * than the paper. Everything in this file is currently `read`, so this always
 * returns null - it is here so that adding a `secondary` study later cannot
 * silently ship without its caveat.
 */
export function caveatFor(key) {
  const s = studyFor(key);
  if (s.provenance !== 'secondary') return null;
  return (
    `This figure is reported by <em>${s.title}</em> (${s.authors.split(',')[0]} et al., ` +
    `${s.year}). The paper is paywalled and we have not read it - the number comes from a ` +
    `summary, which may be less precise than the paper itself.`
  );
}
