import {
  LEXEME_RECORD,
  LESSON_RECORD,
  STUDY_ITEM_RECORD,
  buildClozePrompt,
  getLessonsForPair,
  getStudyItemsForPair,
} from '../data/content'
import { getReviewKey } from './srs'
import type {
  CardVariantKind,
  Lesson,
  Lexeme,
  PartOfSpeech,
  ReviewLog,
  ReviewState,
  StudyItem,
} from '../types'

const DAY_MS = 24 * 60 * 60 * 1000
const MAX_NEW_ITEMS = 6

export interface LessonProgress {
  lesson: Lesson
  status: 'locked' | 'active' | 'done'
  seenVariants: number
  totalVariants: number
  mastery: number
}

export interface QueueCard {
  key: string
  item: StudyItem
  lesson: Lesson
  lexeme: Lexeme
  variant: CardVariantKind
  translationText: string
  note: string
  dueAt?: number
  lane: 'due' | 'new'
  clozePrompt?: string
  clozeAnswer?: string
  clozeFull?: string
}

export interface BrowserEntry {
  item: StudyItem
  lesson: Lesson
  lexeme: Lexeme
  translationText: string
  note: string
  mastery: number
  statusKey: 'notStarted' | 'learning' | 'strong'
}

export function getLessonProgress(
  pairId: string,
  reviewStates: Record<string, ReviewState>,
) {
  const lessons = getLessonsForPair(pairId)
  let unlocked = true

  return lessons.map((lesson) => {
    let totalVariants = 0
    let seenVariants = 0
    let masteredVariants = 0

    lesson.studyItemIds.forEach((studyItemId) => {
      const item = STUDY_ITEM_RECORD[studyItemId]
      const variants = item?.variants ?? (['recognition', 'recall'] as CardVariantKind[])
      totalVariants += variants.length

      variants.forEach((variant) => {
        const state = reviewStates[getReviewKey(pairId, studyItemId, variant)]

        if (state) {
          seenVariants += 1
        }

        if (state && state.intervalDays >= 3 && (state.lastScore ?? 0) >= 2) {
          masteredVariants += 1
        }
      })
    })

    const status: LessonProgress['status'] = !unlocked
      ? 'locked'
      : seenVariants === totalVariants && totalVariants > 0
        ? 'done'
        : 'active'

    if (unlocked && seenVariants < totalVariants) {
      unlocked = false
    }

    return {
      lesson,
      status,
      seenVariants,
      totalVariants,
      mastery: totalVariants === 0 ? 0 : masteredVariants / totalVariants,
    }
  })
}

export function getItemMastery(
  pairId: string,
  itemId: string,
  reviewStates: Record<string, ReviewState>,
) {
  const item = STUDY_ITEM_RECORD[itemId]
  const variants = item?.variants ?? (['recognition', 'recall'] as CardVariantKind[])
  const states = variants
    .map((variant) => reviewStates[getReviewKey(pairId, itemId, variant)])
    .filter(Boolean)

  if (states.length === 0) {
    return { value: 0, statusKey: 'notStarted' as const }
  }

  const value =
    states.reduce((sum, state) => {
      if (!state) return sum
      return sum + Math.min(state.intervalDays / 4, 1)
    }, 0) / variants.length

  return {
    value,
    statusKey:
      states.length === variants.length &&
      states.every((state) => (state?.intervalDays ?? 0) >= 3)
        ? ('strong' as const)
        : ('learning' as const),
  }
}

