import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getCountryDataList } from "countries-list";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "src/data/consular-locations.generated.json");
const verifiedAt = "2026-08-18";

const MFA_EMBASSY_DIRECTORY = "https://www.mfa.gov.cn/web/lbfw_673061/wgzhslgjgxx/";
const MFA_CONSULATE_DIRECTORY = "https://www.mfa.gov.cn/web/lbfw_673061/lsgmd_673079/index.shtml";
const NIA_HK_MACAO_GUIDE = "https://s.nia.gov.cn/mps/bszy/wlgaot/sqgowl/201903/t20190313_1002.html";
const NIA_TAIWAN_GUIDE = "https://s.nia.gov.cn/mps/bszy/wlgaot/sqwltw/201903/t20190313_1003.html";

const countryNameOverrides = {
  HK: "中国香港",
  MO: "中国澳门",
  TW: "中国台湾",
};

const missionNameAliases = {
  BA: ["波斯尼亚和黑塞哥维那"],
  BD: ["孟加拉人民共和国"],
  BN: ["文莱达鲁萨兰国"],
  BO: ["多民族玻利维亚国"],
  CD: ["刚果民主共和国", "刚果（金）"],
  CG: ["刚果共和国", "刚果（布）"],
  CI: ["科特迪瓦共和国"],
  DE: ["德意志联邦共和国"],
  FR: ["法兰西共和国"],
  GB: ["大不列颠及北爱尔兰联合王国"],
  KG: ["吉尔吉斯共和国"],
  KR: ["大韩民国"],
  KP: ["朝鲜民主主义人民共和国"],
  LA: ["老挝人民民主共和国"],
  MD: ["摩尔多瓦共和国"],
  PS: ["巴勒斯坦国"],
  RU: ["俄罗斯联邦"],
  SY: ["阿拉伯叙利亚共和国"],
  TH: ["泰王国"],
  TZ: ["坦桑尼亚联合共和国"],
  US: ["美利坚合众国"],
  VA: ["梵蒂冈"],
  VE: ["委内瑞拉玻利瓦尔共和国"],
};

const territoryAuthorityByCode = {
  AC: "GB",
  AI: "GB",
  BM: "GB",
  FK: "GB",
  GG: "GB",
  GI: "GB",
  GS: "GB",
  IM: "GB",
  IO: "GB",
  JE: "GB",
  KY: "GB",
  MS: "GB",
  PN: "GB",
  SH: "GB",
  TA: "GB",
  TC: "GB",
  VG: "GB",
  AX: "FI",
  BL: "FR",
  GF: "FR",
  GP: "FR",
  MF: "FR",
  MQ: "FR",
  NC: "FR",
  PF: "FR",
  PM: "FR",
  RE: "FR",
  TF: "FR",
  WF: "FR",
  YT: "FR",
  AW: "NL",
  BQ: "NL",
  CW: "NL",
  SX: "NL",
  FO: "DK",
  GL: "DK",
  BV: "NO",
  SJ: "NO",
  AS: "US",
  GU: "US",
  MP: "US",
  PR: "US",
  UM: "US",
  VI: "US",
  CK: "NZ",
  NU: "NZ",
  TK: "NZ",
  CC: "AU",
  CX: "AU",
  HM: "AU",
  NF: "AU",
};

const specialLocations = {
  HK: {
    kind: "domestic-authority",
    office: "公安机关出入境管理窗口",
    city: "全国",
    address: "申请人所在地公安机关出入境管理窗口",
    phone: "12367",
    website: NIA_HK_MACAO_GUIDE,
    sourceUrl: NIA_HK_MACAO_GUIDE,
    sourceAuthority: "国家移民管理局",
    verifiedAt,
    note: "中国内地居民前往中国香港，应按往来港澳通行证及签注规则办理；具体窗口以当地出入境管理部门为准。",
  },
  MO: {
    kind: "domestic-authority",
    office: "公安机关出入境管理窗口",
    city: "全国",
    address: "申请人所在地公安机关出入境管理窗口",
    phone: "12367",
    website: NIA_HK_MACAO_GUIDE,
    sourceUrl: NIA_HK_MACAO_GUIDE,
    sourceAuthority: "国家移民管理局",
    verifiedAt,
    note: "中国内地居民前往中国澳门，应按往来港澳通行证及签注规则办理；具体窗口以当地出入境管理部门为准。",
  },
  TW: {
    kind: "domestic-authority",
    office: "公安机关出入境管理窗口",
    city: "全国",
    address: "申请人所在地公安机关出入境管理窗口",
    phone: "12367",
    website: NIA_TAIWAN_GUIDE,
    sourceUrl: NIA_TAIWAN_GUIDE,
    sourceAuthority: "国家移民管理局",
    verifiedAt,
    note: "中国内地居民前往中国台湾，应先确认大陆居民往来台湾通行证、签注及入台许可要求；具体受理窗口以当地出入境管理部门为准。",
  },
};

