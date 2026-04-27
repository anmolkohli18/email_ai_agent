import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI-Powered Email Personalization Platform | Scale Your Outreach',
  description: 'Transform your email outreach with AI. Generate personalized emails at scale, manage contacts effortlessly, and track campaign performance. Not just bulk email—intelligent personalization.',
  keywords: ['AI email marketing', 'personalized email', 'email automation', 'bulk email', 'email campaign', 'outreach tool', 'email personalization'],
  openGraph: {
    title: 'AI-Powered Email Personalization Platform',
    description: 'Transform your email outreach with AI-driven personalization at scale',
    type: 'website',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-8">
              <span className="text-white">EMAILS THAT</span>
              <br />
              <span className="text-[#FFC700]">FEEL PERSONAL.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-400 mb-12 leading-relaxed max-w-2xl">
              AI-powered email personalization at scale. Not just bulk email—intelligent 
              outreach that connects. Research-driven insights in every message.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                className="bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 inline-block shadow-lg hover:shadow-2xl hover:shadow-[#FFC700]/20"
              >
                START FREE TRIAL
              </button>
              <button
                className="bg-transparent border-2 border-[#FFC700] text-[#FFC700] hover:bg-[#FFC700] hover:text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 inline-block"
              >
                WATCH DEMO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-12 lg:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
              Generic emails don't work anymore.
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed max-w-3xl">
              Your prospects get hundreds of emails daily. Template-based outreach gets ignored. 
              True personalization takes hours per contact. You need a better way—one that scales 
              without sacrificing quality.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-6 lg:px-12 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              BUILT FOR <span className="text-[#FFC700]">RESULTS</span>
            </h2>
            <p className="text-xl text-neutral-400">
              Everything you need to run intelligent email campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 hover:border-[#FFC700]/30 transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Email Generation</h3>
              <p className="text-neutral-400 leading-relaxed">
                Generate compelling emails instantly. Define purpose, tone, and product details—let 
                AI craft the perfect message with smart placeholders.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 hover:border-[#FFC700]/30 transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Deep Personalization</h3>
              <p className="text-neutral-400 leading-relaxed">
                Manual notes or AI research—your choice. Automatically fetch company insights, 
                recent news, and role context for hyper-relevant messaging.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 hover:border-[#FFC700]/30 transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Smart Contact Management</h3>
              <p className="text-neutral-400 leading-relaxed">
                Import, organize, and segment contacts effortlessly. CSV uploads, custom fields, 
                and dynamic lists for targeted campaigns.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 hover:border-[#FFC700]/30 transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#FFC700]/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#FFC700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Bulk Sending at Scale</h3>
              <p className="text-neutral-400 leading-relaxed">
                Send thousands of personalized emails. Rate limiting, failure retry, and delivery 
                tracking built-in. Scale without sacrificing quality.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 hover:border-[#FFC700]/30 transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Rich Text Editor</h3>
              <p className="text-neutral-400 leading-relaxed">
                WYSIWYG editing with MDX support. Insert placeholders, preview with sample contacts, 
                and fine-tune every detail before sending.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 hover:border-[#FFC700]/30 transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Performance Analytics</h3>
              <p className="text-neutral-400 leading-relaxed">
                Track opens, clicks, and responses. Campaign dashboards, per-contact insights, 
                and actionable metrics to optimize your outreach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 lg:px-12 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              HOW IT <span className="text-[#FFC700]">WORKS</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              From contacts to conversions in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFC700] rounded-full flex items-center justify-center mx-auto mb-6 text-black font-black text-2xl">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Import Contacts</h3>
              <p className="text-neutral-400">
                Upload CSV or add manually. Organize into targeted lists.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFC700] rounded-full flex items-center justify-center mx-auto mb-6 text-black font-black text-2xl">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Generate Email</h3>
              <p className="text-neutral-400">
                Define purpose and tone. AI creates personalized templates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFC700] rounded-full flex items-center justify-center mx-auto mb-6 text-black font-black text-2xl">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Personalize</h3>
              <p className="text-neutral-400">
                Add manual notes or let AI research each contact automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FFC700] rounded-full flex items-center justify-center mx-auto mb-6 text-black font-black text-2xl">
                4
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Send & Track</h3>
              <p className="text-neutral-400">
                Launch campaign and monitor performance in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#232323] rounded-3xl p-12 lg:p-16 border border-[#2A2A2A]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="text-5xl font-black text-[#FFC700] mb-3">10k+</div>
                <div className="text-lg text-neutral-400">Contacts Managed</div>
              </div>
              <div>
                <div className="text-5xl font-black text-[#FFC700] mb-3">3x</div>
                <div className="text-lg text-neutral-400">Higher Open Rates</div>
              </div>
              <div>
                <div className="text-5xl font-black text-[#FFC700] mb-3">80%</div>
                <div className="text-lg text-neutral-400">Time Saved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#232323] rounded-3xl p-12 lg:p-16 border border-[#2A2A2A] text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              READY TO SCALE YOUR <span className="text-[#FFC700]">OUTREACH?</span>
            </h2>
            <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
              Stop sending generic emails. Start building real connections at scale.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 inline-block shadow-lg">
                START FREE TRIAL
              </button>
              <Link
                href="/blog"
                className="bg-transparent border-2 border-neutral-600 text-white hover:border-[#FFC700] hover:text-[#FFC700] font-semibold px-8 py-4 rounded-full transition-all duration-300 inline-block"
              >
                READ THE BLOG
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
