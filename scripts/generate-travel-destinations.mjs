import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCountryDataList } from "countries-list";
import { ProxyAgent, setGlobalDispatcher } from "undici";

const proxyUrl =
  process.env.HTTPS_PROXY ??
  process.env.https_proxy ??
  process.env.HTTP_PROXY ??
  process.env.http_proxy;

if (proxyUrl) setGlobalDispatcher(new ProxyAgent(proxyUrl));

const USER_AGENT = "VisaAtlasCN/1.0 (https://visa.explainsf.com)";
const OUTPUT_PATH = path.join(process.cwd(), "src", "data", "travel-destinations.generated.json");
const SIGHTSMAP_REPOSITORY = "https://github.com/enceladus3/SightsMap-HeatmapExplorer";
const SIGHTSMAP_SPOTS =
  "https://raw.githubusercontent.com/enceladus3/SightsMap-HeatmapExplorer/main/data/topspots_15K.js";
const SIGHTSMAP_METADATA =
  "https://raw.githubusercontent.com/enceladus3/SightsMap-HeatmapExplorer/main/data/topspots_15K_extended.js";
const WIKIVOYAGE_LICENSE = "https://creativecommons.org/licenses/by-sa/4.0/";
const ZH_WIKIVOYAGE_PARAMETERS = {
  exintro: "1",
  explaintext: "1",
  piprop: "name|original",
  prop: "extracts|pageimages",
  variant: "zh-cn",
};

const continentNames = {
  AF: "非洲",
  AN: "南极洲",
  AS: "亚洲",
  EU: "欧洲",
  NA: "北美洲",
  OC: "大洋洲",
  SA: "南美洲",
};

const titleOverrides = {
  AC: { en: "Ascension Island", zh: "阿森松岛" },
  BQ: { en: "Caribbean Netherlands", zh: "荷兰加勒比区" },
  CD: { en: "Democratic Republic of the Congo" },
  CG: { en: "Republic of the Congo" },
  CI: { en: "Ivory Coast" },
  CV: { en: "Cape Verde" },
  CZ: { en: "Czech Republic" },
  FK: { en: "Falkland Islands" },
  FM: { en: "Micronesia" },
  LA: { en: "Laos" },
  MO: { en: "Macau", zh: "澳门" },
  PS: { en: "Palestinian territories" },
  SZ: { en: "Eswatini" },
  TA: { en: "Tristan da Cunha", zh: "特里斯坦-达库尼亚" },
  TL: { en: "East Timor" },
  TW: { en: "Taiwan", zh: "臺灣" },
  VA: { en: "Vatican City" },
  XK: { en: "Kosovo" },
};

const introductionOverrides = {
  TW: "中国台湾位于东亚，岛内山地、海岸与城市风貌紧密相连。台北的城市地标、台中的文化街区、日月潭与东海岸自然景观，适合组合成城市与自然并行的行程。",
};

const attractionOverrides = {
  TW: [
    {
      description: "台北市信义区的城市地标，可从观景台俯瞰台北盆地",
      name: "台北101",
      sourceUrl: "https://zh.wikipedia.org/wiki/%E5%8F%B0%E5%8C%97101",
    },
    {
      description: "收藏中国历代文物与艺术品的重要博物馆",
      name: "国立故宫博物院",
      sourceUrl: "https://zh.wikipedia.org/wiki/%E5%9C%8B%E7%AB%8B%E6%95%85%E5%AE%AE%E5%8D%9A%E7%89%A9%E9%99%A2",
    },
    {
      description: "南投县群山之间的高山湖泊，适合骑行、游船与环湖慢游",
      name: "日月潭",
      sourceUrl: "https://zh.wikipedia.org/wiki/%E6%97%A5%E6%9C%88%E6%BD%AD",
    },
    {
      description: "花莲与台东之间的山海公路沿线，串联峡谷、海岸和部落文化",
      name: "东海岸",
      sourceUrl: "https://zh.wikipedia.org/wiki/%E5%8F%B0%E7%81%A3%E6%9D%B1%E9%83%A8",
    },
  ],
  UM: [
    {
      description: "太平洋中部环礁，属于美国本土外小岛屿，进入受到严格限制",
      name: "威克岛",
      sourceUrl: "https://zh.wikipedia.org/wiki/%E5%A8%81%E5%85%8B%E5%B3%B6",
    },
  ],
};

