import { test, expect, type Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { waitReady } from './_helpers';

const SAMPLE_PNG_PATH = fileURLToPath(new URL('../fixtures/files/sample.png', import.meta.url));
const SAMPLE_PNG_BUF = readFileSync(SAMPLE_PNG_PATH);
const sha256 = (b: Buffer) => createHash('sha256').update(b).digest('hex');

/** Tracks every request that leaves the local origin (the no-upload covenant, #1). */
function trackExternal(page: Page): string[] {
  const external: string[] = [];
  page.on('request', (req) => {
    const url = req.url();
    if (!url.startsWith('http://localhost:4321') && !url.startsWith('data:') && !url.startsWith('blob:')) {
      external.push(url);
    }
  });
  return external;
}

test.describe('Text mode', () => {
  test('encodes Japanese text and an emoji to Base64, then decodes it back byte-identical, with no upload', async ({ page }) => {
    const external = trackExternal(page);
    const original = 'こんにちは、世界！🎉 日本語テスト';

    await page.goto('/encode-base64/');
    await waitReady(page);

    // Default mode is Text + Encode.
    await expect(page.locator('#top-mode-text')).toBeChecked();
    await expect(page.locator('#direction-encode')).toBeChecked();

    await page.fill('#text-input', original);
    const encoded = ((await page.getByTestId('base64-output').textContent()) ?? '').trim();
    expect(encoded.length).toBeGreaterThan(0);

    // Ground truth, computed independently in Node.
    expect(encoded).toBe(Buffer.from(original, 'utf-8').toString('base64'));

    // Now decode that same string back through the UI and confirm it matches exactly.
    await page.click('#direction-decode');
    await page.fill('#text-input', encoded);
    const roundTripped = (await page.getByTestId('text-output').textContent()) ?? '';
    expect(roundTripped).toBe(original);

    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toHaveLength(0);
  });

  test('shows a notice (not a download) for plain text pasted while in Decode mode', async ({ page }) => {
    await page.goto('/encode-base64/');
    await waitReady(page);

    await page.click('#direction-decode');
    await page.fill('#text-input', 'this is not base64!!');
    await expect(page.getByTestId('invalid-base64-notice')).toBeVisible();
  });

  test('offers a raw-bytes download when decoded bytes are not valid UTF-8', async ({ page }) => {
    await page.goto('/encode-base64/');
    await waitReady(page);

    // 0xFF 0xFE is never a valid UTF-8 sequence start.
    const invalidUtf8Base64 = Buffer.from([0xff, 0xfe, 0x00, 0x01]).toString('base64');

    await page.click('#direction-decode');
    await page.fill('#text-input', invalidUtf8Base64);
    await expect(page.getByTestId('raw-bytes-notice')).toBeVisible();

    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
    await page.click('#download-action');
    const download = await downloadPromise;
    const buf = readFileSync((await download.path()) as string);
    expect(Array.from(buf)).toEqual([0xff, 0xfe, 0x00, 0x01]);
  });

  test('auto-detects Base64 on paste and switches to Decode; switches back to Encode for plain text', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium', 'synthetic ClipboardEvent dispatch (one engine)');

    await page.goto('/encode-base64/');
    await waitReady(page);
    await expect(page.locator('#direction-encode')).toBeChecked();

    const pasteInto = (selector: string, text: string) =>
      page.evaluate(
        ({ selector, text }) => {
          const el = document.querySelector(selector) as HTMLElement;
          el.focus();
          const dt = new DataTransfer();
          dt.setData('text', text);
          const evt = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
          el.dispatchEvent(evt);
        },
        { selector, text }
      );

    // A real Base64 string (encodeTextToBase64('hello world')).
    await pasteInto('#text-input', 'aGVsbG8gd29ybGQ=');
    await expect(page.locator('#direction-decode')).toBeChecked();

    // Plain prose pasted next switches back to Encode.
    await pasteInto('#text-input', 'This is clearly not base64, right?');
    await expect(page.locator('#direction-encode')).toBeChecked();
  });
});

