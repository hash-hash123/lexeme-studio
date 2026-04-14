import { useMemo, useState } from 'react'
import { LEVEL_LABELS, LEXEMES } from '../data/content'
import { t } from '../lib/i18n'
import type { LanguageCode, Lexeme, LevelCode } from '../types'

interface DiagnosticQuestion {
  lexeme: Lexeme
  level: LevelCode
}

function pickText(
  value: { ja: string; en: string; de: string },
  locale: LanguageCode,
) {
  return value[locale]
}

interface Props {
  locale: LanguageCode
  targetLanguage: LanguageCode
  onComplete: (recommendedLevel: LevelCode) => void
  onSkip: () => void
}

export function LevelDiagnostic({
  locale,
  targetLanguage,
  onComplete,
  onSkip,
}: Props) {
  const questions = useMemo<DiagnosticQuestion[]>(() => {
    return (['L0', 'L1', 'L2'] as LevelCode[])
      .map((level) => {
        const lexeme = LEXEMES.find(
          (candidate) =>
            candidate.language === targetLanguage && candidate.level === level,
        )
        return lexeme ? { lexeme, level } : null
      })
      .filter((entry): entry is DiagnosticQuestion => entry !== null)
  }, [targetLanguage])

  const [index, setIndex] = useState(0)
  const [knewLevels, setKnewLevels] = useState<LevelCode[]>([])

  if (questions.length === 0) {
    return null
  }

  const current = questions[index]

  function answer(knows: boolean) {
    const known = knows ? [...knewLevels, current.level] : knewLevels

    if (index + 1 >= questions.length) {
      const levels: LevelCode[] = ['L0', 'L1', 'L2']
      const firstUnknown = levels.find((level) => !known.includes(level))
      onComplete(firstUnknown ?? 'L2')
      return
    }

    setKnewLevels(known)
    setIndex(index + 1)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal panel">
        <p className="eyebrow">{t(locale, 'diagnosticEyebrow')}</p>
        <h3>{t(locale, 'diagnosticTitle')}</h3>
        <p className="modal-hint">{t(locale, 'diagnosticHint')}</p>

        <div className="diagnostic-word">
          <strong>{current.lexeme.lemma}</strong>
          <span>{pickText(LEVEL_LABELS[current.level], locale)}</span>
          {current.lexeme.reading ? (
            <em>{current.lexeme.reading}</em>
          ) : null}
        </div>

        <div className="modal-actions">
          <button
            className="primary-button"
            onClick={() => answer(true)}
            type="button"
          >
            {t(locale, 'diagnosticKnow')}
          </button>
          <button
            className="secondary-button"
            onClick={() => answer(false)}
            type="button"
          >
            {t(locale, 'diagnosticDontKnow')}
          </button>
        </div>

        <div className="modal-footer">
          <span>
            {index + 1} / {questions.length}
          </span>
          <button className="link-button" onClick={onSkip} type="button">
            {t(locale, 'diagnosticSkip')}
          </button>
        </div>
      </div>
    </div>
  )
}
