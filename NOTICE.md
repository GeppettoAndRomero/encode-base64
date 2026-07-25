# Third-party notices

The source code in this repository is licensed under the [MIT License](./LICENSE).

This application has **no third-party runtime dependency** beyond its framework:
Astro, Preact, and `@astrojs/preact` are all distributed under the MIT License. Base64
encoding/decoding is done with the browser's native `TextEncoder`/`TextDecoder` and
`btoa`/`atob` (`src/utils/base64Engine.ts`) — no external base64 or encoding library
is used.
