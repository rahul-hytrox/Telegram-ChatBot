// src/utils/sanitize.js

// Remove invisible zero-width & bidi control characters that can be abused
const ZERO_WIDTH_REGEX = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g;

// Control chars except \n and \t
const CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/**
 * Escape HTML special chars. Use this if you send with parse_mode: 'HTML'
 * so user-supplied text can't break formatting.
 */
function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')   // angle brackets escaped (safer than stripping)
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Normalize whitespace:
 * - convert Windows newlines to \n
 * - collapse runs of spaces/tabs
 * - trim outer whitespace
 * Keeps single \n line breaks.
 */
function normalizeWhitespace(text = '') {
  const unified = String(text).replace(/\r\n?/g, '\n');
  // collapse tabs and 3+ spaces into a single space
  return unified
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Strip problematic characters (zero-width, bidi controls, control chars).
 * Leaves standard printable chars plus \n and \t.
 */
function stripProblemChars(text = '') {
  return String(text)
    .replace(ZERO_WIDTH_REGEX, '')
    .replace(CONTROL_CHARS_REGEX, '');
}

/**
 * Clamp length to avoid excessively long inputs
 */
function clampLength(text = '', max = 4000) {
  if (text.length <= max) return text;
  return text.slice(0, max);
}

/**
 * Main sanitizer for free-form user input you will STORE or ECHO BACK
 * in plain text (no Telegram formatting). Keeps it readable and safe.
 */
function sanitizeInput(text) {
  let t = String(text ?? '');
  t = stripProblemChars(t);
  t = normalizeWhitespace(t);
  // If you're sending in plain text (no parse_mode), removing angle brackets
  // avoids accidental HTML feel:
  t = t.replace(/[<>]/g, '');
  t = clampLength(t, 4000);
  return t;
}

/**
 * If you plan to send user text with parse_mode: 'HTML',
 * call htmlSafeInput() and use the result directly in sendMessage.
 */
function htmlSafeInput(text) {
  let t = String(text ?? '');
  t = stripProblemChars(t);
  t = normalizeWhitespace(t);
  t = escapeHtml(t);
  t = clampLength(t, 4000);
  return t;
}

module.exports = {
  sanitizeInput,
  htmlSafeInput,
  escapeHtml,
  normalizeWhitespace,
  stripProblemChars,
  clampLength,
};
