import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  Query,
  DocumentData,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import {
  ContactList,
  ContactListFormData,
  ContactListWithContacts,
  Contact,
} from '@/types/contact';
import { getContact } from './contacts';

/**
 * Get the contact lists collection reference for a user
 */
function getContactListsCollection(userId: string) {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  return collection(db, 'users', userId, 'contactLists');
}

/**
 * Convert Firestore Timestamp to Date
 */
function convertTimestamps(data: any): any {
  if (data.createdAt && typeof data.createdAt.toDate === 'function') {
    data.createdAt = data.createdAt.toDate();
  }
  if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
    data.updatedAt = data.updatedAt.toDate();
  }
  return data;
}

/**
 * Create a new contact list
 */
export async function createContactList(
  userId: string,
  listData: ContactListFormData
): Promise<{ success: boolean; list?: ContactList; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const listsRef = getContactListsCollection(userId);
    const now = Timestamp.now();

    const newListData = {
      ...listData,
      contactIds: [],
      contactCount: 0,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(listsRef, newListData);

    const list: ContactList = {
      id: docRef.id,
      ...listData,
      contactIds: [],
      contactCount: 0,
      userId,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };

    return { success: true, list };
  } catch (error: any) {
    console.error('Error creating contact list:', error);
    return {
      success: false,
      error: error.message || 'Failed to create contact list',
    };
  }
}

/**
 * Get all contact lists for a user
 */
export async function getContactLists(
  userId: string
): Promise<{ success: boolean; lists?: ContactList[]; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const listsRef = getContactListsCollection(userId);
    const q: Query<DocumentData> = query(listsRef, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);

    const lists: ContactList[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertTimestamps(data),
      } as ContactList;
    });

    return { success: true, lists };
  } catch (error: any) {
    console.error('Error fetching contact lists:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch contact lists',
    };
  }
}

/**
 * Get a single contact list by ID
 */
export async function getContactList(
  userId: string,
  listId: string
): Promise<{ success: boolean; list?: ContactList; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const listRef = doc(db, 'users', userId, 'contactLists', listId);
    const listSnap = await getDoc(listRef);

    if (!listSnap.exists()) {
      return { success: false, error: 'Contact list not found' };
    }

    const list: ContactList = {
      id: listSnap.id,
      ...convertTimestamps(listSnap.data()),
    } as ContactList;

    return { success: true, list };
  } catch (error: any) {
    console.error('Error fetching contact list:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch contact list',
    };
  }
}

/**
 * Get a contact list with all contact details populated
 */
export async function getContactListWithContacts(
  userId: string,
  listId: string
): Promise<{
  success: boolean;
  list?: ContactListWithContacts;
  error?: string;
}> {
  try {
    const listResult = await getContactList(userId, listId);

    if (!listResult.success || !listResult.list) {
      return { success: false, error: listResult.error };
    }

    const list = listResult.list;

    // Fetch all contacts
    const contactPromises = list.contactIds.map((contactId) =>
      getContact(userId, contactId)
    );

    const contactResults = await Promise.all(contactPromises);

    // Filter out failed fetches and extract contacts
    const contacts = contactResults
      .filter((result) => result.success && result.contact)
      .map((result) => result.contact!);

    const listWithContacts: ContactListWithContacts = {
      ...list,
      contacts,
    };

    return { success: true, list: listWithContacts };
  } catch (error: any) {
    console.error('Error fetching contact list with contacts:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch contact list with contacts',
    };
  }
}

/**
 * Update a contact list
 */
export async function updateContactList(
  userId: string,
  listId: string,
  updates: Partial<ContactListFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const listRef = doc(db, 'users', userId, 'contactLists', listId);

    await updateDoc(listRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating contact list:', error);
    return {
      success: false,
      error: error.message || 'Failed to update contact list',
    };
  }
}

/**
 * Delete a contact list
 */
export async function deleteContactList(
  userId: string,
  listId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const listRef = doc(db, 'users', userId, 'contactLists', listId);
    await deleteDoc(listRef);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting contact list:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete contact list',
    };
  }
}

/**
 * Add a contact to a list
 */
