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
// TODO(author): the `sources` and `facts` arrays below are intentionally EMPTY,
// awaiting the citations and per-species figures you said you'd supply.
//
// Empty is the safe state, and it is load-bearing: panel.js omits any empty
// `facts`/`sources` block entirely, so the drawers currently render their prose
// and nothing else. Do not fill them with plausible-looking placeholders - a
// placeholder in a citation list is indistinguishable from a fact. Fill them in
// here and every scene picks them up.
// ---------------------------------------------------------------------------
// ============================================================================

import { SCENARIOS } from '../components/climate.js';

export { SCENARIOS };

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
  ],
  /** @type {{label:string,value:string}[]} */
  facts: [], // TODO(author)
  /** @type {{title:string,authors?:string,year?:string|number,url?:string}[]} */
  sources: [], // TODO(author)
};

/**
 * Scene 17 - the birds of Toronto.
 *
 * `outlook` is DIRECTIONAL only ('contracts' | 'shifts-north' | 'stable' |
 * 'mixed') and is used to drive the card's illustration, never printed as a
 * statistic. `blurb` is qualitative prose. Per-species Ontario projections sit
 * behind an interactive widget on Audubon's site that isn't scrapeable, which is
 * why nothing numeric appears here until it's supplied by hand.
 *
 * `name` must match the entries in components/birdCards.js NEIGHBOURS.
 */
export const SPECIES = [
  {
    name: 'Tree Swallow',
    outlook: 'shifts-north',
    blurb:
      'An aerial insectivore, and Willow’s own species. Its fortunes are tied less to temperature than to the flying insects that temperature governs.',
    facts: [], // TODO(author)
    sources: [], // TODO(author)
  },
  {
    name: 'Bobolink',
    outlook: 'contracts',
    blurb:
      'A grassland bird of southern Ontario’s hayfields, and one of the longest migrations of any songbird in the Americas.',
    facts: [],
    sources: [],
  },
  {
    name: 'Canada Jay',
    outlook: 'contracts',
    blurb:
      'A boreal resident that caches food through the winter and depends on the cold to keep that cache from spoiling. A warmer winter is not a milder one for this bird.',
    facts: [],
    sources: [],
  },
  {
    name: 'Common Loon',
    outlook: 'shifts-north',
    blurb:
      'The voice of Ontario’s lakes. It needs clear, cool, fish-bearing water within reach of a nesting shoreline.',
    facts: [],
    sources: [],
  },
  {
    name: 'Wood Thrush',
    outlook: 'contracts',
    blurb:
      'A forest-interior singer whose breeding range is projected to move away from the deciduous woodlands it currently depends on.',
    facts: [],
    sources: [],
  },
  {
    name: 'Barn Swallow',
    outlook: 'mixed',
    blurb:
      'Another aerial insectivore, and a neighbour in the most literal sense - it nests on the buildings people put up.',
    facts: [],
    sources: [],
  },
];

/** Look up a species' panel content by card name. */
export function speciesByName(name) {
  return SPECIES.find((s) => s.name === name) || null;
}

/**
 * Scene 21 - what actually helps. Each is an action a person in Toronto can
 * take; the claim attached to each is mechanistic (it produces insects, or
 * habitat), not a quantified outcome.
 */
export const ACTIONS = [
  {
    id: 'native',
    title: 'Plant native',
    body: 'Native plants host the insects that native birds evolved to eat. An ornamental lawn feeds almost nothing.',
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
