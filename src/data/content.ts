import type {
  CardVariantKind,
  Course,
  Language,
  LanguageCode,
  LanguagePair,
  LearningPurpose,
  Lesson,
  Lexeme,
  LevelCode,
  LocalizedText,
  PartOfSpeech,
  StudyItem,
} from '../types'

interface ConceptSeed {
  id: string
  level: LevelCode
  partOfSpeech: PartOfSpeech
  lexemes: Record<
    LanguageCode,
    {
      lemma: string
      reading?: string
      pronunciation?: string
      audioText: string
      forms: Array<{ label: string; value: string }>
      gloss: string
      example: string
    }
  >
  translations: LocalizedText
  notes: Record<string, string>
  examples: LocalizedText
  collocations: Record<LanguageCode, string[]>
}

export const SUPPORTED_VARIANTS: CardVariantKind[] = ['recognition', 'recall']

export const LANGUAGES: Language[] = [
  {
    code: 'ja',
    speechCode: 'ja-JP',
    label: {
      ja: '日本語',
      en: 'Japanese',
      de: 'Japanisch',
    },
  },
  {
    code: 'en',
    speechCode: 'en-US',
    label: {
      ja: '英語',
      en: 'English',
      de: 'Englisch',
    },
  },
  {
    code: 'de',
    speechCode: 'de-DE',
    label: {
      ja: 'ドイツ語',
      en: 'German',
      de: 'Deutsch',
    },
  },
]

export const PART_OF_SPEECH_LABELS: Record<PartOfSpeech, LocalizedText> = {
  interjection: {
    ja: '感動詞',
    en: 'interjection',
    de: 'Interjektion',
  },
  noun: {
    ja: '名詞',
    en: 'noun',
    de: 'Nomen',
  },
  verb: {
    ja: '動詞',
    en: 'verb',
    de: 'Verb',
  },
  adjective: {
    ja: '形容詞',
    en: 'adjective',
    de: 'Adjektiv',
  },
}

export const LEVEL_LABELS: Record<LevelCode, LocalizedText> = {
  L0: {
    ja: 'L0 完全初学者',
    en: 'L0 complete beginner',
    de: 'L0 kompletter Einstieg',
  },
  L1: {
    ja: 'L1 超初級',
    en: 'L1 ultra-beginner',
    de: 'L1 erste Grundlagen',
  },
}

export const PURPOSE_LABELS: Record<LearningPurpose, LocalizedText> = {
  conversation: {
    ja: '日常会話',
    en: 'conversation',
    de: 'Alltagsgespräche',
  },
  travel: {
    ja: '留学・移住',
    en: 'travel / relocation',
    de: 'Reise / Umzug',
  },
  exam: {
    ja: '試験対策',
    en: 'exam prep',
    de: 'Prüfungsvorbereitung',
  },
  reading: {
    ja: '読書・ニュース理解',
    en: 'reading / news',
    de: 'Lesen / Nachrichten',
  },
}

export const LESSON_THEMES = [
  {
    title: {
      ja: 'L0 スタートセット',
      en: 'L0 launch set',
      de: 'L0 Startsatz',
    },
    theme: {
      ja: '挨拶・基本名詞・最初の動詞',
      en: 'greetings, core nouns, first verbs',
      de: 'Grußformeln, Grundnomen, erste Verben',
    },
  },
  {
    title: {
      ja: 'L1 日常運用',
      en: 'L1 everyday use',
      de: 'L1 Alltagseinsatz',
    },
    theme: {
      ja: '移動・描写・人間関係・思考',
      en: 'movement, description, people, thinking',
      de: 'Bewegung, Beschreibung, Beziehungen, Denken',
    },
  },
] as const

export function getPairId(
  nativeLanguage: LanguageCode,
  targetLanguage: LanguageCode,
) {
  return `${nativeLanguage}-${targetLanguage}`
}

export const LANGUAGE_PAIRS: LanguagePair[] = [
  { id: getPairId('ja', 'en'), nativeLanguage: 'ja', targetLanguage: 'en' },
  { id: getPairId('ja', 'de'), nativeLanguage: 'ja', targetLanguage: 'de' },
  { id: getPairId('en', 'ja'), nativeLanguage: 'en', targetLanguage: 'ja' },
  { id: getPairId('en', 'de'), nativeLanguage: 'en', targetLanguage: 'de' },
  { id: getPairId('de', 'ja'), nativeLanguage: 'de', targetLanguage: 'ja' },
  { id: getPairId('de', 'en'), nativeLanguage: 'de', targetLanguage: 'en' },
]

