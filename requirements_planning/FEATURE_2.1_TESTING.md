# Feature 2.1: Contact Management - Setup & Testing Guide

## Prerequisites

Before testing Feature 2.1, ensure:

1. ✅ **Feature 1.1 (Authentication)** is set up and working
2. ✅ Firebase project is configured
3. ✅ Environment variables in `.env.local` are set
4. ✅ Firestore security rules are deployed
5. ✅ Dev server is running (`npm run dev`)

## Deployment Steps

### Step 1: Deploy Firestore Security Rules

The security rules have been updated to support contacts as a subcollection. Deploy them to Firebase:

```bash
firebase deploy --only firestore:rules
```

**Verify**: In Firebase Console → Firestore Database → Rules, you should see:
```javascript
match /users/{userId} {
  // ... existing user rules ...
  
  match /contacts/{contactId} {
    allow read: if isAuthenticated() && isOwner(userId);
    allow create: if isAuthenticated() && isOwner(userId) && 
                     request.resource.data.userId == userId;
    allow update, delete: if isAuthenticated() && isOwner(userId);
  }
}
```

### Step 2: Restart Dev Server

If the dev server is running, restart it to pick up all new code:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 3: Build and Test

Run a production build to verify everything compiles:

```bash
npm run build
```

Expected output:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages
Route (app)                                 Size  First Load JS
├ ○ /dashboard/contacts                  3.08 kB         242 kB
├ ƒ /dashboard/contacts/[id]             1.93 kB         240 kB
```

## Testing Checklist

### Test 1: Access Contacts Page

1. **Login** to your account
2. Click **"CONTACTS"** in the header or **"Manage Contacts"** on the dashboard
3. **Expected**: You should see either:
   - Empty state with "No Contacts Yet" message (if no contacts exist)
   - Contact table with existing contacts

**✅ Pass Criteria**: Page loads without errors, empty state or table displays correctly

---

### Test 2: Create First Contact

1. Click **"+ Add Contact"** or **"Add Your First Contact"**
2. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Company: `Acme Corp`
3. Add a custom field:
   - Key: `Department`
   - Value: `Engineering`
   - Click **"Add"**
4. Add personalization notes: `Met at conference, interested in AI tools`
5. Click **"Add Contact"**

**Expected**:
- Success message: "Contact added successfully!"
- Modal closes
- Contact appears in the table
- Contact shows: John Doe, john.doe@example.com, Acme Corp

**✅ Pass Criteria**: Contact is created and visible in the table

---

### Test 3: Duplicate Email Validation

1. Click **"+ Add Contact"**
2. Try to add another contact with the same email:
   - First Name: `Jane`
   - Last Name: `Smith`
   - Email: `john.doe@example.com` (same as before)
3. Click **"Add Contact"**

**Expected**:
- Error message: "A contact with this email already exists"
- Contact is NOT created

**✅ Pass Criteria**: Duplicate email is rejected

---

### Test 4: Search Contacts

1. Add a few more contacts with different names and companies
2. In the search bar, type: `John`

**Expected**:
- Only contacts with "John" in first name, last name, email, or company are shown
- Contact count updates (e.g., "Showing 1 of 5 contacts")

3. Clear the search
4. Type: `acme`

**Expected**:
- Only contacts from "Acme Corp" are shown

**✅ Pass Criteria**: Search filters contacts correctly

---

### Test 5: Sort Contacts

1. Click the **"Name"** column header

**Expected**:
- Contacts sort alphabetically by first name (A-Z)
- Up arrow icon appears next to "Name"

2. Click **"Name"** again

**Expected**:
- Contacts reverse sort (Z-A)
- Down arrow icon appears

3. Click **"Date Added"**

**Expected**:
- Contacts sort by creation date (newest first by default)

**✅ Pass Criteria**: Sorting works for all columns

---

### Test 6: View Contact Details

1. Click on any contact row in the table

**Expected**:
- Navigate to `/dashboard/contacts/[id]`
- Shows contact's full information:
  - Name with initials avatar
  - Email and company
  - Custom fields section (if any)
  - Personalization notes (if any)
  - "Added on [date]"
  - Activity Log (placeholder for future)

**✅ Pass Criteria**: Detail page displays all contact information

---

### Test 7: Edit Contact

**From Table:**
1. Click the **pencil icon** (Edit) on any contact

**Expected**:
- Modal opens
- Form is pre-filled with contact data

2. Change the company to: `New Company Inc`
3. Click **"Save Changes"**

**Expected**:
- Success message: "Contact updated successfully!"
- Modal closes
- Table updates with new company name

**From Detail Page:**
1. Navigate to a contact detail page
2. Click **"Edit"** button
3. Make changes
4. Save

**Expected**:
- Same behavior as editing from table
- Detail page updates with new info

**✅ Pass Criteria**: Contact can be edited from both table and detail page

---

### Test 8: Delete Contact

**From Table:**
1. Click the **trash icon** (Delete) on any contact

**Expected**:
- Confirmation modal opens
- Shows contact name and email
- Warning message: "Are you sure you want to delete this contact? This action cannot be undone."

2. Click **"Cancel"**

**Expected**:
- Modal closes
- Contact is NOT deleted

3. Click **trash icon** again
4. Click **"Delete"**

**Expected**:
- Success message: "Contact deleted successfully!"
- Contact disappears from table
- Contact count decreases

**From Detail Page:**
1. Navigate to a contact detail page
2. Click **"Delete"** button
3. Confirm deletion

**Expected**:
- Contact is deleted
- Redirect to `/dashboard/contacts`

**✅ Pass Criteria**: Contact can be deleted with confirmation from both locations

---

### Test 9: Responsive Design

**Desktop (1920x1080):**
1. Resize browser to desktop size

**Expected**:
- Table shows all columns
- Modals are centered
- No horizontal scroll

**Tablet (768x1024):**
1. Resize browser to tablet size

**Expected**:
- Table remains readable
- Search bar stacks above "Add Contact" button
- Modals are responsive

**Mobile (375x667):**
1. Resize browser to mobile size

**Expected**:
- Table scrolls horizontally
- All buttons are reachable
- Modals fill most of the screen
- Forms are single column

**✅ Pass Criteria**: UI works on all screen sizes

---

### Test 10: Security & Permissions

**Test User Isolation:**
1. Login as User A
2. Create some contacts
3. Logout
4. Login as User B
5. Navigate to Contacts

**Expected**:
- User B sees empty state or only their own contacts
- User B CANNOT see User A's contacts

**Test Firestore Rules:**
1. Open browser DevTools → Console
2. Try to manually query another user's contacts:
```javascript
// This should FAIL
firebase.firestore()
  .collection('users')
  .doc('OTHER_USER_ID')
  .collection('contacts')
  .get()
