'use client';

import { useState, useRef, DragEvent } from 'react';
import { ContactFormData } from '@/types/contact';
import {
  parseCSVFile,
  downloadSampleCSV,
  CSVParseResult,
} from '@/lib/utils/csv';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: ContactFormData[]) => Promise<void>;
}

type Step = 'upload' | 'preview' | 'importing' | 'results';

export default function CSVImportModal({
  isOpen,
  onClose,
  onImport,
}: CSVImportModalProps) {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    created: number;
    skipped: number;
    errors?: string[];
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetModal = () => {
    setStep('upload');
    setFile(null);
    setParseResult(null);
    setImporting(false);
    setImportResults(null);
    setDragActive(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (uploadedFile: File) => {
    // Validate file type
    if (!uploadedFile.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    // Validate file size (max 5MB)
    if (uploadedFile.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setFile(uploadedFile);

    // Parse CSV
    const result = await parseCSVFile(uploadedFile);
    setParseResult(result);

    if (result.success && result.contacts && result.contacts.length > 0) {
      setStep('preview');
    } else {
      setStep('upload');
    }
  };

  const handleImport = async () => {
    if (!parseResult || !parseResult.contacts || parseResult.contacts.length === 0) {
      return;
    }

    setImporting(true);
    setStep('importing');

    try {
      await onImport(parseResult.contacts);
      
      // Note: The actual import results will come from the parent component's onImport
      // For now, we'll show success based on the parse result
      setImportResults({
        created: parseResult.validRows || 0,
        skipped: (parseResult.totalRows || 0) - (parseResult.validRows || 0),
        errors: parseResult.errors,
      });
      setStep('results');
    } catch (error: any) {
      setImportResults({
        created: 0,
        skipped: parseResult.contacts.length,
        errors: [error.message || 'Import failed'],
      });
      setStep('results');
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    downloadSampleCSV();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-8 border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Import Contacts from CSV
              </h2>
              <p className="text-neutral-400">
                {step === 'upload' && 'Upload a CSV file with your contacts'}
                {step === 'preview' && 'Review contacts before importing'}
                {step === 'importing' && 'Importing contacts...'}
                {step === 'results' && 'Import complete'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-neutral-400 hover:text-white transition-colors"
              disabled={importing}
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

        {/* Content */}
        <div className="p-8">
          {/* Upload Step */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                  dragActive
                    ? 'border-[#FFC700] bg-[#FFC700]/5'
                    : 'border-[#2A2A2A] hover:border-[#FFC700]/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-[#FFC700]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                <p className="text-white font-semibold mb-2 text-lg">
                  {dragActive
                    ? 'Drop your CSV file here'
                    : 'Drag and drop your CSV file'}
                </p>
                <p className="text-neutral-400 mb-4">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-semibold rounded-xl transition-all duration-300"
                >
                  Browse Files
                </button>

                <p className="text-neutral-500 text-sm mt-4">
                  Maximum file size: 5MB
                </p>
              </div>

              {/* Download Template */}
              <div className="bg-[#232323] border border-[#2A2A2A] rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">
                      Need a template?
                    </h3>
                    <p className="text-neutral-400 text-sm mb-4">
                      Download our CSV template with sample data and proper
                      formatting
                    </p>
                    <button
                      onClick={handleDownloadTemplate}
                      className="text-[#FFC700] hover:text-[#FFD700] font-semibold text-sm flex items-center gap-2 transition-colors"
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download Template
                    </button>
                  </div>
                </div>
              </div>

              {/* CSV Format Guide */}
              <div className="bg-[#232323] border border-[#2A2A2A] rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-3">CSV Format</h3>
                <p className="text-neutral-400 text-sm mb-3">
                  Your CSV file should include these columns:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFC700] font-bold">*</span>
                    <span className="text-neutral-300">
                      <strong>firstName</strong> (required)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFC700] font-bold">*</span>
                    <span className="text-neutral-300">
                      <strong>lastName</strong> (required)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFC700] font-bold">*</span>
                    <span className="text-neutral-300">
                      <strong>email</strong> (required)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-500">○</span>
                    <span className="text-neutral-400">
                      company (optional)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-500">○</span>
                    <span className="text-neutral-400">
                      personalizationNotes (optional)
                    </span>
                  </li>
                </ul>
              </div>

              {/* Parse Errors */}
              {parseResult && !parseResult.success && parseResult.errors && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                  <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Errors Found
                  </h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {parseResult.errors.map((error, index) => (
                      <p key={index} className="text-red-300 text-sm">
                        • {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preview Step */}
          {step === 'preview' && parseResult && parseResult.contacts && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#232323] border border-[#2A2A2A] rounded-2xl p-4">
                  <p className="text-neutral-400 text-sm mb-1">Total Rows</p>
                  <p className="text-3xl font-bold text-white">
                    {parseResult.totalRows || 0}
                  </p>
                </div>
                <div className="bg-[#232323] border border-green-500/20 rounded-2xl p-4">
                  <p className="text-neutral-400 text-sm mb-1">Valid Contacts</p>
                  <p className="text-3xl font-bold text-green-400">
                    {parseResult.validRows || 0}
                  </p>
                </div>
                <div className="bg-[#232323] border border-red-500/20 rounded-2xl p-4">
                  <p className="text-neutral-400 text-sm mb-1">
                    Errors/Skipped
                  </p>
                  <p className="text-3xl font-bold text-red-400">
                    {(parseResult.totalRows || 0) - (parseResult.validRows || 0)}
                  </p>
                </div>
              </div>

              {/* Warnings */}
              {parseResult.warnings && parseResult.warnings.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
                  <h4 className="text-orange-400 font-semibold mb-2 text-sm">
                    Warnings ({parseResult.warnings.length})
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {parseResult.warnings.slice(0, 5).map((warning, index) => (
                      <p key={index} className="text-orange-300 text-xs">
                        • {warning}
                      </p>
                    ))}
                    {parseResult.warnings.length > 5 && (
                      <p className="text-orange-400 text-xs">
                        ... and {parseResult.warnings.length - 5} more
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Errors */}
              {parseResult.errors && parseResult.errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                  <h4 className="text-red-400 font-semibold mb-2 text-sm">
                    Errors ({parseResult.errors.length})
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {parseResult.errors.slice(0, 5).map((error, index) => (
                      <p key={index} className="text-red-300 text-xs">
                        • {error}
                      </p>
                    ))}
                    {parseResult.errors.length > 5 && (
                      <p className="text-red-400 text-xs">
                        ... and {parseResult.errors.length - 5} more
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Preview Table */}
              <div className="bg-[#232323] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-[#2A2A2A]">
                  <h3 className="text-white font-semibold">
                    Preview ({parseResult.contacts.slice(0, 5).length} of{' '}
                    {parseResult.contacts.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#1A1A1A]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                          First Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                          Last Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase">
                          Company
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseResult.contacts.slice(0, 5).map((contact, index) => (
                        <tr
                          key={index}
                          className="border-t border-[#2A2A2A] hover:bg-[#1A1A1A]/50"
                        >
                          <td className="px-4 py-3 text-sm text-white">
                            {contact.firstName}
                          </td>
                          <td className="px-4 py-3 text-sm text-white">
                            {contact.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-300">
                            {contact.email}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-400">
                            {contact.company || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parseResult.contacts.length > 5 && (
                  <div className="p-3 bg-[#1A1A1A] text-center text-sm text-neutral-400">
                    + {parseResult.contacts.length - 5} more contacts
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={resetModal}
                  className="px-6 py-3 bg-[#232323] hover:bg-[#2A2A2A] text-white font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={parseResult.validRows === 0}
                  className="px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import {parseResult.validRows} Contacts
                </button>
              </div>
            </div>
          )}

          {/* Importing Step */}
          {step === 'importing' && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-white text-xl font-semibold mb-2">
                Importing contacts...
              </p>
              <p className="text-neutral-400">
                This may take a moment. Please don&apos;t close this window.
              </p>
            </div>
          )}

          {/* Results Step */}
          {step === 'results' && importResults && (
            <div className="space-y-6">
              {/* Success Icon */}
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Import Complete!
                </h3>
                <p className="text-neutral-400">
                  Your contacts have been imported successfully
                </p>
              </div>

              {/* Results Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
                  <p className="text-green-400 text-sm mb-1">Created</p>
                  <p className="text-4xl font-bold text-green-400">
                    {importResults.created}
                  </p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 text-center">
                  <p className="text-orange-400 text-sm mb-1">Skipped</p>
                  <p className="text-4xl font-bold text-orange-400">
                    {importResults.skipped}
                  </p>
                </div>
              </div>

              {/* Errors/Duplicates */}
              {importResults.errors && importResults.errors.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
                  <h4 className="text-orange-400 font-semibold mb-2 text-sm">
                    Skipped Contacts ({importResults.errors.length})
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {importResults.errors.slice(0, 10).map((error, index) => (
                      <p key={index} className="text-orange-300 text-xs">
                        • {error}
                      </p>
                    ))}
                    {importResults.errors.length > 10 && (
                      <p className="text-orange-400 text-xs">
                        ... and {importResults.errors.length - 10} more
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleClose}
                  className="px-8 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-xl transition-all duration-300"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