const imageSearchOverrides = {
  AI: ["Anguilla Caribbean beach filemime:jpeg", "Shoal Bay Anguilla filemime:jpeg"],
  BL: ["Gustavia Saint Barthelemy filemime:jpeg", "Saint Barthelemy Caribbean beach filemime:jpeg"],
  BQ: ["Bonaire Saba Sint Eustatius landscape filemime:jpeg"],
  CC: ["Cocos Keeling Islands beach filemime:jpeg"],
  GS: ["South Georgia Grytviken landscape filemime:jpeg"],
  IO: ["Diego Garcia Chagos Archipelago filemime:jpeg"],
  MF: ["Marigot Saint Martin Caribbean filemime:jpeg"],
  MP: ["Saipan Northern Mariana Islands landscape filemime:jpeg"],
  NR: ["Nauru landscape filemime:jpeg"],
  PW: ["Palau Rock Islands landscape filemime:jpeg"],
  UM: ["Wake Island landscape filemime:jpeg", "Midway Atoll landscape filemime:jpeg"],
  WF: ["Wallis Futuna landscape filemime:jpeg"],
};

const imageCaptionOverrides = {
  TW: ["台中城市风光", "国立故宫博物院", "日月潭"],
};

const imageFileOverrides = {
  AI: [
    { caption: "安圭拉海岸", filename: "Views from above.jpg" },
    { caption: "南山村", filename: "South Hill, Anguilla.jpg" },
    { caption: "朗德沃斯湾盐池", filename: "Rendezvous Bay Salt Pond.jpg" },
  ],
  BQ: [
    { caption: "博奈尔盐田与历史小屋", filename: "Old Slave huts, Bonaire.jpg" },
    { caption: "萨巴岛春湾", filename: "View of Spring Bay, Saba, from the Flat Point Tide Pools.jpg" },
    { caption: "圣尤斯特歇斯下城", filename: "Lower Town Sint Eustatius.jpg" },
  ],
  IO: [
    { caption: "迪戈加西亚岛", filename: "Diegogarcia.jpg" },
    { caption: "迪戈加西亚岛东角", filename: "Diego Garica from entrance to East Point.jpg" },
    { caption: "查戈斯群岛", filename: "ISS006-E-43311 - View of the Chagos Archipelago.jpg" },
  ],
  NF: [
    { caption: "诺福克岛海岸", filename: "Old boat - Norfolk Island.jpg" },
    { caption: "诺福克岛草地海滩", filename: "Norfolk Island Grassy Beach.jpg" },
    { caption: "悉尼湾", filename: "Sydney Bay, Norfolk Island Wilson Nla.obj-135935390-1.jpg" },
  ],
  MP: [
    { caption: "塞班岛风光", filename: "Saipan, Commonwealth of the Northern Mariana Islands - panoramio (3).jpg" },
    { caption: "北马里亚纳海岸", filename: "Saipan, Commonwealth of the Northern Mariana Islands - panoramio (4).jpg" },
    { caption: "苏苏佩海滩", filename: "Susupe beach - Saipan - panoramio.jpg" },
  ],
  UM: [
    { caption: "威克岛历史遗址", filename: "Wake Atoll National Historic Landmark.jpg" },
    { caption: "帕尔米拉环礁", filename: "Palmyra Island - NARA - 68155411.jpg" },
    { caption: "帕尔米拉环礁海龟", filename: "Chelonia mydas, atolón de Palmira.jpg" },
  ],
  WS: [
    { caption: "萨摩亚传统捕鱼", filename: "Samoa Fishing (7079001413).jpg" },
    { caption: "萨摩亚岩石海岸", filename: "Rocky outcrop (7078991389).jpg" },
    { caption: "阿富阿奥瀑布", filename: "Afu Aau.jpg" },
  ],
};

