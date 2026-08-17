import {
  visaBaseline,
  visaBaselineMetadata,
  type VisaBaselineEntry,
  type VisaBaselineKind,
} from "@/data/visa-baseline.generated";
import type { CountrySummary } from "@/data/world-countries";
import type { ApplicationStep, MaterialItem, VisaGuide, VisaStatusTone } from "@/data/visa-guides";

const IATA_URL = "https://www.iatatravelcentre.com/";
const MFA_URL = "https://cs.mfa.gov.cn/zggmcg/ljmdd/";
const SCHENGEN_URL =
  "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy/applying-schengen-visa_en";

const schengenCodes = new Set([
  "at", "be", "bg", "hr", "cz", "dk", "ee", "fi", "fr", "de", "gr", "hu", "is", "it", "lv",
  "li", "lt", "lu", "mt", "nl", "no", "pl", "pt", "ro", "sk", "si", "es", "se", "ch",
]);

const specialSources: Partial<Record<string, VisaGuide["sources"]>> = {
  hk: [
    {
      title: "往来港澳通行证和签注签发服务指南",
      authority: "中华人民共和国国家移民管理局",
      url: "https://www.nia.gov.cn/n741440/n741587/n1316094/n1355872/c1559612/content.html",
      tag: "官方规则",
    },
  ],
  mo: [
    {
      title: "往来港澳通行证和签注签发服务指南",
      authority: "中华人民共和国国家移民管理局",
      url: "https://www.nia.gov.cn/n741440/n741587/n1316094/n1355872/c1559612/content.html",
      tag: "官方规则",
    },
  ],
  tw: [
    {
      title: "大陆居民申请进入中国台湾送件须知",
      authority: "中国台湾移民事务主管机构",
      url: "https://www.immigration.gov.tw/5382/5385/7244/7250/7257/%E5%81%9C%E7%95%99/",
      tag: "许可入口",
    },
  ],
};

const baseBorderMaterials: MaterialItem[] = [
  { title: "有效中国普通护照", detail: "核对目的地要求的剩余有效期和空白页；多数目的地会要求至少覆盖全程，部分要求 6 个月。", kind: "必备" },
  { title: "返程或下一程机票", detail: "日期必须落在允许停留期内；陆路离境则准备车票或路线说明。", kind: "必备" },
  { title: "住宿证明", detail: "酒店确认单，或接待人的地址、电话与邀请材料。", kind: "必备" },
  { title: "旅行资金证明", detail: "准备银行卡、现金或近期流水，金额能够覆盖住宿、交通与日常开支。", kind: "建议" },
];

const applicationMaterials: MaterialItem[] = [
  { title: "护照资料页", detail: "彩色扫描，四角完整、无反光；护照有效期和空白页须满足目的地要求。", kind: "必备" },
  { title: "签证照片", detail: "按官方尺寸、背景色和拍摄时间准备电子版或纸质版，不沿用不合规证件照。", kind: "必备" },
  { title: "行程与住宿", detail: "提供往返计划、逐日行程、酒店订单；未获签前优先使用可取消预订。", kind: "必备" },
  { title: "资金与在职 / 在读证明", detail: "近期银行流水、收入或资产、准假信；无业、退休或未成年人补充资助关系。", kind: "必备" },
  { title: "旅行保险", detail: "按目的地要求购买；申根等地区会核对保额、承保区域和全程日期。", kind: "按情况" },
  { title: "邀请与关系材料", detail: "探亲、访友或有人承担费用时，补邀请信、邀请人证件和关系证明。", kind: "按情况" },
];

function toneFor(kind: VisaBaselineKind): VisaStatusTone {
  if (kind === "visa-free") return "visa-free";
  if (kind === "conditional" || kind === "electronic-or-arrival") return "conditional";
  if (kind === "eta" || kind === "e-visa" || kind === "visa-on-arrival") return "electronic";
  return "visa-required";
}

