import { mkdir, writeFile } from "node:fs/promises";
import { execFile as execFileCallback } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { getCountryDataList } from "countries-list";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "src/data/visa-baseline.generated.ts");
const pageTitle = "Visa_requirements_for_Chinese_citizens";
const pageUrl = "https://en.wikipedia.org/wiki/Visa_requirements_for_Chinese_citizens";
const apiUrl = new URL("https://en.wikipedia.org/w/api.php");
apiUrl.search = new URLSearchParams({
  action: "parse",
  page: pageTitle,
  prop: "text|revid",
  format: "json",
  origin: "*",
}).toString();
const execFile = promisify(execFileCallback);

const aliases = new Map([
  ["Cape Verde", "Cabo Verde"],
  ["Côte d'Ivoire", "Ivory Coast"],
  ["Czech Republic", "Czechia"],
  ["São Tomé and Príncipe", "Sao Tome and Principe"],
  ["Timor-Leste", "East Timor"],
  ["Turkey", "Türkiye"],
  ["United Kingdom and Crown dependencies", "United Kingdom"],
]);

const special = {
  ac: { kind: "restricted", requirement: "暂停对中国普通护照开放", stay: "不得入境", notes: "阿森松岛自 2015 年起不向中国公民发放入境签证；不要在未获书面确认前安排行程。" },
  ai: { kind: "visa-required", requirement: "需提前办签", stay: "以获批签证为准", notes: "持有效英国、美国或加拿大签证/居留许可者可能适用豁免，须在出发前向安圭拉官方确认。" },
  aq: { kind: "permit", requirement: "随组织方办理许可", stay: "按探险行程批准", notes: "南极洲没有统一旅游签证，通常由持牌探险或邮轮公司代办登陆、环保和保护区许可；转机国签证另算。" },
  as: { kind: "permit", requirement: "需入境许可", stay: "以许可批准为准", notes: "美属萨摩亚不使用美国 ESTA；由当地移民机关审查入境许可，航空公司和担保材料要求需提前确认。" },
  aw: { kind: "visa-required", requirement: "需提前办签或满足豁免", stay: "通常不超过 30 天", notes: "有效加拿大、美国或申根签证/居留许可可能触发豁免；按荷属加勒比官方签证检查表核对。" },
  ax: { parent: "fi", requirement: "遵循芬兰 / 申根入境规则", notes: "奥兰群岛属于芬兰；先按芬兰申根规则办理，并确认往返奥兰的承运人证件要求。" },
  bl: { kind: "visa-required", requirement: "需法国海外领地签证", stay: "以签证批准为准", notes: "普通申根签证不自动覆盖圣巴泰勒米；申请时必须明确填写该海外领地。" },
  bm: { kind: "visa-required", requirement: "需提前办签或满足豁免", stay: "以入境官批准为准", notes: "持有效加拿大、美国或英国多次签证并符合有效期条件者可能免办百慕大签证。" },
  bq: { kind: "visa-required", requirement: "需提前办签或满足豁免", stay: "通常不超过 90 天", notes: "博奈尔、圣尤斯特歇斯和萨巴使用荷属加勒比签证规则；特定美加申根签证可能豁免。" },
  bv: { kind: "permit", requirement: "需特别许可", stay: "按许可批准", notes: "布韦岛无人常住且访问受限，普通游客须经挪威主管机关和探险组织方许可。" },
  cc: { parent: "au", requirement: "遵循澳大利亚入境规则", notes: "科科斯（基林）群岛属于澳大利亚；从境外抵达时使用澳大利亚签证与边境规则。" },
  ck: { kind: "visa-free", requirement: "短期免签", stay: "通常 31 天", notes: "入境时准备离境机票、住宿和资金证明；延长停留需向库克群岛移民部门申请。" },
  cw: { kind: "visa-required", requirement: "需提前办签或满足豁免", stay: "通常不超过 90 天", notes: "库拉索使用荷属加勒比签证规则；特定美加申根签证或居留许可可能豁免。" },
  cx: { parent: "au", requirement: "遵循澳大利亚入境规则", notes: "圣诞岛属于澳大利亚；从境外抵达时使用澳大利亚签证与边境规则。" },
  eh: { kind: "conditional", requirement: "按实际控制区与路线核验", stay: "以入境口岸批准为准", notes: "西撒哈拉没有统一可执行的旅游签证流程；多数行程经摩洛哥实际控制区进入，应同时核对摩洛哥和边境安全要求。" },
  fk: { kind: "visa-required", requirement: "需提前办签", stay: "以获批签证为准", notes: "福克兰群岛单独审查入境，不要把英国本土签证视为自动有效；同时核对途经南美国家规则。" },
  fo: { kind: "visa-required", requirement: "需法罗群岛有效签证", stay: "以签证批准为准", notes: "法罗群岛不属于申根区；申请丹麦签证时需明确标注法罗群岛有效。" },
  gf: { kind: "visa-required", requirement: "需法国海外领地签证", stay: "以签证批准为准", notes: "普通申根签证不自动覆盖法属圭亚那；申请时必须明确填写目的地。" },
  gg: { parent: "gb", requirement: "按英国王室属地规则办理", notes: "根西岛属于英国共同旅行区；按英国签证路径申请并明确包含根西行程。" },
  gi: { kind: "visa-required", requirement: "需提前办签或满足豁免", stay: "以入境官批准为准", notes: "直布罗陀有独立入境规则；部分有效英国多次签证或英国居留许可持有人可豁免。" },
  gl: { kind: "visa-required", requirement: "需格陵兰有效签证", stay: "以签证批准为准", notes: "格陵兰不属于申根区；申请丹麦签证时需明确标注格陵兰有效。" },
  gp: { kind: "visa-required", requirement: "需法国海外领地签证", stay: "以签证批准为准", notes: "普通申根签证不自动覆盖瓜德罗普；邮轮旅客可能有有限豁免，需由船公司书面确认。" },
  gs: { kind: "permit", requirement: "需登陆许可", stay: "按航次许可", notes: "南乔治亚和南桑威奇群岛由船舶或探险组织方申请访问许可，并收取登陆/访客费用。" },
  gu: { parent: "us", requirement: "需美国签证", notes: "关岛对中国普通护照通常执行美国签证规则；不要把面向其他护照的关岛免签计划套用到自己。" },
  hk: { kind: "conditional", requirement: "通常使用港澳通行证及有效签注", stay: "以签注种类和次数为准", notes: "中国大陆居民因私赴香港通常不是持普通护照办‘签证’，而是申请往来港澳通行证和相应赴港签注；经香港过境另有规则。" },
  hm: { kind: "permit", requirement: "需特别许可", stay: "按许可批准", notes: "赫德岛和麦克唐纳群岛是澳大利亚保护区，无普通旅游入境；访问需环境与登陆许可。" },
  im: { parent: "gb", requirement: "按英国王室属地规则办理", notes: "马恩岛属于英国共同旅行区；按英国签证路径申请并明确包含马恩岛行程。" },
  io: { kind: "permit", requirement: "需特别许可", stay: "按许可批准", notes: "英属印度洋领地不是普通旅游目的地；未经行政当局许可不得进入。" },
  je: { parent: "gb", requirement: "按英国王室属地规则办理", notes: "泽西岛属于英国共同旅行区；按英国签证路径申请并明确包含泽西行程。" },
  ky: { kind: "visa-required", requirement: "需提前办签或满足豁免", stay: "以入境官批准为准", notes: "特定有效英国、美国或加拿大签证持有人可能豁免；邮轮和航空入境条件不同。" },
  mf: { kind: "visa-required", requirement: "需法国海外领地签证", stay: "以签证批准为准", notes: "普通申根签证不自动覆盖法属圣马丁；还要区分同岛荷属一侧的入境规则。" },
  mo: { kind: "conditional", requirement: "通常使用港澳通行证及有效签注", stay: "以签注种类和次数为准", notes: "中国大陆居民因私赴澳门通常申请往来港澳通行证和相应赴澳签注；经澳门过境另有规则。" },
  mp: { kind: "visa-free", requirement: "短期免签", stay: "通常 14 天", notes: "中国普通护照旅游入境北马里亚纳群岛可适用限定免签安排；须持不可转让返程票并完成当地要求的表格。" },
  mq: { kind: "visa-required", requirement: "需法国海外领地签证", stay: "以签证批准为准", notes: "普通申根签证不自动覆盖马提尼克；申请时必须明确填写目的地。" },
  ms: { kind: "e-visa", requirement: "提前申请电子签", stay: "以电子签批准为准", notes: "通过蒙特塞拉特官方电子签系统申请，获批文件需随护照一起携带。" },
  nc: { kind: "conditional", requirement: "指定旅行社成团可短期免签，否则办签", stay: "符合条件通常 15 天", notes: "团队免签取决于法国认可的中国旅行社和完整团体行程；自由行需按法国海外领地签证规则办理。" },
  nf: { parent: "au", requirement: "遵循澳大利亚入境规则", notes: "诺福克岛属于澳大利亚；从境外抵达时使用澳大利亚签证与边境规则。" },
  nu: { kind: "visa-free", requirement: "短期免签", stay: "通常 30 天", notes: "入境时准备离境机票、住宿和资金证明；前往纽埃通常要经过新西兰，需另核对新西兰过境/入境要求。" },
  pf: { kind: "conditional", requirement: "指定旅行社成团可短期免签，否则办签", stay: "符合条件通常 15 天", notes: "团队免签取决于法国认可的中国旅行社和完整团体行程；自由行需按法国海外领地签证规则办理。" },
  pm: { kind: "visa-required", requirement: "需法国海外领地签证", stay: "以签证批准为准", notes: "普通申根签证不自动覆盖圣皮埃尔和密克隆；还需核对经加拿大转机所需文件。" },
  pn: { kind: "visa-free", requirement: "短期免签并缴登陆费", stay: "通常 14 天", notes: "皮特凯恩通常随核准船期访问；抵达时可能收取登陆费，长期停留需事先许可。" },
  pr: { parent: "us", requirement: "需美国签证", notes: "波多黎各执行美国联邦入境规则；持中国普通护照通常先办相应美国签证。" },
  ps: { kind: "visa-free", requirement: "巴勒斯坦地区本身不另发旅游签证", stay: "由实际入境口岸决定", notes: "进入约旦河西岸或加沙取决于以色列、约旦或埃及口岸控制；必须按完整路线核对签证和安全限制。" },
  re: { kind: "conditional", requirement: "指定旅行社成团可短期免签，否则办签", stay: "符合条件通常 15 天", notes: "团队免签取决于法国认可的中国旅行社和完整团体行程；自由行需按法国海外领地签证规则办理。" },
  sh: { kind: "e-visa", requirement: "提前申请电子签", stay: "以电子签批准为准", notes: "圣赫勒拿使用电子签/电子许可流程；同时核对抵达该岛所经国家的过境要求。" },
  sj: { kind: "conditional", requirement: "斯瓦尔巴免签，但中转通常需申根签", stay: "当地不设统一停留上限", notes: "斯瓦尔巴条约区本身免签；绝大多数航班经挪威申根区，往返可能需要可重复入境的申根签证。" },
  sx: { kind: "visa-required", requirement: "需提前办签或满足豁免", stay: "通常不超过 90 天", notes: "荷属圣马丁使用荷属加勒比签证规则；特定美加申根签证或居留许可可能豁免。" },
  ta: { kind: "permit", requirement: "需登陆许可", stay: "按许可批准", notes: "特里斯坦-达库尼亚无普通落地旅游；须在出发前取得岛务部门许可并支付登陆相关费用。" },
  tc: { kind: "visa-free", requirement: "短期免签", stay: "通常 90 天", notes: "入境时准备返程票、住宿和资金证明；最终停留期由边检决定。" },
  tf: { kind: "permit", requirement: "需特别许可", stay: "按许可批准", notes: "法属南部领地是受保护科研区域，无普通旅游签证；访问由主管机关和组织方许可。" },
  tk: { kind: "permit", requirement: "需事先许可", stay: "按许可批准", notes: "托克劳没有机场，通常经萨摩亚乘船；需事先获得托克劳当局许可并同时满足萨摩亚入境规则。" },
  tw: { kind: "conditional", requirement: "需入台许可及大陆端有效出境证件", stay: "以许可批准为准", notes: "大陆居民赴台不是普通护照电子签流程；旅游开放范围、入台许可与大陆端证件政策会变化，必须在付款前向两地主管机关核验。" },
  um: { kind: "permit", requirement: "需主管机关许可", stay: "按许可批准", notes: "美国本土外小岛多为无人岛或保护区，无普通旅游入境；访问须获美国主管机关和交通组织方许可。" },
  vg: { kind: "visa-free", requirement: "短期免签", stay: "最长可获 6 个月", notes: "最终停留期由边检决定；仍须准备离境机票、住宿和足够资金。" },
  vi: { parent: "us", requirement: "需美国签证", notes: "美属维尔京群岛执行美国联邦入境规则；持中国普通护照通常先办相应美国签证。" },
  wf: { kind: "visa-required", requirement: "需法国海外领地签证", stay: "以签证批准为准", notes: "普通申根签证不自动覆盖瓦利斯和富图纳；申请时必须明确填写目的地。" },
  xk: { kind: "visa-required", requirement: "需提前办科索沃签证", stay: "以获批签证为准", notes: "部分有效申根签证或申根/特定国家居留许可持有人可能适用豁免，须核对期限和入境次数。" },
  yt: { kind: "visa-required", requirement: "需法国海外领地签证", stay: "以签证批准为准", notes: "普通申根签证不自动覆盖马约特；申请时必须明确填写目的地。" },
};

