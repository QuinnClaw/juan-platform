'use client';

import { useState } from 'react';
import { generateId, DAY_NAMES } from '@/lib/utils';
import type { TimeBlock, Task } from '@/types/database';

interface DayColumnProps {
  dayIndex: number;
  timeBlocks: TimeBlock[];
  tasks: Task[];
  onUpdateTimeBlocks: (blocks: TimeBlock[]) => void;
  onUpdateTasks: (tasks: Task[]) => void;
}

export function DayColumn({ dayIndex, timeBlocks, tasks, onUpdateTimeBlocks, onUpdateTasks }: DayColumnProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const addTimeBlock = () => {
    const newBlock: TimeBlock = {
      id: generateId(),
      label: '',
      startTime: '09:00',
      duration: 30,
      completed: false,
    };
    onUpdateTimeBlocks([...timeBlocks, newBlock]);
  };

  const updateBlock = (blockId: string, updates: Partial<TimeBlock>) => {
    onUpdateTimeBlocks(
      timeBlocks.map(b => b.id === blockId ? { ...b, ...updates } : b)
    );
  };

  const removeBlock = (blockId: string) => {
    onUpdateTimeBlocks(timeBlocks.filter(b => b.id !== blockId));
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: generateId(),
      text: newTaskText.trim(),
      completed: false,
    };
    onUpdateTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (taskId: string) => {
    onUpdateTasks(
      tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    );
  };

  const removeTask = (taskId: string) => {
    onUpdateTasks(tasks.filter(t => t.id !== taskId));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="border-b border-slate-100 p-4 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">{DAY_NAMES[dayIndex]}</h3>
          {totalTasks > 0 && (
            <span className="text-xs font-medium text-teal-600">{progress}%</span>
          )}
        </div>
        {totalTasks > 0 && (
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className="animate-progress h-full rounded-full bg-teal-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Time Blocks */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Time Blocks</span>
            <button
              onClick={addTimeBlock}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              + Add
            </button>
          </div>
          <div className="space-y-2">
            {timeBlocks.map((block) => (
              <div
                key={block.id}
                className={`group flex items-center gap-2 rounded-lg border p-2 text-xs transition ${
                  block.completed
                    ? 'border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-900/20'
                    : 'border-slate-100 dark:border-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={block.completed}
                  onChange={() => updateBlock(block.id, { completed: !block.completed })}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <input
                  type="time"
                  value={block.startTime}
                  onChange={(e) => updateBlock(block.id, { startTime: e.target.value })}
                  className="w-20 bg-transparent text-slate-600 focus:outline-none dark:text-slate-300"
                />
                <select
                  value={block.duration}
                  onChange={(e) => updateBlock(block.id, { duration: Number(e.target.value) })}
                  className="bg-transparent text-slate-500 focus:outline-none dark:text-slate-400"
                >
                  <option value={15}>15m</option>
                  <option value={30}>30m</option>
                  <option value={45}>45m</option>
                </select>
                <input
                  type="text"
                  value={block.label}
                  onChange={(e) => updateBlock(block.id, { label: e.target.value })}
                  placeholder="What?"
                  className={`flex-1 bg-transparent placeholder-slate-400 focus:outline-none dark:placeholder-slate-500 ${
                    block.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'
                  }`}
                />
                <button
                  onClick={() => removeBlock(block.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition"
                >
                  ×
                </button>
              </div>
            ))}
            {timeBlocks.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-2">No blocks yet</p>
            )}
          </div>
        </div>

        {/* Quick Tasks */}
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Tasks</span>
          <div className="space-y-1.5">
            {tasks.map((task) => (
              <div key={task.id} className="group flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span
                  className={`flex-1 text-sm ${
                    task.completed
                      ? 'line-through text-slate-400'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 text-xs transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add task..."
              className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 placeholder-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
            <button
              onClick={addTask}
              className="rounded bg-teal-100 px-2 py-1 text-xs font-medium text-teal-700 hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-400"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
