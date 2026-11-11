const router = require("express").Router();
const getShopItem = require("../controllers/getShopItem.controller")
const createShopItem = require("../controllers/addShopItem.controller")
const auth = require("../middelware/auth");
const shopAdmin = require("../middelware/shopAdmin");

router.get("/", getShopItem);
router.post("/", auth, shopAdmin, createShopItem)

module.exports = router;