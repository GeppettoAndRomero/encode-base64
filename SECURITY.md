# Security Policy

`encode-base64` runs entirely in your browser. There is no server component and no
account system, so the text and files you encode or decode are never uploaded. Most
classic web vulnerabilities (server-side injection, auth bypass, data exfiltration via
a backend) do not apply.

We still take client-side security seriously — XSS, supply-chain issues in
dependencies, a service worker caching bug, or anything that could cause your data to
leave your device.

## Reporting a vulnerability

Please report suspected vulnerabilities privately, not in a public issue:

- Email: **security@runlocally.app**
- Or use GitHub's private vulnerability reporting (Security → Report a vulnerability).

Include what you found, steps to reproduce, and the impact you expect. We aim to
acknowledge within a few days. Please give us a reasonable window to ship a fix
before public disclosure.

## Scope

In scope:

- This repository's source and the deployed site.
- The encode/decode logic, the service worker, and the PWA manifest.
- Anything that could send your text or file input off the device.

Out of scope:

- Findings that require a compromised device or a malicious browser extension.
- Missing hardening headers that have no concrete exploit.

Thank you for helping keep users safe.
