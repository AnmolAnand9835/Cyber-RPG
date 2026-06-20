module.exports = (message) => {
  const { EmbedBuilder } = require("discord.js");

const Inventory = [
  "💻 Old Laptop",
  "📡 WiFi Adapter",
  "🔋 Battery Pack"
];

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
};
