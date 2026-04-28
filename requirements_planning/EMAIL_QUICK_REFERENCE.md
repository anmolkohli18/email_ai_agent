# Email Feature Quick Reference

## 🚀 Quick Start Guide

### Prerequisites
- User account created and logged in
- At least one contact in the system
- `.env.local` configured with email API URL

### Step-by-Step: Send Your First Campaign

#### 1. Create an Email Template
```
URL: http://localhost:3000/dashboard/templates

1. Click "Create Template"
2. Enter template name: "Welcome Email"
3. Add subject: "Welcome {{firstName}}!"
4. Add body:
   Hi {{firstName}} {{lastName}},
   
   Welcome to our platform! We're excited to have {{company}} on board.
   
   Best regards,
   The Team
5. Click "Create Template"
```

#### 2. Create and Send a Campaign
```
URL: http://localhost:3000/dashboard/campaigns

1. Click "Create Campaign"
2. Step 1 - Details:
   - Name: "Welcome Campaign"
   - Click "Next"
3. Step 2 - Template:
   - Select "Welcome Email"
   - Click "Next"
4. Step 3 - Contacts:
   - Search and select recipients
   - Click "Next"
5. Step 4 - Review:
   - Verify preview
   - Click "Create & Send Campaign"
6. Watch progress bar
7. View results on campaign detail page
```

#### 3. View Campaign Results
```
URL: http://localhost:3000/dashboard/campaigns/[campaign-id]

See:
- Total sent/failed counts
- Individual email logs
- Template details
- Timestamp for each email
```

## 📍 Navigation

### Main Routes
- **Templates**: `/dashboard/templates`
- **Campaigns**: `/dashboard/campaigns`
- **Create Campaign**: `/dashboard/campaigns/create`
- **Campaign Details**: `/dashboard/campaigns/[id]`
- **Contacts**: `/dashboard/contacts`

### Quick Links in Header
When logged in, access via dropdown menu:
- Dashboard
- Contacts
- Templates (new)
- Campaigns (new)

## 🎯 Common Use Cases

### Use Case 1: Personalized Outreach
```
Template: Product Launch
Subject: {{firstName}}, check out our new feature!
Body: 
  Hi {{firstName}},
  
  As a {{company}} customer, you'll love our new feature...
  
  {{personalizedIntro}}
```

### Use Case 2: Event Invitation
```
Template: Event Invite
Subject: You're invited, {{firstName}}!
Body:
  Dear {{firstName}} {{lastName}},
  
  We'd love to see {{company}} at our upcoming event...
```

### Use Case 3: Follow-up Email
```
Template: Follow Up
Subject: Following up with {{company}}
Body:
  Hi {{firstName}},
  
  I wanted to follow up on our conversation about {{company}}'s needs...
```

## 🔧 Troubleshooting

### Problem: Emails not sending
**Solution**:
1. Check campaign detail page for error logs
2. Verify `.env.local` has correct API URL
3. Test API endpoint: `curl https://send-email-app.vercel.app/api/send_gmail`
4. Check Firestore security rules

### Problem: Placeholders not replacing
**Solution**:
1. Use correct syntax: `{{placeholder}}`
2. Ensure contact has the field populated
3. Check template preview before sending
4. Verify placeholder appears in "Detected Placeholders" list

### Problem: Campaign status stuck on "sending"
**Solution**:
1. Check browser console for errors
2. View email logs for individual failures
3. Refresh page to see updated status
4. Check network tab for API failures

### Problem: Can't see new menu items
**Solution**:
1. Refresh browser (hard refresh: Cmd+Shift+R)
2. Verify user is logged in
3. Check Header.tsx was updated correctly

## 📊 Understanding Campaign Status

- **draft**: Campaign created but not sent
- **sending**: Emails currently being sent (live)
- **sent**: All emails sent successfully
- **failed**: All emails failed to send

## 🎨 Placeholder Reference

### Standard Placeholders
| Placeholder | Source | Example |
|------------|--------|---------|
| `{{firstName}}` | Contact first name | "John" |
| `{{lastName}}` | Contact last name | "Doe" |
| `{{email}}` | Contact email | "john@example.com" |
| `{{company}}` | Contact company | "Acme Corp" |
| `{{personalizedIntro}}` | Contact notes | Custom intro text |

### Custom Placeholders
Format: `{{custom.fieldName}}`

Example:
- Contact has field: `role: "CEO"`
- Use in template: `{{custom.role}}`
- Result: "CEO"

## 🔒 Security Notes

1. **Authentication Required**: Must be logged in
2. **User Isolation**: Can only see own campaigns
3. **No Raw Access**: Email API hidden from client
4. **Secure Storage**: Credentials in env vars only

## 💡 Pro Tips

1. **Test First**: Create a test campaign with 1-2 contacts
2. **Preview Always**: Review email preview before sending
3. **Check Logs**: Always check campaign logs after sending
4. **Rate Limits**: System has 1-second delay between emails
5. **Save Templates**: Reuse successful templates
6. **Name Clearly**: Use descriptive names for campaigns
7. **Track Results**: Monitor sent/failed counts regularly

## 🐛 Known Limitations

1. No email open tracking (future)
2. No click tracking (future)
3. No scheduled sending (future)
4. No A/B testing (future)
5. No rich text editor (HTML only)
6. 1-second delay between emails (rate limiting)

## 📞 Support

If you encounter issues:
1. Check campaign error logs
2. Review browser console
3. Verify Firestore security rules
4. Check API endpoint status
5. Review EMAIL_FEATURE_DOCS.md

## 🎯 Best Practices

### Template Creation
- ✅ Use clear, descriptive names
- ✅ Test placeholders with preview
- ✅ Keep email body concise
- ✅ Include fallback text for optional fields

### Campaign Management
- ✅ Start with small test batches
- ✅ Verify contact data before sending
- ✅ Monitor sending progress
- ✅ Review logs after completion

### Contact Management
- ✅ Keep contact data up to date
- ✅ Add personalization notes
- ✅ Use company field consistently
- ✅ Add custom fields as needed

---

**Last Updated**: April 27, 2026  
**Quick Reference Version**: 1.0
