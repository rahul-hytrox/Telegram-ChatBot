// src/state/session.js
const sessions = new Map(); // chatId -> { messageCount, menuShown, stage, topic }

function getSession(chatId) {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, {
      messageCount: 0,
      menuShown: false,
      stage: 'idle',
      topic: null
    });
  }
  return sessions.get(chatId);
}

function setSession(chatId, data) {
  const current = getSession(chatId);
  sessions.set(chatId, { ...current, ...data });
}

function resetSession(chatId) {
  sessions.set(chatId, {
    messageCount: 0,
    menuShown: false,
    stage: 'idle',
    topic: null
  });
}

module.exports = { getSession, setSession, resetSession };
