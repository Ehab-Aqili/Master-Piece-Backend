const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.route("/signup").post(userController.createUser);
router.route("/test").post(userController.test);
router.route("/login").post(userController.login);
router.route("/update-user").patch(userController.protect, userController.edit);

module.exports = router;
