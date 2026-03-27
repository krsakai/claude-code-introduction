const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const examplePath = path.join(projectRoot, ".claude", "settings.example.json");
const outputPath = path.join(projectRoot, ".claude", "settings.local.json");

if (!fs.existsSync(examplePath)) {
  console.log("settings.example.json が見つかりません。スキップします。");
  process.exit(0);
}

// $PWD を実際のプロジェクトルートパスに置換
const content = fs.readFileSync(examplePath, "utf-8");
const replaced = content.replaceAll("$PWD", projectRoot);

// JSON として妥当か検証
try {
  JSON.parse(replaced);
} catch (e) {
  console.error("settings.example.json の変換後にJSONパースエラーが発生しました:", e.message);
  process.exit(1);
}

fs.writeFileSync(outputPath, replaced, "utf-8");
console.log(`settings.local.json を生成しました: ${outputPath}`);