function statusFor(kind: VisaBaselineKind) {
  return {
    "visa-free": "短期免签",
    conditional: "有条件免签 / 特殊证件",
    eta: "需电子旅行授权",
    "e-visa": "可在线申请电子签",
    "visa-on-arrival": "可办理落地签",
    "electronic-or-arrival": "电子签 / 落地签二选一",
    "visa-required": "需提前办签",
    permit: "需事先办访问许可",
    restricted: "普通旅游暂不开放",
  }[kind];
}

function displayRequirement(entry: VisaBaselineEntry) {
  return /[\u3400-\u9fff]/.test(entry.requirement) ? entry.requirement : statusFor(entry.kind);
}

function methodFor(kind: VisaBaselineKind) {
  return {
    "visa-free": "带齐边检材料直接出行",
    conditional: "先确认自己满足哪一条条件",
    eta: "出发前在官方系统申请授权",
    "e-visa": "在官方电子签网站上传并付费",
    "visa-on-arrival": "先核对口岸资格，再在抵达柜台办理",
    "electronic-or-arrival": "优先提前电子申请，或在指定口岸办理",
    "visa-required": "向使领馆或官方签证中心递交",
    permit: "通过主管机关或持牌组织方申请",
    restricted: "先取得主管机关书面准入答复",
  }[kind];
}

function leadTimeFor(kind: VisaBaselineKind) {
  return {
    "visa-free": "出发前 1 周复核入境规则",
    conditional: "订不可退行程前完成资格核对",
    eta: "建议至少提前 1 周",
    "e-visa": "建议提前 2—4 周",
    "visa-on-arrival": "出发前完成口岸与材料核对",
    "electronic-or-arrival": "建议提前 2—4 周",
    "visa-required": "建议提前 4—8 周",
    permit: "建议提前 1—3 个月联系组织方",
    restricted: "不要先支付机票或团费",
  }[kind];
}

function localizeStay(stay: string) {
  if (stay === "以边检批准为准") return stay;
  return stay
    .replace(/up to/gi, "最长")
    .replace(/(\d+)\s*days?/gi, "$1 天")
    .replace(/(\d+)\s*months?/gi, "$1 个月")
    .replace(/within any/gi, "每")
    .replace(/per entry/gi, "每次入境")
    .replace(/unlimited/gi, "不限（仍受入境目的约束）");
}

function feeHint(notes?: string) {
  const match = notes?.match(/(?:US\$|USD|€|EUR|£|GBP)\s*\d[\d,.]*|\d[\d,.]*\s*(?:USD|EUR|GBP|euros?)/i);
  return match?.[0].replace(/\s+/g, " ");
}

function extraMaterial(entry: VisaBaselineEntry): MaterialItem[] {
  const additions: MaterialItem[] = [];
  if (/yellow fever/i.test(entry.notes ?? "")) {
    additions.push({ title: "黄热病疫苗证书", detail: "若从黄热病风险国家或地区抵达，随身携带有效《国际预防接种证书》。", kind: "按情况" });
  }
  if (/invitation|introducing letter/i.test(entry.notes ?? "")) {
    additions.push({ title: "邀请信或介绍信", detail: "按访问目的准备接待人/机构签字文件及对方身份证明。", kind: "按情况" });
  }
  return additions;
}

function borderSteps(country: CountrySummary, entry: VisaBaselineEntry): ApplicationStep[] {
  return [
    {
      title: `锁定${country.name}允许停留期`,
      detail: `当前资料表记录为“${localizeStay(entry.stay)}”。再按护照有效期、转机地和入境口岸做一次 IATA 核对。`,
      action: { label: "临行核验", url: IATA_URL },
    },
    { title: "填写入境申报", detail: "检查是否有电子到达卡、海关或健康申报；只使用政府域名，不向广告网站交费。" },
    { title: "整理一份边检资料包", detail: "把返程票、酒店、保险、邀请信和资金证明存为离线 PDF，同时保留英文版关键信息。" },
    { title: "值机与入境时按顺序出示", detail: "先出示护照和返程安排；边检追问时再补住宿、资金和访问目的证明。" },
  ];
}