const CONCEPTS: ConceptSeed[] = [
  {
    id: 'greeting',
    level: 'L0',
    partOfSpeech: 'interjection',
    lexemes: {
      ja: {
        lemma: 'こんにちは',
        reading: 'こんにちは',
        pronunciation: 'konnichiwa',
        audioText: 'こんにちは',
        forms: [{ label: 'casual', value: 'やあ' }],
        gloss: 'a daytime greeting',
        example: 'こんにちは、ミナです。',
      },
      en: {
        lemma: 'hello',
        pronunciation: '/həˈloʊ/',
        audioText: 'hello',
        forms: [{ label: 'casual', value: 'hi' }],
        gloss: 'a greeting used when meeting someone',
        example: 'Hello, I am Mina.',
      },
      de: {
        lemma: 'hallo',
        pronunciation: '/haˈloː/',
        audioText: 'Hallo',
        forms: [{ label: 'casual', value: 'hi' }],
        gloss: 'a common greeting',
        example: 'Hallo, ich bin Mina.',
      },
    },
    translations: {
      ja: 'こんにちは',
      en: 'hello',
      de: 'hallo',
    },
    notes: {
      'ja-en': '電話の最初の hello にも使える。hi より中立。',
      'ja-de': 'Hallo は万能な出だし。Guten Tag よりくだけている。',
      'en-ja': 'こんにちは is mainly daytime and sounds softer than a literal hello.',
      'en-de': 'Hallo is the default greeting; Guten Tag is more formal.',
      'de-ja': 'こんにちは ist vor allem tagsüber natürlich.',
      'de-en': 'hello works on the phone too, not only face to face.',
    },
    examples: {
      ja: 'こんにちは、ミナです。',
      en: 'Hello, I am Mina.',
      de: 'Hallo, ich bin Mina.',
    },
    collocations: {
      ja: ['こんにちはと言う', 'こんにちは、皆さん'],
      en: ['say hello', 'hello there'],
      de: ['Hallo sagen', 'Hallo zusammen'],
    },
  },
  {
    id: 'water',
    level: 'L0',
    partOfSpeech: 'noun',
    lexemes: {
      ja: {
        lemma: '水',
        reading: 'みず',
        pronunciation: 'mizu',
        audioText: '水',
        forms: [{ label: 'polite', value: 'お水' }],
        gloss: 'water for drinking or daily use',
        example: '水をください。',
      },
      en: {
        lemma: 'water',
        pronunciation: '/ˈwɔːtər/',
        audioText: 'water',
        forms: [{ label: 'verb', value: 'to water plants' }],
        gloss: 'water as a drink or liquid',
        example: 'Can I have some water?',
      },
      de: {
        lemma: 'Wasser',
        pronunciation: '/ˈvasɐ/',
        audioText: 'Wasser',
        forms: [{ label: 'plural rare', value: 'Wässer' }],
        gloss: 'water as a basic liquid',
        example: 'Kann ich Wasser haben?',
      },
    },
    translations: {
      ja: '水',
      en: 'water',
      de: 'Wasser',
    },
    notes: {
      'ja-en': '不可算名詞として扱うのが基本。a water は文脈依存。',
      'ja-de': '通常は単数で使う。冠詞なしでも飲み物として自然。',
      'en-ja': '水 can stand alone; お水 adds softness in service contexts.',
      'en-de': 'Wasser is neuter and often appears without an article in requests.',
      'de-ja': 'お水 klingt höflicher als 水.',
      'de-en': 'water is usually uncountable, unlike many count nouns.',
    },
    examples: {
      ja: '水をください。',
      en: 'Can I have some water?',
      de: 'Kann ich Wasser haben?',
    },
    collocations: {
      ja: ['水を飲む', '冷たい水'],
      en: ['drink water', 'cold water'],
      de: ['Wasser trinken', 'kaltes Wasser'],
    },
  },
  {
    id: 'eat',
    level: 'L0',
    partOfSpeech: 'verb',
    lexemes: {
      ja: {
        lemma: '食べる',
        reading: 'たべる',
        pronunciation: 'taberu',
        audioText: '食べる',
        forms: [
          { label: 'polite', value: '食べます' },
          { label: 'past', value: '食べた' },
        ],
        gloss: 'to eat food',
        example: '毎朝、パンを食べる。',
      },
      en: {
        lemma: 'eat',
        pronunciation: '/iːt/',
        audioText: 'eat',
        forms: [
          { label: 'past', value: 'ate' },
          { label: 'participle', value: 'eaten' },
        ],
        gloss: 'to consume food',
        example: 'I eat bread every morning.',
      },
      de: {
        lemma: 'essen',
        pronunciation: '/ˈɛsn̩/',
        audioText: 'essen',
        forms: [
          { label: 'past', value: 'aß' },
          { label: 'participle', value: 'gegessen' },
        ],
        gloss: 'to eat',
        example: 'Ich esse jeden Morgen Brot.',
      },
    },
    translations: {
      ja: '食べる',
      en: 'eat',
      de: 'essen',
    },
    notes: {
      'ja-en': '現在習慣は I eat、今まさには I am eating と切り替える。',
      'ja-de': 'essen は主語変化があるので ich esse / du isst を意識。',
      'en-ja': '食べる changes for politeness, not for person.',
      'en-de': 'Remember stem change: du isst, er isst.',
      'de-ja': '日本語では主語より丁寧さが活用の中心。',
      'de-en': 'English keeps the base form except he/she eats.',
    },
    examples: {
      ja: '毎朝、パンを食べる。',
      en: 'I eat bread every morning.',
      de: 'Ich esse jeden Morgen Brot.',
    },
    collocations: {
      ja: ['朝ご飯を食べる', '外で食べる'],
      en: ['eat breakfast', 'eat outside'],
      de: ['Frühstück essen', 'draußen essen'],
    },
  },
  {
    id: 'book',
    level: 'L0',
    partOfSpeech: 'noun',
    lexemes: {
      ja: {
        lemma: '本',
        reading: 'ほん',
        pronunciation: 'hon',
        audioText: '本',
        forms: [{ label: 'counter', value: '一冊' }],
        gloss: 'a physical book',
        example: 'この本はやさしい。',
      },
      en: {
        lemma: 'book',
        pronunciation: '/bʊk/',
        audioText: 'book',
        forms: [{ label: 'plural', value: 'books' }],
        gloss: 'a book you can read',
        example: 'This book is easy.',
      },
      de: {
        lemma: 'Buch',
        pronunciation: '/buːx/',
        audioText: 'Buch',
        forms: [{ label: 'plural', value: 'Bücher' }],
        gloss: 'a book',
        example: 'Dieses Buch ist leicht.',
      },
    },
    translations: {
      ja: '本',
      en: 'book',
      de: 'Buch',
    },
    notes: {
      'ja-en': 'a book / books の数変化だけ先に押さえると使いやすい。',
      'ja-de': 'das Buch。複数は Bücher でウムラウト変化。',
      'en-ja': '本 is neutral; counter words like 一冊 appear when counting.',
      'en-de': 'German nouns keep gender; Buch is neuter: das Buch.',
      'de-ja': '冊の助数詞は後から足せばよい。本 alone is enough early on.',
      'de-en': 'English has a simpler plural: book / books.',
    },
    examples: {
      ja: 'この本はやさしい。',
      en: 'This book is easy.',
      de: 'Dieses Buch ist leicht.',
    },
    collocations: {
      ja: ['本を読む', '本を開く'],
      en: ['read a book', 'open a book'],
      de: ['ein Buch lesen', 'ein Buch öffnen'],
    },
  },
  {
    id: 'go',
    level: 'L1',
    partOfSpeech: 'verb',
    lexemes: {
      ja: {
        lemma: '行く',
        reading: 'いく',
        pronunciation: 'iku',
        audioText: '行く',
        forms: [
          { label: 'polite', value: '行きます' },
          { label: 'past', value: '行った' },
        ],
        gloss: 'to go to a place',
        example: 'あした学校へ行く。',
      },
      en: {
        lemma: 'go',
        pronunciation: '/ɡoʊ/',
        audioText: 'go',
        forms: [
          { label: 'past', value: 'went' },
          { label: 'participle', value: 'gone' },
        ],
        gloss: 'to move toward a place',
        example: 'I go to school tomorrow.',
      },
      de: {
        lemma: 'gehen',
        pronunciation: '/ˈɡeːən/',
        audioText: 'gehen',
        forms: [
          { label: 'past', value: 'ging' },
          { label: 'participle', value: 'gegangen' },
        ],
        gloss: 'to go, to walk',
        example: 'Ich gehe morgen zur Schule.',
      },
    },
    translations: {
      ja: '行く',
      en: 'go',
      de: 'gehen',
    },
    notes: {
      'ja-en': 'go home は前置詞なし。go to school との違いを確認。',
      'ja-de': 'gehen は歩く含みが出やすいが、初級では「行く」でよい。',
      'en-ja': '行く often pairs with particles like に or へ.',
      'en-de': 'gehen can mean go or walk; prepositions change with destination.',
      'de-ja': 'に / へ mark direction instead of German case endings.',
      'de-en': 'go has an irregular past: went, not goed.',
    },
    examples: {
      ja: 'あした学校へ行く。',
      en: 'I go to school tomorrow.',
      de: 'Ich gehe morgen zur Schule.',
    },
    collocations: {
      ja: ['学校へ行く', '外へ行く'],
      en: ['go home', 'go outside'],
      de: ['zur Schule gehen', 'nach draußen gehen'],
    },
  },
  {
    id: 'small',
    level: 'L1',
    partOfSpeech: 'adjective',
    lexemes: {
      ja: {
        lemma: '小さい',
        reading: 'ちいさい',
        pronunciation: 'chiisai',
        audioText: '小さい',
        forms: [{ label: 'na-adj alternative', value: '小さな' }],
        gloss: 'small in size',
        example: '小さい部屋が好きです。',
      },
      en: {
        lemma: 'small',
        pronunciation: '/smɔːl/',
        audioText: 'small',
        forms: [{ label: 'comparison', value: 'smaller' }],
        gloss: 'small in size or scale',
        example: 'I like small rooms.',
      },
      de: {
        lemma: 'klein',
        pronunciation: '/klaɪn/',
        audioText: 'klein',
        forms: [{ label: 'comparison', value: 'kleiner' }],
        gloss: 'small',
        example: 'Ich mag kleine Zimmer.',
      },
    },
    translations: {
      ja: '小さい',
      en: 'small',
      de: 'klein',
    },
    notes: {
      'ja-en': 'small は物理サイズにも規模にも使いやすい。',
      'ja-de': 'klein は形容詞語尾変化が後で重要になる。',
      'en-ja': '小さい comes before the noun and stays the same for person or number.',
      'en-de': 'Before nouns, adjective endings matter: kleine Zimmer.',
      'de-ja': '日本語では形容詞自体は変化しにくい。',
      'de-en': 'English adjectives do not change for case or number.',
    },
    examples: {
      ja: '小さい部屋が好きです。',
      en: 'I like small rooms.',
      de: 'Ich mag kleine Zimmer.',
    },
    collocations: {
      ja: ['小さい町', '小さい声'],
      en: ['small room', 'small town'],
      de: ['kleines Zimmer', 'kleine Stadt'],
    },
  },
  {
    id: 'friend',
    level: 'L1',
    partOfSpeech: 'noun',
    lexemes: {
      ja: {
        lemma: '友だち',
        reading: 'ともだち',
        pronunciation: 'tomodachi',
        audioText: '友だち',
        forms: [{ label: 'kanji', value: '友達' }],
        gloss: 'a friend',
        example: '友だちと話す。',
      },
      en: {
        lemma: 'friend',
        pronunciation: '/frɛnd/',
        audioText: 'friend',
        forms: [{ label: 'plural', value: 'friends' }],
        gloss: 'a friend',
        example: 'I talk with a friend.',
      },
      de: {
        lemma: 'Freund',
        pronunciation: '/fʁɔʏnt/',
        audioText: 'Freund',
        forms: [
          { label: 'feminine', value: 'Freundin' },
          { label: 'plural', value: 'Freunde' },
        ],
        gloss: 'friend, male friend',
        example: 'Ich spreche mit einem Freund.',
      },
    },
    translations: {
      ja: '友だち',
      en: 'friend',
      de: 'Freund',
    },
    notes: {
      'ja-en': 'friend は広く使えるが、close friend は親しい友人を強める。',
      'ja-de': 'Freund / Freundin は恋人文脈にも出るので文脈確認が大切。',
      'en-ja': '友だち feels broad and friendly; 友人 is a bit more formal.',
      'en-de': 'Freund can be ambiguous between friend and boyfriend in context.',
      'de-ja': '友だち is safer and lighter than the formal 友人.',
      'de-en': 'friend is less ambiguous than Freund in romantic contexts.',
    },
    examples: {
      ja: '友だちと話す。',
      en: 'I talk with a friend.',
      de: 'Ich spreche mit einem Freund.',
    },
    collocations: {
      ja: ['友だちになる', '友だちと会う'],
      en: ['make a friend', 'meet friends'],
      de: ['einen Freund treffen', 'Freunde finden'],
    },
  },
  {
    id: 'think',
    level: 'L1',
    partOfSpeech: 'verb',
    lexemes: {
      ja: {
        lemma: '思う',
        reading: 'おもう',
        pronunciation: 'omou',
        audioText: '思う',
        forms: [
          { label: 'polite', value: '思います' },
          { label: 'past', value: '思った' },
        ],
        gloss: 'to think, to feel',
        example: 'それはよいと思う。',
      },
      en: {
        lemma: 'think',
        pronunciation: '/θɪŋk/',
        audioText: 'think',
        forms: [
          { label: 'past', value: 'thought' },
          { label: 'participle', value: 'thought' },
        ],
        gloss: 'to think or believe',
        example: 'I think that is good.',
      },
      de: {
        lemma: 'denken',
        pronunciation: '/ˈdɛŋkn̩/',
        audioText: 'denken',
        forms: [
          { label: 'past', value: 'dachte' },
          { label: 'participle', value: 'gedacht' },
        ],
        gloss: 'to think',
        example: 'Ich denke, das ist gut.',
      },
    },
    translations: {
      ja: '思う',
      en: 'think',
      de: 'denken',
    },
    notes: {
      'ja-en': 'I think の後ろは節をそのまま続けやすい。',
      'ja-de': 'denken は dass 節や an + Akk. と結びつくことが多い。',
      'en-ja': '思う is often used with quoted content like 〜と思う.',
      'en-de': 'denken commonly introduces opinions: Ich denke, ...',
      'de-ja': '〜と思う is a very common opinion frame in Japanese.',
      'de-en': 'think is flexible but often lighter than a firm statement.',
    },
    examples: {
      ja: 'それはよいと思う。',
      en: 'I think that is good.',
      de: 'Ich denke, das ist gut.',
    },
    collocations: {
      ja: ['そう思う', 'よいと思う'],
      en: ['I think so', 'think carefully'],
      de: ['ich denke so', 'gut denken'],
    },
  },
]

