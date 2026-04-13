'use client';

import { DAY_NAMES } from '@/lib/utils';
import type { Habit, HabitEntry } from '@/types/database';

interface HabitTrackerProps {
  habits: Habit[];
  entries: HabitEntry[];
  planId: string;
  onToggle: (habitId: string, dayOfWeek: number) => void;
  onUpdateName: (habitId: string, name: string) => void;
}

export function HabitTracker({ habits, entries, planId, onToggle, onUpdateName }: HabitTrackerProps) {
  const isCompleted = (habitId: string, dayOfWeek: number) => {
    return entries.some(
      e => e.habit_id === habitId && e.day_of_week === dayOfWeek && e.plan_id === planId && e.completed
    );
  };

  const totalChecks = habits.length * 5;
  const completedChecks = entries.filter(e => e.plan_id === planId && e.completed).length;
  const progress = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          ✅ Habit Tracker
        </h2>
        <span className="text-sm font-medium text-teal-600">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="animate-progress h-full rounded-full bg-teal-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="pb-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-40">
                Habit
              </th>
              {DAY_NAMES.map((day, i) => (
                <th key={i} className="pb-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {day.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {habits.slice(0, 5).map((habit) => (
              <tr key={habit.id}>
                <td className="py-2 pr-3">
                  <input
                    type="text"
                    value={habit.name}
                    onChange={(e) => onUpdateName(habit.id, e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none dark:text-slate-200"
                    placeholder="Habit name..."
                  />
                </td>
                {Array.from({ length: 5 }, (_, dayIndex) => (
                  <td key={dayIndex} className="py-2 text-center">
                    <button
                      onClick={() => onToggle(habit.id, dayIndex)}
                      className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                        isCompleted(habit.id, dayIndex)
                          ? 'bg-teal-500 text-white shadow-sm animate-check'
                          : 'bg-slate-100 text-slate-300 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-500 dark:hover:bg-slate-600'
                      }`}
                    >
                      {isCompleted(habit.id, dayIndex) ? '✓' : ''}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
