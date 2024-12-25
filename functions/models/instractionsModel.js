const mongoose = require("mongoose");

// Define the Ingredient schema
const instractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name of the ingredient is mandatory
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Create a model from the schema
const Instraction = mongoose.model("Instraction", instractionSchema);

module.exports = Instraction;
