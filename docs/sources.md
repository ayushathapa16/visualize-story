# Sources

Every paper and dataset this piece stands on, with what each one can actually give us.

## How to read the tags

| Tag | Meaning |
|---|---|
| ✅ **verified** | Someone opened it and read it. Safe to cite. |
| 🟡 **secondary** | The paper is paywalled and **has not been read.** Its figures here come from the publisher's or the authors' institutional press release. A release is a summary written for journalists; it can round, simplify or drop the qualifier that makes a number true. **Anything drawn from a 🟡 source is at higher risk of being wrong than anything drawn from a ✅ one.** |
| ⚠️ **lead only** | Found via a search result. **Nobody has read it, and no figure has been taken from it.** Read it before citing it. |

> **The rule:** citing a paper nobody on this team has read is worse than citing fewer papers.
> Everything starts at ⚠️ and is promoted to ✅ only after someone reads it and writes the real
> finding into the "gives us" column.
>
> **The one exception, and it was a deliberate call (2026-07-27):** Probst et al. 2026 (§F4) is
> the best-matched source this piece will ever have - southern Ontario, Tree Swallows, insects
> and lay dates in one paper - and PNAS serves it behind a 403. It is cited from its press
> coverage under the 🟡 tag rather than left out. That was chosen with the risk understood. It
> is not a precedent: 🟡 is for a source of that calibre that cannot be obtained, not a shortcut
> around reading something that can. **If anyone gets institutional access, read it and either
> promote it to ✅ or correct what is on screen.**

---

## 0. THE SOURCE — Scenes 29, 30 and 31 all come from this one

✅ **verified** — read in full 2026-07-26, and every number below was recomputed from its
published data by `scripts/build-data.py` on that date.

**Filazzola A, Johnson MTJ, Barrett K, Hayes S, Shrestha N, Timms L, MacIvor JS (2024).
"The great urban shift: Climate change is predicted to drive mass species turnover in cities."
PLOS ONE 19(3): e0299217.** CC BY 4.0.
DOI: https://doi.org/10.1371/journal.pone.0299217
Data + code: https://github.com/afilazzola/GreatUrbanShift

MaxEnt species-distribution models for 2,019 terrestrial animal species across the 60 largest
Canadian and US cities, using GBIF occurrence records and ClimateNA climate. Historic climate
1990–2020; futures for 2041–2060 and 2081–2100 under SSP1-2.6, SSP3-7.0 and SSP5-8.5, over a
CMIP6 ensemble.

### What it gives us

| We need | It has |
|---|---|
| Toronto | One of the cities. 20×20 km quadrat, **888** modelled species. |
| Scene 29's chart | **Fig 1** — gains and losses per city, by SSP. Toronto: **159–360 gained, 40–195 lost**; the text calls it "22% species loss and 41% species gained". |
| Scene 30's chart | 354 modelled Toronto birds (`Class == Aves`), suitability at 3 time points × 3 SSPs. |
| Scene 31's chart | The IUCN Red List assessments bundled in the repo under `data/IUCN/`. |
| The 2081 endpoint | Its future window is literally 2081–2100. |
| Toronto temperature | ClimateNA mean annual temperature: **8.06 °C now → 11.04 °C (SSP1-2.6) or 16.32 °C (SSP5-8.5)** by 2081–2100. |

### THE MOST IMPORTANT CORRECTION: this is turnover, not migration

The paper models **which species have a suitable climate in a city**. It does not model bird
migration, arrival dates, or flyways. Its single migration sentence is a cited aside about
songbirds moving poleward. **Never label anything derived from this paper "mass migration."**
Say *turnover*, or *which birds can live here*.

### For birds specifically, Toronto is a net loss

For Toronto *as a whole* the paper shows a net species **gain**. For **birds** it is a net loss:
at our 0.5 suitability cut, **218 bird species have a suitable Toronto climate today; by
2081–2100 that is 154 (SSP1-2.6), 148 (SSP3-7.0) or 141 (SSP5-8.5)** — ~127–139 lose their
climate and only ~62–63 gain one.

### Willow's own species is not in the model

**Tree Swallow (`Tachycineta bicolor`) is not modelled for Toronto.** Neither is **Common Loon**
(`Gavia immer`) nor **Barn Swallow** (`Hirundo rustica`). All were dropped by the paper's
AUC < 0.70 quality filter. Of the six cast birds only three carry numbers:

