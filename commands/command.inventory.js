module.exports = (message) => {
  const { EmbedBuilder } = require("discord.js");
  const player = require("../Data/data.player");

  const Inventory = player.inventory

  

  const inventoryEmbed = new EmbedBuilder()
    .setTitle("🎒 Inventory")
    .setDescription("This is the place where you see what you have.")
    .addFields(
    Inventory.map((item) => ({
      name: item,
      value: "Owned",
      inline: true,
    }))
    )
    .setFooter({ text: `Slots: ${Inventory.length}/20` });

  message.reply({ embeds: [inventoryEmbed] });
};
