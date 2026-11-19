// The checklist: filtering, searching, the spoiler rule, the detail pane
// and the progress header. All trophy facts come from the loaded data file.

export const KIND_FILTERS = [
  ['all', 'All 55'],
  ['story', 'Story'],
  ['side', 'Side quests'],
  ['collectibles', 'Collectibles'],
  ['activities', 'Activities'],
  ['crime', 'Crime'],
  ['exploration', 'Exploration'],
  ['missable', 'Missable'],
  ['online', 'Online'],
];

export const KIND_LABELS = {
  story: 'Story',
  side: 'Side quest',
  collectibles: 'Collectible',
  activities: 'Activity',
  crime: 'Crime',
  exploration: 'Exploration',
  platinum: 'Platinum',
};

const GRADE_LETTER = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };
const UNCONFIRMED_MARK = 'not yet confirmed';

export function gradeLetter(grade) {
  return GRADE_LETTER[grade] ?? '?';
}

export function isUnconfirmed(trophy) {
  return trophy.guide.includes(UNCONFIRMED_MARK);
}

function targetLabel(trophy) {
  if (trophy.target == null) return null;
  if (trophy.id === 52 || trophy.id === 53) return '$' + trophy.target.toLocaleString('en-US');
  return trophy.target.toLocaleString('en-US');
}

function spoilerMasked(trophy, earned, spoilersHidden) {
  return spoilersHidden && trophy.hidden && !earned.has(trophy.name);
}

function trophyMatches(trophy, query) {
  if (!query) return true;
  const haystack = [trophy.name, trophy.description, trophy.guide, ...(trophy.steps ?? [])]
    .join(' ')
    .toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
}

export function filterTrophies(trophies, state) {
  return trophies.filter((trophy) => {
    if (state.kind === 'missable' && !trophy.missable) return false;
    if (state.kind === 'online') return false;
    if (state.kind !== 'all' && state.kind !== 'missable' && trophy.kind !== state.kind) return false;
    if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
    if (state.status === 'earned' && !state.earned.has(trophy.name)) return false;
    if (state.status === 'remaining' && state.earned.has(trophy.name)) return false;
    return trophyMatches(trophy, state.query);
  });
}

export function renderKindChips(container, activeKind, onPick) {
  container.replaceChildren();
  for (const [value, label] of KIND_FILTERS) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip' + (value === activeKind ? ' is-active' : '');
    chip.textContent = label;
    chip.setAttribute('aria-pressed', String(value === activeKind));
    chip.addEventListener('click', () => onPick(value));
    container.append(chip);
  }
}

function buildTrophyCard(trophy, state, onSelect, onToggleEarned) {
  const earned = state.earned.has(trophy.name);
  const masked = spoilerMasked(trophy, state.earned, state.spoilersHidden);
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'trophy-card' + (earned ? ' is-earned' : '') + (state.selectedId === trophy.id ? ' is-selected' : '');
  card.setAttribute('aria-pressed', String(earned));

  const box = document.createElement('span');
  box.className = 'earn-box';
  box.textContent = earned ? '✓' : '';
  box.title = earned ? 'Earned — click to unmark' : 'Mark as earned';
  box.addEventListener('click', (event) => {
    event.stopPropagation();
    onToggleEarned(trophy);
  });
  card.append(box);

  const disc = document.createElement('span');
  disc.className = 'grade-disc ' + trophy.grade;
  disc.textContent = gradeLetter(trophy.grade);
  disc.title = trophy.grade;
  card.append(disc);

  const body = document.createElement('span');
  const name = document.createElement('span');
  name.className = 'trophy-name' + (masked ? ' spoiler-name' : '');
  name.textContent = masked ? 'Hidden trophy — earn it to reveal' : trophy.name;
  body.append(name);
  const desc = document.createElement('span');
  desc.className = 'trophy-desc';
  desc.style.display = 'block';
  desc.textContent = masked ? 'A story trophy, hidden until earned.' : trophy.description;
  body.append(desc);
  const meta = document.createElement('span');
  meta.className = 'trophy-meta';
  meta.style.display = 'flex';
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
  meta.append(kindTag);
  if (trophy.missable) {
    const tag = document.createElement('span');
    tag.className = 'tag missable';
    tag.textContent = 'Possibly missable';
    meta.append(tag);
  }
  if (trophy.hidden) {
    const tag = document.createElement('span');
    tag.className = 'tag hidden-tag';
    tag.textContent = 'Hidden on PS5';
    meta.append(tag);
  }
  const target = targetLabel(trophy);
  if (target) {
    const tag = document.createElement('span');
    tag.className = 'tag target';
    tag.textContent = 'Target: ' + target;
    meta.append(tag);
  }
  if (isUnconfirmed(trophy)) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = 'Method not yet confirmed';
    meta.append(tag);
  }
  body.append(meta);
  card.append(body);

  const gradeLabel = document.createElement('span');
  gradeLabel.className = 'trophy-grade-label';
  gradeLabel.textContent = trophy.grade;
  card.append(gradeLabel);

  card.addEventListener('click', () => onSelect(trophy));
  return card;
}

