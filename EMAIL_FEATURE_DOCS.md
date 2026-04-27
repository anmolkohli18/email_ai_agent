# Email Sending Feature - Documentation

## Overview

This document describes the email sending functionality integrated into the Email Agent platform. The feature uses the Vercel-hosted send-email-app API to send personalized bulk emails to contacts.

## Architecture

### Components

1. **Email Service Layer** (`lib/email/service.ts`)
   - Integrates with Vercel API at `https://send-email-app.vercel.app/api/send_gmail`
   - Handles placeholder replacement and email preview
   - Provides utility functions for template processing

2. **Firestore Data Layer**
   - `lib/firebase/email-templates.ts` - Template CRUD operations
   - `lib/firebase/email-campaigns.ts` - Campaign and log management
   - `lib/email/send-campaign.ts` - Campaign execution logic

3. **UI Components**
   - Template management page (`app/dashboard/templates/page.tsx`)
   - Template editor modal (`components/templates/TemplateEditorModal.tsx`)
   - Campaign management page (`app/dashboard/campaigns/page.tsx`)
   - Campaign creation flow (`app/dashboard/campaigns/create/page.tsx`)
   - Campaign detail view (`app/dashboard/campaigns/[id]/page.tsx`)

## Features

### 1. Email Templates

**Location**: `/dashboard/templates`

Create reusable email templates with:
- Template name
- Subject line (supports placeholders)
- Email body (HTML/plain text with placeholders)
- Auto-detected placeholders

**Supported Placeholders**:
- `{{firstName}}` - Contact first name
- `{{lastName}}` - Contact last name
- `{{email}}` - Contact email
- `{{company}}` - Contact company
- `{{personalizedIntro}}` - Personalization notes
- `{{custom.fieldName}}` - Custom contact fields

### 2. Campaign Creation

**Location**: `/dashboard/campaigns/create`

4-step wizard to create and send campaigns:
1. **Campaign Details** - Name your campaign
2. **Select Template** - Choose from existing templates
3. **Select Recipients** - Pick contacts to receive emails
4. **Review & Send** - Preview and execute

### 3. Campaign Management

**Location**: `/dashboard/campaigns`

- View all campaigns with status badges
- Track sent/failed counts
- Delete draft campaigns
- View campaign details

### 4. Campaign Analytics

**Location**: `/dashboard/campaigns/[id]`

View detailed campaign performance:
- Total recipients
- Sent count
- Failed count
- Opened count (future enhancement)
- Clicked count (future enhancement)
- Individual email logs with status

## Data Models

### EmailTemplate
```typescript
{
  id: string;
  name: string;
  subject: string;
  body: string;
  placeholders: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
```

### EmailCampaign
```typescript
{
  id: string;
  name: string;
  templateId: string;
  contactIds: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  sentCount: number;
  failedCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
```

### EmailLog
```typescript
{
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
```

## API Integration

### Vercel Email API

**Endpoint**: `https://send-email-app.vercel.app/api/send_gmail`

**Request Format**:
```typescript
{
  to: string;          // Recipient email
  name: string;        // Recipient name
  subject: string;     // Email subject
  emailBodyHtml: string; // HTML email body
}
```

**Response Format**:
```typescript
{
  messageId: string;   // Success indicator
}
```

### Rate Limiting

The campaign sender includes a 1-second delay between emails to avoid rate limiting. This can be configured via the `delayBetweenEmails` parameter.

## Firestore Security Rules

Collections are protected with the following rules:

```javascript
// Email Templates
match /emailTemplates/{templateId} {
  allow read, create, update, delete: if isOwner(userId);
}

// Email Campaigns
match /emailCampaigns/{campaignId} {
  allow read, create, update, delete: if isOwner(userId);
}

// Email Logs
match /emailLogs/{logId} {
  allow read, create: if isOwner(userId);
}
```

## Environment Variables

Required environment variable in `.env.local`:

```bash
NEXT_PUBLIC_EMAIL_API_URL=https://send-email-app.vercel.app/api/send_gmail
```

## Usage Examples

### Creating a Template

1. Navigate to `/dashboard/templates`
2. Click "Create Template"
3. Fill in template details:
   - Name: "Product Launch Email"
   - Subject: "Hi {{firstName}}, check out our new product!"
   - Body: "Dear {{firstName}} {{lastName}},\n\nWe're excited to announce..."
4. Placeholders are auto-detected
5. Click "Create Template"

### Sending a Campaign

1. Navigate to `/dashboard/campaigns`
2. Click "Create Campaign"
3. Step 1: Enter campaign name
4. Step 2: Select email template
5. Step 3: Select recipient contacts
6. Step 4: Review and click "Create & Send Campaign"
7. Progress bar shows real-time sending status
8. Redirects to campaign detail page on completion

### Viewing Campaign Results

1. Navigate to `/dashboard/campaigns`
2. Click on a campaign to view details
3. See metrics: total sent, failed, opened, clicked
4. View individual email logs with status

## Placeholder System

### Standard Placeholders

Automatically available for all contacts:
- `{{firstName}}` → Contact's first name
- `{{lastName}}` → Contact's last name
- `{{email}}` → Contact's email address
- `{{company}}` → Contact's company (if set)

### Custom Field Placeholders

Use format: `{{custom.fieldName}}`

Example: If contact has custom field `industry: "Technology"`, use `{{custom.industry}}`

### Personalization Notes

Use `{{personalizedIntro}}` to insert contact's personalization notes from their profile.

## Error Handling

The system handles errors gracefully:

1. **Template Errors**: Validation ensures required fields are filled
2. **Campaign Creation Errors**: Checks for valid template and contacts
3. **Send Errors**: Each email failure is logged individually
4. **API Errors**: Network failures are caught and logged

Failed emails don't stop the campaign - the system continues sending to remaining contacts.

## Future Enhancements

1. **Email Tracking**
   - Open rate tracking via pixel
   - Click tracking via link wrapping
   - Real-time engagement metrics

2. **Advanced Features**
   - A/B testing for subject lines
   - Scheduled sending (set future send time)
   - Email templates with rich text editor
   - Email preview with multiple contacts

3. **AI Personalization**
   - Automated research-based personalization
   - AI-generated subject lines
   - Smart send-time optimization

4. **Contact Lists**
   - Group contacts into lists
   - Tag-based filtering
   - Bulk import from CSV

## Troubleshooting

### Emails Not Sending

1. Check Vercel API status
2. Verify environment variable is set correctly
3. Check Firestore security rules
4. Review campaign logs for specific error messages

### Placeholders Not Replacing

1. Ensure placeholder syntax is correct: `{{placeholder}}`
2. Verify contact has the field populated
3. Check template preview before sending

### Rate Limiting Issues

1. Increase `delayBetweenEmails` in send-campaign.ts
2. Send smaller batches
3. Contact Vercel API provider about limits

## Performance Considerations

- **Large Campaigns**: For 1000+ recipients, consider sending in batches
- **Template Size**: Keep email body under 100KB for best performance
- **Database Reads**: Campaign logs are paginated server-side
- **Real-time Updates**: Progress updates use callbacks, not polling

## Security

1. All Firestore operations require authentication
2. Users can only access their own templates, campaigns, and logs
3. Email API requests go through Next.js (no direct client calls)
4. Sensitive credentials stored in environment variables

## Support

For issues or questions:
- Check campaign error logs in dashboard
- Review Firestore security rules
- Verify API endpoint accessibility
- Check browser console for client-side errors

---

**Last Updated**: April 27, 2026
**Version**: 1.0.0
