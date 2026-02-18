import { test, expect } from '../fixtures/bvFixtures';

/**
 * Section-by-section locator checks: visibility of headings, CTAs, and key links
 * across the full homepage. No navigation away; pure "does this exist and is visible".
 */
test.describe('BV Homepage – Sections and locators', () => {
  test('Hero – headline and primary CTA', async ({ page, homePage }) => {
    await homePage.goto();
    await expect(page.getByRole('heading', { name: /Bold infrastructure our future depends on/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'See bolder vision in action' })).toBeVisible();
  });

  test('Hero – KPIs (Years, Projects, Employees)', async ({ homePage }) => {
    await homePage.goto();
    await homePage.assertHeroKpis();
  });

  test('Mega nav – About Us dropdown items', async ({ page, homePage }) => {
    await homePage.goto();
    const header = page.locator('header');
    await header.getByText('About Us', { exact: true }).first().click();
    await expect(page.getByRole('link', { name: 'Leadership' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Insights and Resources' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'History' }).first()).toBeVisible();
  });

  test('Mega nav – Who we serve dropdown items', async ({ page, homePage }) => {
    await homePage.goto();
    const header = page.locator('header');
    await header.getByText('Who we serve', { exact: true }).first().click();
    await expect(page.getByRole('link', { name: 'Technology and Data Centers' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Power Providers' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Water Utilities' }).first()).toBeVisible();
  });

  test('Mega nav – What we do dropdown items', async ({ page, homePage }) => {
    await homePage.goto();
    const header = page.locator('header');
    await header.getByText('What we do', { exact: true }).first().click();
    await expect(page.getByRole('link', { name: 'Strategic Advisory' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Energy Transition' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lifecycle Services' }).first()).toBeVisible();
  });

  test('Mega nav – Sustainability dropdown items', async ({ page, homePage }) => {
    await homePage.goto();
    const header = page.locator('header');
    await header.getByText('Sustainability', { exact: true }).first().click();
    await expect(page.getByRole('link', { name: 'Corporate Sustainability' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Client Sustainability' }).first()).toBeVisible();
  });

  test('Section – Solutions intro (infrastructure challenges or Spotlight)', async ({ page, homePage }) => {
    await homePage.goto();
    const main = page.getByRole('main');
    await expect(
      main.getByText(/infrastructure challenges|Solutions Spotlight/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('Section – Solutions Spotlight heading', async ({ page, homePage }) => {
    await homePage.goto();
    await expect(page.getByRole('main').getByRole('heading', { name: /Solutions Spotlight/i }).first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test('Section – Energy Transition Learn more', async ({ page, homePage }) => {
    await homePage.goto();
    const main = page.getByRole('main');
    await expect(main.getByRole('link', { name: /Learn more/i }).first()).toBeVisible();
  });

  test('Section – Projects block (project link to article)', async ({ page, homePage }) => {
    await homePage.goto();
    const main = page.getByRole('main');
    await main.locator('a[href*="/projects/"]').first().scrollIntoViewIfNeeded();
    await expect(main.locator('a[href*="/projects/"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('Section – Lifecycle services steps visible', async ({ homePage }) => {
    await homePage.goto();
    await homePage.assertLifecycleServicesSection();
  });

  test('Section – Our sustainable vision', async ({ page, homePage }) => {
    await homePage.goto();
    await expect(page.getByRole('heading', { name: /Our sustainable vision/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore more' }).first()).toBeVisible();
  });

  test('Section – Our company (purpose, people, insights)', async ({ page, homePage }) => {
    await homePage.goto();
    await expect(page.getByText(/Our purpose|Building a World of Difference/).first()).toBeVisible();
    await expect(page.getByText(/100% employee owned/).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Learn more' }).first()).toBeVisible();
  });

  test('Footer – all four column headings', async ({ page, homePage }) => {
    await homePage.goto();
    const footer = page.locator('footer');
    await expect(footer.getByText('About Us').first()).toBeVisible();
    await expect(footer.getByText('Who we serve').first()).toBeVisible();
    await expect(footer.getByText('What we do').first()).toBeVisible();
    await expect(footer.getByText('Sustainability').first()).toBeVisible();
    await expect(footer.getByText('Careers').first()).toBeVisible();
  });

  test('Footer – Accessibility link', async ({ page, homePage }) => {
    await homePage.goto();
    await expect(page.locator('footer').getByRole('link', { name: 'Accessibility' }).first()).toBeVisible();
  });

  test('Header – Search button', async ({ page, homePage }) => {
    await homePage.goto();
    await expect(page.locator('button[aria-label="Search Black & Veatch"]')).toBeVisible();
  });

  test('Header – Logo link to home', async ({ page, homePage }) => {
    await homePage.goto();
    const logo = page.locator('header').locator('a[href="/"], a[href="/en-US"]').first();
    await expect(logo).toBeVisible();
  });
});