export function renderTrophyList(listElement, statusElement, trophies, state, callbacks) {
  const visible = filterTrophies(trophies, state);
  listElement.replaceChildren();
  if (state.kind === 'online') {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const heading = document.createElement('h3');
    heading.textContent = 'No online trophies';
    const text = document.createElement('p');
    text.textContent = 'All 55 trophies unlock in single-player. There is nothing here to chase online — pick another filter to get back to the list.';
    empty.append(heading, text);
    listElement.append(empty);
  } else if (visible.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const heading = document.createElement('h3');
    heading.textContent = 'Nothing matches those filters';
    const text = document.createElement('p');
    text.textContent = 'Try a different search word, or clear a filter — every trophy is still in the list underneath.';
    empty.append(heading, text);
    listElement.append(empty);
  } else {
    for (const trophy of visible) {
      listElement.append(buildTrophyCard(trophy, state, callbacks.onSelect, callbacks.onToggleEarned));
    }
  }
  const earnedCount = state.earned.size;
  statusElement.textContent =
    state.kind === 'online'
      ? '0 online trophies — all 55 are single-player.'
      : `Showing ${visible.length} of ${trophies.length} trophies · ${earnedCount} earned · ${trophies.length - earnedCount} to go.`;
}

export function renderProgress(trophies, earned) {
  const countElement = document.getElementById('earnedCount');
  const fillElement = document.getElementById('progressFill');
  const barElement = document.getElementById('progressBar');
  const nextElement = document.getElementById('nextUp');
  const gradesElement = document.getElementById('gradeCounts');
  countElement.textContent = String(earned.size);
  fillElement.style.width = `${(earned.size / trophies.length) * 100}%`;
  barElement.setAttribute('aria-valuenow', String(earned.size));
  const remaining = trophies
    .filter((trophy) => !earned.has(trophy.name))
    .sort((a, b) => a.stage - b.stage || a.id - b.id);
  const next = remaining.find((trophy) => trophy.id !== 1) ?? remaining[0];
  nextElement.innerHTML = '';
  if (!next) {
    nextElement.textContent = 'All 55 earned — you are a Leonida Legend.';
  } else {
    const label = document.createElement('strong');
    label.textContent = 'Next up: ';
    nextElement.append(label, document.createTextNode(`${next.name} — ${next.description}`));
  }
  const counts = {};
  for (const trophy of trophies) {
    counts[trophy.grade] = counts[trophy.grade] ?? { total: 0, earned: 0 };
    counts[trophy.grade].total += 1;
    if (earned.has(trophy.name)) counts[trophy.grade].earned += 1;
  }
  gradesElement.replaceChildren();
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const item = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = `${counts[grade].earned}/${counts[grade].total}`;
    item.append(strong, document.createTextNode(' ' + grade));
    gradesElement.append(item);
  }
}

