'use client';

import { useState, useEffect } from 'react';
import { EmailTemplate, EmailTemplateFormData } from '@/types/email';
import { extractPlaceholders } from '@/lib/email/service';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmailTemplateFormData) => Promise<void>;
  template?: EmailTemplate | null;
  mode: 'create' | 'edit';
}

export default function TemplateEditorModal({
  isOpen,
  onClose,
  onSave,
  template,
  mode,
}: TemplateEditorModalProps) {
  const [formData, setFormData] = useState<EmailTemplateFormData>({
    name: '',
    subject: '',
    body: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [detectedPlaceholders, setDetectedPlaceholders] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && template) {
        setFormData({
          name: template.name,
          subject: template.subject,
          body: template.body,
        });
      } else {
        setFormData({
          name: '',
          subject: '',
          body: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, template]);

  // Auto-detect placeholders
  useEffect(() => {
    const subjectPlaceholders = extractPlaceholders(formData.subject);
    const bodyPlaceholders = extractPlaceholders(formData.body);
    const all = Array.from(new Set([...subjectPlaceholders, ...bodyPlaceholders]));
    setDetectedPlaceholders(all);
  }, [formData.subject, formData.body]);

  const handleChange = (field: keyof EmailTemplateFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const insertPlaceholder = (placeholder: string) => {
    setFormData(prev => ({
      ...prev,
      body: prev.body + `{{${placeholder}}}`,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.body.trim()) {
      newErrors.body = 'Email body is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save template' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 max-w-4xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            {mode === 'create' ? 'Create New Template' : 'Edit Template'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-[#232323] rounded-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Product Launch Email"
              className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Subject Line
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="e.g., Hi {{firstName}}, check out our new product!"
              className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
            )}
          </div>

          {/* Email Body */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-white">
                Email Body
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => insertPlaceholder('firstName')}
                  className="px-3 py-1 bg-[#FFC700]/10 hover:bg-[#FFC700]/20 text-[#FFC700] text-xs rounded-lg transition-all"
                >
                  + firstName
                </button>
                <button
                  type="button"
                  onClick={() => insertPlaceholder('lastName')}
                  className="px-3 py-1 bg-[#FFC700]/10 hover:bg-[#FFC700]/20 text-[#FFC700] text-xs rounded-lg transition-all"
                >
                  + lastName
                </button>
                <button
                  type="button"
                  onClick={() => insertPlaceholder('company')}
                  className="px-3 py-1 bg-[#FFC700]/10 hover:bg-[#FFC700]/20 text-[#FFC700] text-xs rounded-lg transition-all"
                >
                  + company
                </button>
              </div>
            </div>
            <textarea
              value={formData.body}
              onChange={(e) => handleChange('body', e.target.value)}
              placeholder="Write your email body here. Use {{placeholders}} for personalization..."
              rows={12}
              className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors resize-none font-mono text-sm"
            />
            {errors.body && (
              <p className="mt-1 text-sm text-red-400">{errors.body}</p>
            )}
            <p className="mt-2 text-xs text-neutral-500">
              You can use HTML tags for formatting. Placeholders will be replaced with actual contact data when sending.
            </p>
          </div>

          {/* Detected Placeholders */}
          {detectedPlaceholders.length > 0 && (
            <div className="p-4 bg-[#232323] rounded-xl">
              <p className="text-sm font-semibold text-white mb-2">
                Detected Placeholders:
              </p>
              <div className="flex flex-wrap gap-2">
                {detectedPlaceholders.map((placeholder) => (
                  <span
                    key={placeholder}
                    className="px-3 py-1 bg-[#FFC700]/10 text-[#FFC700] text-xs rounded-lg"
                  >
                    {`{{${placeholder}}}`}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                These placeholders will be automatically filled with contact data
              </p>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-[#232323] hover:bg-[#2A2A2A] text-white font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {saving ? 'Saving...' : mode === 'create' ? 'Create Template' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
