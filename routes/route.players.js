const router = require("express").Router();
const getPlayers = require("../controllers/getPlayers")

router.get("/", getPlayers);


module.exports = router;
