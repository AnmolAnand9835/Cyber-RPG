const xpForLevel = (level) => level * 100;

const addExperience = (player, amount) => {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new TypeError("Experience must be a non-negative number.");
  }

  player.xp += amount;
  const levels = [];

  while (player.xp >= xpForLevel(player.level)) {
    player.xp -= xpForLevel(player.level);
    player.level++;
    levels.push(player.level);
  }

  player.xpNeeded = xpForLevel(player.level);
  return levels;
};

module.exports = { addExperience, xpForLevel };
