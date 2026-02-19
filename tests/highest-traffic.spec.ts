import type { APIRequestContext, Page } from '@playwright/test';
import { test, expect, BASE_URL } from '../fixtures/bvFixtures';

type TrafficPageScenario = {
  url: string;
  path: string;
  components: string[];
  validationOpportunities: string[];
  scenarioName: string;
  purpose: string;
  steps: string[];
  expectedResults: string[];
};

const BASE_ORIGIN = new URL(BASE_URL).origin;

const HIGHEST_TRAFFIC_PAGES: TrafficPageScenario[] = [
  {
    url: 'https://develop--bv-ad.netlify.app/',
    path: '/',
    components: ['Global header', 'Primary hero', 'Main content landmark', 'Footer', 'Primary CTA links'],
    validationOpportunities: ['Critical entry-point integrity', 'Homepage navigation paths', 'Content rendering regressions'],
    scenarioName: 'Homepage business-critical smoke',
    purpose: 'Protect first-touch user journey and homepage structural integrity.',
    steps: [
      'Navigate to homepage',
      'Validate response and runtime health',
      'Validate core landmarks, heading, links and buttons',
      'Validate images and internal links',
    ],
    expectedResults: [
      'Page is interactive and not broken',
      'No console/runtime failures on same-origin resources',
      'No broken images or broken internal links',
    ],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/careers',
    path: '/careers',
    components: ['Careers heading', 'Job-related CTA links', 'Main content sections', 'Footer'],
    validationOpportunities: ['Hiring funnel access', 'Navigation continuity', 'Accessibility baseline'],
    scenarioName: 'Careers funnel stability',
    purpose: 'Ensure top recruiting page remains functional and reachable.',
    steps: ['Open careers page', 'Validate content and interactive elements', 'Validate internal destination reachability'],
    expectedResults: ['No broken critical UI', 'Accessible controls and links', 'Internal links resolve successfully'],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/contact-us',
    path: '/contact-us',
    components: ['Contact heading', 'Contact information section', 'Navigation links', 'Footer'],
    validationOpportunities: ['Lead/contact path reliability', 'Page integrity and resources'],
    scenarioName: 'Contact path integrity',
    purpose: 'Ensure user contact route works and loads cleanly.',
    steps: ['Open contact page', 'Validate page health and content landmarks', 'Validate links and media assets'],
    expectedResults: ['Contact page is reachable', 'No broken assets/links', 'Core content is rendered'],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/office-locations',
    path: '/office-locations',
    components: ['Locations heading', 'Office/location content modules', 'Navigation and footer links'],
    validationOpportunities: ['Location discovery continuity', 'Content rendering and accessibility'],
    scenarioName: 'Locations discovery reliability',
    purpose: 'Guarantee location exploration page remains operational.',
    steps: ['Open office locations page', 'Verify landmarks and key content', 'Verify links and image integrity'],
    expectedResults: ['Page does not show error state', 'Links/media are healthy', 'Accessible controls remain valid'],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/projects',
    path: '/projects',
    components: ['Projects heading', 'Project listing/feature cards', 'Navigation links', 'Footer'],
    validationOpportunities: ['Portfolio browsing health', 'CTA and internal navigation resilience'],
    scenarioName: 'Projects browse flow',
    purpose: 'Protect high-traffic project exploration journeys.',
    steps: ['Open projects page', 'Validate runtime and UI health', 'Validate links/buttons and accessibility'],
    expectedResults: ['Projects page remains stable', 'Interactive content is usable', 'Internal links are reachable'],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/where-we-work/asia-pacific',
    path: '/where-we-work/asia-pacific',
    components: ['Region heading', 'Regional content sections', 'Navigation links', 'Footer'],
    validationOpportunities: ['Regional page integrity', 'Navigation and rendering quality'],
    scenarioName: 'Asia Pacific regional page integrity',
    purpose: 'Ensure regional content remains healthy for high-traffic geography page.',
    steps: ['Open Asia Pacific page', 'Validate page and content structure', 'Validate internal reachability'],
    expectedResults: ['No broken state', 'No failed same-origin critical resources', 'Internal links respond'],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/about-us',
    path: '/about-us',
    components: ['About Us heading', 'Company information sections', 'Navigation links', 'Footer'],
    validationOpportunities: ['Brand/story page reliability', 'Content and accessibility checks'],
    scenarioName: 'About Us content integrity',
    purpose: 'Protect core company-information experience.',
    steps: ['Open about page', 'Validate main heading/landmarks', 'Validate links, images and accessibility basics'],
    expectedResults: ['Page renders correctly', 'No broken links/images', 'Controls have accessible names'],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/en-US/careers',
    path: '/en-US/careers',
    components: ['Localized careers heading', 'Localized content sections', 'Localized navigation links'],
    validationOpportunities: ['Locale route stability', 'Content parity and baseline quality'],
    scenarioName: 'Localized careers route health',
    purpose: 'Ensure locale-specific careers route remains usable.',
    steps: ['Open localized careers page', 'Validate structural and runtime integrity', 'Validate links and accessibility'],
    expectedResults: ['Localized route loads and stays interactive', 'No broken internal destinations'],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/careers/our-hiring-process',
    path: '/careers/our-hiring-process',
    components: ['Hiring process heading', 'Process content blocks', 'Navigable CTAs and links'],
    validationOpportunities: ['Recruitment process page quality', 'Conversion-path navigation checks'],
    scenarioName: 'Hiring process journey health',
    purpose: 'Protect a key decision-making page in the recruitment funnel.',
    steps: ['Open hiring process page', 'Validate content and interaction affordances', 'Validate reachable internal links'],
    expectedResults: ['Page remains stable', 'No blocked loading indicators', 'No broken internal links/images'],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/about-us/leadership',
    path: '/about-us/leadership',
    components: ['Leadership heading', 'Leadership profile/content modules', 'Navigation links'],
    validationOpportunities: ['Executive content route reliability', 'Media and accessibility baseline'],
    scenarioName: 'Leadership page reliability',
    purpose: 'Ensure leadership page is healthy and navigable.',
    steps: ['Open leadership page', 'Validate runtime/content integrity', 'Validate links and accessibility basics'],
    expectedResults: ['Leadership page loads without errors', 'Internal links are reachable', 'No broken media'],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/locations/americas',
    path: '/locations/americas',
    components: ['Regional heading', 'Regional content sections', 'Navigation links', 'Footer'],
    validationOpportunities: ['Locations regional route stability', 'Regional content integrity', 'Critical link health'],
    scenarioName: 'Locations Americas integrity',
    purpose: 'Ensure Americas location route remains functional and fully navigable.',
    steps: ['Open Americas location page', 'Validate runtime/content integrity', 'Validate internal links and media'],
    expectedResults: ['Route loads successfully', 'No critical same-origin failures', 'No broken internal links'],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/locations/asia-pacific',
    path: '/locations/asia-pacific',
    components: ['Regional heading', 'Regional content sections', 'Navigation links', 'Footer'],
    validationOpportunities: ['Locations regional route stability', 'Regional content integrity', 'Critical link health'],
    scenarioName: 'Locations Asia Pacific integrity',
    purpose: 'Ensure Asia Pacific location route remains functional and fully navigable.',
    steps: ['Open Asia Pacific location page', 'Validate runtime/content integrity', 'Validate internal links and media'],
    expectedResults: ['Route loads successfully', 'No critical same-origin failures', 'No broken internal links'],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/locations/europe',
    path: '/locations/europe',
    components: ['Regional heading', 'Regional content sections', 'Navigation links', 'Footer'],
    validationOpportunities: ['Locations regional route stability', 'Regional content integrity', 'Critical link health'],
    scenarioName: 'Locations Europe integrity',
    purpose: 'Ensure Europe location route remains functional and fully navigable.',
    steps: ['Open Europe location page', 'Validate runtime/content integrity', 'Validate internal links and media'],
    expectedResults: ['Route loads successfully', 'No critical same-origin failures', 'No broken internal links'],
  },
  {
    url: 'https://develop--bv-ad.netlify.app/locations/middle-east-and-africa',
    path: '/locations/middle-east-and-africa',
    components: ['Regional heading', 'Regional content sections', 'Navigation links', 'Footer'],
    validationOpportunities: ['Locations regional route stability', 'Regional content integrity', 'Critical link health'],
    scenarioName: 'Locations MEA integrity',
    purpose: 'Ensure Middle East and Africa location route remains functional and fully navigable.',
    steps: ['Open MEA location page', 'Validate runtime/content integrity', 'Validate internal links and media'],
    expectedResults: ['Route loads successfully', 'No critical same-origin failures', 'No broken internal links'],
  },
];

