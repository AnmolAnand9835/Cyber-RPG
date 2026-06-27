const leaderboard = require("../controllers/leaderboard")
const router = require("express").Router();

router.get("/", leaderboard);

module.exports = router;