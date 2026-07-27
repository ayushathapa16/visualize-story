// ============================================================================
// sources.js - everything the story *asserts*, in one file.
//
// Scenes read from here; no frame hardcodes a figure or a citation. The rule the
// project has always followed still holds: we do not state a number the sources
// don't support. The Ontario map geometry, the range blobs and the song bars are
// all illustrative - they show what the numbers mean, and only the numbers get
// quoted.
//
// The continental warming figures are NOT restated here. They live in
// `SCENARIOS` in components/climate.js, which is their single home, and are
// re-exported below so scenes have one import.
//
// ---------------------------------------------------------------------------
// The `facts` and `sources` arrays below used to ship EMPTY, waiting on data.
// They are now filled - but only from `data/torontoBirds.js`, which is generated
// by `scripts/build-data.py` from the published dataset and asserts on its own
// headline numbers. Nothing here is typed in by hand.
//
// Empty is still the safe state, and it is still load-bearing: panel.js omits an
// empty `facts`/`sources` block entirely. Where a figure does not exist - and
// for three of the six cast birds it does not - the entry says so in words
// rather than reaching for a plausible-looking number.
// ---------------------------------------------------------------------------
// ============================================================================

import { SCENARIOS } from '../components/climate.js';
import { TORONTO_BIRDS } from './torontoBirds.js';
import { FIGURES, factFor, sourceFor, caveatFor } from './phenology.js';
// The third data module - everything the story leans on that is not tree
// swallow phenology. Aliased so a reader of this file can always tell which
// module a figure came from, and therefore what its scope is.
import { FIGURES as CONTEXT } from './context.js';

export { SCENARIOS };

/** The one citation every data-backed claim in this piece hangs from. */
export const PAPER = {
  title:
    'The great urban shift: Climate change is predicted to drive mass species turnover in cities',
  authors: 'Filazzola A, Johnson MTJ, Barrett K, Hayes S, Shrestha N, Timms L, MacIvor JS',
  year: 2024,
  url: 'https://doi.org/10.1371/journal.pone.0299217',
};

/** The conservation layer. IUCN's assessment, NOT one of the paper's findings. */
export const IUCN = {
  title: 'IUCN Red List of Threatened Species',
  authors: 'International Union for Conservation of Nature',
  url: 'https://www.iucnredlist.org',
};

/**
 * Scene 17's aggregate claim. Kept here so every citation in the piece is in one
 * file, but the FIGURES themselves stay in SCENARIOS (components/climate.js) -
 * one home per number.
 */
export const AUDUBON = {
  title: 'Survival by Degrees: 389 Bird Species on the Brink',
  authors: 'National Audubon Society',
  // The on-stage form. Scene 17's evidence box is a narrow column beside the
  // card grid, and the full name plus subtitle wraps it onto an extra line -
  // which pushes its foot into the caption band on a short viewport. `short`
  // and the pre-colon title together fit one line and still attribute it.
  short: 'Audubon',
  year: 2019,
  url: 'https://www.audubon.org/climate/survivalbydegrees',
};

/**
 * Scene 10 - the "Phenological Mismatch" drawer.
 *
 * The prose is deliberately careful, and matches what Scene 10 animates: the
 * chicks still hatch while insects are around, but the *peak* has moved past
 * them. That is a weaker and more accurate claim than "the overlap disappears".
 */
