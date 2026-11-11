const missions = require("../Data/data.mission");
const { addExperience } = require("./progression.manager");

const MissionManager = {
  async update(player, event, msg) {
    // 1. Find the active mission
    const activeMission = player.currentMission;

    if (!event) {
      return;
    }

    if (!activeMission?.id) {
      return;
    }
    // 2. Find the current objective
    const mission = missions.find((m) => m.id === activeMission.id);

    if (!mission) {
      return;
    }

    const objective = mission.objectives[activeMission.currentObjective];

    if (!objective) {
      return;
    }

    // 3. Check if the event matches the objective
    if (objective.type !== event.type) {
      return;
    }

    if (objective.item && objective.item !== event.item) {
      return;
    }

    if (objective.target && objective.target !== event.target) {
      return;
    }

    // 4. Increase progress

    player.currentMission.progress++;
    msg.reply(
      `😀 ${objective.description} completed ${player.currentMission.currentObjective + 1}/${mission.objectives.length}`,
    );

    // 5. If progress is enough, move to the next objective

    if (player.currentMission.progress >= objective.amount) {
      player.currentMission.currentObjective++;

      player.currentMission.progress = 0;
    }

    if (player.currentMission.currentObjective >= mission.objectives.length) {
      await this.complete(player, mission, msg);
    }
  },

  async complete(player, mission, msg) {
    // give rewards
    player.currentMission.id = null;
    player.credits += mission.rewards.credits;
    const levels = addExperience(player, mission.rewards.xp);
    for (const reward of mission.rewards.items || []) {
      const item =
        typeof reward === "string"
          ? { name: reward, quantity: 1 }
          : { ...reward, quantity: reward.quantity || 1 };
      const existing = player.inventory.find(
        (inventoryItem) =>
          inventoryItem.name.toLowerCase() === item.name.toLowerCase(),
      );

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        player.inventory.push(item);
      }
    }

    player.currentMission.progress = 0;
    player.currentMission.currentObjective = 0;

    msg.reply(`🎊 You have completed the mission
🎁reward:
💰 Credits:${mission.rewards.credits}
⭐ XP: +${mission.rewards.xp}
      `);

    for (const level of levels) {
      await msg.channel.send(`🎉 ${msg.author} reached Level ${level}!`);
    }

    if (!player.completedMissions.includes(mission.id)) {
      player.completedMissions.push(mission.id);
    }
  },
};

module.exports = MissionManager;
