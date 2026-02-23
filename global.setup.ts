import { chromium, type FullConfig, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { resolveBaseUrl } from './utils/environment';

const AUTH_FILE_PATH = 'playwright/.auth/user.json';

async function acceptCookiesIfPresent(page: Page) {
  const acceptButton = page.getByRole('button', { name: /Accept All Cookies/i }).first();
  const visibleNow = await acceptButton.isVisible().catch(() => false);
  if (visibleNow) {
    await acceptButton.click({ timeout: 5_000 }).catch(() => null);
  } else {
    await acceptButton.click({ timeout: 1_200 }).catch(() => null);
  }
}

async function globalSetup(_config: FullConfig) {
  const baseUrl = resolveBaseUrl();
  const username = process.env.BV_DEV_USER ?? process.env.BV_USERNAME;
  const password = process.env.BV_DEV_PASSWORD ?? process.env.BV_PASSWORD;

  if (!username || !password) {
    // Keep setup non-fatal locally; tests that require login already raise a clear error.
    return;
  }

  mkdirSync(dirname(AUTH_FILE_PATH), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 45_000 });

  if (page.url().includes('/login')) {
    await acceptCookiesIfPresent(page);
    await page.locator('input[placeholder="User"]').first().fill(username);
    await page.locator('input[placeholder="Password"]').first().fill(password);
    await Promise.all([
      page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 45_000 }),
      page.getByRole('button', { name: /^Log in$/i }).click(),
    ]);
  }

  await acceptCookiesIfPresent(page);
  await page.context().storageState({ path: AUTH_FILE_PATH });
  await browser.close();
}

export default globalSetup;