```

**Expected**:
- Error: "Missing or insufficient permissions"

**✅ Pass Criteria**: Users can only access their own contacts

---

## Common Issues & Solutions

### Issue: "Firestore is not initialized"

**Cause**: Firebase not properly configured  
**Solution**:
1. Check `.env.local` has all Firebase credentials
2. Restart dev server
3. Clear browser cache

### Issue: Contacts not saving

**Cause**: Firestore rules not deployed  
**Solution**:
```bash
firebase deploy --only firestore:rules
```

### Issue: Modal not closing after save

**Cause**: JavaScript error or network issue  
**Solution**:
1. Check browser console for errors
2. Ensure good internet connection
3. Refresh page and try again

### Issue: Search returns no results

**Cause**: Case-sensitive search or special characters  
**Solution**: Search is case-insensitive and works with partial matches

### Issue: Table not updating after create/edit/delete

**Cause**: State not refreshing  
**Solution**: Refresh the page - if issue persists, check browser console

## Performance Testing

### Test with 100 Contacts

1. Create a script to add 100 test contacts
2. Test search performance
3. Test sort performance
4. Test pagination (if needed)

**Expected**: All operations should be instant (<100ms)

### Test with 1,000 Contacts

1. Import 1,000 contacts (via Firebase Console or script)
2. Test page load time
3. Test search performance

**Expected**: Page should load in <2 seconds, search in <200ms

## Browser Compatibility

Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## Accessibility Testing

1. **Keyboard Navigation**:
   - Tab through all form fields
   - Press Enter to submit forms
   - Press Escape to close modals

2. **Screen Reader**:
   - Use VoiceOver (Mac) or NVDA (Windows)
   - Verify all buttons and labels are announced

3. **Color Contrast**:
   - Check that all text meets WCAG AA standards
   - Gold accent (#FFC700) on black background = 10.35:1 (Pass)

**✅ Pass Criteria**: All functionality accessible via keyboard and screen reader

---

## Next Steps After Testing

Once testing is complete and all tests pass:

1. ✅ Mark Feature 2.1 as **"Production Ready"** in `IMPLEMENTATION_PLAN.md`
2. 📝 Document any bugs or issues found
3. 🚀 Deploy to production (optional)
4. ➡️ Move to Feature 2.2: Contact Import (CSV)

---

**Happy Testing! 🎉**

If you encounter any issues not covered here, check:
- Browser console for JavaScript errors
- Firebase Console → Firestore for data verification
- Network tab for failed API calls
