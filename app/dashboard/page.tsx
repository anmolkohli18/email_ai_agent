'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import { signOut } from '@/lib/firebase/auth';
import Link from 'next/link';

// Example data for dashboard metrics
const dashboardMetrics = {
  totalEmailsSent: 15420,
  deliveryRate: 97.8,
  openRate: 42.5,
  clickRate: 18.3,
  failureRate: 2.2,
  responseRate: 12.4,
  totalContacts: 3245,
  activeCampaigns: 8,
  totalCampaigns: 24,
};

const recentCampaigns = [
  { id: '1', name: 'Product Launch Q2', sent: 2340, openRate: 48.2, clickRate: 22.1, status: 'completed' },
  { id: '2', name: 'Follow-up Series', sent: 1820, openRate: 51.3, clickRate: 19.8, status: 'active' },
  { id: '3', name: 'Newsletter April', sent: 3120, openRate: 38.7, clickRate: 15.2, status: 'completed' },
  { id: '4', name: 'Customer Onboarding', sent: 890, openRate: 62.4, clickRate: 31.5, status: 'active' },
  { id: '5', name: 'Re-engagement Campaign', sent: 1560, openRate: 28.9, clickRate: 9.3, status: 'completed' },
];

const emailPerformanceTimeSeries = [
  { date: 'Apr 21', sent: 1240, opened: 528, clicked: 227 },
  { date: 'Apr 22', sent: 1580, opened: 672, clicked: 289 },
  { date: 'Apr 23', sent: 980, opened: 412, clicked: 176 },
  { date: 'Apr 24', sent: 2150, opened: 914, clicked: 394 },
  { date: 'Apr 25', sent: 1890, opened: 803, clicked: 346 },
  { date: 'Apr 26', sent: 2240, opened: 952, clicked: 410 },
  { date: 'Apr 27', sent: 1720, opened: 731, clicked: 315 },
];

