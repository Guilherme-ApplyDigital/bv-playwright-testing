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

  // Feature cards under hero section
  async openFeatureCard(title: string) {
    this.logger.info(`Opening feature card with title: ${title}`);
    await this.page.getByText(title, { exact: false }).first().click();
  }
}