| Bird | today | 2081 SSP1-2.6 | 2081 SSP5-8.5 |
|---|---|---|---|
| Bobolink | 0.75 | 0.30 | 0.15 |
| Wood Thrush | 0.65 | 0.08 | 0.04 |
| Canada Jay | 0.34 | 0.10 | 0.06 |

**Do not substitute a congener for Willow and do not invent a figure for her.** The absence is
reported on the card instead — it is honest, and it is data.

The same filter drops Black-capped Chickadee, Northern Cardinal, American Robin, Blue Jay,
Dark-eyed Junco, Red-bellied Woodpecker and Northern Mockingbird. Don't put them back.

### Caveats the site must keep saying

- Values are **predicted occurrence / climate suitability (0–1), not bird counts.** The paper is
  explicit that this is climate suitability alone — it ignores dispersal, species interactions
  and habitat.
- The paper models **three time windows**, not a yearly series. Any 2026–2081 axis is linearly
  interpolated between them, and every chart drawn on one says so.
- **Presence threshold:** the paper's per-species MaxEnt threshold is not in the repo, so our
  species-count charts use a **0.5 cut of our own**. Headline numbers come from the paper's own
  table (888 / 159 / 40 / 360 / 195), never from our cut.
- **`AppendixTable2.csv` has 56 cities, not the 60 the paper models.** Scene 29's chart says 56.
- **The published data contradicts itself on the middle scenario:** `climateProjections.csv`
  models `ssp370`, while `AppendixTable2.csv` and Fig 1 report `ssp245`. We don't reconcile them
  — each chart is keyed to whatever its own source file says.

Regenerate the vendored data with `python3 scripts/build-data.py`. It **asserts** on
888 / 159 / 40 / 360 / 195 / 354 / 218 / 154 / 141 / 6 VU / 18 NT / 138 decreasing. If an assert
fires, the upstream data moved — stop and re-verify. Do not relax the assert.

---

## 0b. The IUCN layer — Scene 31

✅ **verified** — computed from `data/IUCNspeciesList.csv` and `data/IUCN/assessments.csv` in the
repo above, 2026-07-26.

**IUCN Red List of Threatened Species.** https://www.iucnredlist.org
Terms of use: https://www.iucnredlist.org/terms/terms-of-use

Of the 354 modelled Toronto birds:

| | |
|---|---|
| Least Concern | 294 |
| Near Threatened | 18 |
| **Vulnerable** | **6** |
| Not assessed | 36 |
| **Population decreasing** | **138** (98 increasing, 61 stable, 57 unknown) |
| IUCN `systems` | Terrestrial 317 · Freshwater 147 · Marine 108 (species can hold more than one) |

The six Vulnerable: Snowy Owl (*Bubo scandiacus*), Chimney Swift (*Chaetura pelagica*), Rusty
Blackbird (*Euphagus carolinus*), Long-tailed Duck (*Clangula hyemalis*), Evening Grosbeak
(*Hesperiphona vespertina*), Horned Grebe (*Podiceps auritus*) — all Decreasing.

**Two rules for this layer:**

1. **Attribute it to IUCN, not to the paper.** It ships alongside the paper's data; it is not
   one of the paper's findings.
2. The paper's own caveat must travel with it: *at-risk species as identified by the IUCN Red
   List were not necessarily more vulnerable to climate change* — they already have populations
   in decline from other stressors.

We ship **aggregate counts plus one attributed habitat sentence per cast species**. The 28 MB
`assessments.csv` is read at build time and never vendored.

### Habitat — what we can and cannot say

**The paper has no habitat classification at all** — no wetland/forest/grassland breakdown, and
Figs 1–3 are city-level gains and losses only. The only habitat evidence available is IUCN's:
the clean `systems` field (Terrestrial / Freshwater / Marine, complete for all 354) and prose
`habitat` text that is present for some species and empty for others — including, awkwardly,
Tree Swallow. Anything about *where* these birds live is IUCN's claim, and the label says so.

---

## C. Range shift — Scene 27

✅ **verified** for the national figures below (they appear in plain text on the page);
⚠️ **unread** for anything province-level.

**Audubon, *Survival by Degrees: 389 Bird Species on the Brink* (2019).**
https://www.audubon.org/climate/survivalbydegrees
Ontario page: https://www.audubon.org/climate/survivalbydegrees/state/ca/on