export async function addContactToList(
  userId: string,
  listId: string,
  contactId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    // Verify contact exists
    const contactResult = await getContact(userId, contactId);
    if (!contactResult.success) {
      return { success: false, error: 'Contact not found' };
    }

    const listRef = doc(db, 'users', userId, 'contactLists', listId);

    // Get current list to check if contact already exists
    const listSnap = await getDoc(listRef);
    if (!listSnap.exists()) {
      return { success: false, error: 'Contact list not found' };
    }

    const listData = listSnap.data();
    if (listData.contactIds?.includes(contactId)) {
      return { success: false, error: 'Contact already in list' };
    }

    // Add contact to list
    await updateDoc(listRef, {
      contactIds: arrayUnion(contactId),
      contactCount: (listData.contactCount || 0) + 1,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error adding contact to list:', error);
    return {
      success: false,
      error: error.message || 'Failed to add contact to list',
    };
  }
}

/**
 * Remove a contact from a list
 */
export async function removeContactFromList(
  userId: string,
  listId: string,
  contactId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const listRef = doc(db, 'users', userId, 'contactLists', listId);

    // Get current list
    const listSnap = await getDoc(listRef);
    if (!listSnap.exists()) {
      return { success: false, error: 'Contact list not found' };
    }

    const listData = listSnap.data();

    // Remove contact from list
    await updateDoc(listRef, {
      contactIds: arrayRemove(contactId),
      contactCount: Math.max((listData.contactCount || 1) - 1, 0),
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error removing contact from list:', error);
    return {
      success: false,
      error: error.message || 'Failed to remove contact from list',
    };
  }
}

/**
 * Add multiple contacts to a list
 */
export async function addContactsToList(
  userId: string,
  listId: string,
  contactIds: string[]
): Promise<{
  success: boolean;
  added?: number;
  skipped?: number;
  error?: string;
}> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    if (contactIds.length === 0) {
      return { success: false, error: 'No contacts to add' };
    }

    const listRef = doc(db, 'users', userId, 'contactLists', listId);

    // Get current list
    const listSnap = await getDoc(listRef);
    if (!listSnap.exists()) {
      return { success: false, error: 'Contact list not found' };
    }

    const listData = listSnap.data();
    const existingContactIds = new Set(listData.contactIds || []);

    // Filter out contacts already in list
    const newContactIds = contactIds.filter(
      (id) => !existingContactIds.has(id)
    );

    if (newContactIds.length === 0) {
      return {
        success: false,
        added: 0,
        skipped: contactIds.length,
        error: 'All contacts already in list',
      };
    }

    // Add new contacts
    const allContactIds = [...existingContactIds, ...newContactIds];

    await updateDoc(listRef, {
      contactIds: allContactIds,
      contactCount: allContactIds.length,
      updatedAt: Timestamp.now(),
    });

    return {
      success: true,
      added: newContactIds.length,
      skipped: contactIds.length - newContactIds.length,
    };
  } catch (error: any) {
    console.error('Error adding contacts to list:', error);
    return {
      success: false,
      error: error.message || 'Failed to add contacts to list',
    };
  }
}

/**
 * Remove multiple contacts from a list
 */
export async function removeContactsFromList(
  userId: string,
  listId: string,
  contactIds: string[]
): Promise<{
  success: boolean;
  removed?: number;
  error?: string;
}> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    if (contactIds.length === 0) {
      return { success: false, error: 'No contacts to remove' };
    }

    const listRef = doc(db, 'users', userId, 'contactLists', listId);

    // Get current list
    const listSnap = await getDoc(listRef);
    if (!listSnap.exists()) {
      return { success: false, error: 'Contact list not found' };
    }

    const listData = listSnap.data();
    const contactIdsToRemove = new Set(contactIds);

    // Filter out contacts to remove
    const remainingContactIds = (listData.contactIds || []).filter(
      (id: string) => !contactIdsToRemove.has(id)
    );

    await updateDoc(listRef, {
      contactIds: remainingContactIds,
      contactCount: remainingContactIds.length,
      updatedAt: Timestamp.now(),
    });

    const removed = (listData.contactIds?.length || 0) - remainingContactIds.length;

    return {
      success: true,
      removed,
    };
  } catch (error: any) {
    console.error('Error removing contacts from list:', error);
    return {
      success: false,
      error: error.message || 'Failed to remove contacts from list',
    };
  }
}
