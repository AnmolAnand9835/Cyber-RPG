const router = require("express").Router();
const getPlayer = require("../controllers/getPlayer")

router.get("/:id", getPlayer);

module.exports = router;
