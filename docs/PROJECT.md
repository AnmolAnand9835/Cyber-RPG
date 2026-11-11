# Cyber RPG — Architecture and Operations

**Status: ARCHIVED — No longer actively developed.**

This document describes the code currently in this repository. It distinguishes written definitions from connected, playable behavior.

## Architecture

`index.js` is the application entry point. It loads `.env`, connects to MongoDB, creates a Discord.js client, registers Discord application commands when a client ID is configured, and starts an Express server after MongoDB and Discord startup succeed. The bot and HTTP API share one Node process.

```text
Discord message / slash interaction
              |
              v
       index.js dispatch
              |
              v
         commands/*.js ---------> Player / Shop (Mongoose)
              |                           |
              +--> MissionManager         v
                        ^              MongoDB
                        |
                 Data/data.mission.js

Browser --> Express routes --> controllers --> Player / Shop
   |             |                 |
   +-- OAuth ----+                 +--> Discord OAuth2 and JWT cookie
```

### Discord bot

`index.js` listens for message commands beginning with `sudo` and for slash interactions. The prefix-command handlers receive the author's Discord ID and reply/channel methods; slash interactions are adapted to the same handler shape. Player profile refreshes are also attempted through `middelware/Update.js` on messages beginning with `sudo`.

The message-content intent is required for prefix commands. The bot also uses Guilds and Guild Messages intents. Application/slash commands are registered globally when `DISCORD_CLIENT_ID` is set; Discord may take time to propagate global command changes.

### Player registration and persistence

`sudo start` creates a player keyed by Discord `userId`, defaulting to level 1, 500 credits, 0 XP, and an empty inventory. The authenticated `GET /api/player` endpoint can also create the player on first access, using the Discord user ID in the JWT. Bot profiles and OAuth profiles therefore map to the same `userId`.

`sudo quit` deletes that player's MongoDB document. It is an irreversible gameplay action from the perspective of this application.

### Database models

#### Player (`models/Player.js`)

| Field | Meaning |
| --- | --- |
| `userId` | Unique Discord snowflake; identity key shared by bot and OAuth |
| `username`, `avatar` | Cached Discord display details |
| `credits` | Game currency; default 500 |
| `xp`, `xpNeeded`, `level` | Progression state; levels require `level * 100` XP |
| `lastDaily`, `lastExplore` | Reward cooldown timestamps |
| `inventory` | Array of `{ name, emoji?, quantity, durability? }` item entries |
| `currentMission` | Current mission ID, objective index, progress, and legacy display/reward fields |
| `completedMissions` | Completed mission IDs used for prerequisite checks |

Inventory entries do not have a separate item ID: current gameplay identifies items by name. Name comparisons in game logic are normalized to lowercase where used. `durability` exists in the schema, but general durability consumption is not implemented. The stored field `currentMission.discription` retains its historical misspelling for compatibility with the current command.

#### Shop (`models/Shop.js`)

Shop records contain a unique name, emoji, nonnegative price, rarity, category, description, optional effect, requirements, availability, and optional maximum durability. Game commands query this collection; `Data/data.shop.js` is not automatically inserted. The creation endpoint validates model-supported values and is protected by JWT plus the `SHOP_ADMIN_DISCORD_IDS` allowlist. Purchase checks the availability flag, but the schema's `requirements` array has no defined enforcement semantics and is not currently applied.

The unique name index is case-sensitive at the database level even though purchase lookup is case-insensitive. Avoid creating case-variant duplicate names.

## Game economy and progression

- **Starting profile:** 500 credits.
- **Daily:** 200 credits and 50 XP every 24 hours. An inventory item named `wifi` doubles both rewards.
- **Exploration:** outcomes in `Data/data.outcome.js` award or remove credits and award XP, sometimes with an item. A `wifi` item doubles positive-credit exploration rewards and their XP. A laptop changes the rarity pool and reduces the cooldown. The implemented cooldowns are 5 seconds without a laptop and 3 seconds with one.
- **Shop:** purchases deduct the MongoDB shop price and add one item or increase its quantity. Purchasing is also a `buy_item` mission event.
- **Leveling:** each level threshold is `current level * 100`; XP remaining carries over. The `xpNeeded` display is set to the next level's threshold.
- **Repair/delivery:** `sudo repair` consumes one toolkit and one `broken_pc`, then adds `fixed_pc`. `sudo deliver` consumes one `fixed_pc` and awards 200 credits.
- **Leaderboard:** top ten player records ordered by credits.

The cooldown claim for daily and exploration is guarded by a conditional MongoDB update, which rejects a second simultaneous claim. The wider economy/inventory flows are not transactional; simultaneous unrelated purchases, repairs, or rewards may still race.

## Mission system