export function buildQueueCards(
  pairId: string,
  reviewStates: Record<string, ReviewState>,
) {
  const now = Date.now()
  const progress = getLessonProgress(pairId, reviewStates)
  const dueCards: QueueCard[] = []
  const newCards: QueueCard[] = []

  progress
    .filter((entry) => entry.status !== 'locked')
    .forEach((entry) => {
      entry.lesson.studyItemIds.forEach((studyItemId) => {
        const item = STUDY_ITEM_RECORD[studyItemId]
        const lexeme = LEXEME_RECORD[item.lexemeId]
        const translation =
          lexeme.senses[0].translations.find((candidate) => candidate.pairId === pairId) ??
          lexeme.senses[0].translations[0]

        const cloze = buildClozePrompt(lexeme)

        item.variants.forEach((variant) => {
          if (variant === 'cloze' && !cloze) return

          const key = getReviewKey(pairId, item.id, variant)
          const state = reviewStates[key]
          const clozeFields =
            variant === 'cloze' && cloze
              ? {
                  clozePrompt: cloze.prompt,
                  clozeAnswer: cloze.answer,
                  clozeFull: cloze.full,
                }
              : {}

          if (state && state.dueAt <= now) {
            dueCards.push({
              key,
              item,
              lesson: entry.lesson,
              lexeme,
              variant,
              translationText: translation.text,
              note: translation.note,
              dueAt: state.dueAt,
              lane: 'due',
              ...clozeFields,
            })
          }

          if (!state && newCards.length < MAX_NEW_ITEMS) {
            newCards.push({
              key,
              item,
              lesson: entry.lesson,
              lexeme,
              variant,
              translationText: translation.text,
              note: translation.note,
              lane: 'new',
              ...clozeFields,
            })
          }
        })
      })
    })

  dueCards.sort((left, right) => (left.dueAt ?? 0) - (right.dueAt ?? 0))

  return {
    dueCards,
    newCards,
    queue: [...dueCards, ...newCards],
  }
}

export function getBrowserEntries(
  pairId: string,
  reviewStates: Record<string, ReviewState>,
) {
  return getStudyItemsForPair(pairId).map((item) => {
    const lexeme = LEXEME_RECORD[item.lexemeId]
    const lesson = LESSON_RECORD[item.lessonId]
    const translation =
      lexeme.senses[0].translations.find((candidate) => candidate.pairId === pairId) ??
      lexeme.senses[0].translations[0]
    const mastery = getItemMastery(pairId, item.id, reviewStates)

    return {
      item,
      lesson,
      lexeme,
      translationText: translation.text,
      note: translation.note,
      mastery: mastery.value,
      statusKey: mastery.statusKey,
    } satisfies BrowserEntry
  })
}

export function getReviewStats(
  pairId: string,
  reviewStates: Record<string, ReviewState>,
  reviewLogs: ReviewLog[],
) {
  const pairStudyItems = getStudyItemsForPair(pairId)
  const thirtyDaysAgo = Date.now() - 30 * DAY_MS
  const pairLogs = reviewLogs.filter((log) => log.pairId === pairId)
  const recentLogs = pairLogs.filter((log) => log.reviewedAt >= thirtyDaysAgo)
  const studiedWords = pairStudyItems.filter((item) => {
    return item.variants.some((variant) => reviewStates[getReviewKey(pairId, item.id, variant)])
  }).length
  const masteredWords = pairStudyItems.filter((item) => {
    return item.variants.every((variant) => {
      const state = reviewStates[getReviewKey(pairId, item.id, variant)]
      return state && state.intervalDays >= 3 && (state.lastScore ?? 0) >= 2
    })
  }).length

  const recognitionLogs = pairLogs.filter((log) => log.variant === 'recognition')
  const recallLogs = pairLogs.filter((log) => log.variant === 'recall')
  const weakMap = new Map<string, number>()

  pairLogs
    .filter((log) => log.score <= 1)
    .forEach((log) => {
      const item = STUDY_ITEM_RECORD[log.studyItemId]
      const lexeme = LEXEME_RECORD[item.lexemeId]
      const bucket = `${lexeme.partOfSpeech}:${log.variant}`
      weakMap.set(bucket, (weakMap.get(bucket) ?? 0) + 1)
    })

  const weakSpots = [...weakMap.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([bucket, count]) => {
      const [partOfSpeech, variant] = bucket.split(':')
      return {
        partOfSpeech: partOfSpeech as PartOfSpeech,
        variant: variant as CardVariantKind,
        count,
      }
    })

  return {
    totalWords: pairStudyItems.length,
    studiedWords,
    masteredWords,
    retention:
      recentLogs.length === 0
        ? 0
        : recentLogs.filter((log) => log.score >= 2).length / recentLogs.length,
    accuracy:
      pairLogs.length === 0
        ? 0
        : pairLogs.filter((log) => log.score >= 2).length / pairLogs.length,
    recognitionAccuracy:
      recognitionLogs.length === 0
        ? 0
        : recognitionLogs.filter((log) => log.score >= 2).length / recognitionLogs.length,
    recallAccuracy:
      recallLogs.length === 0
        ? 0
        : recallLogs.filter((log) => log.score >= 2).length / recallLogs.length,
    weakSpots,
  }
}
