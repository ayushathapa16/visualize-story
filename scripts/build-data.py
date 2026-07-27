#!/usr/bin/env python3
"""Generate src/data/torontoBirds.js from the published GreatUrbanShift dataset.

Run by hand when you want to refresh the vendored data:

    python3 scripts/build-data.py

It downloads the paper's public CSVs, filters them to Toronto, joins the IUCN Red
List assessments that ship alongside them, and writes one ES module. The site
imports that module, so the page itself never fetches anything at runtime.

Sources
-------
Filazzola A, Johnson MTJ, Barrett K, Hayes S, Shrestha N, Timms L, MacIvor JS
(2024) "The great urban shift: Climate change is predicted to drive mass species
turnover in cities." PLOS ONE 19(3): e0299217.   CC BY 4.0
https://doi.org/10.1371/journal.pone.0299217
Data + code: https://github.com/afilazzola/GreatUrbanShift

IUCN Red List of Threatened Species, as bundled in that repo under data/IUCN/.
https://www.iucnredlist.org  (terms of use: https://www.iucnredlist.org/terms/terms-of-use)

TWO THINGS THIS FILE MUST KEEP SAYING
-------------------------------------
1. The values are MaxEnt *predicted occurrence* - climate suitability, 0-1. They
   are not counts of birds and must never be presented as such.
2. The paper is about climate-driven species TURNOVER, not migration. It models
   which species have a suitable climate in a city, not which birds fly where.

WHAT WE DO NOT REDISTRIBUTE
---------------------------
data/IUCN/assessments.csv is 28 MB and carries the IUCN terms of use. We read it
at build time and emit only aggregate counts plus one trimmed, attributed habitat
sentence for the named cast species. The file itself is never vendored.
"""

import csv
import io
import json
import re
import sys
import urllib.request

csv.field_size_limit(1 << 30)

REPO = "https://raw.githubusercontent.com/afilazzola/GreatUrbanShift/main"
CITY = "Toronto"

# The paper's three emission scenarios, in the order we always show them.
SSPS = ["ssp126", "ssp370", "ssp585"]

# The paper reports two future windows. We anchor each to a single year so the
# site can draw a continuous 2026..2081 axis between them.
ANCHOR_YEAR = {"2041-2060": 2050, "2081-2100": 2081}
START_YEAR, END_YEAR = 2026, 2081

# A species counts as "present" when its climate suitability clears this cut.
# The paper used a per-species MaxEnt threshold that isn't published in the repo,
# so this is OUR approximation, and every chart built on it says so on its face.
PRESENCE_CUT = 0.5

# The six birds the story already casts, by the names used in
# components/birdCards.js and data/sources.js. Three of them are NOT in the
# Toronto model - dropped by the paper's AUC < 0.70 quality filter - and that
# absence is itself reported rather than papered over.
CAST = {
    "Tree Swallow": "Tachycineta bicolor",
    "Bobolink": "Dolichonyx oryzivorus",
    "Canada Jay": "Perisoreus canadensis",
    "Common Loon": "Gavia immer",
    "Wood Thrush": "Hylocichla mustelina",
    "Barn Swallow": "Hirundo rustica",
}


