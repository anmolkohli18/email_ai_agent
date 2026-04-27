'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
  bulkCreateContacts,
} from '@/lib/firebase/contacts';
import { Contact, ContactFormData } from '@/types/contact';
import ContactTable from '@/components/contacts/ContactTable';
import ContactFormModal from '@/components/contacts/ContactFormModal';
import DeleteContactModal from '@/components/contacts/DeleteContactModal';
import EmptyContactsState from '@/components/contacts/EmptyContactsState';
import CSVImportModal from '@/components/contacts/CSVImportModal';

export default function ContactsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Error and success states
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load contacts
  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  // Search/filter contacts
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  const loadContacts = async () => {
    if (!user) return;

    setLoading(true);
    const result = await getContacts(user.uid);

    if (result.success && result.contacts) {
      setContacts(result.contacts);
      setFilteredContacts(result.contacts);
    } else {
      setError(result.error || 'Failed to load contacts');
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!user) return;

    const result = await searchContacts(user.uid, searchQuery);
    if (result.success && result.contacts) {
      setFilteredContacts(result.contacts);
    }
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setModalMode('create');
    setIsFormModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setModalMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDeleteContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData: ContactFormData) => {
    if (!user) return;

    setError('');
    setSuccessMessage('');

    if (modalMode === 'create') {
      const result = await createContact(user.uid, formData);
      if (result.success) {
        setSuccessMessage('Contact added successfully!');
        loadContacts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Failed to create contact');
        throw new Error(result.error);
      }
    } else {
      if (!selectedContact) return;

      const result = await updateContact(user.uid, selectedContact.id, formData);
      if (result.success) {
        setSuccessMessage('Contact updated successfully!');
        loadContacts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Failed to update contact');
        throw new Error(result.error);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!user || !selectedContact) return;

    const result = await deleteContact(user.uid, selectedContact.id);
    if (result.success) {
      setSuccessMessage('Contact deleted successfully!');
      loadContacts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(result.error || 'Failed to delete contact');
    }
  };

  const handleImportContacts = async (contactsToImport: ContactFormData[]) => {
    if (!user) return;

    setError('');
    setSuccessMessage('');

    const result = await bulkCreateContacts(user.uid, contactsToImport);

    if (result.success && result.created && result.created > 0) {
      let message = `Successfully imported ${result.created} contact${result.created > 1 ? 's' : ''}`;
      if (result.skipped && result.skipped > 0) {
        message += `, skipped ${result.skipped} duplicate${result.skipped > 1 ? 's' : ''}`;
      }
      setSuccessMessage(message);
      loadContacts();
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      setError(
        result.errors?.[0] || 'Failed to import contacts. All emails may already exist.'
      );
    }
  };

  if (authLoading || (loading && contacts.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
            Contacts
          </h1>
          <p className="text-neutral-400 text-lg">
            Manage your contact list for personalized email campaigns
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
            <p className="text-green-400">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Main Content */}
        {contacts.length === 0 && !loading ? (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl">
            <EmptyContactsState onAddContact={handleAddContact} />
          </div>
        ) : (
          <>
            {/* Search and Actions Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search contacts by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-6 py-4 bg-[#232323] hover:bg-[#2A2A2A] text-white font-semibold rounded-2xl transition-all duration-300 border border-[#2A2A2A] hover:border-[#FFC700]/30 whitespace-nowrap flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Import CSV
              </button>
              <button
                onClick={handleAddContact}
                className="px-8 py-4 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-[#FFC700]/20 whitespace-nowrap"
              >
                + Add Contact
              </button>
            </div>

            {/* Contacts Table */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl overflow-hidden">
              {filteredContacts.length === 0 && searchQuery ? (
                <div className="py-20 text-center">
                  <p className="text-neutral-400 text-lg">
                    No contacts found matching &ldquo;{searchQuery}&rdquo;
                  </p>
                </div>
              ) : (
                <ContactTable
                  contacts={filteredContacts}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  loading={loading}
                />
              )}
            </div>

            {/* Contact Count */}
            <div className="mt-4 text-center text-neutral-500 text-sm">
              Showing {filteredContacts.length} of {contacts.length} contacts
            </div>
          </>
        )}

        {/* Modals */}
        <ContactFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          contact={selectedContact}
          mode={modalMode}
        />

        <DeleteContactModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          contact={selectedContact}
        />

        <CSVImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImportContacts}
        />
      </div>
    </div>
  );
}
