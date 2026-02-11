import { test } from '../fixtures/bvFixtures';
import {
  AboutUsPage,
  CareersPage,
  ContactPage,
  NewsroomPage,
  ProjectsPage,
  SustainabilityPage,
  WhatWeDoPage,
  WhoWeServePage,
  SearchResultsPage,
} from '../pages/contentPages';

test.describe('BV Homepage – Navigation', () => {
  test('Top nav – About Us', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.openAboutUs();
    await new AboutUsPage(page, homePage['logger']).assertLoaded();
  });

  test('Top nav – Who We Serve', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.openWhoWeServe();
    await new WhoWeServePage(page, homePage['logger']).assertLoaded();
  });

  test('Top nav – What We Do', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.openWhatWeDo();
    await new WhatWeDoPage(page, homePage['logger']).assertLoaded();
  });

  test('Top nav – Sustainability', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.openSustainability();
    await new SustainabilityPage(page, homePage['logger']).assertLoaded();
  });

  test('Top nav – Projects', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.openProjects();
    await new ProjectsPage(page, homePage['logger']).assertLoaded();
  });

  test('Top nav – Careers', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.openCareers();
    await new CareersPage(page, homePage['logger']).assertLoaded();
  });

  test('Upper-right – Contact', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.openContact();
    await new ContactPage(page, homePage['logger']).assertLoaded();
  });

  test('Upper-right – Newsroom', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.openNewsroom();
    await new NewsroomPage(page, homePage['logger']).assertLoaded();
  });

  test('Search – full flow', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.openSearch();
    await homePage.searchFor('energy');
    await new SearchResultsPage(page, homePage['logger']).assertLoaded();
  });
});

