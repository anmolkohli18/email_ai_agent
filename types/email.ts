export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string; // HTML or MDX content
  placeholders: string[]; // e.g. ['firstName', 'lastName', 'company']
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface EmailTemplateFormData {
  name: string;
  subject: string;
  body: string;
  placeholders?: string[];
}

export interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  contactIds: string[]; // Array of contact IDs
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  sentCount?: number;
  failedCount?: number;
  scheduledAt?: Date;
}

export interface EmailCampaignFormData {
  name: string;
  templateId: string;
  contactIds: string[];
  scheduledAt?: Date;
}

export interface EmailLog {
  id: string;
  campaignId: string;
  contactId: string;
  subject: string;
  body: string;
  status: 'sent' | 'failed' | 'opened' | 'clicked';
  timestamp: Date;
  errorMessage?: string;
  messageId?: string;
  userId: string;
}

export interface EmailSendRequest {
  to: string;
  name: string;
  subject: string;
  emailBodyHtml: string;
}

export interface EmailSendResponse {
  messageId: string;
  success: boolean;
  error?: string;
}

export interface PlaceholderValues {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  personalizedIntro?: string;
  [key: string]: string | undefined; // For custom fields
}
