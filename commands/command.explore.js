module.exports = async (message) => {
  const Player = require("../models/Player");
  const msg = require("../Data/data.login");
  const {
    common,
    uncommon,
    rare,
    epic,
    legendary,
  } = require("../Data/data.outcome");
  const MissionManager = require("../manager/mission.manager");
  const { addExperience } = require("../manager/progression.manager");

  let player = await Player.findOne({
    userId: message.author.id,
  });

  if (!player) {
    return message.reply(msg);
  }

  const exploreLogic = async (pool) => {
    const outcomes = pool;
    const randomNumber = Math.floor(Math.random() * outcomes.length);

    const event = outcomes[randomNumber];
    let money = event.credits;
    let xp = event.xp;
    let item = event.item;

    if (item) {
      await MissionManager.update(player, {
        type: "explore",
        target: item.name.toLowerCase(),
      }, message);

      const isItem = player.inventory.find(
        (inventoryItem) => inventoryItem.name.toLowerCase() === item.name.toLowerCase(),
      );

      if (!isItem) {
        player.inventory.push({
          name: item.name,
          emoji: item.emoji,
          durability: null,
          quantity: 1,
        });
      } else {
        isItem.quantity++;
      }
    }

    const hasWifi = player.inventory.some(
      (inventoryItem) => inventoryItem.name.toLowerCase() === "wifi",
    );

    if (hasWifi) {
      if (money > 0) {
        money *= 2;
        xp *= 2;
      }
    }

    player.credits += money;
    player.lastExplore = new Date();
    const levels = addExperience(player, xp);
    await player.save();
    for (const level of levels) {
      await message.channel.send(
        `🎉 ${message.author} reached Level ${level}!`,
      );
    }

    message.reply(
      `${event.message}
💰 Credits: ${money >= 0 ? "+" : ""}${money}
⭐ XP: +${xp}`,
    );
  };

  const hasLaptop = player.inventory.some(
    (item) => item.name.toLowerCase() === "laptop",
  );

  let cooldown;

  if (!hasLaptop) {
    cooldown = 5 * 1000;
  } else {
    cooldown = 3 * 1000;
  }
  const now = Date.now();
  if (player.lastExplore && now - player.lastExplore.getTime() < cooldown) {
    return message.reply("⏳ Wait before exploring again!");
  }

  player = await Player.findOneAndUpdate(
    {
      _id: player._id,
      $or: [
        { lastExplore: null },
        { lastExplore: { $lte: new Date(now - cooldown) } },
      ],
    },
    { $set: { lastExplore: new Date(now) } },
    { new: true },
  );

  if (!player) {
    return message.reply("⏳ Wait before exploring again!");
  }

  if (!hasLaptop) {
    return exploreLogic(common);
  }

  const roll = Math.floor(Math.random() * 1000) + 1;
  let pool;

  if (roll <= 700) {
    pool = common;
  } else if (roll <= 900) {
    pool = uncommon;
  } else if (roll <= 980) {
    pool = rare;
  } else if (roll <= 998) {
    pool = epic;
  } else {
    pool = legendary;
  }

  return exploreLogic(pool);
};
