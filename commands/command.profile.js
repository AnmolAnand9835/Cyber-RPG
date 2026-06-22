const player = require('../Data/data.player')

module.exports = (message) => {
  const { EmbedBuilder } = require("discord.js");
  const credits = player.credits.toString()
  const XP = player.xp.toString()
  const inventory = player.inventory

  const profileEmbed = new EmbedBuilder()
    .setTitle("👤 Player Profile")
    .setDescription("Welcome to Cyber RPG!")
    .addFields(
      { name: "⭐ Level", value: "1", inline: true },
      { name: "💰 Credits", value: credits, inline: true },
      { name: "📈 XP", value: XP, inline: true },
      { name: "🎒 Inventory", value: inventory.length.toString(), inline:true}
    );

  message.reply({ embeds: [profileEmbed]});
};