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

  test('Quick Links – Power Generation', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: 'Power Generation' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/power-generation/);
  });

  test('Quick Links – Water', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: 'Water' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/what-we-do\/water/);
  });

  test('Quick Links – Lifecycle Services', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: 'Lifecycle Services' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/lifecycle-services/);
  });

  test('Solutions Spotlight – Energy Transition card', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('main').getByRole('link', { name: /Energy Transition/ }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/energy-transition/);
  });

  test('Solutions Spotlight – Hydrogen', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: /Hydrogen/ }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/hydrogen/);
  });

  test('Solutions Spotlight – Power Delivery card', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('main').getByRole('link', { name: /Power Delivery/ }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/power-delivery/);
  });

  test('Locations – See all offices', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: 'See all offices' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/office-locations/);
  });

  test('Locations – Americas', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: 'Americas' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/americas/);
  });

  test('Hero CTA – See bolder vision in action', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: 'See bolder vision in action' }).click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/bolder-vision/);
  });

  test('About section – Learn about Black & Veatch', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: 'Learn about Black & Veatch' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/about-us/);
  });

  test('Who we serve – Explore our Industries', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: 'Explore our Industries' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/who-we-serve/);
  });

  test('What we do – Explore our offerings', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: 'Explore our offerings' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/what-we-do/);
  });

  test('Sustainability – Sustainability at Black & Veatch', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: 'Sustainability at Black & Veatch' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/sustainability/);
  });

  test('Careers – Explore Careers at Black & Veatch', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: 'Explore Careers at Black & Veatch' }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/careers/);
  });

  test('Contact – Let\'s talk', async ({ page, homePage }) => {
    await homePage.goto();
    await page.getByRole('link', { name: "Let's talk" }).first().click();
    await homePage.assertPageNotBroken();
    await expect(page).toHaveURL(/contact/);
  });
});
