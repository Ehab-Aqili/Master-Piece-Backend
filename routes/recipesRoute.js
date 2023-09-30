const express = require("express");
const recipesController = require("../controllers/recipesController");
const router = express.Router();

router.route("/test").post(recipesController.test);

module.exports = router;
