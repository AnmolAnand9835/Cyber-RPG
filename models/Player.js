const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  avatar:{
    type: String,
    require: true,
    unique:true,
  },

  userId: {
    type: String,
    required: true,
    unique: true,
  },

  username: {
    type: String,
    require: true,
    unique: true,
  },

  credits: {
    type: Number,
    default: 500,
  },

  inventory: {
    type: [String],
    default: [  {
    id: "wifi",
    name: "WiFi",
    emoji: "📡",
    icon: "Wifi",
    price: 300,
  },
  {
    id: "battery",
    name: "Battery",
    emoji: "🔋",
    icon: "Battery",
    price: 200,
  },
  {
    id: "laptop",
    name: "Laptop",
    emoji: "💻",
    icon: "Laptop",
    price: 1000,
  },],
  },

  xp: {
    type: Number,
    default: 0,
  },

  xpNeeded: {
    type: Number,
    default: 100,
  },

  level: {
    type: Number,
    default: 1,
  },

  lastDaily: {
    type: Date,
    default: null,
  },

  startReward: {
    type: Boolean,
    default: false,
  },

  lastExplore: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Player", playerSchema);
