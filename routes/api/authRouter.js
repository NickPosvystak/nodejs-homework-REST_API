const express = require("express");

const router = express.Router();
const { authMiddleware } = require("../../middleware");
const { authControllers } = require("../../controllers");

router
  .post("/register", authMiddleware.checkSignupData, authControllers.signup)
  .post("/login", authControllers.login)
  .route("/users/logout")
  .route("/users/current");

module.exports = router;
