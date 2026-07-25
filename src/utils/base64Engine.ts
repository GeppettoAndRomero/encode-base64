/**
 * Base64 encode/decode engine. Pure functions, no I/O.
 *
 * Text encode (issue #68 confirmed design): `TextEncoder` turns the string into
 * its UTF-8 byte sequence first, and THAT byte sequence is what gets base64'd.
 * This is deliberately NOT `btoa(str)` (throws on any code point above U+00FF —
 * breaks on Japanese, emoji, accented Latin, everything non-Latin1) and NOT the
 * common `btoa(unescape(encodeURIComponent(str)))` hack (works, but is an
 * undocumented abuse of two APIs never meant for this — `unescape`/`escape` are
 * deprecated legacy Latin1 tools; the intent is unclear and it silently breaks
 * if either function's behavior ever changes). Going through `TextEncoder`
 * explicitly says "these are UTF-8 bytes" and is the same primitive every other
 * modern browser API (fetch bodies, Blob, crypto.subtle.digest) uses.
 *
 * Text decode: base64 -> bytes -> `TextDecoder` with `fatal: true`. If the bytes
 * are not valid UTF-8, decoding throws and the caller is told so explicitly
 * (`ok: false` with the raw bytes attached) rather than being handed the lossy,
 * silently-mangled string `TextDecoder`'s default (non-fatal) mode would
 * produce (U+FFFD replacement characters standing in for whatever was there).
 * The UI is expected to offer a raw-bytes download in that case instead of
 * displaying something that looks like text but isn't (issue #68).
 *
 * File encode/decode: chunked byte<->binary-string conversion. Spreading an
 * entire large `Uint8Array` into a single `String.fromCharCode(...bytes)` call
 * passes one argument per byte — past a few tens of thousands of bytes this
 * blows the engine's call-stack / argument-count limit and throws (or, in some
 * engines, silently truncates). Chunking keeps each spread comfortably under
 * that limit regardless of the input file's size. No Web Worker is used: this
 * is a fast, allocation-only loop with no WASM/codec step to offload (the same
 * "no worker needed" reasoning format-json's jsonEngine.ts documents for its
 * own main-thread-only JSON.parse/JSON.stringify) — the risk chunking guards
 * against is a stack/argument limit, not main-thread CPU time.
 */

// Comfortably under every browser engine's Function.prototype.apply /
// spread argument-count ceiling (which vary but are generally >= 65536).
const CHUNK_SIZE = 0x8000; // 32768

/** Binary-safe bytes -> base64, via a chunked `String.fromCharCode` pass so `btoa` never sees a spread larger than `CHUNK_SIZE`. */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

/** base64 -> bytes. Throws (the native `atob` error) if `base64` is not valid base64. */
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** UTF-8-safe text -> base64. See module doc for why this is not `btoa(text)`. */
export function encodeTextToBase64(text: string): string {
  return bytesToBase64(new TextEncoder().encode(text));
}

export type TextDecodeResult =
  | { ok: true; text: string }
  | { ok: false; bytes: Uint8Array };

/**
 * base64 -> UTF-8 text. `ok: false` (with the raw bytes) when the decoded bytes
 * are not valid UTF-8 — the caller should offer those bytes as a download
 * rather than render a lossy/garbled string. Throws (propagating the native
 * `atob` error) if `base64` itself is not valid base64; callers are expected to
 * check `looksLikeBase64` first, same as the auto-detect path does.
 */
export function decodeBase64ToText(base64: string): TextDecodeResult {
  const bytes = base64ToBytes(base64);
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return { ok: true, text };
  } catch {
    return { ok: false, bytes };
  }
}

const DATA_URI_BASE64_RE = /^data:[^;,]*;base64,/i;

/** Strip a leading `data:<mime>;base64,` prefix, if present, so the rest can be treated as plain base64. */
export function stripDataUriPrefix(input: string): string {
  return input.replace(DATA_URI_BASE64_RE, '');
}

/** `data:<mime>;base64,<data>` for a file's encoded output. */
export function buildDataUri(mimeType: string, base64: string): string {
  return `data:${mimeType || 'application/octet-stream'};base64,${base64}`;
}

const BASE64_CHARS_RE = /^[A-Za-z0-9+/]+={0,2}$/;

/**
 * "Looks like base64": the auto-detect heuristic for a pasted string (issue #68
 * confirmed design — regex match on the base64 alphabet AND a successful
 * decode). Whitespace/newlines are stripped first so line-wrapped base64
 * (common when copied from elsewhere) still matches. This is intentionally a
 * heuristic, not a proof: a short plain-text word made entirely of base64
 * alphabet characters (e.g. "Java") will also match — the spec accepts this
 * ambiguity since the user can always switch modes manually.
 */
export function looksLikeBase64(input: string): boolean {
  const compact = input.replace(/\s+/g, '');
  if (compact.length === 0 || compact.length % 4 !== 0) return false;
  if (!BASE64_CHARS_RE.test(compact)) return false;
  try {
    atob(compact);
    return true;
  } catch {
    return false;
  }
}

/** UTF-8 byte length of a string (not `.length`, which counts UTF-16 code units). */
export function byteSize(text: string): number {
  return new TextEncoder().encode(text).length;
}
