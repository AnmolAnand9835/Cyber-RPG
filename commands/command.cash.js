const Player = require("../models/Player");
const msg = require("../Data/data.login");
module.exports = async(message) =>{
  let player = await Player.findOne({
    userId: message.author.id,
  });
  if (!player) {
    message.reply(msg);
  }else{
    message.reply(`<@${message.author.id}> you have ${player.credits} credits`)
  }
}