const router = require("express").Router();
const getPlayer = require("../controllers/getPlayer.controller")

router.get("/:id", getPlayer);

module.exports = router;
