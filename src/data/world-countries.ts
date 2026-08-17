import {
  getCountryDataList,
  getEmojiFlag,
  type ICountryData,
  type TContinentCode,
  type TCountryCode,
} from "countries-list";

export type ContinentSlug =
  | "asia"
  | "europe"
  | "north-america"
  | "south-america"
  | "africa"
  | "oceania"
  | "antarctica";

export type CountrySummary = {
  code: string;
  name: string;
  englishName: string;
  capital: string;
  continentCode: TContinentCode;
  continentName: string;
  continentSlug: ContinentSlug;
  flag: string;
  isTerritory: boolean;
};

export const continentDirectory = [
  { code: "AS", slug: "asia", name: "亚洲", englishName: "Asia", introduction: "从东亚到西亚，城市与海岛都在这里。" },
  { code: "EU", slug: "europe", name: "欧洲", englishName: "Europe", introduction: "申根区、英国与巴尔干半岛，各有自己的入境规则。" },
  { code: "NA", slug: "north-america", name: "北美洲", englishName: "North America", introduction: "北美大陆、加勒比海与中美洲目的地。" },
  { code: "SA", slug: "south-america", name: "南美洲", englishName: "South America", introduction: "从安第斯山脉到大西洋海岸的长途旅行。" },
  { code: "AF", slug: "africa", name: "非洲", englishName: "Africa", introduction: "北非古城、东非草原与南部非洲。" },
  { code: "OC", slug: "oceania", name: "大洋洲", englishName: "Oceania", introduction: "澳新与太平洋岛国的海陆旅程。" },
  { code: "AN", slug: "antarctica", name: "南极洲", englishName: "Antarctica", introduction: "没有主权国家，通常随许可齐全的探险航程前往。" },
] as const satisfies ReadonlyArray<{
  code: TContinentCode;
  slug: ContinentSlug;
  name: string;
  englishName: string;
  introduction: string;
}>;

const continentByCode = new Map(continentDirectory.map((continent) => [continent.code, continent]));
const chineseRegionNames = new Intl.DisplayNames(["zh-CN"], { type: "region" });
const chineseCollator = new Intl.Collator("zh-CN");

function toCountrySummary(country: ICountryData): CountrySummary {
  const continent = continentByCode.get(country.continent);

  if (!continent) {
    throw new Error(`Unsupported continent code: ${country.continent}`);
  }

  return {
    code: country.iso2.toLowerCase(),
    name: chineseRegionNames.of(country.iso2) ?? country.name,
    englishName: country.name,
    capital: country.capital,
    continentCode: country.continent,
    continentName: continent.name,
    continentSlug: continent.slug,
    flag: getEmojiFlag(country.iso2 as TCountryCode),
    isTerritory: Boolean(country.partOf),
  };
}

export const worldCountries = getCountryDataList()
  .filter((country) => country.iso2 !== "CN")
  .map(toCountrySummary)
  .toSorted((left, right) => chineseCollator.compare(left.name, right.name));

const countryByCode = new Map(worldCountries.map((country) => [country.code, country]));
const continentBySlug = new Map(continentDirectory.map((continent) => [continent.slug, continent]));

export function getCountry(code: string) {
  return countryByCode.get(code.toLowerCase());
}

export function getContinent(slug: string) {
  return continentBySlug.get(slug as ContinentSlug);
}

export function getCountriesByContinent(slug: string) {
  const continent = getContinent(slug);

  if (!continent) return [];

  return worldCountries.filter((country) => country.continentCode === continent.code);
}

export function getContinentCount(slug: string) {
  return getCountriesByContinent(slug).length;
}
