module.exports = (message) => {
  const { EmbedBuilder } = require("discord.js");

  const profileEmbed = new EmbedBuilder()
    .setTitle("👤 Player Profile")
    .setDescription("Welcome to Cyber RPG!")
    .addFields(
      { name: "⭐ Level", value: "1", inline: true },
      { name: "💰 Credits", value: "500", inline: true },
      { name: "📈 XP", value: "0/100", inline: true },
    );

  message.reply({ embeds: [profileEmbed]});
};