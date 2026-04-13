import { type ClassValue, clsx } from 'clsx';

// Simple clsx alternative without tailwind-merge to keep deps light
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getMonday(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatWeekRange(weekStart: string | Date): string {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(end.getDate() + 4);
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
