'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth-context';
import { generateId, getMonday } from './utils';
import type { WeeklyPlan, DailyBlock, Habit, HabitEntry, BrainDump, DistractionLog, WeeklyReview, TimeBlock, Task } from '@/types/database';

export interface PlannerState {
  plan: WeeklyPlan | null;
  dailyBlocks: DailyBlock[];
  habits: Habit[];
  habitEntries: HabitEntry[];
  brainDump: BrainDump | null;
  distractions: DistractionLog[];
  review: WeeklyReview | null;
  loading: boolean;
  saving: boolean;
}

const SAVE_DEBOUNCE_MS = 1000;

export function usePlanner(planId?: string) {
  const { user } = useAuth();
  const [state, setState] = useState<PlannerState>({
    plan: null,
    dailyBlocks: [],
    habits: [],
    habitEntries: [],
    brainDump: null,
    distractions: [],
    review: null,
    loading: true,
    saving: false,
  });

  const saveTimerRef = useRef<NodeJS.Timeout>(null);
  const planRef = useRef(state.plan);
  planRef.current = state.plan;

  // Load existing plan or create new one
  useEffect(() => {
    if (!user) return;

    async function loadOrCreate() {
      if (planId && planId !== 'new') {
        // Load existing plan
        const { data: plan } = await supabase
          .from('weekly_plans')
          .select('*')
          .eq('id', planId)
          .eq('user_id', user!.id)
          .single();

        if (!plan) {
          setState(s => ({ ...s, loading: false }));
          return;
        }

        const [
          { data: dailyBlocks },
          { data: habits },
          { data: habitEntries },
          { data: brainDump },
          { data: distractions },
          { data: review },
        ] = await Promise.all([
          supabase.from('daily_blocks').select('*').eq('plan_id', planId),
          supabase.from('habits').select('*').eq('user_id', user!.id),
          supabase.from('habit_entries').select('*').eq('plan_id', planId),
          supabase.from('brain_dumps').select('*').eq('plan_id', planId).single(),
          supabase.from('distraction_log').select('*').eq('plan_id', planId).order('logged_at', { ascending: false }),
          supabase.from('weekly_reviews').select('*').eq('plan_id', planId).single(),
        ]);

        setState({
          plan: plan as WeeklyPlan,
          dailyBlocks: (dailyBlocks || []) as DailyBlock[],
          habits: (habits || []) as Habit[],
          habitEntries: (habitEntries || []) as HabitEntry[],
          brainDump: (brainDump as BrainDump) || null,
          distractions: (distractions || []) as DistractionLog[],
          review: (review as WeeklyReview) || null,
          loading: false,
          saving: false,
        });
      } else {
        // Create new plan
        const monday = getMonday();
        const newPlan: WeeklyPlan = {
          id: generateId(),
          user_id: user!.id,
          week_start_date: monday.toISOString().split('T')[0],
          priorities: ['', '', ''],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Create daily blocks for Mon-Fri
        const newDailyBlocks: DailyBlock[] = Array.from({ length: 5 }, (_, i) => ({
          id: generateId(),
          plan_id: newPlan.id,
          day_of_week: i,
          time_blocks: [],
          tasks: [],
        }));

        // Load existing habits or create defaults
        const { data: existingHabits } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', user!.id);

        let habits = (existingHabits || []) as Habit[];
        if (habits.length === 0) {
          habits = [
            { id: generateId(), user_id: user!.id, name: 'Exercise', created_at: new Date().toISOString() },
            { id: generateId(), user_id: user!.id, name: 'Meditate', created_at: new Date().toISOString() },
            { id: generateId(), user_id: user!.id, name: 'Read', created_at: new Date().toISOString() },
            { id: generateId(), user_id: user!.id, name: 'Water (8 glasses)', created_at: new Date().toISOString() },
            { id: generateId(), user_id: user!.id, name: 'Sleep by 11pm', created_at: new Date().toISOString() },
          ];
        }

        const brainDump: BrainDump = {
          id: generateId(),
          plan_id: newPlan.id,
          content: '',
        };

        const review: WeeklyReview = {
          id: generateId(),
          plan_id: newPlan.id,
          what_worked: '',
          what_didnt: '',
          next_week_focus: '',
        };

        setState({
          plan: newPlan,
          dailyBlocks: newDailyBlocks,
          habits,
          habitEntries: [],
          brainDump,
          distractions: [],
          review,
          loading: false,
          saving: false,
        });
      }
    }

    loadOrCreate();
  }, [user, planId]);

  // Debounced save
  const savePlan = useCallback(async () => {
    const currentPlan = planRef.current;
    if (!currentPlan || !user) return;

    setState(s => ({ ...s, saving: true }));

    try {
      // Upsert plan
      await supabase.from('weekly_plans').upsert({
        id: currentPlan.id,
        user_id: currentPlan.user_id,
        week_start_date: currentPlan.week_start_date,
        priorities: currentPlan.priorities as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      });

      // Upsert daily blocks
      for (const block of state.dailyBlocks) {
        await supabase.from('daily_blocks').upsert({
          id: block.id,
          plan_id: block.plan_id,
          day_of_week: block.day_of_week,
          time_blocks: block.time_blocks as unknown as Record<string, unknown>,
          tasks: block.tasks as unknown as Record<string, unknown>,
        });
      }

      // Upsert habits
      for (const habit of state.habits) {
        await supabase.from('habits').upsert({
          id: habit.id,
          user_id: habit.user_id,
          name: habit.name,
        });
      }

      // Upsert habit entries
      for (const entry of state.habitEntries) {
        await supabase.from('habit_entries').upsert({
          id: entry.id,
          habit_id: entry.habit_id,
          plan_id: entry.plan_id,
          day_of_week: entry.day_of_week,
          completed: entry.completed,
        });
      }

      // Upsert brain dump
      if (state.brainDump) {
        await supabase.from('brain_dumps').upsert({
          id: state.brainDump.id,
          plan_id: state.brainDump.plan_id,
          content: state.brainDump.content,
        });
      }

      // Upsert review
      if (state.review) {
        await supabase.from('weekly_reviews').upsert({
          id: state.review.id,
          plan_id: state.review.plan_id,
          what_worked: state.review.what_worked,
          what_didnt: state.review.what_didnt,
          next_week_focus: state.review.next_week_focus,
        });
      }
    } catch (err) {
      console.error('Save error:', err);
    }

    setState(s => ({ ...s, saving: false }));
  }, [user, state.dailyBlocks, state.habits, state.habitEntries, state.brainDump, state.review]);

  const debouncedSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(savePlan, SAVE_DEBOUNCE_MS);
  }, [savePlan]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Actions
  const updatePriorities = useCallback((priorities: string[]) => {
    setState(s => {
      if (!s.plan) return s;
      return { ...s, plan: { ...s.plan, priorities } };
    });
    debouncedSave();
  }, [debouncedSave]);

  const updateTimeBlocks = useCallback((dayIndex: number, timeBlocks: TimeBlock[]) => {
    setState(s => ({
      ...s,
      dailyBlocks: s.dailyBlocks.map(b =>
        b.day_of_week === dayIndex ? { ...b, time_blocks: timeBlocks } : b
      ),
    }));
    debouncedSave();
  }, [debouncedSave]);

  const updateTasks = useCallback((dayIndex: number, tasks: Task[]) => {
    setState(s => ({
      ...s,
      dailyBlocks: s.dailyBlocks.map(b =>
        b.day_of_week === dayIndex ? { ...b, tasks } : b
      ),
    }));
    debouncedSave();
  }, [debouncedSave]);

  const toggleHabit = useCallback((habitId: string, dayOfWeek: number) => {
    setState(s => {
      const existing = s.habitEntries.find(
        e => e.habit_id === habitId && e.day_of_week === dayOfWeek && e.plan_id === s.plan?.id
      );
      if (existing) {
        return {
          ...s,
          habitEntries: s.habitEntries.map(e =>
            e.id === existing.id ? { ...e, completed: !e.completed } : e
          ),
        };
      }
      return {
        ...s,
        habitEntries: [
          ...s.habitEntries,
          {
            id: generateId(),
            habit_id: habitId,
            plan_id: s.plan!.id,
            day_of_week: dayOfWeek,
            completed: true,
          },
        ],
      };
    });
    debouncedSave();
  }, [debouncedSave]);

  const updateHabitName = useCallback((habitId: string, name: string) => {
    setState(s => ({
      ...s,
      habits: s.habits.map(h => h.id === habitId ? { ...h, name } : h),
    }));
    debouncedSave();
  }, [debouncedSave]);

  const updateBrainDump = useCallback((content: string) => {
    setState(s => ({
      ...s,
      brainDump: s.brainDump ? { ...s.brainDump, content } : null,
    }));
    debouncedSave();
  }, [debouncedSave]);

  const addDistraction = useCallback(async (content: string) => {
    if (!state.plan) return;
    const newDistraction: DistractionLog = {
      id: generateId(),
      plan_id: state.plan.id,
      content,
      logged_at: new Date().toISOString(),
    };
    setState(s => ({
      ...s,
      distractions: [newDistraction, ...s.distractions],
    }));

    await supabase.from('distraction_log').insert({
      id: newDistraction.id,
      plan_id: newDistraction.plan_id,
      content: newDistraction.content,
    });
  }, [state.plan]);

  const updateReview = useCallback((field: keyof Pick<WeeklyReview, 'what_worked' | 'what_didnt' | 'next_week_focus'>, value: string) => {
    setState(s => ({
      ...s,
      review: s.review ? { ...s.review, [field]: value } : null,
    }));
    debouncedSave();
  }, [debouncedSave]);

  return {
    ...state,
    updatePriorities,
    updateTimeBlocks,
    updateTasks,
    toggleHabit,
    updateHabitName,
    updateBrainDump,
    addDistraction,
    updateReview,
    savePlan,
  };
}
