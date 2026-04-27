'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import { getContact, updateContact, deleteContact } from '@/lib/firebase/contacts';
import { Contact, ContactFormData } from '@/types/contact';
import ContactFormModal from '@/components/contacts/ContactFormModal';
import DeleteContactModal from '@/components/contacts/DeleteContactModal';

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const contactId = params.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && contactId) {
      loadContact();
    }
  }, [user, contactId]);

  const loadContact = async () => {
    if (!user) return;

    setLoading(true);
    const result = await getContact(user.uid, contactId);

    if (result.success && result.contact) {
      setContact(result.contact);
    } else {
      setError(result.error || 'Contact not found');
    }
    setLoading(false);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (formData: ContactFormData) => {
    if (!user || !contact) return;

    const result = await updateContact(user.uid, contact.id, formData);
    if (result.success) {
      setSuccessMessage('Contact updated successfully!');
      loadContact();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(result.error || 'Failed to update contact');
      throw new Error(result.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!user || !contact) return;

    const result = await deleteContact(user.uid, contact.id);
    if (result.success) {
      router.push('/dashboard/contacts');
    } else {
      setError(result.error || 'Failed to delete contact');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 text-lg mb-4">{error || 'Contact not found'}</p>
          <button
            onClick={() => router.push('/dashboard/contacts')}
            className="px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-semibold rounded-full transition-all duration-300"
          >
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard/contacts')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Contacts
        </button>

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

        {/* Header */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#FFC700]/10 rounded-2xl flex items-center justify-center">
                <span className="text-[#FFC700] text-3xl font-bold">
                  {contact.firstName[0]}{contact.lastName[0]}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {contact.firstName} {contact.lastName}
                </h1>
                <p className="text-neutral-400">{contact.email}</p>
                {contact.company && (
                  <p className="text-neutral-500 text-sm mt-1">{contact.company}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleEdit}
                className="px-6 py-3 bg-[#232323] hover:bg-[#2A2A2A] border border-[#2A2A2A] hover:border-[#FFC700] text-white rounded-full transition-all duration-300"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-full transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="text-sm text-neutral-500">
            Added on {new Date(contact.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Custom Fields */}
          {contact.customFields && Object.keys(contact.customFields).length > 0 && (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Custom Fields</h2>
              <div className="space-y-4">
                {Object.entries(contact.customFields).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#FFC700] rounded-full mt-2"></div>
                    <div>
                      <p className="text-neutral-400 text-sm">{key}</p>
                      <p className="text-white font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personalization Notes */}
          {contact.personalizationNotes && (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Personalization Notes</h2>
              <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {contact.personalizationNotes}
              </p>
            </div>
          )}

          {/* Placeholder for empty states */}
          {(!contact.customFields || Object.keys(contact.customFields).length === 0) &&
            !contact.personalizationNotes && (
            <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-12 text-center">
              <p className="text-neutral-400">
                No additional information available. Click Edit to add custom fields or personalization notes.
              </p>
            </div>
          )}
        </div>

        {/* Activity Log (Future Feature) */}
        <div className="mt-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Activity Log</h2>
          <div className="text-center py-8">
            <p className="text-neutral-500">
              Email campaign activity will appear here once campaigns are sent.
            </p>
          </div>
        </div>

        {/* Modals */}
        <ContactFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          contact={contact}
          mode="edit"
        />

        <DeleteContactModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          contact={contact}
        />
      </div>
    </div>
  );
}
