import SignupForm from '@/components/auth/SignupForm';
import PublicLayout from '@/components/PublicLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your Email Agent account',
};

export default function SignupPage() {
  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
        <SignupForm />
      </div>
    </PublicLayout>
  );
}
