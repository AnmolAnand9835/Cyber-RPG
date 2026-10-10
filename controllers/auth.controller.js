const express = require("express");
const router = express.Router();

const {
  DiscordOAuth2,
  StateTypes,
  Scopes,
} = require("@mgalacyber/discord-oauth2");
const { Routes } = require("discord.js");
const genrateToken = require("../middelware/genrateToken");
const auth = require("../middelware/auth");

const oauth2 = new DiscordOAuth2({
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  redirectUri: process.env.DISCORD_REDIRECT_URI,
});

// Login route
router.get("/auth/discord", async (req, res) => {
  const result = await oauth2.GenerateOAuth2Url({
    state: StateTypes.UserAuth,
    scope: [Scopes.Identify],
  });

  res.redirect(result.url); 
});

router.get("/auth/discord/callback", async (req, res) => {
  const { code } = req.query;

  const token = await oauth2.GetAccessToken(code);

  const user = await oauth2.UserDataSchema.GetUserProfile(token.accessToken);

  const jwtToken = genrateToken(user);

res.cookie("token", jwtToken, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

  console.log("CALLBACK HIT");
  console.log("Has code:", Boolean(req.query.code));
  console.log("OAuth error:", req.query.error || null);

 res.redirect(process.env.CLIENT_REDIRECT_URL || "https://dazzling-peony-47b40c.netlify.app/");
// res.redirect("https://t.me/anmol_fun_bot/cyber_rpg");
});

module.exports = router;