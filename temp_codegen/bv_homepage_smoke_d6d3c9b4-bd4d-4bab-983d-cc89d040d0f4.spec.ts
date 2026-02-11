
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('BV_Homepage_Smoke_2026-02-11', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('https://www.bv.com', { waitUntil: 'load' });

    // Take screenshot
    await page.screenshot({ path: 'bv_homepage_full.png', { fullPage: true } });

    // Click element
    await page.click('text=About Us');

    // Click element
    await page.click('text=Learn about Black & Veatch');

    // Take screenshot
    await page.screenshot({ path: 'bv_about_us.png', { fullPage: true } });

    // Click element
    await page.click('text=Who we serve');

    // Click element
    await page.click('text=Explore our Industries');

    // Take screenshot
    await page.screenshot({ path: 'bv_who_we_serve.png', { fullPage: true } });

    // Click element
    await page.click('text=What we do');

    // Click element
    await page.click('text=Explore our offerings');

    // Take screenshot
    await page.screenshot({ path: 'bv_what_we_do.png', { fullPage: true } });

    // Click element
    await page.click('text=Sustainability');

    // Click element
    await page.click('text=Sustainability at Black & Veatch');

    // Take screenshot
    await page.screenshot({ path: 'bv_sustainability.png', { fullPage: true } });

    // Click element
    await page.click('text=Projects');

    // Take screenshot
    await page.screenshot({ path: 'bv_projects.png', { fullPage: true } });

    // Click element
    await page.click('text=Careers');

    // Click element
    await page.click('text=Explore Careers at Black & Veatch');

    // Take screenshot
    await page.screenshot({ path: 'bv_careers.png', { fullPage: true } });

    // Click element
    await page.click('text=Contact');

    // Click element
    await page.click('text=Newsroom');

    // Click element
    await page.click('text=Supplier');

    // Click element
    await page.click('text=Locations');

    // Navigate to URL
    await page.goto('https://www.bv.com', { waitUntil: 'load' });
});