function languageLabel(code: LanguageCode, locale: LanguageCode) {
  return LANGUAGES.find((language) => language.code === code)?.label[locale] ?? code
}

function buildCourseText(pair: LanguagePair, locale: LanguageCode) {
  const target = languageLabel(pair.targetLanguage, locale)
  const native = languageLabel(pair.nativeLanguage, locale)

  if (locale === 'ja') {
    return {
      title: `${native}話者向け${target}スターター`,
      description: `${native}話者に最適化した L0-L1 の語彙導入コース`,
    }
  }

  if (locale === 'de') {
    return {
      title: `${target}-Start für ${native}sprachige Lernende`,
      description: `L0-L1 Wortschatzkurs mit Erklärungen für ${native}sprachige Lernende`,
    }
  }

  return {
    title: `${target} launch for ${native} speakers`,
    description: `L0-L1 vocabulary runway tailored for ${native} speakers`,
  }
}

export const LEXEMES: Lexeme[] = CONCEPTS.flatMap((concept) =>
  (Object.keys(concept.lexemes) as LanguageCode[]).map((languageCode) => {
    const seed = concept.lexemes[languageCode]
    const translations = LANGUAGE_PAIRS.filter(
      (pair) => pair.targetLanguage === languageCode,
    ).map((pair) => ({
      pairId: pair.id,
      text: concept.translations[pair.nativeLanguage],
      note: concept.notes[pair.id],
    }))

    return {
      id: `${languageCode}-${concept.id}`,
      conceptId: concept.id,
      language: languageCode,
      lemma: seed.lemma,
      reading: seed.reading,
      pronunciation: seed.pronunciation,
      partOfSpeech: concept.partOfSpeech,
      level: concept.level,
      forms: seed.forms,
      audioText: seed.audioText,
      senses: [
        {
          id: `${languageCode}-${concept.id}-sense`,
          gloss: seed.gloss,
          translations,
          examples: [
            {
              target: seed.example,
              translations: concept.examples,
            },
          ],
          collocations: concept.collocations[languageCode],
        },
      ],
    }
  }),
)

