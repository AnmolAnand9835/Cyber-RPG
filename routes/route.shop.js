const router = require("express").Router();
const getShopItem = require("../controllers/getShopItem")

router.get("/", getShopItem);

module.exports = router;