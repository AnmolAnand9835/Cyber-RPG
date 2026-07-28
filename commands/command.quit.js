const Player = require("../models/Player");

module.exports = async(message) => {
      let player = await Player.findOne({
        userId: message.author.id,
      });

      await Player.deleteOne({
        _id: player._id,
      });

          message.reply(`👤 ${message.author.displayName} you have quit the game`);
    await player.save();
}