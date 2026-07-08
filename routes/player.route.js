const router = require("express").Router();
const getPlayer = require("../controllers/getPlayer.controller");
const auth = require("../middelware/auth");

router.get("/",auth, getPlayer);

module.exports = router;