These four are on screen in Scene 27 and live in `SCENARIOS` in `src/components/climate.js`:

- **389 of 604** North American species vulnerable at **+3 °C**
- **76%** of vulnerable species are better off at **+1.5 °C**
- **~150** species would no longer be vulnerable at +1.5 °C
- The modelled scenarios are **+1.5 / +2.0 / +3.0 °C**

**There is no 1.2 °C figure in Audubon.** Re-checked 2026-07-26: Audubon models +1.5, +2.0 and
+3.0 only. If you see 1.2 °C in a brief, it is not from here.

**Ontario's own numbers are not quotable.** The province page serves its figures through an
interactive widget that is not scrapeable — re-confirmed 2026-07-26, the fetch returns no
numbers at all. That is why the Scene 27 bird cards carry no Audubon statistic on their face.

---

## B. Migration phenology — Scene 20's argument

Scene 20's phenological-mismatch argument is **not** supported by the Filazzola paper — do not
attach its numbers to that scene. One paper here has now been read; the rest have not.

### B1. The one that has been read — Scene 20's drawer

✅ **verified** — read in full 2026-07-27.

**Mayor SJ, Guralnick RP, Tingley MW, Otegui J, Withey JC, Elmendorf SC, Andrew ME, Leyk S,
Pearse IS, Schneider DC (2017). "Increasing phenological asynchrony between spring green-up
and arrival of migratory birds." *Scientific Reports* 7: 1902.**
DOI: https://doi.org/10.1038/s41598-017-02045-z
Open access: https://pmc.ncbi.nlm.nih.gov/articles/PMC5432526/

| We need | It has |
|---|---|
| A measured mismatch trend | The interval between bird arrival and spring green-up widened by **0.575 ± 0.512 days per year** across all species — the abstract's phrasing is "over half a day per year". |
| Scope | **48** North American songbird species, **2001–2012**, from eBird observations and MODIS satellite green-up. |
| How general it is | **9 of 48** species showed a statistically significant increasing interval. The seven with increasing positive intervals averaged 0.630 days/yr. |

**What it does NOT give us, and the labels in `MISMATCH.facts` say so on their face:**

- **It is green-up, not insects.** The authors state plainly that green-up "is not a direct
  measure of food availability", and note it has not been established whether edible arthropod
  biomass generally declines later in spring. Scene 20 animates insect peak vs chick demand.
  Same mechanism, **different measurement** — never let the label drift into the second one.
- **Tree Swallow is not in it.** It is 48 songbird species and Willow's is not among the
  results. Do not imply the figure is hers.
- **No demographic consequence.** "Specific demographic and ecosystem consequences of these
  trends remain unknown." Nothing here says how many chicks a mismatch costs.
- Only 12 years, and the arrival data is citizen science with the usual effort variation.

### B2. Still ⚠️ lead only — titles captured, none opened

| Paper | Link | Access checked 2026-07-27 |
|---|---|---|
| *Decoupling of bird migration from the changing phenology of spring green-up* (PNAS) | https://www.pnas.org/doi/10.1073/pnas.2308433121 | **403** — not readable |
| Zimova et al. 2021, *Widespread shifts in bird migration phenology are decoupled from parallel shifts in morphology* | https://www.wingerlab.org/uploads/3/7/0/9/37099457/zimova_etal_2021_jae.pdf | 200 — readable, unread |
| Ralston et al. 2025, *Full Annual Cycle Drivers of Phenology in a Migratory Bird* | https://onlinelibrary.wiley.com/doi/10.1111/ddi.70099 | **403** — not readable |
| *The impacts of climate change on the annual cycles of birds* | https://pmc.ncbi.nlm.nih.gov/articles/PMC2781852/ | 200 — readable, unread. A review; good for mechanism prose, weak for a figure. |

### B3. The best remaining lead, and it is a strong one

⚠️ **lead only.** Found as reference 52 of Mayor et al. above, so the citation is exact even
though nobody here has read the paper.

**Winkler DW, Luo MK, Rakhimberdiev E (2013). "Temperature effects on food supply and chick
mortality in tree swallows (*Tachycineta bicolor*)." *Oecologia* 173: 129–138.**
DOI: https://doi.org/10.1007/s00442-013-2605-z

