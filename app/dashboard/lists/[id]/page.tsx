'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getContactListWithContacts,
  removeContactFromList,
  addContactsToList,
  removeContactsFromList,
} from '@/lib/firebase/contact-lists';
import { getContacts } from '@/lib/firebase/contacts';
import { ContactListWithContacts, Contact } from '@/types/contact';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ContactListDetailPage({ params }: PageProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [list, setList] = useState<ContactListWithContacts | null>(null);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Selection state
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    new Set()
  );
  const [isAddContactsModalOpen, setIsAddContactsModalOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load list and all contacts
  useEffect(() => {
    if (user) {
      loadList();
      loadAllContacts();
    }
  }, [user, params.id]);

  const loadList = async () => {
    if (!user) return;

    setLoading(true);
    const result = await getContactListWithContacts(user.uid, params.id);

    if (result.success && result.list) {
      setList(result.list);
    } else {
      setError(result.error || 'Failed to load list');
    }
    setLoading(false);
  };

  const loadAllContacts = async () => {
    if (!user) return;

    const result = await getContacts(user.uid);
    if (result.success && result.contacts) {
      setAllContacts(result.contacts);
    }
  };

  const handleSelectContact = (contactId: string) => {
    const newSelected = new Set(selectedContactIds);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContactIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedContactIds.size === list?.contacts.length) {
      setSelectedContactIds(new Set());
    } else {
      const allIds = new Set(list?.contacts.map((c) => c.id) || []);
      setSelectedContactIds(allIds);
    }
  };

  const handleRemoveSelected = async () => {
    if (!user || !list || selectedContactIds.size === 0) return;

    const result = await removeContactsFromList(
      user.uid,
      list.id,
      Array.from(selectedContactIds)
    );

    if (result.success) {
      setSuccessMessage(
        `Removed ${result.removed} contact${result.removed !== 1 ? 's' : ''}`
      );
      setSelectedContactIds(new Set());
      loadList();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(result.error || 'Failed to remove contacts');
    }
  };

  const handleAddContacts = async (contactIds: string[]) => {
    if (!user || !list) return;

    const result = await addContactsToList(user.uid, list.id, contactIds);

    if (result.success) {
      setSuccessMessage(
        `Added ${result.added} contact${result.added !== 1 ? 's' : ''}`
      );
      loadList();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(result.error || 'Failed to add contacts');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !list) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">
            {error || 'List not found'}
          </p>
          <Link
            href="/dashboard/lists"
            className="text-[#FFC700] hover:text-[#FFD700] transition-colors"
          >
            ← Back to Lists
          </Link>
        </div>
      </div>
    );
  }

  // Get contacts not in this list
  const contactsNotInList = allContacts.filter(
    (contact) => !list.contactIds.includes(contact.id)
  );

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard/lists"
            className="text-neutral-400 hover:text-[#FFC700] transition-colors flex items-center gap-2"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Lists
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
            {list.name}
          </h1>
          {list.description && (
            <p className="text-neutral-400 text-lg">{list.description}</p>
          )}
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#FFC700]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-white font-semibold">
                {list.contactCount} contact{list.contactCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-neutral-400 text-sm">
                Created {new Date(list.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
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
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedContactIds.size > 0 && (
              <>
                <span className="text-neutral-400">
                  {selectedContactIds.size} selected
                </span>
                <button
                  onClick={handleRemoveSelected}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-xl transition-colors border border-red-500/20"
                >
                  Remove Selected
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => setIsAddContactsModalOpen(true)}
            className="px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-xl transition-all duration-300"
          >
            + Add Contacts
          </button>
        </div>

        {/* Contacts Table */}
        {list.contacts.length === 0 ? (
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No contacts in this list
              </h3>
              <p className="text-neutral-400 mb-6">
                Add contacts to this list to use it in campaigns
              </p>
              <button
                onClick={() => setIsAddContactsModalOpen(true)}
                className="px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-xl transition-all duration-300"
              >
                Add Contacts
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#232323] border-b border-[#2A2A2A]">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedContactIds.size === list.contacts.length &&
                        list.contacts.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-5 h-5 rounded border-[#2A2A2A] bg-[#1A1A1A] text-[#FFC700] focus:ring-[#FFC700] focus:ring-offset-0"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {list.contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-[#232323] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedContactIds.has(contact.id)}
                        onChange={() => handleSelectContact(contact.id)}
                        className="w-5 h-5 rounded border-[#2A2A2A] bg-[#1A1A1A] text-[#FFC700] focus:ring-[#FFC700] focus:ring-offset-0"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/contacts/${contact.id}`}
                        className="text-white hover:text-[#FFC700] font-semibold transition-colors"
                      >
                        {contact.firstName} {contact.lastName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {contact.company || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={async () => {
                          const result = await removeContactFromList(
                            user.uid,
                            list.id,
                            contact.id
                          );
                          if (result.success) {
                            loadList();
                          }
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Contacts Modal */}
        {isAddContactsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">
                  Add Contacts to List
                </h3>
                <button
                  onClick={() => setIsAddContactsModalOpen(false)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Contact List */}
              <div className="flex-1 overflow-y-auto p-6">
                {contactsNotInList.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-neutral-400">
                      All contacts are already in this list
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {contactsNotInList.map((contact) => (
                      <label
                        key={contact.id}
                        className="flex items-center gap-3 p-4 bg-[#232323] hover:bg-[#2A2A2A] rounded-xl cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-[#2A2A2A] bg-[#1A1A1A] text-[#FFC700] focus:ring-[#FFC700] focus:ring-offset-0"
                          onChange={(e) => {
                            const newSelected = new Set(selectedContactIds);
                            if (e.target.checked) {
                              newSelected.add(contact.id);
                            } else {
                              newSelected.delete(contact.id);
                            }
                            setSelectedContactIds(newSelected);
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-white font-semibold">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-neutral-400 text-sm">
                            {contact.email}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-[#2A2A2A] flex gap-4">
                <button
                  onClick={() => {
                    setIsAddContactsModalOpen(false);
                    setSelectedContactIds(new Set());
                  }}
                  className="flex-1 px-6 py-3 bg-[#232323] hover:bg-[#2A2A2A] text-white font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleAddContacts(Array.from(selectedContactIds));
                    setIsAddContactsModalOpen(false);
                    setSelectedContactIds(new Set());
                  }}
                  disabled={selectedContactIds.size === 0}
                  className="flex-1 px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add {selectedContactIds.size > 0 && `(${selectedContactIds.size})`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
