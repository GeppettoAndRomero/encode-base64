import { test, expect } from '@playwright/test';
import { waitReady, convert } from './_helpers';

// Service-worker / offline behaviour is reliable in Chromium; gate these there.
test.describe('covenants', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'service-worker dependent (chromium only)');
  });

  test('PWA: manifest is linked and valid, service worker registers (#3)', async ({ page }) => {
    await page.goto('/encode-base64/');
    const href = await page.getAttribute('link[rel=manifest]', 'href');
    expect(href).toBeTruthy();
    const manifest = await page.evaluate(async (h) => (await fetch(h as string)).json(), href);
    expect(manifest.name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.display).toBe('standalone');
    expect(Array.isArray(manifest.icons) && manifest.icons.length > 0).toBe(true);
    await page.waitForFunction(() => navigator.serviceWorker?.controller != null, { timeout: 15_000 });
  });

  test('footer links to SECURITY.md (#4)', async ({ page }) => {
    await page.goto('/encode-base64/');
    const link = page.locator('footer a').filter({ hasText: 'Security' });
    await expect(link).toHaveAttribute('href', /SECURITY\.md$/);
  });

  test('keeps no input data in the page URL after conversion (#7)', async ({ page }) => {
    await page.goto('/encode-base64/');
    await waitReady(page);
    const before = page.url();
    await convert(page);
    expect(page.url()).toBe(before);
    // The sibling tools' template checks the whole URL against
    // /data:|base64|blob:/i, but that would false-positive here: this tool's
    // own slug is "encode-base64", so the resting URL legitimately contains
    // "base64" with zero data ever having been appended to it. The real
    // invariant — nothing gets serialized into a query string or fragment —
    // is checked precisely instead.
    const url = new URL(page.url());
    expect(url.search).toBe('');
    expect(url.hash).toBe('');
  });

  test('converts offline after the first online visit (#2)', async ({ page }) => {
    // First visit registers + activates the SW (it claims existing clients).
    await page.goto('/encode-base64/');
    await page.waitForFunction(() => navigator.serviceWorker?.controller != null, { timeout: 15_000 });
    // Reload once online so page HTML + island JS are now fetched *through* the
    // active SW and cached (first load happened before the SW was controlling).
    await page.reload();
    await waitReady(page);
    // Convert online so the worker chunk and libheif wasm are cached too.
    await convert(page);

    await page.context().setOffline(true);
    try {
      await page.reload(); // served entirely from the SW cache
      await waitReady(page);
      await convert(page); // convert with no network at all
    } finally {
      await page.context().setOffline(false);
    }
  });
});
