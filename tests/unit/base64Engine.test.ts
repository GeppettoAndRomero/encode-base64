import { describe, it, expect } from 'vitest';
import {
  bytesToBase64,
  base64ToBytes,
  encodeTextToBase64,
  decodeBase64ToText,
  looksLikeBase64,
  stripDataUriPrefix,
  buildDataUri,
  byteSize,
} from '@/utils/base64Engine';

describe('encodeTextToBase64 / decodeBase64ToText — UTF-8 safety (issue #68 mandatory test)', () => {
  it('round-trips a string with Japanese characters and an emoji byte-for-byte', () => {
    const original = 'こんにちは、世界！🎉 日本語テスト émoji café';
    const encoded = encodeTextToBase64(original);

    // Ground truth: Node's own UTF-8-aware base64, independent of our implementation.
    expect(encoded).toBe(Buffer.from(original, 'utf-8').toString('base64'));

    const decoded = decodeBase64ToText(encoded);
    expect(decoded.ok).toBe(true);
    expect(decoded.ok && decoded.text).toBe(original);
  });

  it('round-trips plain ASCII', () => {
    const original = 'The quick brown fox jumps over the lazy dog. 0123456789!@#$%';
    const encoded = encodeTextToBase64(original);
    const decoded = decodeBase64ToText(encoded);
    expect(decoded.ok).toBe(true);
    expect(decoded.ok && decoded.text).toBe(original);
  });

  it('round-trips an empty string', () => {
    expect(encodeTextToBase64('')).toBe('');
    const decoded = decodeBase64ToText('');
    expect(decoded.ok).toBe(true);
    expect(decoded.ok && decoded.text).toBe('');
  });

  it('handles characters outside Latin-1 that would make plain btoa() throw', () => {
    // btoa('日本語') throws "InvalidCharacterError" in a real browser/DOM btoa
    // (character code > 255). encodeTextToBase64 must not merely delegate to
    // btoa(str) — it goes through TextEncoder first, so this must succeed.
    const original = '日本語 한국어 中文 🚀🎉👍';
    expect(() => encodeTextToBase64(original)).not.toThrow();
    const decoded = decodeBase64ToText(encodeTextToBase64(original));
    expect(decoded.ok && decoded.text).toBe(original);
  });

  it('reports ok:false with the raw bytes when the decoded bytes are not valid UTF-8', () => {
    // 0xFF is never valid as the start of a UTF-8 sequence.
    const invalidUtf8 = new Uint8Array([0xff, 0xfe, 0x00, 0x01]);
    const base64 = bytesToBase64(invalidUtf8);
    const decoded = decodeBase64ToText(base64);
    expect(decoded.ok).toBe(false);
    if (!decoded.ok) {
      expect(Array.from(decoded.bytes)).toEqual(Array.from(invalidUtf8));
    }
  });
});

describe('bytesToBase64 / base64ToBytes — chunked, binary-safe conversion', () => {
  it('round-trips arbitrary binary bytes (all 256 byte values)', () => {
    const bytes = new Uint8Array(256);
    for (let i = 0; i < 256; i++) bytes[i] = i;
    const encoded = bytesToBase64(bytes);
    expect(encoded).toBe(Buffer.from(bytes).toString('base64'));
    expect(Array.from(base64ToBytes(encoded))).toEqual(Array.from(bytes));
  });

  it('matches Node Buffer output across the chunk boundary (chunk size is 32768 bytes)', () => {
    // A length that straddles multiple chunks, with deterministic pseudo-random content.
    const length = 32768 * 3 + 12345;
    const bytes = new Uint8Array(length);
    let seed = 42;
    for (let i = 0; i < length; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      bytes[i] = seed % 256;
    }
    const encoded = bytesToBase64(bytes);
    expect(encoded).toBe(Buffer.from(bytes).toString('base64'));
    expect(Array.from(base64ToBytes(encoded))).toEqual(Array.from(bytes));
  });

  it('round-trips an empty byte array', () => {
    expect(bytesToBase64(new Uint8Array(0))).toBe('');
    expect(base64ToBytes('').length).toBe(0);
  });
});

describe('looksLikeBase64', () => {
  it('accepts a real base64 string', () => {
    expect(looksLikeBase64(encodeTextToBase64('hello world'))).toBe(true);
  });

  it('accepts base64 with padding', () => {
    expect(looksLikeBase64('aGVsbG8=')).toBe(true); // "hello"
  });

  it('accepts whitespace/line-wrapped base64', () => {
    const encoded = encodeTextToBase64('a'.repeat(200));
    const wrapped = encoded.match(/.{1,60}/g)!.join('\n');
    expect(looksLikeBase64(wrapped)).toBe(true);
  });

  it('rejects plain prose (contains spaces/punctuation outside the base64 alphabet)', () => {
    expect(looksLikeBase64('Hello, world! This is not base64.')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(looksLikeBase64('')).toBe(false);
  });

  it('rejects a string whose length is not a multiple of 4', () => {
    expect(looksLikeBase64('abcde')).toBe(false);
  });

  it('rejects invalid padding placement', () => {
    expect(looksLikeBase64('ab=c')).toBe(false);
  });
});

describe('stripDataUriPrefix', () => {
  it('strips a data: URI prefix with a mime type', () => {
    expect(stripDataUriPrefix('data:image/png;base64,AAAA')).toBe('AAAA');
  });

  it('strips a data: URI prefix with no mime type', () => {
    expect(stripDataUriPrefix('data:;base64,AAAA')).toBe('AAAA');
  });

  it('leaves plain base64 (no prefix) untouched', () => {
    expect(stripDataUriPrefix('AAAA')).toBe('AAAA');
  });
});

describe('buildDataUri', () => {
  it('builds a data URI with the given mime type', () => {
    expect(buildDataUri('image/png', 'AAAA')).toBe('data:image/png;base64,AAAA');
  });

  it('falls back to application/octet-stream for an empty mime type', () => {
    expect(buildDataUri('', 'AAAA')).toBe('data:application/octet-stream;base64,AAAA');
  });
});

describe('byteSize', () => {
  it('counts ASCII as 1 byte per character', () => {
    expect(byteSize('hello')).toBe(5);
  });

  it('counts multi-byte UTF-8 characters correctly (not UTF-16 code units)', () => {
    expect(byteSize('日')).toBe(3); // U+65E5 is 3 bytes in UTF-8
    expect(byteSize('🎉')).toBe(4); // astral emoji is 4 bytes in UTF-8, 2 UTF-16 code units
  });
});
