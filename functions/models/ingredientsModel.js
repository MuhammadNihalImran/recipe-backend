const mongoose = require("mongoose");

// Define the Ingredient schema
const ingredientSchema = new mongoose.Schema({
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
