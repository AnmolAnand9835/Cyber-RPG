const Player = require("../models/Player");
const msg = require("../Data/data.login");
const { addExperience } = require("../manager/progression.manager");

module.exports = async (message) => {
  const player = await Player.findOne({
    userId: message.author.id,
  });
  if (!player) return message.reply(msg);

  const cooldown = 24 * 60 * 60 * 1000;
  const now = new Date();
  const remaining = player.lastDaily
    ? cooldown - (now.getTime() - player.lastDaily.getTime())
    : 0;

  if (remaining > 0) {
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return message.reply(
      `❌ You already claimed your daily reward.\nCome back in ${hours}h ${minutes}m ${seconds}s.`,
    );
  }

  const hasWifi = player.inventory.some(
    (item) => item.name.toLowerCase() === "wifi",
  );
  const money = hasWifi ? 400 : 200;
  const xp = hasWifi ? 100 : 50;
  const claimed = await Player.findOneAndUpdate(
    {
      userId: message.author.id,
      $or: [{ lastDaily: null }, { lastDaily: { $lte: new Date(now - cooldown) } }],
    },
    {
      $set: { lastDaily: now },
      $inc: { credits: money },
    },
    { new: true },
  );

  if (!claimed) {
    return message.reply("❌ You already claimed your daily reward.");
  }

  const levels = addExperience(claimed, xp);
  await Player.updateOne(
    { _id: claimed._id },
    { $set: { xp: claimed.xp, xpNeeded: claimed.xpNeeded, level: claimed.level } },
  );

  for (const level of levels) {
    await message.channel.send(
      `🎉 ${message.author} reached Level ${level}!`,
    );
  }

  return message.reply(`
🎁 Daily Reward

💰 +${money} Credits
📈 +${xp} XP
`);
};
