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

export interface ContactFilters {
  search?: string;
  sortBy?: 'firstName' | 'lastName' | 'email' | 'company' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  contactIds: string[];
  contactCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ContactListFormData {
  name: string;
  description?: string;
}

export interface ContactListWithContacts extends ContactList {
  contacts: Contact[];
}
