'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { WeeklyPlan } from '@/types/database';

interface DashboardStats {
  totalPlans: number;
  currentStreak: number;
  habitsCompleted: number;
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ totalPlans: 0, currentStreak: 0, habitsCompleted: 0 });
  const [recentPlans, setRecentPlans] = useState<WeeklyPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;

      // Fetch plans
      const { data: plans } = await supabase
        .from('weekly_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start_date', { ascending: false })
        .limit(5);

      if (plans) {
        setRecentPlans(plans as WeeklyPlan[]);
        setStats(prev => ({ ...prev, totalPlans: plans.length }));
      }

      // Fetch habit completion count
      const { count } = await supabase
        .from('habit_entries')
        .select('*', { count: 'exact', head: true })
        .eq('completed', true);

      setStats(prev => ({ ...prev, habitsCompleted: count || 0 }));

      // Calculate streak (consecutive weeks with plans)
      if (plans && plans.length > 0) {
        let streak = 1;
        for (let i = 1; i < plans.length; i++) {
          const curr = new Date(plans[i - 1].week_start_date);
          const prev = new Date(plans[i].week_start_date);
          const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays <= 7) streak++;
          else break;
        }
        setStats(prev => ({ ...prev, currentStreak: streak }));
      }

      setLoading(false);
    }

    loadDashboard();
  }, [user]);

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'there';
  const tierBadgeVariant = profile?.subscription_tier === 'pro' ? 'pro' : profile?.subscription_tier === 'business' ? 'business' : 'default';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Hey, {displayName} 👋
          </h1>
          <p className="mt-1 text-slate-500">Here&apos;s your planning overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={tierBadgeVariant}>
            {(profile?.subscription_tier || 'free').toUpperCase()} Plan
          </Badge>
          <Link href="/planner/new">
            <Button>+ New Weekly Plan</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Weeks Planned', value: stats.totalPlans, icon: '📅' },
          { label: 'Week Streak', value: `${stats.currentStreak} 🔥`, icon: '🔥' },
          { label: 'Habits Done', value: stats.habitsCompleted, icon: '✅' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link href="/planner/new">
          <Card hover className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-2xl dark:bg-teal-900/30">
              📝
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">New Weekly Plan</h3>
              <p className="text-sm text-slate-500">Start planning your next week</p>
            </div>
          </Card>
        </Link>
        <Link href="/planner/history">
          <Card hover className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl dark:bg-purple-900/30">
              📊
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">View Past Weeks</h3>
              <p className="text-sm text-slate-500">Review and reflect on previous plans</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Plans</CardTitle>
        </CardHeader>
        {loading ? (
          <div className="py-8 text-center text-slate-500">Loading...</div>
        ) : recentPlans.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-slate-500 mb-4">No plans yet. Start your first week!</p>
            <Link href="/planner/new">
              <Button>Create First Plan</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPlans.map((plan) => {
              const weekStart = new Date(plan.week_start_date);
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekEnd.getDate() + 4);
              const priorityCount = (plan.priorities || []).filter(Boolean).length;

              return (
                <Link key={plan.id} href={`/planner/${plan.id}`}>
                  <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Week of {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-slate-500">
                        {priorityCount} priorit{priorityCount === 1 ? 'y' : 'ies'} set
                      </p>
                    </div>
                    <span className="text-slate-400">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
