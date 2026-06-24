const leaders = require("../Data/data.leader");

module.exports = (message) => {
  const { EmbedBuilder } = require("discord.js");

  const leaderBoardEmbed = new EmbedBuilder().setTitle("leaderboard");

  const text = leaders
    .map(
      (item) =>
        `The ${item.position} is ${item.name} credits: ${item.credits} level: ${item.level}`,
    )
    .join("\n");

  leaderBoardEmbed.setDescription(text);

  message.reply({ embeds: [leaderBoardEmbed] });
};
