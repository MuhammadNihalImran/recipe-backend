const express = require("express");
const router = express.Router({ mergeParams: true });
const Instraction = require("../models/instractionsModel"); // Assuming this is the correct path
const Recipes = require("../models/recipeModel");

router.post("/", async (req, res) => {
  console.log("add post instractions:", req.body.name); // Check what is being sent
  console.log("add post Instraction id:", req.params.id); // Check what is being sent

  try {
    let recipe = await Recipes.findById(req.params.id);
    console.log("recipe", recipe);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    let newInstraction = new Instraction({ name: req.body.name }); // Fetch recipe ID from the URL parameter
    if (!newInstraction) {
      return res.status(404).json({ message: "instraction not found" });
    }
    console.log("nee", newInstraction);

    recipe.instractions.push(newInstraction);

    await newInstraction.save();
    await recipe.save();

    res.status(201).json({
      message: "Instraction added successfully",
      data: newInstraction,
    });
  } catch (err) {
    console.error("Error while adding instraction:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:recipeId", async (req, res) => {
  let { id, recipeId } = req.params;

  try {
    await Recipes.findByIdAndUpdate(id, { $pull: { instractions: recipeId } });
    await Instraction.findByIdAndDelete(recipeId);

    res.status(200).json({ message: "Instraction deleted successfully" });
  } catch (err) {
    console.error("Error while deleting instractions:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  const updatedData = req.body; // Assuming this contains updated fields like name, quantity, etc.

  try {
    // Find and update the ingredient by its ID
    const updatedInstraction = await Instraction.findByIdAndUpdate(
      recipeId,
      updatedData,
      { new: true }
    );

    if (!updatedInstraction) {
      return res.status(404).json({ message: "Instraction not found" });
    }

    res
      .status(200)
      .json({
        message: "Instraction updated successfully",
        updatedInstraction,
      });
  } catch (err) {
    console.error("Error while updating instraction:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
