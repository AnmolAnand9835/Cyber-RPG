const Shop = require("../models/Shop");

const getShopItem = (req, res) => {
  const shopItem = await Player.find()
  if (req.query.search) {
    const search = req.query.search.toLowerCase();

    const filterProducts = shopItem.filter((product) =>
      product.name.toLowerCase().includes(search)
    );

    return res.json(filterProducts);
  }

  return res.json(shopItem);
};

module.exports = getShopItem;