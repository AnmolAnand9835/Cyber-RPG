const Player = require("../models/Player");

module.exports = async (message) => {
  let player = await Player.findOne({
    userId: message.author.id,
  });

  if (!player) {
    player = await Player.create({
      userId: message.author.id,
    });
    message.reply(`
    [ welcome to Dyno RPG a game for hacker ]
👤 Operative Created
⭐ Level: 1
📈XP:0
💰 Credits: 500

💻 Starter Gear:
Old Laptop
`);
  } else {
    message.reply(`You'r already start the game`);
  }
};
