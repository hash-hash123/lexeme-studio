import { useState } from 'react'
import { getLanguage } from '../data/content'
import { t } from '../lib/i18n'
import type { LanguageCode } from '../types'

const ALL_CODES: LanguageCode[] = ['ja', 'en', 'de']

const NATIVE_LABEL: Record<LanguageCode, string> = {
  ja: '日本語',
  en: 'English',
  de: 'Deutsch',
}

interface Props {
  initialLocale: LanguageCode
  onComplete: (nativeLanguage: LanguageCode, targetLanguage: LanguageCode) => void
  canCancel?: boolean
  onCancel?: () => void
}

export function LanguagePicker({
  initialLocale,
  onComplete,
  canCancel,
  onCancel,
}: Props) {
  const [nativeLanguage, setNativeLanguage] = useState<LanguageCode | null>(null)
  const [locale, setLocale] = useState<LanguageCode>(initialLocale)

  function pickNative(code: LanguageCode) {
    setNativeLanguage(code)
    // Switch UI locale to the freshly picked native language.
    setLocale(code)
  }

  function pickTarget(code: LanguageCode) {
    if (!nativeLanguage) return
    onComplete(nativeLanguage, code)
  }

  function back() {
    setNativeLanguage(null)
  }

  const targetOptions = ALL_CODES.filter((code) => code !== nativeLanguage)
  const step = nativeLanguage === null ? 'native' : 'target'

  return (
    <div className="modal-backdrop">
      <div className="modal panel">
        <p className="eyebrow">{t(locale, 'languagePickerEyebrow')}</p>
        <h3>
          {step === 'native'
            ? t(locale, 'pickNativeQuestion')
            : t(locale, 'pickTargetQuestion')}
        </h3>

        {step === 'native' ? (
          <p className="modal-hint multilingual-hint">
            母語を選択してください / Pick your native language / Waehle deine Muttersprache
          </p>
        ) : (
          <p className="modal-hint">{t(locale, 'pickTargetHint')}</p>
        )}

        <div className="language-pick-grid">
          {(step === 'native' ? ALL_CODES : targetOptions).map((code) => {
            const language = getLanguage(code)
            const localized = language.label[locale]
            return (
              <button
                className="language-pick-tile"
                key={code}
                onClick={() =>
                  step === 'native' ? pickNative(code) : pickTarget(code)
                }
                type="button"
              >
                <strong>{NATIVE_LABEL[code]}</strong>
                {localized !== NATIVE_LABEL[code] ? (
                  <span>{localized}</span>
                ) : null}
              </button>
            )
          })}
        </div>

        <div className="modal-footer">
          <span>{step === 'native' ? '1 / 2' : '2 / 2'}</span>
          {step === 'target' ? (
            <button className="link-button" onClick={back} type="button">
              {t(locale, 'pickBack')}
            </button>
          ) : canCancel && onCancel ? (
            <button className="link-button" onClick={onCancel} type="button">
              {t(locale, 'diagnosticSkip')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
