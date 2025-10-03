// src/config.js
require('dotenv').config();

const config = {
  botToken: process.env.BOT_TOKEN,
  // tweak dev settings here:
  polling: {
    interval: 800,           // ms between long polls
    params: { timeout: 10 }, // Telegram long-poll timeout
    autoStart: true
  }
};

if (!config.botToken) {
  console.error('❌ BOT_TOKEN missing in .env');
  process.exit(1);
}

module.exports = config;
