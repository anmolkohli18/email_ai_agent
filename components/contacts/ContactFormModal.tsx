'use client';

import { useState, useEffect } from 'react';
import { Contact, ContactFormData } from '@/types/contact';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
  contact?: Contact | null;
  mode: 'create' | 'edit';
}

export default function ContactFormModal({
  isOpen,
  onClose,
  onSubmit,
  contact,
  mode,
}: ContactFormModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    customFields: {},
    personalizationNotes: '',
  });

  const [customFieldKey, setCustomFieldKey] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (contact && mode === 'edit') {
      setFormData({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        company: contact.company || '',
        customFields: contact.customFields || {},
        personalizationNotes: contact.personalizationNotes || '',
      });
    } else {
      // Reset form for create mode
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        customFields: {},
        personalizationNotes: '',
      });
    }
    setError('');
  }, [contact, mode, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomField = () => {
    if (!customFieldKey.trim() || !customFieldValue.trim()) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [customFieldKey]: customFieldValue,
      },
    }));

    setCustomFieldKey('');
    setCustomFieldValue('');
  };

  const handleRemoveCustomField = (key: string) => {
    setFormData((prev) => {
      const newCustomFields = { ...prev.customFields };
      delete newCustomFields[key];
      return { ...prev, customFields: newCustomFields };
    });
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save contact');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">
            {mode === 'create' ? 'Add New Contact' : 'Edit Contact'}
          </h2>
          <button
            onClick={onClose}
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

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-400 mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-400 mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-neutral-400 mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
              />
            </div>
          </div>

          {/* Custom Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Custom Fields</h3>
            
            {Object.entries(formData.customFields || {}).length > 0 && (
              <div className="space-y-2">
                {Object.entries(formData.customFields || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl"
                  >
                    <div className="flex-1">
                      <span className="text-neutral-400 text-sm">{key}:</span>{' '}
                      <span className="text-white">{value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(key)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Field name"
                value={customFieldKey}
                onChange={(e) => setCustomFieldKey(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
              />
              <input
                type="text"
                placeholder="Field value"
                value={customFieldValue}
                onChange={(e) => setCustomFieldValue(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
              />
              <button
                type="button"
                onClick={handleAddCustomField}
                className="px-6 py-3 bg-[#232323] hover:bg-[#2A2A2A] border border-[#2A2A2A] hover:border-[#FFC700] text-white rounded-xl transition-all duration-300"
              >
                Add
              </button>
            </div>
          </div>

          {/* Personalization Notes */}
          <div>
            <label htmlFor="personalizationNotes" className="block text-sm font-medium text-neutral-400 mb-2">
              Personalization Notes
            </label>
            <textarea
              id="personalizationNotes"
              name="personalizationNotes"
              value={formData.personalizationNotes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors resize-none"
              placeholder="Add any notes about this contact for email personalization..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-transparent border-2 border-[#2A2A2A] hover:border-[#FFC700] text-white rounded-full transition-all duration-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Add Contact' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
