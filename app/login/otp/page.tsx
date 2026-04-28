import OTPLoginForm from '@/components/auth/OTPLoginForm';
import PublicLayout from '@/components/PublicLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email Link Sign In',
  description: 'Sign in with a magic link sent to your email',
};

export default function OTPLoginPage() {
  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
        <OTPLoginForm />
      </div>
    </PublicLayout>
  );
}
