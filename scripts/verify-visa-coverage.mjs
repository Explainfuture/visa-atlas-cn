import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getCountryDataList } from "countries-list";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generated = await readFile(resolve(root, "src/data/visa-baseline.generated.ts"), "utf8");
const guideSource = await readFile(resolve(root, "src/data/visa-guides.ts"), "utf8");
const expected = getCountryDataList()
  .filter((country) => country.iso2 !== "CN")
  .map((country) => country.iso2.toLowerCase())
  .sort();
const actual = [...generated.matchAll(/^  "([a-z]{2})": \{/gm)].map((match) => match[1]).sort();
const missing = expected.filter((code) => !actual.includes(code));
const extra = actual.filter((code) => !expected.includes(code));

if (new Set(actual).size !== actual.length) throw new Error("Generated visa baseline contains duplicate country codes.");
if (missing.length || extra.length) {
  throw new Error(`Coverage mismatch. Missing: ${missing.join(", ") || "none"}; extra: ${extra.join(", ") || "none"}.`);
}
if (!/visaGuides\[country\.code\] \?\? createBaselineVisaGuide\(country\)/.test(guideSource)) {
  throw new Error("Country guide fallback is not connected to the complete visa baseline.");
}
if (/status:\s*["']正在核验["']|费用待核验|此页暂未发布确定的签证结论/.test(guideSource)) {
  throw new Error("A pending placeholder guide is still present.");
}

console.log(`Visa guide coverage OK: ${actual.length}/${expected.length} destinations, pending placeholders: 0.`);
