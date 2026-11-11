# Cyber RPG

**ARCHIVED — No longer actively developed.**

Cyber RPG is a cyberpunk-themed multiplayer text RPG built around a Discord bot. Players create an operative, earn credits and experience, collect equipment, explore for randomized outcomes, and progress through a small mission chain. A companion Express API and Discord OAuth flow were also developed to support a web dashboard; the dashboard source is not included in this repository.

The project is preserved as an educational codebase and record of its implementation. It is not a hosted service or a promise that every defined feature is playable.

## What is implemented

- Discord message commands with the `sudo` prefix and Discord slash-command equivalents for the primary game actions.
- MongoDB-backed player profiles, credits, experience, levels, cooldown timestamps, inventory, and mission state.
- Daily rewards, exploration outcomes, a MongoDB-backed shop, purchasing, item repair and delivery.
- Three mission definitions and an event-driven objective manager. The `repair_pc` mission has an implemented path; later mission objectives are not all connected to gameplay commands.
- A small Express API for stats, public player summary fields, shop browsing/management, and a credits leaderboard.
- Discord OAuth2 sign-in and an HTTP-only JWT cookie for the authenticated player endpoint.

See [docs/PROJECT.md](docs/PROJECT.md) for the architecture, data structures, endpoint details, and known limitations. See [PROJECT_POSTMORTEM.md](PROJECT_POSTMORTEM.md) for the engineering retrospective.

## Technology

- Node.js (20.19 or newer; Mongoose 9 requires this minimum)
- Discord.js 14
- Express 5
- MongoDB and Mongoose 9
- Discord OAuth2 via `@mgalacyber/discord-oauth2`
- `jsonwebtoken`, `cookie-parser`, `cors`, and `dotenv`

There is no frontend source or frontend `package.json` in this repository, so a dashboard build cannot be run from this checkout.

## Requirements

- Node.js 20.19+
- MongoDB connection string and reachable MongoDB instance
- Discord bot application/token with Guilds, Guild Messages, and Message Content intents enabled for prefix commands
- Discord OAuth2 application settings if browser login is to be used

The API and bot run in the same Node process and startup requires both MongoDB and a bot token. OAuth configuration is optional for starting the bot/API, but OAuth routes return `503` until configured. Discord OAuth callback URLs must exactly match the URL registered in the Discord Developer Portal.

## Installation

```powershell
git clone https://github.com/AnmolAnand9835/Cyber-RPG.git
Set-Location Cyber-RPG
npm ci
Copy-Item .env.example .env
```

Edit `.env` with credentials and service URLs for your own environment. Never commit `.env` or paste real credentials into project documentation.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `YOUR_BOT_TOKEN` | Yes | Discord bot token |
| `MONGO_URI` | Yes | MongoDB connection string |
| `PORT` | No | Express port; defaults to `3000` |
| `DISCORD_CLIENT_ID` | OAuth only | Discord application/client ID |
| `DISCORD_CLIENT_SECRET` | OAuth only | Discord application secret |
| `DISCORD_REDIRECT_URI` | OAuth only | Exact registered OAuth callback URL |
| `JWT_SECRET` | OAuth only | Secret for signing/verifying seven-day JWT cookies |
| `CLIENT_REDIRECT_URL` | No | Frontend URL after successful OAuth; defaults to the historical Netlify URL |
| `SHOP_ADMIN_DISCORD_IDS` | Shop writes only | Comma-separated Discord user IDs authorized to create shop items |
| `NODE_ENV` | No | Set to `production` for secure, cross-site OAuth cookies |

`CLIENT_REDIRECT_URL` must be included in the server's CORS allowlist in `index.js` if the frontend makes credentialed API requests from it. Use a long, random `JWT_SECRET`; do not reuse the Discord client secret.

## Running

Start the combined Discord bot and API:

```powershell
npm start
```

Run the local logic/model tests:

```powershell
npm test
```

There is no shop seed script. Populate MongoDB `Shop` items through the admin-only `POST /api/shop` endpoint or a trusted database client before relying on `sudo shop` or `sudo buy`. Item names are looked up case-insensitively.

## Player commands

Players interact in Discord with the `sudo` prefix:

| Command | Behavior |
| --- | --- |
| `sudo start` | Create a profile with 500 credits |
| `sudo profile` | Show level, XP, credits, and inventory count |
| `sudo cash` | Show current credits |
| `sudo daily` | Claim credits and XP once per 24 hours |
| `sudo explore` | Roll an outcome subject to a short cooldown |
| `sudo shop` | List shop records in MongoDB |
| `sudo buy <item>` | Purchase a listed item |
| `sudo inventory` | List inventory entries |
| `sudo mission` | List missions whose level requirement is met |
| `sudo start mission <id>` | Start an available mission |
| `sudo repair` | Consume a toolkit and broken PC to create a fixed PC |
| `sudo deliver` | Consume a fixed PC and receive 200 credits |
| `sudo leaderboard` | Show the top ten players by credits |
| `sudo quit` | Permanently delete the caller's player profile |

The bot also registers slash commands including `/start-mission`. The slash interface and the text commands share handlers.

## API summary

- `GET /api/stats`
- `GET /api/players` (public summary fields only: username, avatar, credits, and level)
- `GET /api/shop` (supports `?search=term`)
- `POST /api/shop` (JWT-authenticated and restricted to `SHOP_ADMIN_DISCORD_IDS`)
- `GET /api/leaderboard`
- `GET /api/player` (JWT-authenticated; returns or creates the authenticated user's player)
- `GET /me` (JWT-authenticated token payload)
- `GET /auth/discord` and `/auth/discord/callback`

See [docs/PROJECT.md](docs/PROJECT.md) for the detailed API contract and authentication flow.

## Known limitations and unfinished work

- The React/Tailwind dashboard is not present in this repository. No dashboard code, build command, or dashboard dependencies are available to audit or build.
- Only `repair_pc` has a connected end-to-end mission path. `wifi_installation` and `build_website` define `travel`, `install`, `test`, `code`, and `deploy` objectives, but the game does not emit all of those events.
- `Data/data.shop.js` is reference data only; it is not seeded into the `Shop` collection.
- The inventory view displays a 20-slot limit, but inventory capacity is not enforced. Durability is stored when present but has no general wear/repair lifecycle beyond the dedicated repair command.
- Shop `requirements` metadata is stored but has no defined enforcement semantics; only the availability flag and player credits are checked during purchase.
- The models and commands are not wrapped in database transactions. Cooldown claims are guarded against simultaneous duplicate daily/exploration claims, but unrelated simultaneous economy or inventory operations can still race.
- The API and bot require live Discord credentials and MongoDB for runtime verification. Deployment services and historical user data are external to this repository.
- OAuth cookies are secure in production. Local OAuth should use localhost callback URLs and the development cookie configuration; production deployments need HTTPS and correctly configured CORS.

Do not treat an unconnected mission objective or an absent dashboard as a working feature.

## Archival and preservation

Keep the Git repository and its license intact. To preserve a reviewed snapshot, create a release/tag after reviewing the diff, retain the source and lockfile, and keep production `.env` values in a secret manager rather than Git. Back up MongoDB independently using the hosting provider's documented backup process; this repository does not contain database backups.

No hosting, Discord application, bot, or database shutdown is performed by this project handover. If those services are to be retired, use their respective administrative consoles, first preserve any data that must be retained, and follow the provider's recovery/retention policy.

## License

MIT. See [LICENSE](LICENSE).
