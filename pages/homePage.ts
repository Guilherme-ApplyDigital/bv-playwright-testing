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
    await this.page.goto(this.baseUrl, { waitUntil: 'load' });
  }

  async assertHeroVisible() {
    this.logger.info('Asserting hero headline is visible');
    await expect(this.page.getByText('Bold infrastructure our future depends on')).toBeVisible();
  }

  async assertPrimaryCtaVisible() {
    this.logger.info('Asserting primary CTA button is visible');
    await expect(this.page.getByRole('link', { name: 'See bolder vision in action' })).toBeVisible();
  }

  // Top navigation
  async openAboutUs() {
    this.logger.info('Opening About Us page from top navigation');
    await this.page.getByRole('button', { name: 'About Us' }).click();
    await this.page.getByRole('link', { name: 'Learn about Black & Veatch' }).click();
  }

  async openWhoWeServe() {
    this.logger.info('Opening Who We Serve page from top navigation');
    await this.page.getByRole('button', { name: 'Who we serve' }).click();
    await this.page.getByRole('link', { name: 'Explore our Industries' }).click();
  }

  async openWhatWeDo() {
    this.logger.info('Opening What We Do page from top navigation');
    await this.page.getByRole('button', { name: 'What we do' }).click();
    await this.page.getByRole('link', { name: 'Explore our offerings' }).click();
  }

  async openSustainability() {
    this.logger.info('Opening Sustainability page from top navigation');
    await this.page.getByRole('button', { name: 'Sustainability' }).click();
    await this.page.getByRole('link', { name: 'Sustainability at Black & Veatch' }).click();
  }

  async openProjects() {
    this.logger.info('Opening Projects page from top navigation');
    await this.page.getByRole('link', { name: 'Projects' }).click();
  }

  async openCareers() {
    this.logger.info('Opening Careers page from top navigation');
    await this.page.getByRole('button', { name: 'Careers' }).click();
    await this.page.getByRole('link', { name: 'Explore Careers at Black & Veatch' }).click();
  }

  // Upper right navigation
  async openContact() {
    this.logger.info('Opening Contact page from upper-right navigation');
    await this.page.getByRole('link', { name: 'Contact' }).click();
  }

  async openNewsroom() {
    this.logger.info('Opening Newsroom page from upper-right navigation');
    await this.page.getByRole('link', { name: 'Newsroom' }).click();
  }

  async openSupplier() {
    this.logger.info('Opening Supplier portal from upper-right navigation');
    await this.page.getByRole('link', { name: 'Supplier' }).click();
  }

  async openLocations() {
    this.logger.info('Opening Locations page from upper-right navigation');
    // There are two "Locations" labels; use the one in the header.
    await this.page.getByRole('link', { name: /^Locations$/ }).first().click();
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

