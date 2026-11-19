// The Road to Vice Got a Price! — the program that hands this guide in.
// Node 22, standard library only. It copies the guide (app/) and its
// screenshots into the output directory and writes dossier.json with the
// vendored make.fun library, which the scorer rebuilds and compares byte
// for byte. vendor/makefun-frontend.ts is left exactly as the kit ships it.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader, MAKEFUN_OUTPUT_DIR is unset and /output is used instead.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy one tree into the output directory, creating parents as needed.
function copyTree(sourceDir, targetDir) {
  mkdirSync(targetDir, { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true });
}

// The gate caps from the kit: the dossier's text budget, at most 4
// screenshots of at most 256 KiB, and app/ within 993 entries / 48 MiB.
function dossierOptions() {
  return {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  };
}

function handIn() {
  mkdirSync(outputDir, { recursive: true });
  copyTree(join(repoRoot, 'app'), join(outputDir, 'app'));
  const shotsDir = join(repoRoot, 'screenshots');
  if (existsSync(shotsDir)) copyTree(shotsDir, join(outputDir, 'screenshots'));
  writeFileSync(join(outputDir, 'dossier.json'), buildDossier(outputDir, dossierOptions()));
}

handIn();
