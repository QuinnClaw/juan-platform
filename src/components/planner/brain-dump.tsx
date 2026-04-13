'use client';

interface BrainDumpProps {
  content: string;
  onChange: (content: string) => void;
}

export function BrainDump({ content, onChange }: BrainDumpProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
        🧠 Brain Dump
      </h2>
      <p className="mb-3 text-sm text-slate-500">
        Get everything out of your head. No structure needed — just dump it here.
      </p>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Whatever's on your mind... tasks, ideas, worries, random thoughts..."
        rows={6}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 placeholder-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
      />
    </div>
  );
}
