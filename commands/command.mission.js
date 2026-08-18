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


    const embeds = [];

    for (const mission of missionArr) {
      const embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle(`📜 ${mission.name}`)
        .setDescription(mission.description)
        .addFields(
          {
            name: "🎯 Mission",
            value: `${mission.emoji} ${mission.name}`,
          },
          {
            name: "🎁 Rewards",
            value:
              `💰 ${mission.rewards.credits} Credits\n` +
              `✨ ${mission.rewards.xp} XP`,
          },
        )
        .setFooter({
          text: `sudo start mision ${mission.id}`,
        });

      embeds.push(embed);
    }

    await message.reply({
      embeds,
    });
  }
};
