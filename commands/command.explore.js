module.exports = (message) => {
  const randomNumber = Math.floor(Math.random() * 3);

  if (randomNumber === 0) {
    message.reply(`
    🌐 Exploring...

    📦 Found a Loot Crate! 
    💰 +100 Credits
    `);
  }

  if (randomNumber === 1) {
    message.reply(`
    🌐 Exploring...

    🤖 Rogue Bot Encountered!

    💰 +150 Credits
    📈 +25 XP
    `);
  }

  if (randomNumber === 2) {
    message.reply(`
    🌐 Exploring...

    ❌ Nothing found.
    `);
  }
};