function electronicSteps(country: CountrySummary, entry: VisaBaselineEntry): ApplicationStep[] {
  const isArrival = entry.kind === "visa-on-arrival";
  return [
    {
      title: isArrival ? "确认可办理落地签的口岸" : "找到政府官方申请入口",
      detail: isArrival
        ? `核对${country.name}允许中国普通护照办理落地签的机场、陆路口岸、停留期和付款方式。`
        : `从${country.name}移民机关或使领馆进入申请页，核对网址域名，避开搜索广告和商业代填网站。`,
      action: { label: "查看规则来源", url: entry.sourceUrl ?? visaBaselineMetadata.source },
    },
    { title: "按护照逐字填写", detail: "姓名、护照号、签发/有效日期必须与资料页一致；上传照片、行程、住宿和资金文件。" },
    { title: "支付政府申请费", detail: "先截存收费页和订单号，再用支持境外支付的银行卡付款；拒签或撤回通常不退款。" },
    {
      title: isArrival ? "带齐现场材料和付款工具" : "下载批准文件并核对内容",
      detail: isArrival
        ? "准备照片、现金与银行卡两种付款方式，并把酒店、返程票和批准/预登记文件打印出来。"
        : "核对姓名、护照号、有效期、入境次数与准许口岸；打印批准函并保存离线副本。",
    },
  ];
}

function embassySteps(country: CountrySummary): ApplicationStep[] {
  return [
    { title: "确定签证类别与受理领区", detail: `以旅游为目的查${country.name}使领馆或官方签证中心；按长期居住地选择领区，不跨区盲约。`, action: { label: "查目的地官方渠道", url: MFA_URL } },
    { title: "在线填表并预约", detail: "按护照逐字填写，保存申请号；预约递交/面谈/指纹时确认政府费、中心费和付款方式。" },
    { title: "按清单整理原件与复印件", detail: "材料按官方顺序装订；行程、流水、在职/在读、邀请与关系证明之间的日期和金额要一致。" },
    { title: "递交、录指纹并付款", detail: "只在使领馆或指定中心付款并索取收据；如需补件，通过申请账户或官方通知渠道提交。" },
    { title: "取回护照后逐项验签", detail: "核对姓名、护照号、有效期、停留天数和入境次数，再购买不可退项目。" },
  ];
}

function permitSteps(country: CountrySummary, restricted: boolean): ApplicationStep[] {
  return [
    { title: "先联系主管机关或持牌组织方", detail: `${country.name}${restricted ? "目前不适合按普通旅游规划" : "通常没有普通游客自助签证窗口"}；先取得能否接待的书面答复。`, action: { label: "查看资料基线", url: visaBaselineMetadata.source } },
    { title: "提交完整路线与人员资料", detail: "准备护照、访问目的、日期、交通/船期、住宿、保险、紧急联系人和组织方责任文件。" },
    { title: "等待许可和登陆条件", detail: "确认许可覆盖每个保护区、岛屿或口岸，并问清登陆费、环保费、向导费与撤销政策。" },
    { title: "许可落地前不买不可退行程", detail: "普通签证、转机签证和访问许可是不同文件；所有环节都书面确认后再付款。" },
  ];
}

