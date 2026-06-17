require('dotenv').config()
const APIKEY = process.env.YOUR_BOT_TOKEN
const {
  Client,
  GatewayIntentBits
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {

  if (message.author.bot) return;

  if (message.channel.name !== "cyber-rpg") return;

  if (message.content === "!Yo Yo") {
    message.reply("Honey Shingh!");
  }

});

client.login(APIKEY);