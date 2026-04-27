import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0D0D] border-t border-[#2A2A2A] mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-black mb-4 text-white">EMAIL AGENT</h3>
            <p className="text-neutral-400 text-base leading-relaxed max-w-md">
              AI-powered email personalization at scale. Transform your outreach 
              with intelligent, research-driven messaging.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-widest mb-6 text-white uppercase">Product</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/#features" 
                  className="text-neutral-400 hover:text-[#FFC700] transition-colors duration-300 text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/#how-it-works" 
                  className="text-neutral-400 hover:text-[#FFC700] transition-colors duration-300 text-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-neutral-400 hover:text-[#FFC700] transition-colors duration-300 text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-bold tracking-widest mb-6 text-white uppercase">Connect</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-[#FFC700] transition-colors duration-300 text-sm"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-[#FFC700] transition-colors duration-300 text-sm"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-[#FFC700] transition-colors duration-300 text-sm"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2A2A2A]">
          <p className="text-neutral-600 text-sm text-center">
            © {currentYear} Email Agent. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
