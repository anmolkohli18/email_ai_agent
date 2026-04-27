import { EmailSendRequest, EmailSendResponse, PlaceholderValues } from '@/types/email';
import { Contact } from '@/types/contact';

// Vercel API endpoint
const EMAIL_API_URL = process.env.NEXT_PUBLIC_EMAIL_API_URL || 'https://send-email-app.vercel.app/api/send_gmail';

/**
 * Send a single email via the Vercel-hosted API
 */
export async function sendEmail(
  to: string,
  name: string,
  subject: string,
  htmlBody: string
): Promise<EmailSendResponse> {
  try {
    const request: EmailSendRequest = {
      to,
      name,
      subject,
      emailBodyHtml: htmlBody,
    };

    const response = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Email API returned ${response.status}`);
    }

    const data = await response.json();

    return {
      messageId: data.messageId,
      success: true,
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return {
      messageId: '',
      success: false,
      error: error.message || 'Failed to send email',
    };
  }
}

/**
 * Replace placeholders in template with actual contact data
 */
export function replacePlaceholders(
  template: string,
  values: PlaceholderValues
): string {
  let result = template;

  // Replace standard placeholders
  if (values.firstName) {
    result = result.replace(/\{\{firstName\}\}/g, values.firstName);
  }
  if (values.lastName) {
    result = result.replace(/\{\{lastName\}\}/g, values.lastName);
  }
  if (values.email) {
    result = result.replace(/\{\{email\}\}/g, values.email);
  }
  if (values.company) {
    result = result.replace(/\{\{company\}\}/g, values.company);
  }
  if (values.personalizedIntro) {
    result = result.replace(/\{\{personalizedIntro\}\}/g, values.personalizedIntro);
  }

  // Replace custom field placeholders (e.g., {{custom.fieldName}})
  Object.keys(values).forEach((key) => {
    if (
      !['firstName', 'lastName', 'email', 'company', 'personalizedIntro'].includes(key)
    ) {
      const placeholder = `{{custom.${key}}}`;
      const value = values[key];
      if (value) {
        result = result.replace(new RegExp(placeholder, 'g'), value);
      }
    }
  });

  return result;
}

/**
 * Get placeholder values from a contact
 */
export function getPlaceholderValues(contact: Contact): PlaceholderValues {
  const values: PlaceholderValues = {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    company: contact.company,
  };

  // Add custom fields
  if (contact.customFields) {
    Object.entries(contact.customFields).forEach(([key, value]) => {
      values[key] = value;
    });
  }

  // Add personalization notes as personalized intro if available
  if (contact.personalizationNotes) {
    values.personalizedIntro = contact.personalizationNotes;
  }

  return values;
}

/**
 * Extract placeholders from a template string
 */
export function extractPlaceholders(template: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = template.match(regex);
  
  if (!matches) return [];

  // Remove the curly braces and get unique values
  const placeholders = matches.map(match => match.replace(/\{\{|\}\}/g, ''));
  return Array.from(new Set(placeholders));
}

/**
 * Validate that all required placeholders have values
 */
export function validatePlaceholders(
  template: string,
  values: PlaceholderValues
): { valid: boolean; missing: string[] } {
  const placeholders = extractPlaceholders(template);
  const missing: string[] = [];

  placeholders.forEach(placeholder => {
    // Check standard placeholders
    if (['firstName', 'lastName', 'email', 'company', 'personalizedIntro'].includes(placeholder)) {
      if (!values[placeholder]) {
        missing.push(placeholder);
      }
    } else if (placeholder.startsWith('custom.')) {
      // Check custom field placeholders
      const fieldName = placeholder.replace('custom.', '');
      if (!values[fieldName]) {
        missing.push(placeholder);
      }
    }
  });

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Preview email with placeholder replacement
 */
export function previewEmail(
  subject: string,
  body: string,
  contact: Contact
): { subject: string; body: string } {
  const values = getPlaceholderValues(contact);
  
  return {
    subject: replacePlaceholders(subject, values),
    body: replacePlaceholders(body, values),
  };
}
