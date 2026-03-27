# UIGen

AI で React コンポーネントを生成し、ブラウザ上でライブプレビューするアプリです。

## Claude Code in Action との関係

[Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) を参照しながら試す場合のメモです。コースの手順は汎用の例に基づくことが多く、リポジトリごとの構成とは一致しません。このリポジトリではルートの `CLAUDE.md`、`.claude/`（コマンド・Hook）、および `npm run setup` で生成される `.claude/settings.local.json`（`.gitignore` 対象）を前提にしています。

## 前提条件

- Node.js 18 以上、npm
- Hook 定義をそのまま使う場合は `jq`（`settings.example.json` の PreToolUse 用）
- Claude Code（CLI）利用時は [Claude Code](https://claude.ai/code) とターミナルからの認証設定

## セットアップ

### 環境変数（任意）

`.env` に `ANTHROPIC_API_KEY` を置くとチャット生成に Claude を使います。未設定の場合はモック応答です（`src/lib/provider.ts`）。

```env
ANTHROPIC_API_KEY=your-api-key-here
```

### 依存関係と DB

```bash
npm run setup
```

`npm install`、`prisma generate`、`prisma migrate dev` に加え、`scripts/init-claude.js` が `.claude/settings.example.json` から `.claude/settings.local.json` を生成します。スキーマとマイグレーションに差分があると `migrate dev` が対話でマイグレーション名を聞く場合があります。

### 開発サーバー

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## 使い方

1. サインアップまたは匿名で利用
2. チャットでコンポーネントを指示
3. プレビュー／Code ビューで確認・編集
4. 会話で反復

## Claude Code で作業するとき

- 概要・コマンド: `CLAUDE.md`
- スラッシュコマンド: `.claude/commands/`
- Hook: `.claude/hooks/` と `.claude/settings.local.json`

アプリ用の `.env` と Claude Code の認証は別です。同じ API キーを流用しても構いません。

## npm スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run build` | プロダクションビルド |
| `npm run lint` | ESLint |
| `npm test` | Vitest |
| `npm run db:reset` | DB リセット（強制） |

## 機能・スタック

AI による生成（キーあり）／モック（なし）、ライブプレビュー、仮想ファイルシステム上のコード編集、登録ユーザー向け永続化、エクスポート。

Next.js 15、React 19、TypeScript、Tailwind CSS v4、Prisma + SQLite、Vercel AI SDK、Anthropic Claude。
