const players = require('../Data/data.player')
const regester = require('../default meassage/msg.regester')

module.exports = (message) => {
  if(players[message.author.id]){
  const player = players[message.author.id]
  const { EmbedBuilder } = require("discord.js");
  const credits = player.credits.toString()
  const XP = player.xp.toString()
  const inventory = player.inventory

  const profileEmbed = new EmbedBuilder()
    .setTitle("👤 Player Profile")
    .setDescription("Welcome to Cyber RPG!")
    .addFields(
      { name: "⭐ Level", value: player.level.toString(), inline: true },
      { name: "💰 Credits", value: credits, inline: true },
      { name: "📈 XP", value: XP, inline: true },
      { name: "🎒 Inventory", value: inventory.length.toString(), inline:true}
    );

  message.reply({ embeds: [profileEmbed]});
  }
  else{
    regester(message)
  }
};