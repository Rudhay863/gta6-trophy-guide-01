// The roadmap, missables and about views: built from the same trophy data,
// so the roadmap and the missable flags always agree with the checklist.

const STAGES = [
  {
    stage: 1,
    title: 'Play the story — Chapters 1 & 2',
    time: 'First 20 hours',
    blurb:
      'Just play. Do the one thing that matters here: Lucia\u2019s balcony meditation in Chapter 1 (see Missables). Scan every new vehicle with WAiNK, study animals with the binoculars, and take optional missions as they appear — progress counts toward the 100% checklist even though you cannot see it yet.',
  },
  {
    stage: 2,
    title: 'The story opens up — Chapters 3 to 5',
    time: '60–80 hours total',
    blurb:
      'Both characters are playable together now, so the partner trophies, the quest lines and the first robberies unlock. Answer every quest giver\u2019s call as it comes — Andy, Kenton, Billy, Randy, Tyrone and Bret all stay available after the story, but their lines introduce the tools (Snap Gun, Key Cloner, Dye Pack Jammer) the later trophies need.',
  },
  {
    stage: 3,
    title: 'After the credits — the 100% checklist',
    time: 'About 100 hours',
    blurb:
      'Open Progress, then Stats, then 100% Completion. This is the long grind, and most of the remaining trophies fall out of it: every robbery, all 8 bank vaults, all 39 gang operations, every shooting range gold, all 42 drone races, all 15 of Bret\u2019s Target Decks, plus the partial targets — 200 vehicle scans, 100 animal studies, 300 stunts, 70 of 80 challenges.',
  },
  {
    stage: 4,
    title: 'Clean-up — strangers, one-offs, platinum',
    time: 'About 10 hours',
    blurb:
      'Finish the 8 stranger strands, sweep up the one-off trophies, and check the five whose methods were not yet confirmed at launch against the cited guides. The platinum pops with the last trophy — usually A Long Road.',
  },
];

function stageTrophies(trophies, stage) {
  return trophies.filter((trophy) => trophy.stage === stage).sort((a, b) => a.id - b.id);
}

export function renderRoadmap(container, trophies, earned, onSelect) {
  container.replaceChildren();
  for (const stage of STAGES) {
    const members = stageTrophies(trophies, stage.stage);
    const earnedCount = members.filter((trophy) => earned.has(trophy.name)).length;
    const card = document.createElement('article');
    card.className = 'stage';
    const head = document.createElement('div');
    head.className = 'stage-head';
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = `Stage ${stage.stage} · ${earnedCount}/${members.length} earned`;
    const title = document.createElement('h3');
    title.textContent = stage.title;
    const time = document.createElement('span');
    time.className = 'stage-time';
    time.textContent = stage.time;
    head.append(num, title, time);
    card.append(head);
    const blurb = document.createElement('p');
    blurb.textContent = stage.blurb;
    card.append(blurb);
    const list = document.createElement('ul');
    for (const trophy of members) {
      const item = document.createElement('li');
      if (earned.has(trophy.name)) item.className = 'is-earned';
      const name = document.createElement('strong');
      name.textContent = trophy.name;
      item.append(name, document.createTextNode(` — ${trophy.description}`));
      if (trophy.missable) {
        const flag = document.createElement('span');
        flag.textContent = ' · possibly missable';
        item.append(flag);
      }
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => onSelect(trophy));
      list.append(item);
    }
    card.append(list);
    container.append(card);
  }
}

