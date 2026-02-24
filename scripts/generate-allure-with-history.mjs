import { existsSync, cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const RESULTS_DIR = 'allure-results';
const REPORT_DIR = 'allure-report';
const HISTORY_DIR = `${REPORT_DIR}/history`;
const envName = process.env.BV_ENV ?? 'dev';
const baseUrl = process.env.BV_BASE_URL || process.env.BV_DEV_BASE_URL || process.env.BV_STG_BASE_URL || process.env.BV_PROD_BASE_URL || '';
const generatedAt = new Date().toISOString();

mkdirSync(RESULTS_DIR, { recursive: true });

// Keep trend history between runs by injecting previous report history.
if (existsSync(HISTORY_DIR)) {
  cpSync(HISTORY_DIR, `${RESULTS_DIR}/history`, { recursive: true, force: true });
}

// Surface environment and run metadata inside Allure report widgets.
const environmentProperties = [
  `environment=${envName}`,
  `baseUrl=${baseUrl || '(resolved by runtime)'}`,
  `generatedAt=${generatedAt}`,
].join('\n');
writeFileSync(`${RESULTS_DIR}/environment.properties`, environmentProperties, 'utf8');

const executorMetadata = {
  name: 'GitHub Actions',
  type: 'github',
  buildName: `Playwright ${envName} run`,
  buildOrder: Number(process.env.GITHUB_RUN_NUMBER ?? '0'),
  buildUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : undefined,
  reportName: `BV Playwright (${envName})`,
};
writeFileSync(`${RESULTS_DIR}/executor.json`, JSON.stringify(executorMetadata, null, 2), 'utf8');

const result = spawnSync('npx', ['allure', 'generate', RESULTS_DIR, '--clean', '-o', REPORT_DIR], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

