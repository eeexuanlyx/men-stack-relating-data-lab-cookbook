const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
  },
  { collection: "food" }
);

module.exports = mongoose.model("Food", FoodSchema);
