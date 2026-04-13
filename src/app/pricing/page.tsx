'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 4,
    yearlyPrice: 40,
    description: 'Everything you need to start planning',
    features: [
      '1 active weekly plan',
      'Top 3 priorities',
      'Time blocks & tasks',
      'Brain dump zone',
      'Distraction log',
      'Weekly review',
      'Basic habit tracking',
    ],
    limitations: ['Limited to 1 active plan', 'No habit analytics', 'No PDF export'],
    cta: 'Start for $4/mo',
    priceId: { monthly: 'starter_monthly', yearly: 'starter_yearly' },
    featured: false,
  },
  {
    name: 'Pro',
    monthlyPrice: 9,
    yearlyPrice: 90,
    description: 'For serious planners',
    features: [
      'Unlimited weekly plans',
      'Everything in Free',
      'Habit analytics & streaks',
      'Export plans to PDF',
      'Priority themes & colors',
      'Plan history & insights',
      'Dark mode themes',
    ],
    limitations: [],
    cta: 'Start Pro',
    priceId: { monthly: 'pro_monthly', yearly: 'pro_yearly' },
    featured: true,
  },
  {
    name: 'Business',
    monthlyPrice: 19,
    yearlyPrice: 190,
    description: 'Run your whole life',
    features: [
      'Everything in Pro',
      'Budget tracker',
      'Client tracker',
      'Invoice generator',
      'Business analytics',
      'Priority support',
    ],
    limitations: [],
    comingSoon: ['Budget tracker', 'Client tracker', 'Invoice generator'],
    cta: 'Start Business',
    priceId: { monthly: 'business_monthly', yearly: 'business_yearly' },
    featured: false,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (planName: string, priceKey: string) => {
    if (!user) {
      window.location.href = '/auth/signup';
      return;
    }

    setLoadingPlan(planName);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceKey }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating checkout session. Please try again.');
      }
    } catch {
      alert('Error creating checkout session. Please try again.');
    }
    setLoadingPlan(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Start free. Upgrade when your brain demands more.
        </p>

        {/* Billing toggle */}
        <div className="mt-8 inline-flex items-center rounded-lg border border-slate-200 p-1 dark:border-slate-700">
          <button
            onClick={() => setBilling('monthly')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              billing === 'monthly'
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              billing === 'yearly'
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            Yearly
            <span className="ml-1.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          const period = billing === 'monthly' ? '/mo' : '/yr';

          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.featured
                  ? 'border-teal-600 shadow-xl ring-2 ring-teal-600/20 bg-white dark:bg-slate-800'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-4 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  ${price}
                </span>
                {price > 0 && (
                  <span className="text-slate-500">{period}</span>
                )}
              </div>

              {plan.priceId ? (
                <Button
                  className="w-full"
                  variant={plan.featured ? 'primary' : 'outline'}
                  size="lg"
                  disabled={loadingPlan === plan.name}
                  onClick={() => handleCheckout(
                    plan.name,
                    billing === 'monthly' ? plan.priceId!.monthly : plan.priceId!.yearly
                  )}
                >
                  {loadingPlan === plan.name ? 'Loading...' : plan.cta}
                </Button>
              ) : (
                <Link href={user ? '/dashboard' : '/auth/signup'}>
                  <Button className="w-full" variant="outline" size="lg">
                    {plan.cta}
                  </Button>
                </Link>
              )}

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => {
                  const isComingSoon = (plan as { comingSoon?: string[] }).comingSoon?.includes(feature);
                  return (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-teal-500">✓</span>
                      <span className="text-slate-600 dark:text-slate-300">
                        {feature}
                        {isComingSoon && (
                          <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            Coming Soon
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-slate-300">✗</span>
                    <span className="text-slate-400">{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
          Questions? We got you.
        </h2>
        <div className="mt-8 space-y-4">
          {[
            {
              q: 'Can I cancel anytime?',
              a: 'Yes! No contracts, no commitments. Cancel from your profile page whenever you want.',
            },
            {
              q: 'Is my data safe?',
              a: 'Absolutely. All data is stored securely with Supabase (enterprise-grade Postgres). Your data is yours.',
            },
            {
              q: 'What makes this different from other planners?',
              a: 'Juan Digital is built specifically for ADHD brains. Minimal clutter, dopamine-friendly progress tracking, brain dump zones, and distraction awareness — all things neurotypical planners ignore.',
            },
          ].map((faq) => (
            <div key={faq.q} className="rounded-lg border border-slate-200 p-5 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">{faq.q}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
