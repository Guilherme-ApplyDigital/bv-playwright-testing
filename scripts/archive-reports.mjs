import { cpSync, existsSync, mkdirSync } from 'node:fs';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const root = `reports/history/${timestamp}`;

mkdirSync(root, { recursive: true });

const candidates = ['playwright-report', 'allure-results', 'allure-report'];
for (const source of candidates) {
  if (!existsSync(source)) {
    continue;
  }
  cpSync(source, `${root}/${source}`, { recursive: true, force: true });
}

console.log(`Archived reports at ${root}`);

