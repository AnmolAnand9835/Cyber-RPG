const leaderboard = require("../controllers/leaderboard.controller")
const router = require("express").Router();

router.get("/", leaderboard);

module.exports = router;