function decodeHtml(value) {
  const named = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return value.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, entity) => {
    if (entity[0] === "#") {
      const isHex = entity[1]?.toLowerCase() === "x";
      return String.fromCodePoint(Number.parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10));
    }
    return named[entity] ?? match;
  });
}

function textFromHtml(value) {
  return decodeHtml(
    value
      .replace(/<sup[\s\S]*?<\/sup>/gi, "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function externalLink(value) {
  const links = [...value.matchAll(/href="((?:https?:)?\/\/[^"#]+)"/gi)]
    .map((match) => decodeHtml(match[1]))
    .map((url) => (url.startsWith("//") ? `https:${url}` : url))
    .filter((url) => !/(wikipedia|wikimedia|archive\.org|webcitation)/i.test(url));
  return links.find((url) => /(?:\.gov\.|\.gob\.|\.go\.|government|immigration|mfa\.)/i.test(url)) ?? links[0];
}

function normalizeKind(requirement) {
  const value = requirement.toLowerCase();
  if (/admission refused|entry refused|not allowed/.test(value)) return "restricted";
  if (/permit required|special permit/.test(value)) return "permit";
  if (/visa not required/.test(value) && /evisa|visa on arrival|eta|authorisation/.test(value)) return "conditional";
  if (/visa not required/.test(value)) return "visa-free";
  if (/evisa/.test(value) && /visa on arrival/.test(value)) return "electronic-or-arrival";
  if (/electronic travel authorisation|electronic travel authorization|\betaeta\b/.test(value)) return "eta";
  if (/visa on arrival/.test(value)) return "visa-on-arrival";
  if (/evisa|online visa/.test(value)) return "e-visa";
  return "visa-required";
}

function escapeTs(value) {
  return JSON.stringify(value);
}

async function loadWikipediaPayload() {
  try {
    const response = await fetch(apiUrl, { headers: { "User-Agent": "visa-atlas-cn/0.1 (public travel knowledge base)" } });
    if (!response.ok) throw new Error(`Wikipedia API returned ${response.status}`);
    return response.json();
  } catch (error) {
    const curl = process.platform === "win32" ? "curl.exe" : "curl";
    const { stdout } = await execFile(curl, ["-L", "--fail", "--max-time", "45", apiUrl.toString()], {
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
    console.warn(`Native fetch failed (${error.cause?.code ?? error.message}); used curl fallback.`);
    return JSON.parse(stdout);
  }
}

const payload = await loadWikipediaPayload();
const html = payload.parse.text["*"];
const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) => match[1]);
const headerIndex = rows.findIndex((row) => /Visa requirement/i.test(row) && /Allowed stay/i.test(row));
if (headerIndex < 0) throw new Error("Could not locate the sovereign-state visa table");

const countries = getCountryDataList().filter((country) => country.iso2 !== "CN");
const codeByEnglishName = new Map(countries.map((country) => [country.name, country.iso2.toLowerCase()]));
const baseline = new Map();

for (const row of rows.slice(headerIndex + 1)) {
  if (/<th[^>]*>/i.test(row)) break;
  const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) => match[1]);
  if (cells.length < 3) continue;
  const rawName = textFromHtml(cells[0]);
  const name = aliases.get(rawName) ?? rawName;
  const code = codeByEnglishName.get(name);
  if (!code) throw new Error(`Unmapped sovereign destination: ${rawName}`);
  const requirement = textFromHtml(cells[1]);
  const stay = textFromHtml(cells[2]) || "以边检批准为准";
  const notes = textFromHtml(cells[3] ?? "").slice(0, 520);
  baseline.set(code, {
    kind: normalizeKind(requirement),
    requirement,
    stay,
    notes,
    sourceUrl: externalLink(cells[3] ?? ""),
  });
}

for (const [code, rule] of Object.entries(special)) {
  if (rule.parent) {
    const parent = baseline.get(rule.parent);
    if (!parent) throw new Error(`Missing inherited rule parent ${rule.parent} for ${code}`);
    baseline.set(code, { ...parent, ...rule, kind: parent.kind, parent: rule.parent });
  } else {
    baseline.set(code, rule);
  }
}

const missing = countries.map((country) => country.iso2.toLowerCase()).filter((code) => !baseline.has(code));
if (missing.length) throw new Error(`Missing ${missing.length} destinations: ${missing.join(", ")}`);
if (baseline.size !== countries.length) throw new Error(`Expected ${countries.length} destinations, generated ${baseline.size}`);

const ordered = [...baseline.entries()].sort(([left], [right]) => left.localeCompare(right));
const lines = ordered.map(([code, entry]) => {
  const fields = [
    `kind: ${escapeTs(entry.kind)}`,
    `requirement: ${escapeTs(entry.requirement)}`,
    `stay: ${escapeTs(entry.stay)}`,
    entry.notes ? `notes: ${escapeTs(entry.notes)}` : null,
    entry.sourceUrl ? `sourceUrl: ${escapeTs(entry.sourceUrl)}` : null,
    entry.parent ? `parent: ${escapeTs(entry.parent)}` : null,
  ].filter(Boolean);
  return `  ${escapeTs(code)}: { ${fields.join(", ")} },`;
});

const generated = `// Generated by scripts/generate-visa-baseline.mjs. Do not edit by hand.\n` +
  `// Source snapshot: ${pageUrl} (revision ${payload.parse.revid}).\n\n` +
  `export type VisaBaselineKind =\n` +
  `  | "visa-free"\n  | "conditional"\n  | "eta"\n  | "e-visa"\n  | "visa-on-arrival"\n` +
  `  | "electronic-or-arrival"\n  | "visa-required"\n  | "permit"\n  | "restricted";\n\n` +
  `export type VisaBaselineEntry = {\n  kind: VisaBaselineKind;\n  requirement: string;\n  stay: string;\n` +
  `  notes?: string;\n  sourceUrl?: string;\n  parent?: string;\n};\n\n` +
  `export const visaBaselineMetadata = {\n  source: ${escapeTs(pageUrl)},\n  revision: ${payload.parse.revid},\n` +
  `  generatedAt: ${escapeTs(new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date()))},\n  destinationCount: ${baseline.size},\n} as const;\n\n` +
  `export const visaBaseline = {\n${lines.join("\n")}\n} as const satisfies Record<string, VisaBaselineEntry>;\n`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, generated, "utf8");
console.log(`Generated ${baseline.size} destination rules from Wikipedia revision ${payload.parse.revid}.`);
