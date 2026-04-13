'use client';

import { usePlanner } from '@/lib/planner-hooks';
import { Priorities } from './priorities';
import { DayColumn } from './day-column';
import { HabitTracker } from './habit-tracker';
import { BrainDump } from './brain-dump';
import { DistractionLogComponent } from './distraction-log';
import { WeeklyReviewSection } from './weekly-review';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { formatWeekRange } from '@/lib/utils';
import Link from 'next/link';

interface PlannerViewProps {
  planId?: string;
}

export function PlannerView({ planId }: PlannerViewProps) {
  return (
    <ProtectedRoute>
      <PlannerContent planId={planId} />
    </ProtectedRoute>
  );
}

function PlannerContent({ planId }: PlannerViewProps) {
  const {
    plan,
    dailyBlocks,
    habits,
    habitEntries,
    brainDump,
    distractions,
    review,
    loading,
    saving,
    updatePriorities,
    updateTimeBlocks,
    updateTasks,
    toggleHabit,
    updateHabitName,
    updateBrainDump,
    addDistraction,
    updateReview,
    savePlan,
  } = usePlanner(planId);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading your planner...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600 dark:text-slate-300">Plan not found</p>
          <Link href="/dashboard" className="mt-4 inline-block text-teal-600 hover:text-teal-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Weekly Planner
          </h1>
          <p className="text-sm text-slate-500">
            {formatWeekRange(plan.week_start_date)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
              Saving...
            </span>
          )}
          {!saving && (
            <span className="text-xs text-slate-400">✓ Saved</span>
          )}
          <button
            onClick={savePlan}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition"
          >
            Save Now
          </button>
        </div>
      </div>

      {/* Priorities */}
      <div className="mb-6">
        <Priorities
          priorities={plan.priorities}
          onChange={updatePriorities}
        />
      </div>

      {/* Day Columns */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {dailyBlocks
          .sort((a, b) => a.day_of_week - b.day_of_week)
          .map((block) => (
            <DayColumn
              key={block.id}
              dayIndex={block.day_of_week}
              timeBlocks={block.time_blocks}
              tasks={block.tasks}
              onUpdateTimeBlocks={(blocks) => updateTimeBlocks(block.day_of_week, blocks)}
              onUpdateTasks={(tasks) => updateTasks(block.day_of_week, tasks)}
            />
          ))}
      </div>

      {/* Bottom Section: 2-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          <HabitTracker
            habits={habits}
            entries={habitEntries}
            planId={plan.id}
            onToggle={toggleHabit}
            onUpdateName={updateHabitName}
          />
          <BrainDump
            content={brainDump?.content || ''}
            onChange={updateBrainDump}
          />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <DistractionLogComponent
            distractions={distractions}
            onAdd={addDistraction}
          />
          <WeeklyReviewSection
            whatWorked={review?.what_worked || ''}
            whatDidnt={review?.what_didnt || ''}
            nextWeekFocus={review?.next_week_focus || ''}
            onUpdate={updateReview}
          />
        </div>
      </div>
    </div>
  );
}
