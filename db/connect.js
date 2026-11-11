const mongoose = require("mongoose");

module.exports = async (url) => {
  if (!url) {
    throw new Error("MONGO_URI is required.");
  }

  await mongoose.connect(url);
  console.log("✅ MongoDB Connected");
};