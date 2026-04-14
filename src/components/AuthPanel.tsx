import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { t } from '../lib/i18n'
import { sendMagicLink, signOut } from '../lib/useAuth'
import type { LanguageCode } from '../types'

interface AuthPanelProps {
  locale: LanguageCode
  session: Session | null
}

export function AuthPanel({ locale, session }: AuthPanelProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email) return
    setStatus('sending')
    setErrorMessage('')
    const { error } = await sendMagicLink(email, window.location.href)
    if (error) {
      setStatus('error')
      setErrorMessage(error.message)
    } else {
      setStatus('sent')
    }
  }

  if (session) {
    return (
      <div className="auth-panel auth-panel--signed-in">
        <p className="eyebrow">{t(locale, 'syncCloud')}</p>
        <p>
          <strong>{t(locale, 'signedInAs')}:</strong> {session.user.email}
        </p>
        <p className="sync-status sync-status--cloud">
          {t(locale, 'syncStatusCloud')}
        </p>
        <button
          className="auth-button auth-button--secondary"
          onClick={() => signOut()}
          type="button"
        >
          {t(locale, 'signOut')}
        </button>
      </div>
    )
  }

  return (
    <form className="auth-panel" onSubmit={onSubmit}>
      <p className="eyebrow">{t(locale, 'syncCloud')}</p>
      <p className="sync-status sync-status--local">
        {t(locale, 'syncStatusLocal')}
      </p>
      <p className="auth-hint">{t(locale, 'signInHint')}</p>
      <label className="auth-field">
        <span>{t(locale, 'emailLabel')}</span>
        <input
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <button
        className="auth-button"
        disabled={status === 'sending'}
        type="submit"
      >
        {t(locale, 'sendMagicLink')}
      </button>
      {status === 'sent' && (
        <p className="auth-success">{t(locale, 'magicLinkSent')}</p>
      )}
      {status === 'error' && errorMessage && (
        <p className="auth-error">{errorMessage}</p>
      )}
    </form>
  )
}
