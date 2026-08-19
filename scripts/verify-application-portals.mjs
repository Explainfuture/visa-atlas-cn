import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getCountryDataList } from "countries-list";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const portalSource = await readFile(resolve(root, "src/data/application-portals.ts"), "utf8");
const pageSource = await readFile(resolve(root, "src/app/country/[code]/page.tsx"), "utf8");
const checklistSource = await readFile(resolve(root, "src/components/preparation-checklist.tsx"), "utf8");
const expectedCodes = new Set(
  getCountryDataList()
    .filter((country) => country.iso2 !== "CN")
    .map((country) => country.iso2.toLowerCase()),
);

const curatedBlock = portalSource.match(/const curatedPortals = \{([\s\S]+?)\n\} as const satisfies/);
const aliasBlock = portalSource.match(/const portalAliases:[\s\S]+?= \{([\s\S]+?)\n\};/);

if (!curatedBlock || !aliasBlock) throw new Error("Application portal registries could not be parsed.");

const curatedCodes = [...curatedBlock[1].matchAll(/^  ([a-z]{2}):/gm)].map((match) => match[1]);
const aliases = [...aliasBlock[1].matchAll(/^  ([a-z]{2}): "([a-z]{2})",/gm)].map((match) => ({
  code: match[1],
  target: match[2],
}));
const urls = [...curatedBlock[1].matchAll(/https:\/\/[^"\s]+/g)].map((match) => match[0]);
const unknownCodes = [...curatedCodes, ...aliases.map(({ code }) => code)].filter(
  (code) => !expectedCodes.has(code),
);
const unknownTargets = aliases.filter(({ target }) => !curatedCodes.includes(target));

if (new Set(curatedCodes).size !== curatedCodes.length) throw new Error("Curated application portals contain duplicate country codes.");
if (curatedCodes.length < 80) throw new Error(`Only ${curatedCodes.length} curated portals found; expected at least 80.`);
if (urls.length !== curatedCodes.length) {
  throw new Error(`Expected one official URL per curated portal; found ${urls.length} URLs for ${curatedCodes.length} portals.`);
}
if (unknownCodes.length) throw new Error(`Unknown country codes in portal registry: ${unknownCodes.join(", ")}.`);
if (unknownTargets.length) {
  throw new Error(`Portal aliases point to missing targets: ${unknownTargets.map(({ code, target }) => `${code}->${target}`).join(", ")}.`);
}
if (!/location\.website \?\? location\.sourceUrl/.test(portalSource)) {
  throw new Error("Countries without a curated portal no longer fall back to an official consular source.");
}
if (!/getApplicationPortal\(/.test(pageSource) || !/applicationPortal\.url/.test(pageSource)) {
  throw new Error("Country pages are not rendering the normalized official application portal.");
}
if (!/fallbackReference/.test(checklistSource) || !/参考 ·/.test(checklistSource)) {
  throw new Error("Material checklist does not expose its official reference fallback.");
}

console.log(
  `Application portal registry OK: ${curatedCodes.length} curated destinations + ${aliases.length} territorial aliases; all remaining destinations use an official consular fallback.`,
);
