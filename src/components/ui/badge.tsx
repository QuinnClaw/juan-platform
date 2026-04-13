import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'pro' | 'business';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300': variant === 'default',
          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': variant === 'success',
          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': variant === 'warning',
          'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400': variant === 'pro',
          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400': variant === 'business',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
