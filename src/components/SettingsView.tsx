import type { Session } from '@supabase/supabase-js'
import { LEVEL_LABELS, getCourseForPair, getLanguage } from '../data/content'
import { t } from '../lib/i18n'
import type { LanguageCode, PersistedAppState } from '../types'
import { AuthPanel } from './AuthPanel'

function pickText(
  value: { ja: string; en: string; de: string },
  locale: LanguageCode,
) {
  return value[locale]
}

export function SettingsView({
  locale,
  profile,
  pairId,
  pairs,
  session,
  onPairChange,
  onProfileChange,
  onReset,
  onReopenDiagnostic,
  onReopenPairPicker,
}: {
  locale: LanguageCode
  profile: PersistedAppState['profile']
  pairId: string
  pairs: Array<{ id: string; nativeLanguage: LanguageCode; targetLanguage: LanguageCode }>
  session: Session | null
  onPairChange: (nativeLanguage: LanguageCode, targetLanguage: LanguageCode) => void
  onProfileChange: (patch: Partial<PersistedAppState['profile']>) => void
  onReset: () => void
  onReopenDiagnostic: () => void
  onReopenPairPicker: () => void
}) {
  return (
    <section className="panel settings-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">{t(locale, 'pairSwitch')}</p>
          <h3>{t(locale, 'settings')}</h3>
        </div>
        <span className="section-note">{t(locale, 'storageNote')}</span>
      </div>

      <div className="pair-grid">
        {pairs.map((pair) => {
          const course = getCourseForPair(pair.id)

          return (
            <button
              className={`pair-tile${pair.id === pairId ? ' is-selected' : ''}`}
              key={pair.id}
              onClick={() => onPairChange(pair.nativeLanguage, pair.targetLanguage)}
              type="button"
            >
              <strong>
                {pickText(getLanguage(pair.nativeLanguage).label, locale)}
                {' -> '}
                {pickText(getLanguage(pair.targetLanguage).label, locale)}
              </strong>
              <span>{pickText(course.title, locale)}</span>
            </button>
          )
        })}
      </div>

      <div className="settings-grid">
        <label>
          <span>{t(locale, 'goalLevel')}</span>
          <select
            value={profile.goalLevel}
            onChange={(event) =>
              onProfileChange({ goalLevel: event.target.value as 'L0' | 'L1' | 'L2' })
            }
          >
            <option value="L0">{pickText(LEVEL_LABELS.L0, locale)}</option>
            <option value="L1">{pickText(LEVEL_LABELS.L1, locale)}</option>
            <option value="L2">{pickText(LEVEL_LABELS.L2, locale)}</option>
          </select>
        </label>

        <label>
          <span>{t(locale, 'dailyMinutes')}</span>
          <input
            max={90}
            min={10}
            onChange={(event) => onProfileChange({ dailyMinutes: Number(event.target.value) })}
            type="range"
            value={profile.dailyMinutes}
          />
          <strong>{profile.dailyMinutes} min</strong>
        </label>

        <label>
          <span>{t(locale, 'learningPurpose')}</span>
          <select
            value={profile.learningPurpose}
            onChange={(event) =>
              onProfileChange({
                learningPurpose: event.target.value as PersistedAppState['profile']['learningPurpose'],
              })
            }
          >
            <option value="conversation">{t(locale, 'purposeConversation')}</option>
            <option value="travel">{t(locale, 'purposeTravel')}</option>
            <option value="exam">{t(locale, 'purposeExam')}</option>
            <option value="reading">{t(locale, 'purposeReading')}</option>
          </select>
        </label>
      </div>

      <AuthPanel locale={locale} session={session} />

      <div className="settings-actions">
        <button
          className="secondary-button"
          onClick={onReopenPairPicker}
          type="button"
        >
          {t(locale, 'changeLanguages')}
        </button>
        <button
          className="secondary-button"
          onClick={onReopenDiagnostic}
          type="button"
        >
          {t(locale, 'diagnosticRun')}
        </button>
        <button className="danger-button" onClick={onReset} type="button">
          {t(locale, 'resetProgress')}
        </button>
      </div>
    </section>
  )
}