test.describe('File mode', () => {
  test('encodes a real binary file to Base64, decodes it back, and the downloaded file is byte-identical, with no upload', async ({ page }) => {
    const external = trackExternal(page);

    await page.goto('/encode-base64/');
    await waitReady(page);

    await page.click('#top-mode-file');
    await expect(page.locator('#direction-encode')).toBeChecked();

    await page.setInputFiles('#file-input', SAMPLE_PNG_PATH);
    await expect(page.getByTestId('file-encoded-output')).toBeVisible();
    await expect(page.getByText('sample.png')).toBeVisible();

    const encodedBase64 = ((await page.getByTestId('file-encoded-output').textContent()) ?? '').trim();
    expect(encodedBase64).toBe(SAMPLE_PNG_BUF.toString('base64'));

    // Now decode that exact string back into a file through the UI.
    await page.click('#direction-decode');
    await page.fill('#decode-base64-input', encodedBase64);
    await page.fill('#decode-filename-input', 'roundtrip.png');

    const downloadButton = page.locator('#download-action');
    await expect(downloadButton).toBeEnabled();
    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
    await downloadButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('roundtrip.png');

    const downloadedBuf = readFileSync((await download.path()) as string);
    expect(downloadedBuf.length).toBe(SAMPLE_PNG_BUF.length);
    expect(sha256(downloadedBuf)).toBe(sha256(SAMPLE_PNG_BUF));

    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toHaveLength(0);
  });

  test('can show the encoded file as a data URI', async ({ page }) => {
    await page.goto('/encode-base64/');
    await waitReady(page);
    await page.click('#top-mode-file');
    await page.setInputFiles('#file-input', SAMPLE_PNG_PATH);
    await expect(page.getByTestId('file-encoded-output')).toBeVisible();

    await page.click('#repr-datauri');
    const output = (await page.getByTestId('file-encoded-output').textContent()) ?? '';
    expect(output.startsWith('data:image/png;base64,')).toBe(true);
    expect(output).toContain(SAMPLE_PNG_BUF.toString('base64'));
  });

  test('a real file dropped anywhere on the page switches to File+Encode and encodes it', async ({ page }) => {
    await page.goto('/encode-base64/');
    await waitReady(page);
    await expect(page.locator('#top-mode-text')).toBeChecked();

    const b64 = SAMPLE_PNG_BUF.toString('base64');
    await page.evaluate((b64) => {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const file = new File([bytes], 'dropped.png', { type: 'image/png' });
      window.dispatchEvent(new CustomEvent('filesDropped', { detail: [file] }));
    }, b64);

    await expect(page.locator('#top-mode-file')).toBeChecked();
    await expect(page.locator('#direction-encode')).toBeChecked();
    await expect(page.getByText('dropped.png')).toBeVisible();
  });

  test('the download button stays disabled until a filename is entered', async ({ page }) => {
    await page.goto('/encode-base64/');
    await waitReady(page);
    await page.click('#top-mode-file');
    await page.click('#direction-decode');

    await page.fill('#decode-base64-input', SAMPLE_PNG_BUF.toString('base64'));
    await expect(page.locator('#download-action')).toBeDisabled();

    await page.fill('#decode-filename-input', 'photo.png');
    await expect(page.locator('#download-action')).toBeEnabled();
  });

  test('shows an invalid notice for text that is not valid Base64', async ({ page }) => {
    await page.goto('/encode-base64/');
    await waitReady(page);
    await page.click('#top-mode-file');
    await page.click('#direction-decode');

    await page.fill('#decode-base64-input', 'not-base64 text!!');
    await expect(page.getByTestId('file-decode-invalid')).toBeVisible();
    await page.fill('#decode-filename-input', 'x.bin');
    await expect(page.locator('#download-action')).toBeDisabled();
  });
});
