const express = require("express");
const router = express.Router();
const { randomBytes, timingSafeEqual } = require("crypto");

const {
  DiscordOAuth2,
  Scopes,
} = require("@mgalacyber/discord-oauth2");
const genrateToken = require("../middelware/genrateToken");

const oauthConfigured = Boolean(
  process.env.DISCORD_CLIENT_ID &&
    process.env.DISCORD_CLIENT_SECRET &&
    process.env.DISCORD_REDIRECT_URI,
);
const oauth2 = oauthConfigured
  ? new DiscordOAuth2({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      redirectUri: process.env.DISCORD_REDIRECT_URI,
    })
  : null;
const stateCookie = "discord_oauth_state";
const isProduction = process.env.NODE_ENV === "production";

const unavailable = (res) =>
  res.status(503).json({ message: "Discord OAuth is not configured." });

// Login route
router.get("/discord", async (req, res) => {
  if (!oauth2 || !process.env.JWT_SECRET) return unavailable(res);

  const state = randomBytes(32).toString("hex");
  const result = await oauth2.GenerateOAuth2Url({
    state,
    scope: [Scopes.Identify],
  });

  res.cookie(stateCookie, state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
  });
  res.redirect(result.url); 
});

router.get("/discord/callback", async (req, res) => {
  if (!oauth2 || !process.env.JWT_SECRET) return unavailable(res);

  if (req.query.error) {
    res.clearCookie(stateCookie);
    return res.status(400).json({ message: "Discord authorization was denied." });
  }

  const { code } = req.query;
  const { state } = req.query;
  const expectedState = req.cookies[stateCookie];
  res.clearCookie(stateCookie, {
    secure: isProduction,
    sameSite: "lax",
  });

  if (
    typeof code !== "string" ||
    typeof state !== "string" ||
    typeof expectedState !== "string"
  ) {
    return res.status(400).json({ message: "Invalid OAuth callback." });
  }

  const received = Buffer.from(state);
  const expected = Buffer.from(expectedState);
  if (
    received.length !== expected.length ||
    !timingSafeEqual(received, expected)
  ) {
    return res.status(400).json({ message: "Invalid OAuth state." });
  }

  const token = await oauth2.GetAccessToken(code);

  const user = await oauth2.UserDataSchema.GetUserProfile(token.accessToken);

  const jwtToken = genrateToken(user);

  res.cookie("token", jwtToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.redirect(
    process.env.CLIENT_REDIRECT_URL ||
      "https://dazzling-peony-47b40c.netlify.app/",
  );
});

module.exports = router;