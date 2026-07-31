module.exports = async (message) => {
  const shopItem = require("../models/Shop");
  const { EmbedBuilder } = require("discord.js");

  const shopData = await shopItem.find();

  const inventoryEmbed = new EmbedBuilder().setTitle("🏪 Cyber Shop").addFields(
    Object.values(shopData).map((item) => ({
      name: `${item.emoji} ${item.name}`,
      value: `${item.description}\n💰 Price: ${item.price}`,
      inline: true,
    })),
  );

  message.reply({ embeds: [inventoryEmbed] });
};
