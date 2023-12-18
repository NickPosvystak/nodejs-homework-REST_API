const fs = require("fs").promises;
const uuid = require("uuid").v4;
const path = require("path");
const Contact = require("./contactModel");

const contactsPath = path.join(__dirname, "../models/contacts.json");

const listContacts = async () => {

  const data = await Contact.find();
  return data;
};

const contactById = async (contactId) => {

  const result = await Contact.findOne({ _id: contactId })
  if (!result) {
    return null;
  }
  return result;
};

const addNewContact = async (body) => {
  const contact = await Contact.create(body);

  return contact;
};

const deleteContact = async (contactId) => {
  // const contacts = await listContacts();

  // const contactIndex = contacts.findIndex(
  //   (contact) => contact.id === contactId
  // );
 const removedContact = await Contact.findByIdAndRemove({ _id: contactId });
  // if (!removedContact) {
  //   return null;
  // }
  // const deletedContact = contacts.splice(contactIndex, 1)[0];

  // await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return removedContact;
};

const updateItem = async (contactId, body) => {
  // const contacts = await listContacts();

  // const contactIndex = contacts.findIndex(
  //   (contact) => contact.id === contactId
  // );
  const updatedContact = await Contact.findByIdAndUpdate({ _id: contactId }, body, {
    new: true,
  });
  // if (updatedContact === -1) {
  //   return null;
  // }
  // contacts[contactIndex] = { ...contacts[contactIndex], ...body };

  // await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contacts[contactIndex];
};

module.exports = {
  listContacts,
  contactById,
  addNewContact,
  deleteContact,
  updateItem,
};
