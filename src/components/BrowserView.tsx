import { LEVEL_LABELS, PART_OF_SPEECH_LABELS } from '../data/content'
import type { BrowserEntry, LessonProgress } from '../lib/selectors'
import { t } from '../lib/i18n'
import type { LanguageCode, PartOfSpeech } from '../types'

function pickText(
  value: { ja: string; en: string; de: string },
  locale: LanguageCode,
) {
  return value[locale]
}

export function BrowserView({
  locale,
  entries,
  selectedEntry,
  search,
  levelFilter,
  partFilter,
  lessonFilter,
  lessonProgress,
  onSearchChange,
  onLevelChange,
  onPartChange,
  onLessonChange,
  onSelect,
}: {
  locale: LanguageCode
  entries: BrowserEntry[]
  selectedEntry: BrowserEntry | undefined
  search: string
  levelFilter: 'all' | 'L0' | 'L1'
  partFilter: 'all' | PartOfSpeech
  lessonFilter: 'all' | string
  lessonProgress: LessonProgress[]
  onSearchChange: (value: string) => void
  onLevelChange: (value: 'all' | 'L0' | 'L1') => void
  onPartChange: (value: 'all' | PartOfSpeech) => void
  onLessonChange: (value: string) => void
  onSelect: (studyItemId: string) => void
}) {
  return (
    <section className="panel browser-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">{t(locale, 'browser')}</p>
          <h3>{selectedEntry?.lexeme.lemma ?? t(locale, 'queueEmpty')}</h3>
        </div>
        <span className="section-note">{entries.length}</span>
      </div>

      <div className="filter-row">
        <input
          className="search-input"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t(locale, 'searchPlaceholder')}
          value={search}
        />
        <select value={levelFilter} onChange={(event) => onLevelChange(event.target.value as 'all' | 'L0' | 'L1')}>
          <option value="all">{t(locale, 'allLevels')}</option>
          <option value="L0">{pickText(LEVEL_LABELS.L0, locale)}</option>
          <option value="L1">{pickText(LEVEL_LABELS.L1, locale)}</option>
        </select>
        <select value={partFilter} onChange={(event) => onPartChange(event.target.value as 'all' | PartOfSpeech)}>
          <option value="all">{t(locale, 'allParts')}</option>
          {(['interjection', 'noun', 'verb', 'adjective'] as PartOfSpeech[]).map((part) => (
            <option key={part} value={part}>
              {pickText(PART_OF_SPEECH_LABELS[part], locale)}
            </option>
          ))}
        </select>
        <select value={lessonFilter} onChange={(event) => onLessonChange(event.target.value)}>
          <option value="all">{t(locale, 'allLessons')}</option>
          {lessonProgress.map((entry) => (
            <option key={entry.lesson.id} value={entry.lesson.id}>
              {pickText(entry.lesson.title, locale)}
            </option>
          ))}
        </select>
      </div>

      {selectedEntry ? (
        <div className="browser-detail">
          <div>
            <p className="eyebrow">{t(locale, 'detail')}</p>
            <h2>{selectedEntry.lexeme.lemma}</h2>
          </div>
          <div className="answer-grid">
            <article>
              <span>{t(locale, 'translation')}</span>
              <strong>{selectedEntry.translationText}</strong>
            </article>
            <article>
              <span>{t(locale, 'note')}</span>
              <strong>{selectedEntry.note}</strong>
            </article>
            <article>
              <span>{t(locale, 'mastery')}</span>
              <strong>{t(locale, selectedEntry.statusKey)}</strong>
            </article>
          </div>
        </div>
      ) : null}

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>{t(locale, 'browser')}</p>
          <span>{t(locale, 'searchPlaceholder')}</span>
        </div>
      ) : (
        <div className="browser-list">
          {entries.map((entry) => (
            <button
              className={`browser-row${selectedEntry?.item.id === entry.item.id ? ' is-selected' : ''}`}
              key={entry.item.id}
              onClick={() => onSelect(entry.item.id)}
              type="button"
            >
              <div>
                <strong>{entry.lexeme.lemma}</strong>
                <span>
                  {entry.lexeme.reading ? `${entry.lexeme.reading} · ` : ''}
                  {pickText(PART_OF_SPEECH_LABELS[entry.lexeme.partOfSpeech], locale)}
                </span>
              </div>
              <div>
                <strong>{entry.translationText}</strong>
                <span>{pickText(entry.lesson.title, locale)}</span>
              </div>
              <div className="browser-meter">
                <span style={{ width: `${Math.round(entry.mastery * 100)}%` }} />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
