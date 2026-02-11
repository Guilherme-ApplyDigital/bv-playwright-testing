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

