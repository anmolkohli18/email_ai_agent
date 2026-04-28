'use client';

import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { signOut } from '@/lib/firebase/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="ml-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-[#2A2A2A]">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">Email Agent</h2>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#FFC700] flex items-center justify-center text-black text-xs font-bold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                )}
                <span className="text-white text-sm font-semibold">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </div>

              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-neutral-400 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
