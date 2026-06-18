module.exports = (message) => {
  const { EmbedBuilder } = require("discord.js");

  const inventoryEmbed = new EmbedBuilder()
    .setTitle("🎒 Inventory")
    .setDescription("This is the place where you see what you have.")
    .addFields(
      { name: "💻 Old Laptop", value: "Owned", inline: true },
      { name: "📡 WiFi Adapter", value: "Owned", inline: true },
      { name: "🔋 Battery Pack", value: "Owned", inline: true }
    )
    .setFooter({ text: "Slots: 3/20" });

  message.reply({ embeds: [inventoryEmbed] });
};