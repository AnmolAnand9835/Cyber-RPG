const Shop = require("../models/Shop");

const getShopItem = async(req, res) => {
  const shopItem = await Shop.find()
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