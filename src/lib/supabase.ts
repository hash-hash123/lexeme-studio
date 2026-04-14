import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Publishable (anon) key is safe to expose — it only grants access through RLS policies.
const SUPABASE_URL = 'https://ngzngwjdrxsnoknhkijq.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_xXR8z19Ju1mjs1GZDQRNKA_zv11SjId'

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)

export interface RemoteProfileRow {
  user_id: string
  native_language: 'ja' | 'en' | 'de'
  target_language: 'ja' | 'en' | 'de'
  goal_level: string
  daily_minutes: number
  learning_purpose: string
  updated_at: string
}

export interface RemoteReviewStateRow {
  user_id: string
  pair_id: string
  study_item_id: string
  variant: string
  due_at: string
  interval_days: number
  ease: number
  repetitions: number
  lapses: number
  last_reviewed_at: string | null
  last_score: number | null
  updated_at: string
}

export interface RemoteReviewLogRow {
  id?: number
  user_id: string
  pair_id: string
  study_item_id: string
  variant: string
  score: number
  reviewed_at: string
}
