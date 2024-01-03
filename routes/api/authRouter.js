const express = require("express");

const router = express.Router();
const { authMiddleware, validateFields } = require("../../middleware");
const { authControllers } = require("../../controllers");
const { userSchema } = require("../../models/userModel");
const { checkSignupData } = require("../../middleware/authMiddleware");

const { schemas } = require("../../models/userModel");

router.post(
  "/register",
  validateFields(schemas.registerSchema),
  authControllers.register
);

router.post(
  "/login",
  validateFields(schemas.loginSchema),
  authControllers.login
);
// .route("/users/logout")
// .route("/users/current");

module.exports = router;
