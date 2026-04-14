import type { PersistedAppState } from '../types'

const STORAGE_KEY = 'lexeme-studio:v1'
const STORAGE_VERSION = 1

export const DEFAULT_APP_STATE: PersistedAppState = {
  version: STORAGE_VERSION,
  profile: {
    nativeLanguage: 'ja',
    targetLanguage: 'en',
    goalLevel: 'L1',
    dailyMinutes: 20,
    learningPurpose: 'conversation',
  },
  reviewStates: {},
  reviewLogs: [],
}

export function loadAppState(): PersistedAppState {
  if (typeof window === 'undefined') {
    return DEFAULT_APP_STATE
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return DEFAULT_APP_STATE
    }

    const parsed = JSON.parse(raw) as Partial<PersistedAppState>

    if (parsed.version !== STORAGE_VERSION) {
      return DEFAULT_APP_STATE
    }

    return {
      version: STORAGE_VERSION,
      profile: {
        ...DEFAULT_APP_STATE.profile,
        ...parsed.profile,
      },
      reviewStates: parsed.reviewStates ?? {},
      reviewLogs: Array.isArray(parsed.reviewLogs) ? parsed.reviewLogs : [],
    }
  } catch {
    return DEFAULT_APP_STATE
  }
}

export function saveAppState(state: PersistedAppState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
