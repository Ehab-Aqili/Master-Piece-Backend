import Model from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
const { Recipes } = Model;
const test = async (req, res) => {
  console.log(req.body);
  res.send("test");
};

const createRecipe = async (req, res) => {
  console.log(req);
  try {
    const recipe = await Recipes.create({
      recipe_name: req.body.recipe_name,
      recipe_calories: req.body.recipe_calories,
      recipe_Categories: req.body.recipe_Categories,
      recipe_image: req.body.recipe_image,
    });

    const message = "Recipe Added successfully";

    res.status(201).json({
      data: {
        recipe,
      },
      message: { message },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();

    if (!recipes) {
      return res.status(404).json({ message: "No recipes found" });
    }

    res.status(200).json({
      data: {
        recipes,
      },
      message: "All recipes retrieved successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const updatedRecipe = await Recipes.findByIdAndUpdate(
      recipeId,
      {
        recipe_name: req.body.recipe_name,
        recipe_calories: req.body.recipe_calories,
        recipe_Categories: req.body.recipe_Categories,
        recipe_image: req.body.recipe_image,
      },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const message = "Recipe updated successfully";

    res.status(200).json({
      data: {
        recipe: updatedRecipe,
      },
      message: message,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const removeRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const deletedRecipe = await Recipes.findByIdAndRemove(recipeId);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const message = "Recipe removed successfully";

    res.status(200).json({
      data: {
        recipe: deletedRecipe,
      },
      message: message,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export default {
  test,
  createRecipe,
  getAllRecipes,
  editRecipe,
  removeRecipe,
};
