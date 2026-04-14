import { LEVEL_LABELS, PART_OF_SPEECH_LABELS, PURPOSE_LABELS, getLanguage } from '../data/content'
import type { LearningInsights, LessonProgress, QueueCard } from '../lib/selectors'
import { t } from '../lib/i18n'
import type { LanguageCode, PersistedAppState } from '../types'

function pickText(
  value: { ja: string; en: string; de: string },
  locale: LanguageCode,
) {
  return value[locale]
}

function pct(value: number) {
  return `${Math.round(value * 100)}%`
}

export function DashboardView({
  locale,
  profile,
  currentPair,
  currentCourse,
  lessonProgress,
  queue,
  stats,
  insights,
  onOpenReview,
  onOpenBrowser,
}: {
  locale: LanguageCode
  profile: PersistedAppState['profile']
  currentPair: { nativeLanguage: LanguageCode; targetLanguage: LanguageCode }
  currentCourse: {
    title: { ja: string; en: string; de: string }
    description: { ja: string; en: string; de: string }
  }
  lessonProgress: LessonProgress[]
  queue: { dueCards: QueueCard[]; newCards: QueueCard[] }
  stats: {
    retention: number
    masteredWords: number
    recognitionAccuracy: number
    recallAccuracy: number
    weakSpots: Array<{
      partOfSpeech: 'interjection' | 'noun' | 'verb' | 'adjective'
      variant: 'recognition' | 'recall' | 'cloze' | 'discriminate'
      count: number
    }>
  }
  insights: LearningInsights
  onOpenReview: () => void
  onOpenBrowser: () => void
}) {
  return (
    <>
      <section className="panel hero-panel">
        <p className="eyebrow">{t(locale, 'currentCourse')}</p>
        <h2>{pickText(currentCourse.title, locale)}</h2>
        <p>
          {pickText(getLanguage(currentPair.nativeLanguage).label, locale)}
          {' -> '}
          {pickText(getLanguage(currentPair.targetLanguage).label, locale)}
          {' · '}
          {pickText(PURPOSE_LABELS[profile.learningPurpose], locale)}
          {' · '}
          {pickText(LEVEL_LABELS[profile.goalLevel], locale)}
        </p>
        <div className="hero-actions">
          <button className="primary-button" onClick={onOpenReview} type="button">
            {t(locale, 'openReview')}
          </button>
          <button className="secondary-button" onClick={onOpenBrowser} type="button">
            {t(locale, 'openBrowser')}
          </button>
        </div>
        <div className="metric-grid">
          <article className="metric">
            <span>{t(locale, 'dueNow')}</span>
            <strong>{queue.dueCards.length}</strong>
          </article>
          <article className="metric">
            <span>{t(locale, 'newItems')}</span>
            <strong>{queue.newCards.length}</strong>
          </article>
          <article className="metric">
            <span>{t(locale, 'retention')}</span>
            <strong>{pct(stats.retention)}</strong>
          </article>
          <article className="metric">
            <span>{t(locale, 'mastered')}</span>
            <strong>{stats.masteredWords}</strong>
          </article>
        </div>
      </section>

      <section className="panel section-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">{t(locale, 'overview')}</p>
            <h3>{t(locale, 'lessonFlow')}</h3>
          </div>
        </div>
        <div className="lesson-list">
          {lessonProgress.map((entry) => (
            <article className="lesson-row" key={entry.lesson.id}>
              <div>
                <p className="lesson-meta">
                  {t(locale, 'lesson')} {entry.lesson.order}
                </p>
                <h4>{pickText(entry.lesson.title, locale)}</h4>
                <p>{pickText(entry.lesson.theme, locale)}</p>
              </div>
              <div className="lesson-status">
                <strong>{t(locale, entry.status)}</strong>
                <span>
                  {entry.seenVariants}/{entry.totalVariants}
                </span>
              </div>
              <div className="lesson-meter">
                <span style={{ width: `${Math.round(entry.mastery * 100)}%` }} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel split-panel">
        <div>
          <p className="eyebrow">{t(locale, 'reviewMix')}</p>
          <div className="meter">
            <div className="meter-row">
              <span>{t(locale, 'recognition')}</span>
              <strong>{pct(stats.recognitionAccuracy)}</strong>
            </div>
            <div className="meter-track">
              <span className="meter-fill" style={{ width: pct(stats.recognitionAccuracy) }} />
            </div>
          </div>
          <div className="meter">
            <div className="meter-row">
              <span>{t(locale, 'recall')}</span>
              <strong>{pct(stats.recallAccuracy)}</strong>
            </div>
            <div className="meter-track">
              <span className="meter-fill" style={{ width: pct(stats.recallAccuracy) }} />
            </div>
          </div>
        </div>
        <div>
          <p className="eyebrow">{t(locale, 'weakSpots')}</p>
          <div className="weak-list">
            {stats.weakSpots.length === 0 ? (
              <p className="muted-copy">{t(locale, 'queueHint')}</p>
            ) : (
              stats.weakSpots.map((spot) => (
                <div className="weak-row" key={`${spot.partOfSpeech}:${spot.variant}`}>
                  <strong>{pickText(PART_OF_SPEECH_LABELS[spot.partOfSpeech], locale)}</strong>
                  <span>
                    {t(locale, spot.variant)} · {spot.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="panel insights-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">{t(locale, 'overview')}</p>
            <h3>{t(locale, 'insightsHeading')}</h3>
          </div>
        </div>
        <div className="insight-grid">
          <article className="insight">
            <span>{t(locale, 'streak')}</span>
            <strong>
              {insights.streakDays} <em>{t(locale, 'days')}</em>
            </strong>
          </article>
          <article className="insight">
            <span>{t(locale, 'last7')}</span>
            <strong>
              {insights.reviewsLast7} · {pct(insights.retentionLast7)}
            </strong>
          </article>
          <article className="insight">
            <span>{t(locale, 'last30')}</span>
            <strong>
              {insights.reviewsLast30} · {pct(insights.retentionLast30)}
            </strong>
          </article>
          <article className="insight">
            <span>{t(locale, 'levelsCompleted')}</span>
            <strong>
              {insights.levelsCompleted} / {insights.totalLevels}
            </strong>
          </article>
        </div>
      </section>
    </>
  )
}
