// Progress store: what the reader has earned, kept in the browser and
// portable as a file. Nothing leaves the machine unless the reader exports it.

export const STORAGE_KEY = 'gta6-trophy-guide-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.earned)) return new Set();
    return new Set(parsed.earned.filter((name) => typeof name === 'string'));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ earned: [...earned], version: 1 }));
  } catch {
    // Private mode or a full store: the checklist still works for this visit.
  }
}

export function loadSpoilersHidden() {
  try {
    return localStorage.getItem(STORAGE_KEY + '-spoilers') === 'hidden';
  } catch {
    return false;
  }
}

export function saveSpoilersHidden(hidden) {
  try {
    localStorage.setItem(STORAGE_KEY + '-spoilers', hidden ? 'hidden' : 'shown');
  } catch {
    // Same as above: the setting still applies for this visit.
  }
}

// Read a progress file back into a set of trophy names. Throws on bad files.
export function parseProgressFile(text) {
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('not a progress file');
  return new Set(names.filter((name) => typeof name === 'string'));
}

export function progressFileText(earned) {
  return JSON.stringify({ app: 'gta6-trophy-guide', version: 1, earned: [...earned] }, null, 2);
}

export function downloadText(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
