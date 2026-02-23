import { existsSync, cpSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const RESULTS_DIR = 'allure-results';
const REPORT_DIR = 'allure-report';
const HISTORY_DIR = `${REPORT_DIR}/history`;

mkdirSync(RESULTS_DIR, { recursive: true });

// Keep trend history between runs by injecting previous report history.
if (existsSync(HISTORY_DIR)) {
  cpSync(HISTORY_DIR, `${RESULTS_DIR}/history`, { recursive: true, force: true });
}

const result = spawnSync('npx', ['allure', 'generate', RESULTS_DIR, '--clean', '-o', REPORT_DIR], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

