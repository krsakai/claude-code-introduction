# UIGen

AI で React コンポーネントを生成し、ブラウザ上でライブプレビューするアプリです。

## Anthropic Academy「Claude Code in Action」との関係

[Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action)（Anthropic Academy の無料コース）では、Claude Code のコンテキスト・カスタムコマンド・MCP・Hooks・SDK などを学びます。**教材の例とは別のリポジトリ**でハンズオンすると、手順どおりに進めてもファイル構成や設定が一致せず、そのままでは再現できないことがあります。

このリポジトリは次の前提で用意されています。

- ルートの **`CLAUDE.md`**: このプロジェクト向けの Claude Code 用ガイド（アーキテクチャ・主要コマンド）
- **`.claude/`**: カスタムコマンド（例: `code_review`）や Hook 用スクリプトが既に含まれる
- **`npm run setup`**: 依存関係・DB に加え、**`.claude/settings.local.json` を自動生成**（`$PWD` を実パスに置換）

コースを受講しながらこのリポで試す場合は、まず下記の **セットアップを最後まで** 実行してください。`settings.local.json` は `.gitignore` 対象のため、**クローン直後には存在しません**（`npm run setup` で作成されます）。

## 前提条件

- Node.js 18 以上
- npm
- **このリポジトリの Hook 設定をそのまま使う場合**: `jq`（`.claude/settings.example.json` 内の PreToolUse で使用）
- **Claude Code（CLI）でハンズオンする場合**: [Claude Code](https://claude.ai/code) のインストールと、ターミナルで利用できる API キー（環境変数など）

## セットアップ

### 1. アプリ用の環境変数（任意）

`.env` を編集し、Anthropic の API キーを設定できます。

```env
ANTHROPIC_API_KEY=your-api-key-here
```

キーがない場合でもアプリは起動しますが、**チャット経由の生成はモック応答**になります（`src/lib/provider.ts` の分岐）。

### 2. 依存関係・Prisma・Claude Code 用ローカル設定

```bash
npm run setup
```

このコマンドは次を行います。

- パッケージのインストール
- Prisma Client の生成
- SQLite 向けマイグレーションの適用（`prisma migrate dev`）
- **`scripts/init-claude.js`** により `.claude/settings.local.json` を `.claude/settings.example.json` から生成

> **注意**: `prisma migrate dev` はスキーマと既存マイグレーションがずれていると、新しいマイグレーション名の入力を求めることがあります。手元の DB が空の状態で試すか、`prisma/schema.prisma` を変更せずにセットアップしてください。

### 3. 開発サーバー

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## アプリの使い方

1. サインアップするか、匿名のまま利用
2. チャットで作りたい React コンポーネントを指示
3. プレビューで生成結果を確認
4. Code ビューで生成ファイルを確認・編集
5. 会話を続けて改善

## Claude Code でこのリポジトリを触るとき

| 内容 | 参照先 |
|------|--------|
| プロジェクト全体の説明・npm コマンド | `CLAUDE.md` |
| スラッシュコマンド | `.claude/commands/`（例: `code_review`） |
| Hook（`.env` 読み取りブロックなど） | `.claude/hooks/` と `.claude/settings.local.json` |

**アプリの `.env` の API キー**と**ターミナルで Claude Code が使う認証**は別の仕組みです。どちらも同じ Anthropic のキーを使うことはできますが、**Claude Code 側のログイン／環境変数**も忘れずに設定してください。

## その他の npm スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run build` | プロダクションビルド |
| `npm run lint` | ESLint |
| `npm test` | Vitest で全テスト |
| `npm run db:reset` | DB をリセット（強制） |

## よくあるつまずき（ハンズオン向け）

- **Hook やパーミッションが効かない**  
  `npm run setup` を実行したか、`.claude/settings.local.json` がルートにできているか確認してください。
- **`jq: command not found`**  
  Hook 定義で `jq` を使っているため、インストールするか、`settings.local.json` から該当 Hook を一時的に外してください。
- **コースの画面とディレクトリ構成が違う**  
  教材は汎用例のことが多いです。このリポでは **`CLAUDE.md` と `src/` の実装**が正です。

## 機能概要

- Claude によるコンポーネント生成（API キーあり）／モック（なし）
- ライブプレビュー・ホットリロード
- ディスクに書かない仮想ファイルシステム
- シンタックスハイライト付きエディタ
- 登録ユーザーのプロジェクト永続化
- 生成コードのエクスポート

## 技術スタック

- Next.js 15（App Router）
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma + SQLite
- Anthropic Claude（Vercel AI SDK）
