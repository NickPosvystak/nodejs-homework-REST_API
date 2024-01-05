const express = require("express");

const router = express.Router();
const { contactsController } = require("../../controllers");
const { validateFields, authenticateToken } = require("../../middleware");
const schema = require("../../validation/schema");

router
  .route("/")
  .get(authenticateToken, contactsController.getAllContacts)
  .post(authenticateToken, validateFields(schema), contactsController.createContact);

router
  .route("/:contactId")
  .get(authenticateToken, contactsController.getById)
  .delete(authenticateToken, contactsController.removeContact)
  .put(authenticateToken, validateFields(schema), contactsController.updateContact);

router
  .route("/:contactId/favorite")
  .patch(authenticateToken, contactsController.updateStatusContact);

module.exports = router;
