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

  let player = await Player.findOne({
    userId: message.author.id,
  });

  const exploreLogic = async (pool) => {
    const outcomes = pool;
    const randomNumber = Math.floor(Math.random() * outcomes.length);

    const event = outcomes[randomNumber];
    let money = event.credits;
    let xp = event.xp;
    let item = event.item;

    if (item) {
      if (item) {
        MissionManager.update(player,{
          type:"explore",
          target: item.name
        });
      }

    const isItem = player.inventory.find(
      (id) => id.name.toLowerCase() === item.name,
    );

    if (!isItem) {
      player.inventory.push({
        name: item.name,
        emoji: item.emoji,
        durablity: null,
        quantity: 1,
      });
    } else {
      isItem.quantity++;
    }
    }

    const hasWifi = player.inventory.some((item) => item.id === "wifi");

    if (hasWifi) {
      if (money > 0) {
        money *= 2;
        xp *= 2;
      }
    }

    player.credits += money;
    player.xp += xp;
    player.lastExplore = new Date();

    while (player.xp >= player.level * 100) {
      player.xpNeeded = player.level * 100;
      player.xp -= player.xpNeeded;
      player.level++;

      message.channel.send(
        `🎉 ${message.author} reached Level ${player.level}!`,
      );
    }

    await player.save();

    message.reply(
      `${event.message}
💰 Credits: ${money >= 0 ? "+" : ""}${money}
⭐ XP: +${xp}`,
    );
  };

  const hasLaptop = player.inventory.some(
    (item) => item.name.toLowerCase() === "laptop" ,
  );

  let cooldown;

  if (!hasLaptop) {
    cooldown = 5 * 1000; // 30 seconds
  } else {
    cooldown = 3 * 1000;
  }
  if (!player) {
    message.reply(msg);
  } else {
    if (player.lastExplore && Date.now() - player.lastExplore < cooldown) {
      return message.reply("⏳ Wait before exploring again!");
    } else {
      console.log(hasLaptop)
      if (!hasLaptop) {
        exploreLogic(common);
      } else {
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

        exploreLogic(pool);
      }
    }
  }
};
