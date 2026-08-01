const missions = require("../Data/data.mission");
const Player = require("../models/Player");
const msg = require("../Data/data.login");
const { EmbedBuilder } = require("discord.js");

module.exports = async (message) => {
  const player = await Player.findOne({
    userId: message.author.id,
  });
  if (!player) {
    message.reply(msg);
  } else {
    const missionArr = missions.filter(
      (item) => item.requirements.level <= player.level,
    );

    const mission = missionArr[0]

const embed = new EmbedBuilder()
  .setColor("#5865F2")
  .setTitle(`📜 Available Mission\n **Id** ${mission.id}`)
  .setDescription("Complete missions to earn Credits, XP, and unlock new technology.")
  .addFields(
    {
      name: "🎯 Mission",
      value: `${mission.emoji} **${mission.name}**`,
    },
    {
      name: "📝 Description",
      value: mission.description,
    },
    {
      name: "📋 Requirements",
      value:
        `⭐ Level: ${mission.requirements.level}\n` +
        `🔎 PreviousMission: ${mission.requirements.previousMission ?? "None"}`,
      inline: true,
    },
    {
      name: "🎁 Rewards",
      value:
        `💰 ${mission.rewards.credits} Credits\n` +
        `✨ ${mission.rewards.xp} XP`,
      inline: true,
    },
    {
      name: "📌 Status",
      value: "🟢 Available",
      inline: true,
    }
  )
  .setFooter({
    text: `Use sudo start mission ${mission.id} to begin this mission.`
  });
  message.reply({ embeds: [embed] });
  }
};
