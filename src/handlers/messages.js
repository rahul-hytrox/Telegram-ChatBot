// src/handlers/messages.js
const log = require('../logger');
const { sanitizeInput } = require('../utils/sanitize');
const { allowMessage } = require('../utils/rateLimit');
const { MENU, mainMenu, backMenu } = require('../ui/menus');
const { getSession, setSession, resetSession } = require('../state/session');

function registerMessageHandler(bot) {
  bot.on('message', async (msg) => {
    try {
      log.info(`Incoming: chatId=${msg.chat.id}, text=${msg.text}`);
      const chatId = msg.chat.id;
      const raw = msg.text || '';
      if (typeof raw === 'string' && raw.startsWith('/')) return; // skip commands
      if (!allowMessage(chatId, 500)) return;

      const session = getSession(chatId);
      const text = sanitizeInput(raw);

      // Case 1: First free text after /start → assist prompt
      if (session.messageCount === 0) {
        setSession(chatId, { messageCount: 1 });
        return bot.sendMessage(chatId, `How can I assist you today?`);
      }

      // Case 2: Second free text → show menu
      if (session.messageCount === 1 && !session.menuShown) {
        setSession(chatId, { messageCount: 2, menuShown: true });
        return bot.sendMessage(chatId, `Please choose an option below:`, mainMenu());
      }

      // Case 3: Handle menu selections
      if (text === MENU.PROJECT_INQUIRY) {
        setSession(chatId, { stage: 'topic', topic: 'project' });
        return bot.sendMessage(chatId, `Great — please share details of your project.`, backMenu());
      }
      if (text === MENU.BUG_ISSUE) {
        setSession(chatId, { stage: 'topic', topic: 'bug' });
        return bot.sendMessage(chatId, `Please describe the issue you’re facing.`, backMenu());
      }
      if (text === MENU.SERVICE_INQUIRY) {
        setSession(chatId, { stage: 'topic', topic: 'service' });
        return bot.sendMessage(chatId, `Which of our services are you interested in?`, backMenu());
      }
      if (text === MENU.OTHER_OR_CONTACT) {
        setSession(chatId, { stage: 'topic', topic: 'contact' });
        return bot.sendMessage(chatId, `Please share your preferred contact method.`, backMenu());
      }
      if (text === MENU.BACK) {
        resetSession(chatId);
        setSession(chatId, { welcomed: true, messageCount: 1 }); // don’t repeat welcome, go back to assist
        return bot.sendMessage(chatId, `How can I help you further?`, mainMenu());
      }

      // Case 4: Follow-up under topic
      if (session.stage === 'topic' && session.topic) {
        log.info(`Topic [${session.topic}] from ${chatId}: ${text}`);
        return bot.sendMessage(
          chatId,
          `Thanks for the details. Our team will review and follow up.\n\nYou can send more info, or tap “${MENU.BACK}”.`,
          backMenu()
        );
      }

      // Fallback: polite prompt
      return bot.sendMessage(chatId, `How can I help you further?`, mainMenu());

    } catch (e) {
      log.error('message handler error:', e);
      try {
        await bot.sendMessage(msg.chat.id, '⚠️ Something went wrong. Please try again.');
      } catch (_) {}
    }
  });
}

module.exports = { registerMessageHandler };
