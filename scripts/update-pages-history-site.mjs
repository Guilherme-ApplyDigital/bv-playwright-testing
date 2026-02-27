import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
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
const regressionReportsDir = 'reports';

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function markdownToHtml(markdown) {
  const lines = markdown.split('\n');
  const htmlParts = [];
  let inCodeBlock = false;
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine ?? '';

    if (line.startsWith('```')) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      if (!inCodeBlock) {
        htmlParts.push('<pre class="md-code"><code>');
      } else {
        htmlParts.push('</code></pre>');
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      htmlParts.push(`${escapeHtml(line)}\n`);
      continue;
    }

    if (line.trim() === '') {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      continue;
    }

    if (line.startsWith('### ')) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      htmlParts.push(`<h3>${escapeHtml(line.slice(4).trim())}</h3>`);
      continue;
    }

    if (line.startsWith('## ')) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      htmlParts.push(`<h2>${escapeHtml(line.slice(3).trim())}</h2>`);
      continue;
    }

    if (line.startsWith('# ')) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      htmlParts.push(`<h1>${escapeHtml(line.slice(2).trim())}</h1>`);
      continue;
    }

    if (line.startsWith('- ')) {
      if (!inList) {
        htmlParts.push('<ul>');
        inList = true;
      }
      htmlParts.push(`<li>${escapeHtml(line.slice(2).trim())}</li>`);
      continue;
    }

    if (inList) {
      htmlParts.push('</ul>');
      inList = false;
    }

    htmlParts.push(`<p>${escapeHtml(line.trim())}</p>`);
  }

  if (inList) {
    htmlParts.push('</ul>');
  }
  if (inCodeBlock) {
    htmlParts.push('</code></pre>');
  }

  return htmlParts.join('\n');
}