const excludedImagePattern =
  /(?:flag|coat.of.arms|emblem|locator|^map|(?:^|[_ .-])map(?:[_ .-]|$)|chart|satellite|blue.marble|regions.map|administrative.map|districts|population.density|srtm|kaart|plan.of.the.harbour|airport|airfield|icon|logo|seal|passport|identity.card|id.card|visa|banner|route.map|stamp|telephone.card|télécarte)/i;
const excludedAttractionPattern =
  /(?:^portal:|selected.article|airport|airfield|aerodrome|university|college|school|academy|stadium|railway.station|train.station|hospital|国际机场|機場|机场|大學|大学|學院|学院|學校|学校|體育場|体育场|球場|球场|車站|车站|醫院|医院)/i;

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWithRetry(url, responseType = "json") {
  let lastError;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": USER_AGENT },
        signal: AbortSignal.timeout(45_000),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);

      if (responseType === "text") return response.text();

      const payload = await response.json();
      if (payload.error) {
        throw new Error(
          `API ${payload.error.code ?? "error"}: ${payload.error.info ?? "Unknown MediaWiki error"}`,
        );
      }
      return payload;
    } catch (error) {
      lastError = error;
      await sleep(900 * (attempt + 1));
    }
  }

  throw lastError;
}

function createApiUrl(base, parameters) {
  const url = new URL(base);
  url.search = new URLSearchParams({
    format: "json",
    formatversion: "2",
    maxlag: "5",
    ...parameters,
  }).toString();
  return url;
}

function parseJavaScriptArray(source) {
  return JSON.parse(source.slice(source.indexOf("["), source.lastIndexOf("]") + 1));
}

function normalizeKey(value) {
  return value.trim().replaceAll("_", " ").toLocaleLowerCase("en");
}

function normalizeFilename(value) {
  return value.trim().replaceAll(" ", "_").toLocaleLowerCase("en");
}

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactText(value, maximumLength = 240) {
  const text = stripHtml(value).replace(/\[[^\]]*]/g, "").trim();
  if (text.length <= maximumLength) return text;

  const shortened = text.slice(0, maximumLength);
  const sentenceEnd = Math.max(
    shortened.lastIndexOf("。"),
    shortened.lastIndexOf("！"),
    shortened.lastIndexOf("？"),
  );

  return `${sentenceEnd > maximumLength * 0.55 ? shortened.slice(0, sentenceEnd + 1) : shortened.trim()}…`;
}

function chunks(values, size) {
  const result = [];
  for (let index = 0; index < values.length; index += size) {
    result.push(values.slice(index, index + size));
  }
  return result;
}

function resolveQueryPages(requests, query) {
  const aliases = new Map();

  for (const collection of [query.normalized, query.converted, query.redirects]) {
    for (const entry of collection ?? []) aliases.set(entry.from, entry.to);
  }

  const pagesByTitle = new Map((query.pages ?? []).map((page) => [page.title, page]));

  return new Map(
    requests.map((request) => {
      let title = request.title;
      const visited = new Set();

      while (aliases.has(title) && !visited.has(title)) {
        visited.add(title);
        title = aliases.get(title);
      }

      return [request.key, pagesByTitle.get(title)];
    }),
  );
}

async function queryWikiPages(endpoint, requests, parameters) {
  const pageMap = new Map();
  const batchSize = parameters.prop?.includes("revisions") ? 10 : 25;
  const requestBatches = chunks(requests, batchSize);

  for (const [batchIndex, batch] of requestBatches.entries()) {
    console.log(
      `Querying ${new URL(endpoint).hostname}: batch ${batchIndex + 1}/${requestBatches.length}...`,
    );
    const url = createApiUrl(endpoint, {
      action: "query",
      redirects: "1",
      titles: batch.map((request) => request.title).join("|"),
      ...parameters,
    });
    const response = await fetchWithRetry(url);
    for (const [key, page] of resolveQueryPages(batch, response.query)) pageMap.set(key, page);
    await sleep(300);
  }

  return pageMap;
}

