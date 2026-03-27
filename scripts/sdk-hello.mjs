import { query } from "@anthropic-ai/claude-agent-sdk";

const prompt = "このプロジェクトのsrc/lib/file-system.tsにどんなクラスがあるか1行で教えてください";

console.log("Claude Code SDK 動作確認中...\n");

for await (const message of query({ prompt })) {
  // 最終的なアシスタントの返答だけ表示
  if (
    message.type === "assistant" &&
    Array.isArray(message.message?.content)
  ) {
    for (const block of message.message.content) {
      if (block.type === "text") {
        console.log("Claude:", block.text);
      }
    }
  }
}
