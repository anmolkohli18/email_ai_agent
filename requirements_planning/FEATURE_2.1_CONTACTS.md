# Feature 2.1: Contact Management

## Overview
Build a complete contact management system that allows users to create, view, edit, and delete contacts. This is the foundation for all email personalization and campaign features.

## Technical Stack
- **Frontend**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore for data storage
- **Auth**: Firebase Auth (already implemented in Feature 1.1)

## Database Schema

### Firestore Collection: `/users/{userId}/contacts`

```typescript
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  customFields?: Record<string, string>;
  personalizationNotes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string; // Reference to the owner
}
```

## Security Rules (Firestore)

```javascript
// Contacts collection
match /users/{userId}/contacts/{contactId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  allow create: if request.auth != null && request.auth.uid == userId 
                && request.resource.data.userId == userId;
}
```

## UI Components

### 1. Contacts Page (`/app/dashboard/contacts/page.tsx`)
- **Purpose**: Main contact management page
- **Features**:
  - Data table with all contacts
  - Search functionality (by name, email, company)
  - Filter by custom fields
  - Sort by name, email, company, date added
  - Pagination
  - "Add Contact" button
  - Bulk actions (future: delete multiple)
  - Empty state when no contacts exist

### 2. Contact Table Component (`/components/contacts/ContactTable.tsx`)
- **Columns**:
  - Checkbox (for bulk selection)
  - Name (firstName + lastName)
  - Email
  - Company
  - Date Added
  - Actions (Edit, Delete)
- **Features**:
  - Sortable columns
  - Row hover states
  - Action buttons (Edit/Delete icons)

### 3. Add/Edit Contact Modal (`/components/contacts/ContactFormModal.tsx`)
- **Fields**:
  - First Name (required)
  - Last Name (required)
  - Email (required, validated)
  - Company (optional)
  - Custom Fields (key-value pairs, dynamic add/remove)
  - Personalization Notes (textarea)
- **Actions**:
  - Save
  - Cancel
- **Validation**:
  - Email format validation
  - Required field validation
  - Duplicate email check

### 4. Contact Detail View (`/app/dashboard/contacts/[id]/page.tsx`)
- **Purpose**: View and edit a single contact's full details
- **Sections**:
  - Contact Info card
  - Custom Fields card
  - Personalization Notes card
  - Activity log (future: emails sent to this contact)
- **Actions**:
  - Edit button (opens modal)
  - Delete button (with confirmation)
  - Back to contacts list

### 5. Delete Confirmation Modal (`/components/contacts/DeleteContactModal.tsx`)
- **Content**:
  - Warning message
  - Contact name and email
  - Confirm/Cancel buttons

## API/Service Functions (`/lib/firebase/contacts.ts`)

```typescript
// Create a new contact
export async function createContact(userId: string, contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact>

// Get all contacts for a user
export async function getContacts(userId: string): Promise<Contact[]>

// Get a single contact by ID
export async function getContact(userId: string, contactId: string): Promise<Contact | null>

// Update a contact
export async function updateContact(userId: string, contactId: string, updates: Partial<Contact>): Promise<void>

// Delete a contact
export async function deleteContact(userId: string, contactId: string): Promise<void>

// Search contacts
export async function searchContacts(userId: string, query: string): Promise<Contact[]>

// Check for duplicate email
export async function checkDuplicateEmail(userId: string, email: string, excludeContactId?: string): Promise<boolean>
```

## TypeScript Types (`/types/contact.ts`)

```typescript
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  customFields?: Record<string, string>;
  personalizationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  customFields?: Record<string, string>;
  personalizationNotes?: string;
}
```

## Navigation Updates

### Update Header Navigation
- Add "Contacts" link to header navigation (for authenticated users)

### Update Dashboard
- Add "Contacts" card/link to dashboard home

## File Structure

```
/Users/akohli/Desktop/personal/email_agent/
├── app/
│   └── dashboard/
│       └── contacts/
│           ├── page.tsx (Contact list page)
│           └── [id]/
│               └── page.tsx (Contact detail page)
├── components/
│   └── contacts/
│       ├── ContactTable.tsx
│       ├── ContactFormModal.tsx
│       ├── DeleteContactModal.tsx
│       ├── ContactCard.tsx
│       └── EmptyContactsState.tsx
├── lib/
│   └── firebase/
│       └── contacts.ts (Firestore operations)
├── types/
│   └── contact.ts
└── firestore.rules (update with contact rules)
```

## Implementation Checklist

### Phase 1: Backend Setup
- [ ] Create `/types/contact.ts` with TypeScript interfaces
- [ ] Create `/lib/firebase/contacts.ts` with Firestore operations
- [ ] Update `firestore.rules` with contact security rules
- [ ] Deploy security rules to Firebase

### Phase 2: UI Components
- [ ] Create `ContactFormModal.tsx` (Add/Edit contact form)
- [ ] Create `ContactTable.tsx` (Table with search/sort)
- [ ] Create `DeleteContactModal.tsx` (Delete confirmation)
- [ ] Create `ContactCard.tsx` (Detail view component)
- [ ] Create `EmptyContactsState.tsx` (No contacts placeholder)

### Phase 3: Pages
- [ ] Create `/app/dashboard/contacts/page.tsx` (Main contacts page)
- [ ] Create `/app/dashboard/contacts/[id]/page.tsx` (Contact detail page)

### Phase 4: Navigation
- [ ] Update `Header.tsx` to add Contacts link
- [ ] Update `Dashboard.tsx` to add Contacts card

### Phase 5: Testing
- [ ] Test create contact
- [ ] Test edit contact
- [ ] Test delete contact
- [ ] Test search functionality
- [ ] Test duplicate email validation
- [ ] Test empty state
- [ ] Test responsive design

## Design Guidelines

Follow the design system in `.cursor/rules/design.mdc`:
- **Background**: `#0D0D0D`
- **Surface**: `#1A1A1A`
- **Surface Elevated**: `#232323`
- **Accent Gold**: `#FFC700`
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#A3A3A3`
- **Border**: `#2A2A2A`

Use:
- Large rounded corners (`rounded-3xl`)
- Bold typography
- Generous padding and whitespace
- Smooth transitions
- Gold accents for CTAs

## Success Criteria

- ✅ User can create a new contact with all fields
- ✅ User can view all their contacts in a table
- ✅ User can search contacts by name, email, or company
- ✅ User can edit any contact
- ✅ User can delete a contact with confirmation
- ✅ Duplicate email validation works
- ✅ UI follows the premium dark theme design system
- ✅ All operations are secure (user can only access their own contacts)
- ✅ Responsive design works on mobile and desktop

## Future Enhancements (Not in this feature)
- Bulk delete
- Export contacts to CSV
- Tags/categories for contacts
- Contact import from CSV (Feature 2.2)
- Contact lists (Feature 2.3)
