const Player = require("../models/Player");
const msg = require("../Data/data.login");
const missions = require("../Data/data.mission");
const { EmbedBuilder } = require("discord.js");
module.exports = async (message) => {
  let player = await Player.findOne({
    userId: message.author.id,
  });
  if (!player) {
    message.reply(msg);
  } else {
    const args = message.content.split(" ");

    if (!args[3]) {
      return message.reply(`Usage: sudo mission start <mission_id>`);
    }

    const missionName = args[3].toLowerCase();

    const mission = missions.find((item) => item.id === missionName);
    const isCompleate = player.completedMissions.find((item) => item === missionName)

    if(isCompleate){
      return message.reply("❌ you have already done this mission")
    }

    if (player.currentMission.id) {
      return message.reply("❌ You already have an active mission.");
    }

    if (!mission) {
      return message.reply("❌ Mission not found.");
    }
    
    if (player.level < mission.requirements.level) {
      return message.reply(`❌ You need ${mission.requirements.level} level.`);
    }

    if (
      mission.requirements.previousMission &&
      !mission.requirements.previousMission.every((id) =>
        player.completedMissions.includes(id),
      )
    ) {
      return message.reply("❌ You haven't unlocked this mission yet.");
    }

    player.currentMission.id = mission.id;
    player.currentMission.currentObjective = 0;
    player.currentMission.progress = 0;

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("📜 Mission Started")
      .setDescription(mission.description)
      .addFields(
        {
          name: "Mission",
          value: `${mission.emoji} ${mission.name}`,
          inline: false,
        },
        {
          name: "Level Required",
          value: `${mission.requirements.level}`,
          inline: true,
        },
        {
          name: "Objectives",
          value: mission.objectives
            .map((obj, index) => `${index + 1}. ${obj.description}`)
            .join("\n"),
          inline: false,
        },
        {
          name: "Rewards",
          value:
            `💰 ${mission.rewards.credits} Credits\n` +
            `⭐ ${mission.rewards.xp} XP`,
          inline: true,
        },
      )
      .setFooter({
        text: "Good luck, Operator.",
      });

    await message.reply({
      embeds: [embed],
    });
    await player.save();
  }
};
