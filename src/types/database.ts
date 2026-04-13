export type SubscriptionTier = 'free' | 'pro' | 'business';

export interface UserProfile {
  id: string;
  display_name: string | null;
  subscription_tier: SubscriptionTier;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimeBlock {
  id: string;
  label: string;
  startTime: string;
  duration: number; // minutes
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface WeeklyPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  priorities: string[];
  created_at: string;
  updated_at: string;
}

export interface DailyBlock {
  id: string;
  plan_id: string;
  day_of_week: number; // 0=Monday, 4=Friday
  time_blocks: TimeBlock[];
  tasks: Task[];
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface HabitEntry {
  id: string;
  habit_id: string;
  plan_id: string;
  day_of_week: number;
  completed: boolean;
}

export interface BrainDump {
  id: string;
  plan_id: string;
  content: string;
}

export interface DistractionLog {
  id: string;
  plan_id: string;
  content: string;
  logged_at: string;
}

export interface WeeklyReview {
  id: string;
  plan_id: string;
  what_worked: string;
  what_didnt: string;
  next_week_focus: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserProfile;
        Insert: Partial<UserProfile> & { id: string };
        Update: Partial<UserProfile>;
      };
      weekly_plans: {
        Row: WeeklyPlan;
        Insert: Omit<WeeklyPlan, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<WeeklyPlan>;
      };
      daily_blocks: {
        Row: DailyBlock;
        Insert: Omit<DailyBlock, 'id'>;
        Update: Partial<DailyBlock>;
      };
      habits: {
        Row: Habit;
        Insert: Omit<Habit, 'id' | 'created_at'>;
        Update: Partial<Habit>;
      };
      habit_entries: {
        Row: HabitEntry;
        Insert: Omit<HabitEntry, 'id'>;
        Update: Partial<HabitEntry>;
      };
      brain_dumps: {
        Row: BrainDump;
        Insert: Omit<BrainDump, 'id'>;
        Update: Partial<BrainDump>;
      };
      distraction_log: {
        Row: DistractionLog;
        Insert: Omit<DistractionLog, 'id' | 'logged_at'>;
        Update: Partial<DistractionLog>;
      };
      weekly_reviews: {
        Row: WeeklyReview;
        Insert: Omit<WeeklyReview, 'id'>;
        Update: Partial<WeeklyReview>;
      };
    };
  };
}
