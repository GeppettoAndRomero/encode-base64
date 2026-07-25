import { describe, it, expect } from 'vitest';
import { isFileSizeAccepted, MAX_FILE_SIZE_BYTES } from '@/utils/fileValidation';

// Minimal File-like stub (only the field the validator reads).
const f = (size: number): File => ({ size }) as unknown as File;

describe('isFileSizeAccepted', () => {
  it('accepts a small file', () => {
    expect(isFileSizeAccepted(f(1024))).toBe(true);
  });

  it('accepts a file exactly at the cap', () => {
    expect(isFileSizeAccepted(f(MAX_FILE_SIZE_BYTES))).toBe(true);
  });

  it('rejects a file one byte over the cap', () => {
    expect(isFileSizeAccepted(f(MAX_FILE_SIZE_BYTES + 1))).toBe(false);
  });

  it('rejects a much larger file', () => {
    expect(isFileSizeAccepted(f(MAX_FILE_SIZE_BYTES * 10))).toBe(false);
  });
});
