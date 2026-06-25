module.exports = (message) => {
  const { EmbedBuilder } = require("discord.js");
  const players = require("../Data/data.player");
  const regester = require('../default meassage/msg.regester')

  if(players[message.author.id]){

  const Inventory = players[message.author.id].inventory

  

  const inventoryEmbed = new EmbedBuilder()
    .setTitle("🎒 Inventory")
    .setDescription("This is the place where you see what you have.")
    .addFields(
    Inventory.map((item) => ({
      name: item,
      value: "Owned",
      inline: true,
    }))
    )
    .setFooter({ text: `Slots: ${Inventory.length}/20` });

  message.reply({ embeds: [inventoryEmbed] });
  }
  else{
    regester(message)
  }

};