function findSection(content, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const headingMatch = new RegExp(`^==\\s*${escapedHeading}\\s*==\\s*$`, "im").exec(content);
  if (!headingMatch) return "";

  const remainder = content.slice(headingMatch.index + headingMatch[0].length);
  const nextHeadingIndex = remainder.search(/^==[^=].*==\s*$/m);
  return nextHeadingIndex >= 0 ? remainder.slice(0, nextHeadingIndex) : remainder;
}

function cleanWikiName(value) {
  return value
    .replace(/<!--.*?-->/g, "")
    .replace(/\[\[([^\]|]+)\|([^\]]+)]]/g, "$2")
    .replace(/\[\[([^\]]+)]]/g, "$1")
    .replace(/'{2,}/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function parseDestinationCandidates(content) {
  const candidates = [];

  for (const heading of ["Other destinations", "See", "Cities", "Regions"]) {
    const section = findSection(content, heading);
    if (!section) continue;

    for (const line of section.split("\n")) {
      if (!/^\s*\*/.test(line)) continue;

      const qid = line.match(/\|\s*wikidata\s*=\s*(Q\d+)/i)?.[1];
      const parameterName = line.match(/\|\s*name\s*=\s*([^|}\n]+)/i)?.[1];
      const wikiLink = line.match(/\[\[([^\]|]+)(?:\|([^\]]+))?]]/);
      const rawName = cleanWikiName(parameterName ?? wikiLink?.[2] ?? wikiLink?.[1] ?? "");

      if (!rawName || rawName.length > 90) continue;
      if (candidates.some((candidate) => normalizeKey(candidate.rawName) === normalizeKey(rawName))) {
        continue;
      }

      candidates.push({ qid, rawName, wikiTitle: wikiLink?.[1] ?? rawName });
      if (candidates.length >= 10) return candidates;
    }
  }

  return candidates;
}

async function getWikidataEntities(qids) {
  const entities = new Map();
  const entityBatches = chunks([...new Set(qids)].filter(Boolean), 45);

  for (const [batchIndex, batch] of entityBatches.entries()) {
    if (batchIndex % 5 === 0 || batchIndex === entityBatches.length - 1) {
      console.log(`Querying Wikidata entities: batch ${batchIndex + 1}/${entityBatches.length}...`);
    }
    const url = createApiUrl("https://www.wikidata.org/w/api.php", {
      action: "wbgetentities",
      ids: batch.join("|"),
      languages: "zh|en",
      props: "labels|descriptions|sitelinks",
      sitefilter: "zhwiki|enwiki",
    });
    const response = await fetchWithRetry(url);
    for (const entity of Object.values(response.entities ?? {})) entities.set(entity.id, entity);
    await sleep(250);
  }

  console.log(`Resolved ${entities.size}/${new Set(qids).size} Wikidata entities.`);

  return entities;
}

function getEntitySource(entity, fallback) {
  if (entity?.sitelinks?.zhwiki?.title) {
    return `https://zh.wikipedia.org/wiki/${encodeURIComponent(entity.sitelinks.zhwiki.title.replaceAll(" ", "_"))}`;
  }
  if (entity?.sitelinks?.enwiki?.title) {
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(entity.sitelinks.enwiki.title.replaceAll(" ", "_"))}`;
  }
  return entity?.id ? `https://www.wikidata.org/wiki/${entity.id}` : fallback;
}

function getPageQid(page) {
  return page?.pageprops?.wikibase_item;
}

