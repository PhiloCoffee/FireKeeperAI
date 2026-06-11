import assert from "node:assert/strict";
import test from "node:test";
import { TRANSLATIONS, formatMessage, normalizeLanguage } from "../src/i18n.js";

test("normalizeLanguage accepts supported languages and falls back to English", () => {
  assert.equal(normalizeLanguage("en"), "en");
  assert.equal(normalizeLanguage("zh"), "zh");
  assert.equal(normalizeLanguage("fr"), "en");
  assert.equal(normalizeLanguage(null), "en");
});

test("translations include Chinese Fire Keeper terminology", () => {
  assert.equal(TRANSLATIONS.zh.appTitle, "防火女 AI");
  assert.equal(TRANSLATIONS.zh.taskPane.title, "篝火账册");
  assert.equal(TRANSLATIONS.zh.taskPane.empty, "此誓约下没有任务。");
});

test("formatMessage replaces named placeholders", () => {
  assert.equal(formatMessage("Exported: {filePath}", { filePath: "tmp/out.md" }), "Exported: tmp/out.md");
});
