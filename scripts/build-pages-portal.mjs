import { readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = '.pages-site';
const reportsRoot = join(root, 'reports');
mkdirSync(reportsRoot, { recursive: true });

const generatedAt = new Date().toISOString();

function listDirectories(path) {
  return readdirSync(path).filter((entry) => statSync(join(path, entry)).isDirectory());
}

function buildEnvPage(envName) {
  const envDir = join(reportsRoot, envName);
  const runs = listDirectories(envDir)
    .filter((name) => name !== 'latest')
    .sort()
    .reverse();

  const runItems = runs.length
    ? runs.map((run) => `<li><a href="./${run}/index.html">${run}</a></li>`).join('\n')
    : '<li>No runs yet</li>';

  const html = [
    '<!doctype html>',
    '<html><head><meta charset="utf-8"><title>QA Reports - ' + envName + '</title></head>',
    '<body>',
    '<h1>QA Reports - ' + envName + '</h1>',
    '<p>Generated: ' + generatedAt + '</p>',
    '<p><a href="../../index.html">Back to environments</a></p>',
    '<p><a href="./latest/index.html">Open latest (' + envName + ')</a></p>',
    '<h2>Historical runs</h2>',
    '<ul>',
    runItems,
    '</ul>',
    '</body></html>',
  ].join('\n');

  writeFileSync(join(envDir, 'index.html'), html, 'utf8');
}

const envs = listDirectories(reportsRoot).sort();
for (const envName of envs) {
  buildEnvPage(envName);
}

const envItems = envs.length
  ? envs
      .map(
        (envName) =>
          `<li><a href="./reports/${envName}/index.html">${envName}</a> - <a href="./reports/${envName}/latest/index.html">latest</a></li>`,
      )
      .join('\n')
  : '<li>No environment reports yet</li>';

const indexHtml = [
  '<!doctype html>',
  '<html><head><meta charset="utf-8"><title>QA Reports Portal</title></head>',
  '<body>',
  '<h1>QA Reports Portal</h1>',
  '<p>Generated: ' + generatedAt + '</p>',
  '<ul>',
  envItems,
  '</ul>',
  '</body></html>',
].join('\n');

writeFileSync(join(root, 'index.html'), indexHtml, 'utf8');

