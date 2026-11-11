# Cyber RPG — Project Postmortem

**Project status: ARCHIVED — No longer actively developed.**

This retrospective is based on the source and configuration present in the archived repository. It does not infer a production history, player count, or implementation decisions that are not evidenced by the code.

## 1. Original project vision

Cyber RPG combines a cyberpunk setting with a lightweight multiplayer text RPG inside Discord. The central play loop is to create an operative, earn credits and XP, gather technology-themed equipment, explore for variable outcomes, and complete missions. A web-facing API and Discord sign-in were added to make player and game data accessible beyond Discord.

## 2. Main technical challenges

- Keeping player identity consistent between Discord messages, slash interactions, MongoDB documents, and OAuth-backed HTTP requests.
- Persisting game state—currency, inventory, cooldowns, level progression, and mission progress—while maintaining a simple command-driven experience.
- Reusing command handlers from both Discord's message API and slash interactions, which have different response and option interfaces.
- Modeling missions as ordered objectives driven by events emitted from independent commands.
- Coordinating a Discord bot and web API in one process, with external MongoDB, Discord, CORS, and OAuth configuration.

## 3. Architecture decisions

The project uses a straightforward CommonJS layout: `index.js` owns bot and Express startup; command modules contain game actions; Mongoose models represent persistent state; static `Data/` modules hold mission and exploration definitions; and the mission manager matches emitted events to the player's current objective.

Running the API and bot together keeps deployment simple, but couples their startup and lifecycle. MongoDB and Discord are runtime prerequisites for the combined process. The HTTP controllers and Discord commands access the same `Player` documents, so field and identity consistency matter across both surfaces.

## 4. Important implementation choices

- Discord user IDs are the stable `Player.userId` key. OAuth JWT claims include the Discord ID so browser requests resolve the same profile.
- Inventory is an embedded array of named items with quantities and optional durability, rather than a separate inventory collection.
- XP requirements scale linearly as `level * 100`; level-up keeps excess XP.
- Missions are declared as data and progress through command-emitted event types instead of embedding all objective logic in each command.
- Shop inventory is persisted separately in MongoDB. Static shop data exists, but no seed process automatically synchronizes it.
- Prefix commands use the `sudo` text prefix; Discord application commands adapt interactions to the same handlers for supported actions.

## 5. What worked well

- The core modules are small and readable enough to follow without a framework-specific build system.
- Player state, shop data, and mission definitions have clear homes.
- The game loop has recognizable, composable elements: earn, purchase, collect, progress, repair, and deliver.
- A unique Discord ID and a unique shop name provide useful database identity constraints.
- The code demonstrates using both a Discord bot and HTTP API against the same persistence layer.

## 6. What did not work

- Implementations and descriptions drifted: the dashboard is absent from the repository, mission definitions exceeded the event handlers, and shop reference data is not seeded.
- Rewards had inconsistent field names and duplicated XP handling. This caused items/rewards or progression display to be silently inconsistent.
- The daily reward used module-level mutable reward values and checked an inventory ID field that does not exist in the model.
- Inventory durability was written with a misspelled field, while inventory identity elsewhere relied on differently cased names.
- HTTP endpoints previously returned full player documents and accepted shop writes without authorization.
- OAuth used a fixed state label without callback validation, which did not provide a CSRF correlation check.
- Most game operations persist multi-field changes without MongoDB transactions or a general optimistic concurrency strategy. Independent simultaneous commands may conflict.
- Runtime exception reporting, environment validation, migrations, shop seeding, tests, and operational documentation were limited or absent.

## 7. Technical debt

- The Discord bot and API are tightly coupled in one entry point and share process lifecycle/configuration.
- Some Mongoose state fields preserve misspellings or redundant mission reward/progress data for historical compatibility.
- Inventory has no centralized helper, stable item identifier, slot enforcement, or generalized durability lifecycle.
- Mission progress is saved by calling commands rather than an independent persistence boundary; later mission event producers are missing.
- API controllers mostly rely on Express/Mongoose behavior for unexpected errors and do not implement a common error format, throttling, or observability.
- There is no migration/seed workflow, frontend source, deployment manifest, CI pipeline, or database integration test environment.
- Shop name uniqueness is case-sensitive in MongoDB although command lookups are case-insensitive.

## 8. Security and reliability lessons

- Treat every API route as a separate trust boundary. Public listing endpoints should expose only intentionally public fields; write routes need explicit authentication and authorization.
- OAuth `state` must be random per login attempt, tied to the browser, and validated before exchanging the authorization code.
- Cookie attributes must match the deployment topology: production cross-site cookies require HTTPS, `Secure`, and an appropriate `SameSite` policy; local development is different.
- A signed JWT still needs a strong secret, a deliberate identity claim, expiry, and server-side authorization checks.
- Check reward cooldowns atomically at the database boundary. A check in application memory alone permits simultaneous duplicate claims.
- For financial and inventory changes that must be all-or-nothing, use atomic database updates or transactions where MongoDB topology permits them; test concurrent calls rather than assuming ordinary document saves serialize safely.
- Validate API inputs against the actual schema, including types and allowed enum values, and return errors rather than success-shaped fallbacks.
- Keep secrets outside Git, document exact required environment variables, and verify secret-ignore rules without reading or printing local secret values.

## 9. What could have been designed differently

- Define and validate the player/item/mission event contracts before building independent command handlers.
- Use a stable item ID separate from its display name, with one shared inventory operation layer after multiple commands truly need it.
- Make XP/reward logic a single tested service and update progression with concurrency-safe database operations.
- Separate deployment/lifecycle boundaries only when there is an operational need; otherwise keep the combined process but validate startup and dependency health explicitly.
- Treat mission definitions as executable data only when every objective has a producer and test; label planned content rather than presenting it as complete gameplay.
- Add a minimal automated test suite and a data seeding/migration path as soon as persistence and progression logic become central.
- Keep dashboard source/build/deployment within the same archival scope or clearly declare it external so future maintainers can reproduce the complete product.

## 10. Skills and engineering concepts demonstrated

The codebase illustrates Discord.js event and interaction handling, CommonJS module boundaries, Express routing, OAuth2 identity, JWT cookies, Mongoose schemas and queries, embedded document modeling, cooldowns, game-economy logic, random outcome tables, data-driven missions, and the practical challenges of coordinating asynchronous persistence across multiple clients.

The most reusable lesson is that preserving a project requires preserving its limitations as carefully as its features: a definition is not an implemented flow, an endpoint is not an authorization policy, and a successful local syntax check is not proof of a working external integration.
