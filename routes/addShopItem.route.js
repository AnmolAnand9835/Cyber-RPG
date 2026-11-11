const addItem = require('../controllers/addShopItem.controller');
const router = require('express').Router()
const auth = require("../middelware/auth");
const shopAdmin = require("../middelware/shopAdmin");

router.post('/', auth, shopAdmin, addItem)

module.exports = router;