function buildAnalysisHtml(markdown, env, stamp) {
  const content = markdownToHtml(markdown);
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Regression Analysis</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f5f7fb;
        --card: #ffffff;
        --text: #1f2937;
        --muted: #6b7280;
        --line: #e5e7eb;
        --accent: #2563eb;
      }
      body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.65 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
      .wrap { max-width: 980px; margin: 28px auto; padding: 0 16px; }
      .meta { margin-bottom: 14px; color: var(--muted); font-size: 13px; }
      .meta a { color: var(--accent); text-decoration: none; }
      .meta a:hover { text-decoration: underline; }
      .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 20px 24px; box-shadow: 0 3px 14px rgba(15,23,42,.05); }
      h1, h2, h3 { line-height: 1.3; margin-top: 1.25em; margin-bottom: .5em; }
      h1 { font-size: 1.55rem; margin-top: .2em; }
      h2 { font-size: 1.2rem; border-top: 1px solid var(--line); padding-top: .85em; }
      h3 { font-size: 1.02rem; }
      p { margin: .5em 0 .85em; }
      ul { margin: .25em 0 .95em 1.1em; padding: 0; }
      li { margin: .25em 0; }
      .md-code { background: #0f172a; color: #e5e7eb; border-radius: 8px; overflow: auto; padding: 12px 14px; }
    </style>
  </head>
  <body>
    <main class="wrap">
      <div class="meta">
        <strong>Environment:</strong> ${escapeHtml(env)} |
        <strong>Run stamp:</strong> ${escapeHtml(stamp)} |
        <a href="../../../index.html">Back to report history</a>
      </div>
      <article class="card">
        ${content}
      </article>
    </main>
  </body>
</html>`;
}

if (!existsSync(sourceReportDir)) {
  throw new Error(`Source report directory not found: ${sourceReportDir}`);
}

const now = new Date();
const iso = now.toISOString();
const runStamp = `${iso.replace(/[:.]/g, '-')}-run-${runNumber}`;
const runDir = join(siteRoot, 'reports', envName, runStamp);
mkdirSync(runDir, { recursive: true });
cpSync(sourceReportDir, runDir, { recursive: true, force: true });

let analysisPath = '';
if (existsSync(regressionReportsDir)) {
  const latestAnalysis = readdirSync(regressionReportsDir)
    .filter((name) => /^REGRESSION_ANALYSIS_.*\.md$/i.test(name))
    .sort()
    .reverse()[0];
  if (latestAnalysis) {
    const analysisSource = join(regressionReportsDir, latestAnalysis);
    const analysisTargetMd = 'REGRESSION_ANALYSIS.md';
    const analysisTargetHtml = 'REGRESSION_ANALYSIS.html';
    const analysisMarkdown = readFileSync(analysisSource, 'utf8');
    cpSync(analysisSource, join(runDir, analysisTargetMd), { force: true });
    writeFileSync(join(runDir, analysisTargetHtml), buildAnalysisHtml(analysisMarkdown, envName, runStamp), 'utf8');
    analysisPath = `reports/${envName}/${runStamp}/${analysisTargetHtml}`;
  }
}

const metadataPath = join(siteRoot, 'reports', 'history.json');
mkdirSync(join(siteRoot, 'reports'), { recursive: true });

/** @type {Array<{id:string,date:string,env:string,runNumber:string,runId:string,sha:string,reportPath:string,analysisPath?:string,runUrl:string}>} */
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
  analysisPath,
  runUrl,
};

history = [entry, ...history.filter((item) => item.id !== entry.id)];
writeFileSync(metadataPath, JSON.stringify(history, null, 2), 'utf8');

const sortedHistory = history.sort((a, b) => b.date.localeCompare(a.date));
const latest = sortedHistory[0];
const rows = sortedHistory
  .map((item) => {
    const dateText = new Date(item.date).toISOString().replace('T', ' ').replace('Z', ' UTC');
    const runLink = item.runUrl ? `<a href="${item.runUrl}">#${item.runNumber}</a>` : `#${item.runNumber}`;
    return `<tr>
      <td>${dateText}</td>
      <td>${item.env}</td>
      <td>${runLink}</td>
      <td><code>${item.sha}</code></td>
      <td><a href="./${item.reportPath}">Open report</a></td>
      <td>${item.analysisPath ? `<a href="./${item.analysisPath}">Open analysis</a>` : '-'}</td>
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
      :root {
        --bg: #f5f7fb;
        --card: #fff;
        --text: #111827;
        --muted: #6b7280;
        --line: #e5e7eb;
        --accent: #2563eb;
      }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin: 0; background: var(--bg); color: var(--text); }
      .wrap { max-width: 1120px; margin: 30px auto; padding: 0 16px 28px; }
      .header h1 { margin: 0 0 8px; font-size: 1.8rem; }
      .header p { margin: 0; color: var(--muted); }
      .cards { margin-top: 16px; display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 12px; }
      .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; box-shadow: 0 3px 12px rgba(15,23,42,.04); }
      .card .label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
      .card .value { margin-top: 6px; font-weight: 700; font-size: 1.1rem; }
      .table-wrap { margin-top: 16px; background: var(--card); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; box-shadow: 0 3px 12px rgba(15,23,42,.04); }
      table { border-collapse: collapse; width: 100%; }
      th, td { border-bottom: 1px solid var(--line); padding: 10px 12px; text-align: left; }
      th { background: #f9fafb; color: #374151; font-weight: 600; }
      tr:last-child td { border-bottom: 0; }
      code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
      a { color: var(--accent); text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <main class="wrap">
      <section class="header">
        <h1>QA Report History</h1>
        <p>Public history of test executions by date, environment and run number.</p>
      </section>
      <section class="cards">
        <div class="card">
          <div class="label">Total Runs</div>
          <div class="value">${sortedHistory.length}</div>
        </div>
        <div class="card">
          <div class="label">Latest Environment</div>
          <div class="value">${latest ? latest.env : '-'}</div>
        </div>
        <div class="card">
          <div class="label">Latest Run</div>
          <div class="value">${latest ? `#${latest.runNumber}` : '-'}</div>
        </div>
        <div class="card">
          <div class="label">Latest Commit</div>
          <div class="value">${latest ? `<code>${latest.sha}</code>` : '-'}</div>
        </div>
      </section>
      <section class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date (UTC)</th>
              <th>Environment</th>
              <th>Run</th>
              <th>Commit</th>
              <th>Report</th>
              <th>Analysis</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="6">No reports yet</td></tr>'}
          </tbody>
        </table>
      </section>
    </main>
  </body>
</html>`;

writeFileSync(join(siteRoot, 'index.html'), html, 'utf8');

