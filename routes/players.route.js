const router = require("express").Router();
const getPlayers = require("../controllers/getPlayers.controller")

router.get("/", getPlayers);


module.exports = router;