This is **Tree Swallows, insect food supply and chick mortality in one paper** — the exact
combination Scenes 11, 20, 23 and 24 all lean on and none of them can currently cite. Springer
redirects to an auth wall (checked 2026-07-27), so it needs library access rather than a
fetch. **Highest-value unread source in this file.** It may also be the real paper behind the
quarantined Long Point claim in section E.

---

## F. Tree Swallow phenology — Scenes 11, 13, 20, 21, 22 and 24

**This section is why the emotional half of the piece is no longer uncited.** Every earlier pass
searched the *phenology* literature (green-up vs arrival, §B) and concluded that nothing in it
was about Willow. That was true of the papers it found and false of the field: searching the
**tree swallow** literature directly turns up work that is about this exact species, this exact
mechanism - insects, temperature, lay dates, chick survival - and in one case this exact province.

One caution that governs all of it: **these studies are in New York State, not Toronto**, except
§F4, which is southern Ontario. Every label built from them says where it was measured. Ithaca is
about 500 km from Toronto on the far side of Lake Ontario, in a comparable climate with the same
species; that is a reasonable thing to show a Toronto reader and a dishonest thing to call a
Toronto measurement.

### F1. Winkler, Luo & Rakhimberdiev 2013 — the insect/temperature threshold

✅ **verified** — read in full 2026-07-27 via PMC.

**Winkler DW, Luo MK, Rakhimberdiev E (2013). "Temperature effects on food supply and chick
mortality in tree swallows (*Tachycineta bicolor*)." *Oecologia* 173: 129–138.**
DOI: https://doi.org/10.1007/s00442-013-2605-z
Open access: https://pmc.ncbi.nlm.nih.gov/articles/PMC3751296/

| We need | It has |
|---|---|
| Why the sky empties when it turns cold | Flying-insect abundance tracks daily maximum temperature and **peaks at 18.5 °C** - the peak of a GAM of insect abundance on temperature. |
| A definition of "cold snap" | Consecutive days whose maximum temperature stays below that critical value. The paper tests runs of **one, two and three** days. |
| What it costs | **About 1 year in 3** in upstate New York is a high-mortality year in which **fewer than half** of nesting attempts fledge even one chick. |
| Scope | Tompkins County (Ithaca), New York. Swallows 1986–2011; daily insect sampling from 1989. 2,361 chicks from 554 nests; brood-level analysis over 2,261 nests. |

**What it does not give us:** no provisioning rate. It does not say how many insects a brood eats
in a day, and Scene 11 no longer claims one.

### F2. Shipley et al. 2020 — the trap that earlier laying walks into

✅ **verified** — read in full 2026-07-27. PNAS returns 403, but the University of Konstanz
repository serves the accepted PDF, which was downloaded and converted to text:
`https://kops.uni-konstanz.de/server/api/core/bitstreams/12cda561-8c2e-4edc-a50c-4e26128355a9/content`

**Shipley JR, Twining CW, Taff CC, Vitousek MN, Flack A, Winkler DW (2020). "Birds advancing lay
dates with warming springs face greater risk of chick mortality." *PNAS* 117(41): 25590–25594.**
DOI: https://doi.org/10.1073/pnas.2009864117

| We need | It has |
|---|---|
| Scene 13's trend | Tree swallows have advanced egg laying by **~3 days per decade**, and in New York **by ~13 days from 1972 to 2015** (F₁,₃₆ = 28.1, P < 0.001, adj. R² = 0.42). |
| Observed spring warming | Mean *annual* temperature at Ithaca rose only **0.51 °C** (1989–2015 vs 1963–1988) - but during **May to early June, when the swallows lay, it rose 1.9 °C**, nearly fourfold. |
| Scene 21's trade-off | The cost of laying early. Nestlings hatched since 2011 run **nearly twice** the risk of meeting a cold snap as those hatched in the 1970s - **11.5% → 19.6%**, once every ten years becoming once every five. |
| Scene 22's cold snap | Below **18.5 °C** fewer chicks fledge; a 3 °C drop from **18.5 to 15.5 °C halves** the number fledged. Even a **1–2 day** event below 18.5 °C can cut offspring survival by **more than 50%**. |
| What a mistimed spring costs | Nests hatching *after* the year's last cold snap fledge **3.78 ± 0.50** chicks; those hatching before it, **2.67 ± 0.43** - about one chick. Complete nest failures rose from **15.8% to 33.2%** (1989→2015). On and around 9 June 2016, **71% of all nests failed completely** as the daytime maximum fell to 14.3 °C. |
| Scope | Two sites <35 km apart near Ithaca, New York, **43 years, 1972–2015**; **11,236 chicks from 2,041 nests**; daily aerial-insect biomass 1989–2014. |