const displayNames = new Intl.DisplayNames(["zh-CN"], { type: "region" });
const countries = getCountryDataList()
  .filter((country) => country.iso2 !== "CN")
  .map((country) => ({
    ...country,
    name: countryNameOverrides[country.iso2] ?? displayNames.of(country.iso2) ?? country.name,
  }));
const countriesByCode = new Map(countries.map((country) => [country.iso2, country]));

function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(value) {
  return decodeEntities(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(?:p|div|li|tr|h\d)>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/[\t\u00a0 ]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

async function fetchText(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { "user-agent": "Visa Atlas CN data updater (+https://github.com/Explainfuture/visa-atlas-cn)" },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolvePromise) => setTimeout(resolvePromise, attempt * 500));
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

function absoluteMfaUrl(href) {
  return new URL(href, MFA_EMBASSY_DIRECTORY).href;
}

function resolveMissionCode(title) {
  const candidates = countries.flatMap((country) => {
    const terms = [country.name, country.native, ...(missionNameAliases[country.iso2] ?? [])]
      .filter(Boolean)
      .map((term) => String(term).replace(/\s+/g, ""));
    return terms
      .filter((term) => title.includes(term))
      .map((term) => ({ code: country.iso2, length: term.length }));
  });
  candidates.sort((left, right) => right.length - left.length);
  return candidates[0]?.code;
}

function extractEditorText(html) {
  const editorMatch = html.match(
    /<div[^>]+class=["'][^"']*(?:trs_editor|trs_ueditor)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  );
  const bodyMatch = html.match(
    /<div[^>]+class=["'][^"']*news-main[^"']*["'][^>]+id=["']News_Body_Txt_A["'][^>]*>([\s\S]*?)<div[^>]+class=["'][^"']*news-foot/i,
  );
  const content = editorMatch?.[1] ?? bodyMatch?.[1];
  if (!content) throw new Error("MFA page has no readable mission content block.");
  return stripHtml(content);
}

function extractField(text, labels) {
  const escaped = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const expression = new RegExp(`^(?:${escaped.join("|")})\\s*(?:\\([^)]*\\)|（[^）]*）)?\\s*[:：]?\\s*(.+)$`, "im");
  return text.match(expression)?.[1]?.trim();
}

function firstWebsite(value) {
  if (!value) return undefined;
  const candidate = value
    .replace(/[<>]/g, "")
    .split(/[\s、，,；;]+/)
    .find((item) => /(?:https?:\/\/|www\.|[a-z\d-]+\.[a-z]{2,})/i.test(item));
  if (!candidate) return undefined;
  return /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
}

function firstEmail(value) {
  return value?.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
}

function normalizeAddress(value) {
  if (!value) return undefined;
  const cleaned = value.replace(/^中国[，,]?/, "").trim();
  return /^(?:北京|北京市)/.test(cleaned) ? cleaned : `北京市${cleaned}`;
}

function parseMissionPage(entry, html) {
  const text = extractEditorText(html);
  const address = normalizeAddress(extractField(text, ["办 公 处", "办公处", "馆 址", "馆址", "地 址", "地址"]));
  const phone = extractField(text, ["电 话", "电话"]);
  const email = firstEmail(extractField(text, ["电子邮件", "邮 箱", "邮箱"]));
  const website = firstWebsite(extractField(text, ["网 址", "网址", "网站"]));
  return {
    kind: "embassy",
    office: entry.title,
    city: "北京",
    ...(address ? { address } : {}),
    ...(phone ? { phone } : {}),
    ...(email ? { email } : {}),
    ...(website ? { website } : {}),
    sourceUrl: entry.url,
    sourceAuthority: "中华人民共和国外交部",
    verifiedAt,
    note: "此处为驻华主要联络点；是否直接受理个人签证、是否须前往签证中心，以馆方签证页面为准。",
  };
}

function parentMissionLocation(country, parentCode, missions) {
  const parent = countriesByCode.get(parentCode);
  const mission = missions[parentCode];
  if (!parent || !mission) return undefined;
  return {
    ...mission,
    kind: "parent-mission",
    office: `${mission.office}（属地事务联络）`,
    note: `${country.name}的入境事务通常由${parent.name}或其属地主管机构处理；此处是驻华主要联络点，最终受理地点以目的地官方签证页面为准。`,
  };
}

function fallbackLocation(country) {
  const polarDestination = ["AQ", "EH"].includes(country.iso2);
  return {
    kind: "official-check",
    office: polarDestination ? "行程运营方或目的地主管机构" : "暂未查到常设驻华使馆",
    sourceUrl: MFA_EMBASSY_DIRECTORY,
    sourceAuthority: "中华人民共和国外交部",
    verifiedAt,
    note: polarDestination
      ? `${country.name}的许可和入境安排具有特殊性，请通过行程运营方及目的地主管机构确认。`
      : `外交部驻华使馆名录中暂未匹配到${country.name}的常设机构；请通过本页官方签证入口确认兼辖馆、签证中心或在线渠道。`,
  };
}

async function loadMissionEntries() {
  const pageUrls = Array.from({ length: 6 }, (_, index) =>
    index === 0 ? `${MFA_EMBASSY_DIRECTORY}index.shtml` : `${MFA_EMBASSY_DIRECTORY}index_${index}.shtml`,
  );
  const pages = await Promise.all(pageUrls.map(fetchText));
  const entries = [];
  const seen = new Set();
  const linkPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const html of pages) {
    for (const match of html.matchAll(linkPattern)) {
      const title = stripHtml(match[2]).replace(/\s+/g, "");
      if (!/(?:驻华大使馆|驻华代办处)$/.test(title)) continue;
      const url = absoluteMfaUrl(match[1]);
      if (seen.has(url)) continue;
      seen.add(url);
      entries.push({ title, url });
    }
  }
  return entries;
}

const missionEntries = await loadMissionEntries();
const unresolved = missionEntries.filter((entry) => !resolveMissionCode(entry.title));
if (unresolved.length) {
  throw new Error(`Unresolved country missions: ${unresolved.map((entry) => entry.title).join(", ")}`);
}

const missionPages = await mapLimit(missionEntries, 10, async (entry) => ({
  entry,
  html: await fetchText(entry.url),
}));
const missions = Object.fromEntries(
  missionPages.map(({ entry, html }) => {
    try {
      return [resolveMissionCode(entry.title), parseMissionPage(entry, html)];
    } catch (error) {
      throw new Error(`${entry.title} (${entry.url}): ${error.message}`);
    }
  }),
);

const locations = Object.fromEntries(
  countries
    .map((country) => {
      const code = country.iso2;
      const location =
        specialLocations[code] ??
        missions[code] ??
        parentMissionLocation(country, territoryAuthorityByCode[code], missions) ??
        fallbackLocation(country);
      return [code.toLowerCase(), location];
    })
    .sort(([left], [right]) => left.localeCompare(right)),
);

const counts = Object.values(locations).reduce((summary, location) => {
  summary[location.kind] = (summary[location.kind] ?? 0) + 1;
  return summary;
}, {});
const payload = {
  metadata: {
    generatedAt: verifiedAt,
    destinationCount: countries.length,
    missionCount: Object.keys(missions).length,
    counts,
    embassyDirectoryUrl: MFA_EMBASSY_DIRECTORY,
    consulateDirectoryUrl: MFA_CONSULATE_DIRECTORY,
    openSourceReference: "https://github.com/database-of-embassies/database-of-embassies",
  },
  locations,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const addressCount = Object.values(missions).filter((mission) => mission.address).length;
const phoneCount = Object.values(missions).filter((mission) => mission.phone).length;
console.log(
  `Consular locations generated: ${countries.length}/${countries.length} destinations; ` +
    `${Object.keys(missions).length} missions; ${addressCount} addresses; ${phoneCount} phone records.`,
);
console.log(`Coverage by kind: ${JSON.stringify(counts)}.`);