export const MISMATCH = {
  title: 'Phenological mismatch',
  body: [
    'Phenology is the timing of nature’s recurring events - when a plant flowers, when an insect emerges, when a bird lays its eggs. For most of their history, these events have moved together.',
    'Warming pulls some of them forward faster than others. Insects respond quickly to local temperature; a long-distance migrant like a Tree Swallow is still thousands of kilometres away, reading cues that have not changed as much. She cannot simply leave earlier.',
    'The result is not usually a clean miss. The chicks hatch, and there are insects. But the <em>peak</em> - the few days of abundance that a brood of hungry chicks is built around - has already passed. A mismatch is a matter of degree, and the degree is what decides how many chicks fledge.',
    // The honesty paragraph, and it is why this drawer took so long to fill.
    // The measured evidence below is about GREEN-UP and ARRIVAL. Scene 10
    // animates INSECT PEAK against CHICK DEMAND. Those are the same mechanism
    // but not the same measurement, and the reader is told so rather than being
    // left to assume the figure is Willow's.
    'The figures below measure something adjacent to Willow&rsquo;s problem rather than Willow&rsquo;s problem itself. Mayor et al. tracked the gap between spring green-up and the arrival of 48 North American songbird species - not insect abundance, and not this species. The authors are explicit that green-up is not a direct measure of food availability, and that the demographic consequences of the trend they found are still unknown. It is evidence that the timings are pulling apart. It is not a measurement of how many chicks that costs.',
    // The Long Point figure is the one that IS Willow's problem - same species,
    // same province, breeding timing against insect emergence rather than a
    // proxy for it. It is also the weakest-sourced thing in the piece, and the
    // paragraph after it says so rather than letting the better match hide the
    // worse provenance.
    `Nearer to home, and nearer to the measurement this scene animates: at Long Point on Lake Erie - Tree Swallows, in southern Ontario - the gap between breeding and peak insect emergence has been widening by <strong>${FIGURES.ontarioMismatchRate.value}</strong> since 1977.`,
    caveatFor('ontarioMismatchRate'),
  ].filter(Boolean),
  // NO LONGER EMPTY - Mayor et al. 2017 was read in full on 2026-07-27 and
  // promoted to verified in docs/sources.md section B. Still true, and still the
  // reason nothing from Filazzola appears here: that paper is about climate-
  // driven species turnover, not phenology, and has nothing to say about
  // emergence or laying dates.
  //
  // Every label below states what was actually measured. "Gap between green-up
  // and arrival" is not "gap between insects and chicks", and the label must
  // never quietly become the second one.
  /** @type {{label:string,value:string}[]} */
  facts: [
    { label: 'What was measured', value: 'Days between spring green-up and migratory bird arrival' },
    { label: 'Scope', value: '48 North American songbird species, 2001-2012' },
    { label: 'How fast the gap widens', value: '0.575 ± 0.512 days per year, averaged across species' },
    { label: 'Species with a significant trend', value: '9 of the 48' },
    { label: 'Not measured', value: 'Insect abundance, Tree Swallows, or any effect on fledging success' },
    // From phenology.js, so the label is the study's own `measured` line and
    // cannot drift into describing what this scene is about instead.
    factFor('ontarioMismatchRate', 'Long Point, Ontario - breeding vs insect peak'),
    factFor('ontarioInsectLoss', 'Long Point, Ontario - insect biomass'),
  ],
  /** @type {{title:string,authors?:string,year?:string|number,url?:string}[]} */
  sources: [
    {
      title: 'Increasing phenological asynchrony between spring green-up and arrival of migratory birds',
      authors:
        'Mayor SJ, Guralnick RP, Tingley MW, Otegui J, Withey JC, Elmendorf SC, Andrew ME, Leyk S, Pearse IS, Schneider DC',
      year: 2017,
      url: 'https://doi.org/10.1038/s41598-017-02045-z',
    },
    sourceFor('ontarioMismatchRate'),
  ],
};

/**
 * Per-species facts, built from the generated dataset rather than typed.
 *
 * Three of the six cast birds - Tree Swallow, Common Loon, Barn Swallow - are
 * NOT in the paper's Toronto model. They were dropped by its AUC < 0.70 quality
 * filter, so no suitability figure exists for them, and none is invented. Willow
 * is one of them: the piece's own protagonist has no number, and her card says
 * that plainly. It is a better card for it.
 */
function speciesFacts(name) {
  const c = TORONTO_BIRDS.cast.find((b) => b.name === name);
  if (!c) return { facts: [], sources: [] };

  const facts = [];
  if (c.suitability) {
    facts.push(
      { label: 'Climate suitability today', value: c.suitability.current.toFixed(2) },
      { label: 'By 2081-2100, low emissions', value: c.suitability.ssp126.toFixed(2) },
      { label: 'By 2081-2100, high emissions', value: c.suitability.ssp585.toFixed(2) }
    );
  } else {
    facts.push({
      label: 'Climate suitability',
      value: 'not modelled for Toronto (below the study’s AUC 0.70 quality threshold)',
    });
  }
  facts.push({ label: 'IUCN Red List', value: c.redlistCategory });
  facts.push({ label: 'Population trend', value: c.populationTrend });
  if (c.systems.length) facts.push({ label: 'Systems (IUCN)', value: c.systems.join(', ') });

  const caveat = c.suitability
    ? 'Suitability is a modelled 0-1 score for the climate of a 20&times;20&nbsp;km square over Toronto - not a count of birds, and not a probability of seeing one. It ignores dispersal, habitat and every other species. Filazzola et al. (2024) model three windows; the two future figures are for 2081-2100.'
    : 'This species is <strong>not modelled for Toronto</strong> in Filazzola et al. (2024) - its model fell below the study&rsquo;s AUC 0.70 quality threshold and was dropped. There is no suitability figure for it, so none is shown. Its Red List status below is IUCN&rsquo;s, and is global rather than local.';

  return {
    facts,
    sources: c.suitability ? [PAPER, IUCN] : [IUCN, PAPER],
    habitat: c.habitat,
    caveat,
  };
}

