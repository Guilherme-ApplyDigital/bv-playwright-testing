import { test } from '../fixtures/bvFixtures';
import { INTERNAL_PATHS } from './data/internalPaths';

test.describe('BV Homepage – All internal links (link smoke)', () => {
  for (const path of INTERNAL_PATHS) {
    const label = path || '/';
    test(`Link – ${label}`, async ({ homePage, page }) => {
      let lastError: unknown;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await homePage.gotoPath(path || '/');
          await homePage.assertPageNotBroken();
          return;
        } catch (error) {
          lastError = error;
          if (attempt < 3) {
            if (!page.isClosed()) {
              await page.waitForTimeout(1_500 * attempt);
            }
          }
        }
      }
      throw lastError;
    });
  }
});
