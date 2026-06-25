const mongoose = require("mongoose");

module.exports = (URL) =>{
mongoose.connect(URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));
}