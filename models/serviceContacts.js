const Contact = require("./contactModel");

const listContacts = () => Contact.find();

const contactById = (contactId) => Contact.findOne({ _id: contactId });

const addNewContact = (body) => Contact.create(body);

const deleteContact = (contactId) =>
  Contact.findByIdAndDelete({ _id: contactId });

const updateItem = (contactId, body) =>
  Contact.findByIdAndUpdate({ _id: contactId }, body, {
    new: true,
  });

const updateContactStatus = async (contactId, body) => {

  const updatedContact = await Contact.findByIdAndUpdate(
    { _id: contactId },
    { favorite: body.favorite },
    { new: true }
  );

  return updatedContact;
};

module.exports = {
  listContacts,
  contactById,
  addNewContact,
  deleteContact,
  updateItem,
  updateContactStatus,
};
