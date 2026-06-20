const shop = require("../data/data.shop");
const player = require("../data/data.player");

module.exports = (message) => {
  const args = message.content.split(" ");
  const itemName = args[2].toLowerCase();

  const item = shop[itemName];
  console.log(message.content)
  console.log(itemName)


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
  console.log(itemName)

  message.reply(
    `✅ Purchased ${item.name}
💰 Remaining Credits: ${player.credits}`
  );
};