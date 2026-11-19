// Boot: load the trophy data, wire the tabs, the toolbar and the views,
// and keep every view in step with the same progress state.

import {
  loadEarned,
  saveEarned,
  loadSpoilersHidden,
  saveSpoilersHidden,
  parseProgressFile,
  progressFileText,
  downloadText,
} from './store.js';
import {
  renderKindChips,
  renderTrophyList,
  renderProgress,
  renderDetail,
} from './guide.js';
import { renderRoadmap, renderMissables, renderAbout } from './roadmap.js';

const response = await fetch('data/trophies.json');
const data = await response.json();
const trophies = data.trophies;
const byId = new Map(trophies.map((trophy) => [trophy.id, trophy]));

const state = {
  earned: loadEarned(),
  spoilersHidden: loadSpoilersHidden(),
  selectedId: null,
  kind: 'all',
  grade: 'all',
  status: 'all',
  query: '',
};

const listElement = document.getElementById('trophyList');
const statusElement = document.getElementById('listStatus');
const detailPane = document.getElementById('detailPane');
const searchInput = document.getElementById('searchInput');
const gradeFilter = document.getElementById('gradeFilter');
const statusFilter = document.getElementById('statusFilter');
const spoilerToggle = document.getElementById('spoilerToggle');
const kindContainer = document.getElementById('kindFilters');

function selectedTrophy() {
  return state.selectedId == null ? null : byId.get(state.selectedId) ?? null;
}

function renderAll() {
  renderKindChips(kindContainer, state.kind, (kind) => {
    state.kind = kind;
    renderAll();
  });
  renderTrophyList(listElement, statusElement, trophies, state, {
    onSelect: selectTrophy,
    onToggleEarned: toggleEarned,
  });
  renderProgress(trophies, state.earned);
  renderDetail(detailPane, selectedTrophy(), { ...state, onToggleEarned: toggleEarned });
  renderRoadmap(document.getElementById('roadmapStages'), trophies, state.earned, selectTrophy);
}

function selectTrophy(trophy) {
  state.selectedId = trophy.id;
  showView('trophies');
  renderAll();
  if (window.matchMedia('(max-width: 900px)').matches) {
    detailPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function toggleEarned(trophy) {
  if (state.earned.has(trophy.name)) state.earned.delete(trophy.name);
  else state.earned.add(trophy.name);
  saveEarned(state.earned);
  renderAll();
}

function showView(name) {
  for (const tab of document.querySelectorAll('.tab')) {
    const active = tab.dataset.view === name;
    tab.classList.toggle('is-active', active);
    if (active) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  }
  for (const view of document.querySelectorAll('.view')) {
    view.classList.toggle('is-active', view.id === `view-${name}`);
  }
}

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => showView(tab.dataset.view));
}

searchInput.addEventListener('input', () => {
  state.query = searchInput.value.trim();
  renderAll();
});

gradeFilter.addEventListener('change', () => {
  state.grade = gradeFilter.value;
  renderAll();
});

statusFilter.addEventListener('change', () => {
  state.status = statusFilter.value;
  renderAll();
});

function syncSpoilerToggle() {
  spoilerToggle.setAttribute('aria-pressed', String(state.spoilersHidden));
  spoilerToggle.textContent = state.spoilersHidden ? 'Spoilers: hidden' : 'Spoilers: shown';
}

spoilerToggle.addEventListener('click', () => {
  state.spoilersHidden = !state.spoilersHidden;
  saveSpoilersHidden(state.spoilersHidden);
  syncSpoilerToggle();
  renderAll();
});

document.getElementById('exportButton').addEventListener('click', () => {
  downloadText('gta6-trophy-progress.json', progressFileText(state.earned));
  statusElement.textContent = `Exported ${state.earned.size} earned trophies to gta6-trophy-progress.json.`;
});

document.getElementById('importInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = parseProgressFile(await file.text());
    const known = new Set(trophies.map((trophy) => trophy.name));
    state.earned = new Set([...imported].filter((name) => known.has(name)));
    saveEarned(state.earned);
    renderAll();
    statusElement.textContent = `Imported ${state.earned.size} earned trophies from ${file.name}.`;
  } catch {
    statusElement.textContent = 'That file is not a progress export from this guide — nothing was changed.';
  }
  event.target.value = '';
});

document.getElementById('resetButton').addEventListener('click', () => {
  if (!window.confirm('Clear all earned trophies? This cannot be undone — export first if you want a copy.')) return;
  state.earned = new Set();
  state.selectedId = null;
  saveEarned(state.earned);
  renderAll();
  statusElement.textContent = 'Progress cleared. All 55 trophies are waiting.';
});

renderMissables(document.getElementById('missablesBody'), (id) => selectTrophy(byId.get(id)));
renderAbout(document.getElementById('aboutBody'), trophies);
syncSpoilerToggle();
renderAll();
