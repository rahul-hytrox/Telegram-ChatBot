// src/index.js
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const log = require('./logger');
const { registerCommands } = require('./handlers/commands');
const { registerMessageHandler } = require('./handlers/messages');

// Guard: uncaught errors (for logging during dev)
process.on('uncaughtException', (e) => log.error('uncaughtException:', e));
process.on('unhandledRejection', (e) => log.error('unhandledRejection:', e));

// Start bot in POLLING mode for local development on Windows
const bot = new TelegramBot(config.botToken, {
  polling: config.polling
});

log.info('🤖 Bot started in POLLING mode (local dev).');

// Register handlers
registerCommands(bot);
registerMessageHandler(bot);

// Graceful exit (Ctrl+C)
function shutdown() {
  log.info('🛑 Shutting down...');
  // node-telegram-bot-api stops polling automatically on process exit
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
