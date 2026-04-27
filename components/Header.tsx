'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { signOut } from '@/lib/firebase/auth';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/#features', label: 'FEATURES' },
    { href: '/#how-it-works', label: 'HOW IT WORKS' },
    { href: '/blog', label: 'BLOG' },
  ];

  const dashboardLinks = user ? [
    { href: '/dashboard', label: 'DASHBOARD' },
    { href: '/dashboard/contacts', label: 'CONTACTS' },
    { href: '/dashboard/templates', label: 'TEMPLATES' },
    { href: '/dashboard/campaigns', label: 'CAMPAIGNS' },
  ] : [];

  const allLinks = [...navLinks, ...dashboardLinks];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-[#2A2A2A]">
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl lg:text-3xl font-black tracking-tight text-white hover:text-[#FFC700] transition-colors duration-300"
          >
            EMAIL AGENT
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-widest font-semibold transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-[#FFC700]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Buttons - Desktop */}
            {!loading && (
              <>
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-3 bg-[#1A1A1A] hover:bg-[#232323] border border-[#2A2A2A] px-4 py-2 rounded-full transition-all duration-300"
                    >
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
                      <svg
                        className={`w-4 h-4 text-neutral-400 transition-transform ${
                          userMenuOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-xl overflow-hidden">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-white hover:bg-[#232323] transition-colors"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/contacts"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-white hover:bg-[#232323] transition-colors"
                        >
                          Contacts
                        </Link>
                        <Link
                          href="/dashboard/templates"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-white hover:bg-[#232323] transition-colors"
                        >
                          Templates
                        </Link>
                        <Link
                          href="/dashboard/campaigns"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-white hover:bg-[#232323] transition-colors"
                        >
                          Campaigns
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#232323] transition-colors border-t border-[#2A2A2A]"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/login"
                      className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 text-sm"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-[#FFC700] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-6 pb-4 border-t border-[#2A2A2A] mt-6">
            <div className="flex flex-col gap-6">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm tracking-widest font-semibold transition-colors duration-300 ${
                    isActive(link.href)
                      ? 'text-[#FFC700]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Auth Buttons - Mobile */}
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm tracking-widest font-semibold text-neutral-400 hover:text-white transition-colors pt-4 border-t border-[#2A2A2A]"
                      >
                        DASHBOARD
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="text-sm tracking-widest font-semibold text-red-400 hover:text-red-300 transition-colors text-left"
                      >
                        SIGN OUT
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 pt-4 border-t border-[#2A2A2A]">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center bg-transparent border-2 border-[#2A2A2A] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center bg-[#FFC700] hover:bg-[#FFD700] text-black font-bold px-6 py-3 rounded-full transition-all duration-300"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
