// src/ui/menus.js

const MENU = {
  PROJECT_INQUIRY: '🧩 Website / App Project Inquiry',
  BUG_ISSUE: '🐞 Bug or Issue Inquiry',
  SERVICE_INQUIRY: '🛠️ Our Service Inquiry',
  OTHER_OR_CONTACT: '📞 Other Queries / Contact Direct',
  BACK: '⬅️ Back to Main Menu'
};

function mainMenu() {
  return {
    reply_markup: {
      keyboard: [
        [MENU.PROJECT_INQUIRY],
        [MENU.BUG_ISSUE, MENU.SERVICE_INQUIRY],
        [MENU.OTHER_OR_CONTACT]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };
}

function backMenu() {
  return {
    reply_markup: {
      keyboard: [
        [MENU.BACK]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };
}

module.exports = { MENU, mainMenu, backMenu };
