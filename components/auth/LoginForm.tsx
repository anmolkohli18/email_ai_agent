'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setLoadingMessage('Signing in...');

    const result = await signInWithEmail(email, password);

    if (result.success) {
      setLoadingMessage('Redirecting to dashboard...');
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    setLoadingMessage('Opening Google sign-in...');

    try {
      const result = await signInWithGoogle();

      if (result.success) {
        setLoadingMessage('Success! Redirecting...');
        // Add a small delay to show success message
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/dashboard');
      } else {
        setError(result.error || 'Google login failed');
        setLoading(false);
        setLoadingMessage('');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-neutral-400 mb-8">Sign in to your account</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl mb-6">
            {error}
          </div>
        )}

        {loading && loadingMessage && (
          <div className="bg-[#FFC700]/10 border border-[#FFC700]/20 text-[#FFC700] px-4 py-3 rounded-2xl mb-6 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#FFC700] border-t-transparent rounded-full animate-spin"></div>
            {loadingMessage}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-5">
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

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0D0D0D] border-2 border-[#2A2A2A] focus:border-[#FFC700] text-white placeholder-neutral-600 px-4 py-3 rounded-xl transition-all duration-300 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2A2A2A]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#1A1A1A] text-neutral-500 uppercase tracking-wider text-xs font-semibold">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-[#0D0D0D] hover:bg-[#232323] border-2 border-[#2A2A2A] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="mt-8 text-center">
          <p className="text-neutral-500 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#FFC700] hover:text-[#FFD700] font-semibold">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/login/otp"
            className="text-neutral-400 hover:text-white text-sm transition-colors"
          >
            Sign in with email link →
          </Link>
        </div>
      </div>
    </div>
  );
}
