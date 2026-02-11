import { Page, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

export class HomePage {
  constructor(
    private readonly page: Page,
    private readonly logger: Logger,
    private readonly baseUrl: string,
  ) {}

  async goto() {
    this.logger.info(`Navigating to homepage: ${this.baseUrl}`);
    // Use domcontentloaded to avoid hanging on slow third-party resources.
    await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
    await this.acceptCookiesIfPresent();
  }

  async assertHeroVisible() {
    this.logger.info('Asserting hero headline is visible');
    // Use heading role to avoid strict-mode ambiguity between h2 and span.
    await expect(
      this.page.getByRole('heading', { name: /Bold infrastructure our future depends on/i }),
    ).toBeVisible();
  }

  async assertPrimaryCtaVisible() {
    this.logger.info('Asserting primary CTA button is visible');
    await expect(this.page.getByRole('link', { name: 'See bolder vision in action' })).toBeVisible();
  }

  private async acceptCookiesIfPresent() {
    this.logger.info('Checking for cookie banner');
    const banner = this.page.getByRole('dialog', { name: /Privacy/i }).first();
    try {
      if (await banner.isVisible()) {
        this.logger.info('Cookie banner visible, accepting all cookies');
        await banner.getByRole('button', { name: /Accept All Cookies/i }).click();
      }
    } catch {
      // Banner not present in this run; ignore.
      this.logger.debug('Cookie banner not present or already dismissed');
    }
  }

  async assertHeaderNavItemsPresent() {
    this.logger.info('Asserting main header navigation items are visible');
    const header = this.page.locator('header');
    const items = ['About Us', 'Who we serve', 'What we do', 'Sustainability', 'Projects', 'Careers'];
    for (const text of items) {
      this.logger.info(`Checking header nav item: ${text}`);
      await expect(header.getByText(text, { exact: true }).first()).toBeVisible();
    }
  }

  async assertUpperRightNavItemsPresent() {
    this.logger.info('Asserting upper-right navigation items are visible');
    const header = this.page.locator('header');
    const items = ['Contact', 'Newsroom', 'Supplier', 'Locations'];
    for (const text of items) {
      this.logger.info(`Checking upper-right nav item: ${text}`);
      await expect(header.getByText(text, { exact: true }).first()).toBeVisible();
    }
  }

  async assertHeroKpis() {
    this.logger.info('Asserting hero KPI metrics are visible');
    await expect(this.page.getByText('Years in business')).toBeVisible();
    await expect(this.page.getByText('Active Projects')).toBeVisible();
    await expect(this.page.getByText('Employees')).toBeVisible();
  }

  async assertQuickLinksSection() {
    this.logger.info('Asserting Quick Links section and key links are visible');
    await expect(this.page.getByText('Quick Links')).toBeVisible();
    const quickLinks = [
      'Strategic Advisory',
      'Energy Transition',
      'Power Generation',
      'Power Delivery',
      'Water',
      'Process',
      'Fuels',
      'Industrial Cybersecurity',
      'Environmental',
      'Lifecycle Services',
    ];
    for (const name of quickLinks) {
      this.logger.info(`Checking Quick Link: ${name}`);
      await expect(this.page.getByRole('link', { name }).first()).toBeVisible();
    }
  }

  async assertLifecycleServicesSection() {
    this.logger.info('Asserting Lifecycle services section is visible');
    // Scope to main so we get the visible section (other matches may be in hidden carousel/overlay)
    const main = this.page.getByRole('main');
    await expect(main.getByText(/Lifecycle [Ss]ervices/).first()).toBeVisible();
    const steps = [
      'Strategy',
      'Planning',
      'Engineering',
      'Procurement',
      'Construction',
      'Operations',
      'Modernization',
      'Decommissioning',
    ];
    for (const step of steps) {
      this.logger.info(`Checking lifecycle step: ${step}`);
      await expect(main.getByText(step).first()).toBeVisible();
    }
  }

  async assertFooterSections() {
    this.logger.info('Asserting footer navigation sections and key links are visible');
    const footer = this.page.locator('footer');

    const footerTexts = [
      'About Us',
      'Leadership',
      'Insights and Resources',
      'Newsroom',
      'Who we serve',
      'What we do',
      'Sustainability',
      'Careers',
      'Accessibility',
      'Privacy policy',
      'Terms of use',
      'Compliance',
      'Copyright ©',
    ];

    for (const text of footerTexts) {
      this.logger.info(`Checking footer text/link: ${text}`);
      await expect(footer.getByText(text, { exact: false }).first()).toBeVisible();
    }
  }

  // Top navigation (navigate directly to canonical URLs for stability)
  async openAboutUs() {
    this.logger.info('Opening About Us page from top navigation');
    await this.page.goto(this.baseUrl + '/about-us', { waitUntil: 'domcontentloaded' });
  }

  async openWhoWeServe() {
    this.logger.info('Opening Who We Serve page from top navigation');
    await this.page.goto(this.baseUrl + '/who-we-serve', { waitUntil: 'domcontentloaded' });
  }

  async openWhatWeDo() {
    this.logger.info('Opening What We Do page from top navigation');
    await this.page.goto(this.baseUrl + '/what-we-do', { waitUntil: 'domcontentloaded' });
  }

  async openSustainability() {
    this.logger.info('Opening Sustainability page from top navigation');
    await this.page.goto(this.baseUrl + '/sustainability', { waitUntil: 'domcontentloaded' });
  }

  async openProjects() {
    this.logger.info('Opening Projects page from top navigation');
    await this.page.goto(this.baseUrl + '/projects', { waitUntil: 'domcontentloaded' });
  }

  async openCareers() {
    this.logger.info('Opening Careers page from top navigation');
    await this.page.goto(this.baseUrl + '/careers', { waitUntil: 'domcontentloaded' });
  }

  // Upper right navigation
  async openContact() {
    this.logger.info('Opening Contact page from upper-right navigation');
    const header = this.page.locator('header');
    await header.getByText('Contact', { exact: true }).first().click();
  }

  async openNewsroom() {
    this.logger.info('Opening Newsroom page from upper-right navigation');
    const header = this.page.locator('header');
    await header.getByText('Newsroom', { exact: true }).first().click();
  }

  async openSupplier() {
    this.logger.info('Opening Supplier portal from upper-right navigation');
    const header = this.page.locator('header');
    await header.getByText('Supplier', { exact: true }).first().click();
  }

  async openLocations() {
    this.logger.info('Opening Locations page from upper-right navigation');
    const header = this.page.locator('header');
    await header.getByText('Locations', { exact: true }).first().click();
  }

  // Search
  async openSearch() {
    this.logger.info('Opening search from header');
    await this.page.locator('button[aria-label="Search Black & Veatch"]').click();
  }

  async searchFor(term: string) {
    this.logger.info(`Searching for term: ${term}`);
    const input = this.page.locator('input[type="search"], input[placeholder*="Search"], input[aria-label*="Search"]');
    await input.first().fill(term);
    await input.first().press('Enter');
  }

  // Feature cards under hero section (carousel may load late in CI; wait for section then card)
  async openFeatureCard(title: string) {
    this.logger.info(`Opening feature card with title: ${title}`);
    // Wait for hero/feature area to be present so carousel has time to render (CI is slower)
    await this.page.getByText('Quick Links').first().waitFor({ state: 'visible', timeout: 25_000 });
    const card = this.page.getByText(title, { exact: false }).first();
    await card.scrollIntoViewIfNeeded({ timeout: 45_000 });
    await card.click({ timeout: 15_000 });
  }
}

