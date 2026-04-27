'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import { getContacts } from '@/lib/firebase/contacts';
import { getEmailTemplates } from '@/lib/firebase/email-templates';
import { createEmailCampaign } from '@/lib/firebase/email-campaigns';
import { sendCampaignEmails } from '@/lib/email/send-campaign';
import { Contact } from '@/types/contact';
import { EmailTemplate } from '@/types/email';
import { previewEmail } from '@/lib/email/service';

export default function CreateCampaignPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1); // 1: Details, 2: Select Template, 3: Select Contacts, 4: Review
  const [campaignName, setCampaignName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ sent: 0, total: 0 });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    const [templatesResult, contactsResult] = await Promise.all([
      getEmailTemplates(user.uid),
      getContacts(user.uid),
    ]);

    if (templatesResult.success && templatesResult.templates) {
      setTemplates(templatesResult.templates);
    }
    if (contactsResult.success && contactsResult.contacts) {
      setContacts(contactsResult.contacts);
    }
    setLoading(false);
  };

  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase();
    return (
      contact.firstName.toLowerCase().includes(query) ||
      contact.lastName.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.company?.toLowerCase().includes(query)
    );
  });

  const handleNext = () => {
    if (step === 1 && !campaignName.trim()) {
      setError('Please enter a campaign name');
      return;
    }
    if (step === 2 && !selectedTemplate) {
      setError('Please select a template');
      return;
    }
    if (step === 3 && selectedContactIds.length === 0) {
      setError('Please select at least one contact');
      return;
    }
    
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const toggleContact = (contactId: string) => {
    setSelectedContactIds(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleAllContacts = () => {
    if (selectedContactIds.length === filteredContacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(filteredContacts.map(c => c.id));
    }
  };

  const handleCreateAndSend = async () => {
    if (!user || !selectedTemplate) return;

    setSending(true);
    setError('');

    try {
      // Create campaign
      const campaignResult = await createEmailCampaign(user.uid, {
        name: campaignName,
        templateId: selectedTemplate.id,
        contactIds: selectedContactIds,
      });

      if (!campaignResult.success || !campaignResult.campaign) {
        throw new Error(campaignResult.error || 'Failed to create campaign');
      }

      // Send emails
      const sendResult = await sendCampaignEmails({
        userId: user.uid,
        campaignId: campaignResult.campaign.id,
        template: selectedTemplate,
        contactIds: selectedContactIds,
        onProgress: (sent, total) => {
          setSendProgress({ sent, total });
        },
      });

      if (sendResult.success) {
        router.push(`/dashboard/campaigns/${campaignResult.campaign.id}?success=true`);
      } else {
        throw new Error('Failed to send some emails');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create and send campaign');
      setSending(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const selectedContacts = contacts.filter(c => selectedContactIds.includes(c.id));

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
            Create Campaign
          </h1>
          <p className="text-neutral-400 text-lg">
            Step {step} of 4
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {['Details', 'Template', 'Contacts', 'Review'].map((label, idx) => (
              <span
                key={label}
                className={`text-sm font-semibold ${
                  idx + 1 <= step ? 'text-[#FFC700]' : 'text-neutral-600'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FFC700] transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8">
          {/* Step 1: Campaign Details */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Campaign Details</h2>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Product Launch - Q1 2026"
                  className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
                />
              </div>
            </div>
          )}

          {/* Step 2: Select Template */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Select Email Template</h2>
              {templates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-400 mb-4">No templates available</p>
                  <button
                    onClick={() => router.push('/dashboard/templates')}
                    className="px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-semibold rounded-xl transition-all"
                  >
                    Create Template First
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${
                        selectedTemplate?.id === template.id
                          ? 'border-[#FFC700] bg-[#FFC700]/5'
                          : 'border-[#2A2A2A] hover:border-[#FFC700]/30'
                      }`}
                    >
                      <h3 className="text-lg font-bold text-white mb-2">{template.name}</h3>
                      <p className="text-sm text-neutral-400 mb-3 truncate">
                        {template.subject}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.placeholders.slice(0, 3).map((p) => (
                          <span
                            key={p}
                            className="px-2 py-1 bg-[#FFC700]/10 text-[#FFC700] text-xs rounded"
                          >
                            {`{{${p}}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Select Contacts */}
          {step === 3 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Select Recipients</h2>
                <button
                  onClick={toggleAllContacts}
                  className="text-sm text-[#FFC700] hover:underline"
                >
                  {selectedContactIds.length === filteredContacts.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts..."
                  className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => toggleContact(contact.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      selectedContactIds.includes(contact.id)
                        ? 'border-[#FFC700] bg-[#FFC700]/5'
                        : 'border-[#2A2A2A] hover:border-[#FFC700]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-sm text-neutral-400">{contact.email}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedContactIds.includes(contact.id)}
                        onChange={() => {}}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm text-neutral-500">
                {selectedContactIds.length} contact{selectedContactIds.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Step 4: Review and Send */}
          {step === 4 && selectedTemplate && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Review & Send</h2>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Campaign Name</p>
                  <p className="text-white font-semibold">{campaignName}</p>
                </div>

                <div>
                  <p className="text-sm text-neutral-500 mb-1">Template</p>
                  <p className="text-white font-semibold">{selectedTemplate.name}</p>
                  <p className="text-sm text-neutral-400">{selectedTemplate.subject}</p>
                </div>

                <div>
                  <p className="text-sm text-neutral-500 mb-1">Recipients</p>
                  <p className="text-white font-semibold">{selectedContactIds.length} contacts</p>
                </div>

                {selectedContacts.length > 0 && (
                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Email Preview (First Contact)</p>
                    <div className="p-4 bg-[#232323] rounded-xl">
                      <p className="text-sm text-neutral-400 mb-2">
                        Subject: {previewEmail(selectedTemplate.subject, selectedTemplate.body, selectedContacts[0]).subject}
                      </p>
                      <div 
                        className="text-sm text-neutral-300"
                        dangerouslySetInnerHTML={{ 
                          __html: previewEmail(selectedTemplate.subject, selectedTemplate.body, selectedContacts[0]).body.substring(0, 200) + '...'
                        }}
                      />
                    </div>
                  </div>
                )}

                {sending && (
                  <div className="p-6 bg-[#232323] rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-semibold">Sending emails...</p>
                      <p className="text-[#FFC700]">
                        {sendProgress.sent} / {sendProgress.total}
                      </p>
                    </div>
                    <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FFC700] transition-all"
                        style={{ width: `${(sendProgress.sent / sendProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              disabled={sending}
              className="px-8 py-4 bg-[#232323] hover:bg-[#2A2A2A] text-white font-semibold rounded-2xl transition-all disabled:opacity-50"
            >
              Back
            </button>
          )}
          
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex-1 px-8 py-4 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-2xl transition-all hover:scale-105"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreateAndSend}
              disabled={sending}
              className="flex-1 px-8 py-4 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-2xl transition-all hover:scale-105 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Create & Send Campaign'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
