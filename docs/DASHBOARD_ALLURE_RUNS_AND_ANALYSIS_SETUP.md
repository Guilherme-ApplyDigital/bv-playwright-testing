# Dashboard, Allure, Runs, and Analysis — Detailed Setup Reference

This document describes **what we use** and **how each piece is configured** for the public QA dashboard (e.g. https://guilherme-applydigital.github.io/bv-playwright-testing/): the dashboard itself, Allure reporting, run triggers/artifacts, and the regression analysis integration. Use it as a single source of truth when replicating or explaining the setup.

---

## Table of contents

1. [Overview](#1-overview)
2. [Dashboard](#2-dashboard)
3. [Allure](#3-allure)
4. [Runs](#4-runs)
5. [Analysis](#5-analysis)
6. [GitHub configuration](#6-github-configuration)
7. [File and folder reference](#7-file-and-folder-reference)

---

## 1. Overview

- **Dashboard:** A static site (HTML/CSS/JS) listing every test run with links to the Allure report and, when present, to the regression analysis. It is published via **GitHub Pages**.
- **Allure:** The test report format we use. Playwright writes raw results to `allure-results/`; a script generates the viewable report in `allure-report/` and injects **history** so trends persist across runs.
- **Runs:** Each workflow execution (push, PR, schedule, or manual) produces one “run”. We store run metadata (date, environment, run number, commit SHA) and attach it to the dashboard and to the Allure report.
- **Analysis:** Optional Markdown files in `reports/` named `REGRESSION_ANALYSIS_*.md` are picked up by the dashboard script, converted to styled HTML, and linked from the dashboard table for that run.

---

## 2. Dashboard

### What it is

- A **static website** whose entry point is `index.html` at the root of the deployed site.
- It shows:
  - **Summary cards:** Total runs, latest environment, latest run number, latest commit SHA.
  - **Table:** One row per run with: Date (UTC), Environment, Run (link to GitHub Actions run), Commit, “Open report” (Allure), “Open analysis” (if available).

### How it is built

| Step | What happens |
|------|----------------|
| **Source** | The dashboard content is produced by the script **`scripts/update-pages-history-site.mjs`**. It runs only on the **`main`** branch (see workflow conditions below). |
| **Inputs** | The script reads: (1) the **Allure report** folder (default `allure-report/`), (2) the **report-history site** from the previous run (cloned from branch `report-history` into `.pages-site`), (3) optional **analysis** files from `reports/`. |
| **Output** | It writes into **`.pages-site`**: the new run’s Allure report, updated history, and the new `index.html`. That folder is then pushed to branch `report-history` and also copied (without `.git`) to **`.pages-artifact/`** for GitHub Pages deployment. |

### Where the dashboard “lives”

- **Branch:** A dedicated branch **`report-history`** stores the full static site (all past runs’ reports + `index.html` + `reports/history.json`). The workflow clones this branch at the start of the dashboard steps; after the script runs, it commits and pushes back to `report-history`.
- **Deployment:** The **same content** (without `.git`) is uploaded as a **GitHub Actions artifact** via `actions/upload-pages-artifact@v3` and then deployed with **`actions/deploy-pages@v4`**. So the **published** site is whatever is in that artifact, not the branch content directly—but in practice they match.
- **URL:** GitHub Pages serves the site at the repo’s Pages URL (e.g. `https://<owner>.github.io/<repo>/`). That URL is the “dashboard” link you share.

### Key settings and env vars (dashboard script)

- **`PAGES_SITE_DIR`** — Where the script writes the site. Set in the workflow to **`.pages-site`**.
- **`SOURCE_REPORT_DIR`** — Allure report folder to copy into the site. Set to **`allure-report`**.
- **`BV_ENV`** — Environment name (e.g. `dev`, `preview`, `stg`, `prod`). Used in the run stamp and in the history entry.
- **`GITHUB_RUN_NUMBER`**, **`GITHUB_RUN_ID`**, **`GITHUB_SHA`**, **`GITHUB_REPOSITORY`**, **`GITHUB_SERVER_URL`** — Used to build run stamp, history entry, and link to the Actions run.

### Run stamp and folder structure

- **Run stamp format:** `{ISO8601-date}-run-{GITHUB_RUN_NUMBER}` (e.g. `2026-02-17T12-30-00-000Z-run-42`). Colons and dots in the date are replaced by hyphens.
- **Path for this run’s report:** `reports/<BV_ENV>/<runStamp>/`. The entire **`allure-report/`** folder is copied there, so the Allure report’s entry point is `reports/<env>/<runStamp>/index.html`.
- **History file:** `reports/history.json` in `.pages-site`. It is an array of run entries (newest first after prepend). Each entry has: `id`, `date`, `env`, `runNumber`, `runId`, `sha`, `reportPath`, `analysisPath` (optional), `runUrl`.

### Workflow steps that affect the dashboard (main branch only)

- **Pull report-history branch** — Clone `report-history` into `.pages-site`, or init a new repo and create the branch if it doesn’t exist.
- **Update public report history site** — Run `node ./scripts/update-pages-history-site.mjs` with `PAGES_SITE_DIR=.pages-site` and `SOURCE_REPORT_DIR=allure-report`.
- **Commit and push report-history** — Commit all changes in `.pages-site` and push to `report-history`.
- **Prepare Pages artifact folder** — Copy `.pages-site` to `.pages-artifact/` and remove `.git`.
- **Upload Allure report to Pages artifact** — `upload-pages-artifact` with `path: .pages-artifact/`.
- **deploy-report job** — Uses `configure-pages@v5` and `deploy-pages@v4` to publish the artifact to GitHub Pages.

---

## 3. Allure

### What we use

- **Packages (npm):**
  - **`allure-playwright`** — Playwright reporter that writes Allure results (e.g. into `allure-results/`) during tests.
  - **`allure-commandline`** — Provides the `allure generate` command to build the HTML report from raw results.
- **Reporter usage:** In CI we **override** the config reporter by running:
  - `npx playwright test --reporter=line,html,allure-playwright`
  - So we get: **line** (console), **html** (Playwright’s own report → `playwright-report/`), and **allure-playwright** (Allure raw data → `allure-results/`). The base `playwright.config.ts` has `reporter: 'html'`; the CLI reporters replace it for that run.

### Output directories

- **`allure-results/`** — Raw Allure data produced by the reporter (and where we inject `history` and metadata before generating). This folder is **not** deployed to the dashboard; the generated report is.
- **`allure-report/`** — Generated HTML report produced by `allure generate`. This is the folder that gets copied into the dashboard site at `reports/<env>/<runStamp>/`.

### How the report is generated (script)

- **Script:** **`scripts/generate-allure-with-history.mjs`**.
- **Invocation:** Run as **`npm run allure:generate`** (defined in `package.json` as `node ./scripts/generate-allure-with-history.mjs`).
- **Steps inside the script:**
  1. **Preserve history:** If `allure-report/history` already exists (e.g. from a previous run), copy it into `allure-results/history` so the Allure generator can include it (trends, previous runs).
  2. **Metadata files:** Write into `allure-results/`:
     - **`environment.properties`** — Lines: `environment=<BV_ENV>`, `baseUrl=<base URL or placeholder>`, `generatedAt=<ISO8601>`.
     - **`executor.json`** — Name, type, buildName, buildOrder (run number), buildUrl (link to GitHub Actions run), reportName. These appear in the Allure UI.
  3. **Generate:** Run `npx allure generate allure-results --clean -o allure-report` so the HTML report is produced in `allure-report/`.

### Environment variables used by the Allure script

- **`BV_ENV`** — Environment name (e.g. `dev`).
- **`BV_BASE_URL`**, **`BV_DEV_BASE_URL`**, etc. — Base URL for the run (optional).
- **`GITHUB_RUN_NUMBER`**, **`GITHUB_SERVER_URL`**, **`GITHUB_REPOSITORY`**, **`GITHUB_RUN_ID`** — For executor build order and build URL.

### History between runs (CI)

- **Restore:** Step **“Restore Allure history cache”** uses **`actions/cache/restore@v4`** with:
  - **path:** `.allure-history-cache`
  - **key:** `allure-history-${{ github.ref_name }}-${{ github.run_id }}`
  - **restore-keys:** `allure-history-${{ github.ref_name }}-`
- **Inject:** Step **“Inject previous Allure history”** runs only if `.allure-history-cache/history` exists: it copies that into **`allure-results/history`** before **“Generate Allure report”** runs. So the generator sees previous run data and can show trends.
- **Save:** After generation, **“Update Allure history cache payload”** copies **`allure-report/history`** to **`.allure-history-cache/history`**, then **“Save Allure history cache”** saves that with **`actions/cache/save@v4`** (same path, key derived from restore step). So the next run on the same branch can restore this history.

---

## 4. Runs

### When a run is triggered

Defined in **`.github/workflows/playwright.yml`** under **`on`**:

| Trigger | Branches / schedule |
|--------|----------------------|
| **push** | `main`, `master` |
| **pull_request** | `main`, `master` |
| **schedule** | Cron `0 2 * * *` (02:00 UTC daily; noted as 23:00 BRT) |
| **workflow_dispatch** | Manual run with inputs: **target_env** (dev/preview/stg/prod), optional **base_url_override** |

### Run name

- **`run-name`:** `Playwright (${{ ... }}) #${{ github.run_number }}` — so the chosen env (or default) and the run number appear in the Actions list.

### Environment and secrets

- **`BV_ENV`** — Set to the workflow-dispatch input **target_env** when the event is `workflow_dispatch`; otherwise **`dev`**.
- **`BV_BASE_URL`** — Set from **base_url_override** when provided (overrides env-based URL).
- **`BV_DEV_USER`**, **`BV_DEV_PASSWORD`** — From repo **secrets** (used for auth in tests when needed).

### Test execution step

- **Command:** `npx playwright test --reporter=line,html,allure-playwright`
- **id:** `playwright_tests`
- **continue-on-error:** `true` — so the workflow does not fail the job if tests fail; we still generate reports and deploy.

### Artifacts uploaded (per run)

All use **`actions/upload-artifact@v4`** with **retention-days: 90** and names that include **`BV_ENV`** and **`github.run_number`**:

| Artifact name pattern | Path | Purpose |
|------------------------|------|---------|
| **playwright-report-&lt;env&gt;-run-&lt;number&gt;** | `playwright-report/` | Playwright’s built-in HTML report. |
| **allure-results-&lt;env&gt;-run-&lt;number&gt;** | `allure-results/` | Raw Allure results (for debugging or local regenerate). |
| **allure-report-&lt;env&gt;-run-&lt;number&gt;** | `allure-report/` | Generated Allure HTML report (same content that is later copied into the dashboard). |

### Test summary step

- **Runs:** **`if: always()`** so it runs even if earlier steps fail.
- **Data source:** **`allure-report/widgets/summary.json`** — reads `statistic.passed`, `statistic.total`, `statistic.skipped`, and failed/broken/unknown for “other”.
- **Output:** Logs and **GitHub Step Summary** (markdown) with: environment, passed/total, pass rate %, skipped, other, and the three artifact names. Title used: **“✅ Test Summary”**.

### Dashboard run entry (history)

For each run that updates the dashboard (main branch only), the script adds one entry to **`reports/history.json`** with:

- **id:** `{GITHUB_RUN_ID}-{BV_ENV}` (deduped so the same run+env updates the same row).
- **date:** ISO8601 of when the script ran.
- **env:** `BV_ENV`.
- **runNumber:** `GITHUB_RUN_NUMBER`.
- **runId:** `GITHUB_RUN_ID`.
- **sha:** First 7 characters of `GITHUB_SHA`.
- **reportPath:** `reports/<env>/<runStamp>/index.html`.
- **analysisPath:** Set if an analysis file was found and converted (see Analysis section).
- **runUrl:** Link to the GitHub Actions run (e.g. `https://github.com/<repo>/actions/runs/<runId>`).

---

## 5. Analysis

### What “analysis” means here

- **Regression analysis** — A human- or tool-generated Markdown report that summarizes a run (e.g. failures, classification, next steps). We do **not** generate this file automatically in the workflow; it is expected to exist in the repo under **`reports/`** when you want it linked from the dashboard.

### Naming convention

- **Pattern:** **`REGRESSION_ANALYSIS_*.md`** (e.g. `REGRESSION_ANALYSIS_2026-02-24.md`).
- **Location:** **`reports/`** (repository root level, same directory that might hold other report outputs).

### How the dashboard script uses it

- **When:** Only when building the dashboard (main branch) and when **`reports/`** exists.
- **Selection:** The script lists files in **`reports/`** matching **`/^REGRESSION_ANALYSIS_.*\.md$/i`**, sorts them (string sort), takes the **latest** (last after reverse).
- **Copy:** That file is copied into the **current run’s** report folder as **`REGRESSION_ANALYSIS.md`**.
- **HTML version:** The script converts the Markdown to HTML via **`markdownToHtml()`** and wraps it in **`buildAnalysisHtml()`** (styled page with header, “Back to report history” link, env, run stamp). The result is written as **`REGRESSION_ANALYSIS.html`** in the same run folder.
- **Link:** The history entry gets **`analysisPath`** = `reports/<env>/<runStamp>/REGRESSION_ANALYSIS.html`. The dashboard table shows an “Open analysis” link for that run when `analysisPath` is set.

### Important note

- The **same** “latest” analysis file is attached to **every** run that happens while that file remains the latest. So if you want each run to have its own analysis, your process must produce and commit a new `REGRESSION_ANALYSIS_<date>.md` (or similar) per run; the script will then pick the newest one at the time it runs.

---

## 6. GitHub configuration

### Workflow permissions

In **`.github/workflows/playwright.yml`**:

```yaml
permissions:
  contents: write   # push to report-history, etc.
  actions: read
  pages: write      # required for deploy-pages
  id-token: write   # required for deploy-pages
```

### GitHub Pages

- **Source:** **GitHub Actions** (not “Deploy from a branch”). Configure in: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
- **Deployment:** The **deploy-report** job uses the **`github-pages`** environment and **`actions/deploy-pages@v4`** to publish the artifact uploaded by the **test** job. The Pages URL is shown in the workflow run (and in **Settings → Pages**).

### Branch policy for dashboard updates

- All steps that **modify the dashboard** (clone report-history, run update script, push report-history, upload pages artifact) use:
  - **`if: always() && !cancelled() && github.ref == 'refs/heads/main'`**
- So the dashboard is updated **only** when the workflow runs on **main** (e.g. push to main or merge to main). PR runs do not update the dashboard or deploy.

---

## 7. File and folder reference

| Item | Path / value |
|------|----------------|
| Workflow | `.github/workflows/playwright.yml` |
| Dashboard script | `scripts/update-pages-history-site.mjs` |
| Allure generate script | `scripts/generate-allure-with-history.mjs` |
| Allure report (generated) | `allure-report/` |
| Allure raw results | `allure-results/` |
| Playwright HTML report | `playwright-report/` |
| Report history branch | `report-history` |
| Dashboard site (during workflow) | `.pages-site/` |
| Pages artifact (upload) | `.pages-artifact/` |
| History metadata | `.pages-site/reports/history.json` → deployed as `reports/history.json` |
| Run report path | `reports/<BV_ENV>/<runStamp>/` (e.g. `reports/dev/2026-02-17T12-30-00-000Z-run-42/`) |
| Analysis source folder | `reports/` |
| Analysis file pattern | `REGRESSION_ANALYSIS_*.md` |
| npm script Allure generate | `allure:generate` → `node ./scripts/generate-allure-with-history.mjs` |
| Test summary source | `allure-report/widgets/summary.json` |
| Cache path (Allure history) | `.allure-history-cache` |
| Cache key prefix | `allure-history-${{ github.ref_name }}` |

---

*This document reflects the setup as implemented in the repository. When replicating in another repo (e.g. BV), adjust repository names, URLs, and branch names as needed.*
