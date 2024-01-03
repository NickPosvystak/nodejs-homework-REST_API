const express = require("express");

const router = express.Router();
const { authMiddleware, validateFields } = require("../../middleware");
const { authControllers } = require("../../controllers");
const {  userSchema } = require("../../models/userModel");
const { checkSignupData } = require("../../middleware/authMiddleware");

router
  // .post("/register", checkSignupData, authControllers.signup);
  // .post("/users/register", validateFields(userSchema), authControllers.signup);
  .post("/users/register", authControllers.register);
  // .post("users/login", authControllers.login);
  // .route("/users/logout")
  // .route("/users/current");

module.exports = router;
