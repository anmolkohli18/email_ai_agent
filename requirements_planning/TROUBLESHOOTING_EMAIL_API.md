# Troubleshooting Email API Issues

## 🔴 Problem: API Returning 500 Error

The Vercel endpoint `https://send-email-app.vercel.app/api/send_gmail` is returning a **500 Internal Server Error**.

## 🔍 Root Cause

The hosted API likely has one of these issues:

1. **Missing Gmail Credentials**: The API needs `credentials.json` and `token.json` files
2. **OAuth Token Expired**: Gmail OAuth tokens need periodic refresh
3. **Deployment Issue**: The Vercel deployment may be broken
4. **Missing Environment Variables**: Required env vars not configured

## 🛠️ Solution Options

### Option 1: Use Mock Service (Immediate - For Testing)

Switch to the mock email service to test the campaign flow without actually sending emails.

**How to enable:**

1. Open `lib/email/send-campaign.ts`
2. Change import at the top:
   ```typescript
   // Replace this:
   import { sendEmail } from '../email/service';
   
   // With this:
   import { sendEmailMock as sendEmail } from '../email/mock-service';
   ```

3. Save and restart dev server

**Benefits**:
- ✅ Test campaign flow immediately
- ✅ Verify placeholder replacement
- ✅ Check progress tracking
- ✅ Debug UI without API dependency
- ✅ See detailed console logs

**Limitations**:
- ❌ No actual emails sent
- ❌ Can't test real delivery

### Option 2: Fix the Vercel API (Permanent Solution)

The API repository needs proper configuration. Here's what's required:

#### A. Check API Repository

The repo at `https://github.com/anmolkohli18/send-email-app` needs:

1. **Gmail OAuth Credentials** (`credentials.json`)
   - Get from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Download credentials.json

2. **OAuth Token** (`token.json`)
   - Run the app locally first
   - Complete OAuth flow
   - Token generated automatically
   - Upload to Vercel as environment variable

#### B. Vercel Configuration

The deployed API needs environment variables:

```bash
CREDENTIALS_JSON=<base64 encoded credentials.json>
TOKEN_JSON=<base64 encoded token.json>
```

#### C. Test Locally First

```bash
# Clone the send-email-app repo
git clone https://github.com/anmolkohli18/send-email-app.git
cd send-email-app

# Add credentials.json to root

# Install dependencies
npm install

# Run locally
npm run dev

# Test endpoint
curl -X POST http://localhost:3000/api/send_gmail \
  -H "Content-Type: application/json" \
  -d '{"to":"your@email.com","name":"Test","subject":"Test","emailBodyHtml":"<p>Test</p>"}'
```

### Option 3: Deploy Your Own Email API

Host your own version of the email API:

1. **Fork the Repository**
   ```bash
   # Fork https://github.com/anmolkohli18/send-email-app
   # Clone your fork
   ```

2. **Configure Gmail OAuth**
   - Set up credentials.json
   - Generate token.json locally

3. **Deploy to Vercel**
   ```bash
   vercel deploy
   ```

4. **Update Your App**
   ```bash
   # Update .env.local with your new API URL
   NEXT_PUBLIC_EMAIL_API_URL=https://your-app.vercel.app/api/send_gmail
   ```

### Option 4: Use Alternative Email Service

Replace the Vercel API with a different service:

#### A. SendGrid (Recommended)
```bash
npm install @sendgrid/mail
```

Create `lib/email/sendgrid-service.ts`:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(to, name, subject, htmlBody) {
  const msg = {
    to,
    from: 'your-verified@email.com',
    subject,
    html: htmlBody,
  };
  
  await sgMail.send(msg);
  return { messageId: 'sendgrid-success', success: true };
}
```

#### B. Resend (Modern Alternative)
```bash
npm install resend
```

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to, name, subject, htmlBody) {
  const { data } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject,
    html: htmlBody,
  });
  
  return { messageId: data.id, success: true };
}
```

## 🧪 Current Enhanced Error Logging

I've added detailed logging to help debug. Check your browser console for:

```
🚀 Sending email to: user@example.com
📧 API Endpoint: https://send-email-app.vercel.app/api/send_gmail
📬 API Response Status: 500
❌ API Error Response: <!DOCTYPE html>...Internal Server Error...
❌ Error sending email: Error: Email API returned 500...
```

## 📊 Quick Test Commands

### Test 1: Check API Status
```bash
curl -I https://send-email-app.vercel.app/api/send_gmail
```

### Test 2: Try Simple Request
```bash
curl -X POST https://send-email-app.vercel.app/api/send_gmail \
  -H "Content-Type: application/json" \
  -d '{"to":"test@test.com","name":"Test","subject":"Test","emailBodyHtml":"Test"}'
```

### Test 3: Check Vercel Logs
Visit the [Vercel Dashboard](https://vercel.com/) and check function logs for the deployed app.

## 🎯 Recommended Next Steps

**For Immediate Testing** (5 minutes):
1. ✅ Switch to mock service (Option 1)
2. ✅ Test campaign flow
3. ✅ Verify UI works correctly

**For Production Use** (1-2 hours):
1. Contact the API owner to fix credentials
2. OR deploy your own version (Option 3)
3. OR switch to SendGrid/Resend (Option 4)

## 📝 Verification Checklist

After implementing a solution:

- [ ] Can create campaign without errors
- [ ] Progress bar updates correctly
- [ ] Campaign logs show sent/failed status
- [ ] Campaign detail page displays results
- [ ] (If using real API) Emails actually arrive

## 🆘 Need Help?

1. **Check console logs** - Browser DevTools → Console tab
2. **Check campaign logs** - View campaign detail page for error messages
3. **Verify API endpoint** - Make sure `.env.local` has correct URL
4. **Test API directly** - Use curl commands above

## 🔧 Code Changes Made

I've updated `lib/email/service.ts` with:
- ✅ Detailed console logging
- ✅ Better error messages
- ✅ Error response capture
- ✅ Step-by-step progress logs

Check your browser console when sending campaigns to see detailed debug info!

---

**Last Updated**: April 28, 2026  
**Issue**: Vercel API returning 500 errors  
**Status**: Workarounds provided, awaiting API fix
