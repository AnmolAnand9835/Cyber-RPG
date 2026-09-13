# Cyber RPG Project Documentation

This document describes the current implementation in the repository. It is intentionally narrower than a product roadmap: features listed here are backed by the existing JavaScript code.

## Runtime architecture

`index.js` starts two services in one Node.js process:

1. A Discord.js client listens for messages beginning with `sudo` and dispatches them to handlers in `commands/`.
2. An Express server exposes JSON endpoints under `/api` and Discord OAuth routes under `/auth/discord`.

MongoDB is opened through `db/connect.js`. Player and shop records are stored with Mongoose in `models/Player.js` and `models/Shop.js`.

## Environment variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `YOUR_BOT_TOKEN` | `index.js` | Discord bot token |
| `MONGO_URI` | `index.js`, `db/connect.js` | MongoDB connection string |
| `PORT` | `index.js` | Express listening port |
| `DISCORD_CLIENT_ID` | OAuth controller | Discord OAuth application ID |
| `DISCORD_CLIENT_SECRET` | OAuth controller | Discord OAuth application secret |
| `DISCORD_REDIRECT_URI` | OAuth controller | Registered OAuth callback URL |
| `JWT_SECRET` | JWT middleware and token generator | Secret used to sign and verify browser session cookies |

The source currently reads `JWT_SECRET` exactly. A lowercase `jwt` variable will not authenticate API requests. `CLIENT_REDIRECT_URL` is present in some local configuration but is not currently read by the server; the OAuth callback redirects to the deployed frontend URL in `controllers/auth.controller.js`.

## Discord game flow

### Registration and progression

`sudo start` creates a `Player` with 500 credits, level 1, zero XP, and an empty inventory. Exploration and daily rewards add credits and XP. XP thresholds are calculated from the current level (`level * 100`); crossing a threshold increases the level.

`sudo explore` selects from common outcomes when the player has no laptop. A player with a laptop can also receive uncommon, rare, epic, and legendary outcomes. A laptop shortens the exploration cooldown, and a WiFi item is intended to double positive exploration rewards.

### Shop and inventory

Shop items are read from the MongoDB `Shop` collection. The static list in `Data/data.shop.js` is reference data, not an automatic seed: the collection must be populated before `sudo shop` or `sudo buy` can use those items.

Inventory entries track an item name, emoji, quantity, and optional durability. The displayed inventory limit is 20 slots, but the current command handlers do not enforce that limit.

### Missions

Mission definitions live in `Data/data.mission.js`; progress matching lives in `manager/mission.manager.js`.

| ID | Required level | Prerequisite | Reward |
| --- | ---: | --- | --- |
| `repair_pc` | 1 | None | 100 credits, 30 XP |
| `wifi_installation` | 2 | `repair_pc` | 350 credits, 80 XP |
| `build_website` | 3 | `wifi_installation` | 800 credits, 150 XP |

The first mission is the most complete playable path: buy a toolkit, explore for a broken PC, repair it, and deliver the fixed PC. The later mission definitions contain objectives such as travel, install, test, code, and deploy, but the current Discord command set does not yet implement handlers for all of those event types.

## HTTP API

### Public endpoints

| Method | Path | Response |
| --- | --- | --- |
| `GET` | `/api/stats` | `{ "uptime": number }` |
| `GET` | `/api/players` | All player documents |
| `GET` | `/api/shop` | All shop items; use `?search=term` to filter by name |
| `GET` | `/api/leaderboard` | Top ten players sorted by credits |
| `GET` | `/auth/discord` | Redirects to Discord OAuth |
| `GET` | `/auth/discord/callback` | Creates a seven-day HTTP-only JWT cookie and redirects to the frontend |

### Authenticated endpoints

Send the `token` cookie created by the OAuth callback.

| Method | Path | Response |
| --- | --- | --- |
| `GET` | `/api/player` | Returns the authenticated player's record, creating it on first access |
| `GET` | `/me` | Returns the decoded authenticated user payload |

### Shop writes

`POST /api/shop` accepts a JSON shop item and creates a MongoDB record. The current route is not protected by the JWT middleware. The controller expects `name`, `emoji`, `price`, `rarity`, `description`, and `effect`; `category` and `maxDurability` are also passed through to the model.

Example request:

```json
{
  "name": "toolkit",
  "emoji": "🧰",
  "price": 2500,
  "rarity": "Common",
  "category": "tool",
  "description": "A basic repair toolkit.",
  "effect": "Repairs broken PCs"
}
```

## Data model

### Player

The `Player` model stores the Discord user ID, username, avatar, credits, XP state, level, daily and exploration timestamps, inventory, active mission state, and completed mission IDs. `userId` is unique.

### Shop

The `Shop` model stores a unique item name, emoji, price, rarity, category, description, optional effect, requirements, availability, and maximum durability.

## Development notes

- The application has one npm script: `npm start`, which runs `node index.js`.
- There is no migration or seed script in the current `migration/` directory. Populate shop records through the API or a MongoDB client.
- The bot requires Discord Message Content intent because command dispatch is based on message text.
- The OAuth cookie is configured as `secure` and `sameSite: "none"`, so local browser testing may require HTTPS or a development-specific cookie configuration.
- The API currently exposes player records and shop writes with limited authorization. Add route-level authorization before deploying administrative or private endpoints publicly.