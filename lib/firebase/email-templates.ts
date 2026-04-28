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
} from 'firebase/firestore';
import { db } from './config';
import {
  EmailTemplate,
  EmailTemplateFormData,
} from '@/types/email';
import { extractPlaceholders } from '../email/service';

/**
 * Get the email templates collection reference for a user
 */
function getTemplatesCollection(userId: string) {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  return collection(db, 'users', userId, 'emailTemplates');
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
 * Create a new email template
 */
export async function createEmailTemplate(
  userId: string,
  templateData: EmailTemplateFormData
): Promise<{ success: boolean; template?: EmailTemplate; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const templatesRef = getTemplatesCollection(userId);
    const now = Timestamp.now();

    // Auto-extract placeholders from subject and body
    const subjectPlaceholders = extractPlaceholders(templateData.subject);
    const bodyPlaceholders = extractPlaceholders(templateData.body);
    const allPlaceholders = Array.from(
      new Set([...subjectPlaceholders, ...bodyPlaceholders])
    );

    const newTemplateData = {
      ...templateData,
      placeholders: allPlaceholders,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(templatesRef, newTemplateData);

    const template: EmailTemplate = {
      id: docRef.id,
      ...templateData,
      placeholders: allPlaceholders,
      userId,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };

    return { success: true, template };
  } catch (error: any) {
    console.error('Error creating email template:', error);
    return {
      success: false,
      error: error.message || 'Failed to create email template',
    };
  }
}

/**
 * Get all email templates for a user
 */
export async function getEmailTemplates(
  userId: string
): Promise<{ success: boolean; templates?: EmailTemplate[]; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const templatesRef = getTemplatesCollection(userId);
    const q: Query<DocumentData> = query(
      templatesRef,
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    const templates: EmailTemplate[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertTimestamps(data),
      } as EmailTemplate;
    });

    return { success: true, templates };
  } catch (error: any) {
    console.error('Error fetching email templates:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch email templates',
    };
  }
}

/**
 * Get a single email template by ID
 */
export async function getEmailTemplate(
  userId: string,
  templateId: string
): Promise<{ success: boolean; template?: EmailTemplate; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const templateRef = doc(db, 'users', userId, 'emailTemplates', templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) {
      return { success: false, error: 'Email template not found' };
    }

    const template: EmailTemplate = {
      id: templateSnap.id,
      ...convertTimestamps(templateSnap.data()),
    } as EmailTemplate;

    return { success: true, template };
  } catch (error: any) {
    console.error('Error fetching email template:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch email template',
    };
  }
}

/**
 * Update an email template
 */
export async function updateEmailTemplate(
  userId: string,
  templateId: string,
  updates: Partial<EmailTemplateFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const templateRef = doc(db, 'users', userId, 'emailTemplates', templateId);

    // If subject or body is updated, re-extract placeholders
    const updateData: any = { ...updates };
    
    if (updates.subject || updates.body) {
      const currentTemplate = await getEmailTemplate(userId, templateId);
      if (!currentTemplate.success || !currentTemplate.template) {
        return { success: false, error: 'Template not found' };
      }

      const subject = updates.subject || currentTemplate.template.subject;
      const body = updates.body || currentTemplate.template.body;

      const subjectPlaceholders = extractPlaceholders(subject);
      const bodyPlaceholders = extractPlaceholders(body);
      updateData.placeholders = Array.from(
        new Set([...subjectPlaceholders, ...bodyPlaceholders])
      );
    }

    await updateDoc(templateRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating email template:', error);
    return {
      success: false,
      error: error.message || 'Failed to update email template',
    };
  }
}

/**
 * Delete an email template
 */
export async function deleteEmailTemplate(
  userId: string,
  templateId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const templateRef = doc(db, 'users', userId, 'emailTemplates', templateId);
    await deleteDoc(templateRef);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting email template:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete email template',
    };
  }
}