function materialsFor(entry: VisaBaselineEntry) {
  if (entry.kind === "visa-free" || entry.kind === "conditional") {
    return [...baseBorderMaterials, ...extraMaterial(entry), { title: "入境申报与保险", detail: "按目的地填写电子到达卡；保险虽不总是强制，但应覆盖全程医疗和遣返。", kind: "按情况" as const }];
  }
  if (entry.kind === "permit" || entry.kind === "restricted") {
    return [
      { title: "护照与人员名单", detail: "按组织方格式提交护照资料页、出生日期、国籍和紧急联系人。", kind: "必备" as const },
      { title: "完整访问路线", detail: "逐日列出交通工具、船期、登陆点、住宿、活动区域和备用方案。", kind: "必备" as const },
      { title: "组织方或邀请文件", detail: "持牌探险公司、科研机构、雇主或当地担保方出具责任与接待说明。", kind: "必备" as const },
      { title: "高额医疗与撤离保险", detail: "偏远地区通常要求覆盖紧急后送、搜救和遗体遣返。", kind: "必备" as const },
      { title: "途经国签证", detail: "访问许可不替代转机或登船国家的签证、ETA 和过境文件。", kind: "必备" as const },
    ];
  }
  return [...applicationMaterials, ...extraMaterial(entry)];
}

function costsFor(entry: VisaBaselineEntry): VisaGuide["cost"] {
  const hint = feeHint(entry.notes);
  if (entry.kind === "visa-free") {
    return {
      summary: "政府签证费 ¥0",
      items: [
        { label: "短期旅游签证费", amount: "¥0", detail: "符合免签停留与访问目的时不收签证申请费。" },
        { label: "电子到达卡 / 旅游税", amount: "按当地规则", detail: "它们不是签证费；只在政府页面、酒店或入境口岸按规定支付。" },
        { label: "旅行保险", amount: "按保额与天数", detail: "部分目的地强制，其余也建议覆盖医疗、延误和遣返。" },
      ],
      note: "免签只免去签证申请，不免除返程票、住宿、资金和海关申报要求。",
    };
  }
  if (entry.kind === "permit" || entry.kind === "restricted") {
    return {
      summary: entry.kind === "restricted" ? "不要支付普通旅游签证费" : "许可费 + 组织服务费",
      items: [
        { label: "访问 / 登陆许可", amount: "主管机关定价", detail: "可能按人、航次、登陆点或保护区分别收费。" },
        { label: "组织与向导服务", amount: "组织方报价", detail: "通常包含交通协调、责任文件、向导或安全保障。" },
        { label: "保险与紧急撤离", amount: "按风险与保额", detail: "偏远地区的医疗后送保险往往是必要成本。" },
      ],
      note: "先取得书面准入和退款条款；不要把商业机构收款当成政府许可已经获批。",
    };
  }
  if (entry.kind === "visa-required") {
    return {
      summary: hint ? `${hint}（资料表费用线索）` : "签证费 + 可能的中心服务费",
      items: [
        { label: "政府签证申请费", amount: hint ?? "以使领馆收费页为准", detail: "通常按签证类型、入境次数和国籍计价；拒签一般不退。" },
        { label: "官方签证中心服务费", amount: "若指定中心则另收", detail: "与政府费分开列账；预约前查看中心收费表。" },
        { label: "采集 / 快递 / 短信", amount: "按需选择", detail: "录指纹、护照回邮、短信和贵宾服务不要混入政府签证费。" },
      ],
      note: "付款页应来自使领馆或其明确指定的签证中心；商业代办费不等于政府收费。",
    };
  }
  return {
    summary: hint ? `${hint}（资料表费用线索）` : "政府电子授权 / 签证费",
    items: [
      { label: "政府申请或落地签费", amount: hint ?? "以官方结算页 / 口岸为准", detail: "按停留期、入境次数和办理方式收取；提交后通常不退。" },
      { label: "银行卡换汇手续费", amount: "发卡行计价", detail: "电子申请通常用外币支付，留意动态货币转换和失败重复扣款。" },
      { label: "第三方代填 / 加急", amount: "通常不是必选", detail: "能在政府官网自助申请时，不必为搜索广告网站额外付费。" },
    ],
    note: "以付款当日官方页面为最终金额；落地办理还要确认收现金、银行卡及可用币种。",
  };
}

