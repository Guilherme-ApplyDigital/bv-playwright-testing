import { test } from '../fixtures/bvFixtures';

test.describe('BV Homepage – Structure and layout', () => {
  test('Header and main navigation', async ({ homePage }) => {
    await homePage.goto();
    await homePage.assertHeaderNavItemsPresent();
    await homePage.assertUpperRightNavItemsPresent();
  });

  test('Hero, CTA and KPIs', async ({ homePage }) => {
    await homePage.goto();
    await homePage.assertHeroVisible();
    await homePage.assertPrimaryCtaVisible();
    await homePage.assertHeroKpis();
  });

  test('Quick Links', async ({ homePage }) => {
    await homePage.goto();
    await homePage.assertQuickLinksSection();
  });

  test('Lifecycle services', async ({ homePage }) => {
    await homePage.goto();
    await homePage.assertLifecycleServicesSection();
  });

  test('Footer and link columns', async ({ homePage }) => {
    await homePage.goto();
    await homePage.assertFooterSections();
  });
});