export function renderMissables(container, onSelectTrophy) {
  container.replaceChildren();

  const warn = document.createElement('div');
  warn.className = 'warn-card';
  const warnTitle = document.createElement('h3');
  warnTitle.textContent = 'The one trophy you can miss: Positive Mental Attitude';
  const warnFirst = document.createElement('p');
  warnFirst.textContent =
    'Meditate at every spot across Leonida — 18 spots in 10 locations. Meditating at a spot with Jason and Lucia together counts twice, and the last spot needs both characters, which is possible after Coffee Break in Chapter 2.';
  const warnSecond = document.createElement('p');
  const warnStrong = document.createElement('strong');
  warnStrong.textContent = 'Do this in Chapter 1: ';
  warnSecond.append(
    warnStrong,
    document.createTextNode(
      'the morning after the mission Down to Earth, Lucia says in the kitchen that she is going to meditate, then walks out to the balcony. Follow her, talk to her and choose Accept. That meditation raises the counter by 1 but is not marked as a meditation spot like the others, and it is gone for good after Chapter 1. It is still unconfirmed whether the trophy actually needs it — so do it and do not risk it.',
    ),
  );
  const warnThird = document.createElement('p');
  warnThird.textContent =
    'Track it at Progress, then Collections, then Exploration, then Meditations. The 100% checklist only asks for 15 of the 18 spots, so the missable meditation cannot cost you A Long Road.';
  warn.append(warnTitle, warnFirst, warnSecond, warnThird);
  container.append(warn);

  const saves = document.createElement('div');
  saves.className = 'info-card';
  const savesTitle = document.createElement('h3');
  savesTitle.textContent = 'Save like there is no mission replay — because there is not';
  const savesList = document.createElement('ul');
  const saveTips = [
    'Keep a manual save at the start of every chapter and one before the final mission. The game gives 15 manual save slots and 1 autosave slot.',
    'There is no New Game+, and no trophy depends on how you play a mission — so the saves are insurance, not a requirement.',
    'Many optional missions disappear after a while (black icons with pink letters). That does not matter for trophies: there are far more than the 100 optional missions the checklist wants.',
    'Some quest givers go quiet for a while — Kenton disappears after Chapter 1, for example — but every trophy-related character comes back later in the story.',
    'Do not use cheats on your trophy save: cheats switch off trophies and saving.',
    'Avoid the Irredeemable criminal profile: it is permanent, and the police become more aggressive on sight.',
  ];
  for (const tip of saveTips) {
    const item = document.createElement('li');
    item.textContent = tip;
    savesList.append(item);
  }
  saves.append(savesTitle, savesList);
  container.append(saves);

  const link = document.createElement('p');
  link.style.color = 'var(--ink-dim)';
  const open = document.createElement('button');
  open.type = 'button';
  open.className = 'button quiet';
  open.textContent = 'Open Positive Mental Attitude in the checklist';
  open.addEventListener('click', () => onSelectTrophy(28));
  link.append(open);
  container.append(link);
}

export function renderAbout(container, trophies) {
  container.replaceChildren();

  const built = document.createElement('div');
  built.className = 'info-card';
  const builtTitle = document.createElement('h3');
  builtTitle.textContent = 'How this guide was built';
  const builtFirst = document.createElement('p');
  builtFirst.textContent =
    'The trophy list is the official PlayStation 5 list as published before launch: 55 trophies, 1 platinum, 2 gold, 6 silver, 46 bronze, 28 of them hidden until earned. Names, descriptions and grades are shown exactly as PlayStation publishes them.';
  const builtSecond = document.createElement('p');
  builtSecond.textContent =
    'Every guide is written in the author\u2019s own words for this entry. It draws on the launch-era guides cited beside each trophy — GTABase, PowerPyx, Exophase and PSNProfiles — and cites them, never copies them. Where those guides had not yet confirmed a method when the game released on 19 November 2026, this guide says so plainly instead of inventing one. Five trophies are marked that way: In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There and Ten Pin.';
  const builtThird = document.createElement('p');
  builtThird.textContent =
    'The roadmap and the missable flags are built from the official descriptions: which story chapters and missions, which collectibles and counts, in what order. The checklist, the filters and the spoiler setting are all yours: progress is saved in this browser, and export writes it to a file you can carry to another machine.';
  built.append(builtTitle, builtFirst, builtSecond, builtThird);
  container.append(built);

  const offline = document.createElement('div');
  offline.className = 'info-card';
  const offlineTitle = document.createElement('h3');
  offlineTitle.textContent = 'Offline by design';
  const offlineText = document.createElement('p');
  offlineText.textContent =
    'This guide is plain files and works with the network off. It fetches nothing at run time — the trophy data is a file shipped with the guide, and the source links only open when you follow them. Your progress never leaves your browser unless you export it.';
  offline.append(offlineTitle, offlineText);
  container.append(offline);

  const sourcesCard = document.createElement('div');
  sourcesCard.className = 'info-card';
  const sourcesTitle = document.createElement('h3');
  sourcesTitle.textContent = 'Sources';
  sourcesCard.append(sourcesTitle);
  const seen = new Set();
  const list = document.createElement('ul');
  for (const trophy of trophies) {
    for (const source of trophy.sources) {
      if (seen.has(source.url)) continue;
      seen.add(source.url);
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = source.name;
      link.target = '_blank';
      link.rel = 'noopener';
      item.append(link);
      list.append(item);
    }
  }
  sourcesCard.append(list);
  container.append(sourcesCard);
}
