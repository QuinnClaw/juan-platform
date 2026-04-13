import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-teal-600 text-white font-bold text-xs">
              J
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">Juan Digital</span>
          </div>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-sm text-slate-500 hover:text-teal-600">Pricing</Link>
            <Link href="/auth/signup" className="text-sm text-slate-500 hover:text-teal-600">Get Started</Link>
          </div>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Juan Digital. Built for ADHD brains.
          </p>
        </div>
      </div>
    </footer>
  );
}
