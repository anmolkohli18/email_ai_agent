import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import { Contact, ContactFormData } from '@/types/contact';

/**
 * Get the contacts collection reference for a user
 */
function getContactsCollection(userId: string) {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  return collection(db, 'users', userId, 'contacts');
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
 * Create a new contact
 */
export async function createContact(
  userId: string,
  contactData: ContactFormData
): Promise<{ success: boolean; contact?: Contact; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    // Check for duplicate email
    const isDuplicate = await checkDuplicateEmail(userId, contactData.email);
    if (isDuplicate) {
      return {
        success: false,
        error: 'A contact with this email already exists',
      };
    }

    const contactsRef = getContactsCollection(userId);
    const now = Timestamp.now();

    const newContactData = {
      ...contactData,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(contactsRef, newContactData);

    const contact: Contact = {
      id: docRef.id,
      ...contactData,
      userId,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };

    return { success: true, contact };
  } catch (error: any) {
    console.error('Error creating contact:', error);
    return {
      success: false,
      error: error.message || 'Failed to create contact',
    };
  }
}

/**
 * Get all contacts for a user
 */
export async function getContacts(
  userId: string,
  options?: {
    sortBy?: 'firstName' | 'lastName' | 'email' | 'company' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<{ success: boolean; contacts?: Contact[]; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const contactsRef = getContactsCollection(userId);
    
    let q: Query<DocumentData> = query(contactsRef);
    
    // Add sorting
    if (options?.sortBy) {
      q = query(q, orderBy(options.sortBy, options.sortOrder || 'asc'));
    } else {
      // Default sort by createdAt desc (newest first)
      q = query(q, orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);

    const contacts: Contact[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertTimestamps(data),
      } as Contact;
    });

    return { success: true, contacts };
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch contacts',
    };
  }
}

/**
 * Get a single contact by ID
 */
export async function getContact(
  userId: string,
  contactId: string
): Promise<{ success: boolean; contact?: Contact; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const contactRef = doc(db, 'users', userId, 'contacts', contactId);
    const contactSnap = await getDoc(contactRef);

    if (!contactSnap.exists()) {
      return { success: false, error: 'Contact not found' };
    }

    const contact: Contact = {
      id: contactSnap.id,
      ...convertTimestamps(contactSnap.data()),
    } as Contact;

    return { success: true, contact };
  } catch (error: any) {
    console.error('Error fetching contact:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch contact',
    };
  }
}

/**
 * Update a contact
 */
export async function updateContact(
  userId: string,
  contactId: string,
  updates: Partial<ContactFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    // If email is being updated, check for duplicates
    if (updates.email) {
      const isDuplicate = await checkDuplicateEmail(
        userId,
        updates.email,
        contactId
      );
      if (isDuplicate) {
        return {
          success: false,
          error: 'A contact with this email already exists',
        };
      }
    }

    const contactRef = doc(db, 'users', userId, 'contacts', contactId);

    await updateDoc(contactRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating contact:', error);
    return {
      success: false,
      error: error.message || 'Failed to update contact',
    };
  }
}

/**
 * Delete a contact
 */
export async function deleteContact(
  userId: string,
  contactId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const contactRef = doc(db, 'users', userId, 'contacts', contactId);
    await deleteDoc(contactRef);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting contact:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete contact',
    };
  }
}

/**
 * Search contacts by name, email, or company
 */
export async function searchContacts(
  userId: string,
  searchQuery: string
): Promise<{ success: boolean; contacts?: Contact[]; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    // Get all contacts and filter client-side
    // Note: For production with large datasets, consider using Algolia or similar
    const result = await getContacts(userId);
    
    if (!result.success || !result.contacts) {
      return result;
    }

    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      return result;
    }

    const filteredContacts = result.contacts.filter((contact) => {
      const firstName = contact.firstName.toLowerCase();
      const lastName = contact.lastName.toLowerCase();
      const email = contact.email.toLowerCase();
      const company = contact.company?.toLowerCase() || '';

      return (
        firstName.includes(query) ||
        lastName.includes(query) ||
        email.includes(query) ||
        company.includes(query) ||
        `${firstName} ${lastName}`.includes(query)
      );
    });

    return { success: true, contacts: filteredContacts };
  } catch (error: any) {
    console.error('Error searching contacts:', error);
    return {
      success: false,
      error: error.message || 'Failed to search contacts',
    };
  }
}

