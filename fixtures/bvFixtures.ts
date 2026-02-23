import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { createLogger } from '../utils/logger';
import { resolveBaseUrl } from '../utils/environment';

export const BASE_URL = resolveBaseUrl();

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

