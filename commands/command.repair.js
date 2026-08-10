const Player = require("../models/Player");
const MissionManager = require("../manager/mission.manager");

// TODO:
// Replace this inventory logic with InventoryManager
// after the repair system is complete.

module.exports = async (message) => {
  let player = await Player.findOne({
    userId: message.author.id,
  });

  const toolkit = player.inventory.find((inv) => inv.name === "toolkit");

  if (!toolkit) {
    return message.reply("❌ You need a Toolkit.");
  }

  const brokenPc = player.inventory.find((inv) => inv.name === "broken_pc");

  if (!brokenPc) {
    return message.reply("❌ You don't have a Broken PC.");
  }

  toolkit.quantity--;

  if (toolkit.quantity <= 0) {
    player.inventory = player.inventory.filter((inv) => inv.name !== "toolkit");
  }

  brokenPc.quantity--;

  if (brokenPc.quantity <= 0) {
    player.inventory = player.inventory.filter(
      (inv) => inv.name !== "broken_pc",
    );
  }

  const fixedPc = player.inventory.find((inv) => inv.name === "fixed_pc");

  if (!fixedPc) {
    player.inventory.push({
      name: "fixed_pc",
      emoji: "🖥️",
      durablity: null,
      quantity: 1,
    });
  }else{
  fixedPc.quantity++;
  }

  MissionManager.update(player, {
    type: "repair",
    target: "broken_pc",
  },message);

  await player.save();

  message.reply("✅ You repaired the Broken PC!");
};
