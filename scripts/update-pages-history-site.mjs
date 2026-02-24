import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const siteRoot = process.env.PAGES_SITE_DIR ?? '.pages-site';
const sourceReportDir = process.env.SOURCE_REPORT_DIR ?? 'allure-report';
const envName = process.env.BV_ENV ?? 'dev';
const runNumber = process.env.GITHUB_RUN_NUMBER ?? 'local';
const runId = process.env.GITHUB_RUN_ID ?? 'local';
const sha = (process.env.GITHUB_SHA ?? '').slice(0, 7) || 'local';
const repository = process.env.GITHUB_REPOSITORY ?? '';
const serverUrl = process.env.GITHUB_SERVER_URL ?? 'https://github.com';
const runUrl = repository && runId !== 'local' ? `${serverUrl}/${repository}/actions/runs/${runId}` : '';

if (!existsSync(sourceReportDir)) {
  throw new Error(`Source report directory not found: ${sourceReportDir}`);
}

const now = new Date();
const iso = now.toISOString();
const runStamp = `${iso.replace(/[:.]/g, '-')}-run-${runNumber}`;
const runDir = join(siteRoot, 'reports', envName, runStamp);
mkdirSync(runDir, { recursive: true });
cpSync(sourceReportDir, runDir, { recursive: true, force: true });

const metadataPath = join(siteRoot, 'reports', 'history.json');
mkdirSync(join(siteRoot, 'reports'), { recursive: true });

/** @type {Array<{id:string,date:string,env:string,runNumber:string,runId:string,sha:string,reportPath:string,runUrl:string}>} */
let history = [];
if (existsSync(metadataPath)) {
  try {
    history = JSON.parse(readFileSync(metadataPath, 'utf8'));
  } catch {
    history = [];
  }
}

const entry = {
  id: `${runId}-${envName}`,
  date: iso,
  env: envName,
  runNumber: String(runNumber),
  runId: String(runId),
  sha,
  reportPath: `reports/${envName}/${runStamp}/index.html`,
  runUrl,
};

history = [entry, ...history.filter((item) => item.id !== entry.id)];
writeFileSync(metadataPath, JSON.stringify(history, null, 2), 'utf8');

const rows = history
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((item) => {
    const dateText = new Date(item.date).toISOString().replace('T', ' ').replace('Z', ' UTC');
    const runLink = item.runUrl ? `<a href="${item.runUrl}">#${item.runNumber}</a>` : `#${item.runNumber}`;
    return `<tr>
      <td>${dateText}</td>
      <td>${item.env}</td>
      <td>${runLink}</td>
      <td><code>${item.sha}</code></td>
      <td><a href="./${item.reportPath}">Open report</a></td>
    </tr>`;
  })
  .join('\n');

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>QA Report History</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; }
      table { border-collapse: collapse; width: 100%; margin-top: 16px; }
      th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      th { background: #f6f6f6; }
      tr:nth-child(even) { background: #fafafa; }
      code { background: #f2f2f2; padding: 2px 6px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>QA Report History</h1>
    <p>Public history of test executions by date, environment and run number.</p>
    <table>
      <thead>
        <tr>
          <th>Date (UTC)</th>
          <th>Environment</th>
          <th>Run</th>
          <th>Commit</th>
          <th>Report</th>
        </tr>
      </thead>
      <tbody>
        ${rows || '<tr><td colspan="5">No reports yet</td></tr>'}
      </tbody>
    </table>
  </body>
</html>`;

writeFileSync(join(siteRoot, 'index.html'), html, 'utf8');

