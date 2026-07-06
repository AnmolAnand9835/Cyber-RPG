const Player = require("../models/Player");
const msg = require("../Data/data.login");
const shop = require('../Data/data.shop')
module.exports = async(message) =>{
  let player = await Player.findOne({
    userId: message.author.id,
  });
  if (!player) {
    message.reply(msg);
  }else{
      const args = message.content.split(" ");
  const itemName = args[2].toLowerCase();

  const item = shop.find((element) => element.id === itemName);


  if (!item) {
    return message.reply("❌ Item not found.");
  }

  if (player.credits < item.price) {
    return message.reply(
      `❌ You need ${item.price} credits.`
    );
  }

  player.credits -= item.price;
  player.inventory.push(item.name);
  

  message.reply(
    `✅ Purchased ${item.name}
💰 Remaining Credits: ${player.credits}`
  );
  }
  await player.save();
}
    


