# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup       # 初回セットアップ: 依存関係インストール + Prisma生成 + マイグレーション
npm run dev         # 開発サーバー起動 (Turbopack使用)
npm run build       # プロダクションビルド
npm run lint        # ESLint
npm test            # 全テスト実行 (vitest)
npx vitest run src/lib/__tests__/file-system.test.ts  # 特定テストファイルの実行
npm run db:reset    # DBリセット (強制)
```

## Architecture

### 全体構成

UIGen は「チャットで React コンポーネントを生成し、ブラウザ上でプレビューする」アプリ。
生成されたファイルはディスクに保存されず、インメモリの仮想ファイルシステムで管理される。

### データフロー

1. ユーザーがチャットでプロンプト入力
2. `POST /api/chat` に現在のメッセージ履歴と仮想FSの状態を送信
3. サーバー側でVercel AI SDKの `streamText` を使いClaudeを呼び出す
4. Claudeは `str_replace_editor` / `file_manager` ツールを使い仮想FS上のファイルを操作
5. ストリーミングレスポンスをクライアントで受信し、ツール呼び出しを `FileSystemContext` に反映
6. `PreviewFrame` が仮想FSの内容をリアルタイムでレンダリング
7. 認証済みユーザーの場合、チャット完了後にメッセージとファイルをDBに永続化

### 主要コンテキスト

- `FileSystemProvider` (`src/lib/contexts/file-system-context.tsx`): `VirtualFileSystem` クラスをラップしReactから操作するためのコンテキスト。`handleToolCall` でAIのツール呼び出しを受け取り仮想FSに反映する
- `ChatProvider` (`src/lib/contexts/chat-context.tsx`): Vercel AI SDK の `useChat` をラップ。メッセージ管理とAPI通信を担う

### AIツール

`src/app/api/chat/route.ts` で2つのツールを登録:

- `str_replace_editor`: ファイルの作成(`create`)・部分置換(`str_replace`)・行挿入(`insert`)
- `file_manager`: ファイルの名前変更(`rename`)・削除(`delete`)

### 認証

`src/lib/auth.ts` でJWT + httpOnly Cookieによるセッション管理。有効期間は7日。
未認証でも匿名ユーザーとして利用可能だが、プロジェクトはDBに保存されない。

### DB

SQLite + Prisma。`@prisma/schema.prisma` を参照。
`Project.messages` と `Project.data` はそれぞれJSON文字列として保存される。

### AI Provider

`src/lib/provider.ts` で `ANTHROPIC_API_KEY` の有無を判定:
- APIキーあり → `claude-haiku-4-5` を使用
- APIキーなし → `MockLanguageModel` (静的レスポンスを返すモック) を使用

## テスト

vitest + jsdom + `@testing-library/react`。テストファイルは `src/lib/__tests__/` 以下に配置。

## キーファイル

- `src/lib/file-system.ts` — `VirtualFileSystem` クラス本体
- `src/lib/prompts/generation.tsx` — Claudeへのシステムプロンプト
- `src/lib/tools/str-replace.ts` / `file-manager.ts` — AIツールの実装
- `src/lib/provider.ts` — 言語モデルのプロバイダー切り替え
- `prisma/schema.prisma` — DBスキーマ定義