`Data/data.mission.js` defines three missions. `command.startMission.js` checks level, previous mission completion, and active mission state, then stores the selected ID and objective index on the player. Commands pass event objects into `manager/mission.manager.js`. The manager only advances the current objective when event type and any defined `item`/`target` match; `amount` controls how many matching events are required. On the final objective, it marks the mission complete, grants configured credits, XP, and item rewards, and records the mission ID.

Connected events:

| Game action | Event |
| --- | --- |
| Buy item | `buy_item`, with the purchased name |
| Find an item while exploring | `explore`, with the found item name |
| Repair broken PC | `repair`, target `broken_pc` |
| Deliver fixed PC | `deliver`, target `customer` |

`repair_pc` is the only mission with a connected sequence end-to-end. The later mission definitions require `travel`, `install`, `test`, `code`, or `deploy` events that are not emitted by current commands; they are content definitions, not complete playable missions.

## HTTP API

All endpoints are served by the same Express process as the bot.

| Method | Path | Access | Behavior |
| --- | --- | --- | --- |
| `GET` | `/api/stats` | Public | Process uptime |
| `GET` | `/api/players` | Public | Player summaries only: username, avatar, credits, level |
| `GET` | `/api/shop` | Public | Shop listing; `?search=` filters item names |
| `POST` | `/api/shop` | JWT + shop-admin ID allowlist | Validate and create a shop item |
| `GET` | `/api/leaderboard` | Public | Top ten by credits; returns 404 if empty |
| `GET` | `/api/player` | JWT | Returns or creates the authenticated user's player record |
| `GET` | `/me` | JWT | Returns the decoded JWT claims |
| `GET` | `/auth/discord` | OAuth configuration | Starts Discord identify authorization with a one-time state value |
| `GET` | `/auth/discord/callback` | OAuth configuration | Validates state, exchanges code, sets JWT cookie, redirects |

Authenticated routes expect an HTTP-only `token` cookie. OAuth callback failures from Discord are reported as client errors; OAuth routes report `503` if OAuth or JWT configuration is absent. The bot/API itself can run without OAuth configuration.

The `CLIENT_REDIRECT_URL` value controls the post-login redirect. CORS is restricted in `index.js` to the configured source allowlist (localhost and the historical Netlify application); add a deliberately trusted frontend origin to CORS before using a different one. Do not reflect arbitrary request origins when credentials are enabled.

## Authentication and authorization

Discord OAuth requests only the `identify` scope. The callback validates a cryptographically random state value stored in an HTTP-only cookie, obtains the Discord profile, and signs a seven-day JWT containing the Discord ID and display identity. The JWT is set as HTTP-only, `secure` and `SameSite=None` in production; local development uses a non-secure, `SameSite=Lax` cookie. `middelware/auth.js` verifies the cookie using `JWT_SECRET`.

The player endpoint uses `discordId` from the signed token, not a user-supplied request parameter. Shop writes additionally require the matching ID to appear in `SHOP_ADMIN_DISCORD_IDS`. Public player listing returns only display/leaderboard fields rather than inventory, mission, cooldown, or authentication data.

## Installation and operations

1. Install Node.js 20.19 or newer and start a MongoDB instance.
2. Run `npm ci`.
3. Copy `.env.example` to `.env`; provide `YOUR_BOT_TOKEN` and `MONGO_URI`.
4. Configure OAuth variables, `JWT_SECRET`, and `CLIENT_REDIRECT_URL` only if browser login is used. Add trusted shop administrators to `SHOP_ADMIN_DISCORD_IDS` if using the shop write API.
5. In Discord Developer Portal, enable Message Content intent if prefix commands are required. Set the OAuth callback URI exactly to `DISCORD_REDIRECT_URI`.
6. Run `npm start`; run local tests with `npm test`.
7. Insert the required shop records into MongoDB before attempting shop/purchase gameplay.

There is no production deployment definition, container configuration, migration/seed runner, backup script, or frontend build in the repository. MongoDB, Discord credentials, HTTPS termination, CORS origins, and any dashboard hosting are deployment dependencies managed outside this codebase.

## Unused and incomplete modules

- `manager/inventory.manager.js` is a fully commented-out placeholder and is not imported by the game. Existing inventory handling remains in command modules.
- `Data/data.shop.js` is reference content and is not consumed as a seed by the running application.
- `routes/addShopItem.route.js` is not mounted by `index.js`; shop creation is exposed through the protected `POST /api/shop` route in `routes/shop.route.js`.
- The `Player.startReward` flag is defined but not used by current commands.
- `Player.currentMission` contains legacy reward/display fields; current completion logic reads mission reward definitions from `Data/data.mission.js`.

## Archival notes

Retain the Git history, source files, lockfile, MIT license, and this documentation. Do not commit local `.env`, database dumps, generated build outputs, or credentials. Create an annotated release/tag only after reviewing the final diff. Database backup, hosted service shutdown, and Discord application retirement must be handled separately and only by an authorized operator.
