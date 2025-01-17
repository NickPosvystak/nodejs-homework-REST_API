const { catchAsync, httpError } = require("../units");
const schema = require("../validation/schema");
const {
  listContacts,
  contactById,
  addNewContact,
  deleteContact,
  updateItem,
  updateContactStatus,
} = require("../models/serviceContacts");

exports.getAllContacts = catchAsync(async (req, res) => {
  const data = await listContacts();

  res.status(200).json(data);
});

exports.createContact = catchAsync(async (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) return res.status(400).json({ message: error.message });

  const newContact = await addNewContact(req.body);

  res.status(201).json(newContact);
});

exports.getById = catchAsync(async (req, res) => {
  const { contactId } = req.params;

  const result = await contactById(contactId);

  if (!result) {
    throw httpError(404, "Not Found");
  }

  res.status(200).json(result);
});

exports.removeContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;

  const result = await deleteContact(contactId);

  res.status(200).json(result);
});

exports.updateContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    throw new httpError(400, "missing fields");
  }
  const result = await updateItem(contactId, req.body);

  res.status(200).json(result);
});

exports.updateStatusContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
   const { favorite } = req.body;

  // Перевірка наявності поля favorite у запиті
  if (typeof favorite === "undefined") {
    return res.status(400).json({ message: "missing field favorite" });
  }
  const result = await updateContactStatus(contactId, req.body);

  res.status(200).json(result);

  return result;
});
