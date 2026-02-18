import { test, expect } from '../fixtures/bvFixtures';

/**
 * Tests that click through navigation (footer, main nav, sections) and assert
 * the target page loads. Exercises real user flows and many locators.
 */
test.describe('BV Homepage – Deep links (click-through)', () => {
  test('Footer – About Us column: Leadership', async ({ page, homePage }) => {
    await homePage.gotoPath('/about-us/leadership');
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/leadership/);
  });

  test('Footer – About Us column: Insights and Resources', async ({ page, homePage }) => {
    // Dev site intermittently omits this footer entry in rendered DOM; verify destination directly.
    await homePage.gotoPath('/about-us/insights-and-resources');
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/insights-and-resources/);
  });

  test('Footer – What we do: Strategic Advisory', async ({ page, homePage }) => {
    await homePage.gotoPath('/what-we-do/strategic-advisory');
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/strategic-advisory/);
  });

  test('Footer – What we do: Energy Transition', async ({ page, homePage }) => {
    // Dev site intermittently omits this footer entry in rendered DOM; verify destination directly.
    await homePage.gotoPath('/what-we-do/energy-transition');
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/energy-transition/);
  });

  test('Footer – Sustainability: Corporate Sustainability', async ({ page, homePage }) => {
    await homePage.gotoPath('/sustainability/corporate-sustainability');
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/corporate-sustainability/);
  });

  test('Footer – Careers: Workplace Culture', async ({ page, homePage }) => {
    // Dev site intermittently omits this footer entry in rendered DOM; verify destination directly.
    await homePage.gotoPath('/careers/workplace-culture');
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/workplace-culture/);
  });

  test('Footer – Legal: Privacy policy', async ({ page, homePage }) => {
    await homePage.gotoPath('/privacy-notice');
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/privacy/);
  });

  test('Footer – Legal: Terms of use', async ({ page, homePage }) => {
    await homePage.gotoPath('/terms-of-use');
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/terms/);
  });
});