/**
 * Check if a contact with the given email already exists
 */
export async function checkDuplicateEmail(
  userId: string,
  email: string,
  excludeContactId?: string
): Promise<boolean> {
  try {
    if (!db) {
      return false;
    }

    const contactsRef = getContactsCollection(userId);
    const q = query(contactsRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    // If excluding a contact (during update), check if any other contact has this email
    if (excludeContactId) {
      return snapshot.docs.some((doc) => doc.id !== excludeContactId);
    }

    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking duplicate email:', error);
    return false;
  }
}

/**
 * Bulk create contacts from CSV import
 */
export async function bulkCreateContacts(
  userId: string,
  contactsData: ContactFormData[]
): Promise<{
  success: boolean;
  created?: number;
  skipped?: number;
  errors?: string[];
  duplicates?: string[];
}> {
  try {
    if (!db) {
      return { success: false, errors: ['Firestore is not initialized'] };
    }

    if (contactsData.length === 0) {
      return {
        success: false,
        errors: ['No contacts to import'],
      };
    }

    const contactsRef = getContactsCollection(userId);
    const now = Timestamp.now();

    // Get existing emails to check for duplicates
    const existingEmails = await getExistingEmails(userId);
    const emailSet = new Set(existingEmails.map((e) => e.toLowerCase()));

    const errors: string[] = [];
    const duplicates: string[] = [];
    let created = 0;
    let skipped = 0;

    // Process in batches to avoid overwhelming Firestore
    const batchSize = 100;
    for (let i = 0; i < contactsData.length; i += batchSize) {
      const batch = contactsData.slice(i, i + batchSize);

      const promises = batch.map(async (contactData, index) => {
        const rowNumber = i + index + 1;
        const emailLower = contactData.email.toLowerCase();

        // Check for duplicates
        if (emailSet.has(emailLower)) {
          duplicates.push(
            `Row ${rowNumber}: Email "${contactData.email}" already exists`
          );
          return { success: false, isDuplicate: true };
        }

        try {
          // Add to Firestore
          const newContactData = {
            ...contactData,
            userId,
            createdAt: now,
            updatedAt: now,
          };

          await addDoc(contactsRef, newContactData);

          // Add to email set to prevent duplicates within the import
          emailSet.add(emailLower);

          return { success: true };
        } catch (error: any) {
          errors.push(
            `Row ${rowNumber}: Failed to create contact - ${error.message}`
          );
          return { success: false };
        }
      });

      const results = await Promise.all(promises);

      results.forEach((result) => {
        if (result.success) {
          created++;
        } else if (result.isDuplicate) {
          skipped++;
        } else {
          skipped++;
        }
      });
    }

    const hasErrors = errors.length > 0 || duplicates.length > 0;
    const allErrors = [...errors, ...duplicates];

    return {
      success: created > 0,
      created,
      skipped,
      errors: hasErrors ? allErrors : undefined,
      duplicates: duplicates.length > 0 ? duplicates : undefined,
    };
  } catch (error: any) {
    console.error('Error bulk creating contacts:', error);
    return {
      success: false,
      errors: [error.message || 'Failed to bulk create contacts'],
    };
  }
}

/**
 * Get all existing emails for duplicate checking
 */
async function getExistingEmails(userId: string): Promise<string[]> {
  try {
    if (!db) {
      return [];
    }

    const contactsRef = getContactsCollection(userId);
    const snapshot = await getDocs(contactsRef);

    return snapshot.docs.map((doc) => doc.data().email as string);
  } catch (error) {
    console.error('Error fetching existing emails:', error);
    return [];
  }
}
