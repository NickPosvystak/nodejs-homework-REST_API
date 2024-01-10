const express = require("express");

const router = express.Router();
const { validateFields, authMiddleware } = require("../../middleware");
const { authControllers } = require("../../controllers");
const { authenticateToken } = require("../../middleware/");

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

router.post("/logout", authenticateToken, authControllers.logout);

router.get("/current", authenticateToken, authControllers.current);

router.patch("/", authenticateToken, authControllers.subscription);

router.patch(
  "/avatars",
  authenticateToken,
  authMiddleware.uploadUserPhoto,
  authControllers.avatars
);

module.exports = router;
