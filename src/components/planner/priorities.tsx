'use client';

import { useState } from 'react';

interface PrioritiesProps {
  priorities: string[];
  onChange: (priorities: string[]) => void;
}

export function Priorities({ priorities, onChange }: PrioritiesProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleChange = (index: number, value: string) => {
    const updated = [...priorities];
    updated[index] = value;
    onChange(updated);
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const updated = [...priorities];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    onChange(updated);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
        🎯 Top 3 Priorities
      </h2>
      <div className="space-y-3">
        {priorities.map((priority, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition dark:border-slate-600 ${
              dragIndex === index ? 'opacity-50 border-teal-400' : 'hover:border-teal-200'
            }`}
          >
            <div className="flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
              {index + 1}
            </div>
            <span className="cursor-grab text-slate-400 hover:text-slate-600 dark:text-slate-500">⠿</span>
            <input
              type="text"
              value={priority}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`Priority #${index + 1}`}
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white dark:placeholder-slate-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
