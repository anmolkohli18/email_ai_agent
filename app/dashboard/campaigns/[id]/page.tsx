'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  getEmailCampaign,
  getCampaignLogs,
  getCampaignStats,
} from '@/lib/firebase/email-campaigns';
import { getEmailTemplate } from '@/lib/firebase/email-templates';
import { getContact } from '@/lib/firebase/contacts';
import { EmailCampaign, EmailLog, EmailTemplate } from '@/types/email';
import { Contact } from '@/types/contact';

export default function CampaignDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0, opened: 0, clicked: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccessMessage('Campaign created and emails sent successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && campaignId) {
      loadCampaignData();
    }
  }, [user, campaignId]);

  const loadCampaignData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [campaignResult, logsResult, statsResult] = await Promise.all([
        getEmailCampaign(user.uid, campaignId),
        getCampaignLogs(user.uid, campaignId),
        getCampaignStats(user.uid, campaignId),
      ]);

      if (campaignResult.success && campaignResult.campaign) {
        setCampaign(campaignResult.campaign);
        
        // Load template
        const templateResult = await getEmailTemplate(user.uid, campaignResult.campaign.templateId);
        if (templateResult.success && templateResult.template) {
          setTemplate(templateResult.template);
        }
      } else {
        setError(campaignResult.error || 'Campaign not found');
      }

      if (logsResult.success && logsResult.logs) {
        setLogs(logsResult.logs);
      }

      if (statsResult.success && statsResult.stats) {
        setStats(statsResult.stats);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load campaign data');
    }
    setLoading(false);
  };

  const getStatusBadge = (status: EmailLog['status']) => {
    const styles = {
      sent: 'bg-green-500/10 text-green-400',
      failed: 'bg-red-500/10 text-red-400',
      opened: 'bg-blue-500/10 text-blue-400',
      clicked: 'bg-purple-500/10 text-purple-400',
    };

    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error || 'Campaign not found'}</p>
          <button
            onClick={() => router.push('/dashboard/campaigns')}
            className="mt-4 px-6 py-3 bg-[#FFC700] hover:bg-[#FFD700] text-black font-semibold rounded-xl transition-all"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/campaigns')}
            className="mb-4 text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Campaigns
          </button>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
            {campaign.name}
          </h1>
          <p className="text-neutral-400 text-lg">
            Campaign Details & Performance
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
            <p className="text-green-400">{successMessage}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6">
            <p className="text-neutral-500 text-sm mb-2">Total Recipients</p>
            <p className="text-4xl font-black text-white">{stats.total}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6">
            <p className="text-neutral-500 text-sm mb-2">Sent</p>
            <p className="text-4xl font-black text-green-400">{stats.sent}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6">
            <p className="text-neutral-500 text-sm mb-2">Failed</p>
            <p className="text-4xl font-black text-red-400">{stats.failed}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6">
            <p className="text-neutral-500 text-sm mb-2">Opened</p>
            <p className="text-4xl font-black text-blue-400">{stats.opened}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6">
            <p className="text-neutral-500 text-sm mb-2">Clicked</p>
            <p className="text-4xl font-black text-purple-400">{stats.clicked}</p>
          </div>
        </div>

        {/* Campaign Info */}
        {template && (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Template Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Template Name</p>
                <p className="text-white font-semibold">{template.name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Subject Line</p>
                <p className="text-white">{template.subject}</p>
              </div>
            </div>
          </div>
        )}

        {/* Email Logs */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Email Logs</h2>
          
          {logs.length === 0 ? (
            <p className="text-center text-neutral-400 py-8">No email logs available</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-[#232323] rounded-xl border border-[#2A2A2A]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-white font-semibold">{log.subject}</p>
                        {getStatusBadge(log.status)}
                      </div>
                      <p className="text-sm text-neutral-400 mb-1">
                        Contact ID: {log.contactId}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                      {log.errorMessage && (
                        <p className="text-sm text-red-400 mt-2">Error: {log.errorMessage}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
