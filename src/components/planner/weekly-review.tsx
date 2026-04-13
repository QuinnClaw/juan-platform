'use client';

interface WeeklyReviewProps {
  whatWorked: string;
  whatDidnt: string;
  nextWeekFocus: string;
  onUpdate: (field: 'what_worked' | 'what_didnt' | 'next_week_focus', value: string) => void;
}

export function WeeklyReviewSection({ whatWorked, whatDidnt, nextWeekFocus, onUpdate }: WeeklyReviewProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
        📊 Weekly Review
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        Reflect honestly. This is for your growth — not your guilt.
      </p>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-green-600 dark:text-green-400">
            ✨ What worked well?
          </label>
          <textarea
            value={whatWorked}
            onChange={(e) => onUpdate('what_worked', e.target.value)}
            placeholder="What strategies, habits, or approaches helped you this week?"
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-green-50/50 p-3 text-sm text-slate-700 placeholder-slate-400 focus:border-green-400 focus:outline-none dark:border-slate-600 dark:bg-green-900/10 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-amber-600 dark:text-amber-400">
            🔧 What didn&apos;t work?
          </label>
          <textarea
            value={whatDidnt}
            onChange={(e) => onUpdate('what_didnt', e.target.value)}
            placeholder="What got in the way? What would you change?"
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-amber-50/50 p-3 text-sm text-slate-700 placeholder-slate-400 focus:border-amber-400 focus:outline-none dark:border-slate-600 dark:bg-amber-900/10 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-teal-600 dark:text-teal-400">
            🎯 Next week&apos;s focus
          </label>
          <textarea
            value={nextWeekFocus}
            onChange={(e) => onUpdate('next_week_focus', e.target.value)}
            placeholder="What one thing will make next week a win?"
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-teal-50/50 p-3 text-sm text-slate-700 placeholder-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-600 dark:bg-teal-900/10 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}
