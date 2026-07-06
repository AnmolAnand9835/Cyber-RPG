const express = require("express");
const router = express.Router();

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
  const url = await oauth2.GenerateOAuth2Url({
    state: StateTypes.UserAuth,
    scope: [Scopes.Identify],
  }).then((result) => {
    console.log(result);
    router.get("/auth/discord/callback", (req, res) => {
      const { code } = req.query;
      console.log(code);
      
        oauth2.GetAccessToken(code).then((result2) => {
          console.log("Access Token", result2);

          res.send(`you sucessfull login click on this link <a href="http://localhost:5173">Visit Google</a>`);


        }).then((result3)=>{
            oauth2.UserDataSchema.GetUserProfile(result3.accessToken).then((result4) => {
            console.log(result4);
          });
        })
    });
    res.redirect("https://discord.com/oauth2/authorize?client_id=1516643856022507580&response_type=code&redirect_uri=https%3A%2F%2Fcyber-rpg-production.up.railway.app%2Fauth%2Fdiscord%2Fcallback&scope=identify");

      console.log(user);

  res.send("Login successful");
  });
}) 

// Callback
// router.get("/auth/discord/callback", async(req, res) => {
//   const { code } = req.query;

//   const token = await oauth2.GetAccessToken(code);

//   const user = await oauth2.UserDataSchema.GetUserProfile(token.accessToken);

//   console.log(user);

//   res.send("Login successful");
// });

module.exports = router;
