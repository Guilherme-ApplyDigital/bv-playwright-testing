import { test, expect } from '../fixtures/bvFixtures';

test.describe('BV Homepage – Feature cards', () => {
  test('Card – It’s a new era for power utilities', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.openFeatureCard("It's a new era for power utilities");
    await expect(page).not.toHaveTitle(/Not Found/i);
  });

  test('Card – Floating solar powers Philippine mine', async ({ page, homePage }) => {
    test.skip(!!process.env.CI, 'Carousel content varies in CI');
    await homePage.goto();
    await homePage.openFeatureCard('Floating solar powers Philippine mine');
    await expect(page).not.toHaveTitle(/Not Found/i);
  });

  test('Card – AI on the frontlines: battling cyberattacks', async ({ page, homePage }) => {
    test.skip(!!process.env.CI, 'Carousel content varies in CI');
    await homePage.goto();
    await homePage.openFeatureCard('AI on the frontlines: battling cyberattacks');
    await expect(page).not.toHaveTitle(/Not Found/i);
  });
});

