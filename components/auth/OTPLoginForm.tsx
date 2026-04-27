'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendOTPEmail } from '@/lib/firebase/auth';

export default function OTPLoginForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await sendOTPEmail(email);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error || 'Failed to send email');
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-[#10B981]"
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
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">Check Your Email</h2>
          <p className="text-neutral-400 mb-8">
            We&apos;ve sent a sign-in link to <span className="text-[#FFC700]">{email}</span>.
            Click the link in the email to complete your sign-in.
          </p>

          <div className="bg-[#232323] border border-[#2A2A2A] rounded-2xl p-4 mb-6">
            <p className="text-sm text-neutral-400">
              <strong className="text-white">Note:</strong> The link expires in 60 minutes.
              Check your spam folder if you don&apos;t see it.
            </p>
          </div>

          <Link
            href="/login"
            className="text-[#FFC700] hover:text-[#FFD700] font-semibold inline-block"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-white mb-2">Sign in with Email Link</h2>
        <p className="text-neutral-400 mb-8">
          Enter your email and we&apos;ll send you a magic link to sign in
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSendOTP} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0D0D0D] border-2 border-[#2A2A2A] focus:border-[#FFC700] text-white placeholder-neutral-600 px-4 py-3 rounded-xl transition-all duration-300 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Sending link...' : 'Send Sign-in Link'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-neutral-400 hover:text-white text-sm transition-colors">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
