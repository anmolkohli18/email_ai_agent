'use client';

import { useState } from 'react';
import { EmailTemplateFormData } from '@/types/email';

interface AIEmailGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: EmailTemplateFormData) => Promise<void>;
}

type Tone = 'formal' | 'casual' | 'persuasive' | 'friendly';

export default function AIEmailGeneratorModal({
  isOpen,
  onClose,
  onGenerate,
}: AIEmailGeneratorModalProps) {
  const [step, setStep] = useState<'input' | 'generating' | 'result'>('input');
  const [formData, setFormData] = useState({
    purpose: '',
    tone: 'formal' as Tone,
    productDetails: '',
    targetAudience: '',
    callToAction: '',
    additionalInstructions: '',
    includePersonalization: true,
  });
  const [generatedContent, setGeneratedContent] = useState<{
    subject: string;
    body: string;
    placeholders: string[];
  } | null>(null);
  const [error, setError] = useState('');
  const [templateName, setTemplateName] = useState('');

  const handleGenerate = async () => {
    if (!formData.purpose.trim()) {
      setError('Please describe the purpose of the email');
      return;
    }

    setError('');
    setStep('generating');

    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate email');
      }

      const result = await response.json();
      setGeneratedContent(result);
      setStep('result');
    } catch (err: any) {
      setError(err.message || 'Failed to generate email');
      setStep('input');
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!generatedContent) return;

    if (!templateName.trim()) {
      setError('Please enter a template name');
      return;
    }

    try {
      await onGenerate({
        name: templateName,
        subject: generatedContent.subject,
        body: generatedContent.body,
      });
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save template');
    }
  };

  const handleClose = () => {
    setStep('input');
    setFormData({
      purpose: '',
      tone: 'formal',
      productDetails: '',
      targetAudience: '',
      callToAction: '',
      additionalInstructions: '',
      includePersonalization: true,
    });
    setGeneratedContent(null);
    setError('');
    setTemplateName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="p-8 border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                ✨ AI Email Generator
              </h2>
              <p className="text-neutral-400">
                {step === 'input' && 'Describe your email and let AI write it for you'}
                {step === 'generating' && 'Generating your email...'}
                {step === 'result' && 'Review and save your generated email'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-neutral-400 hover:text-white transition-colors"
              disabled={step === 'generating'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Input Step */}
          {step === 'input' && (
            <div className="space-y-6">
              {/* Purpose */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Email Purpose <span className="text-[#FFC700]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g., Sales outreach, Product launch, Follow-up, Newsletter"
                  className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
                />
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Tone
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['formal', 'casual', 'persuasive', 'friendly'] as Tone[]).map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setFormData({ ...formData, tone })}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        formData.tone === tone
                          ? 'bg-[#FFC700] text-black'
                          : 'bg-[#232323] text-neutral-400 hover:text-white hover:bg-[#2A2A2A]'
                      }`}
                    >
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Product/Service Details
                </label>
                <textarea
                  value={formData.productDetails}
                  onChange={(e) => setFormData({ ...formData, productDetails: e.target.value })}
                  placeholder="Describe what you're promoting or discussing..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors resize-none"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g., Tech startups, Marketing professionals, Small business owners"
                  className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
                />
              </div>

              {/* Call to Action */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Call to Action
                </label>
                <input
                  type="text"
                  value={formData.callToAction}
                  onChange={(e) => setFormData({ ...formData, callToAction: e.target.value })}
                  placeholder="e.g., Schedule a demo, Download the guide, Sign up for free trial"
                  className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
                />
              </div>

              {/* Additional Instructions */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Additional Instructions
                </label>
                <textarea
                  value={formData.additionalInstructions}
                  onChange={(e) => setFormData({ ...formData, additionalInstructions: e.target.value })}
                  placeholder="Any specific requirements or style preferences..."
                  rows={2}
                  className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors resize-none"
                />
              </div>

              {/* Personalization Toggle */}
              <div className="flex items-center gap-3 p-4 bg-[#232323] rounded-xl">
                <input
                  type="checkbox"
                  id="personalization"
                  checked={formData.includePersonalization}
                  onChange={(e) => setFormData({ ...formData, includePersonalization: e.target.checked })}
                  className="w-5 h-5 rounded border-[#2A2A2A] bg-[#1A1A1A] text-[#FFC700] focus:ring-[#FFC700] focus:ring-offset-0"
                />
                <label htmlFor="personalization" className="text-white font-semibold cursor-pointer">
                  Include personalization placeholders (firstName, company, etc.)
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 bg-[#232323] hover:bg-[#2A2A2A] text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!formData.purpose.trim()}
                  className="flex-1 px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  ✨ Generate Email
                </button>
              </div>
            </div>
          )}

          {/* Generating Step */}
          {step === 'generating' && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-white text-xl font-semibold mb-2">
                Generating your email...
              </p>
              <p className="text-neutral-400">
                AI is crafting the perfect email for you
              </p>
            </div>
          )}

          {/* Result Step */}
          {step === 'result' && generatedContent && (
            <div className="space-y-6">
              {/* Template Name */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Template Name <span className="text-[#FFC700]">*</span>
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., AI Generated - Sales Outreach"
                  className="w-full px-4 py-3 bg-[#232323] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:border-[#FFC700] transition-colors"
                />
              </div>

              {/* Generated Subject */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Subject Line
                </label>
                <div className="p-4 bg-[#232323] border border-[#2A2A2A] rounded-xl">
                  <p className="text-white">{generatedContent.subject}</p>
                </div>
              </div>

              {/* Generated Body */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Email Body
                </label>
                <div className="p-4 bg-[#232323] border border-[#2A2A2A] rounded-xl max-h-96 overflow-y-auto">
                  <pre className="text-white whitespace-pre-wrap font-sans">
                    {generatedContent.body}
                  </pre>
                </div>
              </div>

              {/* Placeholders */}
              {generatedContent.placeholders.length > 0 && (
                <div className="p-4 bg-[#232323] rounded-xl">
                  <p className="text-sm font-semibold text-white mb-2">
                    Detected Placeholders:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.placeholders.map((placeholder) => (
                      <span
                        key={placeholder}
                        className="px-3 py-1 bg-[#FFC700]/10 text-[#FFC700] text-xs rounded-lg"
                      >
                        {`{{${placeholder}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="flex-1 px-6 py-3 bg-[#232323] hover:bg-[#2A2A2A] text-white font-semibold rounded-xl transition-all"
                >
                  ← Generate Again
                </button>
                <button
                  type="button"
                  onClick={handleSaveAsTemplate}
                  disabled={!templateName.trim()}
                  className="flex-1 px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  💾 Save as Template
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
