import { describe, expect, it } from 'vitest'
import { getReviewKey, updateReviewState } from './srs'

const PAIR = 'ja-en'
const ITEM = 'item1'
const VARIANT = 'recognition' as const

describe('getReviewKey', () => {
  it('concatenates pair, item, and variant', () => {
    expect(getReviewKey(PAIR, ITEM, VARIANT)).toBe('ja-en:item1:recognition')
  })
})

describe('updateReviewState', () => {
  const now = 1_700_000_000_000

  it('initializes a fresh state when previous is undefined', () => {
    const next = updateReviewState(undefined, PAIR, ITEM, VARIANT, 3, now)

    expect(next.key).toBe(getReviewKey(PAIR, ITEM, VARIANT))
    expect(next.repetitions).toBe(1)
    expect(next.lapses).toBe(0)
    expect(next.lastScore).toBe(3)
    expect(next.lastReviewedAt).toBe(now)
    expect(next.dueAt).toBeGreaterThan(now)
  })

  it('resets progress and penalizes ease when the user fails (score 0)', () => {
    const seeded = updateReviewState(undefined, PAIR, ITEM, VARIANT, 3, now)
    const failed = updateReviewState(seeded, PAIR, ITEM, VARIANT, 0, now + 1000)

    expect(failed.lapses).toBe(1)
    expect(failed.repetitions).toBe(0)
    expect(failed.intervalDays).toBe(0)
    expect(failed.ease).toBeLessThan(seeded.ease)
    // Lapsed items should come back within 20 minutes (+/- second for the reviewedAt offset)
    expect(failed.dueAt - (now + 1000)).toBe(20 * 60 * 1000)
  })

  it('ease has a floor of 1.3 even after repeated failures', () => {
    let state = updateReviewState(undefined, PAIR, ITEM, VARIANT, 3, now)
    for (let i = 0; i < 20; i++) {
      state = updateReviewState(state, PAIR, ITEM, VARIANT, 0, now + i * 1000)
    }
    expect(state.ease).toBeGreaterThanOrEqual(1.3)
  })

  it('grows the interval when the user scores 3 (perfect)', () => {
    const first = updateReviewState(undefined, PAIR, ITEM, VARIANT, 3, now)
    const second = updateReviewState(first, PAIR, ITEM, VARIANT, 3, now + 86_400_000)

    expect(second.repetitions).toBe(2)
    expect(second.intervalDays).toBeGreaterThan(first.intervalDays)
    expect(second.ease).toBeGreaterThan(first.ease)
  })

  it('uses expected seed intervals for the first correct review', () => {
    const good = updateReviewState(undefined, PAIR, ITEM, VARIANT, 2, now)
    expect(good.intervalDays).toBe(2)

    const perfect = updateReviewState(undefined, PAIR, ITEM, VARIANT, 3, now)
    expect(perfect.intervalDays).toBe(4)
  })

  it('produces a different next-due time for each score tier', () => {
    const seed = updateReviewState(undefined, PAIR, ITEM, VARIANT, 2, now)
    const hardAgain = updateReviewState(seed, PAIR, ITEM, VARIANT, 1, now + 1000)
    const goodAgain = updateReviewState(seed, PAIR, ITEM, VARIANT, 2, now + 1000)
    const easyAgain = updateReviewState(seed, PAIR, ITEM, VARIANT, 3, now + 1000)

    expect(hardAgain.dueAt).toBeLessThan(goodAgain.dueAt)
    expect(goodAgain.dueAt).toBeLessThan(easyAgain.dueAt)
  })
})
