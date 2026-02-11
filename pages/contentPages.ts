import { Page, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

abstract class ContentPage {
  constructor(
    protected readonly page: Page,
    protected readonly logger: Logger,
  ) {}

  protected async assertTitleContains(text: string) {
    this.logger.info(`Asserting page title contains: ${text}`);
    // Allow extra time for cross-browser navigation to complete.
    await expect(this.page).toHaveTitle(new RegExp(text, 'i'), { timeout: 15_000 });
  }

  protected async assertMainHeadingVisible() {
    this.logger.info('Asserting main heading (h1) is visible');
    // Use role-based locator and pick a single h1 to avoid strict-mode ambiguity
    const mainHeading = this.page.getByRole('heading', { level: 1 }).first();
    await expect(mainHeading).toBeVisible();
  }

  async assertLoaded(expectedTitlePart: string) {
    await this.assertTitleContains(expectedTitlePart);
    await this.assertMainHeadingVisible();
  }
}

export class AboutUsPage extends ContentPage {
  async assertLoaded() {
    await super.assertLoaded('About Us');
  }
}

export class WhoWeServePage extends ContentPage {
  async assertLoaded() {
    await super.assertLoaded('Who We Serve');
  }
}

export class WhatWeDoPage extends ContentPage {
  async assertLoaded() {
    await super.assertLoaded('What We Do');
  }
}

export class SustainabilityPage extends ContentPage {
  async assertLoaded() {
    await super.assertLoaded('Sustainability');
  }
}

export class ProjectsPage extends ContentPage {
  async assertLoaded() {
    await super.assertLoaded('Projects');
  }
}

export class CareersPage extends ContentPage {
  async assertLoaded() {
    await super.assertLoaded('Careers');
  }
}

export class ContactPage extends ContentPage {
  async assertLoaded() {
    await super.assertLoaded('Contact Us');
  }
}

export class NewsroomPage extends ContentPage {
  async assertLoaded() {
    await super.assertLoaded('Newsroom');
  }
}

export class LocationsPage extends ContentPage {
  async assertLoaded() {
    await super.assertLoaded('Locations');
  }
}

export class SearchResultsPage extends ContentPage {
  async assertLoaded() {
    await super.assertLoaded('Search');
  }
}

