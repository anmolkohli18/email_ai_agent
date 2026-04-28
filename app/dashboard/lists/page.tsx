'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getContactLists,
  createContactList,
  updateContactList,
  deleteContactList,
} from '@/lib/firebase/contact-lists';
import { ContactList, ContactListFormData } from '@/types/contact';
import ContactListFormModal from '@/components/contacts/ContactListFormModal';

export default function ContactListsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [lists, setLists] = useState<ContactList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedList, setSelectedList] = useState<ContactList | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load lists
  useEffect(() => {
    if (user) {
      loadLists();
    }
  }, [user]);

  const loadLists = async () => {
    if (!user) return;

    setLoading(true);
    const result = await getContactLists(user.uid);

    if (result.success && result.lists) {
      setLists(result.lists);
    } else {
      setError(result.error || 'Failed to load lists');
    }
    setLoading(false);
  };

  const handleCreateList = () => {
    setSelectedList(null);
    setModalMode('create');
    setIsFormModalOpen(true);
  };

  const handleEditList = (list: ContactList) => {
    setSelectedList(list);
    setModalMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDeleteList = (list: ContactList) => {
    setSelectedList(list);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData: ContactListFormData) => {
    if (!user) return;

    setError('');
    setSuccessMessage('');

    if (modalMode === 'create') {
      const result = await createContactList(user.uid, formData);
      if (result.success) {
        setSuccessMessage('List created successfully!');
        loadLists();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Failed to create list');
        throw new Error(result.error);
      }
    } else {
      if (!selectedList) return;

      const result = await updateContactList(user.uid, selectedList.id, formData);
      if (result.success) {
        setSuccessMessage('List updated successfully!');
        loadLists();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Failed to update list');
        throw new Error(result.error);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!user || !selectedList) return;

    const result = await deleteContactList(user.uid, selectedList.id);
    if (result.success) {
      setSuccessMessage('List deleted successfully!');
      setIsDeleteModalOpen(false);
      loadLists();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(result.error || 'Failed to delete list');
    }
  };

  if (authLoading || loading) {
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
            Contact Lists
          </h1>
          <p className="text-neutral-400 text-lg">
            Organize your contacts into lists for targeted campaigns
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

        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-neutral-400">
            {lists.length} list{lists.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={handleCreateList}
            className="px-8 py-4 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-[#FFC700]/20"
          >
            + Create List
          </button>
        </div>

        {/* Lists Grid or Empty State */}
        {lists.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-[#232323] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No lists yet
              </h3>
              <p className="text-neutral-400 mb-6">
                Create your first contact list to organize contacts for campaigns
              </p>
              <button
                onClick={handleCreateList}
                className="px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-xl transition-all duration-300"
              >
                Create Your First List
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <div
                key={list.id}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 hover:border-[#FFC700]/30 transition-all duration-300 group"
              >
                {/* List Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFC700] transition-colors">
                      {list.name}
                    </h3>
                    {list.description && (
                      <p className="text-neutral-400 text-sm line-clamp-2">
                        {list.description}
                      </p>
                    )}
                  </div>

                  {/* Actions Dropdown */}
                  <div className="relative group/menu">
                    <button className="p-2 text-neutral-400 hover:text-white transition-colors">
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
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                    <div className="hidden group-hover/menu:block absolute right-0 mt-2 w-48 bg-[#232323] border border-[#2A2A2A] rounded-xl shadow-lg overflow-hidden z-10">
                      <button
                        onClick={() => handleEditList(list)}
                        className="w-full px-4 py-3 text-left text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteList(list)}
                        className="w-full px-4 py-3 text-left text-red-400 hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contact Count */}
                <div className="mb-4 p-4 bg-[#232323] rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">Contacts</span>
                    <span className="text-2xl font-bold text-[#FFC700]">
                      {list.contactCount}
                    </span>
                  </div>
                </div>

                {/* View List Button */}
                <Link
                  href={`/dashboard/lists/${list.id}`}
                  className="block w-full px-4 py-3 bg-[#232323] hover:bg-[#2A2A2A] text-white text-center font-semibold rounded-xl transition-all duration-300 border border-transparent hover:border-[#FFC700]/30"
                >
                  View List →
                </Link>

                {/* Created Date */}
                <p className="mt-4 text-neutral-500 text-xs text-center">
                  Created {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        <ContactListFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          list={selectedList}
          mode={modalMode}
        />

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedList && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl w-full max-w-md p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  Delete List?
                </h3>
                <p className="text-neutral-400 text-center">
                  Are you sure you want to delete <strong className="text-white">{selectedList.name}</strong>? This action cannot be undone.
                </p>
                <p className="text-neutral-500 text-sm text-center mt-2">
                  Note: Contacts in this list will not be deleted.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-[#232323] hover:bg-[#2A2A2A] text-white font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
                >
                  Delete List
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