const LINK_CHECK_TIMEOUT_MS = 15_000;
const NON_CRITICAL_CONSOLE_ERROR_PATTERNS = [
  /Failed to load resource: the server responded with a status of 404 \(\)/i,
  /Blocked script execution in 'about:blank' because the document's frame is sandboxed/i,
];
const CRITICAL_RESOURCE_TYPES = new Set(['document', 'script', 'stylesheet', 'xhr', 'fetch']);
const ACCEPTED_REDIRECT_PATHS: Record<string, string[]> = {
  '/where-we-work/asia-pacific': ['/locations/asia-pacific'],
};

function isSameOrigin(url: string): boolean {
  try {
    return new URL(url).origin === BASE_ORIGIN;
  } catch {
    return false;
  }
}

function isSkippableHref(href: string): boolean {
  return (
    !href ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:')
  );
}

function isNonCriticalConsoleError(message: string): boolean {
  return NON_CRITICAL_CONSOLE_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

function isSameOriginLocation(locationUrl?: string): boolean {
  return Boolean(locationUrl && isSameOrigin(locationUrl));
}

function isAcceptedFinalPath(expectedPath: string, actualPath: string): boolean {
  if (actualPath.includes(expectedPath)) return true;
  const acceptedRedirectTargets = ACCEPTED_REDIRECT_PATHS[expectedPath] ?? [];
  return acceptedRedirectTargets.some((target) => actualPath.includes(target));
}

async function collectInternalLinks(page: Page): Promise<string[]> {
  const links = await page.evaluate((origin) => {
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
    const normalized = anchors
      .map((a) => a.getAttribute('href')?.trim() ?? '')
      .filter(Boolean)
      .filter((href) => {
        return !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:');
      })
      .map((href) => new URL(href, window.location.origin).toString())
      .filter((href) => new URL(href).origin === origin);
    return Array.from(new Set(normalized));
  }, BASE_ORIGIN);

  return links;
}

async function collectBrokenImageSources(page: Page): Promise<string[]> {
  return page.evaluate((origin) => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
    return images
      .filter((img) => {
        const source = img.currentSrc || img.src;
        if (!source) return false;
        try {
          if (new URL(source).origin !== origin) return false;
        } catch {
          return false;
        }
        if (!img.complete) return false;
        return img.naturalWidth === 0;
      })
      .map((img) => img.currentSrc || img.src);
  }, BASE_ORIGIN);
}