/**
 * Scene 17 - the birds of Toronto.
 *
 * `outlook` is DIRECTIONAL only ('contracts' | 'shifts-north' | 'stable' |
 * 'mixed') and is used to drive the card's illustration, never printed as a
 * statistic. `blurb` is qualitative prose. Audubon's per-species ONTARIO
 * projections are still not quotable - they sit behind an interactive widget
 * that isn't scrapeable - so nothing on a card's face is numeric. What a card
 * opens is the suitability values from the paper, where they exist.
 *
 * The suitability figures are modelled climate suitability (0-1). They are not
 * counts of birds, not probabilities of seeing one, and not a population trend.
 *
 * `name` must match the entries in components/birdCards.js NEIGHBOURS.
 */
export const SPECIES = [
  {
    name: 'Tree Swallow',
    outlook: 'shifts-north',
    blurb:
      'An aerial insectivore, and Willow’s own species. Its fortunes are tied less to temperature than to the flying insects that temperature governs.',
    ...speciesFacts('Tree Swallow'),
  },
  {
    name: 'Bobolink',
    outlook: 'contracts',
    blurb:
      'A grassland bird of southern Ontario’s hayfields, and one of the longest migrations of any songbird in the Americas.',
    ...speciesFacts('Bobolink'),
  },
  {
    name: 'Canada Jay',
    outlook: 'contracts',
    blurb:
      'A boreal resident that caches food through the winter and depends on the cold to keep that cache from spoiling. A warmer winter is not a milder one for this bird.',
    ...speciesFacts('Canada Jay'),
  },
  {
    name: 'Common Loon',
    outlook: 'shifts-north',
    blurb:
      'The voice of Ontario’s lakes. It needs clear, cool, fish-bearing water within reach of a nesting shoreline.',
    ...speciesFacts('Common Loon'),
  },
  {
    name: 'Wood Thrush',
    outlook: 'contracts',
    blurb:
      'A forest-interior singer whose breeding range is projected to move away from the deciduous woodlands it currently depends on.',
    ...speciesFacts('Wood Thrush'),
  },
  {
    name: 'Barn Swallow',
    outlook: 'mixed',
    blurb:
      'Another aerial insectivore, and a neighbour in the most literal sense - it nests on the buildings people put up.',
    ...speciesFacts('Barn Swallow'),
  },
];

/** Look up a species' panel content by card name. */
export function speciesByName(name) {
  return SPECIES.find((s) => s.name === name) || null;
}

/**
 * Scene 23 - what actually helps. Each is an action a person in Toronto can
 * take; the claim attached to each is mechanistic (it produces insects, or
 * habitat), not a quantified outcome.
 *
 * ONE of them is now quantified, and only one. Narango et al. 2018 measured the
 * native-plant chain end to end - plants, arthropods, and whether the birds
 * could raise young - and found a threshold. The other four stay mechanistic,
 * because nothing measured what a Toronto front garden's leaf litter or one
 * restored wetland does for a bird, and a plausible-looking number in those
 * four would undo the credibility the first one buys. The scope travels with
 * the figure: it is a Carolina Chickadee in Washington DC, not Willow.
 */
export const ACTIONS = [
  {
    id: 'native',
    title: 'Plant native',
    // PLAIN TEXT, AND SHORT. frame23.js renders these as SVG <text>, wraps them
    // by hand at ~46 characters and then renders `lines.slice(0, 3)` - anything
    // past three lines is silently dropped, and any HTML tag prints literally.
    // That is why the threshold is here and its citation is not: the citation
    // rides as a sourceNote() on the frame instead, where it has room.
    body:
      'Native plants host the insects native birds evolved to eat. ' +
      `Below ${CONTEXT.nativePlantThreshold.value} native plants, insect-eaters raised fewer young.`,
  },
  {
    id: 'pesticide',
    title: 'Skip the pesticide',
    body: 'An insecticide does exactly what it says. For an aerial insectivore, the insects are the food supply.',
  },
  {
    id: 'leaves',
    title: 'Leave the leaves',
    body: 'Fallen leaves and dead wood are where insects overwinter. Tidying them away in autumn removes next spring’s first hatch.',
  },
  {
    id: 'wetland',
    title: 'Restore wetland',
    body: 'Midges and mayflies come off water. Wetlands are the engine behind the sky Willow feeds in.',
  },
  {
    id: 'monitor',
    title: 'Monitor a nest box',
    body: 'Volunteers at Tommy Thompson Park record what actually happens in the boxes each spring. Long-term records are how any of this became knowable.',
  },
];
