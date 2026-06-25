const Player = require("../models/Player");
const msg = require("../Data/data.login");

module.exports = async (message) => {
  let player = await Player.findOne({
    userId: message.author.id,
  });
  if (!player) {
    message.reply(msg);
  } else {
    const { EmbedBuilder } = require("discord.js");
    const credits = player.credits.toString();
    const XP = player.xp.toString();
    const inventory = player.inventory;

    const profileEmbed = new EmbedBuilder()
      .setTitle(`👤 ${message.author.displayName} Profile`)
      .addFields(
        { name: "⭐ Level", value: player.level.toString(), inline: true },
        { name: "💰 Credits", value: credits, inline: true },
        { name: "📈 XP", value: XP, inline: true },
        {
          name: "🎒 Inventory",
          value: inventory.length.toString(),
          inline: true,
        },
      );

    message.reply({ embeds: [profileEmbed] });
  }
};
