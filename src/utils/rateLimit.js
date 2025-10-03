// src/utils/rateLimit.js
const lastSeen = new Map();

/**
 * Simple per-chat rate limiter.
 * Returns true if message should be processed; false if throttled.
 */
function allowMessage(chatId, minGapMs = 800) {
  const now = Date.now();
  const last = lastSeen.get(chatId) || 0;
  if (now - last < minGapMs) return false;
  lastSeen.set(chatId, now);
  return true;
}

module.exports = { allowMessage };
