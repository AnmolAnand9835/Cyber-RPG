const shop = require("../data/data.shop");
const players = require("../Data/data.player")
const regester = require('../default meassage/msg.regester')

module.exports = (message) => {
  if(players[message.author.id]){
    const player = players[message.author.id]
  const args = message.content.split(" ");
  const itemName = args[2].toLowerCase();

  const item = shop[itemName];

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
  console.log(player.inventory)
  

  message.reply(
    `✅ Purchased ${item.name}
💰 Remaining Credits: ${player.credits}`
  );
}
else{
  regester(message)
}
};