const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  emoji: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  rarity: {
    type: String,
    enum: ["Common", "Rare", "Epic", "Legendary"],
    default: "Common",
  },

  category: {
    type: String,
    enum: ["device", "internet", "tool", "robot", "vehicle", "building"],
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  effect: {
    type: String,
    default: null,
  },

  requirements: {
    type: [String],
    default: [],
  },

  isAvailable: {
    type: Boolean,
    default: true,
  },

  maxDurability: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model("Shop", shopSchema);
