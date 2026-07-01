module.exports = (message) => {
const shopItem = require('../Data/data.shop')
  const { EmbedBuilder } = require("discord.js");

const items = Object.values(shopItem)
  .map((item) => {
    return `${item.emoji}${item.name} - 💰 ${item.price}`;
  })
  .join("\n");

 const inventoryEmbed = new EmbedBuilder()
  .setTitle("🏪 Cyber Shop")
  .setDescription(items);

message.reply({ embeds: [inventoryEmbed] });
}