import { LEVEL_LABELS, PART_OF_SPEECH_LABELS } from '../data/content'
import type { QueueCard } from '../lib/selectors'
import { t } from '../lib/i18n'
import type { LanguageCode } from '../types'

function pickText(
  value: { ja: string; en: string; de: string },
  locale: LanguageCode,
) {
  return value[locale]
}

export function ReviewView({
  locale,
  currentCard,
  revealed,
  draftAnswer,
  speakingKey,
  onDraftChange,
  onReveal,
  onScore,
  onSpeak,
}: {
  locale: LanguageCode
  currentCard: QueueCard | undefined
  revealed: boolean
  draftAnswer: string
  speakingKey: string | null
  onDraftChange: (value: string) => void
  onReveal: () => void
  onScore: (score: number) => void
  onSpeak: (key: string, text: string) => void
}) {
  if (!currentCard) {
    return (
      <section className="panel review-panel">
        <div className="empty-state">
          <p>{t(locale, 'queueEmpty')}</p>
          <span>{t(locale, 'queueHint')}</span>
        </div>
      </section>
    )
  }

  return (
    <section className="panel review-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">{t(locale, 'reviewReady')}</p>
          <h3>{currentCard.lexeme.lemma}</h3>
        </div>
        <span className="section-note">
          {t(locale, currentCard.variant)} · {pickText(currentCard.lesson.title, locale)}
        </span>
      </div>

      <div className="card-stage">
        <div className="card-head">
          <div>
            <p className="eyebrow">{t(locale, 'prompt')}</p>
            <h2>
              {currentCard.variant === 'recognition'
                ? currentCard.lexeme.lemma
                : currentCard.translationText}
            </h2>
          </div>
          <button
            className={`audio-button${speakingKey === currentCard.key ? ' is-speaking' : ''}`}
            onClick={() => onSpeak(currentCard.key, currentCard.lexeme.audioText)}
            type="button"
          >
            {t(locale, 'audio')}
          </button>
        </div>

        <div className="card-submeta">
          <span>{pickText(PART_OF_SPEECH_LABELS[currentCard.lexeme.partOfSpeech], locale)}</span>
          <span>{pickText(LEVEL_LABELS[currentCard.item.level], locale)}</span>
          {currentCard.lexeme.reading ? <span>{currentCard.lexeme.reading}</span> : null}
        </div>

        {currentCard.variant === 'recall' && !revealed ? (
          <label className="answer-field">
            <span>{t(locale, 'yourAttempt')}</span>
            <input
              onChange={(event) => onDraftChange(event.target.value)}
              placeholder={t(locale, 'expectedAnswer')}
              value={draftAnswer}
            />
          </label>
        ) : null}

        {!revealed ? (
          <button className="primary-button" onClick={onReveal} type="button">
            {t(locale, 'showAnswer')}
          </button>
        ) : (
          <div className="answer-sheet">
            <div className="answer-grid">
              <article>
                <span>{t(locale, 'expectedAnswer')}</span>
                <strong>
                  {currentCard.variant === 'recognition'
                    ? currentCard.translationText
                    : currentCard.lexeme.lemma}
                </strong>
              </article>
              <article>
                <span>{t(locale, 'translation')}</span>
                <strong>{currentCard.translationText}</strong>
              </article>
              <article>
                <span>{t(locale, 'note')}</span>
                <strong>{currentCard.note}</strong>
              </article>
            </div>

            <div className="detail-strip">
              <div>
                <span>{t(locale, 'example')}</span>
                <p>{currentCard.lexeme.senses[0].examples[0].target}</p>
              </div>
              <div>
                <span>{t(locale, 'collocations')}</span>
                <p>{currentCard.lexeme.senses[0].collocations.join(' · ')}</p>
              </div>
              <div>
                <span>{t(locale, 'forms')}</span>
                <p>{currentCard.lexeme.forms.map((form) => form.value).join(' · ')}</p>
              </div>
            </div>

            <div className="score-row">
              <button className="tone-button" onClick={() => onScore(0)} type="button">
                {t(locale, 'again')}
              </button>
              <button className="tone-button" onClick={() => onScore(1)} type="button">
                {t(locale, 'hard')}
              </button>
              <button className="tone-button" onClick={() => onScore(2)} type="button">
                {t(locale, 'good')}
              </button>
              <button className="tone-button" onClick={() => onScore(3)} type="button">
                {t(locale, 'easy')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
