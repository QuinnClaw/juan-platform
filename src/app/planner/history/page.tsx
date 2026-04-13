'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { WeeklyPlan } from '@/types/database';

interface PlanWithStats extends WeeklyPlan {
  taskCount: number;
  completedTasks: number;
  habitCompletion: number;
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryContent />
    </ProtectedRoute>
  );
}

function HistoryContent() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PlanWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      if (!user) return;

      const { data: rawPlans } = await supabase
        .from('weekly_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start_date', { ascending: false });

      if (!rawPlans) {
        setLoading(false);
        return;
      }

      const plansWithStats: PlanWithStats[] = await Promise.all(
        (rawPlans as WeeklyPlan[]).map(async (plan) => {
          // Get task stats from daily_blocks
          const { data: blocks } = await supabase
            .from('daily_blocks')
            .select('tasks')
            .eq('plan_id', plan.id);

          let taskCount = 0;
          let completedTasks = 0;
          if (blocks) {
            for (const block of blocks) {
              const tasks = (block.tasks as unknown as { completed: boolean }[]) || [];
              taskCount += tasks.length;
              completedTasks += tasks.filter((t) => t.completed).length;
            }
          }

          // Get habit completion
          const { data: habitEntries } = await supabase
            .from('habit_entries')
            .select('completed')
            .eq('plan_id', plan.id);

          const totalEntries = (habitEntries || []).length;
          const completedEntries = (habitEntries || []).filter(e => e.completed).length;
          const habitCompletion = totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0;

          return {
            ...plan,
            taskCount,
            completedTasks,
            habitCompletion,
          };
        })
      );

      setPlans(plansWithStats);
      setLoading(false);
    }

    loadPlans();
  }, [user]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Plan History</h1>
          <p className="mt-1 text-slate-500">Review past weeks and track your progress</p>
        </div>
        <Link href="/planner/new">
          <Button>+ New Plan</Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
          <p className="text-slate-500">Loading history...</p>
        </div>
      ) : plans.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-500 mb-4">No plans yet. Start your first week!</p>
          <Link href="/planner/new">
            <Button>Create First Plan</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => {
            const weekStart = new Date(plan.week_start_date);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 4);
            const taskProgress = plan.taskCount > 0
              ? Math.round((plan.completedTasks / plan.taskCount) * 100)
              : 0;

            return (
              <Link key={plan.id} href={`/planner/${plan.id}`}>
                <Card hover className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Week of {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – {weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </h3>
                    <div className="mt-1 flex gap-4 text-sm text-slate-500">
                      <span>{(plan.priorities || []).filter(Boolean).length} priorities</span>
                      <span>{plan.completedTasks}/{plan.taskCount} tasks</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-teal-600">{taskProgress}%</div>
                      <div className="text-xs text-slate-400">Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{plan.habitCompletion}%</div>
                      <div className="text-xs text-slate-400">Habits</div>
                    </div>
                    <span className="text-slate-400">→</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
