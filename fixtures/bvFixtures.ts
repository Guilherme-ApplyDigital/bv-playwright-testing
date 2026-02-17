import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { createLogger } from '../utils/logger';

export const BASE_URL = process.env.BV_BASE_URL ?? 'https://develop--bv-ad.netlify.app';

type Fixtures = {
  homePage: HomePage;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const logger = createLogger('HomePage');
    const homePage = new HomePage(page, logger, BASE_URL);
    await use(homePage);
  },
});

export { expect };

