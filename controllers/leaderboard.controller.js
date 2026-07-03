const Player = require("../models/Player");

module.exports = async (req, res) => {
  const players = await Player.find()
    .sort({ credits: -1 }) // Highest credits first
    .limit(10);

  if (players.length === 0) {
    return res.status(404).json({
      message: "Player not found",
    });
  }

const leaderboard = players.map((player, index) => ({
    rank: index + 1,
    username: player.username || "Unknown",
    credits: player.credits,
    level: player.level,
}));

return res.json(leaderboard)
};
