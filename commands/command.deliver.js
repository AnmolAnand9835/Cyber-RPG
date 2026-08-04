const Player = require("../models/Player");
const MissionManager = require("../manager/mission.manager");

module.exports = async (message) => {
  let player = await Player.findOne({
    userId: message.author.id,
  });

  const fixedPc = player.inventory.find((inv) => inv.name === "fixed_pc");

  if (!fixedPc) {
    return message.reply("❌ You don't have somthihng to deliver lol");
  }

  fixedPc.quantity--;

  if (fixedPc.quantity <= 0) {
    player.inventory = player.inventory.filter(
      (inv) => inv.name !== "fixed_pc",
    );
  }

  MissionManager.update(player, {
    type: "deliver",
    target: "customer",
  });
  
  await player.save();

  message.reply("✅ you just deliver the laptop");
};