function notesFor(country: CountrySummary, entry: VisaBaselineEntry) {
  const notes = [
    `${country.name}当前资料基线为“${displayRequirement(entry)}”，允许停留记录为“${localizeStay(entry.stay)}”；航空公司值机与边检拥有最终核验权。`,
    "普通护照旅游规则不能直接套用到商务、学习、工作、探亲、记者或公务证件。",
  ];
  if (entry.parent) notes.push(`该目的地沿用 ${entry.parent.toUpperCase()} 的主要入境框架，但可能另有登陆、航线或属地条件。`);
  if (/visa (?:may be )?substitut|holders? of (?:a )?valid .*visa|valid .*visa.*(?:may|can)/i.test(entry.notes ?? "")) {
    notes.push("资料表同时记录了持特定第三国签证或居留许可的豁免条件；签发国、签证种类、有效期和入境次数必须逐项满足。 ");
  }
  const until = entry.notes?.match(/(?:until|through) ([^.]+)/i)?.[1]?.replace(/visa-free\s*/i, "");
  if (until) {
    const timestamp = Date.parse(until);
    const displayDate = Number.isNaN(timestamp)
      ? until
      : new Intl.DateTimeFormat("zh-CN", { dateStyle: "long", timeZone: "UTC" }).format(new Date(timestamp));
    notes.push(`当前安排带有期限：${displayDate}；临行前必须确认是否续期。`);
  }
  if (entry.notes && /[\u3400-\u9fff]/.test(entry.notes)) notes.push(entry.notes);
  return notes;
}

function sourcesFor(country: CountrySummary, entry: VisaBaselineEntry): VisaGuide["sources"] {
  const sources: VisaGuide["sources"] = [
    ...(specialSources[country.code] ?? []),
    ...(entry.sourceUrl
      ? [{ title: `${country.name}入境规则链接`, authority: "目的地主管机关（资料表所引）", url: entry.sourceUrl, tag: "规则入口" }]
      : []),
    { title: "中国普通护照签证要求总表", authority: "Wikipedia 汇总（引用 Timatic 与各国官方资料）", url: visaBaselineMetadata.source, tag: "资料基线" },
    { title: "航空公司旅行证件核验", authority: "IATA Travel Centre / Timatic", url: IATA_URL, tag: "临行核验" },
    { title: `${country.name}安全与领事提醒`, authority: "中华人民共和国外交部", url: MFA_URL, tag: "领事提醒" },
  ];
  return sources;
}