export const LEXEME_RECORD = Object.fromEntries(
  LEXEMES.map((lexeme) => [lexeme.id, lexeme]),
) as Record<string, Lexeme>

export const LESSONS: Lesson[] = LANGUAGE_PAIRS.flatMap((pair) => {
  const targetLexemes = LEXEMES.filter(
    (lexeme) => lexeme.language === pair.targetLanguage,
  )
  const lessonGroups = [targetLexemes.slice(0, 4), targetLexemes.slice(4, 8)]

  return lessonGroups.map((group, index) => {
    const lessonId = `${pair.id}-lesson-${index + 1}`

    return {
      id: lessonId,
      pairId: pair.id,
      order: index + 1,
      level: index === 0 ? 'L0' : 'L1',
      title: LESSON_THEMES[index].title,
      theme: LESSON_THEMES[index].theme,
      studyItemIds: group.map((lexeme) => `${pair.id}-${lexeme.conceptId}`),
    }
  })
})

export const LESSON_RECORD = Object.fromEntries(
  LESSONS.map((lesson) => [lesson.id, lesson]),
) as Record<string, Lesson>

export const STUDY_ITEMS: StudyItem[] = LANGUAGE_PAIRS.flatMap((pair) => {
  const pairLessons = LESSONS.filter((lesson) => lesson.pairId === pair.id)

  return pairLessons.flatMap((lesson) =>
    lesson.studyItemIds.map((studyItemId) => {
      const conceptId = studyItemId.replace(`${pair.id}-`, '')
      const lexeme = LEXEMES.find(
        (candidate) =>
          candidate.language === pair.targetLanguage &&
          candidate.conceptId === conceptId,
      )

      if (!lexeme) {
        throw new Error(`Missing lexeme for ${studyItemId}`)
      }

      return {
        id: studyItemId,
        pairId: pair.id,
        lexemeId: lexeme.id,
        senseId: lexeme.senses[0].id,
        lessonId: lesson.id,
        level: lexeme.level,
        variants: [...SUPPORTED_VARIANTS],
      }
    }),
  )
})

