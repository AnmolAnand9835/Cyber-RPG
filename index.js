require("dotenv").config();

const TOKEN = process.env.YOUR_BOT_TOKEN;

const { Client, GatewayIntentBits } = require("discord.js");

const start = require('./commands/command.start')
const profile = require('./commands/command.profile')
const explore = require('./commands/command.explore')
const shop = require('./commands/command.shop')
const daily = require('./commands/command.daily')
const inventory = require('./commands/command.inventory')
const buy = require('./commands/command.buy')
const cash = require('./commands/command.cash')


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;


  if (message.content === "sudo start") {
    start(message);
  }

  if (message.content === "sudo cash"){
    cash(message)
  }

  if (message.content === "sudo profile") {
    profile(message);
  }

  if (message.content === "sudo explore") {
    explore(message);
  }

  if (message.content === "sudo shop") {
    shop(message);
  }

  if (message.content === "sudo daily"){
    daily(message)
  }

  if (message.content === "sudo inventory"){
    inventory(message)
  }

  if (message.content.startsWith("sudo buy")) {
    buy(message);
  }
});

client.login(TOKEN);
