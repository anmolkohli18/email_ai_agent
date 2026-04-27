import { Contact } from '@/types/contact';
import { EmailTemplate, EmailLog } from '@/types/email';
import {
  sendEmail,
  getPlaceholderValues,
  replacePlaceholders,
} from '../email/service';
import { logEmail, updateEmailCampaign } from '../firebase/email-campaigns';
import { getContact } from '../firebase/contacts';

export interface SendCampaignOptions {
  userId: string;
  campaignId: string;
  template: EmailTemplate;
  contactIds: string[];
  onProgress?: (sent: number, total: number) => void;
  delayBetweenEmails?: number; // milliseconds
}

export interface SendCampaignResult {
  success: boolean;
  sent: number;
  failed: number;
  errors: Array<{ contactId: string; error: string }>;
}

/**
 * Send emails to multiple contacts as part of a campaign
 */
export async function sendCampaignEmails(
  options: SendCampaignOptions
): Promise<SendCampaignResult> {
  const {
    userId,
    campaignId,
    template,
    contactIds,
    onProgress,
    delayBetweenEmails = 1000, // Default 1 second delay
  } = options;

  let sent = 0;
  let failed = 0;
  const errors: Array<{ contactId: string; error: string }> = [];

  // Update campaign status to 'sending'
  await updateEmailCampaign(userId, campaignId, { status: 'sending' });

  for (let i = 0; i < contactIds.length; i++) {
    const contactId = contactIds[i];

    try {
      // Get contact data
      const contactResult = await getContact(userId, contactId);
      
      if (!contactResult.success || !contactResult.contact) {
        throw new Error('Contact not found');
      }

      const contact = contactResult.contact;

      // Replace placeholders with contact data
      const values = getPlaceholderValues(contact);
      const personalizedSubject = replacePlaceholders(template.subject, values);
      const personalizedBody = replacePlaceholders(template.body, values);

      // Send email via API
      const result = await sendEmail(
        contact.email,
        `${contact.firstName} ${contact.lastName}`,
        personalizedSubject,
        personalizedBody
      );

      if (result.success) {
        sent++;
        
        // Log successful send
        await logEmail(userId, {
          campaignId,
          contactId,
          subject: personalizedSubject,
          body: personalizedBody,
          status: 'sent',
          messageId: result.messageId,
        });
      } else {
        failed++;
        errors.push({ contactId, error: result.error || 'Unknown error' });

        // Log failed send
        await logEmail(userId, {
          campaignId,
          contactId,
          subject: personalizedSubject,
          body: personalizedBody,
          status: 'failed',
          errorMessage: result.error,
        });
      }
    } catch (error: any) {
      failed++;
      const errorMessage = error.message || 'Failed to send email';
      errors.push({ contactId, error: errorMessage });

      // Log failed send
      await logEmail(userId, {
        campaignId,
        contactId,
        subject: template.subject,
        body: template.body,
        status: 'failed',
        errorMessage,
      });
    }

    // Call progress callback
    if (onProgress) {
      onProgress(sent + failed, contactIds.length);
    }

    // Add delay between emails to avoid rate limiting
    if (i < contactIds.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenEmails));
    }
  }

  // Update campaign status and counts
  const finalStatus = failed === contactIds.length ? 'failed' : 'sent';
  await updateEmailCampaign(userId, campaignId, {
    status: finalStatus,
    sentCount: sent,
    failedCount: failed,
  });

  return {
    success: sent > 0,
    sent,
    failed,
    errors,
  };
}

/**
 * Send a single test email
 */
export async function sendTestEmail(
  template: EmailTemplate,
  contact: Contact
): Promise<{ success: boolean; error?: string }> {
  try {
    const values = getPlaceholderValues(contact);
    const personalizedSubject = replacePlaceholders(template.subject, values);
    const personalizedBody = replacePlaceholders(template.body, values);

    const result = await sendEmail(
      contact.email,
      `${contact.firstName} ${contact.lastName}`,
      personalizedSubject,
      personalizedBody
    );

    return {
      success: result.success,
      error: result.error,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to send test email',
    };
  }
}