export const STUDY_ITEM_RECORD = Object.fromEntries(
  STUDY_ITEMS.map((studyItem) => [studyItem.id, studyItem]),
) as Record<string, StudyItem>

export const COURSES: Course[] = LANGUAGE_PAIRS.map((pair) => {
  const pairLessons = LESSONS.filter((lesson) => lesson.pairId === pair.id).sort(
    (left, right) => left.order - right.order,
  )

  return {
    id: `${pair.id}-starter-course`,
    pairId: pair.id,
    title: {
      ja: buildCourseText(pair, 'ja').title,
      en: buildCourseText(pair, 'en').title,
      de: buildCourseText(pair, 'de').title,
    },
    description: {
      ja: buildCourseText(pair, 'ja').description,
      en: buildCourseText(pair, 'en').description,
      de: buildCourseText(pair, 'de').description,
    },
    levelRange: ['L0', 'L1'],
    lessonIds: pairLessons.map((lesson) => lesson.id),
  }
})

export const COURSE_RECORD = Object.fromEntries(
  COURSES.map((course) => [course.id, course]),
) as Record<string, Course>

export function getLanguage(code: LanguageCode) {
  return LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0]
}

export function getLanguagePair(pairId: string) {
  return LANGUAGE_PAIRS.find((pair) => pair.id === pairId) ?? LANGUAGE_PAIRS[0]
}

export function getCourseForPair(pairId: string) {
  return COURSES.find((course) => course.pairId === pairId) ?? COURSES[0]
}

export function getLessonsForPair(pairId: string) {
  return LESSONS.filter((lesson) => lesson.pairId === pairId).sort(
    (left, right) => left.order - right.order,
  )
}

export function getStudyItemsForPair(pairId: string) {
  return STUDY_ITEMS.filter((studyItem) => studyItem.pairId === pairId)
}