**The finding that stops this being a simple story, and it must survive into the frames:** the
cold snaps have *not* got worse. Their seasonal pattern below 18.5 °C is unchanged over the past
125 years, and the insect dataset shows **no long-term trend over 25 years**. What changed is
*when the chicks are there.* The birds moved; the cold snaps did not. That is the mechanism, and
it is more interesting than "everything is declining".

### F3. Dunn & Winkler 1999 — the long baseline

✅ **verified** — read 2026-07-27 via PMC.

**Dunn PO, Winkler DW (1999). "Climate change has affected the breeding date of tree swallows
throughout North America." *Proc. R. Soc. B* 266(1437): 2487–2490.**
DOI: https://doi.org/10.1098/rspb.1999.0950
Open access: https://pmc.ncbi.nlm.nih.gov/articles/PMC1690485/

**3,450 nest records, 1959–1991, across the North American range: laying date advanced by up to
nine days**, associated with rising surface air temperature at the time of breeding, after
controlling for latitude, longitude, breeding density and elevation. Shipley et al. restate this
as "9 d between 1950 and 1990" when citing it; we quote the paper's own window, 1959–1991.

Use it for the **continental baseline**; use F2 for the New York trend. They are consistent -
F2 explicitly describes the New York rate as an acceleration of this one - but they are different
measurements and the labels keep them apart.

### F4. Probst et al. 2026 — southern Ontario, and the one we could not read

🟡 **secondary** — PNAS returns 403 (checked 2026-07-27). Every figure below comes from the
University of Michigan press release, the CBC report and the journal's own listing page. **Nobody
here has read the paper.** See the exception noted under "How to read the tags".

**Probst C, Yanco S, Clark I, Ziebell M, Fuirst M, Mackenzie SA, Ibáñez I (2026). "Resource
declines shape phenological and morphological responses to climate change." *PNAS* 123(26):
e2607714123.** DOI: https://doi.org/10.1073/pnas.2607714123

| We need | Reported |
|---|---|
| Ontario, this species | **Long Point Bird Observatory, southern Ontario.** Tree swallow records **1969–2024**; insect data **1977–2011**. |
| Scene 24's claim | Insect biomass fell **62%** between 1977 and 2011. |
| Scene 20's claim | The gap between tree swallow breeding and peak insect emergence has widened by **more than 3 days per decade since 1977**. |
| Consequence | Nestlings lighter and fewer young produced in low-insect years; adults smaller as insect availability fell. No percentage is given for either in the coverage. |

#### A second secondary account, and it does not agree with the first

⚠️ **Recorded 2026-07-27.** Birds Canada — who *run* the Long Point nest-box program the paper is
built on — published their own account of it:
https://www.birdscanada.org/55-years-of-tree-swallow-monitoring-sheds-light-on-the-consequences-insect-decline
(8 July 2026). It gives the program's own scope, which the press release did not: monitoring from
**1973**, ~**200 nest boxes**, 200+ volunteers.

**It states the insect decline as "50% loss of insect biomass over 50 years."** The University of
Michigan release says **62% between 1977 and 2011**. Same paper, two secondary accounts, two
numbers — and nobody here can open the paper to see which one it says.

**How this is handled, and why:** Scene 24 keeps **62%** and keeps its window on its face
(`1977-2011`), because that is the more specific of the two claims and it is the one whose scope we
can state. The 50%/50-year figure is recorded here so the disagreement is visible, and is **not**
averaged with the other — the same policy §0 applies to the paper's own ssp245/ssp370 contradiction.
This is precisely the failure mode the 🟡 tag exists to warn about: two press summaries of one
unread paper do not agree, and neither can be checked. **If anyone gets access, this is the first
thing to resolve.**

**A real tension to keep visible, not smooth over:** F2's insect record (Ithaca, 1989–2014) shows
**no long-term decline**, while this one reports 62% at Long Point over a longer window from 1977.
Different sites, different periods, different sampling. **We do not reconcile them** - the same
policy this file already applies to the paper's own ssp245/ssp370 contradiction. Each figure is
labelled with where and when it was measured, and no frame implies one is the general case.

