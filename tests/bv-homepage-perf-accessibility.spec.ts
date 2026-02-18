import { test, expect } from '../fixtures/bvFixtures';

test.describe('BV Homepage – Performance and Accessibility', () => {
  test('Performance – basic navigation metrics', async ({ page, homePage }) => {
    await homePage.goto();

    const navEntry = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const nav = entries[0];
      if (!nav) return null;
      return {
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
        loadEvent: nav.loadEventEnd - nav.startTime,
      };
    });

    expect(navEntry).not.toBeNull();

    if (navEntry) {
      console.log('Perf metrics (ms):', navEntry);
      // Allow >= 0 because with waitUntil 'domcontentloaded' loadEvent may not have fired yet
      expect(navEntry.domContentLoaded).toBeGreaterThanOrEqual(0);
      expect(navEntry.loadEvent).toBeGreaterThanOrEqual(0);
      expect(navEntry.loadEvent).toBeLessThan(60000);
    }
  });

  test('Accessibility – landmarks and main headings', async ({ page, homePage }) => {
    await homePage.goto();

    await expect(page.getByRole('banner')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('main')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('contentinfo')).toBeVisible({ timeout: 20_000 });

    await expect(page.getByRole('main').getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 20_000 });
    const h2Count = await page.getByRole('heading', { level: 2 }).count();
    expect(h2Count).toBeGreaterThan(3);
  });

  test('Accessibility – images with alt text', async ({ page, homePage }) => {
    await homePage.goto();

    const imagesWithAlt = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs
        .map((img) => img.getAttribute('alt') || '')
        .filter((alt) => alt.trim().length > 0);
    });

    expect(imagesWithAlt.length).toBeGreaterThan(5);
  });
});

