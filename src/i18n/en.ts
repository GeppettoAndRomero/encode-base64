import type { ToolContent } from './types';

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'Base64 Encode & Decode — Text and Files, No Upload | runlocally',
    description:
      'Encode text or files to Base64, or decode Base64 back to text or a file, directly in your browser. Handles Unicode text and binary files correctly. Nothing is uploaded — open source, works offline.',
    ogTitle: 'Base64 Encode & Decode — Text and Files',
    ogDescription:
      'Encode or decode Base64 for text and files in your browser. Handles Unicode and binary correctly. Nothing is uploaded.',
  },

  hero: {
    h1: 'Base64 Encode / Decode',
    tagline:
      'Encode text or files to Base64, or decode Base64 back — in your browser. Unicode-safe, binary-safe. Nothing is uploaded.',
  },

  intro: {
    h2: 'Encode or decode Base64 without leaving your browser',
    paras: [
      'Base64 turns arbitrary bytes into plain ASCII text, which is why it shows up in data URIs, email attachments, API payloads, and config files. This tool converts either direction: type or paste text to Base64-encode it, or paste a Base64 string to get the original text or file back.',
      'Text encoding goes through UTF-8 bytes correctly, so Japanese, emoji, and any other Unicode text round-trips exactly — unlike a plain btoa(), which breaks on anything outside Latin-1. File encoding reads the file in chunks, so it works on large files without hitting a browser limit. If you paste something that decodes to bytes that are not valid UTF-8 text, the tool offers a raw-bytes download instead of showing you a garbled string.',
    ],
  },

  privacy: {
    h2: 'Why your text and files stay on your device',
    lead: 'Privacy here is structural, not a promise. There is no upload step because there is no server to upload to — this matters here since what people encode is often something sensitive: an API token, a certificate, a config file, or a private document:',
    points: [
      'Encoding and decoding both happen entirely in your browser.',
      'The page is served as static files and makes no request with your input.',
      'The source is open and anyone can read it (MIT).',
      'It works offline, which is only possible because nothing leaves the device.',
    ],
    note: "If you want to check for yourself, open your browser's Network panel while encoding or decoding — no request carries your data.",
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to use it',
    steps: [
      {
        h3: 'Pick Text or File mode',
        p: 'Text mode works on a string you type or paste. File mode works on a file you choose or drop.',
      },
      {
        h3: 'Choose Encode or Decode',
        p: 'Pasting a string that looks like Base64 switches to Decode automatically; you can always switch it back manually.',
      },
      {
        h3: 'Add your input',
        p: 'Type or paste text, or choose/drop a file. Any file type can be encoded.',
      },
      {
        h3: 'Copy or download the result',
        p: 'Copy the Base64 (or data URI) to your clipboard, or download it. Decoding a file asks for a filename first, since the original name is not stored in the Base64 string itself.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Is my text or file uploaded anywhere?',
      a: "No. Encoding and decoding both happen entirely in your browser. There is no server component, so your data has no path off your device. The source is open and you can confirm this in your browser's Network panel.",
    },
    {
      q: "Why not just use btoa() in the browser console?",
      a: "btoa() only handles Latin-1 text (character codes 0–255) — it throws an error on Japanese, emoji, or most other Unicode text. This tool encodes the actual UTF-8 byte sequence, so any text round-trips correctly. Decoding does the reverse through a UTF-8 decoder rather than assuming Latin-1.",
    },
    {
      q: "What happens if I decode Base64 that isn't valid UTF-8 text?",
      a: 'Rather than show you a string full of replacement characters (a common failure mode), the tool detects that the decoded bytes are not valid UTF-8 and offers them as a raw-bytes download instead — useful when the Base64 actually represents a binary file, not text.',
    },
    {
      q: 'Can I encode a large file?',
      a: 'There is no fixed limit beyond a soft cap chosen to keep the page responsive. Files are converted in chunks, avoiding the crash a naive, single-pass conversion can hit on large inputs. Very large files may still take a moment because everything runs on your device.',
    },
    {
      q: "What's a data URI, and when would I use it?",
      a: "A data URI embeds a file's Base64 data directly in a string like data:image/png;base64,..., so it can be used in place of a URL — for example, inline in CSS or HTML. File mode can show either the plain Base64 or the full data URI.",
    },
    {
      q: 'Does it work offline?',
      a: 'Yes. It is a PWA. After the first visit it is cached, so encoding and decoding work without a network connection. You can also install it to your home screen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      "Built and maintained by Geppetto. Some code is written with AI assistance; all review and decisions are the maintainer's.",
    securityText: 'Security',
  },
};
