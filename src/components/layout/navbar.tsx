'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export function Navbar() {
  const { user, profile, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-sm">
              J
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Juan Digital
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm text-slate-600 hover:text-teal-600 dark:text-slate-300">
                  Dashboard
                </Link>
                <Link href="/planner/new" className="text-sm text-slate-600 hover:text-teal-600 dark:text-slate-300">
                  New Plan
                </Link>
                <Link href="/planner/history" className="text-sm text-slate-600 hover:text-teal-600 dark:text-slate-300">
                  History
                </Link>
                <Link href="/pricing" className="text-sm text-slate-600 hover:text-teal-600 dark:text-slate-300">
                  Pricing
                </Link>
                <div className="flex items-center gap-3">
                  {profile && (
                    <Badge variant={profile.subscription_tier === 'pro' ? 'pro' : profile.subscription_tier === 'business' ? 'business' : 'default'}>
                      {profile.subscription_tier.toUpperCase()}
                    </Badge>
                  )}
                  <Link href="/profile">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-sm font-medium dark:bg-teal-900 dark:text-teal-300">
                      {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                    </div>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/pricing" className="text-sm text-slate-600 hover:text-teal-600 dark:text-slate-300">
                  Pricing
                </Link>
                {!loading && (
                  <div className="flex items-center gap-2">
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm">Sign In</Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button size="sm">Get Started</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4 space-y-3">
            {user ? (
              <>
                <Link href="/dashboard" className="block text-sm text-slate-600 dark:text-slate-300 py-1" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/planner/new" className="block text-sm text-slate-600 dark:text-slate-300 py-1" onClick={() => setMobileMenuOpen(false)}>
                  New Plan
                </Link>
                <Link href="/planner/history" className="block text-sm text-slate-600 dark:text-slate-300 py-1" onClick={() => setMobileMenuOpen(false)}>
                  History
                </Link>
                <Link href="/pricing" className="block text-sm text-slate-600 dark:text-slate-300 py-1" onClick={() => setMobileMenuOpen(false)}>
                  Pricing
                </Link>
                <Link href="/profile" className="block text-sm text-slate-600 dark:text-slate-300 py-1" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <Button variant="ghost" size="sm" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/pricing" className="block text-sm text-slate-600 dark:text-slate-300 py-1" onClick={() => setMobileMenuOpen(false)}>
                  Pricing
                </Link>
                <Link href="/auth/login" className="block text-sm text-slate-600 dark:text-slate-300 py-1" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
