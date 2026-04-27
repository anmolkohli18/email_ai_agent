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
  where,
  Timestamp,
  Query,
  DocumentData,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config';
import {
  EmailCampaign,
  EmailCampaignFormData,
  EmailLog,
} from '@/types/email';

/**
 * Get the campaigns collection reference for a user
 */
function getCampaignsCollection(userId: string) {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  return collection(db, 'users', userId, 'emailCampaigns');
}

/**
 * Get the email logs collection reference for a user
 */
function getEmailLogsCollection(userId: string) {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  return collection(db, 'users', userId, 'emailLogs');
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
  if (data.scheduledAt && typeof data.scheduledAt.toDate === 'function') {
    data.scheduledAt = data.scheduledAt.toDate();
  }
  if (data.timestamp && typeof data.timestamp.toDate === 'function') {
    data.timestamp = data.timestamp.toDate();
  }
  return data;
}

/**
 * Create a new email campaign
 */
export async function createEmailCampaign(
  userId: string,
  campaignData: EmailCampaignFormData
): Promise<{ success: boolean; campaign?: EmailCampaign; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const campaignsRef = getCampaignsCollection(userId);
    const now = Timestamp.now();

    const newCampaignData: any = {
      ...campaignData,
      status: 'draft',
      userId,
      sentCount: 0,
      failedCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    if (campaignData.scheduledAt) {
      newCampaignData.scheduledAt = Timestamp.fromDate(campaignData.scheduledAt);
    }

    const docRef = await addDoc(campaignsRef, newCampaignData);

    const campaign: EmailCampaign = {
      id: docRef.id,
      ...campaignData,
      status: 'draft',
      userId,
      sentCount: 0,
      failedCount: 0,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };

    return { success: true, campaign };
  } catch (error: any) {
    console.error('Error creating email campaign:', error);
    return {
      success: false,
      error: error.message || 'Failed to create email campaign',
    };
  }
}

/**
 * Get all email campaigns for a user
 */
export async function getEmailCampaigns(
  userId: string,
  statusFilter?: EmailCampaign['status']
): Promise<{ success: boolean; campaigns?: EmailCampaign[]; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const campaignsRef = getCampaignsCollection(userId);
    
    let q: Query<DocumentData>;
    if (statusFilter) {
      q = query(
        campaignsRef,
        where('status', '==', statusFilter),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(campaignsRef, orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);

    const campaigns: EmailCampaign[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertTimestamps(data),
      } as EmailCampaign;
    });

    return { success: true, campaigns };
  } catch (error: any) {
    console.error('Error fetching email campaigns:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch email campaigns',
    };
  }
}

/**
 * Get a single email campaign by ID
 */
export async function getEmailCampaign(
  userId: string,
  campaignId: string
): Promise<{ success: boolean; campaign?: EmailCampaign; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const campaignRef = doc(db, 'users', userId, 'emailCampaigns', campaignId);
    const campaignSnap = await getDoc(campaignRef);

    if (!campaignSnap.exists()) {
      return { success: false, error: 'Email campaign not found' };
    }

    const campaign: EmailCampaign = {
      id: campaignSnap.id,
      ...convertTimestamps(campaignSnap.data()),
    } as EmailCampaign;

    return { success: true, campaign };
  } catch (error: any) {
    console.error('Error fetching email campaign:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch email campaign',
    };
  }
}

/**
 * Update an email campaign
 */
export async function updateEmailCampaign(
  userId: string,
  campaignId: string,
  updates: Partial<EmailCampaignFormData> & { 
    status?: EmailCampaign['status'];
    sentCount?: number;
    failedCount?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const campaignRef = doc(db, 'users', userId, 'emailCampaigns', campaignId);

    const updateData: any = { ...updates };
    
    if (updates.scheduledAt) {
      updateData.scheduledAt = Timestamp.fromDate(updates.scheduledAt);
    }

    await updateDoc(campaignRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating email campaign:', error);
    return {
      success: false,
      error: error.message || 'Failed to update email campaign',
    };
  }
}

/**
 * Delete an email campaign
 */
export async function deleteEmailCampaign(
  userId: string,
  campaignId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const campaignRef = doc(db, 'users', userId, 'emailCampaigns', campaignId);
    await deleteDoc(campaignRef);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting email campaign:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete email campaign',
    };
  }
}

/**
 * Log an email send result
 */
export async function logEmail(
  userId: string,
  emailLog: Omit<EmailLog, 'id' | 'userId' | 'timestamp'>
): Promise<{ success: boolean; log?: EmailLog; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const logsRef = getEmailLogsCollection(userId);
    const now = Timestamp.now();

    const logData = {
      ...emailLog,
      userId,
      timestamp: now,
    };

    const docRef = await addDoc(logsRef, logData);

    const log: EmailLog = {
      id: docRef.id,
      ...emailLog,
      userId,
      timestamp: now.toDate(),
    };

    return { success: true, log };
  } catch (error: any) {
    console.error('Error logging email:', error);
    return {
      success: false,
      error: error.message || 'Failed to log email',
    };
  }
}

/**
 * Get email logs for a campaign
 */
export async function getCampaignLogs(
  userId: string,
  campaignId: string
): Promise<{ success: boolean; logs?: EmailLog[]; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore is not initialized' };
    }

    const logsRef = getEmailLogsCollection(userId);
    const q = query(
      logsRef,
      where('campaignId', '==', campaignId),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);

    const logs: EmailLog[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertTimestamps(data),
      } as EmailLog;
    });

    return { success: true, logs };
  } catch (error: any) {
    console.error('Error fetching campaign logs:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch campaign logs',
    };
  }
}

/**
 * Get campaign statistics
 */
export async function getCampaignStats(
  userId: string,
  campaignId: string
): Promise<{
  success: boolean;
  stats?: {
    total: number;
    sent: number;
    failed: number;
    opened: number;
    clicked: number;
  };
  error?: string;
}> {
  try {
    const result = await getCampaignLogs(userId, campaignId);
    
    if (!result.success || !result.logs) {
      return { success: false, error: result.error };
    }

    const stats = {
      total: result.logs.length,
      sent: result.logs.filter(log => log.status === 'sent').length,
      failed: result.logs.filter(log => log.status === 'failed').length,
      opened: result.logs.filter(log => log.status === 'opened').length,
      clicked: result.logs.filter(log => log.status === 'clicked').length,
    };

    return { success: true, stats };
  } catch (error: any) {
    console.error('Error calculating campaign stats:', error);
    return {
      success: false,
      error: error.message || 'Failed to calculate campaign stats',
    };
  }
}
