module.exports = async (message) => {
  const Player = require("../models/Player");
  const msg = require("../Data/data.login");

  let player = await Player.findOne({
    userId: message.author.id,
  });
  const cooldown = 30 * 1000; // 30 seconds

  if (!player) {
    message.reply(msg);
  } else {
    if (player.lastExplore && Date.now() - player.lastExplore < cooldown) {
      return message.reply("⏳ Wait before exploring again!");
    } else {
      const outcomes = [
        {
          message: "📦 Found a Supply Crate!",
          credits: 200,
          xp: 20,
        },
        {
          message: "🤖 Defeated a Rogue Bot!",
          credits: 350,
          xp: 40,
        },
        {
          message: "💎 Found a Data Shard!",
          credits: 500,
          xp: 60,
        },
        {
          message: "🗺️ Discovered an Abandoned Server!",
          credits: 700,
          xp: 80,
        },
        {
          message: "🔋 Found a Battery Pack!",
          credits: 150,
          xp: 15,
        },
        {
          message: "💰 Found Credits on the Ground!",
          credits: 100,
          xp: 5,
        },
        {
          message: "⚠️ Ambushed by Scavengers!",
          credits: -100,
          xp: 25,
        },
        {
          message: "🛰️ Discovered a Satellite Station!",
          credits: 1000,
          xp: 120,
        },
        {
          message: "📡 Repaired an Old Antenna!",
          credits: 300,
          xp: 30,
        },
        {
          message: "🦹 A thief stole your credits!",
          credits: -200,
          xp: 15,
        },
        {
          message: "💻 Your laptop crashed and repairs were expensive!",
          credits: -300,
          xp: 20,
        },
        {
          message: "⚡ A power surge fried your equipment!",
          credits: -400,
          xp: 25,
        },
        {
          message: "🌐 You got scammed by a fake marketplace!",
          credits: -500,
          xp: 30,
        },
        {
          message: "🛠️ Your Mini Bot broke down and needed repairs!",
          credits: -250,
          xp: 20,
        },
        {
          message: "📡 You paid for premium internet but it was a scam!",
          credits: -350,
          xp: 20,
        },
        {
          message: "🚨 Authorities fined you for unauthorized hacking!",
          credits: -600,
          xp: 40,
        },
        {
          message: "🦠 Malware infected your systems and cleanup cost money!",
          credits: -450,
          xp: 30,
        },
        {
          message: "🧾 You forgot to pay your server bills!",
          credits: -150,
          xp: 10,
        },
        {
          message: "🕳️ You fell into a trap while exploring the darknet!",
          credits: -800,
          xp: 50,
        },
        {
          message: "❌ Nothing Found.",
          credits: 0,
          xp: 0,
        },
        {
          message: "💎 You found a hidden crypto wallet!",
          credits: 2500,
          xp: 200,
        },
        {
          message: "🚀 You sold an old AI project to a collector!",
          credits: 5000,
          xp: 300,
        },
        {
          message:
            "☕ You spent time drinking coffee and planning your next project.",
          credits: 0,
          xp: 10,
        },
        {
          message: "🌧️ Bad weather forced you to return home early.",
          credits: 0,
          xp: 5,
        },
      ];
      const randomNumber = Math.floor(Math.random() * outcomes.length);

      const event = outcomes[randomNumber];

      player.credits += event.credits;
      player.xp += event.xp;
      player.lastExplore = new Date();

      player.xp += event.xp;

      player.xp += event.xp;

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
💰 Credits: ${event.credits >= 0 ? "+" : ""}${event.credits}
⭐ XP: +${event.xp}`,
      );
    }
  }
};
