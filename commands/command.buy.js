const Player = require("../models/Player");
const msg = require("../Data/data.login");
const shop = require("../models/Shop");
const MissionManager = require("../manager/mission.manager");
module.exports = async (message) => {
  let player = await Player.findOne({
    userId: message.author.id,
  });
  if (!player) {
    message.reply(msg);
  } else {
    const args = message.content.split(" ");
    const itemName = args[2].toLowerCase();

    const item = await shop.findOne({
      name: itemName,
    });

    if (!item) {
      return message.reply("❌ Item not found.");
    }

    if (player.credits < item.price) {
      return message.reply(`❌ You need ${item.price} credits.`);
    }

    player.credits -= item.price;

    const isItem = player.inventory.find(
      (id) => id.name.toLowerCase() === itemName,
    );

    if (!isItem) {
      player.inventory.push({
        name: item.name,
        emoji: item.emoji,
        durablity: item.maxDurability,
        quantity: 1,
      });
    } else {
      isItem.quantity++;
    }

    MissionManager.update(player, {
      type: "buy_item",
      item: itemName,
    },message);

    message.reply(
      `✅ Purchased ${item.name}
💰 Remaining Credits: ${player.credits}`,
    );
    await player.save();
  }
};