function createSchengenGuide(country: CountrySummary, entry: VisaBaselineEntry): VisaGuide {
  return {
    code: country.code,
    status: "需申根短期签证",
    statusTone: "visa-required",
    stay: "每 180 天最多停留 90 天",
    method: "向主目的地领馆或官方签证中心递交",
    leadTime: "最早提前 6 个月；建议提前 4—8 周",
    overview: `持中国普通护照赴${country.name}短期旅游，通常申请 C 类申根签证。停留天数最多的国家是主目的地；天数相同则向第一入境国申请。`,
    decision: "先定完整申根路线和主目的地，再预约对应领馆或官方签证中心；不要为了好约而向非主目的地申请。",
    cost: {
      summary: "成人签证费 €90 + 服务费",
      items: [
        { label: "12 岁及以上签证费", amount: "€90", detail: "申根统一基础申请费，按受理机构公布的人民币汇率收取。" },
        { label: "6—11 岁儿童", amount: "€45", detail: "未满 6 岁通常免签证费；其他豁免按官方清单。" },
        { label: "签证中心与快递", amount: "另计", detail: "官方中心服务费、护照回邮、短信等与签证费分开。" },
        { label: "旅行医疗保险", amount: "按天数和年龄", detail: "最低保额 €30,000，覆盖整个申根区和全部行程日期。" },
      ],
      note: "签证费一般不因拒签退还；人民币收款金额会随官方换算汇率调整。",
    },
    steps: [
      { title: "确定主目的地和受理国", detail: "按各国停留夜数判断；夜数相同，向第一入境国申请。", action: { label: "看申根官方规则", url: SCHENGEN_URL } },
      { title: "填表并约官方受理点", detail: "从领馆页面进入指定签证中心；预约递交、指纹采集和付款时间。" },
      { title: "按同一条行程准备材料", detail: "申请表、照片、护照、机酒、保险、流水、在职/在读和户籍关系的日期必须互相对应。" },
      { title: "递交并采集指纹", detail: "携带原件和复印件，支付签证费与中心费；必要时说明旅行目的和资金来源。" },
      { title: "验签后再锁定不可退项目", detail: "核对有效期、停留天数和入境次数；签证有效期不等于允许停留天数。" },
    ],
    materials: [
      { title: "申请表、照片与护照", detail: "护照离开申根后通常仍需有效至少 3 个月，并有至少 2 页空白页。", kind: "必备" },
      { title: "全程交通和住宿", detail: "包含每个申根国家的日期、城市、酒店与跨城交通，优先可取消订单。", kind: "必备" },
      { title: "旅行医疗保险", detail: "最低保额 €30,000，覆盖全申根区域、全部日期和医疗遣返。", kind: "必备" },
      { title: "近 3—6 个月银行流水", detail: "体现稳定收入与足够余额；避免递交前突然存入无法解释的大额资金。", kind: "必备" },
      { title: "在职 / 在读 / 退休材料", detail: "说明职位、收入、准假与回国约束；自由职业者补业务与纳税材料。", kind: "必备" },
      { title: "户口、关系与资助材料", detail: "未成年人、无业或由他人出资时补关系证明、同意书和资助人流水。", kind: "按情况" },
    ],
    notes: notesFor(country, entry),
    verifiedAt: visaBaselineMetadata.generatedAt,
    sources: [
      { title: "申根签证申请规则与费用", authority: "欧盟委员会", url: SCHENGEN_URL, tag: "官方规则" },
      ...sourcesFor(country, entry),
    ],
  };
}

