import { test, expect, BASE_URL } from '../fixtures/bvFixtures';
import { INTERNAL_PATHS } from './data/internalPaths';

const BASE_ORIGIN = new URL(BASE_URL).origin;
const EXTRA_BUG_HUNT_PATHS = ['/locations', '/en-US/where-we-work/americas'];
const BUG_HUNT_PATHS = Array.from(new Set([...INTERNAL_PATHS, ...EXTRA_BUG_HUNT_PATHS]));

test.describe('BV Dev Bug Hunt - strict same-origin HTTP errors', () => {
  for (const path of BUG_HUNT_PATHS) {
    test(`Bug hunt - ${path || '/'}`, async ({ page }) => {
      const route = path || '/';
      const url = new URL(route, BASE_URL).toString();
      const sameOriginHttpErrors: string[] = [];
      const sameOriginFailedRequests: string[] = [];

      page.on('response', (response) => {
        try {
          const responseUrl = new URL(response.url());
          if (responseUrl.origin !== BASE_ORIGIN) return;
          if (response.status() >= 400) {
            sameOriginHttpErrors.push(`${response.status()} ${response.request().resourceType()} ${response.url()}`);
          }
        } catch {
          // Ignore malformed response URLs.
        }
      });

      page.on('requestfailed', (request) => {
        try {
          const requestUrl = new URL(request.url());
          if (requestUrl.origin !== BASE_ORIGIN) return;
          sameOriginFailedRequests.push(
            `${request.resourceType()} ${request.url()} - ${request.failure()?.errorText ?? 'request failed'}`,
          );
        } catch {
          // Ignore malformed request URLs.
        }
      });

      const mainNavResponse = page.waitForResponse(
        (response) => {
          const request = response.request();
          if (!request.isNavigationRequest()) return false;
          if (request.frame() !== page.mainFrame()) return false;
          try {
            return new URL(response.url()).origin === BASE_ORIGIN;
          } catch {
            return false;
          }
        },
        { timeout: 45_000 },
      );

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForTimeout(1_200);

      const response = await mainNavResponse;
      expect(response.status(), `Main navigation returned ${response.status()} on ${url}`).toBeLessThan(400);

      // Catch soft-404 style failures where status is 200 but content is error-like.
      await expect(page).not.toHaveTitle(/404|not found|error/i);
      const bodyText = await page.locator('body').innerText().catch(() => '');
      expect(
        /page not found|error 404|application error|something went wrong/i.test(bodyText),
        `Soft error content detected on ${url}`,
      ).toBe(false);

      expect(
        sameOriginHttpErrors,
        `Same-origin HTTP 4xx/5xx detected on ${url}:\n${sameOriginHttpErrors.join('\n')}`,
      ).toEqual([]);
      expect(
        sameOriginFailedRequests,
        `Same-origin failed requests detected on ${url}:\n${sameOriginFailedRequests.join('\n')}`,
      ).toEqual([]);
    });
  }
});

