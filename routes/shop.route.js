const router = require("express").Router();
const getShopItem = require("../controllers/getShopItem.controller")

router.get("/", getShopItem);

module.exports = router;