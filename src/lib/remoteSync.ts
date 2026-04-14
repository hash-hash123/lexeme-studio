import type { PersistedAppState, ReviewState, ReviewLog } from '../types'
import {
  supabase,
  type RemoteReviewStateRow,
  type RemoteReviewLogRow,
} from './supabase'

/**
 * Fetch the authenticated user's state from Supabase and merge it into a
 * PersistedAppState shape the app already understands. Returns null if the
 * profile row is missing (new user) so the caller can fall back to defaults.
 */
export async function loadRemoteState(
  userId: string,
): Promise<PersistedAppState | null> {
  const [{ data: profile }, { data: states }, { data: logs }] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('review_states').select('*').eq('user_id', userId),
    supabase
      .from('review_logs')
      .select('*')
      .eq('user_id', userId)
      .order('reviewed_at', { ascending: false })
      .limit(400),
  ])

  if (!profile) return null

  const reviewStates: Record<string, ReviewState> = {}
  for (const row of (states ?? []) as RemoteReviewStateRow[]) {
    const key = `${row.pair_id}:${row.study_item_id}:${row.variant}`
    reviewStates[key] = {
      key,
      pairId: row.pair_id,
      studyItemId: row.study_item_id,
      variant: row.variant as ReviewState['variant'],
      dueAt: new Date(row.due_at).getTime(),
      intervalDays: Number(row.interval_days),
      ease: Number(row.ease),
      repetitions: row.repetitions,
      lapses: row.lapses,
      lastReviewedAt: row.last_reviewed_at
        ? new Date(row.last_reviewed_at).getTime()
        : undefined,
      lastScore: row.last_score ?? undefined,
    }
  }

  const reviewLogs: ReviewLog[] = ((logs ?? []) as RemoteReviewLogRow[])
    .map((row) => ({
      id: `${row.pair_id}:${row.study_item_id}:${row.variant}:${row.reviewed_at}`,
      pairId: row.pair_id,
      studyItemId: row.study_item_id,
      variant: row.variant as ReviewLog['variant'],
      score: row.score,
      reviewedAt: new Date(row.reviewed_at).getTime(),
    }))
    .reverse()

  return {
    version: 1,
    profile: {
      nativeLanguage: profile.native_language,
      targetLanguage: profile.target_language,
      goalLevel: profile.goal_level as PersistedAppState['profile']['goalLevel'],
      dailyMinutes: profile.daily_minutes,
      learningPurpose: profile.learning_purpose as PersistedAppState['profile']['learningPurpose'],
    },
    reviewStates,
    reviewLogs,
  }
}

export async function upsertRemoteProfile(
  userId: string,
  profile: PersistedAppState['profile'],
) {
  await supabase.from('profiles').upsert({
    user_id: userId,
    native_language: profile.nativeLanguage,
    target_language: profile.targetLanguage,
    goal_level: profile.goalLevel,
    daily_minutes: profile.dailyMinutes,
    learning_purpose: profile.learningPurpose,
    updated_at: new Date().toISOString(),
  })
}

export async function upsertRemoteReviewState(
  userId: string,
  state: ReviewState,
) {
  await supabase.from('review_states').upsert({
    user_id: userId,
    pair_id: state.pairId,
    study_item_id: state.studyItemId,
    variant: state.variant,
    due_at: new Date(state.dueAt).toISOString(),
    interval_days: state.intervalDays,
    ease: state.ease,
    repetitions: state.repetitions,
    lapses: state.lapses,
    last_reviewed_at: state.lastReviewedAt
      ? new Date(state.lastReviewedAt).toISOString()
      : null,
    last_score: state.lastScore ?? null,
    updated_at: new Date().toISOString(),
  })
}

export async function insertRemoteReviewLog(
  userId: string,
  log: ReviewLog,
) {
  await supabase.from('review_logs').insert({
    user_id: userId,
    pair_id: log.pairId,
    study_item_id: log.studyItemId,
    variant: log.variant,
    score: log.score,
    reviewed_at: new Date(log.reviewedAt).toISOString(),
  })
}

/**
 * One-shot migration: push the entire local state into Supabase.
 * Used when a user first signs in and we want to preserve their local work.
 */
export async function pushLocalStateToRemote(
  userId: string,
  state: PersistedAppState,
) {
  await upsertRemoteProfile(userId, state.profile)

  const stateRows = Object.values(state.reviewStates).map((s) => ({
    user_id: userId,
    pair_id: s.pairId,
    study_item_id: s.studyItemId,
    variant: s.variant,
    due_at: new Date(s.dueAt).toISOString(),
    interval_days: s.intervalDays,
    ease: s.ease,
    repetitions: s.repetitions,
    lapses: s.lapses,
    last_reviewed_at: s.lastReviewedAt
      ? new Date(s.lastReviewedAt).toISOString()
      : null,
    last_score: s.lastScore ?? null,
    updated_at: new Date().toISOString(),
  }))

  if (stateRows.length > 0) {
    await supabase.from('review_states').upsert(stateRows)
  }

  const logRows = state.reviewLogs.map((l) => ({
    user_id: userId,
    pair_id: l.pairId,
    study_item_id: l.studyItemId,
    variant: l.variant,
    score: l.score,
    reviewed_at: new Date(l.reviewedAt).toISOString(),
  }))

  if (logRows.length > 0) {
    await supabase.from('review_logs').insert(logRows)
  }
}
