# Cyber RPG

Cyber RPG is a cyberpunk text RPG for Discord, backed by MongoDB. Players create an operative, earn credits and XP, collect equipment, explore for random rewards, and complete missions. The same server also exposes a small Express API for a web client and public game data.

## Features

- Player registration, profiles, credits, XP, levels, and inventory
- Daily rewards with a 24-hour cooldown
- Random exploration outcomes with item, credit, and XP rewards
- MongoDB-backed shop and item purchases
- Three chained missions with objective progress tracking
- Top-ten leaderboard in Discord and through the API
- Discord OAuth login and JWT-protected player data for the web client

## Requirements

- Node.js 18 or newer
- A Discord bot with the Message Content, Guilds, and Guild Messages intents enabled
- A MongoDB database
- A Discord OAuth2 application if the web API is used

## Setup

```bash
git clone https://github.com/AnmolAnand9835/Cyber-RPG.git
cd Cyber-RPG
npm install
```

Create `.env` in the project root. These names match the code in `index.js` and the authentication middleware:

```env
YOUR_BOT_TOKEN=your_discord_bot_token
MONGO_URI=mongodb_connection_string
PORT=3000

DISCORD_CLIENT_ID=your_oauth_client_id
DISCORD_CLIENT_SECRET=your_oauth_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback
JWT_SECRET=your_jwt_signing_secret
```

`YOUR_BOT_TOKEN`, `MONGO_URI`, and `PORT` are required to start the service. The Discord OAuth and `JWT_SECRET` values are required for browser authentication. Keep `.env` private; it is ignored by Git.

Start the bot and API:

```bash
npm start
```

The HTTP server listens on the port in `PORT`. The Discord bot and Express API start from the same `index.js` process.

## Discord commands

All commands use the `sudo` prefix. A player must run `sudo start` before using player commands.

| Command | Description |
| --- | --- |
| `sudo start` | Create a player profile |
| `sudo help` | Show the command list |
| `sudo profile` | Show level, XP, credits, and inventory size |
| `sudo cash` | Show current credits |
| `sudo daily` | Claim the daily credit and XP reward |
| `sudo explore` | Explore and receive a random outcome |
| `sudo shop` | List items currently stored in MongoDB |
| `sudo buy <item>` | Purchase an item by its name |
| `sudo inventory` | Show collected items |
| `sudo mission` | List missions available at the current level |
| `sudo start mission <id>` | Start a mission, for example `sudo start mission repair_pc` |
| `sudo repair` | Repair a `broken_pc` using a `toolkit` |
| `sudo deliver` | Deliver a repaired PC to complete the first mission step |
| `sudo leaderboard` | Show the top ten players by credits |
| `sudo quit` | Delete the current player profile |

The available mission IDs are `repair_pc`, `wifi_installation`, and `build_website`. Mission progress is updated by supported game events such as purchases, exploration, repair, and delivery.

## HTTP API

The running server provides health, player, shop, leaderboard, and authentication endpoints. See [docs/PROJECT.md](docs/PROJECT.md) for the endpoint table, authentication flow, data model, and implementation notes.

## Project layout

```text
commands/       Discord command handlers
controllers/    Express request handlers
Data/           Static mission and exploration data
db/             MongoDB connection helper
manager/        Shared mission logic
middelware/     JWT and player update middleware
models/         Mongoose schemas
routes/         Express route definitions
index.js        Discord bot and HTTP server entry point
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
