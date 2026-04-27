'use client';

import { useState } from 'react';
import { Contact } from '@/types/contact';

interface DeleteContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  contact: Contact | null;
}

export default function DeleteContactModal({
  isOpen,
  onClose,
  onConfirm,
  contact,
}: DeleteContactModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting contact:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 w-full max-w-md">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Delete Contact?
          </h2>
          <p className="text-neutral-400 text-center">
            Are you sure you want to delete this contact? This action cannot be undone.
          </p>
        </div>

        <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4 mb-6">
          <p className="text-white font-semibold">
            {contact.firstName} {contact.lastName}
          </p>
          <p className="text-neutral-400 text-sm">{contact.email}</p>
          {contact.company && (
            <p className="text-neutral-500 text-sm">{contact.company}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-transparent border-2 border-[#2A2A2A] hover:border-[#FFC700] text-white rounded-full transition-all duration-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
