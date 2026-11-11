const test = require("node:test");
const assert = require("node:assert/strict");
const { addExperience, xpForLevel } = require("../manager/progression.manager");

test("experience carries over and updates the next level threshold", () => {
  const player = { xp: 90, level: 1, xpNeeded: 100 };

  const levels = addExperience(player, 30);

  assert.deepEqual(levels, [2]);
  assert.equal(player.xp, 20);
  assert.equal(player.level, 2);
  assert.equal(player.xpNeeded, 200);
});

test("large awards can cross multiple progressively larger thresholds", () => {
  const player = { xp: 0, level: 1, xpNeeded: 100 };

  const levels = addExperience(player, 350);

  assert.deepEqual(levels, [2, 3]);
  assert.equal(player.xp, 50);
  assert.equal(player.level, 3);
  assert.equal(player.xpNeeded, 300);
  assert.equal(xpForLevel(4), 400);
});

test("invalid experience amounts are rejected", () => {
  const player = { xp: 10, level: 1, xpNeeded: 100 };

  assert.throws(() => addExperience(player, -1), TypeError);
  assert.throws(() => addExperience(player, Number.NaN), TypeError);
  assert.equal(player.xp, 10);
});
