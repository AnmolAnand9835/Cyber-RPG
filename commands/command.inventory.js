const Player = require("../models/Player");
const msg = require("../Data/data.login");
const { EmbedBuilder } = require("discord.js");

module.exports = async (message) => {
  let player = await Player.findOne({
    userId: message.author.id,
  });
  if (!player) {
    message.reply(msg);
  } else {
    const Inventory = player.inventory;

    const inventoryEmbed = new EmbedBuilder()
      .setTitle("🎒 Inventory")
      .setDescription(
        Inventory.length
          ? "This is the place where you see what you have."
          : "Your inventory is empty. Use `sudo shop` or `sudo explore` to find items.",
      )
      .setFooter({ text: `Slots: ${Inventory.length}/20` });

    if (Inventory.length) {
      inventoryEmbed.addFields(
        Inventory.map((item) => ({
          name: `${item.emoji} ${item.name}`,
          value: `x${item.quantity}`,
          inline: true,
        })),
      );
    }

    message.reply({ embeds: [inventoryEmbed] });
  }
};
