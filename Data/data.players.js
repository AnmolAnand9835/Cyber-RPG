const players = require("./data.player");
module.exports = (message) => {
  const userId = message.author.id;

  if (!players[userId]) {
    players[userId] = {
      credits: 500,
      inventory: [`💻 Old Laptop`, `📡 WiFi Adapter`, `🔋 Battery Pack`],
      xp: 0,
      level: 1,
      lastDaily: null,
      startReward: false,
    };
  }

  player = players[userId];

  console.log(players);
};