export function renderDetail(pane, trophy, state) {
  pane.replaceChildren();
  if (!trophy) {
    const empty = document.createElement('div');
    empty.className = 'detail-empty';
    const heading = document.createElement('h2');
    heading.textContent = 'Pick a trophy';
    const first = document.createElement('p');
    first.textContent = 'Click any trophy in the list to read its guide here: what to do, where and how, when it can be missed, and where each fact comes from.';
    const second = document.createElement('p');
    second.textContent = 'Tick the box on a trophy card to mark it earned. Your progress is saved in this browser.';
    empty.append(heading, first, second);
    pane.append(empty);
    return;
  }
  const earned = state.earned.has(trophy.name);
  const masked = spoilerMasked(trophy, state.earned, state.spoilersHidden);

  const head = document.createElement('div');
  head.className = 'detail-head';
  const disc = document.createElement('span');
  disc.className = 'grade-disc ' + trophy.grade;
  disc.textContent = gradeLetter(trophy.grade);
  const title = document.createElement('h2');
  title.textContent = masked ? 'Hidden trophy' : trophy.name;
  head.append(disc, title);
  pane.append(head);

  const meta = document.createElement('p');
  meta.className = 'trophy-meta';
  const gradeTag = document.createElement('span');
  gradeTag.className = 'tag';
  gradeTag.textContent = trophy.grade;
  meta.append(gradeTag);
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
  meta.append(kindTag);
  if (trophy.missable) {
    const tag = document.createElement('span');
    tag.className = 'tag missable';
    tag.textContent = 'Possibly missable';
    meta.append(tag);
  }
  if (trophy.hidden) {
    const tag = document.createElement('span');
    tag.className = 'tag hidden-tag';
    tag.textContent = 'Hidden on PS5';
    meta.append(tag);
  }
  pane.append(meta);

  if (masked) {
    const note = document.createElement('p');
    note.className = 'guide-text';
    note.textContent = 'This is a hidden story trophy. Turn spoilers on to read its name and guide, or earn it in the game to reveal it here.';
    pane.append(note);
    return;
  }

  const official = document.createElement('p');
  official.className = 'official-desc';
  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = 'Official description — as PlayStation publishes it';
  official.append(label, document.createTextNode(trophy.description));
  pane.append(official);

  const guideHeading = document.createElement('h3');
  guideHeading.textContent = 'How to earn it';
  pane.append(guideHeading);
  for (const paragraph of trophy.guide.split('\n\n')) {
    const text = document.createElement('p');
    text.className = 'guide-text';
    text.textContent = paragraph;
    pane.append(text);
  }

  if (trophy.steps && trophy.steps.length > 0) {
    const stepsHeading = document.createElement('h3');
    stepsHeading.textContent = 'Steps';
    pane.append(stepsHeading);
    const steps = document.createElement('ol');
    steps.className = 'steps';
    for (const step of trophy.steps) {
      const item = document.createElement('li');
      item.textContent = step;
      steps.append(item);
    }
    pane.append(steps);
  }

  if (isUnconfirmed(trophy)) {
    const note = document.createElement('p');
    note.className = 'unconfirmed';
    const strong = document.createElement('strong');
    strong.textContent = 'Not yet confirmed at launch. ';
    note.append(strong, document.createTextNode('The guides this entry cites had not pinned down the exact method when the game released. The reading above is the best the official description supports — check the cited guides for a confirmed method before grinding it.'));
    pane.append(note);
  }

  const sourcesHeading = document.createElement('h3');
  sourcesHeading.textContent = 'Sources';
  pane.append(sourcesHeading);
  const sources = document.createElement('ul');
  sources.className = 'source-list';
  for (const source of trophy.sources) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.name;
    link.target = '_blank';
    link.rel = 'noopener';
    item.append(link);
    sources.append(item);
  }
  pane.append(sources);

  const actions = document.createElement('div');
  actions.className = 'detail-actions';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'button';
  toggle.textContent = earned ? 'Mark as not earned' : 'Mark as earned';
  toggle.addEventListener('click', () => state.onToggleEarned(trophy));
  actions.append(toggle);
  pane.append(actions);
}
