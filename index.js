require("dotenv").config();
const db = require("./db/connect");

db(process.env.MONGO_URI);

const express = require("express");
const app = express();
const cookie = require('cookie-parser')

const TOKEN = process.env.YOUR_BOT_TOKEN;

const { Client, GatewayIntentBits } = require("discord.js");

const start = require("./commands/command.start");
const profile = require("./commands/command.profile");
const explore = require("./commands/command.explore");
const shop = require("./commands/command.shop");
const daily = require("./commands/command.daily");
const inventory = require("./commands/command.inventory");
const buy = require("./commands/command.buy");
const cash = require("./commands/command.cash");
const leaderBoard = require("./commands/command.leader");
const help = require("./commands/command.help");
const update = require("./middelware/Update");

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

  if (message.content === "sudo help") {
    help(message);
  }

  if (message.content === "sudo cash") {
    cash(message);
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

  if (message.content === "sudo daily") {
    daily(message);
  }

  if (message.content === "sudo inventory") {
    inventory(message);
  }

  if (message.content.startsWith("sudo buy")) {
    buy(message);
  }

  if (message.content.startsWith("sudo"))
    if (message.content === "sudo leaderboard") {
      leaderBoard(message);
    }
});

client.login(TOKEN);

app.use(express.json());

const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
    credentials: true,
  }),
);

app.use("/api/stats", require("./routes/stats.route"));
app.use("/api/players", require("./routes/players.route"));
app.use("/api/player", require("./routes/player.route"));
app.use("/api/shop", require("./routes/shop.route"));
app.use("/api/leaderboard", require("./routes/leaderboard.route"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/",require("./routes/me.route"))
app.use(require("./controllers/auth.controller"));

app.use(cookie());

app.listen(process.env.PORT);
