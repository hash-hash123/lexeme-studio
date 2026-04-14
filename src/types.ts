export type LanguageCode = 'ja' | 'en' | 'de'
export type LevelCode = 'L0' | 'L1' | 'L2'
export type CardVariantKind = 'recognition' | 'recall' | 'cloze' | 'discriminate'
export type LearningPurpose = 'conversation' | 'travel' | 'exam' | 'reading'
export type PartOfSpeech =
  | 'interjection'
  | 'noun'
  | 'verb'
  | 'adjective'

export interface LocalizedText {
  ja: string
  en: string
  de: string
}

export interface Language {
  code: LanguageCode
  speechCode: string
  label: LocalizedText
}

export interface LanguagePair {
  id: string
  nativeLanguage: LanguageCode
  targetLanguage: LanguageCode
}

export interface LexemeForm {
  label: string
  value: string
}

export interface SenseTranslation {
  pairId: string
  text: string
  note: string
}

export interface ExampleSentence {
  target: string
  translations: LocalizedText
}

export interface LexemeSense {
  id: string
  gloss: string
  translations: SenseTranslation[]
  examples: ExampleSentence[]
  collocations: string[]
}

export interface Lexeme {
  id: string
  conceptId: string
  language: LanguageCode
  lemma: string
  reading?: string
  pronunciation?: string
  partOfSpeech: PartOfSpeech
  level: LevelCode
  forms: LexemeForm[]
  audioText: string
  senses: LexemeSense[]
}

export interface StudyItem {
  id: string
  pairId: string
  lexemeId: string
  senseId: string
  lessonId: string
  level: LevelCode
  variants: CardVariantKind[]
}

export interface Lesson {
  id: string
  pairId: string
  order: number
  level: LevelCode
  title: LocalizedText
  theme: LocalizedText
  studyItemIds: string[]
}

export interface Course {
  id: string
  pairId: string
  title: LocalizedText
  description: LocalizedText
  levelRange: [LevelCode, LevelCode]
  lessonIds: string[]
}

export interface ReviewState {
  key: string
  pairId: string
  studyItemId: string
  variant: CardVariantKind
  dueAt: number
  intervalDays: number
  ease: number
  repetitions: number
  lapses: number
  lastReviewedAt?: number
  lastScore?: number
}

export interface ReviewLog {
  id: string
  pairId: string
  studyItemId: string
  variant: CardVariantKind
  score: number
  reviewedAt: number
}

export interface Profile {
  nativeLanguage: LanguageCode
  targetLanguage: LanguageCode
  goalLevel: LevelCode
  dailyMinutes: number
  learningPurpose: LearningPurpose
}

export interface PersistedAppState {
  version: number
  profile: Profile
  reviewStates: Record<string, ReviewState>
  reviewLogs: ReviewLog[]
}
