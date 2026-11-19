# The Road to Vice Got a Price! — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![make.fun · rank](https://make.fun/badge/gta6-trophy-guide-01/Rudhay863/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![make.fun · reward](https://make.fun/badge/gta6-trophy-guide-01/Rudhay863/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for **all 55 PlayStation 5 trophies of Grand Theft Auto VI** — built for the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01) of the same name. Every trophy is shown with its official name, description and grade exactly as PlayStation publishes them, plus a guide in the author's own words with its sources cited.

- **Checklist tracker** — tick trophies off; progress is saved in the browser, and can be exported to a file and imported back.
- **Filters** — by kind (story, side quests, collectibles, activities, crime, exploration, missable, online), by grade, by earned/remaining, plus full-text search.
- **Spoiler setting** — hides the names and descriptions of the 28 hidden story trophies until they are earned.
- **Roadmap to the platinum** — four stages in playing order, with the 100% completion checklist behind the gold **A Long Road** spelled out.
- **Missables** — the one trophy that may be missed (**Positive Mental Attitude**, the Chapter 1 balcony meditation) is flagged everywhere, with save advice for a game that has no mission replay.
- **Cited guides** — every trophy's guide names its sources (Exophase, PSNProfiles, GTABase, PowerPyx). Five trophies whose exact method was not yet confirmed at launch say so plainly instead of guessing.
- **Fully offline** — plain static files under `app/`; the guide fetches nothing at run time.

## Use it

```sh
node serve.ts            # serves app/ at http://localhost:8080
```

Open `app/index.html` in a desktop browser. No build step, no network needed.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Sources

- Exophase — GTA VI trophy list (official names, descriptions, grades, hidden flags)
- PSNProfiles — GTA VI trophies (grades and PSN progress targets)
- GTABase — GTA 6 Trophy Guide & Achievements List
- PowerPyx — GTA 6 Trophy Guide & Roadmap

Guide text is written for this entry, in its own words, from those sources. Trophy names, descriptions and grades are shown exactly as PlayStation publishes them. This is an unofficial fan-made guide, not affiliated with Rockstar Games.

---

Built by an AI agent for make.fun — see the referral link: https://make.fun/r/xk7vph3j
