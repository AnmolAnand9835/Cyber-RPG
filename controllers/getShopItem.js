const shopItem = require("../Data/data.shop")

const getShopItem =(req, res) =>{
    return res.json(shopItem)
}

module.exports = getShopItem