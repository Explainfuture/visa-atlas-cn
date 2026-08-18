import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "src/data/passport-offices.generated.json");
const verifiedAt = "2026-08-18";

const REGION_SOURCE = "https://s.nia.gov.cn/mps/static/json/provinceCity.json";
const OFFICE_SOURCE = "https://s.nia.gov.cn/mps/static/json/enterprise_{provinceId}.json";
const DIRECTORY_SOURCE = "https://s.nia.gov.cn/mps/views/query/query-address.html";

const provinceNameOverrides = {
  内蒙: "内蒙古",
};
const retiredCityIds = new Set(["371200", "500110", "500111"]);

async function fetchText(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "user-agent": "Visa Atlas CN data updater (+https://github.com/Explainfuture/visa-atlas-cn)",
        },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolvePromise) => setTimeout(resolvePromise, attempt * 500));
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error(`Unable to fetch ${url}: ${lastError?.message ?? lastError}`);
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

function extractAssignedJson(source, variableName) {
  const match = source.match(new RegExp(`(?:var\\s+)?${variableName}\\s*=\\s*(\\[[\\s\\S]*?\\])\\s*;`));
  if (!match) throw new Error(`Unable to find ${variableName} in region source.`);
  return JSON.parse(match[1]);
}

function normalizeText(value) {
  return typeof value === "string" ? value.replace(/\\n/g, " ").replace(/\s+/g, " ").trim() : "";
}

function serviceMode(value) {
  if (value === "1") return "人工窗口";
  if (value === "2") return "自助服务";
  if (value === "3") return "人工窗口与自助服务";
  return "请向窗口确认";
}

function supportsPassport(scope) {
  if (!scope) return false;
  return /护照|中国公民|出入境证件|公民出国/.test(scope);
}

const regionSource = await fetchText(REGION_SOURCE);
const rawProvinces = extractAssignedJson(regionSource, "provinceJsonData");
const rawCities = extractAssignedJson(regionSource, "cityJsonData").filter(
  (city) => !retiredCityIds.has(String(city.id)),
);
const knownCityIds = new Set(rawCities.map((city) => String(city.id)));
const legacyCityMap = {
  "152100": "150700",
  "359000": "350200",
  "359200": "350200",
  "359300": "350200",
  "368200": "360800",
  "371200": "370100",
  "418100": "419001",
  "500110": "500222",
  "500111": "500225",
  "500155": "500225",
  "632100": "630200",
  "640000": "640100",
};

function resolveCityId(value) {
  const cityId = String(value ?? "");
  if (knownCityIds.has(cityId)) return cityId;
  if (legacyCityMap[cityId]) return legacyCityMap[cityId];
  const prefectureId = `${cityId.slice(0, 4)}00`;
  return knownCityIds.has(prefectureId) ? prefectureId : "";
}

const officeGroups = await mapLimit(rawProvinces, 8, async (province) => {
  const url = OFFICE_SOURCE.replace("{provinceId}", province.id);
  const offices = JSON.parse(await fetchText(url));
  return offices.map((office) => ({ ...office, provinceId: province.id }));
});

const rawOffices = officeGroups.flat();
const activeOffices = rawOffices.filter((office) => String(office.sfgbsld) !== "0");
const officesByCity = {};

for (const office of activeOffices) {
  const cityId = resolveCityId(office.cityId);
  if (!cityId) continue;

  const scope = normalizeText(office.ywslfw);
  const normalized = {
    id: String(office.id),
    name: normalizeText(office.simpleName) || "公安机关出入境管理窗口",
    address: normalizeText(office.address) || "请通过官方办事机构目录确认地址",
    phone: normalizeText(office.consultingTel) || "12367",
    workTime: normalizeText(office.workTime) || "请电话确认办公时间",
    serviceMode: serviceMode(String(office.ywslfs ?? "")),
    scope,
    supportsPassport: supportsPassport(scope),
  };

  officesByCity[cityId] ??= [];
  officesByCity[cityId].push(normalized);
}

for (const offices of Object.values(officesByCity)) {
  offices.sort((left, right) => {
    if (left.supportsPassport !== right.supportsPassport) return left.supportsPassport ? -1 : 1;
    return left.name.localeCompare(right.name, "zh-CN");
  });
}

const citiesByProvince = new Map();
for (const city of rawCities) {
  const provinceId = String(city.id).slice(0, 2);
  const cities = citiesByProvince.get(provinceId) ?? [];
  cities.push(city);
  citiesByProvince.set(provinceId, cities);
}
const provinces = rawProvinces.map((province) => ({
  id: String(province.id),
  name: provinceNameOverrides[province.name] ?? province.name,
  cities: (citiesByProvince.get(String(province.id)) ?? []).map((city) => ({
    id: String(city.id),
    name: normalizeText(city.name),
  })),
}));

const cityCount = provinces.reduce((count, province) => count + province.cities.length, 0);
const coveredCityCount = provinces.reduce(
  (count, province) => count + province.cities.filter((city) => officesByCity[city.id]?.length).length,
  0,
);
const passportOfficeCount = activeOffices.filter((office) => supportsPassport(normalizeText(office.ywslfw))).length;

const dataset = {
  metadata: {
    verifiedAt,
    sourceAuthority: "国家移民管理局",
    regionSource: REGION_SOURCE,
    officeSourcePattern: OFFICE_SOURCE,
    directorySource: DIRECTORY_SOURCE,
    provinceCount: provinces.length,
    cityCount,
    coveredCityCount,
    activeOfficeCount: activeOffices.length,
    passportOfficeCount,
    note: "办事机构地址、电话和办公时间来自国家移民管理局公开目录；前往前请再次电话确认首次申领普通护照业务与预约要求。",
  },
  provinces,
  officesByCity,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");

console.log(
  `Generated ${provinces.length} provinces, ${cityCount} cities and ${activeOffices.length} active offices ` +
    `(${passportOfficeCount} explicitly list passport/citizen services; ${coveredCityCount} cities have offices).`,
);
