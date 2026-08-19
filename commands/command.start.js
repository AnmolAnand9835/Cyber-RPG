const Player = require("../models/Player");

module.exports = async (message) => {
  let player = await Player.findOne({
    userId: message.author.id,
  });

  if (!player) {
    player = await Player.create({
      userId: message.author.id,
      username: message.author.username,
      avatar: message.author.displayAvatarURL({
        extension: "png",
        size: 512,
      }),
    });
    message.reply(`
    [ welcome to Cyber RPG ]
👤 Operative Created
⭐ Level: 1
📈XP:0
💰 Credits: 500

[if you want to get know all the command just type (sudo help)]
`);
  } else {
    message.reply(`You'r already start the game lol`);
  }
};
