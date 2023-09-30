import express from "express";
import recipesController from "../controllers/recipesController.js";
const router = express.Router();

router.route("/test").post(recipesController.test);
router.route("/get-recipes").get(recipesController.getAllRecipes);
router.route("/add-recipe").post(recipesController.createRecipe);
router.route("/edit-recipe/:id").patch(recipesController.editRecipe);
router.route("/remove-recipe/:id").delete(recipesController.removeRecipe);

export default router;
