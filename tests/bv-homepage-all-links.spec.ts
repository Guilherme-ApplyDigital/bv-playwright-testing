import { test } from '../fixtures/bvFixtures';
import { INTERNAL_PATHS } from './data/internalPaths';

test.describe('BV Homepage – All internal links (link smoke)', () => {
  for (const path of INTERNAL_PATHS) {
    const label = path || '/';
    test(`Link – ${label}`, async ({ homePage }) => {
      await homePage.gotoPath(path || '/');
      await homePage.assertPageNotBroken();
    });
  }
});
