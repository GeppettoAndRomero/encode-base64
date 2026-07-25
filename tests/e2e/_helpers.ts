import { type Page, type Download } from '@playwright/test';

/** Wait until the island has hydrated and is ready to accept input. */
export async function waitReady(page: Page) {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

/**
 * Type a short string into the Text/Encode input (the default mode) and
 * download the Base64 result. Used by generic (engine-independent)
 * covenant/i18n/a11y checks; conversion.spec.ts drives Text/File encode and
 * decode in more detail, including the real-file and Unicode round trips.
 */
export async function convert(page: Page): Promise<Download> {
  await page.locator('#text-input').waitFor({ state: 'visible' });
  await page.fill('#text-input', 'hello runlocally');
  await page.locator('#download-action').waitFor({ state: 'visible' });
  const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
  await page.locator('#download-action').click();
  return downloadPromise;
}
