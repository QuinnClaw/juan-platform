'use client';

import { useState } from 'react';
import type { DistractionLog as DistractionLogType } from '@/types/database';

interface DistractionLogProps {
  distractions: DistractionLogType[];
  onAdd: (content: string) => void;
}

export function DistractionLogComponent({ distractions, onAdd }: DistractionLogProps) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput('');
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
        🚫 Distraction Log
      </h2>
      <p className="mb-3 text-sm text-slate-500">
        Notice it. Log it. Let it go. No judgment — just awareness.
      </p>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="What distracted you?"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        />
        <button
          onClick={handleAdd}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
        >
          Log
        </button>
      </div>

      {distractions.length > 0 && (
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {distractions.map((d) => (
            <div key={d.id} className="flex items-start gap-2 text-sm">
              <span className="shrink-0 text-xs text-slate-400">
                {new Date(d.logged_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-slate-600 dark:text-slate-300">{d.content}</span>
            </div>
          ))}
        </div>
      )}

      {distractions.length > 0 && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            📊 {distractions.length} distraction{distractions.length !== 1 ? 's' : ''} logged this week.
            {distractions.length >= 5 && ' Consider blocking your top distractors during focus time.'}
          </p>
        </div>
      )}
    </div>
  );
}
