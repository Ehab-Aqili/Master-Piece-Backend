const express = require("express");
const recipesController = require("../controllers/recipesController");
const router = express.Router();

router.route("/test").post(recipesController.test);
router.route("/get-recipes").get(recipesController.getAllRecipes);
router.route("/add-recipe").post(recipesController.createRecipe);
router.route("/edit-recipe/:id").patch(recipesController.editRecipe);
router.route("/remove-recipe/:id").delete(recipesController.removeRecipe);

module.exports = router;
