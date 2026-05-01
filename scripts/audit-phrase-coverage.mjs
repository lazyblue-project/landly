import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const phraseFile = path.join(projectRoot, "data", "phrases.ts");
const source = fs.readFileSync(phraseFile, "utf8");
const phraseBlocks = source
  .split(/\n\s*\{\n/g)
  .filter((block) => /id:\s*"phrase_\d+"/.test(block));

const ids = phraseBlocks
  .map((block) => block.match(/id:\s*"(phrase_\d+)"/)?.[1])
  .filter(Boolean)
  .sort();

const expectedIds = Array.from({ length: 50 }, (_, index) => `phrase_${String(index + 1).padStart(3, "0")}`);
const missingIds = expectedIds.filter((id) => !ids.includes(id));
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

const languages = ["zh", "ja", "es", "fr"];
const requiredCoverage = { zh: 100, ja: 100, es: 75, fr: 75 };
const coverage = Object.fromEntries(
  languages.map((language) => {
    const missing = phraseBlocks
      .filter((block) => !new RegExp(`\\b${language}:\\s*"`).test(block))
      .map((block) => block.match(/id:\s*"(phrase_\d+)"/)?.[1])
      .filter(Boolean);

    return [
      language,
      {
        translated: phraseBlocks.length - missing.length,
        total: phraseBlocks.length,
        coverage: phraseBlocks.length === 0 ? 0 : Math.round(((phraseBlocks.length - missing.length) / phraseBlocks.length) * 100),
        missing,
      },
    ];
  })
);

console.log("Phrase coverage audit");
console.log(`- Phrase count: ${ids.length}`);
console.log(`- Missing expected IDs: ${missingIds.length ? missingIds.join(", ") : "none"}`);
console.log(`- Duplicate IDs: ${duplicateIds.length ? duplicateIds.join(", ") : "none"}`);
for (const language of languages) {
  const item = coverage[language];
  console.log(`- ${language}: ${item.translated}/${item.total} (${item.coverage}%)`);
  if (item.missing.length > 0) console.log(`  missing: ${item.missing.join(", ")}`);
}

const languageCoverageReady = languages.every((language) => coverage[language].coverage >= requiredCoverage[language]);
if (missingIds.length > 0 || duplicateIds.length > 0 || !languageCoverageReady) {
  process.exitCode = 1;
}