const topPerformingEmails = [
  { subject: 'Exclusive: Early Access to New Features', openRate: 68.3, clickRate: 34.2 },
  { subject: 'Your Personalized Demo is Ready', openRate: 62.1, clickRate: 31.8 },
  { subject: 'Limited Time: 30% Off Enterprise Plan', openRate: 59.7, clickRate: 28.5 },
  { subject: 'Case Study: How Company X Increased ROI 3x', openRate: 55.4, clickRate: 26.9 },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="w-16 h-16 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              ANALYTICS <span className="text-[#FFC700]">DASHBOARD</span>
            </h1>
            <p className="text-neutral-400 text-lg">Welcome back, {user.displayName || user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-transparent border-2 border-[#2A2A2A] hover:border-[#FFC700] text-white hover:text-[#FFC700] font-semibold px-6 py-3 rounded-full transition-all duration-300"
          >
            Sign Out
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Emails Sent */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 hover:border-[#FFC700]/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-[#10B981] text-sm font-semibold">+12.3%</span>
            </div>
            <h3 className="text-neutral-500 text-sm mb-1">Total Emails Sent</h3>
            <p className="text-3xl font-bold text-white">{dashboardMetrics.totalEmailsSent.toLocaleString()}</p>
          </div>

          {/* Open Rate */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 hover:border-[#FFC700]/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-[#10B981] text-sm font-semibold">+5.7%</span>
            </div>
            <h3 className="text-neutral-500 text-sm mb-1">Open Rate</h3>
            <p className="text-3xl font-bold text-white">{dashboardMetrics.openRate}%</p>
          </div>

          {/* Click Rate */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 hover:border-[#FFC700]/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <span className="text-[#10B981] text-sm font-semibold">+3.2%</span>
            </div>
            <h3 className="text-neutral-500 text-sm mb-1">Click Rate</h3>
            <p className="text-3xl font-bold text-white">{dashboardMetrics.clickRate}%</p>
          </div>

          {/* Delivery Rate */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 hover:border-[#FFC700]/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#FFC700]/10 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#FFC700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[#10B981] text-sm font-semibold">+0.8%</span>
            </div>
            <h3 className="text-neutral-500 text-sm mb-1">Delivery Rate</h3>
            <p className="text-3xl font-bold text-white">{dashboardMetrics.deliveryRate}%</p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="text-neutral-500 text-sm mb-1">Response Rate</h3>
            <p className="text-2xl font-bold text-white">{dashboardMetrics.responseRate}%</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="text-neutral-500 text-sm mb-1">Total Contacts</h3>
            <p className="text-2xl font-bold text-white">{dashboardMetrics.totalContacts.toLocaleString()}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="text-neutral-500 text-sm mb-1">Active Campaigns</h3>
            <p className="text-2xl font-bold text-white">{dashboardMetrics.activeCampaigns}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="text-neutral-500 text-sm mb-1">Failure Rate</h3>
            <p className="text-2xl font-bold text-white">{dashboardMetrics.failureRate}%</p>
          </div>
        </div>

        {/* Time Series Chart */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">EMAIL PERFORMANCE - LAST 7 DAYS</h2>
          <div className="space-y-4">
            {emailPerformanceTimeSeries.map((day, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400 font-medium w-20">{day.date}</span>
                  <div className="flex-1 flex items-center gap-4 ml-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neutral-500 text-xs">Sent: {day.sent}</span>
                      </div>
                      <div className="w-full bg-[#0D0D0D] rounded-full h-2">
                        <div 
                          className="bg-[#7C3AED] h-2 rounded-full" 
                          style={{ width: `${(day.sent / 2500) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neutral-500 text-xs">Opened: {day.opened}</span>
                      </div>
                      <div className="w-full bg-[#0D0D0D] rounded-full h-2">
                        <div 
                          className="bg-[#10B981] h-2 rounded-full" 
                          style={{ width: `${(day.opened / day.sent) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neutral-500 text-xs">Clicked: {day.clicked}</span>
                      </div>
                      <div className="w-full bg-[#0D0D0D] rounded-full h-2">
                        <div 
                          className="bg-[#FFC700] h-2 rounded-full" 
                          style={{ width: `${(day.clicked / day.opened) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#2A2A2A]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#7C3AED] rounded-full"></div>
              <span className="text-neutral-400 text-sm">Sent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
              <span className="text-neutral-400 text-sm">Opened</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FFC700] rounded-full"></div>
              <span className="text-neutral-400 text-sm">Clicked</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Campaigns */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">RECENT CAMPAIGNS</h2>
              <Link 
                href="/dashboard/campaigns"
                className="text-[#FFC700] hover:text-[#FFD700] text-sm font-semibold transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/dashboard/campaigns/${campaign.id}`}
                  className="block bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4 hover:border-[#FFC700]/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{campaign.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      campaign.status === 'active' 
                        ? 'bg-[#10B981]/10 text-[#10B981]' 
                        : 'bg-neutral-700/10 text-neutral-400'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-500 text-xs">Sent</p>
                      <p className="text-white font-semibold">{campaign.sent}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Open Rate</p>
                      <p className="text-white font-semibold">{campaign.openRate}%</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Click Rate</p>
                      <p className="text-white font-semibold">{campaign.clickRate}%</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Performing Emails */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">TOP PERFORMING EMAILS</h2>
            <div className="space-y-4">
              {topPerformingEmails.map((email, idx) => (
                <div key={idx} className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#FFC700] rounded-full flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-white font-medium text-sm leading-tight">{email.subject}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm ml-11">
                    <div>
                      <span className="text-neutral-500">Open: </span>
                      <span className="text-[#10B981] font-semibold">{email.openRate}%</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Click: </span>
                      <span className="text-[#FFC700] font-semibold">{email.clickRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">QUICK ACTIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/campaigns/create"
              className="group p-6 bg-[#0D0D0D] hover:bg-[#232323] border border-[#2A2A2A] hover:border-[#FFC700] rounded-2xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#FFC700]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FFC700]/20 transition-colors">
                <svg className="w-6 h-6 text-[#FFC700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-[#FFC700] transition-colors">
                New Campaign
              </h3>
              <p className="text-neutral-400 text-sm">Create and launch a new email campaign</p>
            </Link>

            <Link
              href="/dashboard/contacts"
              className="group p-6 bg-[#0D0D0D] hover:bg-[#232323] border border-[#2A2A2A] hover:border-[#FFC700] rounded-2xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#7C3AED]/20 transition-colors">
                <svg className="w-6 h-6 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-[#7C3AED] transition-colors">
                Manage Contacts
              </h3>
              <p className="text-neutral-400 text-sm">Add or organize your contact lists</p>
            </Link>

            <Link
              href="/dashboard/templates"
              className="group p-6 bg-[#0D0D0D] hover:bg-[#232323] border border-[#2A2A2A] hover:border-[#FFC700] rounded-2xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#10B981]/20 transition-colors">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-[#10B981] transition-colors">
                Email Templates
              </h3>
              <p className="text-neutral-400 text-sm">Create AI-powered email templates</p>
            </Link>

            <Link
              href="/dashboard/lists"
              className="group p-6 bg-[#0D0D0D] hover:bg-[#232323] border border-[#2A2A2A] hover:border-[#FFC700] rounded-2xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#F59E0B]/20 transition-colors">
                <svg className="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-[#F59E0B] transition-colors">
                Contact Lists
              </h3>
              <p className="text-neutral-400 text-sm">Organize contacts into segments</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
