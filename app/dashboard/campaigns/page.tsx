'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import {
  getEmailCampaigns,
  deleteEmailCampaign,
  getCampaignStats,
} from '@/lib/firebase/email-campaigns';
import { EmailCampaign } from '@/types/email';

export default function CampaignsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load campaigns
  useEffect(() => {
    if (user) {
      loadCampaigns();
    }
  }, [user]);

  const loadCampaigns = async () => {
    if (!user) return;

    setLoading(true);
    const result = await getEmailCampaigns(user.uid);

    if (result.success && result.campaigns) {
      setCampaigns(result.campaigns);
    } else {
      setError(result.error || 'Failed to load campaigns');
    }
    setLoading(false);
  };

  const handleCreateCampaign = () => {
    router.push('/dashboard/campaigns/create');
  };

  const handleViewCampaign = (campaign: EmailCampaign) => {
    router.push(`/dashboard/campaigns/${campaign.id}`);
  };

  const handleDeleteCampaign = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!user || !selectedCampaign) return;

    const result = await deleteEmailCampaign(user.uid, selectedCampaign.id);
    if (result.success) {
      setSuccessMessage('Campaign deleted successfully!');
      loadCampaigns();
      setIsDeleteModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError(result.error || 'Failed to delete campaign');
    }
  };

  const getStatusBadge = (status: EmailCampaign['status']) => {
    const styles = {
      draft: 'bg-neutral-800 text-neutral-400',
      scheduled: 'bg-blue-500/10 text-blue-400',
      sending: 'bg-yellow-500/10 text-yellow-400',
      sent: 'bg-green-500/10 text-green-400',
      failed: 'bg-red-500/10 text-red-400',
    };

    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (authLoading || (loading && campaigns.length === 0)) {
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
            Email Campaigns
          </h1>
          <p className="text-neutral-400 text-lg">
            Create and manage your email campaigns
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
            onClick={handleCreateCampaign}
            className="px-8 py-4 bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-[#FFC700]/20"
          >
            + Create Campaign
          </button>
        </div>

        {/* Campaigns List */}
        {campaigns.length === 0 && !loading ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-2">
                No campaigns yet
              </h3>
              <p className="text-neutral-400 mb-6">
                Create your first email campaign to start reaching your contacts
              </p>
              <button
                onClick={handleCreateCampaign}
                className="px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-semibold rounded-xl transition-all duration-300"
              >
                Create Your First Campaign
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 hover:border-[#FFC700]/30 transition-all duration-500 cursor-pointer"
                onClick={() => handleViewCampaign(campaign)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {campaign.name}
                      </h3>
                      {getStatusBadge(campaign.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Recipients</p>
                        <p className="text-white font-semibold">{campaign.contactIds.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Sent</p>
                        <p className="text-green-400 font-semibold">{campaign.sentCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Failed</p>
                        <p className="text-red-400 font-semibold">{campaign.failedCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-1">Created</p>
                        <p className="text-neutral-400 font-semibold">
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleViewCampaign(campaign)}
                      className="p-2 text-neutral-400 hover:text-[#FFC700] hover:bg-[#FFC700]/10 rounded-lg transition-all"
                      title="View campaign"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    {campaign.status === 'draft' && (
                      <button
                        onClick={() => handleDeleteCampaign(campaign)}
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        title="Delete campaign"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedCampaign && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-4">
                Delete Campaign?
              </h3>
              <p className="text-neutral-400 mb-6">
                Are you sure you want to delete &ldquo;{selectedCampaign.name}&rdquo;? This action cannot be undone.
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
