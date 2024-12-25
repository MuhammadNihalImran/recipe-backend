const mongoose = require("mongoose");
const Ingredient = require("./ingredientsModel");
const Instraction = require("./instractionsModel");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  ingredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient", // References the Ingredient model
    },
  ],
  instractions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instraction", // References the Ingredient model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to automatically update `updatedAt` field
recipeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

recipeSchema.post("findOneAndDelete", async (recipe) => {
  if (recipe) {
    try {
      await Ingredient.deleteMany({ _id: { $in: recipe.ingredients } });
    } catch (err) {
      console.error("Error deleting reviews:", err);
    }
  }
});
recipeSchema.post("findOneAndDelete", async (recipe) => {
  if (recipe) {
    try {
      await Instraction.deleteMany({ _id: { $in: recipe.instractions } });
    } catch (err) {
      console.error("Error deleting reviews:", err);
    }
  }
});

const Recipes = mongoose.model("Recipes", recipeSchema);

module.exports = Recipes;
