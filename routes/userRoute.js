const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.route("/signup").post(userController.createUser);

router.route("/test").post(userController.test);

router.route("/login").post(userController.login);

router
  .route("/update-user")
  .patch(userController.protect, userController.update);

router
  .route("/add-favorite")
  .patch(userController.protect, userController.favorite);

router
  .route("/remove-favorite")
  .patch(userController.protect, userController.removeFavorite);

router
  .route("/get-favorite/:id")
  .get(userController.protect, userController.getFavorite);

router
  .route("/add-meal")
  .patch(userController.protect, userController.favorite);

router
  .route("/remove-meal")
  .patch(userController.protect, userController.removeFavorite);

module.exports = router;
