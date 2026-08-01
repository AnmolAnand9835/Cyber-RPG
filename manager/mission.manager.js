const missions = require("../Data/data.mission");

const MissionManager = {
  async update(player, event) {
    // 1. Find the active mission
    const activeMission = player.currentMission;

    if(!event){
      return;
    }

    if (!activeMission.id) {
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

    // 5. If progress is enough, move to the next objective

    if (player.currentMission.progress >= objective.amount) {
      player.currentMission.currentObjective++;

      player.currentMission.progress = 0;
    }

    if (player.currentMission.currentObjective >= mission.objectives.length) {
      await this.complete(player, mission);
    }
    await player.save();
  },

  async complete(player, mission) {
    // give rewards
    player.currentMission.id = null;
    player.credits += mission.rewards.credits;
    player.xp += mission.rewards.xp;
    if (mission.rewards.item) {
      player.inventory.push(...mission.rewards.item);
    }

    player.currentMission.progress = 0;
    player.currentMission.currentObjective = 0;

    if (!player.completedMissions.includes(mission.id)) {
      player.completedMissions.push(mission.id);
    }
  },
};

module.exports = MissionManager;