function buildImageRecord(filename, metadata, caption, alt) {
  const imageInfo = metadata?.imageinfo?.[0];
  if (!imageInfo || excludedImagePattern.test(filename)) return undefined;

  const width = imageInfo.thumbwidth ?? imageInfo.width;
  const height = imageInfo.thumbheight ?? imageInfo.height;
  if (!width || !height || Math.max(imageInfo.width, imageInfo.height) < 1000) return undefined;

  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension || !["jpg", "jpeg", "png", "webp"].includes(extension)) return undefined;

  const metadataFields = imageInfo.extmetadata ?? {};
  const artist = compactText(metadataFields.Artist?.value ?? "Wikimedia Commons contributor", 90);
  const license = metadataFields.LicenseShortName?.value ?? "查看文件页许可";

  return {
    alt,
    artist,
    caption: compactText(caption || metadataFields.ImageDescription?.value || alt, 88),
    height,
    license,
    licenseUrl: metadataFields.LicenseUrl?.value ?? imageInfo.descriptionurl,
    sourceUrl: imageInfo.descriptionurl,
    url: imageInfo.thumburl ?? imageInfo.url,
    width,
  };
}

async function getCommonsMetadata(filenames) {
  const metadata = new Map();
  const uniqueFilenames = [...new Set(filenames.filter(Boolean))];
  const filenameBatches = chunks(uniqueFilenames, 35);

  for (const [batchIndex, batch] of filenameBatches.entries()) {
    if (batchIndex % 5 === 0 || batchIndex === filenameBatches.length - 1) {
      console.log(`Checking Commons images: batch ${batchIndex + 1}/${filenameBatches.length}...`);
    }
    const url = createApiUrl("https://commons.wikimedia.org/w/api.php", {
      action: "query",
      iiprop: "url|size|extmetadata",
      iiurlwidth: "1800",
      prop: "imageinfo",
      titles: batch.map((filename) => `File:${filename}`).join("|"),
    });
    const response = await fetchWithRetry(url);
    for (const page of response.query.pages ?? []) {
      if (!page.missing) metadata.set(normalizeFilename(page.title.replace(/^File:/, "")), page);
    }
    await sleep(250);
  }

  return metadata;
}

async function searchCommonsImages(country, limit) {
  const queries = imageSearchOverrides[country.code] ?? [
    `incategory:"${country.englishTitle}" filemime:jpeg`,
    `${country.englishTitle} filemime:jpeg`,
    `${country.englishTitle} beach landscape filemime:jpeg`,
    country.capital
      ? `${country.capital} ${country.englishTitle} landmark filemime:jpeg`
      : `${country.englishTitle} landmark filemime:jpeg`,
  ];
  const images = [];

  for (const searchQuery of queries) {
    const url = createApiUrl("https://commons.wikimedia.org/w/api.php", {
      action: "query",
      generator: "search",
      gsrnamespace: "6",
      gsrlimit: "14",
      gsrsearch: searchQuery,
      iiprop: "url|size|extmetadata",
      iiurlwidth: "1800",
      prop: "imageinfo",
    });
    const response = await fetchWithRetry(url);

    for (const page of response.query?.pages ?? []) {
      const filename = page.title.replace(/^File:/, "");
      const record = buildImageRecord(
        filename,
        page,
        page.imageinfo?.[0]?.extmetadata?.ImageDescription?.value,
        `${country.name}风光`,
      );
      if (!record || images.some((image) => image.url === record.url)) continue;
      images.push(record);
      if (images.length >= limit) return images;
    }

    await sleep(350);
  }

  return images;
}

const zhDisplayNames = new Intl.DisplayNames(["zh-CN"], { type: "region" });
const countries = getCountryDataList()
  .filter((country) => country.iso2 !== "CN")
  .map((country) => {
    const overrides = titleOverrides[country.iso2] ?? {};
    const name = country.iso2 === "TW" ? "中国台湾" : zhDisplayNames.of(country.iso2);

    return {
      capital: country.capital,
      code: country.iso2,
      continentName: continentNames[country.continent],
      englishTitle: overrides.en ?? country.name,
      name,
      zhTitle: overrides.zh ?? name,
    };
  });

