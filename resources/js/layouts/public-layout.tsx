import React, { ReactNode, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import PublicFooter from "@/components/PublicFooter";

interface Props {
  children: ReactNode;
  auth: {
    user: {
      id: number;
      role: string;
    } | null;
  };
}

export default function PublicLayout({ children, auth }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ✅ Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 ml-10 mr-10">
          <div className="grid grid-cols-3 items-center h-28 relative">
            {/* Left: Navigation (Desktop) */}
            <nav className="hidden md:flex justify-start space-x-8 text-gray-800 font-medium">
              <Link href={route('home')} className="hover:text-[#010079] transition-colors">Home</Link>
              <Link href="/listings" className="hover:text-[#010079] transition-colors">Buy a Business</Link>
              <Link href="/sell-a-business" className="hover:text-[#010079] transition-colors">Sell a Business</Link>
              <Link href="/brokers" className="hover:text-[#010079] transition-colors">Brokers</Link>
              <Link href="/about" className="hover:text-[#010079] transition-colors">About</Link>
              <Link href="/contact" className="hover:text-[#010079] transition-colors">Contact</Link>
            </nav>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <Link href={route('home')}>
                <img src="/images/logo_bg_removed.png" alt="Logo" className="h-20 w-auto" />
              </Link>
            </div>

            {/* Right: Auth Buttons */}
            <div className="hidden md:flex justify-end space-x-3 items-center pl-10">
              <Link
                href={auth?.user ? route('dashboard') : route('login')}
                className="inline-flex items-center px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors"
              >
                {auth?.user ? 'View Dashboard' : 'Sign In'}
              </Link>
              {!auth?.user && (
                <Link
                  href={route('register')}
                  className="inline-flex items-center px-5 py-2 rounded-md text-sm font-medium text-white bg-[#010079] hover:opacity-90 transition-opacity"
                >
                  Join
                </Link>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition absolute right-4"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
            <nav className="flex flex-col px-4 py-4 space-y-3 text-gray-800 font-medium">
              <Link href={route('home')} className="hover:text-[#010079]" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/listings" className="hover:text-[#010079]" onClick={() => setMobileMenuOpen(false)}>Buy a Business</Link>
              <Link href="/sell-a-business" className="hover:text-[#010079]" onClick={() => setMobileMenuOpen(false)}>Sell a Business</Link>
              <Link href="/brokers" className="hover:text-[#010079]" onClick={() => setMobileMenuOpen(false)}>Brokers</Link>
              <Link href="/about" className="hover:text-[#010079]" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/contact" className="hover:text-[#010079]" onClick={() => setMobileMenuOpen(false)}>Contact</Link>

              <div className="border-t border-gray-200 pt-3">
                <Link
                  href={auth?.user ? route('dashboard') : route('login')}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#010079]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {auth?.user ? 'View Dashboard' : 'Sign In'}
                </Link>
                {!auth?.user && (
                  <Link
                    href={route('register')}
                    className="block px-3 py-2 text-sm font-medium text-[#010079]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ✅ Main Content (with top padding for sticky header) */}
      <main className="flex-1 pt-[80px]">{children}</main>

      {/* ✅ Footer */}
      <PublicFooter />
    </div>
  );
}
