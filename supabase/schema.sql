-- Juan Digital Platform - Database Schema
-- Run this in your Supabase SQL Editor

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business')),
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly Plans
CREATE TABLE IF NOT EXISTS public.weekly_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  priorities JSONB DEFAULT '["","",""]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Blocks (Mon-Fri for each plan)
CREATE TABLE IF NOT EXISTS public.daily_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.weekly_plans(id) ON DELETE CASCADE NOT NULL,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 4),
  time_blocks JSONB DEFAULT '[]'::jsonb,
  tasks JSONB DEFAULT '[]'::jsonb
);

-- Habits (reusable across weeks)
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habit Entries (per plan, per day)
CREATE TABLE IF NOT EXISTS public.habit_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.weekly_plans(id) ON DELETE CASCADE NOT NULL,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 4),
  completed BOOLEAN DEFAULT FALSE
);

-- Brain Dumps (one per plan)
CREATE TABLE IF NOT EXISTS public.brain_dumps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.weekly_plans(id) ON DELETE CASCADE NOT NULL,
  content TEXT DEFAULT ''
);

-- Distraction Log
CREATE TABLE IF NOT EXISTS public.distraction_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.weekly_plans(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly Reviews
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.weekly_plans(id) ON DELETE CASCADE NOT NULL,
  what_worked TEXT DEFAULT '',
  what_didnt TEXT DEFAULT '',
  next_week_focus TEXT DEFAULT ''
);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distraction_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;

-- Users: can only access their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Weekly Plans: users can only access their own plans
CREATE POLICY "Users can view own plans" ON public.weekly_plans
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own plans" ON public.weekly_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans" ON public.weekly_plans
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans" ON public.weekly_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Daily Blocks: users can access blocks for their own plans
CREATE POLICY "Users can view own daily blocks" ON public.daily_blocks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.weekly_plans WHERE id = daily_blocks.plan_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can create own daily blocks" ON public.daily_blocks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.weekly_plans WHERE id = daily_blocks.plan_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update own daily blocks" ON public.daily_blocks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.weekly_plans WHERE id = daily_blocks.plan_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete own daily blocks" ON public.daily_blocks
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.weekly_plans WHERE id = daily_blocks.plan_id AND user_id = auth.uid())
  );

-- Habits: users can only manage their own habits
CREATE POLICY "Users can view own habits" ON public.habits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own habits" ON public.habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON public.habits
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON public.habits
  FOR DELETE USING (auth.uid() = user_id);

-- Habit Entries: users can access entries for their own habits
CREATE POLICY "Users can view own habit entries" ON public.habit_entries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.habits WHERE id = habit_entries.habit_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can create own habit entries" ON public.habit_entries
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.habits WHERE id = habit_entries.habit_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update own habit entries" ON public.habit_entries
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.habits WHERE id = habit_entries.habit_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete own habit entries" ON public.habit_entries
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.habits WHERE id = habit_entries.habit_id AND user_id = auth.uid())
  );

-- Brain Dumps: users can access dumps for their own plans
CREATE POLICY "Users can view own brain dumps" ON public.brain_dumps
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.weekly_plans WHERE id = brain_dumps.plan_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can create own brain dumps" ON public.brain_dumps
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.weekly_plans WHERE id = brain_dumps.plan_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update own brain dumps" ON public.brain_dumps
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.weekly_plans WHERE id = brain_dumps.plan_id AND user_id = auth.uid())
  );

-- Distraction Log: users can access logs for their own plans
CREATE POLICY "Users can view own distractions" ON public.distraction_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.weekly_plans WHERE id = distraction_log.plan_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can create own distractions" ON public.distraction_log
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.weekly_plans WHERE id = distraction_log.plan_id AND user_id = auth.uid())
  );

-- Weekly Reviews: users can access reviews for their own plans
CREATE POLICY "Users can view own reviews" ON public.weekly_reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.weekly_plans WHERE id = weekly_reviews.plan_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can create own reviews" ON public.weekly_reviews
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.weekly_plans WHERE id = weekly_reviews.plan_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update own reviews" ON public.weekly_reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.weekly_plans WHERE id = weekly_reviews.plan_id AND user_id = auth.uid())
  );

-- ========================================
-- INDEXES for performance
-- ========================================
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_id ON public.weekly_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_week_start ON public.weekly_plans(week_start_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_blocks_plan_id ON public.daily_blocks(plan_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_entries_plan ON public.habit_entries(plan_id);
CREATE INDEX IF NOT EXISTS idx_habit_entries_habit ON public.habit_entries(habit_id);
CREATE INDEX IF NOT EXISTS idx_brain_dumps_plan ON public.brain_dumps(plan_id);
CREATE INDEX IF NOT EXISTS idx_distraction_log_plan ON public.distraction_log(plan_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reviews_plan ON public.weekly_reviews(plan_id);

-- ========================================
-- FUNCTION: Auto-create user profile on signup
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, display_name, subscription_tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
