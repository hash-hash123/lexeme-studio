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

export const SUPPORTED_VARIANTS: CardVariantKind[] = [
  'recognition',
  'recall',
  'cloze',
  'discriminate',
]

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
  L2: {
    ja: 'L2 初級',
    en: 'L2 beginner',
    de: 'L2 Anfaenger',
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
  {
    title: {
      ja: 'L2 抽象語彙',
      en: 'L2 abstract vocabulary',
      de: 'L2 abstrakter Wortschatz',
    },
    theme: {
      ja: '学習・時間・価値観・理解',
      en: 'learning, time, values, understanding',
      de: 'Lernen, Zeit, Werte, Verstehen',
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
  {
    id: 'learn',
    level: 'L2',
    partOfSpeech: 'verb',
    lexemes: {
      ja: {
        lemma: '学ぶ',
        reading: 'まなぶ',
        pronunciation: 'manabu',
        audioText: '学ぶ',
        forms: [
          { label: 'polite', value: '学びます' },
          { label: 'past', value: '学んだ' },
        ],
        gloss: 'to learn or study deeply',
        example: '毎日ドイツ語を学ぶ。',
      },
      en: {
        lemma: 'learn',
        pronunciation: '/lɜːrn/',
        audioText: 'learn',
        forms: [
          { label: 'past', value: 'learned' },
          { label: 'participle', value: 'learned' },
        ],
        gloss: 'to acquire knowledge or skill',
        example: 'I learn German every day.',
      },
      de: {
        lemma: 'lernen',
        pronunciation: '/ˈlɛʁnən/',
        audioText: 'lernen',
        forms: [
          { label: 'past', value: 'lernte' },
          { label: 'participle', value: 'gelernt' },
        ],
        gloss: 'to learn or study',
        example: 'Ich lerne jeden Tag Deutsch.',
      },
    },
    translations: {
      ja: '学ぶ',
      en: 'learn',
      de: 'lernen',
    },
    notes: {
      'ja-en': 'learn は know と違い「学習プロセス」を含意。study と近いが自然な結果ニュアンス付き。',
      'ja-de': 'lernen は不規則動詞ではなく、目的語は Akkusativ で取る。',
      'en-ja': '学ぶ implies deeper study than 習う; 勉強する is broader.',
      'en-de': 'lernen takes the thing being learned in the accusative: Deutsch lernen.',
      'de-ja': '勉強する より 学ぶ は体系的な習得ニュアンス。',
      'de-en': 'learn covers both the act and the outcome; study stresses the activity itself.',
    },
    examples: {
      ja: '毎日ドイツ語を学ぶ。',
      en: 'I learn German every day.',
      de: 'Ich lerne jeden Tag Deutsch.',
    },
    collocations: {
      ja: ['言語を学ぶ', '一から学ぶ'],
      en: ['learn a language', 'learn from scratch'],
      de: ['eine Sprache lernen', 'von Grund auf lernen'],
    },
  },
  {
    id: 'time',
    level: 'L2',
    partOfSpeech: 'noun',
    lexemes: {
      ja: {
        lemma: '時間',
        reading: 'じかん',
        pronunciation: 'jikan',
        audioText: '時間',
        forms: [{ label: 'suffix', value: '時間がある' }],
        gloss: 'time as an abstract or measurable unit',
        example: '時間がありません。',
      },
      en: {
        lemma: 'time',
        pronunciation: '/taɪm/',
        audioText: 'time',
        forms: [{ label: 'plural', value: 'times' }],
        gloss: 'time as duration or occasion',
        example: "I don't have time.",
      },
      de: {
        lemma: 'Zeit',
        pronunciation: '/tsaɪ̯t/',
        audioText: 'Zeit',
        forms: [{ label: 'plural', value: 'Zeiten' }],
        gloss: 'time as duration or era',
        example: 'Ich habe keine Zeit.',
      },
    },
    translations: {
      ja: '時間',
      en: 'time',
      de: 'Zeit',
    },
    notes: {
      'ja-en': 'time は文脈で可算/不可算が切り替わる（three times = 3回）。',
      'ja-de': 'Zeit は女性名詞。die Zeit haben = 時間がある。',
      'en-ja': '時間 means both "duration" and "clock hours"; 時 is more poetic.',
      'en-de': 'Zeit is feminine; plural Zeiten often means "eras" or "times of X".',
      'de-ja': '時間 ist am häufigsten für Dauer und Uhrzeit.',
      'de-en': 'time is uncountable as duration but countable as occurrence.',
    },
    examples: {
      ja: '時間がありません。',
      en: "I don't have time.",
      de: 'Ich habe keine Zeit.',
    },
    collocations: {
      ja: ['時間がある', '時間をかける'],
      en: ['have time', 'spend time'],
      de: ['Zeit haben', 'Zeit verbringen'],
    },
  },
  {
    id: 'important',
    level: 'L2',
    partOfSpeech: 'adjective',
    lexemes: {
      ja: {
        lemma: '大切',
        reading: 'たいせつ',
        pronunciation: 'taisetsu',
        audioText: '大切',
        forms: [{ label: 'attributive', value: '大切な' }],
        gloss: 'important, precious',
        example: '家族は大切です。',
      },
      en: {
        lemma: 'important',
        pronunciation: '/ɪmˈpɔːrtnt/',
        audioText: 'important',
        forms: [{ label: 'adverb', value: 'importantly' }],
        gloss: 'having great value or meaning',
        example: 'Family is important.',
      },
      de: {
        lemma: 'wichtig',
        pronunciation: '/ˈvɪçtɪç/',
        audioText: 'wichtig',
        forms: [{ label: 'comparative', value: 'wichtiger' }],
        gloss: 'important',
        example: 'Familie ist wichtig.',
      },
    },
    translations: {
      ja: '大切',
      en: 'important',
      de: 'wichtig',
    },
    notes: {
      'ja-en': '大切 は感情的価値を含み、important は客観的重要度寄り。使い分けに注意。',
      'ja-de': 'wichtig は客観的な重要度、大切 は感情を含む。類似語に bedeutend。',
      'en-ja': '大切 carries warmth; 重要 is more formal and abstract.',
      'en-de': 'wichtig is the default for "important"; bedeutend is more formal.',
      'de-ja': '大切 betont emotionale Wertschätzung, 重要 sachliche Bedeutung.',
      'de-en': 'important covers both objective importance and emotional value.',
    },
    examples: {
      ja: '家族は大切です。',
      en: 'Family is important.',
      de: 'Familie ist wichtig.',
    },
    collocations: {
      ja: ['大切な人', '大切にする'],
      en: ['very important', 'important to me'],
      de: ['sehr wichtig', 'wichtig fuer mich'],
    },
  },
  {
    id: 'understand',
    level: 'L2',
    partOfSpeech: 'verb',
    lexemes: {
      ja: {
        lemma: '理解する',
        reading: 'りかいする',
        pronunciation: 'rikai suru',
        audioText: '理解する',
        forms: [
          { label: 'casual', value: 'わかる' },
          { label: 'past', value: '理解した' },
        ],
        gloss: 'to understand or comprehend',
        example: '問題を理解する。',
      },
      en: {
        lemma: 'understand',
        pronunciation: '/ˌʌndərˈstænd/',
        audioText: 'understand',
        forms: [
          { label: 'past', value: 'understood' },
          { label: 'participle', value: 'understood' },
        ],
        gloss: 'to comprehend meaning',
        example: 'I understand the problem.',
      },
      de: {
        lemma: 'verstehen',
        pronunciation: '/fɛɐ̯ˈʃteːən/',
        audioText: 'verstehen',
        forms: [
          { label: 'past', value: 'verstand' },
          { label: 'participle', value: 'verstanden' },
        ],
        gloss: 'to understand',
        example: 'Ich verstehe das Problem.',
      },
    },
    translations: {
      ja: '理解する',
      en: 'understand',
      de: 'verstehen',
    },
    notes: {
      'ja-en': 'understand は状態動詞で進行形にならないのが基本（I am understanding は不自然）。',
      'ja-de': 'verstehen は不規則。分離動詞ではないので語順に注意。',
      'en-ja': '理解する is more formal; わかる is everyday.',
      'en-de': 'verstehen is the standard; kapieren is colloquial.',
      'de-ja': 'わかる ist im Alltag haeufiger, 理解する in formellen Kontexten.',
      'de-en': 'understand is usually stative; grasp can emphasize the moment of insight.',
    },
    examples: {
      ja: '問題を理解する。',
      en: 'I understand the problem.',
      de: 'Ich verstehe das Problem.',
    },
    collocations: {
      ja: ['意味を理解する', '深く理解する'],
      en: ['understand clearly', 'understand deeply'],
      de: ['klar verstehen', 'tief verstehen'],
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

// Hand-authored polysemous lexemes (multiple senses per lemma).
// Scoped to English verbs where polysemy is most prominent and requirements-aligned (§6.2).
const POLYSEMOUS_LEXEMES: Lexeme[] = [
  {
    id: 'en-run',
    conceptId: 'run',
    language: 'en',
    lemma: 'run',
    pronunciation: '/rʌn/',
    partOfSpeech: 'verb',
    level: 'L2',
    forms: [
      { label: 'past', value: 'ran' },
      { label: 'participle', value: 'run' },
    ],
    audioText: 'run',
    senses: [
      {
        id: 'en-run-move',
        gloss: 'to move swiftly on foot',
        translations: [
          {
            pairId: 'ja-en',
            text: '走る',
            note: '身体運動の「走る」。jog との違いは速さ・連続性。',
          },
          {
            pairId: 'de-en',
            text: 'laufen',
            note: '"laufen" kann aber auch "gehen" bedeuten; "rennen" ist eindeutiger.',
          },
        ],
        examples: [
          {
            target: 'I run every morning.',
            translations: {
              ja: '毎朝走っています。',
              en: 'I run every morning.',
              de: 'Ich laufe jeden Morgen.',
            },
          },
        ],
        collocations: ['run fast', 'run a marathon', 'go for a run'],
      },
      {
        id: 'en-run-operate',
        gloss: 'to operate or manage (a business, system, etc.)',
        translations: [
          {
            pairId: 'ja-en',
            text: '運営する',
            note: '会社・組織・システムなどを「回す／経営する」意味。manage に近いが動的。',
          },
          {
            pairId: 'de-en',
            text: 'fuehren / betreiben',
            note: '"betreiben" fuer Firmen/Systeme; "fuehren" fuer Organisationen.',
          },
        ],
        examples: [
          {
            target: 'She runs a small bakery.',
            translations: {
              ja: '彼女は小さなパン屋を運営している。',
              en: 'She runs a small bakery.',
              de: 'Sie fuehrt eine kleine Baeckerei.',
            },
          },
        ],
        collocations: ['run a business', 'run a company', 'run the show'],
      },
    ],
  },
  {
    id: 'en-take',
    conceptId: 'take',
    language: 'en',
    lemma: 'take',
    pronunciation: '/teɪk/',
    partOfSpeech: 'verb',
    level: 'L2',
    forms: [
      { label: 'past', value: 'took' },
      { label: 'participle', value: 'taken' },
    ],
    audioText: 'take',
    senses: [
      {
        id: 'en-take-grab',
        gloss: 'to pick up or carry something',
        translations: [
          {
            pairId: 'ja-en',
            text: '取る',
            note: '物を手に取る・持つ。広範に使える最重要語の一つ。',
          },
          {
            pairId: 'de-en',
            text: 'nehmen',
            note: '"nehmen" ist die haeufigste Uebersetzung fuer dieses Sinn.',
          },
        ],
        examples: [
          {
            target: 'Please take this bag.',
            translations: {
              ja: 'このバッグを取ってください。',
              en: 'Please take this bag.',
              de: 'Bitte nimm diese Tasche.',
            },
          },
        ],
        collocations: ['take a seat', 'take a book', 'take it with you'],
      },
      {
        id: 'en-take-time',
        gloss: 'to require a duration of time',
        translations: [
          {
            pairId: 'ja-en',
            text: 'かかる',
            note: '時間・お金・労力などが「かかる」。主語は行為ではなく要する物。',
          },
          {
            pairId: 'de-en',
            text: 'dauern / brauchen',
            note: '"es dauert ..." fuer Zeit; "etwas braucht ..." allgemeiner.',
          },
        ],
        examples: [
          {
            target: 'It takes two hours by train.',
            translations: {
              ja: '電車で2時間かかります。',
              en: 'It takes two hours by train.',
              de: 'Es dauert zwei Stunden mit dem Zug.',
            },
          },
        ],
        collocations: ['take time', 'take hours', 'take a while'],
      },
    ],
  },
]

export const LEXEMES: Lexeme[] = [...POLYSEMOUS_LEXEMES, ...CONCEPTS.flatMap((concept) =>
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
)]

export const LEXEME_RECORD = Object.fromEntries(
  LEXEMES.map((lexeme) => [lexeme.id, lexeme]),
) as Record<string, Lexeme>

export const LESSONS: Lesson[] = LANGUAGE_PAIRS.flatMap((pair) => {
  const targetLexemes = LEXEMES.filter(
    (lexeme) => lexeme.language === pair.targetLanguage,
  )
  const byLevel = (level: LevelCode) =>
    targetLexemes.filter((lexeme) => lexeme.level === level)
  const lessonGroups: Array<{ level: LevelCode; group: Lexeme[] }> = [
    { level: 'L0', group: byLevel('L0') },
    { level: 'L1', group: byLevel('L1') },
    { level: 'L2', group: byLevel('L2') },
  ]

  return lessonGroups.map(({ level, group }, index) => {
    const lessonId = `${pair.id}-lesson-${index + 1}`

    return {
      id: lessonId,
      pairId: pair.id,
      order: index + 1,
      level,
      title: LESSON_THEMES[index].title,
      theme: LESSON_THEMES[index].theme,
      studyItemIds: group.map((lexeme) => `${pair.id}-${lexeme.conceptId}`),
    }
  })
})

export const LESSON_RECORD = Object.fromEntries(
  LESSONS.map((lesson) => [lesson.id, lesson]),
) as Record<string, Lesson>

function canCloze(lexeme: Lexeme) {
  const sense = lexeme.senses[0]
  const example = sense?.examples[0]?.target ?? ''
  if (!example) return false
  const haystack = example.toLowerCase()
  if (haystack.includes(lexeme.lemma.toLowerCase())) return true
  return lexeme.forms.some((form) =>
    haystack.includes(form.value.toLowerCase()),
  )
}

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

      const variants: CardVariantKind[] = ['recognition', 'recall']
      if (canCloze(lexeme)) variants.push('cloze')
      if (lexeme.senses.length >= 2) variants.push('discriminate')

      return {
        id: studyItemId,
        pairId: pair.id,
        lexemeId: lexeme.id,
        senseId: lexeme.senses[0].id,
        lessonId: lesson.id,
        level: lexeme.level,
        variants,
      }
    }),
  )
})