async function collectA11yGaps(page: Page) {
  return page.evaluate(() => {
    const imagesMissingAlt = Array.from(document.querySelectorAll('img:not([alt])')).length;

    const buttonsWithoutAccessibleName = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).filter((button) => {
      const text = button.innerText?.trim() ?? '';
      const ariaLabel = button.getAttribute('aria-label')?.trim() ?? '';
      const ariaLabelledBy = button.getAttribute('aria-labelledby')?.trim() ?? '';
      const title = button.getAttribute('title')?.trim() ?? '';
      return !text && !ariaLabel && !ariaLabelledBy && !title;
    }).length;

    const linksWithoutReadableText = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]')).filter((link) => {
      const text = link.innerText?.trim() ?? '';
      const ariaLabel = link.getAttribute('aria-label')?.trim() ?? '';
      const title = link.getAttribute('title')?.trim() ?? '';
      return !text && !ariaLabel && !title;
    }).length;

    return {
      imagesMissingAlt,
      buttonsWithoutAccessibleName,
      linksWithoutReadableText,
    };
  });
}

async function assertInternalLinksReachable(
  request: APIRequestContext,
  internalLinks: string[],
): Promise<void> {
  const broken: string[] = [];

  for (const link of internalLinks) {
    if (isSkippableHref(link) || !isSameOrigin(link)) continue;

    const response = await request.get(link, {
      failOnStatusCode: false,
      timeout: LINK_CHECK_TIMEOUT_MS,
    });
    if (response.status() >= 400) {
      broken.push(`${response.status()} ${link}`);
    }
  }

  // Potential product issue alert:
  // "/locations" is currently clickable in parts of the site but resolves to 404 in dev.
  // Keep this blocking so the defect remains visible until fixed by content/navigation owners.
  expect(broken, `Broken internal links found:\n${broken.join('\n')}`).toEqual([]);
}

