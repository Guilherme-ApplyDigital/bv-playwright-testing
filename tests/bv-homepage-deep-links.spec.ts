import { test, expect } from '../fixtures/bvFixtures';

/**
 * Tests that click through navigation (footer, main nav, sections) and assert
 * the target page loads. Exercises real user flows and many locators.
 */
test.describe('BV Homepage – Deep links (click-through)', () => {
  test('Footer – About Us column: Leadership', async ({ page, homePage }) => {
    await homePage.goto();
    await page.locator('footer').getByRole('link', { name: 'Leadership' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/leadership/);
  });

  test('Footer – About Us column: Insights and Resources', async ({ page, homePage }) => {
    await homePage.goto();
    await page.locator('footer').getByRole('link', { name: 'Insights and Resources' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/insights-and-resources/);
  });

  test('Footer – What we do: Strategic Advisory', async ({ page, homePage }) => {
    await homePage.goto();
    await page.locator('footer').getByRole('link', { name: 'Strategic Advisory' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/strategic-advisory/);
  });

  test('Footer – What we do: Energy Transition', async ({ page, homePage }) => {
    await homePage.goto();
    await page.locator('footer').getByRole('link', { name: 'Energy Transition' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/energy-transition/);
  });

  test('Footer – Sustainability: Corporate Sustainability', async ({ page, homePage }) => {
    await homePage.goto();
    await page.locator('footer').getByRole('link', { name: 'Corporate Sustainability' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/corporate-sustainability/);
  });

  test('Footer – Careers: Workplace Culture', async ({ page, homePage }) => {
    await homePage.goto();
    await page.locator('footer').getByRole('link', { name: 'Workplace Culture' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/workplace-culture/);
  });

  test('Footer – Legal: Privacy policy', async ({ page, homePage }) => {
    await homePage.goto();
    await page.locator('footer').getByRole('link', { name: 'Privacy policy' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/privacy/);
  });

  test('Footer – Legal: Terms of use', async ({ page, homePage }) => {
    await homePage.goto();
    await page.locator('footer').getByRole('link', { name: 'Terms of use' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/terms/);
  });
});
