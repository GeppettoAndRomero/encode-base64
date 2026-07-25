/**
 * EncodeBase64Tool — the tool's only non-frozen widget.
 *
 * One reversible transform, two directions, two input shapes (issue #68
 * confirmed design — "encode" covers both directions, the same "one axis"
 * bundling `format-json` uses for format/minify):
 *
 *   - Text mode:  a textarea holds either plain text (Encode) or a base64
 *                 string (Decode); the other representation is derived.
 *   - File mode:  Encode reads a chosen/dropped file and produces base64 (or
 *                 a data URI); Decode takes pasted base64 + a user-supplied
 *                 filename (the original name cannot be recovered from the
 *                 string alone) and reconstructs a downloadable file.
 *
 * All of Text mode is recomputed from (textInput, direction) on every render
 * — the same "always re-derive, never cache stale state" pattern as
 * format-json's jsonEngine result — so the output can never drift from what's
 * on screen. File mode's encode side is necessarily stateful: reading a File
 * is asynchronous I/O, not a pure derivation.
 *
 * No Web Worker: see base64Engine.ts's module doc for why chunking (not a
 * worker) is what large files need here.
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { AppField } from './AppField';
import { ErrorToast } from './ErrorToast';
import { isFileSizeAccepted, MAX_FILE_SIZE_BYTES } from '@/utils/fileValidation';
import {
  bytesToBase64,
  base64ToBytes,
  encodeTextToBase64,
  decodeBase64ToText,
  looksLikeBase64,
  stripDataUriPrefix,
  buildDataUri,
  byteSize,
  type TextDecodeResult,
} from '@/utils/base64Engine';
import { ui } from '@/i18n/ui';

type TopMode = 'text' | 'file';
type Direction = 'encode' | 'decode';
type FileRepr = 'base64' | 'dataUri';

interface ErrorToastItem {
  id: string;
  message: string;
}

interface EncodeBase64ToolProps {
  locale?: string;
}

type TextResult =
  | { kind: 'encoded'; value: string }
  | { kind: 'invalidBase64' }
  | { kind: 'decodedText'; value: string }
  | { kind: 'decodedBytes'; bytes: Uint8Array };

function formatBytesLabel(n: number): string {
  return n.toLocaleString();
}

export function EncodeBase64Tool({ locale = 'en' }: EncodeBase64ToolProps) {
  const t = (ui as any)[locale] ?? ui.en;

  const [topMode, setTopMode] = useState<TopMode>('text');
  const [direction, setDirection] = useState<Direction>('encode');

  // ---- Text mode ----
  const [textInput, setTextInput] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- File mode: encode ----
  const [encFileName, setEncFileName] = useState<string | undefined>(undefined);
  const [encFileMime, setEncFileMime] = useState('application/octet-stream');
  const [encFileBase64, setEncFileBase64] = useState<string | null>(null);
  const [encFileRepr, setEncFileRepr] = useState<FileRepr>('base64');
  const [isEncodingFile, setIsEncodingFile] = useState(false);

  // ---- File mode: decode ----
  const [decBase64Input, setDecBase64Input] = useState('');
  const [decFileName, setDecFileName] = useState('');

  const [errorToasts, setErrorToasts] = useState<ErrorToastItem[]>([]);
  const showErrorToast = useCallback((message: string) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    setErrorToasts((prev) => [...prev, { id, message }]);
  }, []);
  const removeErrorToast = useCallback((id: string) => {
    setErrorToasts((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // ---- Text mode: derive the result from (textInput, direction) every render ----
  const textResult = useMemo<TextResult | null>(() => {
    if (textInput === '') return null;
    if (direction === 'encode') {
      return { kind: 'encoded', value: encodeTextToBase64(textInput) };
    }
    const stripped = stripDataUriPrefix(textInput.trim());
    if (!looksLikeBase64(stripped)) return { kind: 'invalidBase64' };
    const decoded: TextDecodeResult = decodeBase64ToText(stripped);
    return decoded.ok ? { kind: 'decodedText', value: decoded.text } : { kind: 'decodedBytes', bytes: decoded.bytes };
  }, [textInput, direction]);

  /**
   * Auto-detect on paste (issue #68 confirmed design): look only at what was
   * just pasted (not the whole field, which may already hold other text), and
   * switch Encode/Decode accordingly. A manual switch afterwards always wins —
   * this only fires on the paste event itself, never re-evaluated on typing.
   */
  const handleTextPaste = (e: JSX.TargetedClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData?.getData('text') ?? '';
    if (pasted.trim() === '') return;
    const stripped = stripDataUriPrefix(pasted.trim());
    setDirection(looksLikeBase64(stripped) ? 'decode' : 'encode');
  };

  const handleClearText = () => setTextInput('');

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleDownloadTextResult = () => {
    if (!textResult) return;
    if (textResult.kind === 'encoded') {
      downloadBlob(new Blob([textResult.value], { type: 'text/plain;charset=utf-8' }), 'encoded.base64.txt');
    } else if (textResult.kind === 'decodedText') {
      downloadBlob(new Blob([textResult.value], { type: 'text/plain;charset=utf-8' }), 'decoded.txt');
    } else if (textResult.kind === 'decodedBytes') {
      downloadBlob(new Blob([textResult.bytes as BlobPart]), 'decoded.bin');
    }
  };

  // ---- File mode: encode ----
  const encodeFile = useCallback(
    async (file: File) => {
      if (!isFileSizeAccepted(file)) {
        showErrorToast(
          t.errFileTooLarge.replace('{name}', file.name).replace('{max}', formatBytesLabel(MAX_FILE_SIZE_BYTES))
        );
        return;
      }
      setIsEncodingFile(true);
      try {
        const buf = await file.arrayBuffer();
        const b64 = bytesToBase64(new Uint8Array(buf));
        setEncFileBase64(b64);
        setEncFileName(file.name);
        setEncFileMime(file.type || 'application/octet-stream');
      } finally {
        setIsEncodingFile(false);
      }
    },
    [showErrorToast, t]
  );

  const handleFileInputChange = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (file) void encodeFile(file);
    target.value = '';
  };

  // A file dropped/pasted anywhere is unambiguous intent: switch to File+Encode
  // and encode it, regardless of whatever mode was showing (judgment call —
  // there is no "decode a File object" operation, so Encode is the only
  // direction a dropped file can mean).
  useEffect(() => {
    const handler = (e: Event) => {
      const files = (e as CustomEvent<File[]>).detail ?? [];
      const file = files[0];
      if (file) {
        setTopMode('file');
        setDirection('encode');
        void encodeFile(file);
      }
      window.dispatchEvent(new CustomEvent('filesProcessed'));
    };
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [encodeFile]);

  const encFileOutput =
    encFileBase64 == null ? null : encFileRepr === 'dataUri' ? buildDataUri(encFileMime, encFileBase64) : encFileBase64;

  const handleDownloadEncodedFile = () => {
    if (encFileOutput == null) return;
    downloadBlob(
      new Blob([encFileOutput], { type: 'text/plain;charset=utf-8' }),
      `${encFileName ?? 'file'}.base64.txt`
    );
  };

  // ---- File mode: decode ----
  const decStripped = stripDataUriPrefix(decBase64Input.trim());
  const decValid = decStripped !== '' && looksLikeBase64(decStripped);
  const decByteLength = useMemo(() => {
    if (!decValid) return null;
    try {
      return base64ToBytes(decStripped).length;
    } catch {
      return null;
    }
  }, [decValid, decStripped]);

  const handleDownloadDecodedFile = () => {
    if (!decValid || decFileName.trim() === '') return;
    const bytes = base64ToBytes(decStripped);
    downloadBlob(new Blob([bytes as BlobPart]), decFileName.trim());
  };

  const renderTextOutput = () => {
    if (textInput === '') {
      return <p style="color: var(--color-subtle); font-size: var(--fs-2);">{t.outputEmptyHint}</p>;
    }
    const r = textResult as NonNullable<typeof textResult>;

    if (r.kind === 'invalidBase64') {
      return (
        <div role="alert" class="fj-error" data-testid="invalid-base64-notice">
          <p style="margin: 0; color: var(--color-danger); font-weight: 500;">{t.invalidBase64Heading}</p>
          <p style="margin: var(--space-1) 0 0 0;">{t.invalidBase64Notice}</p>
        </div>
      );
    }

    if (r.kind === 'decodedBytes') {
      return (
        <div class="fj-error" data-testid="raw-bytes-notice">
          <p style="margin: 0; font-weight: 500;">{t.rawBytesHeading}</p>
          <p style="margin: var(--space-1) 0 var(--space-3) 0;">{t.rawBytesNotice}</p>
          <button id="download-action" type="button" class="app-button app-button--secondary" onClick={handleDownloadTextResult}>
            {t.downloadRawBytes}
          </button>
        </div>
      );
    }

    const value = r.value;
    const testId = r.kind === 'encoded' ? 'base64-output' : 'text-output';

    return (
      <>
        <pre class="fj-output" data-testid={testId}>
          {value}
        </pre>
        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-2); font-size: var(--fs-1); color: var(--color-subtle);" class="num">
          <span data-testid="output-size">{t.sizeOutput.replace('{bytes}', formatBytesLabel(byteSize(value)))}</span>
        </div>
        <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap;">
          <button id="copy-action" type="button" class="app-button app-button--primary" onClick={() => handleCopy(value)}>
            {copyStatus === 'copied' ? t.copied : t.copyOutput}
          </button>
          <button id="download-action" type="button" class="app-button app-button--secondary" onClick={handleDownloadTextResult}>
            {t.downloadOutput}
          </button>
        </div>
        {copyStatus === 'error' && (
          <p role="alert" style="color: var(--color-danger); font-size: var(--fs-2); margin: var(--space-2) 0 0 0;">
            {t.copyFailed}
          </p>
        )}
      </>
    );
  };

  return (
    <div>
      <AppCard>
        <fieldset style="border: none; padding: 0; margin: 0 0 var(--space-4) 0;">
          <legend style="font-size: var(--fs-2); font-weight: 500; margin-bottom: var(--space-2); padding: 0;">
            {t.topModeLabel}
          </legend>
          <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
            {(['text', 'file'] as TopMode[]).map((m) => (
              <label key={m} style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer; font-size: var(--fs-2);">
                <input
                  type="radio"
                  id={`top-mode-${m}`}
                  name="encode-base64-top-mode"
                  value={m}
                  checked={topMode === m}
                  onChange={() => setTopMode(m)}
                />
                {m === 'text' ? t.topModeText : t.topModeFile}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset style="border: none; padding: 0; margin: 0;">
          <legend style="font-size: var(--fs-2); font-weight: 500; margin-bottom: var(--space-2); padding: 0;">
            {t.directionLabel}
          </legend>
          <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
            {(['encode', 'decode'] as Direction[]).map((d) => (
              <label key={d} style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer; font-size: var(--fs-2);">
                <input
                  type="radio"
                  id={`direction-${d}`}
                  name="encode-base64-direction"
                  value={d}
                  checked={direction === d}
                  onChange={() => setDirection(d)}
                />
                {d === 'encode' ? t.directionEncode : t.directionDecode}
              </label>
            ))}
          </div>
        </fieldset>
      </AppCard>

      {topMode === 'text' && (
        <>
          <AppCard className="mt-6">
            <div style="margin-bottom: var(--space-4);">
              <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">{t.textInputHeading}</h2>
              <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">
                {direction === 'encode' ? t.textInputSubtitleEncode : t.textInputSubtitleDecode}
              </p>
            </div>

            <textarea
              id="text-input"
              class="app-field__textarea"
              style="width: 100%; min-height: 180px; font-family: ui-monospace, monospace; font-size: var(--fs-2); box-sizing: border-box;"
              placeholder={direction === 'encode' ? t.textInputPlaceholderEncode : t.textInputPlaceholderDecode}
              value={textInput}
              spellcheck={false}
              onInput={(e) => setTextInput((e.target as HTMLTextAreaElement).value)}
              onPaste={handleTextPaste}
            />

            <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-2);">
              <span class="num" data-testid="input-size" style="font-size: var(--fs-1); color: var(--color-subtle);">
                {t.sizeInput.replace('{bytes}', formatBytesLabel(byteSize(textInput)))}
              </span>
              {textInput && (
                <AppButton variant="ghost" onClick={handleClearText}>
                  {t.clearInput}
                </AppButton>
              )}
            </div>
          </AppCard>

          <AppCard className="mt-6">
            <div style="margin-bottom: var(--space-3);">
              <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">{t.outputHeading}</h2>
            </div>
            {renderTextOutput()}
          </AppCard>
        </>
      )}

      {topMode === 'file' && direction === 'encode' && (
        <AppCard className="mt-6">
          <div style="margin-bottom: var(--space-4);">
            <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">{t.fileEncodeHeading}</h2>
            <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">{t.fileEncodeSubtitle}</p>
          </div>

          <button type="button" id="choose-file-action" class="file-upload" style="width: 100%;" onClick={() => document.getElementById('file-input')?.click()}>
            <div class="file-upload__icon" aria-hidden="true">📄</div>
            <div class="file-upload__text">
              <p class="file-upload__primary">{t.chooseFileButton}</p>
              <p class="file-upload__secondary">{t.fileDropHint}</p>
            </div>
          </button>
          <input id="file-input" type="file" onChange={handleFileInputChange} style="display: none;" />

          {encFileName && (
            <p style="font-size: var(--fs-1); color: var(--color-subtle); margin-top: var(--space-3);" title={encFileName}>
              {t.loadedFileLabel.replace('{name}', encFileName)}
            </p>
          )}

          {isEncodingFile && (
            <p role="status" data-testid="encoding-status" style="margin-top: var(--space-3);">
              {t.fileEncodingStatus}
            </p>
          )}

          {encFileBase64 != null && !isEncodingFile && (
            <div style="margin-top: var(--space-4);">
              <fieldset style="border: none; padding: 0; margin: 0 0 var(--space-3) 0;">
                <legend style="font-size: var(--fs-2); font-weight: 500; margin-bottom: var(--space-2); padding: 0;">
                  {t.fileReprLabel}
                </legend>
                <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
                  {(['base64', 'dataUri'] as FileRepr[]).map((r) => (
                    <label key={r} style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer; font-size: var(--fs-2);">
                      <input
                        type="radio"
                        id={`repr-${r === 'dataUri' ? 'datauri' : 'base64'}`}
                        name="encode-base64-file-repr"
                        value={r}
                        checked={encFileRepr === r}
                        onChange={() => setEncFileRepr(r)}
                      />
                      {r === 'base64' ? t.fileReprBase64 : t.fileReprDataUri}
                    </label>
                  ))}
                </div>
              </fieldset>

              <pre class="fj-output" data-testid="file-encoded-output">
                {encFileOutput}
              </pre>
              <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-2); font-size: var(--fs-1); color: var(--color-subtle);" class="num">
                <span data-testid="file-output-size">
                  {t.sizeOutput.replace('{bytes}', formatBytesLabel(byteSize(encFileOutput ?? '')))}
                </span>
              </div>
              <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap;">
                <button id="copy-action" type="button" class="app-button app-button--primary" onClick={() => handleCopy(encFileOutput ?? '')}>
                  {copyStatus === 'copied' ? t.copied : t.copyOutput}
                </button>
                <button id="download-action" type="button" class="app-button app-button--secondary" onClick={handleDownloadEncodedFile}>
                  {t.downloadOutput}
                </button>
              </div>
              {copyStatus === 'error' && (
                <p role="alert" style="color: var(--color-danger); font-size: var(--fs-2); margin: var(--space-2) 0 0 0;">
                  {t.copyFailed}
                </p>
              )}
            </div>
          )}
        </AppCard>
      )}

      {topMode === 'file' && direction === 'decode' && (
        <AppCard className="mt-6">
          <div style="margin-bottom: var(--space-4);">
            <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">{t.fileDecodeHeading}</h2>
            <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">{t.fileDecodeSubtitle}</p>
          </div>

          <textarea
            id="decode-base64-input"
            class="app-field__textarea"
            style="width: 100%; min-height: 160px; font-family: ui-monospace, monospace; font-size: var(--fs-2); box-sizing: border-box;"
            placeholder={t.decodeBase64Placeholder}
            value={decBase64Input}
            spellcheck={false}
            onInput={(e) => setDecBase64Input((e.target as HTMLTextAreaElement).value)}
          />

          {decBase64Input.trim() !== '' && !decValid && (
            <p role="alert" data-testid="file-decode-invalid" style="color: var(--color-danger); font-size: var(--fs-2); margin-top: var(--space-2);">
              {t.invalidBase64Notice}
            </p>
          )}

          {decValid && decByteLength != null && (
            <p data-testid="file-decode-size" style="font-size: var(--fs-1); color: var(--color-subtle); margin-top: var(--space-2);" class="num">
              {t.sizeOutput.replace('{bytes}', formatBytesLabel(decByteLength))}
            </p>
          )}

          <div style="margin-top: var(--space-4); max-width: 360px;">
            <AppField
              id="decode-filename-input"
              label={t.filenameLabel}
              value={decFileName}
              onChange={(v) => setDecFileName(String(v))}
              placeholder={t.filenamePlaceholder}
              required
              helpText={t.filenameHelp}
              locale={locale}
            />
          </div>

          <div style="margin-top: var(--space-4);">
            <button
              id="download-action"
              type="button"
              class="app-button app-button--primary"
              disabled={!decValid || decFileName.trim() === ''}
              onClick={handleDownloadDecodedFile}
            >
              {t.downloadFileButton}
            </button>
          </div>
        </AppCard>
      )}

      {errorToasts.length > 0 && (
        <div className="error-toast-container" aria-label={t.notificationsAria}>
          {errorToasts.map((toast) => (
            <ErrorToast key={toast.id} id={toast.id} message={toast.message} onClose={removeErrorToast} locale={locale} />
          ))}
        </div>
      )}

      <style>{`
        .fj-output {
          white-space: pre-wrap;
          word-break: break-all;
          overflow-x: auto;
          max-height: 320px;
          overflow-y: auto;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: var(--space-3);
          font-family: ui-monospace, monospace;
          font-size: var(--fs-2);
          margin: 0;
        }
        .fj-error {
          padding: var(--space-3);
          background: color-mix(in srgb, var(--color-danger) 8%, var(--color-bg));
          border: 1px solid var(--color-danger);
          border-radius: var(--radius-sm);
          font-size: var(--fs-2);
        }
      `}</style>
    </div>
  );
}
