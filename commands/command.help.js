const { EmbedBuilder } = require("discord.js");

module.exports = (message) => {
const helpEmbed = new EmbedBuilder()
  .setTitle("🤖 Welcome to Cyber RPG")
  .setDescription(
    "Start your journey, earn credits, explore the world, and become a tech legend!"
  )
  .addFields(
    {
      name: "🚀 Getting Started",
      value:
        "`sudo start` - Create your player profile\n`sudo profile` - View your profile",
    },
    {
      name: "💰 Economy",
      value:
        "`sudo cash` - Check your credits\n`sudo daily` - Claim daily rewards\n`sudo explore` - Explore and earn rewards",
    },
    {
      name: "🛒 Items",
      value:
        "`sudo shop` - View the shop\n`sudo buy <item>` - Buy an item\n`sudo inventory` - View your inventory",
    },
    {
      name: "🏆 Progress",
      value:
        "`sudo leaderboard` - View top players",
    }
  )
  .setFooter({
    text: "Tip: Start with 'sudo start' and then use 'sudo explore' to earn credits!",
  });

message.reply({ embeds: [helpEmbed] });
}