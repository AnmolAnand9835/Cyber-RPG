const router = require("express").Router();
const getShopItem = require("../controllers/getShopItem.controller")
const createShopItem = require("../controllers/addShopItem.controller")

router.get("/", getShopItem);
router.post("/", createShopItem)

module.exports = router;