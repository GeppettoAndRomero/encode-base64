/**
 * File-size guard for the "choose/drop a file to encode" path.
 *
 * Unlike format-json's `.json` accept-list, there is no file-type gate here:
 * encoding arbitrary binary data to base64 is the entire point of this tool,
 * so every file type is accepted. The only check is size — this is a soft
 * engineering limit (not part of issue #68's confirmed design), chosen because
 * a very large file has to be held in memory twice at once (the input
 * `ArrayBuffer` and the ~4/3-larger base64 output string), and that string
 * then also has to survive being rendered into the DOM and round-tripped
 * through the clipboard. Capping input size keeps the tool responsive rather
 * than rejecting realistic use — most files people base64-encode (images,
 * small documents, certs, config blobs) are well under this.
 */
export const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024; // 200 MB

export function isFileSizeAccepted(file: File): boolean {
  return file.size <= MAX_FILE_SIZE_BYTES;
}
