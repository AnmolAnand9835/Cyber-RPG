const Shop = require("../models/Shop");

const getShop = async (req, res) => {
  const shopData = req.body;
  if (!shopData || typeof shopData !== "object" || Array.isArray(shopData)) {
    return res.status(400).json({ error: "Invalid shop item." });
  }

  const validRarities = ["Common", "Rare", "Epic", "Legendary"];
  const validCategories = [
    "device",
    "internet",
    "tool",
    "robot",
    "vehicle",
    "building",
  ];

  if (
    typeof shopData.name !== "string" ||
    !shopData.name.trim() ||
    typeof shopData.emoji !== "string" ||
    !shopData.emoji.trim() ||
    !Number.isFinite(shopData.price) ||
    shopData.price < 0 ||
    !validRarities.includes(shopData.rarity) ||
    !validCategories.includes(shopData.category) ||
    typeof shopData.description !== "string" ||
    !shopData.description.trim() ||
    (shopData.effect != null && typeof shopData.effect !== "string") ||
    (shopData.maxDurability != null &&
      (!Number.isFinite(shopData.maxDurability) || shopData.maxDurability < 0))
  ) {
    return res.status(400).json({ error: "Invalid shop item." });
  }

  const newShop = await Shop.create({
    name: shopData.name.trim(),
    emoji: shopData.emoji.trim(),
    price: shopData.price,
    rarity: shopData.rarity,
    category: shopData.category,
    description: shopData.description.trim(),
    effect: shopData.effect?.trim() || null,
    maxDurability: shopData.maxDurability ?? null,
  });

  return res.status(201).json({
    message: "Shop item created successfully.",
    data: newShop,
  });
}

module.exports = getShop;