function buildIntroduction(country, page) {
  const fallbackIntroduction = `${country.name}位于${country.continentName}。${
    country.capital ? `可以从${country.capital}开始认识当地，` : "规划行程时可以从主要聚居地出发，"
  }再把当地的城市、人文与自然景观放进行程，了解当地的风景、文化与旅行节奏。`;
  const extractedIntroduction = compactText(page?.extract, 260);

  return introductionOverrides[country.code] ??
    (extractedIntroduction.length >= 80
      ? extractedIntroduction
      : `${extractedIntroduction}${extractedIntroduction ? " " : ""}${fallbackIntroduction}`);
}

async function queryZhWikivoyagePages() {
  return queryWikiPages(
    "https://zh.wikivoyage.org/w/api.php",
    countries.map((country) => ({ key: country.code, title: country.zhTitle })),
    ZH_WIKIVOYAGE_PARAMETERS,
  );
}

if (process.argv.includes("--refresh-introductions")) {
  const output = JSON.parse(await readFile(OUTPUT_PATH, "utf8"));
  const pages = await queryZhWikivoyagePages();

  for (const country of countries) {
    const destination = output.destinations[country.code.toLowerCase()];
    destination.introduction = buildIntroduction(country, pages.get(country.code));
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Refreshed simplified-Chinese introductions for ${countries.length} destinations.`);
  process.exit(0);
}

if (process.argv.includes("--refresh-image-overrides")) {
  const output = JSON.parse(await readFile(OUTPUT_PATH, "utf8"));
  const filenames = Object.values(imageFileOverrides).flatMap((images) =>
    images.map((image) => image.filename)
  );
  const metadata = await getCommonsMetadata(filenames);

  for (const country of countries) {
    const overrides = imageFileOverrides[country.code];
    if (!overrides) continue;

    const images = overrides
      .map((override) =>
        buildImageRecord(
          override.filename,
          metadata.get(normalizeFilename(override.filename)),
          override.caption,
          `${country.name}的${override.caption}`,
        )
      )
      .filter(Boolean)
      .slice(0, 3);

    output.destinations[country.code.toLowerCase()].images = images;
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Refreshed image overrides for ${Object.keys(imageFileOverrides).length} destinations.`);
  process.exit(0);
}

console.log(`Generating travel data for ${countries.length} destinations...`);

const [spotsSource, spotsMetadataSource] = await Promise.all([
  fetchWithRetry(SIGHTSMAP_SPOTS, "text"),
  fetchWithRetry(SIGHTSMAP_METADATA, "text"),
]);
const spots = parseJavaScriptArray(spotsSource);
const spotsMetadata = parseJavaScriptArray(spotsMetadataSource);
const countryCodes = new Set(countries.map((country) => country.code));
const topSpotsByCountry = new Map();

for (let index = 0; index < Math.min(spots.length, spotsMetadata.length); index += 1) {
  const code = spotsMetadata[index]?.[0];
  const name = spots[index]?.[0]?.trim();
  if (!countryCodes.has(code) || !name) continue;

  const entries = topSpotsByCountry.get(code) ?? [];
  if (!entries.some((entry) => normalizeKey(entry) === normalizeKey(name)) && entries.length < 10) {
    entries.push(name);
  }
  topSpotsByCountry.set(code, entries);
}

console.log(`SightsMap candidates loaded for ${topSpotsByCountry.size} destinations.`);

const zhWikivoyagePages = await queryZhWikivoyagePages();

const enWikivoyagePages = await queryWikiPages(
  "https://en.wikivoyage.org/w/api.php",
  countries.map((country) => ({ key: country.code, title: country.englishTitle })),
  {
    piprop: "name|original",
    prop: "revisions|pageimages",
    rvprop: "content",
    rvslots: "main",
  },
);

const candidatesByCountry = new Map();

