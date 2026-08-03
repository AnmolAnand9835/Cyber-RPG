const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    emoji:{
      type: String
    },
    quantity: {
      type: Number,
      default: 1,
    },
    durability: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

const playerSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: true,
  },

  userId: {
    type: String,
    required: true,
    unique: true,
  },

  username: {
    type: String,
    required: true,
  },

  credits: {
    type: Number,
    default: 500,
  },

  inventory: {
    type: [inventorySchema],
    default: [],
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
  currentMission: {
    id: {
      type: String,
      default: null,
    },

    currentObjective: {
      type: Number,
      default: 0,
    },

    progress: {
      type: Number,
      default: 0,
    },
  },
 completedMissions: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Player", playerSchema);
