import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataset = JSON.parse(
  await readFile(resolve(root, "src/data/passport-offices.generated.json"), "utf8"),
);

if (dataset.metadata.provinceCount !== 31 || dataset.provinces.length !== 31) {
  throw new Error(`Expected 31 mainland provincial-level regions, found ${dataset.provinces.length}.`);
}

const provinceIds = dataset.provinces.map((province) => province.id);
const cityIds = dataset.provinces.flatMap((province) => province.cities.map((city) => city.id));
if (new Set(provinceIds).size !== provinceIds.length) throw new Error("Duplicate province IDs found.");
if (new Set(cityIds).size !== cityIds.length) throw new Error("Duplicate city IDs found.");
if (cityIds.length !== dataset.metadata.cityCount) throw new Error("City count metadata is stale.");

for (const province of dataset.provinces) {
  if (!province.id || !province.name || !province.cities.length) {
    throw new Error(`Province ${province.id || "unknown"} is missing a name or cities.`);
  }
  for (const city of province.cities) {
    if (!city.id || !city.name) throw new Error(`${province.name} contains an invalid city.`);
  }
}

const knownCityIds = new Set(cityIds);
let activeOfficeCount = 0;
let passportOfficeCount = 0;
for (const [cityId, offices] of Object.entries(dataset.officesByCity)) {
  if (!knownCityIds.has(cityId)) {
    throw new Error(`Office data points to unknown city ID ${cityId}.`);
  }
  if (!Array.isArray(offices) || !offices.length) throw new Error(`${cityId} has an empty office list.`);
  for (const office of offices) {
    for (const field of ["id", "name", "address", "phone", "workTime", "serviceMode"]) {
      if (typeof office[field] !== "string" || !office[field].trim()) {
        throw new Error(`${cityId} office ${office.id ?? "unknown"} is missing ${field}.`);
      }
    }
    activeOfficeCount += 1;
    if (office.supportsPassport) passportOfficeCount += 1;
  }
}

if (activeOfficeCount !== dataset.metadata.activeOfficeCount) {
  throw new Error("Active office count metadata is stale.");
}
if (passportOfficeCount !== dataset.metadata.passportOfficeCount) {
  throw new Error("Passport office count metadata is stale.");
}

const coveredCityCount = cityIds.filter((cityId) => dataset.officesByCity[cityId]?.length).length;
if (coveredCityCount !== dataset.metadata.coveredCityCount) {
  throw new Error("Covered city count metadata is stale.");
}
if (!dataset.metadata.directorySource.startsWith("https://s.nia.gov.cn/")) {
  throw new Error("Passport office fallback must use the official NIA directory.");
}

console.log(
  `Passport coverage OK: ${dataset.provinces.length} provinces, ${cityIds.length} cities, ` +
    `${activeOfficeCount} active offices; ${coveredCityCount} cities have direct office records.`,
);