for (const country of countries) {
  const candidates = [];
  const addCandidate = (candidate) => {
    if (!candidate?.rawName) return;
    if (excludedAttractionPattern.test(candidate.rawName)) return;
    if (candidates.some((entry) => normalizeKey(entry.rawName) === normalizeKey(candidate.rawName))) return;
    candidates.push(candidate);
  };

  for (const name of topSpotsByCountry.get(country.code) ?? []) {
    addCandidate({ rawName: name, sourceUrl: SIGHTSMAP_REPOSITORY, wikiTitle: name });
  }

  const wikivoyagePage = enWikivoyagePages.get(country.code);
  const content = wikivoyagePage?.revisions?.[0]?.slots?.main?.content ?? "";
  for (const candidate of parseDestinationCandidates(content)) {
    addCandidate({
      ...candidate,
      sourceUrl: wikivoyagePage?.fullurl ??
        `https://en.wikivoyage.org/wiki/${encodeURIComponent(wikivoyagePage?.title ?? country.englishTitle)}`,
    });
  }

  if (country.capital) {
    for (const capital of country.capital.split(",").map((value) => value.trim()).filter(Boolean)) {
      addCandidate({ rawName: capital, sourceUrl: SIGHTSMAP_REPOSITORY, wikiTitle: capital });
    }
  }

  addCandidate({
    rawName: country.englishTitle,
    sourceUrl: wikivoyagePage?.fullurl ??
      `https://en.wikivoyage.org/wiki/${encodeURIComponent(country.englishTitle)}`,
    wikiTitle: country.englishTitle,
    wholeDestination: true,
  });

  candidatesByCountry.set(country.code, candidates.slice(0, 12));
}

const wikipediaRequests = [];
for (const [code, candidates] of candidatesByCountry) {
  candidates.forEach((candidate, index) => {
    wikipediaRequests.push({ key: `${code}:${index}`, title: candidate.wikiTitle ?? candidate.rawName });
  });
}

const wikipediaPages = await queryWikiPages(
  "https://en.wikipedia.org/w/api.php",
  wikipediaRequests,
  {
    inprop: "url",
    piprop: "name|original",
    prop: "info|pageimages|pageprops",
  },
);

const qids = [];
for (const [code, candidates] of candidatesByCountry) {
  candidates.forEach((candidate, index) => {
    const wikipediaPage = wikipediaPages.get(`${code}:${index}`);
    candidate.wikipediaPage = wikipediaPage;
    candidate.qid ??= getPageQid(wikipediaPage);
    if (candidate.qid) qids.push(candidate.qid);
  });
}

const entities = await getWikidataEntities(qids);
const allFilenames = [];

for (const country of countries) {
  const zhPage = zhWikivoyagePages.get(country.code);
  const enPage = enWikivoyagePages.get(country.code);
  if (zhPage?.pageimage) allFilenames.push(zhPage.pageimage);
  if (enPage?.pageimage) allFilenames.push(enPage.pageimage);
  for (const image of imageFileOverrides[country.code] ?? []) allFilenames.push(image.filename);

  for (const candidate of candidatesByCountry.get(country.code)) {
    const entity = entities.get(candidate.qid);
    candidate.name = entity?.labels?.zh?.value ?? candidate.rawName;
    candidate.description = compactText(
      entity?.descriptions?.zh?.value ?? entity?.descriptions?.en?.value ?? "代表性目的地",
      66,
    );
    candidate.sourceUrl = getEntitySource(
      entity,
      candidate.wikipediaPage?.fullurl ?? candidate.sourceUrl,
    );
    candidate.imageFilename = candidate.wikipediaPage?.pageimage;
    if (candidate.imageFilename) allFilenames.push(candidate.imageFilename);
  }
}

const commonsMetadata = await getCommonsMetadata(allFilenames);
const result = {};
let destinationsWithThreeImages = 0;
let fallbackSearches = 0;

