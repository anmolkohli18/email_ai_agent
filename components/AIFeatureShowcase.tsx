export default function AIFeatureShowcase() {
  return (
    <section className="py-16 lg:py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            SEE AI IN <span className="text-[#FFC700]">ACTION</span>
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl">
            Watch how our AI transforms a simple prompt into a personalized, professional email in seconds.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Side - AI Generator Mockup */}
          <div className="lg:col-span-3">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 lg:p-10 shadow-2xl">
              {/* Mockup Header */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#2A2A2A]">
                <div className="w-10 h-10 bg-[#7C3AED] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">AI Email Generator</h3>
              </div>

              {/* Input Section */}
              <div className="space-y-6 mb-8">
                {/* Purpose Input */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Email Purpose
                  </label>
                  <div className="bg-[#232323] border border-[#2A2A2A] rounded-xl px-4 py-3">
                    <p className="text-neutral-400 text-sm">
                      Write a sales email for our AI-powered SaaS product targeting CTOs
                    </p>
                  </div>
                </div>

                {/* Tone Selector */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Tone
                  </label>
                  <div className="flex gap-3">
                    <div className="bg-[#FFC700] border-2 border-[#FFC700] rounded-xl px-4 py-2">
                      <span className="text-black font-semibold text-sm">Formal</span>
                    </div>
                    <div className="bg-transparent border-2 border-[#2A2A2A] rounded-xl px-4 py-2">
                      <span className="text-neutral-500 text-sm">Casual</span>
                    </div>
                    <div className="bg-transparent border-2 border-[#2A2A2A] rounded-xl px-4 py-2">
                      <span className="text-neutral-500 text-sm">Friendly</span>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <button className="w-full bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold px-6 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Email
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-[#2A2A2A] mb-8" />

              {/* Generated Output Preview */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                  <span className="text-sm text-[#10B981] font-medium">Generated in 2.3s</span>
                </div>

                {/* Subject Line */}
                <div className="bg-[#232323] border border-[#2A2A2A] rounded-xl p-4">
                  <label className="text-xs text-neutral-500 uppercase tracking-wide mb-2 block">
                    Subject Line
                  </label>
                  <p className="text-white font-medium">
                    Transform Your Development Process with AI-Powered Solutions
                  </p>
                </div>

                {/* Email Body Preview */}
                <div className="bg-[#232323] border border-[#2A2A2A] rounded-xl p-4">
                  <label className="text-xs text-neutral-500 uppercase tracking-wide mb-3 block">
                    Email Body
                  </label>
                  <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                    <p>
                      Hi <span className="bg-[#7C3AED]/20 text-[#7C3AED] px-2 py-0.5 rounded font-mono text-xs">{'{{firstName}}'}</span>,
                    </p>
                    <p>
                      I noticed <span className="bg-[#7C3AED]/20 text-[#7C3AED] px-2 py-0.5 rounded font-mono text-xs">{'{{company}}'}</span> is 
                      scaling rapidly, and managing technical infrastructure must be increasingly complex.
                    </p>
                    <p>
                      Our AI-powered platform helps CTOs like you automate workflow optimization, 
                      reduce deployment times by 60%, and <span className="bg-[#7C3AED]/20 text-[#7C3AED] px-2 py-0.5 rounded font-mono text-xs">{'{{customInsight}}'}</span>.
                    </p>
                    <p className="text-neutral-500">
                      ...
                    </p>
                  </div>
                </div>

                {/* Placeholders Info */}
                <div className="flex items-center gap-2 mt-4">
                  <svg className="w-4 h-4 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-neutral-400">
                    3 smart placeholders detected for personalization
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Benefits List */}
          <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
            {/* Benefit 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Lightning Fast</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Generate professional emails in seconds, not hours. Save 90% of your writing time.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#10B981]/10 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Smart Placeholders</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  AI automatically identifies personalization points—names, companies, custom insights.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#F59E0B]/10 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Perfect Tone Match</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Choose your tone—formal, casual, or persuasive. AI adapts the language instantly.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#FFC700]/10 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#FFC700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Conversion Optimized</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Trained on high-performing emails. Every message is crafted to drive responses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
