import {
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
  type CSSProperties,
} from 'react'
import { DashboardView } from './components/DashboardView'
import { BrowserView } from './components/BrowserView'
import { LevelDiagnostic } from './components/LevelDiagnostic'
import { ReviewView } from './components/ReviewView'
import { SettingsView } from './components/SettingsView'
import {
  LANGUAGE_PAIRS,
  getCourseForPair,
  getLanguage,
  getLanguagePair,
  getPairId,
} from './data/content'
import { t } from './lib/i18n'
import {
  buildQueueCards,
  getBrowserEntries,
  getLearningInsights,
  getLessonProgress,
  getReviewStats,
} from './lib/selectors'
import { updateReviewState } from './lib/srs'
import { DEFAULT_APP_STATE, loadAppState, saveAppState } from './lib/storage'
import { getNowTimestamp } from './lib/time'
import { useAuth } from './lib/useAuth'
import {
  insertRemoteReviewLog,
  loadRemoteState,
  pushLocalStateToRemote,
  upsertRemoteProfile,
  upsertRemoteReviewState,
} from './lib/remoteSync'
import type { LanguageCode, LevelCode, PartOfSpeech, PersistedAppState, ReviewLog } from './types'

const DIAGNOSTIC_DONE_KEY = 'lexeme-studio:diagnostic-done:v1'

type ViewName = 'dashboard' | 'review' | 'browser' | 'settings'

const TARGET_THEMES = {
  en: ['#0f766e', 'rgba(15, 118, 110, 0.15)', '#d7f5ee', 'rgba(244, 251, 249, 0.78)'],
  de: ['#b45309', 'rgba(180, 83, 9, 0.16)', '#fff0dc', 'rgba(255, 249, 243, 0.8)'],
  ja: ['#2563eb', 'rgba(37, 99, 235, 0.15)', '#dbeafe', 'rgba(244, 247, 255, 0.8)'],
} as const satisfies Record<LanguageCode, readonly [string, string, string, string]>

function pickText(
  value: { ja: string; en: string; de: string },
  locale: LanguageCode,
) {
  return value[locale]
}

function pct(value: number) {
  return `${Math.round(value * 100)}%`
}

function speak(language: LanguageCode, text: string, done: () => void) {
  if (!window.speechSynthesis) {
    done()
    return
  }

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = getLanguage(language).speechCode
  utterance.onend = done
  utterance.onerror = done
  window.speechSynthesis.speak(utterance)
}

