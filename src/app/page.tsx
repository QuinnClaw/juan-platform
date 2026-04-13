import Link from 'next/link';

const features = [
  {
    icon: '🎯',
    title: 'Top 3 Priorities',
    description: 'Focus on what matters most. No overwhelm, just clarity.',
  },
  {
    icon: '📅',
    title: 'Visual Time Blocks',
    description: 'Break your week into manageable chunks. See your plan at a glance.',
  },
  {
    icon: '🧠',
    title: 'Brain Dump Zone',
    description: 'Get every thought out of your head and into a safe space.',
  },
  {
    icon: '✅',
    title: 'Habit Tracker',
    description: 'Build consistency with 5 customizable daily habits.',
  },
  {
    icon: '🚫',
    title: 'Distraction Log',
    description: 'Notice patterns. Log distractions without judgment.',
  },
  {
    icon: '📊',
    title: 'Weekly Reviews',
    description: 'Reflect on what worked, adjust what didn\'t, and keep growing.',
  },
];

const testimonials = [
  {
    name: 'Alex K.',
    role: 'Freelance Designer',
    quote: 'Finally, a planner that gets how my brain works. The brain dump zone alone is worth it.',
  },
  {
    name: 'Sam R.',
    role: 'Software Engineer',
    quote: 'I\'ve tried every planner app out there. This is the first one I\'ve stuck with for more than a week.',
  },
  {
    name: 'Jordan M.',
    role: 'Entrepreneur',
    quote: 'The distraction log was a game changer. I had no idea how much time I was losing to context switching.',
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-teal-100 px-4 py-1.5 text-sm font-medium text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
              🧠 Built for ADHD brains
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Your ADHD brain deserves{' '}
              <span className="text-teal-600">better tools</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Interactive weekly planners designed for how your brain actually works.
              Prioritize, plan, track habits, and dump your thoughts — all in one calming space.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-8 py-3 text-base font-medium text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700 hover:shadow-teal-600/40"
              >
                Start Planning for $4/mo →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border-2 border-slate-300 px-8 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Planner preview mockup */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/50">
              <div className="rounded-lg bg-slate-50 p-6 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300">Week of Apr 14 - Apr 18</h3>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700">67% Complete</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                    <div key={day} className="rounded-lg bg-white p-3 dark:bg-slate-800">
                      <div className="text-xs font-medium text-slate-500 mb-2">{day}</div>
                      <div className="space-y-1.5">
                        {[1, 2, 3].map((block) => (
                          <div
                            key={block}
                            className={`h-6 rounded ${
                              i < 3 && block < 3
                                ? 'bg-teal-100 dark:bg-teal-900/30'
                                : 'bg-slate-100 dark:bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Everything your ADHD brain needs
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              No clutter. No overwhelm. Just the right tools in the right place.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 p-6 transition hover:border-teal-200 hover:shadow-md dark:border-slate-700 dark:hover:border-teal-800"
              >
                <div className="mb-4 text-3xl">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-slate-50 py-24 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Simple, fair pricing
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Plans starting at $4/mo. Upgrade anytime.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 lg:grid-cols-3">
            {[
              { name: 'Starter', price: '$4/mo', desc: '1 active weekly plan', cta: 'Get Started' },
              { name: 'Pro', price: '$9/mo', desc: 'Unlimited plans + analytics', cta: 'Start Pro Trial', featured: true },
              { name: 'Business', price: '$19/mo', desc: 'Everything + business tools', cta: 'Contact Us' },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 text-center ${
                  plan.featured
                    ? 'border-teal-600 bg-white shadow-lg ring-2 ring-teal-600/20 dark:bg-slate-800'
                    : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                }`}
              >
                {plan.featured && (
                  <div className="mb-3 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{plan.price}</div>
                <p className="mt-2 text-sm text-slate-500">{plan.desc}</p>
                <Link
                  href={plan.name === 'Starter' ? '/auth/signup' : '/pricing'}
                  className={`mt-6 block rounded-lg px-4 py-2 text-sm font-medium transition ${
                    plan.featured
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Loved by ADHD brains everywhere
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-300">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4">
                  <p className="font-medium text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to work with your brain, not against it?</h2>
          <p className="mt-4 text-lg text-teal-100">
            Join thousands of ADHD professionals who plan smarter, not harder.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-medium text-teal-700 shadow-lg transition hover:bg-teal-50"
          >
            Start Planning for $4/mo →
          </Link>
        </div>
      </section>
    </div>
  );
}
