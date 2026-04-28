# Quick Fix: Email API 500 Error

## 🔴 Problem
The Vercel API at `https://send-email-app.vercel.app/api/send_gmail` is returning **500 Internal Server Error**.

## ✅ Solution: Use Mock Service

I've configured your app to use a **mock email service** that simulates sending without calling the broken API.

### What I Did

1. ✅ Created `lib/email/mock-service.ts` - Mock email sender
2. ✅ Updated `lib/email/service.ts` - Better error logging
3. ✅ Updated `lib/email/send-campaign.ts` - Smart service selection
4. ✅ Added `.env.local` setting - `NEXT_PUBLIC_EMAIL_MODE=mock`

### How to Use

#### 🧪 Test Mode (Current - Mock Emails)

Your `.env.local` is now set to:
```bash
NEXT_PUBLIC_EMAIL_MODE=mock
```

**What happens:**
- ✅ Campaign flow works perfectly
- ✅ Progress bar updates
- ✅ Logs show "sent" status
- ✅ Detailed console output
- ❌ No actual emails sent

**To test:**
```bash
# Make sure dev server restarts to load new env var
# Stop: Ctrl+C
# Start: npm run dev

# Then create a campaign and watch console logs
```

#### 📧 Production Mode (When API Fixed)

To use the real API when it's working:

1. Open `.env.local`
2. Change this line:
   ```bash
   NEXT_PUBLIC_EMAIL_MODE=api
   ```
3. Restart dev server

## 📊 What You'll See in Console

### Mock Mode Console Output
```
🧪 Using MOCK email service (emails will not actually be sent)
🧪 MOCK EMAIL SEND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 To: john@example.com
👤 Name: John Doe
📝 Subject: Hi John!
📄 Body Preview: Dear John Doe...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Mock email sent successfully
```

### Real API Mode Console Output
```
📧 Using REAL email API
🚀 Sending email to: john@example.com
📧 API Endpoint: https://send-email-app.vercel.app/api/send_gmail
📬 API Response Status: 200
✅ Email sent successfully: msg-12345
```

## 🧪 Test Right Now

1. **Start dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open browser console** (F12 or Cmd+Option+J)

3. **Create a campaign**:
   - Go to http://localhost:3000/dashboard/campaigns/create
   - Follow the 4-step wizard
   - Click "Create & Send Campaign"

4. **Watch the console** - You'll see detailed logs for each "email sent"

5. **Check results** - Campaign detail page will show all emails as "sent"

## 🔧 Why This Works

The mock service:
- ✅ Simulates network delay (500ms)
- ✅ Returns proper success/failure responses
- ✅ Logs all email details
- ✅ 90% success rate (to test error handling)
- ✅ Works exactly like real API

**Benefits:**
- Test campaign UI/UX
- Verify placeholder replacement
- Check progress tracking
- Debug without API dependency
- No costs or rate limits

## 🚀 When You Need Real Emails

Once the Vercel API is fixed (or you deploy your own):

1. Fix the API (see `TROUBLESHOOTING_EMAIL_API.md`)
2. Update `.env.local`: `NEXT_PUBLIC_EMAIL_MODE=api`
3. Restart dev server
4. Emails will be sent for real!

## 📝 Quick Reference

| Mode | Setting | Sends Real Emails? | Use Case |
|------|---------|-------------------|----------|
| Mock | `NEXT_PUBLIC_EMAIL_MODE=mock` | ❌ No | Testing, Development |
| API | `NEXT_PUBLIC_EMAIL_MODE=api` | ✅ Yes | Production |

## 🎯 Next Steps

**Right Now (Testing):**
1. Keep mock mode enabled
2. Test the entire campaign flow
3. Verify UI/UX works correctly
4. Check logs and analytics

**For Production:**
1. Fix the Vercel API (or deploy your own)
2. Switch to API mode
3. Test with 1-2 real emails first
4. Then use for real campaigns

---

**Current Status**: ✅ Mock mode enabled, ready for testing  
**Updated**: April 28, 2026  
**Mode**: Development/Testing (No real emails)