function createSpecialDocumentGuide(country: CountrySummary, entry: VisaBaselineEntry): VisaGuide | undefined {
  if (country.code === "hk" || country.code === "mo") {
    const destination = country.code === "hk" ? "香港" : "澳门";
    const direction = country.code === "hk" ? "赴港" : "赴澳";
    return {
      code: country.code,
      status: `需港澳通行证 + ${direction}签注`,
      statusTone: "conditional",
      stay: "以签注种类、次数和边检批准为准",
      method: "移民管理政务平台预办或出入境窗口申请",
      leadTime: "建议至少提前 2—3 周",
      overview: `中国大陆居民因私去${destination}旅游，通常不走普通护照旅游签证流程，而是办理往来港澳通行证和有效${direction}签注。已有通行证的人先看证件有效期和剩余签注次数。`,
      decision: `第一次办理：通行证和${direction}签注一起申请；已有通行证：只补办对应签注。先确认户籍地/居住地是否开放所需签注种类。`,
      cost: {
        summary: "签注 ¥15 起；首次办证另加 ¥60",
        items: [
          { label: "往来港澳通行证", amount: "¥60 / 证", detail: "首次申领、换发或补发时收取；已有有效证件无需重复支付。" },
          { label: "一次有效签注", amount: "¥15 / 件", detail: `常见单次${direction}签注收费，实际可申请种类取决于所在地政策与出行目的。` },
          { label: "二次有效签注", amount: "¥30 / 件", detail: "需要两次入境且当地允许办理该类签注时选择。" },
          { label: "短期多次有效签注", amount: "¥80 / 件起", detail: "多次签注有身份、地区和事由门槛，不是所有旅游申请人都可选。" },
        ],
        note: "窗口可能另有邮寄等自选费用；只按国家移民管理机构或受理窗口出具的缴费单付款。",
      },
      steps: [
        { title: "先查自己能办哪种签注", detail: `在移民管理政务平台查询户籍地/居住地对${direction}个人旅游、团队旅游等签注的受理条件。`, action: { label: "查看官方办理指南", url: "https://www.nia.gov.cn/n741440/n741587/n1316094/n1355872/c1559612/content.html" } },
        { title: "预约或预填申请", detail: "选择往来港澳通行证及签注业务、受理地、日期和领取方式；异地办理时带居住/在学/就业相关材料。" },
        { title: "到窗口交材料并采集信息", detail: "核验身份证、申请表、照片和原通行证；按要求采集指纹、签名并确认签注目的地和次数。" },
        { title: "缴费并保存受理回执", detail: "分清通行证工本费和签注费；用回执查询进度，邮寄取证则核对地址。" },
        { title: "拿证后逐项核对", detail: `检查通行证有效期、${direction}签注类别、有效期、次数和每次停留期限，再安排出行。` },
      ],
      materials: [
        { title: "居民身份证", detail: "携带原件；未满 16 周岁申请人按受理要求由监护人陪同并补关系材料。", kind: "必备" },
        { title: "出入境证件照片", detail: "使用符合《出入境证件相片照相指引》的照片和回执；现场是否可拍以受理点为准。", kind: "必备" },
        { title: "中国公民出入境证件申请表", detail: "可在平台预填或窗口领取，所有姓名、身份证号和联系方式要一致。", kind: "必备" },
        { title: "原往来港澳通行证", detail: "已有证件申请签注、换发时携带；检查剩余有效期是否覆盖旅行。", kind: "按情况" },
        { title: "异地受理或特殊身份材料", detail: "按居住、就业、就学、军人或登记备案人员身份补充对应证明和单位意见。", kind: "按情况" },
      ],
      notes: [
        `${destination}旅游签注的开放城市、个人/团队类别和可办理次数会调整，先以受理地出入境窗口答复为准。`,
        "通行证、签注和入境停留许可是三个概念：证件仍有效不代表签注仍有次数。",
        `经${destination}转机并持普通护照的条件与从内地直接赴${destination}旅游不同，要按完整联程票单独核验。`,
      ],
      verifiedAt: visaBaselineMetadata.generatedAt,
      sources: sourcesFor(country, entry),
    };
  }

  if (country.code === "tw") {
    return {
      code: country.code,
      status: "先核验开放资格，再办入台许可",
      statusTone: "conditional",
      stay: "以获批许可和当前开放政策为准",
      method: "大陆端出境证件与入台许可分别办理",
      leadTime: "确认渠道开放后至少提前 1—2 个月",
      overview: "大陆居民前往中国台湾不是普通护照电子签流程。能否以旅游目的申请，取决于当前开放对象、户籍/居住地、出发地与团体或个人渠道；确认有资格后，仍要分别办妥大陆端有效证件和入台许可。",
      decision: "第一步不是买机票，而是向大陆端出入境主管部门和中国台湾移民事务主管机构同时确认：你的身份、居住地与出发地目前是否有可用的旅游申请渠道。",
      cost: {
        summary: "大陆端证件费 + 入台许可费",
        items: [
          { label: "大陆端旅行证件 / 签注", amount: "以当前受理项目为准", detail: "只在确认本人符合开放范围后，按国家移民管理机构的收费单支付。" },
          { label: "入台许可", amount: "以中国台湾官方申请页为准", detail: "类别、递交地与申请方式不同，收费会不同；商业代办费另计。" },
          { label: "旅行社与材料服务", amount: "按实际渠道", detail: "若政策限定团队或指定渠道，问清是否包含许可、保险、翻译和取消费用。" },
        ],
        note: "渠道未开放或资格未确认前，不要向代办支付不可退许可费或团费。",
      },
      steps: [
        { title: "先做双向资格核验", detail: "分别确认大陆端是否受理、中国台湾方面是否接受该类入台申请；说明户籍、常住地、出发地、旅行目的与日期。", action: { label: "查看入台申请须知", url: "https://www.immigration.gov.tw/5382/5385/7244/7250/7257/%E5%81%9C%E7%95%99/" } },
        { title: "办理大陆端有效出境证件", detail: "按当前开放项目准备居民身份证、照片、申请表及异地/特殊身份材料，并核对签注或出境资格。" },
        { title: "递交入台许可申请", detail: "通过官方认可渠道上传证件、照片、行程、住宿、资金、紧急联系人和保险等材料。" },
        { title: "把两端文件放在一起核对", detail: "姓名、证件号、出生日期、有效期、入境次数、航班与停留日期必须完全一致。" },
        { title: "确认转机地和承运人要求", detail: "不同出发地与中转路线可能适用不同证件组合；拿到两端文件后再购买不可退行程。" },
      ],
      materials: [
        { title: "居民身份证与户籍 / 居住证明", detail: "用于核对大陆端受理地和当前开放资格；异地申请补居住、就业或就学材料。", kind: "必备" },
        { title: "大陆端有效旅行证件", detail: "按当前政策办理并确认相关签注、出境资格、有效期和次数。", kind: "必备" },
        { title: "入台许可申请资料", detail: "照片、申请表、证件扫描件和紧急联系人按官方尺寸与格式上传。", kind: "必备" },
        { title: "往返行程与住宿", detail: "航班、城市、酒店和停留天数须与申请类别和许可期限一致。", kind: "必备" },
        { title: "资金、在职 / 在读与保险", detail: "按申请渠道准备财力、职业/学籍、关系与旅行保险证明。", kind: "按情况" },
        { title: "旅行社或邀请单位文件", detail: "团队、探亲、商务或其他特定事由按当前渠道补担保、邀请与接待资料。", kind: "按情况" },
      ],
      notes: [
        "政策是否开放比材料清单更优先；不存在对所有大陆居民都通用的‘普通旅游电子签’入口。",
        "不要把海外长期居留人员、第三地学生或特定团体政策直接套用到内地出发的普通游客。",
        "两端主管机关、旅行社和航空公司的答复必须对应同一身份、同一路线和同一出发日期。",
      ],
      verifiedAt: visaBaselineMetadata.generatedAt,
      sources: sourcesFor(country, entry),
    };
  }

  return undefined;
}