function App() {
  const { session } = useAuth()
  const userId = session?.user.id ?? null
  const [hydrated, setHydrated] = useState(false)
  const [appState, setAppState] = useState<PersistedAppState>(() => loadAppState())
  const [activeView, setActiveView] = useState<ViewName>('dashboard')
  const [diagnosticOpen, setDiagnosticOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.localStorage.getItem(DIAGNOSTIC_DONE_KEY)
  })
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<'all' | 'L0' | 'L1' | 'L2'>('all')
  const [partFilter, setPartFilter] = useState<'all' | PartOfSpeech>('all')
  const [lessonFilter, setLessonFilter] = useState<'all' | string>('all')
  const [selectedStudyItemId, setSelectedStudyItemId] = useState<string | null>(null)
  const [speakingKey, setSpeakingKey] = useState<string | null>(null)
  const [cardUiState, setCardUiState] = useState<{
    cardKey: string | null
    revealed: boolean
    draftAnswer: string
  }>({
    cardKey: null,
    revealed: false,
    draftAnswer: '',
  })

  const locale = appState.profile.nativeLanguage
  const deferredSearch = useDeferredValue(search.trim().toLowerCase())
  const pairId = getPairId(
    appState.profile.nativeLanguage,
    appState.profile.targetLanguage,
  )
  const currentPair = getLanguagePair(pairId)
  const currentCourse = getCourseForPair(pairId)
  const lessonProgress = getLessonProgress(pairId, appState.reviewStates)
  const queue = buildQueueCards(pairId, appState.reviewStates)
  const stats = getReviewStats(pairId, appState.reviewStates, appState.reviewLogs)
  const insights = getLearningInsights(pairId, appState.reviewLogs, lessonProgress)
  const currentCard = queue.queue[0]
  const revealed =
    currentCard?.key !== undefined &&
    cardUiState.cardKey === currentCard.key &&
    cardUiState.revealed
  const draftAnswer =
    currentCard?.key !== undefined && cardUiState.cardKey === currentCard.key
      ? cardUiState.draftAnswer
      : ''
  const entries = getBrowserEntries(pairId, appState.reviewStates)
  const filteredEntries = entries.filter((entry) => {
    const haystack = [
      entry.lexeme.lemma,
      entry.lexeme.reading ?? '',
      entry.translationText,
      entry.note,
    ]
      .join(' ')
      .toLowerCase()
    return (
      (deferredSearch.length === 0 || haystack.includes(deferredSearch)) &&
      (levelFilter === 'all' || entry.item.level === levelFilter) &&
      (partFilter === 'all' || entry.lexeme.partOfSpeech === partFilter) &&
      (lessonFilter === 'all' || entry.lesson.id === lessonFilter)
    )
  })
  const selectedEntry =
    filteredEntries.find((entry) => entry.item.id === selectedStudyItemId) ??
    filteredEntries[0]

  const [accent, accentSoft, accentWarm, surfaceTint] =
    TARGET_THEMES[currentPair.targetLanguage]
  const shellStyle = {
    '--accent': accent,
    '--accent-soft': accentSoft,
    '--accent-warm': accentWarm,
    '--surface-tint': surfaceTint,
  } as CSSProperties

  useEffect(() => {
    saveAppState(appState)
  }, [appState])

  useEffect(() => {
    window.document.documentElement.setAttribute('lang', locale)
    window.document
      .querySelector('title')
      ?.replaceChildren(`${t(locale, 'brand')} - ${pickText(currentCourse.title, locale)}`)
  }, [locale, currentCourse.title])

  // On sign-in: hydrate local state from Supabase, or push local to remote if remote is empty.
  useEffect(() => {
    if (!userId) {
      setHydrated(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const remote = await loadRemoteState(userId)
        if (cancelled) return

        if (remote) {
          setAppState(remote)
        } else {
          const hasLocalProgress =
            Object.keys(appState.reviewStates).length > 0 ||
            appState.reviewLogs.length > 0

          if (hasLocalProgress) {
            await pushLocalStateToRemote(userId, appState)
          } else {
            await upsertRemoteProfile(userId, appState.profile)
          }
        }
      } finally {
        if (!cancelled) setHydrated(true)
      }
    })()

    return () => {
      cancelled = true
    }
    // appState intentionally excluded: we only hydrate on sign-in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // After hydration, mirror profile changes to Supabase.
  useEffect(() => {
    if (!userId || !hydrated) return
    upsertRemoteProfile(userId, appState.profile).catch(() => {})
  }, [userId, hydrated, appState.profile])

  function scoreCard(score: number) {
    if (!currentCard) return
    const reviewedAt = getNowTimestamp()
    const previousReviewState = appState.reviewStates[currentCard.key]
    const nextReviewState = updateReviewState(
      previousReviewState,
      pairId,
      currentCard.item.id,
      currentCard.variant,
      score,
      reviewedAt,
    )
    const nextLog: ReviewLog = {
      id: `${currentCard.key}:${reviewedAt}`,
      pairId,
      studyItemId: currentCard.item.id,
      variant: currentCard.variant,
      score,
      reviewedAt,
    }

    setCardUiState({
      cardKey: null,
      revealed: false,
      draftAnswer: '',
    })
    startTransition(() => {
      setAppState((previous) => ({
        ...previous,
        reviewStates: {
          ...previous.reviewStates,
          [currentCard.key]: nextReviewState,
        },
        reviewLogs: [...previous.reviewLogs.slice(-399), nextLog],
      }))
    })

    if (userId && hydrated) {
      upsertRemoteReviewState(userId, nextReviewState).catch(() => {})
      insertRemoteReviewLog(userId, nextLog).catch(() => {})
    }
  }

  function changePair(nativeLanguage: LanguageCode, targetLanguage: LanguageCode) {
    setSearch('')
    setLevelFilter('all')
    setPartFilter('all')
    setLessonFilter('all')
    setSelectedStudyItemId(null)
    setCardUiState({
      cardKey: null,
      revealed: false,
      draftAnswer: '',
    })
    startTransition(() => {
      setAppState((previous) => ({
        ...previous,
        profile: { ...previous.profile, nativeLanguage, targetLanguage },
      }))
    })
  }

  function updateProfile(patch: Partial<PersistedAppState['profile']>) {
    startTransition(() => {
      setAppState((previous) => ({
        ...previous,
        profile: { ...previous.profile, ...patch },
      }))
    })
  }

  function completeDiagnostic(recommended: LevelCode) {
    window.localStorage.setItem(DIAGNOSTIC_DONE_KEY, '1')
    setDiagnosticOpen(false)
    updateProfile({ goalLevel: recommended })
  }

  function skipDiagnostic() {
    window.localStorage.setItem(DIAGNOSTIC_DONE_KEY, '1')
    setDiagnosticOpen(false)
  }

  function reopenDiagnostic() {
    window.localStorage.removeItem(DIAGNOSTIC_DONE_KEY)
    setDiagnosticOpen(true)
  }

  return (
    <div className="app-shell" style={shellStyle}>
      {diagnosticOpen ? (
        <LevelDiagnostic
          locale={locale}
          onComplete={completeDiagnostic}
          onSkip={skipDiagnostic}
          targetLanguage={currentPair.targetLanguage}
        />
      ) : null}
      <aside className="sidebar panel">
        <p className="eyebrow">{t(locale, 'strapline')}</p>
        <h1>{t(locale, 'brand')}</h1>
        <p className="sidebar-copy">{pickText(currentCourse.description, locale)}</p>
        <nav className="nav-stack">
          {(['dashboard', 'review', 'browser', 'settings'] as ViewName[]).map((view) => (
            <button
              className={`nav-button${activeView === view ? ' is-active' : ''}`}
              key={view}
              onClick={() => setActiveView(view)}
              type="button"
            >
              <span>{t(locale, view)}</span>
              {view === 'review' ? <span className="nav-badge">{queue.dueCards.length}</span> : null}
            </button>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        {activeView === 'dashboard' ? (
          <DashboardView
            currentCourse={currentCourse}
            currentPair={currentPair}
            insights={insights}
            lessonProgress={lessonProgress}
            locale={locale}
            onOpenBrowser={() => setActiveView('browser')}
            onOpenReview={() => setActiveView('review')}
            profile={appState.profile}
            queue={queue}
            stats={stats}
          />
        ) : null}

        {activeView === 'review' ? (
          <ReviewView
            currentCard={currentCard}
            draftAnswer={draftAnswer}
            locale={locale}
            onDraftChange={(value) =>
              setCardUiState({
                cardKey: currentCard?.key ?? null,
                revealed: false,
                draftAnswer: value,
              })
            }
            onReveal={() =>
              setCardUiState({
                cardKey: currentCard?.key ?? null,
                revealed: true,
                draftAnswer,
              })
            }
            onScore={scoreCard}
            onSpeak={(key, text) => {
              setSpeakingKey(key)
              speak(currentPair.targetLanguage, text, () => setSpeakingKey(null))
            }}
            revealed={revealed}
            speakingKey={speakingKey}
          />
        ) : null}

        {activeView === 'browser' ? (
          <BrowserView
            entries={filteredEntries}
            lessonFilter={lessonFilter}
            lessonProgress={lessonProgress}
            levelFilter={levelFilter}
            locale={locale}
            onLessonChange={setLessonFilter}
            onLevelChange={setLevelFilter}
            onPartChange={setPartFilter}
            onSearchChange={setSearch}
            onSelect={setSelectedStudyItemId}
            partFilter={partFilter}
            search={search}
            selectedEntry={selectedEntry}
          />
        ) : null}

        {activeView === 'settings' ? (
          <SettingsView
            locale={locale}
            onPairChange={changePair}
            onProfileChange={updateProfile}
            onReopenDiagnostic={reopenDiagnostic}
            onReset={() =>
              startTransition(() =>
                setAppState((previous) => ({
                  ...DEFAULT_APP_STATE,
                  profile: previous.profile,
                })),
              )
            }
            pairId={pairId}
            pairs={LANGUAGE_PAIRS}
            profile={appState.profile}
            session={session}
          />
        ) : null}
      </main>

      <aside className="inspector panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">{t(locale, 'overview')}</p>
            <h3>{t(locale, 'currentPair')}</h3>
          </div>
        </div>
        <p className="inspector-copy">
          {pickText(getLanguage(currentPair.nativeLanguage).label, locale)}
          {' -> '}
          {pickText(getLanguage(currentPair.targetLanguage).label, locale)}
        </p>
        <div className="inspector-stack">
          <article className="mini-stat"><span>{t(locale, 'totalWords')}</span><strong>{stats.totalWords}</strong></article>
          <article className="mini-stat"><span>{t(locale, 'studied')}</span><strong>{stats.studiedWords}</strong></article>
          <article className="mini-stat"><span>{t(locale, 'mastered')}</span><strong>{stats.masteredWords}</strong></article>
          <article className="mini-stat"><span>{t(locale, 'dailyGoal')}</span><strong>{appState.profile.dailyMinutes}m</strong></article>
        </div>
        <div className="meter">
          <div className="meter-row"><span>{t(locale, 'retention')}</span><strong>{pct(stats.retention)}</strong></div>
          <div className="meter-track"><span className="meter-fill" style={{ width: pct(stats.retention) }} /></div>
        </div>
        <div className="meter">
          <div className="meter-row"><span>{t(locale, 'accuracy')}</span><strong>{pct(stats.accuracy)}</strong></div>
          <div className="meter-track"><span className="meter-fill" style={{ width: pct(stats.accuracy) }} /></div>
        </div>
      </aside>
    </div>
  )
}

export default App
