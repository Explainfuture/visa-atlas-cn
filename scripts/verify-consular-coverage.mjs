import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getCountryDataList } from "countries-list";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataset = JSON.parse(
  await readFile(resolve(root, "src/data/consular-locations.generated.json"), "utf8"),
);
const expected = getCountryDataList()
  .filter((country) => country.iso2 !== "CN")
  .map((country) => country.iso2.toLowerCase())
  .sort();
const actual = Object.keys(dataset.locations).sort();
const missing = expected.filter((code) => !actual.includes(code));
const extra = actual.filter((code) => !expected.includes(code));

if (new Set(actual).size !== actual.length) throw new Error("Consular data contains duplicate destination codes.");
if (missing.length || extra.length) {
  throw new Error(`Coverage mismatch. Missing: ${missing.join(", ") || "none"}; extra: ${extra.join(", ") || "none"}.`);
}
if (dataset.metadata.destinationCount !== expected.length) {
  throw new Error("Consular metadata destination count is stale.");
}

const allowedKinds = new Set(["embassy", "parent-mission", "domestic-authority", "official-check"]);
const officiallyListedWithoutAddress = new Set(["lt", "mc", "sm", "tm"]);
for (const [code, location] of Object.entries(dataset.locations)) {
  if (!allowedKinds.has(location.kind)) throw new Error(`${code} has an unsupported location kind.`);
  for (const field of ["office", "sourceUrl", "sourceAuthority", "verifiedAt", "note"]) {
    if (typeof location[field] !== "string" || !location[field].trim()) {
      throw new Error(`${code} is missing required field: ${field}.`);
    }
  }
  if (!/^https:\/\//.test(location.sourceUrl)) throw new Error(`${code} does not use an HTTPS source URL.`);
  if (["embassy", "parent-mission"].includes(location.kind) && !location.address && !officiallyListedWithoutAddress.has(code)) {
    throw new Error(`${code} is missing its mission address without an explicit exception.`);
  }
}

for (const code of ["hk", "mo", "tw"]) {
  const location = dataset.locations[code];
  if (location.kind !== "domestic-authority" || location.sourceAuthority !== "国家移民管理局") {
    throw new Error(`${code} must use the domestic exit-entry authority route.`);
  }
}
if (!dataset.locations.tw.note.includes("中国台湾")) {
  throw new Error("Taiwan consular routing must be labelled 中国台湾.");
}

const counts = Object.values(dataset.locations).reduce((summary, location) => {
  summary[location.kind] = (summary[location.kind] ?? 0) + 1;
  return summary;
}, {});
for (const [kind, count] of Object.entries(counts)) {
  if (dataset.metadata.counts[kind] !== count) throw new Error(`Metadata count mismatch for ${kind}.`);
}

console.log(
  `Consular coverage OK: ${actual.length}/${expected.length} destinations; ` +
    `${counts.embassy} missions, ${counts["parent-mission"]} parent authorities, ` +
    `${counts["domestic-authority"]} domestic routes, ${counts["official-check"]} official checks.`,
);