# Common names for the Toronto birds IUCN does not rate Least Concern. The
# published data is scientific-name only, and a Red List panel that says
# "Antrostomus carolinensis" tells a reader nothing. These are the standard
# North American common names and nothing else about them is ours - the
# category, trend and year all come from IUCN. The build asserts that this map
# covers the concern list exactly, so a new listing can never appear unnamed.
COMMON = {
    "Alca torda": "Razorbill",
    "Antrostomus carolinensis": "Chuck-will's-widow",
    "Bubo scandiacus": "Snowy Owl",
    "Calidris canutus": "Red Knot",
    "Calidris pusilla": "Semipalmated Sandpiper",
    "Chaetura pelagica": "Chimney Swift",
    "Charadrius melodus": "Piping Plover",
    "Charadrius nivosus": "Snowy Plover",
    "Clangula hyemalis": "Long-tailed Duck",
    "Colinus virginianus": "Northern Bobwhite",
    "Contopus cooperi": "Olive-sided Flycatcher",
    "Egretta rufescens": "Reddish Egret",
    "Euphagus carolinus": "Rusty Blackbird",
    "Hesperiphona vespertina": "Evening Grosbeak",
    "Lanius ludovicianus": "Loggerhead Shrike",
    "Podiceps auritus": "Horned Grebe",
    "Rallus elegans": "King Rail",
    "Selasphorus rufus": "Rufous Hummingbird",
    "Setophaga cerulea": "Cerulean Warbler",
    "Setophaga striata": "Blackpoll Warbler",
    "Somateria mollissima": "Common Eider",
    "Sturnella magna": "Eastern Meadowlark",
    "Vermivora chrysoptera": "Golden-winged Warbler",
    "Zonotrichia querula": "Harris's Sparrow",
}


def fetch(path):
    print(f"  fetching {path}")
    with urllib.request.urlopen(f"{REPO}/{path}") as r:
        # Montreal/Quebec carry a stray non-UTF-8 byte; we don't need those rows.
        return list(csv.DictReader(io.StringIO(r.read().decode("utf-8", "replace"))))


def lerp(a, b, t):
    return a + (b - a) * t


def yearly(anchors):
    """Piecewise-linear series over START_YEAR..END_YEAR through {year: value}."""
    years = sorted(anchors)
    out = {}
    for y in range(START_YEAR, END_YEAR + 1):
        if y <= years[0]:
            out[y] = anchors[years[0]]
            continue
        for lo, hi in zip(years, years[1:]):
            if lo <= y <= hi:
                out[y] = round(lerp(anchors[lo], anchors[hi], (y - lo) / (hi - lo)), 4)
                break
        else:
            out[y] = anchors[years[-1]]
    return out


def strip_html(s):
    return re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", s or "").replace("&#160;", " ")).strip()


# IUCN habitat text runs on for paragraphs and is peppered with citations. We
# quote exactly one sentence, so the cut has to land on a real sentence end -
# "del Hoyo et al." is not one, and a leading section heading ("Behaviour") is
# not part of the sentence at all.
ABBREV = {"al", "et", "sp", "spp", "cf", "e.g", "i.e", "Dr", "Fig", "No", "ca", "approx"}
HEADINGS = ("Behaviour", "Habitat", "Ecology", "Distribution", "Population")


def first_sentence(s):
    s = strip_html(s)
    for h in HEADINGS:
        if s.startswith(h + " ") and s[len(h) + 1 : len(h) + 2].isupper():
            s = s[len(h) + 1 :]
            break
    for m in re.finditer(r"\.(?=\s|$)", s):
        head = s[: m.start()]
        last = head.split()[-1] if head.split() else ""
        if last.rstrip(".") in ABBREV or len(last.rstrip(".")) <= 1:
            continue          # an abbreviation or an initial, not a sentence end
        if m.end() >= 40:
            return head + "."
    return s[:300].rstrip() + "..." if len(s) > 300 else s