Not to be attributed to this paper: the press coverage links the insect decline to neonicotinoid
use in the 1990s and states the decline is *not* explained by rising temperature. That is a causal
claim, from a release, about a paper nobody here has read. **It is not on the site.**

---

## G. Context — the scenes that are not about Willow (1, 2, 14, 18, 22, 23, and the thermometer)

**Why this section exists.** §F made the emotional middle of the piece citable. It left the two
ends uncited: Act I asserted things about migration and Act VII asserted things about gardens, and
neither had a source. These are not tree swallow phenology, so they do **not** go in
`phenology.js` — they live in `src/data/context.js`, same discipline, same `provenance` field.

**The scope rule from §F applies here too, and harder.** None of this is a Toronto measurement.
One is Ontario-wide (G1), two are continental (G2, G3), one is global (G4), one is Washington DC
(G5). Every label on screen says which.

### G1. Canada's Changing Climate Report 2019 — the only regional climate measurement in the piece

✅ **verified** — Chapter 4 read 2026-07-27. https://changingclimate.ca/CCCR2019/chapter/4-0/

**Bush E, Lemmen DS, eds. (2019). *Canada's Changing Climate Report*. Government of Canada,
Ottawa.** Chapter 4, Table 4.1 (observed change in temperature, 1948–2016).

| We need | It has |
|---|---|
| Ontario, observed, not projected | **+1.3 °C** annual mean, 1948–2016 |
| The season the story is about | **Spring +1.5 °C.** Winter +2.0, summer +1.1, autumn +1.0 |
| National context | Canada **+1.7 °C** annual (*likely* range 1.1–2.3), roughly double the global rate |

This is what `thermometer.js` had been missing. Its `SCALE_OBSERVED` shipped **numberless** from
2026-07-27 because the "+1 °C / +2 °C" it used to print had no source anywhere in the repo. The
spring figure is the right one for Scene 13: the frame is about spring arriving early, and the
annual mean is not what moved the lay dates.

**Not to be called a Toronto figure.** It is provincial, and it is an observed trend to 2016, not
a projection.

### G2. Rosenberg et al. 2019 — Act VI's missing number

✅ **verified** — full text read 2026-07-27 (PDF mirror, Univ. of Arizona).

**Rosenberg KV, Dokter AM, Blancher PJ, Sauer JR, Smith AC, Smith PA, Stanton JC, Panjabi A,
Helft L, Parr M, Marra PP (2019). "Decline of the North American avifauna." *Science* 366:
120–124.** DOI: https://doi.org/10.1126/science.aaw1313

| We need | It has |
|---|---|
| Scene 28's claim, "one of many" | Net loss of **2.9 billion** breeding birds (95% CI 2.7–3.1 bn), **−29%** (95% CI 27–30%) of 1970 abundance, 1970–2017 |
| **Willow's own guild** | **Aerial insectivores: 26 species, −156.8 million birds, −31.8%** (95% CI −36.4 to −26.1); **73.1%** of those species declining |
| Scope | **529 species**, 76% of the breeding avifauna of the continental US and Canada; Breeding Bird Survey and other standardized surveys |
| Independent corroboration | NEXRAD radar: nocturnal migratory biomass passage down **13.6 ± 9.1%** since 2007 |

**The aerial-insectivore row is the important one** and it is why this paper is worth more to the
piece than the more-quoted 2.9 billion. It is a measured continental decline for the exact
functional group the whole story is about, in a paper that has been read in full.

**What it is not:** an attribution. It is abundance change; it does not say climate caused it, and
neither does the site. It is also not Toronto and not Tree Swallow specifically.

