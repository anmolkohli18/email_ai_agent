'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import {
  getEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
} from '@/lib/firebase/email-templates';
import { EmailTemplate, EmailTemplateFormData } from '@/types/email';
import TemplateEditorModal from '@/components/templates/TemplateEditorModal';

export default function EmailTemplatesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load templates
  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user]);

  const loadTemplates = async () => {
    if (!user) return;

    setLoading(true);
    const result = await getEmailTemplates(user.uid);

    if (result.success && result.templates) {
      setTemplates(result.templates);
    } else {
      setError(result.error || 'Failed to load templates');
    }
    setLoading(false);
  };

  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData: EmailTemplateFormData) => {
    if (!user) return;

    setError('');
    setSuccessMessage('');

    if (modalMode === 'create') {
      const result = await createEmailTemplate(user.uid, formData);
      if (result.success) {
        setSuccessMessage('Template created successfully!');
        loadTemplates();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Failed to create template');
        throw new Error(result.error);
      }
    } else {
      if (!selectedTemplate) return;

      const result = await updateEmailTemplate(user.uid, selectedTemplate.id, formData);
      if (result.success) {
        setSuccessMessage('Template updated successfully!');
        loadTemplates();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.error || 'Failed to update template');
        throw new Error(result.error);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!user || !selectedTemplate) return;

    const result = await deleteEmailTemplate(user.uid, selectedTemplate.id);
    if (result.success) {
      setSuccessMessage('Template deleted successfully!');
      loadTemplates();
      setIsDeleteModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(result.error || 'Failed to delete template');
    }
  };

  if (authLoading || (loading && templates.length === 0)) {
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
            Email Templates
          </h1>
          <p className="text-neutral-400 text-lg">
            Create reusable email templates with placeholders for personalization
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
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddTemplate}
            className="px-8 py-4 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-[#FFC700]/20"
          >
            + Create Template
          </button>
        </div>

        {/* Templates Grid */}
        {templates.length === 0 && !loading ? (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl py-20 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-neutral-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-2">
                No templates yet
              </h3>
              <p className="text-neutral-400 mb-6">
                Create your first email template to get started with campaigns
              </p>
              <button
                onClick={handleAddTemplate}
                className="px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-semibold rounded-xl transition-all duration-300"
              >
                Create Your First Template
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 hover:border-[#FFC700]/30 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white truncate flex-1">
                    {template.name}
                  </h3>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="p-2 text-neutral-400 hover:text-[#FFC700] hover:bg-[#FFC700]/10 rounded-lg transition-all"
                      title="Edit template"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template)}
                      className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      title="Delete template"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-neutral-500 mb-1">Subject:</p>
                  <p className="text-neutral-300 truncate">{template.subject}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-neutral-500 mb-1">Preview:</p>
                  <p className="text-neutral-400 text-sm line-clamp-3">
                    {template.body.replace(/<[^>]*>/g, '')}
                  </p>
                </div>

                {template.placeholders.length > 0 && (
                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Placeholders:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.placeholders.slice(0, 5).map((placeholder) => (
                        <span
                          key={placeholder}
                          className="px-2 py-1 bg-[#FFC700]/10 text-[#FFC700] text-xs rounded-lg"
                        >
                          {`{{${placeholder}}}`}
                        </span>
                      ))}
                      {template.placeholders.length > 5 && (
                        <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded-lg">
                          +{template.placeholders.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-[#2A2A2A] text-xs text-neutral-500">
                  Created {new Date(template.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Template Editor Modal */}
        <TemplateEditorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleFormSubmit}
          template={selectedTemplate}
          mode={modalMode}
        />

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedTemplate && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-4">
                Delete Template?
              </h3>
              <p className="text-neutral-400 mb-6">
                Are you sure you want to delete &ldquo;{selectedTemplate.name}&rdquo;? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-[#232323] hover:bg-[#2A2A2A] text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