export function createBaselineVisaGuide(country: CountrySummary): VisaGuide {
  const entry = visaBaseline[country.code as keyof typeof visaBaseline] as VisaBaselineEntry | undefined;
  if (!entry) throw new Error(`Missing visa baseline for ${country.code}`);
  const specialDocumentGuide = createSpecialDocumentGuide(country, entry);
  if (specialDocumentGuide) return specialDocumentGuide;
  if (schengenCodes.has(country.code)) return createSchengenGuide(country, entry);

  const steps =
    entry.kind === "visa-free" || entry.kind === "conditional"
      ? borderSteps(country, entry)
      : entry.kind === "visa-required"
        ? embassySteps(country)
        : entry.kind === "permit" || entry.kind === "restricted"
          ? permitSteps(country, entry.kind === "restricted")
          : electronicSteps(country, entry);

  return {
    code: country.code,
    status: statusFor(entry.kind),
    statusTone: toneFor(entry.kind),
    stay: localizeStay(entry.stay),
    method: methodFor(entry.kind),
    leadTime: leadTimeFor(entry.kind),
    overview: `持中国大陆普通护照以短期旅游为目的前往${country.name}，当前资料基线是“${displayRequirement(entry)}”。这份页面按实际办理顺序列出材料、操作和会遇到的费用。`,
    decision:
      entry.kind === "restricted"
        ? "当前不要按普通旅游签证购买行程；只有主管机关书面确认能够入境后再继续。"
        : `先确认“${localizeStay(entry.stay)}”覆盖你的完整行程，再按下方清单准备；涉及转机时，把转机地单独核验。`,
    cost: costsFor(entry),
    steps,
    materials: materialsFor(entry),
    notes: notesFor(country, entry),
    verifiedAt: visaBaselineMetadata.generatedAt,
    sources: sourcesFor(country, entry),
  };
}
