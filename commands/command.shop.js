module.exports = async(message) => {
const shopItem = require('../models/Shop')
  const { EmbedBuilder } = require("discord.js");
  
  const shopData = await shopItem.find()

const items = Object.values(shopData)
  .map((item) => {
    return `${item.emoji} ${item.name} - 💰 ${item.price}`;
  })
  .join("\n");

 const inventoryEmbed = new EmbedBuilder()
  .setTitle("🏪 Cyber Shop")
  .setDescription(items);

message.reply({ embeds: [inventoryEmbed] });
}