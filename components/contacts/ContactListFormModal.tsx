'use client';

import { useState, useEffect } from 'react';
import { ContactListFormData } from '@/types/contact';

interface ContactListFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ContactListFormData) => Promise<void>;
  list?: { id: string; name: string; description?: string } | null;
  mode: 'create' | 'edit';
}

export default function ContactListFormModal({
  isOpen,
  onClose,
  onSubmit,
  list,
  mode,
}: ContactListFormModalProps) {
  const [formData, setFormData] = useState<ContactListFormData>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && list) {
        setFormData({
          name: list.name,
          description: list.description || '',
        });
      } else {
        setFormData({
          name: '',
          description: '',
        });
      }
      setError('');
    }
  }, [isOpen, mode, list]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('List name is required');
      return;
    }

    if (formData.name.length > 100) {
      setError('List name must be less than 100 characters');
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save list');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl w-full max-w-lg">
        {/* Header */}
        <div className="p-8 border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">
              {mode === 'create' ? 'Create New List' : 'Edit List'}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
              disabled={loading}
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
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* List Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-white mb-2"
              >
                List Name <span className="text-[#FFC700]">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Enterprise Clients, Q1 Prospects"
                className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
                disabled={loading}
                maxLength={100}
              />
              <p className="text-neutral-500 text-xs mt-1">
                {formData.name.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-white mb-2"
              >
                Description <span className="text-neutral-500">(optional)</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Add notes about this list..."
                rows={4}
                className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors resize-none"
                disabled={loading}
                maxLength={500}
              />
              <p className="text-neutral-500 text-xs mt-1">
                {formData.description?.length || 0}/500 characters
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#232323] hover:bg-[#2A2A2A] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  {mode === 'create' ? 'Creating...' : 'Saving...'}
                </>
              ) : (
                <>{mode === 'create' ? 'Create List' : 'Save Changes'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
