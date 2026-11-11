const test = require("node:test");
const assert = require("node:assert/strict");
const Player = require("../models/Player");

test("player inventory accepts the documented durability property", async () => {
  const player = new Player({
    userId: "123456789",
    username: "operator",
    avatar: "https://example.test/avatar.png",
    inventory: [
      {
        name: "toolkit",
        emoji: "tool",
        quantity: 1,
        durability: 12,
        durablity: 99,
      },
    ],
  });

  await player.validate();
  assert.equal(player.inventory[0].durability, 12);
  assert.equal(player.inventory[0].get("durablity"), undefined);
});