def main():
    print("Downloading GreatUrbanShift data...")
    taxonomy = {r["species"]: r for r in fetch("data/cityData/UpdatedSpeciesList.csv")}
    projections = [r for r in fetch("climateProjections.csv") if r["City"] == CITY]
    appendix2 = fetch("AppendixTable2.csv")
    future_climate = [r for r in fetch("data/futureClimate/futureClimate.csv") if r["City"] == CITY]
    current_climate = [r for r in fetch("data/cityData/climateData.csv") if r["City"] == CITY]
    iucn = {r["species"]: r for r in fetch("data/IUCNspeciesList.csv")}
    assessments = {r["scientificName"]: r for r in fetch("data/IUCN/assessments.csv")}

    # ---- every modelled Toronto bird ---------------------------------------
    birds = {}   # species -> {"current": p, (ssp, window): p}
    for r in projections:
        sp = r["species"]
        if taxonomy.get(sp, {}).get("Class") != "Aves":
            continue
        b = birds.setdefault(sp, {"current": float(r["currentProb"])})
        b[(r["SSP"], r["Year"])] = float(r["meanProb"])
    print(f"{len(birds)} modelled bird species in {CITY}")
    assert len(birds) == 354, len(birds)

    # ---- city-level totals, straight from the paper's own table -------------
    # Careful: the published files disagree with themselves about the MIDDLE
    # scenario. climateProjections.csv models ssp126/ssp370/ssp585, but
    # AppendixTable2.csv reports ssp126/ssp245/ssp585 (and Fig 1's legend agrees
    # with the table: "SSP 2-45"). We do not reconcile them - each chart is keyed
    # to whatever its own source file says, and labelled accordingly.
    city_table = [r for r in appendix2 if r["City"] == CITY]
    city = {"historicSpecies": int(city_table[0]["HistoricSpecies"])}
    city_ssps = []
    for r in city_table:
        city_ssps.append(r["SSP"])
        city[r["SSP"]] = {
            "gains": int(r["gains"]),
            "losses": int(r["losses"]),
            "unchanged": int(r["noChanges"]),
        }

    # These five are quoted in the article text and appear on screen. If the join
    # ever drifts, fail loudly rather than ship a wrong number under a real citation.
    assert city["historicSpecies"] == 888, city["historicSpecies"]
    assert (city["ssp126"]["gains"], city["ssp126"]["losses"]) == (159, 40)
    assert (city["ssp585"]["gains"], city["ssp585"]["losses"]) == (360, 195)

    # ---- all 60 cities, for the Fig 1 recreation ----------------------------
    cities = {}
    for r in appendix2:
        c = cities.setdefault(r["City"], {"historicSpecies": int(r["HistoricSpecies"])})
        c[r["SSP"]] = {"gains": int(r["gains"]), "losses": int(r["losses"])}
    print(f"{len(cities)} cities in AppendixTable2 (Fig 1)")

    # ---- richness across ALL 354 birds --------------------------------------
    richness = {}
    for ssp in SSPS:
        anchors = {START_YEAR: sum(1 for b in birds.values() if b["current"] >= PRESENCE_CUT)}
        for window, year in ANCHOR_YEAR.items():
            anchors[year] = sum(1 for b in birds.values() if b[(ssp, window)] >= PRESENCE_CUT)
        # Lost = present now, gone by then. Gained = absent now, present by then.
        # Counted against today, so both are cumulative by construction.
        lost, gained = {START_YEAR: 0}, {START_YEAR: 0}
        for window, year in ANCHOR_YEAR.items():
            lost[year] = sum(1 for b in birds.values()
                             if b["current"] >= PRESENCE_CUT > b[(ssp, window)])
            gained[year] = sum(1 for b in birds.values()
                               if b["current"] < PRESENCE_CUT <= b[(ssp, window)])
        yrs = range(START_YEAR, END_YEAR + 1)
        richness[ssp] = {
            "now": anchors[START_YEAR],
            "end": anchors[END_YEAR],
            "lostByEnd": lost[END_YEAR],
            "gainedByEnd": gained[END_YEAR],
            "present": [round(yearly(anchors)[y]) for y in yrs],
            "lost": [round(yearly(lost)[y]) for y in yrs],
            "gained": [round(yearly(gained)[y]) for y in yrs],
        }
        print(f"  {ssp}: {anchors[START_YEAR]} birds now -> {anchors[END_YEAR]} in 2081 "
              f"(lost {lost[END_YEAR]}, gained {gained[END_YEAR]})")

    # The headline bird numbers. Verified by hand against the data 2026-07-26.
    assert richness["ssp126"]["now"] == 218, richness["ssp126"]["now"]
    assert richness["ssp126"]["end"] == 154, richness["ssp126"]["end"]
    assert richness["ssp585"]["end"] == 141, richness["ssp585"]["end"]

    # ---- IUCN Red List layer, for the 354 modelled Toronto birds ------------
    # This is IUCN's assessment, NOT a finding of the paper. Every chart drawn
    # from it must attribute it to IUCN.
    categories, trends, systems = {}, {}, {}
    concern = []   # everything that is not Least Concern and not unassessed
    for sp in sorted(birds):
        row = iucn.get(sp, {})
        cat = row.get("redlistCategory") or "NA"
        trend = row.get("populationTrend") or "NA"
        if cat == "NA":
            cat = "Not assessed"
        if trend == "NA":
            trend = "Unknown"
        categories[cat] = categories.get(cat, 0) + 1
        trends[trend] = trends.get(trend, 0) + 1

        a = assessments.get(sp, {})
        for sysname in (a.get("systems") or "").split("|"):
            sysname = sysname.strip().replace("Freshwater (=Inland waters)", "Freshwater")
            if sysname:
                systems[sysname] = systems.get(sysname, 0) + 1

        if cat not in ("Least Concern", "Not assessed"):
            concern.append({
                "name": COMMON.get(sp),
                "latin": sp,
                "category": cat,
                "trend": trend,
                "year": row.get("yearPublished") or None,
                "family": taxonomy.get(sp, {}).get("Family"),
            })
    print(f"  IUCN: {categories}")
    print(f"  trends: {trends}")
    print(f"  systems: {systems}")
    assert categories.get("Vulnerable") == 6, categories
    assert categories.get("Near Threatened") == 18, categories
    assert trends.get("Decreasing") == 138, trends
    # Every listed bird must have a common name, or the Scene 21 panel shows a
    # reader a bare binomial. Fails loudly if IUCN reclassifies anything.
    unnamed = [c["latin"] for c in concern if not c["name"]]
    assert not unnamed, f"no common name for: {unnamed}"
    concern.sort(key=lambda c: ({"Vulnerable": 0, "Near Threatened": 1}[c["category"]], c["name"]))

    # ---- the six cast birds -------------------------------------------------
    # Three of them are absent from the model. That absence is data too, and it
    # is the reason no per-species number can ever be shown for Willow herself.
    cast = []
    for common, sci in CAST.items():
        row = iucn.get(sci, {})
        a = assessments.get(sci, {})
        entry = {
            "name": common,
            "latin": sci,
            "modelled": sci in birds,
            "redlistCategory": (row.get("redlistCategory") or "Not assessed").replace("NA", "Not assessed"),
            "populationTrend": (row.get("populationTrend") or "Unknown").replace("NA", "Unknown"),
            "redlistYear": row.get("yearPublished") or None,
            "systems": [s.strip().replace("Freshwater (=Inland waters)", "Freshwater")
                        for s in (a.get("systems") or "").split("|") if s.strip()],
            "habitat": first_sentence(a.get("habitat")) or None,
        }
        if sci in birds:
            b = birds[sci]
            entry["suitability"] = {
                "current": round(b["current"], 3),
                "ssp126": round(b[("ssp126", "2081-2100")], 3),
                "ssp585": round(b[("ssp585", "2081-2100")], 3),
            }
        cast.append(entry)
        state = "modelled" if entry["modelled"] else "NOT modelled (AUC < 0.70 filter)"
        print(f"  {common:14} {state}")

    # ---- mean annual temperature, also from the paper's climate files -------
    temperature = {"now": round(float(current_climate[0]["wc2.1_2.5m_bio_1"]), 2)}
    for ssp in SSPS:
        vals = [float(r["bio1"]) for r in future_climate
                if r["SSP"] == ssp and r["Year"] == "2081-2100"]
        temperature[ssp] = round(sum(vals) / len(vals), 2)   # mean across the GCM ensemble
    print(f"  temperature: {temperature}")

    # On screen since Scene 19 gained its "what SSP5-8.5 means for Toronto" line.
    # Anything the reader can read gets an assert - same contract as the five above.
    assert temperature["now"] == 8.06, temperature["now"]
    assert temperature["ssp126"] == 11.04, temperature["ssp126"]
    assert temperature["ssp585"] == 16.32, temperature["ssp585"]

    payload = {
        "meta": {
            "source": "Filazzola et al. 2024, PLOS ONE 19(3): e0299217",
            "title": "The great urban shift: Climate change is predicted to "
                     "drive mass species turnover in cities",
            "doi": "10.1371/journal.pone.0299217",
            "url": "https://doi.org/10.1371/journal.pone.0299217",
            "code": "https://github.com/afilazzola/GreatUrbanShift",
            "licence": "CC BY 4.0",
            "iucn": {
                "source": "IUCN Red List of Threatened Species",
                "url": "https://www.iucnredlist.org",
                "note": "Bundled with the paper's data under data/IUCN/. This is "
                        "IUCN's assessment, not a finding of the paper.",
            },
            "city": CITY,
            "birdsModelled": len(birds),
            "presenceCut": PRESENCE_CUT,
            "startYear": START_YEAR,
            "endYear": END_YEAR,
            "anchors": [START_YEAR] + sorted(ANCHOR_YEAR.values()),
            "figures": {
                "cities": "Fig 1 - gains and losses per city, by SSP",
                "city": "Fig 1 / Appendix Table 2 - Toronto's own row",
                "richness": "derived: Fig 1's method applied to Class == Aves only",
            },
            "note": "Values are MaxEnt predicted occurrence (climate suitability, "
                    "0-1) for the climate of a 20x20 km quadrat over Toronto. They "
                    "are NOT counts of birds. The paper models three time windows "
                    "(1990-2020, 2041-2060, 2081-2100); years in between are "
                    "linearly interpolated for the narrative.",
            "turnoverNotMigration": "The paper models climate-driven species "
                    "turnover - which species have a suitable climate in a city - "
                    "not bird migration.",
        },
        "ssps": SSPS,
        "citySsps": city_ssps,
        "sspLabels": {
            "ssp126": "SSP1-2.6 · sustainable development",
            "ssp245": "SSP2-4.5 · middle of the road",
            "ssp370": "SSP3-7.0 · barriers to mitigation",
            "ssp585": "SSP5-8.5 · continued fossil fuel development",
        },
        "city": city,
        "cities": cities,
        "richness": richness,
        "iucn": {
            "categories": categories,
            "trends": trends,
            "systems": systems,
            "concern": concern,
        },
        "cast": cast,
        "temperature": temperature,
    }

    out = "src/data/torontoBirds.js"
    with open(out, "w") as f:
        f.write("// GENERATED by scripts/build-data.py - do not edit by hand.\n"
                "//\n"
                "// Source: Filazzola et al. 2024, PLOS ONE 19(3): e0299217 (CC BY 4.0)\n"
                "//         https://doi.org/10.1371/journal.pone.0299217\n"
                "//         https://github.com/afilazzola/GreatUrbanShift\n"
                "// IUCN layer: IUCN Red List of Threatened Species, bundled in that repo.\n"
                "//\n"
                "// Values are modelled climate suitability (0-1), NOT bird counts, and the\n"
                "// paper is about species TURNOVER, not migration. The 0.5 presence cut used\n"
                "// by `richness` is ours, not the paper's - every chart drawn from it says so.\n"
                "export const TORONTO_BIRDS = ")
        json.dump(payload, f, indent=1)
        f.write(";\n\nexport default TORONTO_BIRDS;\n")
    print(f"\nwrote {out}")


if __name__ == "__main__":
    sys.exit(main())
