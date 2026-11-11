require("dotenv").config();
const db = require("./db/connect");

const missingEnvironment = ["YOUR_BOT_TOKEN", "MONGO_URI"].filter(
  (name) => !process.env[name],
);
if (missingEnvironment.length) {
  throw new Error(
    `Missing required environment variables: ${missingEnvironment.join(", ")}`,
  );
}
const databaseConnection = db(process.env.MONGO_URI);

const express = require("express");
const app = express();
const cookie = require("cookie-parser");
app.use(cookie());

const TOKEN = process.env.YOUR_BOT_TOKEN;

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} = require("discord.js");

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
const quit = require("./commands/command.quit");
const mission = require("./commands/command.mission");
const startMission = require("./commands/command.startMission");
const deliver = require("./commands/command.deliver");
const repair = require("./commands/command.repair");

const slashCommands = [
  new SlashCommandBuilder().setName("start").setDescription("Create your player profile"),
  new SlashCommandBuilder().setName("help").setDescription("Show the list of Cyber RPG commands"),
  new SlashCommandBuilder().setName("profile").setDescription("View your character profile"),
  new SlashCommandBuilder().setName("cash").setDescription("Check your current credits"),
  new SlashCommandBuilder().setName("daily").setDescription("Claim your daily reward"),
  new SlashCommandBuilder().setName("explore").setDescription("Explore the city for loot and rewards"),
  new SlashCommandBuilder().setName("shop").setDescription("View the currently available shop items"),
  new SlashCommandBuilder().setName("inventory").setDescription("Show the items in your inventory"),
  new SlashCommandBuilder().setName("mission").setDescription("View your available missions"),
  new SlashCommandBuilder().setName("leaderboard").setDescription("Show the top players"),
  new SlashCommandBuilder().setName("repair").setDescription("Repair a broken PC using a toolkit"),
  new SlashCommandBuilder().setName("deliver").setDescription("Deliver a repaired PC to complete the mission"),
  new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy an item from the shop")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item name to buy")
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("start-mission")
    .setDescription("Start a mission")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Mission id to start")
        .setRequired(true),
    ),
];

const slashCommandHandlers = {
  start: (message) => start(message),
  help: (message) => help(message),
  profile: (message) => profile(message),
  cash: (message) => cash(message),
  daily: (message) => daily(message),
  explore: (message) => explore(message),
  shop: (message) => shop(message),
  inventory: (message) => inventory(message),
  mission: (message) => mission(message),
  leaderboard: (message) => leaderBoard(message),
  repair: (message) => repair(message),
  deliver: (message) => deliver(message),
  buy: (message) => buy(message),
  "start-mission": (message) => startMission(message),
};

const normalizeSlashInteraction = (interaction, commandName, extraArgs = []) => {
  const member = interaction.member;
  const author = {
    id: interaction.user.id,
    username: interaction.user.username,
    displayName: member?.displayName || interaction.user.username,
    displayAvatarURL: ({ extension = "png", size = 512 } = {}) =>
      interaction.user.displayAvatarURL({ extension, size }),
  };

  return {
    author,
    channel: interaction.channel,
    content: `sudo${extraArgs.length ? ` ${commandName} ${extraArgs.join(" ")}` : ` ${commandName}`}`,
    reply: (payload) =>
      interaction.replied || interaction.deferred
        ? interaction.followUp(payload)
        : interaction.reply(payload),
  };
};

const runCommand = async (handler, message) => {
  try {
    await handler(message);
  } catch (error) {
    console.error("Discord command failed:", error);
    try {
      await message.reply("❌ The command could not be completed.");
    } catch (replyError) {
      console.error("Failed to report the command error:", replyError);
    }
  }
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const registerSlashCommands = async () => {
  if (!process.env.DISCORD_CLIENT_ID) {
    console.warn("DISCORD_CLIENT_ID not set. Skipping slash command registration.");
    return;
  }

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: slashCommands.map((command) => command.toJSON()),
    });

    console.log("Discord slash commands registered successfully.");
  } catch (error) {
    console.error("Failed to register Discord slash commands:", error);
  }
};

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await registerSlashCommands();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const handler = slashCommandHandlers[interaction.commandName];
  if (!handler) return;

  let commandMessage;

  if (interaction.commandName === "buy") {
    const item = interaction.options.getString("item", true);
    commandMessage = normalizeSlashInteraction(interaction, "buy", [item]);
  } else if (interaction.commandName === "start-mission") {
    const missionId = interaction.options.getString("id", true);
    commandMessage = normalizeSlashInteraction(interaction, "start", ["mission", missionId]);
  } else {
    commandMessage = normalizeSlashInteraction(interaction, interaction.commandName);
  }

  await runCommand(handler, commandMessage);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "sudo start") {
    runCommand(start, message);
  }

  if (message.content === "sudo help") {
    runCommand(help, message);
  }

  if (message.content === "sudo cash") {
    runCommand(cash, message);
  }

  if (message.content === "sudo profile") {
    runCommand(profile, message);
  }

  if (message.content === "sudo explore") {
    runCommand(explore, message);
  }

  if (message.content === "sudo shop") {
    runCommand(shop, message);
  }

  if (message.content === "sudo daily") {
    runCommand(daily, message);
  }

  if (message.content === "sudo inventory") {
    runCommand(inventory, message);
  }

  if (message.content.startsWith("sudo buy")) {
    runCommand(buy, message);
  }

  if (message.content.startsWith("sudo")) {
    runCommand(update, message);
  }

  if (message.content === "sudo leaderboard") {
    runCommand(leaderBoard, message);
  }

  if(message.content === "sudo quit"){
    runCommand(quit, message);
  }
  if(message.content === "sudo mission"){
    runCommand(mission, message);
  }

  if(message.content.startsWith("sudo start mission")){
    runCommand(startMission, message);
  }

  if(message.content === "sudo repair"){
    runCommand(repair, message);
  }

  if(message.content === "sudo deliver"){
    runCommand(deliver, message);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dazzling-peony-47b40c.netlify.app",
    ],
    credentials: true,
  }),
);

app.use("/api/stats", require("./routes/stats.route"));
app.use("/api/players", require("./routes/players.route"));
app.use("/api/player", require("./routes/player.route"));
app.use("/api/shop", require("./routes/shop.route"));
app.use("/api/leaderboard", require("./routes/leaderboard.route"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/", require("./routes/me.route"));
app.use("/auth", require("./controllers/auth.controller"));

const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

databaseConnection
  .then(() => client.login(TOKEN))
  .then(() => {
    app.listen(port, () => {
      console.log(`Cyber RPG API listening on port ${port}.`);
    });
  })
  .catch((error) => {
    console.error("Cyber RPG startup failed:", error);
    process.exitCode = 1;
  });
