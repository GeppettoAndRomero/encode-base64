# encode-base64

Encode text or files to Base64, or decode Base64 back to text or a file — entirely in
your browser. Nothing is uploaded, processed on your device. Open source, works
offline (PWA).

Part of [runlocally](https://runlocally.app) — small tools that run locally on your device.

## How it works

Text encoding goes through `TextEncoder` to get the UTF-8 byte sequence first, then a
binary-safe, chunked byte-to-base64 conversion — never the classic `btoa(str)` (breaks
on non-Latin1 text) or `btoa(unescape(encodeURIComponent(str)))` hack. Text decoding
reverses that: base64 → bytes → `TextDecoder`. If the decoded bytes are not valid
UTF-8, the tool offers a raw-bytes download instead of showing a garbled string.

File encoding reads the file as an `ArrayBuffer` and converts it to base64 with the
same chunked routine, so large files don't blow the call-stack/argument limit that a
single `String.fromCharCode(...bytes)` spread would hit. File decoding takes pasted
base64 text plus a filename you provide (the original name can't be recovered from the
string alone) and reconstructs the file for download.

Pasting text auto-detects whether it looks like base64 (and actually decodes) and
switches to Decode mode automatically; you can always switch modes manually.

See `src/utils/base64Engine.ts` for the implementation.

## Features

- Text mode: plain text ⇄ base64, UTF-8 safe (Japanese, emoji, any Unicode)
- File mode: any file ⇄ base64 or a `data:` URI
- Auto-detects Encode vs. Decode on paste
- Invalid UTF-8 on decode offers a raw-bytes download instead of garbled text
- Works offline (PWA), installable

## Develop

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
```

Stack: Astro + Preact + TypeScript. No Web Worker and no third-party runtime
dependency — base64 conversion is a fast, chunked loop that runs directly on the main
thread.

## Browser support

Works in any browser with `TextEncoder`/`TextDecoder`/`atob`/`btoa` (i.e. all current
browsers).

## License

[MIT](./LICENSE). Built and maintained by Geppetto. Some code is written with AI
assistance; all review and decisions are the maintainer's.
