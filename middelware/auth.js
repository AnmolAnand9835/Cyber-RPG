const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const {
  DiscordOAuth2,
  StateTypes,
  Scopes,
} = require("@mgalacyber/discord-oauth2");
const { Routes } = require("discord.js");

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

    const user = await oauth2.UserDataSchema.GetUserProfile(
        token.accessToken
    );

    console.log(user);

    const jwt_token = jwt.sign(
  {
    userId: user._id,
    discordId: user.username,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

console.log(jwt_token)

    res.send("Login successful");
});

module.exports = router;
