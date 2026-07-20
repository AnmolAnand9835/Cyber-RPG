const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rarity: {
    type: String,
    enum: ["Common", "Rare", "Epic", "Legendary"],
  },
  
  description: {
    type: String,
    require: true
  },

  effect: {
    type: String,
    require: false,
    enum: [income, damage, luck ,time]
  }
});

module.exports = mongoose.model("Shop", shopSchema);
