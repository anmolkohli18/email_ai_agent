# Feature 2.1: Contact Management - README

## Overview

The Contact Management feature allows users to create, view, edit, search, and delete contacts for their email campaigns. It's built with Firebase Firestore, Next.js 15, React 19, TypeScript, and Tailwind CSS, following the premium dark theme design system.

## Quick Start

### 1. Navigate to Contacts

Once logged in, access the contacts page in two ways:
- Click **"CONTACTS"** in the header navigation
- Click **"Manage Contacts"** on the Dashboard

### 2. Add a New Contact

1. Click the **"+ Add Contact"** button
2. Fill in the required fields:
   - First Name (required)
   - Last Name (required)
   - Email (required)
3. Optionally add:
   - Company
   - Custom Fields (key-value pairs)
   - Personalization Notes
4. Click **"Add Contact"**

### 3. Search Contacts

Use the search bar to find contacts by:
- First name
- Last name
- Email address
- Company name

### 4. Sort Contacts

Click any column header to sort:
- Name
- Email
- Company
- Date Added

Click again to reverse the sort order.

### 5. View Contact Details

Click any row in the contact table to see the full contact details.

### 6. Edit a Contact

From either the contacts table or detail page:
1. Click the **Edit** button (pencil icon)
2. Modify any fields
3. Click **"Save Changes"**

### 7. Delete a Contact

From either the contacts table or detail page:
1. Click the **Delete** button (trash icon)
2. Confirm deletion in the modal
3. Click **"Delete"** to permanently remove

## Features

### Contact Fields

**Required:**
- First Name
- Last Name
- Email

**Optional:**
- Company
- Custom Fields (unlimited key-value pairs)
- Personalization Notes

### Security

- All contacts are private to the user
- Firebase security rules prevent unauthorized access
- User can only see and modify their own contacts

### Validation

- Email format validation
- Duplicate email prevention
- Required field checking

### User Experience

- **Empty State**: Friendly message when no contacts exist
- **Search**: Real-time client-side search
- **Sort**: Click column headers to sort
- **Responsive**: Works on mobile, tablet, and desktop
- **Smooth Animations**: Premium transitions and hover effects
- **Success/Error Messages**: Clear feedback for all actions

## File Structure

```
/Users/akohli/Desktop/personal/email_agent/
├── app/
│   └── dashboard/
│       └── contacts/
│           ├── page.tsx                    # Main contacts page
│           └── [id]/
│               └── page.tsx                # Contact detail page
├── components/
│   └── contacts/
│       ├── ContactFormModal.tsx            # Add/Edit modal
│       ├── ContactTable.tsx                # Sortable table
│       ├── DeleteContactModal.tsx          # Delete confirmation
│       └── EmptyContactsState.tsx          # Empty state
├── lib/
│   └── firebase/
│       └── contacts.ts                     # Firestore operations
├── types/
│   └── contact.ts                          # TypeScript types
└── firestore.rules                         # Security rules
```

## Database Structure

Contacts are stored in Firestore as a subcollection under each user:

```
/users/{userId}/contacts/{contactId}
  - firstName: string
  - lastName: string
  - email: string
  - company?: string
  - customFields?: { [key: string]: string }
  - personalizationNotes?: string
  - createdAt: Timestamp
  - updatedAt: Timestamp
  - userId: string
```

## API Functions

All contact operations are in `lib/firebase/contacts.ts`:

```typescript
// Create a new contact
createContact(userId: string, contactData: ContactFormData): Promise<Result>

// Get all contacts (with optional sorting)
getContacts(userId: string, options?: SortOptions): Promise<Result>

// Get a single contact
getContact(userId: string, contactId: string): Promise<Result>

// Update a contact
updateContact(userId: string, contactId: string, updates: Partial<ContactFormData>): Promise<Result>

// Delete a contact
deleteContact(userId: string, contactId: string): Promise<Result>

// Search contacts by name, email, or company
searchContacts(userId: string, query: string): Promise<Result>

// Check for duplicate email
checkDuplicateEmail(userId: string, email: string, excludeContactId?: string): Promise<boolean>
```

## Component Props

### ContactFormModal

```typescript
{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
  contact?: Contact | null;
  mode: 'create' | 'edit';
}
```

### ContactTable

```typescript
{
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  loading?: boolean;
}
```

### DeleteContactModal

```typescript
{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  contact: Contact | null;
}
```

### EmptyContactsState

```typescript
{
  onAddContact: () => void;
}
```

## Troubleshooting

### "Firestore is not initialized"

**Cause**: Firebase config is missing or incorrect  
**Solution**: Ensure `.env.local` has all required Firebase credentials

### "A contact with this email already exists"

**Cause**: Duplicate email validation  
**Solution**: Each contact must have a unique email address

### Contacts not loading

**Cause**: Authentication issue or Firestore rules  
**Solution**: 
1. Ensure user is logged in
2. Check Firestore rules are deployed
3. Check browser console for errors

### Search not working

**Cause**: JavaScript disabled or rendering issue  
**Solution**: Enable JavaScript and refresh the page

## Performance Considerations

- **Client-side search**: Fast for < 10,000 contacts
- **For larger lists**: Consider implementing server-side search with Algolia or Firestore indexes
- **Lazy loading**: Not implemented yet (future enhancement for 50,000+ contacts)

## Future Enhancements

These features are planned for later releases:

- **Feature 2.2**: CSV import
- **Feature 2.3**: Contact lists (grouping contacts)
- Bulk delete
- Export contacts to CSV
- Tags/labels for contacts
- Contact merge (de-duplication)
- Contact activity tracking (emails sent, opens, clicks)

## Support

For issues or questions:
1. Check the `FEATURE_2.1_SUMMARY.md` for detailed implementation notes
2. Review the Firebase logs in the browser console
3. Ensure all Firebase credentials are configured correctly

---

**Feature Status**: ✅ Production Ready  
**Version**: 1.0  
**Last Updated**: April 27, 2026
