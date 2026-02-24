## playwright-mcp-poc

**Purpose**: End-to-end functional smoke tests for the Black & Veatch homepage using Playwright and the Playwright MCP Server, structured with Page Object Model (POM), fixtures, and utilities.

### Project structure

- **`playwright.config.ts`**: Global Playwright configuration (test directory, projects, reporter).
- **`tests/`**: Test specs.
  - `bv-homepage.spec.ts`: Full homepage smoke suite covering scenarios 1–5 from `notes/prompt.txt`.
  - `example.spec.ts`: Default Playwright sample tests.
- **`pages/`**: Page Object Model classes.
  - `homePage.ts`: Home page actions, navigation, search, and feature card interactions.
  - `contentPages.ts`: Typed page classes for About Us, Who We Serve, What We Do, Sustainability, Projects, Careers, Contact, Newsroom, Locations, and Search results.
- **`fixtures/`**
  - `bvFixtures.ts`: Custom Playwright `test` with a reusable `homePage` fixture and `BASE_URL`.
- **`utils/`**
  - `logger.ts`: Simple logger used across pages and tests to log major actions and assertions.
- **`notes/`**
  - `prompt.txt`: Original step-by-step instructions for this proof of concept.

### Install dependencies

From the project root:

```bash
npm install
```

This installs Playwright Test and its TypeScript types (browsers should already be installed from `npm init playwright@latest`, but you can re-run `npx playwright install` if needed).

### Run tests by environment

Default environment is `dev`.

```bash
npm run test:dev
npm run test:preview
npm run test:stg
npm run test:prod
```

Environment resolution priority:

1. `BV_BASE_URL` (full override)
2. `BV_ENV` (`dev`, `preview`, `stg`, `prod`)
3. Built-in defaults:
   - `dev`: `https://develop--bv-ad.netlify.app`
   - `preview`: `https://preview--bv-ad.netlify.app`
   - `stg`: `https://staging--bv-ad.netlify.app`
   - `prod`: `https://www.bv.com`

Optional URL overrides:

```bash
BV_DEV_BASE_URL="https://develop--bv-ad.netlify.app" npm run test:dev
BV_PREVIEW_BASE_URL="https://preview--bv-ad.netlify.app" npm run test:preview
BV_STG_BASE_URL="https://staging--bv-ad.netlify.app" npm run test:stg
BV_PROD_BASE_URL="https://www.bv.com" npm run test:prod
```

Authentication behavior:
- `dev`, `preview`, and `stg`: login is expected when redirected to `/login` (credentials from env secrets/vars).
- `prod`: login is not used by default.

### Run tests (headless)

From the project root:

```bash
npx playwright test
```

Or via npm script:

```bash
npm test
```

### Run tests (headed)

```bash
npx playwright test --headed
```

Or run a single test file:

```bash
npx playwright test tests/bv-homepage.spec.ts --headed
```

### Generate Playwright HTML report

Run the tests, then open the report:

```bash
npx playwright test
npx playwright show-report
```

The report directory (`playwright-report`) is already excluded via `.gitignore`.

### Preserve report history (do not lose prior runs)

Generate Allure with previous history (trend preservation):

```bash
npm run allure:generate
```

Archive current run artifacts with timestamp:

```bash
npm run report:archive
```

This saves copies of `playwright-report`, `allure-results`, and `allure-report` under:

- `reports/history/<timestamp>/...`

In CI (GitHub Actions):
- Allure trend history is preserved between runs via cache (`history` folder).
- Each run uploads unique artifacts with environment in the name (`dev/preview/stg/prod`).
- Artifact retention is configured for 90 days.
- Allure report metadata includes `environment`, `baseUrl`, and run link in the report widgets.
- GitHub Pages publishes a public history site from branch `report-history`.
- The landing page (`index.html`) lists each execution with:
  - Date/time (UTC)
  - Environment (`dev/preview/stg/prod`)
  - Exact run number
  - Commit SHA
  - Link to that run report

