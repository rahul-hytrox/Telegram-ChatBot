// src/handlers/commands.js
const { sanitizeInput } = require('../utils/sanitize');
const { resetSession, setSession } = require('../state/session');

function registerCommands(bot) {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const name = sanitizeInput(msg.from?.first_name || 'there');

    // reset everything
    resetSession(chatId);
    setSession(chatId, { welcomed: true, messageCount: 0 });

    // simple hi welcome only
    bot.sendMessage(chatId, `Hi ${name}, welcome to our service.`);
  });
}

module.exports = { registerCommands };
