const Player = require("../models/Player");

module.exports = async (message) => {
  const players = await Player.find()
    .sort({ credits: -1 }) // Highest credits first
    .limit(10);

  if (players.length === 0) {
    return message.reply("📭 No players found.");
  }

const medals = ["🥇", "🥈", "🥉"];

const leaderboard = players
  .map((player, index) => {
    const rank = medals[index] || `#${index + 1}`;

    return `${rank} ${player.username || "Unknown"}
💰 ${player.credits} Credits | ⭐ Level ${player.level}`;
  })
  .join("\n\n");

  message.reply(
    `🏆 **Cyber RPG Leaderboard**\n\n${leaderboard}`
  );
};

