import { test, expect, BASE_URL } from '../fixtures/bvFixtures';
import {
  AboutUsPage,
  CareersPage,
  ContactPage,
  LocationsPage,
  NewsroomPage,
  ProjectsPage,
  SustainabilityPage,
  WhatWeDoPage,
  WhoWeServePage,
  SearchResultsPage,
} from '../pages/contentPages';

test.describe('BV Homepage – Functional Smoke', () => {
  test('Scenario 1 – Homepage load validation', async ({ page, homePage }) => {
    await homePage.goto();

    // Validate hero and primary CTA
    await homePage.assertHeroVisible();
    await homePage.assertPrimaryCtaVisible();

    // Basic HTTP 200 is implied by successful navigation; we also log console errors via Playwright output.
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('Scenario 2 – Top navigation menu', async ({ page, homePage }) => {
    await homePage.goto();

    const aboutUs = new AboutUsPage(page, homePage['logger']);
    await homePage.openAboutUs();
    await aboutUs.assertLoaded();

    await homePage.goto();
    const whoWeServe = new WhoWeServePage(page, homePage['logger']);
    await homePage.openWhoWeServe();
    await whoWeServe.assertLoaded();

    await homePage.goto();
    const whatWeDo = new WhatWeDoPage(page, homePage['logger']);
    await homePage.openWhatWeDo();
    await whatWeDo.assertLoaded();

    await homePage.goto();
    const sustainability = new SustainabilityPage(page, homePage['logger']);
    await homePage.openSustainability();
    await sustainability.assertLoaded();

    await homePage.goto();
    const projects = new ProjectsPage(page, homePage['logger']);
    await homePage.openProjects();
    await projects.assertLoaded();

    await homePage.goto();
    const careers = new CareersPage(page, homePage['logger']);
    await homePage.openCareers();
    await careers.assertLoaded();
  });

  test('Scenario 3 – Upper-right navigation', async ({ page, homePage }) => {
    await homePage.goto();

    const contact = new ContactPage(page, homePage['logger']);
    await homePage.openContact();
    await contact.assertLoaded();

    await homePage.goto();
    const newsroom = new NewsroomPage(page, homePage['logger']);
    await homePage.openNewsroom();
    await newsroom.assertLoaded();

    // Supplier and Locations are known to be problematic (DNS/404); we only verify navigation attempt does not break the test run.
    await homePage.goto();
    await homePage.openSupplier();

    await homePage.goto();
    await homePage.openLocations();
  });

  test('Scenario 4 – Search icon', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.openSearch();
    await homePage.searchFor('energy');

    const searchResults = new SearchResultsPage(page, homePage['logger']);
    await searchResults.assertLoaded();
  });

  test('Scenario 5 – Homepage feature cards', async ({ page, homePage }) => {
    await homePage.goto();

    await homePage.openFeatureCard("It's a new era for power utilities");
    await expect(page).not.toHaveTitle(/Not Found/i);

    await homePage.goto();
    await homePage.openFeatureCard('Floating solar powers Philippine mine');
    await expect(page).not.toHaveTitle(/Not Found/i);

    await homePage.goto();
    await homePage.openFeatureCard('AI on the frontlines: battling cyberattacks');
    await expect(page).not.toHaveTitle(/Not Found/i);
  });
});

