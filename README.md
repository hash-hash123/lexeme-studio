# Lexeme Studio

多言語語彙学習プラットフォーム。要件定義書に基づき、**語彙概念（Lexeme）中心**かつ**母語 × 学習言語**を第一級概念として設計された SRS 学習アプリです。

## デプロイ先

- **Vercel（本番）:** <https://lexeme-studio.vercel.app>
- **GitHub Pages（ミラー）:** <https://hash-hash123.github.io/lexeme-studio/>

どちらも `main` ブランチへの push で自動デプロイされます。

## 実装済み機能

### コア
- 6 学習ペア（ja↔en、ja↔de、en↔de）と母語別 UI 文言
- Lexeme / Sense / Form / StudyItem / Lesson / Course ベースのデータモデル
- L0〜L2 のシード語彙コース（多義語含む）
- **4 種のカードバリアント:**
  - 認識カード（recognition）
  - 想起カード（recall）
  - 例文穴埋めカード（cloze）
  - 多義語識別カード（discriminate）
- SM-2 系 SRS + 変種ごとの習熟状態
- 音声再生（`speechSynthesis`）
- 語彙ブラウザの検索 / レベル・品詞・レッスンフィルタ

### パーソナライズ
- 初回起動時のレベル診断
- 1 日の学習目的・時間・目標レベル設定
- 母語別の学習ノート / 注意点

### 進捗と分析
- レッスン進行度
- 過去 7 / 30 日の復習数・定着率
- 連続学習日数（streak）
- 認識 / 想起 の精度、品詞別弱点トップ 3

### バックエンドと認証
- Supabase 連携（メール Magic Link 認証）
- 複数端末でプロフィール / SRS 状態 / 復習ログを自動同期
- RLS で各ユーザーは自分の行のみ読み書き可

### PWA
- `manifest.webmanifest` でインストール可能
- Service Worker によるオフラインキャッシュ（アプリシェル）

### 開発基盤
- TypeScript + React 19 + Vite 8
- Vitest によるユニットテスト（SRS 算出ロジック）
- GitHub Actions で push 時に自動ビルド + テスト + GitHub Pages デプロイ
- Vercel のネイティブ Git 連携で push 時に自動プロダクションデプロイ

## 開発

```bash
npm install
npm run dev
```

## 検証

```bash
npm test       # SRS ユニットテスト
npm run lint
npm run build
```

## リポジトリ構成

```
src/
├── App.tsx              # ルート
├── main.tsx             # エントリ（Service Worker 登録を含む）
├── types.ts             # 型定義
├── components/
│   ├── AuthPanel.tsx
│   ├── BrowserView.tsx
│   ├── DashboardView.tsx
│   ├── LevelDiagnostic.tsx
│   ├── ReviewView.tsx
│   └── SettingsView.tsx
├── data/
│   └── content.ts       # Lexeme / 概念定義、カード生成ヘルパー
└── lib/
    ├── i18n.ts
    ├── selectors.ts     # キュー / 進捗 / 分析
    ├── srs.ts           # SRS アルゴリズム（テスト済み）
    ├── storage.ts       # localStorage 永続化
    ├── supabase.ts
    ├── remoteSync.ts    # Supabase 同期
    ├── time.ts
    └── useAuth.ts
```

## 要件定義書との対応

| フェーズ | 状態 |
|---|---|
| §14 MVP | ✅ 全項目達成 |
| §13 Phase 1 | ✅ 全項目達成 |
| §13 Phase 2 | ✅ 例文穴埋め / 多義語対応 / レベル診断 / 母語別説明 |
| §13 Phase 3 | 🟡 類義語比較・コロケーション学習は未実装 |
| §13 Phase 4 | ❌ 未実装 |
| §8 成功指標 | ✅ 計測基盤稼働 |

## 今後の拡張候補

- Phase 3 機能: 類義語比較、上級語彙パック、ニュアンス比較
- コンテンツ大幅拡充（各言語で数百語）
- 学習ログに基づく出題最適化
- レッスン進行のロック解除 UX 改善
