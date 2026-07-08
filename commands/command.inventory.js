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
      .setDescription("This is the place where you see what you have.")
      .addFields(
        Inventory.map((item) => ({
          name: `${item.emoji} ${item.name}`,
          value: "Owned",
          inline: true,
        })),
      )
      .setFooter({ text: `Slots: ${Inventory.length}/20` });

    message.reply({ embeds: [inventoryEmbed] });
  }
};
