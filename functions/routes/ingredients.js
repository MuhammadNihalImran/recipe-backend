const express = require("express");
const router = express.Router({ mergeParams: true });
const Ingredient = require("../models/ingredientsModel"); // Assuming this is the correct path
const Recipes = require("../models/recipeModel");

router.post("/", async (req, res) => {
  console.log("add post Ingredients", req.body.name); // Check what is being sent
  console.log("add post Ingredients id", req.params.id); // Check what is being sent

  try {
    let recipe = await Recipes.findById(req.params.id);
    console.log("recipe", recipe);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    let newIngredient = new Ingredient({ name: req.body.name }); // Fetch recipe ID from the URL parameter
    if (!newIngredient) {
      return res.status(404).json({ message: "ingredient not found" });
    }
    console.log("nee", newIngredient);

    recipe.ingredients.push(newIngredient);

    await newIngredient.save();
    await recipe.save();

    res
      .status(201)
      .json({ message: "Ingredient added successfully", data: newIngredient });
  } catch (err) {
    console.error("Error while adding ingredient:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:recipeId", async (req, res) => {
  let { id, recipeId } = req.params;

  try {
    await Recipes.findByIdAndUpdate(id, { $pull: { ingredients: recipeId } });
    await Ingredient.findByIdAndDelete(recipeId);

    res.status(200).json({ message: "Ingredient deleted successfully" });
  } catch (err) {
    console.error("Error while deleting ingredient:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  const updatedData = req.body; // Assuming this contains updated fields like name, quantity, etc.

  try {
    // Find and update the ingredient by its ID
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      recipeId,
      updatedData,
      { new: true }
    );

    if (!updatedIngredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res
      .status(200)
      .json({ message: "Ingredient updated successfully", updatedIngredient });
  } catch (err) {
    console.error("Error while updating ingredient:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
