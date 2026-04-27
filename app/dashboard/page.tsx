'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import { signOut } from '@/lib/firebase/auth';
import Link from 'next/link';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-neutral-400">Welcome back, {user.displayName || user.email}!</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-transparent border-2 border-[#2A2A2A] hover:border-[#FFC700] text-white hover:text-[#FFC700] font-semibold px-6 py-3 rounded-full transition-all duration-300"
            >
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-neutral-500 text-sm">Email</p>
                  <p className="text-white font-semibold">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-neutral-500 text-sm">Role</p>
                  <p className="text-white font-semibold capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-neutral-500 text-sm">Auth Provider</p>
                  <p className="text-white font-semibold capitalize">{user.authProvider}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/dashboard/contacts"
                className="group p-6 bg-[#1A1A1A] hover:bg-[#232323] border border-[#2A2A2A] hover:border-[#FFC700] rounded-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-[#FFC700]/10 rounded-xl flex items-center justify-center group-hover:bg-[#FFC700]/20 transition-colors">
                    <svg className="w-6 h-6 text-[#FFC700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#FFC700] transition-colors">
                    Manage Contacts
                  </h3>
                </div>
                <p className="text-neutral-400 text-sm">
                  Add, edit, and organize your contact list for email campaigns
                </p>
              </Link>

              <div className="group p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-neutral-700/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-600">
                    Email Templates
                  </h3>
                </div>
                <p className="text-neutral-600 text-sm">
                  Coming soon - Create and manage email templates
                </p>
              </div>

              <div className="group p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-neutral-700/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-600">
                    Campaigns
                  </h3>
                </div>
                <p className="text-neutral-600 text-sm">
                  Coming soon - Launch and track email campaigns
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Getting Started</h2>
            <p className="text-neutral-400 mb-6">
              Your account is set up and ready to go! Here&apos;s what you can do next:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#FFC700] mt-1">✓</span>
                <span className="text-neutral-300">Manage your contacts and contact lists</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neutral-600 mt-1">✓</span>
                <span className="text-neutral-600">Generate AI-powered personalized emails (coming soon)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neutral-600 mt-1">✓</span>
                <span className="text-neutral-600">Launch email campaigns at scale (coming soon)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neutral-600 mt-1">✓</span>
                <span className="text-neutral-600">Track performance with analytics (coming soon)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