**On the widely-quoted "aerial insectivores −43% since 1970" (State of Canada's Birds 2024):**
⚠️ **lead only** — the landing page redirects to naturecounts.ca and the report PDF was not
obtained. Earlier reports of the same series have been quoted at **59%**, and Birds Canada's own
Long Point page says **43%**. Three numbers, none of them read from the source document. **Not on
the site.** Rosenberg's −31.8% is used instead because it was read.

### G3. Knight et al. 2019 — where Tree Swallows actually spend the winter

✅ **verified** — full text read 2026-07-27 (author copy, Acadia University).

**Knight SM, Gow EA, Bradley DW, Clark RG, Bélisle M, … Norris DR (2019). "Nonbreeding season
movements of a migratory songbird are related to declines in resource availability." *The Auk:
Ornithological Advances* 136: ukz028.** DOI: https://doi.org/10.1093/auk/ukz028

| We need | It has |
|---|---|
| Scene 2's range, correctly | Tree Swallows "spend the nonbreeding season around the **Gulf of Mexico, Florida, Mexico, Central America, and the Caribbean**" |
| Which end Toronto's birds go to | Eastern-flyway birds migrate to **Florida and the Caribbean**; central to the Gulf; western to western Mexico |
| Scope | **133 light-level geolocators**, **12 breeding sites** from Alaska to Nova Scotia to North Carolina |
| The finding | **44%** of individuals made at least one large-scale movement **(301–1,744 km)** *within* the nonbreeding range |

**THE CORRECTION THIS FORCED:** Scene 2 said Tree Swallows "spend the winter in Central and
**South** America." They do not. No part of the species' nonbreeding range is in South America, and
the frame drew a migration line to match. Fixed 2026-07-27. This is the only outright factual
error the source audit found, and it had been on screen since the frame was written.

### G4. van Klink et al. 2020 — the general case behind Long Point's 62%

✅ **verified** — full text read 2026-07-27 (PDF mirror, Harvard Forest).

**van Klink R, Bowler DE, Gongalsky KB, Swengel AB, Gentile A, Chase JM (2020). "Meta-analysis
reveals declines in terrestrial but increases in freshwater insect abundances." *Science* 368:
417–420.** DOI: https://doi.org/10.1126/science.aax9931

| We need | It has |
|---|---|
| Is 62% at one site the general case? | No. Terrestrial insect abundance declines **0.92% per year = −8.81% per decade** on average |
| Scope | **166 long-term surveys, 1,676 sites, 41 countries**, data 1925–2018 (median start 1986, median span 20 years) |
| The caveat the authors lead with | "considerable variation in trends even among adjacent sites"; their estimate is **6-fold smaller** than the high-profile case studies that started the insect-decline alarm |
| The counter-finding | **Freshwater** insects *increased* **+11.33% per decade** |

**Why it is on Scene 24 and not somewhere louder:** it makes the Long Point number smaller, not
bigger, and that is the point. A −62% site figure standing alone reads as the global rate; beside
−8.8%/decade it reads as what it is, one place. Using a source that *weakens* a claim already on
screen is the cheapest honesty this project can buy.

**The freshwater result is deliberately not used to soften Scene 33's wetland action.** "Midges
and mayflies come off water" is a mechanism claim, and a global freshwater abundance trend is not
evidence that a Toronto wetland restoration produces swallow food.

### G5. Narango, Tallamy & Marra 2018 — the one measured number in Act VII

✅ **verified** — read 2026-07-27 via PMC (PMC6233133). PNAS itself returns 403.

**Narango DL, Tallamy DW, Marra PP (2018). "Nonnative plants reduce population growth of an
insectivorous bird." *PNAS* 115(45): 11549–11554.**
DOI: https://doi.org/10.1073/pnas.1809259115

| We need | It has |
|---|---|
| "Plant native" as a measurement, not advice | Chickadee populations were sustained only where nonnative plants were **under 30% of plant biomass** — i.e. **>70% native** |
| The mechanism the story already animates | Yards dominated by nonnative plants have lower arthropod abundance; **caterpillars and spiders both declined as nonnative biomass rose**, and the birds switched to less-preferred prey, produced fewer young, or did not breed at all |
| Scope | **Carolina Chickadee**, residential yards across metropolitan **Washington, DC**; arthropod and diet data 2013–2016, capture-resight 2000–2016, 159 participating yards |
| The authors' own framing | Nonnative-landscaped properties "function as population sinks for insectivorous birds" |

**Not a Tree Swallow, not Toronto, and not an aerial insectivore** — a resident, foliage-gleaning
bird whose chicks eat caterpillars, not flying insects. Scene 32's label says Carolina Chickadee
and says Washington DC. It is evidence that the native-plant → insect → bird chain has been
measured end to end in a residential yard; it is not evidence about Willow's own food supply.

### G6. Read, and deliberately not used

- **Gow EA, et al. (2019). "Effects of Spring Migration Distance on Tree Swallow Reproductive
  Success Within and Among Flyways." *Front. Ecol. Evol.* 7: 380.**
  https://doi.org/10.3389/fevo.2019.00380 — ✅ read 2026-07-27. 89 birds (46 F, 43 M), 8 breeding
  sites, 2010–2014. Females fledged **1.3 fewer young for every 1,017 km** of spring migration, a
  within-flyway carry-over effect. A genuinely good figure that no frame currently has room for —
  Scene 2 is about the journey, not its cost, and putting a fledging penalty there would pre-empt
  Act V. **Parked here on purpose, not overlooked.**
- **Simons et al. (2025). "Radar revelations: insect availability influences parental provisioning
  in breeding tree swallows." *J. Avian Biol.* e03333** — ⚠️ **lead only**, returns **402 Payment
  Required** (checked 2026-07-27). Would be the provisioning-rate source Scene 11 and Scene 12 both
  lack. Not cited.
- **Popular provisioning figures** ("6,000–7,000 insects a day", "10–20 deliveries an hour") appear
  on hobbyist nest-box sites with no citation attached. **Not on the site**, for the same reason
  the same claim was cut from Scene 11 in the first place.

---

## D. Toronto observation data — not yet used

**Tommy Thompson Park Bird Research Station (TTPBRS)** — daily estimated totals per species,
2003–present, published by Birds Canada as `CMMN-DET-TTPBRS`:
https://naturecounts.ca/nc/cmmn/datasets.jsp?code=CMMN-DET-TTPBRS

**eBird Basic Dataset** — more authoritative, but needs a request form and manual approval:
https://science.ebird.org/en/use-ebird-data/download-ebird-data-products

**GBIF occurrence API** — open, no key, re-serves eBird records:
https://techdocs.gbif.org/en/openapi/v1/occurrence

---

## E. Quarantine — claims we cannot use

**"63 years of data, 96 Canadian migrant species, 27 with significantly shifted arrival dates."**
Arrived via a Nature Canada summary; the underlying paper was never located. Tempting, and
embarrassing to be asked about. Not on the site.

**Long Point, Ontario tree swallow / insect-collapse figures.** ~~Source returned HTTP 403 and the
numbers could not be verified first-hand.~~ **RESOLVED 2026-07-27 — the paper is Probst et al.
2026, PNAS 123(26): e2607714123. It is now §F4.** It is still not readable, so it carries the 🟡
secondary tag rather than ✅; what changed is that the citation is now exact instead of a rumour
with no paper attached. Read it if you ever get access.

---

## Where these get used in the code

- `src/data/torontoBirds.js` — **GENERATED** by `scripts/build-data.py`. Nothing else fetches.
- `src/data/phenology.js` — **hand-maintained**, and the home of everything in §F. Figures from
  papers rather than from a downloadable dataset, so no script can generate it. Every entry names
  what was **measured** and carries its study's `provenance` (`read` or `secondary`), so a 🟡
  figure can never be mistaken for a ✅ one from the code alone.
- `src/data/context.js` — **hand-maintained**, and the home of everything in §G: the figures that
  are not about Willow (Ontario climate, continental bird abundance, global insect trends, native
  plants). Same shape and same rules as `phenology.js`; kept separate because that module's header
  is a promise about what is inside it.
- `src/data/sources.js` — the prose, the per-species facts and every citation the panels render.
- `src/components/climate.js` — `SCENARIOS`, the Audubon figures, their single home.
  **Two unsourced numbers live here and must not reach the screen:**
  1. `SCENARIOS.treeSwallowRangeLossAt3 = 0.43`, carrying only an inline "(Climate Central)"
     comment — no document, no year, no URL, and Climate Central is not Audubon, whose figures the
     rest of `SCENARIOS` holds. **Unused on screen; do not use it.** Verify or delete.
  2. The `RANGES` array's `loss15`/`loss30` per species — no attribution at all. They drive only
     the *shape* of the illustrative blobs, which is allowed, but `ontarioMap()` is unused and must
     not be wired into a frame while those values are unverified. See section C — Audubon's Ontario
     page, the natural source, is not scrapeable.
- `src/components/thermometer.js` — `SCALE_OBSERVED` deliberately carries **no numbers**.
  It printed "+1 °C"/"+2 °C" until 2026-07-27 with no source anywhere in the repo. Only
  `SCALE_SCENARIOS`, whose values are Audubon's (section C), states degrees.
- `src/components/chart.js` — every chart carries `sourceNote()` **on the stage**, not in a
  drawer. A chart without a visible citation is a bug.
