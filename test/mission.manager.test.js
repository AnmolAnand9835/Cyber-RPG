const test = require("node:test");
const assert = require("node:assert/strict");
const MissionManager = require("../manager/mission.manager");

const createMessage = () => ({
  author: "operator",
  replies: [],
  levelMessages: [],
  reply(message) {
    this.replies.push(message);
  },
  channel: {
    send(message) {
      this.messages.push(message);
    },
    messages: [],
  },
});

test("mission objectives advance only in order and completion grants configured rewards", async () => {
  const player = {
    credits: 500,
    xp: 90,
    xpNeeded: 100,
    level: 1,
    inventory: [],
    completedMissions: [],
    currentMission: {
      id: "repair_pc",
      currentObjective: 0,
      progress: 0,
    },
  };
  const message = createMessage();

  await MissionManager.update(
    player,
    { type: "explore", target: "broken_pc" },
    message,
  );
  assert.equal(player.currentMission.currentObjective, 0);

  await MissionManager.update(
    player,
    { type: "buy_item", item: "toolkit" },
    message,
  );
  assert.equal(player.currentMission.currentObjective, 1);
  assert.equal(player.currentMission.progress, 0);

  await MissionManager.update(
    player,
    { type: "explore", target: "broken_pc" },
    message,
  );
  await MissionManager.update(
    player,
    { type: "repair", target: "broken_pc" },
    message,
  );
  await MissionManager.update(
    player,
    { type: "deliver", target: "customer" },
    message,
  );

  assert.equal(player.credits, 600);
  assert.equal(player.xp, 20);
  assert.equal(player.level, 2);
  assert.equal(player.xpNeeded, 200);
  assert.equal(player.currentMission.id, null);
  assert.deepEqual(player.completedMissions, ["repair_pc"]);
  assert.ok(message.replies.some((reply) => reply.includes("completed the mission")));
  assert.ok(message.channel.messages.some((text) => text.includes("Level 2")));
});

test("an objective amount requires that many matching events", async () => {
  const player = {
    credits: 0,
    xp: 0,
    xpNeeded: 300,
    level: 3,
    inventory: [],
    completedMissions: [],
    currentMission: {
      id: "build_website",
      currentObjective: 1,
      progress: 0,
    },
  };
  const message = createMessage();
  const event = { type: "code", target: "website" };

  await MissionManager.update(player, event, message);
  await MissionManager.update(player, event, message);
  assert.equal(player.currentMission.currentObjective, 1);
  assert.equal(player.currentMission.progress, 2);

  await MissionManager.update(player, event, message);
  assert.equal(player.currentMission.currentObjective, 2);
  assert.equal(player.currentMission.progress, 0);
});
