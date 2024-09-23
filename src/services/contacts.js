// src/services/students.js
import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};
export const createContact = async (payload) => {
  const contact = ContactsCollection.create(payload);
  return contact;
};
export const updateContact = async (id, payload, options) => {
  const rawResult = await ContactsCollection.findByIdAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult.value) {
    throw createHttpError(404, `Contact ${id} not found`);
  }
  return {
    contact: rawResult.value,
    // isNew: !rawResult.lastErrorObject.updatedExisting,
  };
};
export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);
  return contact;
};
