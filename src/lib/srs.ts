import type { CardVariantKind, ReviewState } from '../types'

const MIN_EASE = 1.3
const DEFAULT_EASE = 2.5

export function getReviewKey(
  pairId: string,
  studyItemId: string,
  variant: CardVariantKind,
) {
  return `${pairId}:${studyItemId}:${variant}`
}

export function updateReviewState(
  previous: ReviewState | undefined,
  pairId: string,
  studyItemId: string,
  variant: CardVariantKind,
  score: number,
  reviewedAt: number,
): ReviewState {
  const baseState =
    previous ??
    ({
      key: getReviewKey(pairId, studyItemId, variant),
      pairId,
      studyItemId,
      variant,
      dueAt: reviewedAt,
      intervalDays: 0,
      ease: DEFAULT_EASE,
      repetitions: 0,
      lapses: 0,
    } satisfies ReviewState)

  let ease = baseState.ease
  let intervalDays = baseState.intervalDays
  let repetitions = baseState.repetitions
  let lapses = baseState.lapses
  let dueAt = reviewedAt

  if (score === 0) {
    ease = Math.max(MIN_EASE, ease - 0.2)
    intervalDays = 0
    repetitions = 0
    lapses += 1
    dueAt = reviewedAt + 20 * 60 * 1000
  } else if (score === 1) {
    ease = Math.max(MIN_EASE, ease - 0.15)
    repetitions += 1
    intervalDays = Math.max(1, Math.round(Math.max(1, intervalDays) * 1.2))
    dueAt = reviewedAt + intervalDays * 24 * 60 * 60 * 1000
  } else if (score === 2) {
    repetitions += 1
    intervalDays =
      baseState.repetitions === 0
        ? 2
        : Math.max(2, Math.round(Math.max(1, intervalDays) * ease))
    dueAt = reviewedAt + intervalDays * 24 * 60 * 60 * 1000
  } else {
    ease = ease + 0.1
    repetitions += 1
    intervalDays =
      baseState.repetitions === 0
        ? 4
        : Math.max(3, Math.round(Math.max(1, intervalDays) * (ease + 0.35)))
    dueAt = reviewedAt + intervalDays * 24 * 60 * 60 * 1000
  }

  return {
    ...baseState,
    ease,
    intervalDays,
    repetitions,
    lapses,
    dueAt,
    lastReviewedAt: reviewedAt,
    lastScore: score,
  }
}