export interface DiscriminatePrompt {
  example: string
  exampleTranslation?: string
  correctSenseId: string
  correctText: string
  correctNote: string
  options: Array<{ senseId: string; text: string; note: string }>
}

export function buildDiscriminatePrompt(
  lexeme: Lexeme,
  pairId: string,
): DiscriminatePrompt | null {
  if (lexeme.senses.length < 2) return null
  const [primarySense, ...otherSenses] = lexeme.senses
  const primaryTranslation = primarySense.translations.find(
    (entry) => entry.pairId === pairId,
  )
  if (!primaryTranslation) return null

  const distractors = otherSenses
    .map((sense) => {
      const translation = sense.translations.find(
        (entry) => entry.pairId === pairId,
      )
      return translation
        ? { senseId: sense.id, text: translation.text, note: translation.note }
        : null
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)

  if (distractors.length === 0) return null

  const example = primarySense.examples[0]
  if (!example) return null

  // For pairs where the native language has an entry in example.translations,
  // surface it to help the learner. Pair format is 'xx-yy' where xx is native.
  const nativeCode = pairId.split('-')[0] as 'ja' | 'en' | 'de'
  const translationForNative = example.translations[nativeCode]

  const options = [
    {
      senseId: primarySense.id,
      text: primaryTranslation.text,
      note: primaryTranslation.note,
    },
    ...distractors,
  ]

  // Deterministic shuffle based on lexeme id so same card shows same order.
  const hash = lexeme.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  if (hash % 2 === 1) options.reverse()

  return {
    example: example.target,
    exampleTranslation: translationForNative,
    correctSenseId: primarySense.id,
    correctText: primaryTranslation.text,
    correctNote: primaryTranslation.note,
    options,
  }
}

export function buildClozePrompt(lexeme: Lexeme) {
  const example = lexeme.senses[0]?.examples[0]?.target ?? ''
  if (!example) return null
  const candidates = [lexeme.lemma, ...lexeme.forms.map((form) => form.value)]

  for (const candidate of candidates) {
    if (!candidate) continue
    const idx = example.toLowerCase().indexOf(candidate.toLowerCase())
    if (idx >= 0) {
      const matched = example.slice(idx, idx + candidate.length)
      const before = example.slice(0, idx)
      const after = example.slice(idx + candidate.length)
      const blank = '_'.repeat(Math.max(4, candidate.length * 2))
      return {
        prompt: `${before}${blank}${after}`,
        answer: matched,
        full: example,
      }
    }
  }
  return null
}

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