for (const [countryIndex, country] of countries.entries()) {
  const zhPage = zhWikivoyagePages.get(country.code);
  const enPage = enWikivoyagePages.get(country.code);
  const candidates = candidatesByCountry.get(country.code);
  const attractions = (attractionOverrides[country.code] ?? candidates
    .filter(
      (candidate) =>
        !candidate.wholeDestination &&
        !excludedAttractionPattern.test(
          `${candidate.rawName} ${candidate.name} ${candidate.description}`,
        ),
    )
    .slice(0, 4)
    .map((candidate) => ({
      description: candidate.description,
      name: candidate.name,
      sourceUrl: candidate.sourceUrl,
    })))
    .slice(0, 4);
  const imageCandidates = [];

  for (const override of imageFileOverrides[country.code] ?? []) {
    const metadata = commonsMetadata.get(normalizeFilename(override.filename));
    const image = buildImageRecord(
      override.filename,
      metadata,
      override.caption,
      `${country.name}的${override.caption}`,
    );
    if (image && !imageCandidates.some((entry) => entry.url === image.url)) imageCandidates.push(image);
  }

  for (const candidate of candidates) {
    if (!candidate.imageFilename) continue;
    const metadata = commonsMetadata.get(normalizeFilename(candidate.imageFilename));
    const image = buildImageRecord(
      candidate.imageFilename,
      metadata,
      candidate.name,
      `${country.name}的${candidate.name}`,
    );
    if (image && !imageCandidates.some((entry) => entry.url === image.url)) imageCandidates.push(image);
  }

  for (const page of [zhPage, enPage]) {
    if (!page?.pageimage) continue;
    const metadata = commonsMetadata.get(normalizeFilename(page.pageimage));
    const image = buildImageRecord(
      page.pageimage,
      metadata,
      `${country.name}旅行风光`,
      `${country.name}旅行风光`,
    );
    if (image && !imageCandidates.some((entry) => entry.url === image.url)) imageCandidates.push(image);
  }

  if (imageCandidates.length < 3) {
    fallbackSearches += 1;
    const fallbackImages = await searchCommonsImages(country, 3 - imageCandidates.length);
    for (const image of fallbackImages) {
      if (!imageCandidates.some((entry) => entry.url === image.url)) imageCandidates.push(image);
    }
  }

  const images = imageCandidates.slice(0, 3).map((image, index) => {
    const caption = imageCaptionOverrides[country.code]?.[index];
    return caption ? { ...image, alt: `${country.name}的${caption}`, caption } : image;
  });
  if (images.length === 3) destinationsWithThreeImages += 1;

  const introduction = buildIntroduction(country, zhPage);
  const travelSourceUrl = zhPage && !zhPage.missing
    ? `https://zh.wikivoyage.org/wiki/${encodeURIComponent(zhPage.title.replaceAll(" ", "_"))}`
    : enPage && !enPage.missing
      ? `https://en.wikivoyage.org/wiki/${encodeURIComponent(enPage.title.replaceAll(" ", "_"))}`
      : SIGHTSMAP_REPOSITORY;

  result[country.code.toLowerCase()] = {
    attractions,
    images,
    introduction,
    source: {
      label: zhPage && !zhPage.missing ? "中文 Wikivoyage" : "Wikivoyage / SightsMap",
      license: "CC BY-SA 4.0 / 开源数据",
      licenseUrl: WIKIVOYAGE_LICENSE,
      url: travelSourceUrl,
    },
  };

  if ((countryIndex + 1) % 25 === 0 || countryIndex === countries.length - 1) {
    console.log(`Processed ${countryIndex + 1}/${countries.length} destinations...`);
  }
}

const output = {
  metadata: {
    attractionsSource: SIGHTSMAP_REPOSITORY,
    generatedAt: new Date().toISOString().slice(0, 10),
    imageSource: "https://commons.wikimedia.org/",
    total: countries.length,
    wikivoyageLicense: WIKIVOYAGE_LICENSE,
  },
  destinations: result,
};

await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");

console.log(
  `Wrote ${countries.length} destinations to ${OUTPUT_PATH}. ` +
    `${destinationsWithThreeImages} have three images; Commons fallback searches: ${fallbackSearches}.`,
);
