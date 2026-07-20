const addItem = require('../controllers/addShopItem.controller');
const router = require('express').Router()

router.post('/', addItem)

module.exports = router;