async function assertBasicPageReadiness(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByRole('main').first()).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 30_000 });

  const readyState = await page.evaluate(() => document.readyState);
  expect(['interactive', 'complete']).toContain(readyState);
}

test.describe('Highest Traffic Pages - Generated QA Scenarios', () => {
  for (const pageScenario of HIGHEST_TRAFFIC_PAGES) {
    test(`${pageScenario.scenarioName} - ${pageScenario.path}`, async ({ page, homePage, request }) => {
      test.setTimeout(180_000);

      /*
        PAGE: <url>
        1. Identified Components
        2. Validation Opportunities
        3. Generated Scenarios (name, purpose, steps, expected)
        4. Suggested Playwright Tests
      */
      test.info().annotations.push({ type: 'PAGE', description: pageScenario.url });
      test.info().annotations.push({ type: 'Identified Components', description: pageScenario.components.join(' | ') });
      test.info().annotations.push({
        type: 'Validation Opportunities',
        description: pageScenario.validationOpportunities.join(' | '),
      });
      test.info().annotations.push({ type: 'Scenario Name', description: pageScenario.scenarioName });
      test.info().annotations.push({ type: 'Purpose', description: pageScenario.purpose });
      test.info().annotations.push({ type: 'Steps', description: pageScenario.steps.join(' -> ') });
      test.info().annotations.push({ type: 'Expected Results', description: pageScenario.expectedResults.join(' | ') });

      const consoleErrors: string[] = [];
      const criticalConsoleErrors: string[] = [];
      const nonBlockingConsoleErrors: string[] = [];
      const sameOriginFailedRequests: string[] = [];
      const sameOriginHttpErrors: string[] = [];
      const consoleEntries: string[] = [];

      page.on('console', (msg) => {
        const text = msg.text();
        const entry = `[${msg.type()}] ${text}`;
        consoleEntries.push(entry);
        if (msg.type() === 'error') {
          consoleErrors.push(text);
          if (!isNonCriticalConsoleError(text) && isSameOriginLocation(msg.location().url)) {
            criticalConsoleErrors.push(text);
          } else {
            nonBlockingConsoleErrors.push(text);
          }
        }
      });

      page.on('requestfailed', (req) => {
        if (!isSameOrigin(req.url())) return;
        if (!CRITICAL_RESOURCE_TYPES.has(req.resourceType())) return;
        sameOriginFailedRequests.push(`${req.resourceType()} ${req.url()} - ${req.failure()?.errorText ?? 'request failed'}`);
      });

      page.on('response', (res) => {
        if (!isSameOrigin(res.url())) return;
        if (!CRITICAL_RESOURCE_TYPES.has(res.request().resourceType())) return;
        if (res.status() >= 400) {
          sameOriginHttpErrors.push(`${res.status()} ${res.url()}`);
        }
      });

      try {
        await test.step('Navigate to page and validate main response', async () => {
          const mainNavResponse = page.waitForResponse(
            (res) => {
              const req = res.request();
              if (!req.isNavigationRequest()) return false;
              if (req.frame() !== page.mainFrame()) return false;
              return isSameOrigin(res.url());
            },
            { timeout: 45_000 },
          );

          await homePage.gotoPath(pageScenario.path);
          await assertBasicPageReadiness(page);
          const finalPath = new URL(page.url()).pathname;
          expect(
            isAcceptedFinalPath(pageScenario.path, finalPath),
            `Unexpected final path. Expected ${pageScenario.path} (or allowed redirect), got ${finalPath}`,
          ).toBe(true);

          const response = await mainNavResponse;
          expect(response.status(), `Expected successful main navigation on ${pageScenario.url}`).toBeLessThan(400);
        });

        await test.step('Validate functional integrity and runtime health', async () => {
          await homePage.assertPageNotBroken();
          expect(criticalConsoleErrors, `Critical console errors found on ${pageScenario.url}`).toEqual([]);
          expect(sameOriginFailedRequests, `Failed same-origin requests on ${pageScenario.url}`).toEqual([]);
          expect(sameOriginHttpErrors, `Same-origin HTTP errors found on ${pageScenario.url}`).toEqual([]);
          test.info().annotations.push({ type: 'Console errors observed (all)', description: String(consoleErrors.length) });
        });

        await test.step('Validate content, accessibility and performance signals', async () => {
          const h1Text = (await page.getByRole('heading', { level: 1 }).first().textContent())?.trim() ?? '';
          expect(h1Text.length).toBeGreaterThan(0);

          const { imagesMissingAlt, buttonsWithoutAccessibleName, linksWithoutReadableText } = await collectA11yGaps(page);
          test.info().annotations.push({
            type: 'A11y signal - images missing alt',
            description: `${imagesMissingAlt}`,
          });
          test.info().annotations.push({
            type: 'A11y signal - buttons without accessible label',
            description: `${buttonsWithoutAccessibleName}`,
          });
          // Keep link readability as monitored signal while blocking only critical same-origin failures.
          test.info().annotations.push({
            type: 'A11y signal - links without readable text',
            description: `${linksWithoutReadableText}`,
          });

          const blockingStates = page
            .locator('[aria-busy="true"], [role="progressbar"], .loading, .spinner, .skeleton, [data-testid*="loading"]')
            .filter({ visible: true });
          await expect(blockingStates, `Blocking loading state still visible on ${pageScenario.url}`).toHaveCount(0, {
            timeout: 10_000,
          });
        });

        await test.step('Validate media and internal link integrity', async () => {
          const brokenImages = await collectBrokenImageSources(page);
          expect(brokenImages, `Broken images found on ${pageScenario.url}: ${brokenImages.join(', ')}`).toEqual([]);

          const internalLinks = await collectInternalLinks(page);
          expect(internalLinks.length, `No internal links discovered on ${pageScenario.url}`).toBeGreaterThan(0);
          await assertInternalLinksReachable(request, internalLinks);
        });
      } catch (error) {
        const diagnostics = [
          `Scenario: ${pageScenario.scenarioName}`,
          `URL: ${pageScenario.url}`,
          `Final URL: ${page.url()}`,
          '',
          'Critical console errors:',
          ...(criticalConsoleErrors.length ? criticalConsoleErrors : ['(none)']),
          '',
          'Non-blocking console errors:',
          ...(nonBlockingConsoleErrors.length ? nonBlockingConsoleErrors : ['(none)']),
          '',
          'All console messages:',
          ...(consoleEntries.length ? consoleEntries : ['(none)']),
          '',
          'Same-origin failed requests:',
          ...(sameOriginFailedRequests.length ? sameOriginFailedRequests : ['(none)']),
          '',
          'Same-origin HTTP errors:',
          ...(sameOriginHttpErrors.length ? sameOriginHttpErrors : ['(none)']),
        ].join('\n');

        await test.info().attach('failure-diagnostics.log', {
          body: diagnostics,
          contentType: 'text/plain',
        });
        const failureScreenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('failure-screenshot.png', {
          body: failureScreenshot,
          contentType: 'image/png',
        });
        console.error(`\n[FAILURE DIAGNOSTICS]\n${diagnostics}\n`);
        throw error;
      }
    });
  }
});
