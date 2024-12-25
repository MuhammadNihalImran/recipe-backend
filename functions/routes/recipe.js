const express = require("express");
const router = express.Router({ mergeParams: true });
const Recipes = require("../models/recipeModel.js");

const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig.js");
const upload = multer({ storage });

// GET all recipes
router.get("/", async (req, res) => {
  try {
    const data = await Recipes.find({});
    res.status(200).json(data); // Return full data as expected
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET a single recipe by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const showData = await Recipes.findById(id)
      .populate("ingredients")
      .populate("instractions");

    if (!showData) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(showData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST a new recipe
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const url = req.file.path;
    const filename = req.file.filename;
    const { title, description } = req.body;

    const newRecipe = new Recipes({
      title,
      description,
      image: {
        url,
        filename,
      },
    });

    await newRecipe.save();

    res
      .status(201)
      .json({ message: "Recipe added successfully", data: newRecipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE a recipe
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecipe = await Recipes.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res
      .status(200)
      .json({ message: "Recipe deleted successfully", data: deletedRecipe });
  } catch (err) {
    console.error("Error while deleting Recipe:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT to update a recipe
router.put(
  "/:id",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: "File upload error" });
      }
      next();
    });
  },
  async (req, res) => {
    const { id } = req.params;

    try {
      let recipe = await Recipes.findById(id);

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Update fields
      recipe.title = req.body.title || recipe.title;
      recipe.description = req.body.description || recipe.description;

      // Update image if new file is provided
      if (req.file) {
        recipe.image = {
          url: req.file.path,
          filename: req.file.filename,
        };
      }

      await recipe.save();

      res
        .status(200)
        .json({ message: "Recipe updated successfully", data: recipe });
    } catch (err) {
      console.error("Error updating recipe:", err);
      res.status(500).json({ message: "Failed to update recipe" });
    }
  }
);

module.exports = router;
