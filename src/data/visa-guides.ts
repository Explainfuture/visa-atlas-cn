import type { CountrySummary } from "@/data/world-countries";

export type VisaGuide = {
  code: string;
  status: string;
  statusTone: "visa-free" | "conditional" | "visa-required" | "electronic" | "pending";
  stay: string;
  method: string;
  leadTime: string;
  overview: string;
  steps: readonly string[];
  materials: readonly string[];
  notes: readonly string[];
  verifiedAt: string;
  sources: ReadonlyArray<{
    title: string;
    authority: string;
    url: string;
  }>;
};

const verifiedAt = "2026-08-17";

export const visaGuides: Record<string, VisaGuide> = {
  jp: {
    code: "jp",
    status: "需提前办签",
    statusTone: "visa-required",
    stay: "以签证页和入境许可为准",
    method: "指定代办机构递交",
    leadTime: "建议至少提前数周",
    overview: "中国大陆普通护照赴日短期旅游通常需事先取得短期停留签证。个人旅游申请一般通过日本驻华使领馆指定的旅行社或代办机构递交。",
    steps: ["按常住地确认所属领区与指定代办机构", "根据单次或多次旅游目的准备材料并递交", "收到护照后核对姓名、有效期、入境次数与停留期"],
    materials: ["有效护照", "签证申请表与证件照", "旅行计划、机票与住宿信息", "经济能力证明", "在职、在读或其他身份材料"],
    notes: ["各领区和代办机构的材料要求可能不同", "签证获批不等于自动获得入境许可"],
    verifiedAt,
    sources: [{ title: "中国公民赴日签证信息", authority: "日本外务省", url: "https://www.mofa.go.jp/j_info/visit/visa/topics/china.html" }],
  },
  th: {
    code: "th",
    status: "互免签证",
    statusTone: "visa-free",
    stay: "单次不超过 30 天；180 天内累计不超过 90 天",
    method: "持普通护照直接出行",
    leadTime: "无需提前申请签证",
    overview: "中泰普通护照互免签证协定自 2024 年 3 月 1 日起生效，适用于旅游等短期访问，不适用于居留、工作、学习或媒体活动。",
    steps: ["确认护照和返程或后续行程有效", "准备住宿与旅行计划供边检核验", "按泰国当前入境要求完成必要申报"],
    materials: ["有效普通护照", "返程或联程机票", "住宿信息", "足够的旅行资金", "必要的入境申报"],
    notes: ["免签不适用于工作、学习或长期居留", "最终停留期限由入境机关决定"],
    verifiedAt,
    sources: [{ title: "中泰普通护照互免签证协定", authority: "泰国外交部", url: "https://mfa.go.th/en/content/thcn280124?cate=5d5bcb4e15e39c306000683e" }],
  },
  sg: {
    code: "sg",
    status: "互免签证",
    statusTone: "visa-free",
    stay: "不超过 30 天",
    method: "持普通护照直接出行",
    leadTime: "无需提前申请签证",
    overview: "自 2024 年 2 月 9 日起，中国普通护照持有人可免签进入新加坡停留不超过 30 天；其他中国旅行证件仍可能需要签证。",
    steps: ["确认使用中国普通护照且旅行目的符合短期访问", "出发前完成新加坡入境卡等现行申报", "携带返程行程、住宿和资金证明"],
    materials: ["有效普通护照", "返程或联程机票", "住宿信息", "新加坡入境卡", "旅行资金证明"],
    notes: ["免签不保证入境，停留期由入境官员决定", "工作、学习和长期停留需办理相应许可"],
    verifiedAt,
    sources: [{ title: "中新 30 天互免签证安排", authority: "新加坡移民与关卡局", url: "https://www.ica.gov.sg/news-and-publications/newsroom/media-release/mutual-30-day-visa-exemption-arrangement-between-singapore-and-the-people-s-republic-of-china" }],
  },
  fr: {
    code: "fr",
    status: "需申根签证",
    statusTone: "visa-required",
    stay: "任意 180 天内最多 90 天",
    method: "France-Visas 填表后递交",
    leadTime: "最早可提前 6 个月申请",
    overview: "中国普通护照赴法国本土短期旅游通常需申请统一申根短期签证。中国境内申请先在 France-Visas 完成流程，再按要求向 TLScontact 递交。",
    steps: ["在 France-Visas 核对签证类型并填写申请", "预约 TLScontact，提交材料和生物信息", "收到护照后核对签证有效期、停留天数与入境次数"],
    materials: ["护照、申请表与照片", "旅行医疗保险", "往返交通与住宿证明", "资金证明", "在职、在读或身份材料", "覆盖全程的行程计划"],
    notes: ["多国旅行应向主要停留国申请", "法国海外领地可能需要单独签证"],
    verifiedAt,
    sources: [
      { title: "在中国申请法国签证", authority: "France-Visas", url: "https://www.france-visas.gouv.fr/en/chine" },
      { title: "法国短期签证说明", authority: "France-Visas", url: "https://www.france-visas.gouv.fr/en/web/france-visas/visa-de-court-sejour" },
    ],
  },
  gb: {
    code: "gb",
    status: "需访客签证",
    statusTone: "visa-required",
    stay: "标准访客通常最多 6 个月",
    method: "线上申请并录入生物信息",
    leadTime: "建议预留至少数周",
    overview: "中国普通护照持有人属于英国访客签证国民，短期旅游通常需在出发前取得 Standard Visitor visa。",
    steps: ["使用 GOV.UK 工具确认签证类型", "在线申请、付费并预约签证中心", "提交生物信息和支持材料后等待决定"],
    materials: ["有效护照", "旅行目的与行程", "资金和收入证明", "国内约束力材料", "住宿与邀请信息（如适用）", "非英文或威尔士文材料的合规翻译"],
    notes: ["应证明会在访问结束后离境", "不要在获签前购买不可退改行程"],
    verifiedAt,
    sources: [
      { title: "检查是否需要英国签证", authority: "GOV.UK", url: "https://www.gov.uk/check-uk-visa" },
      { title: "访客签证支持材料指南", authority: "UK Visas and Immigration", url: "https://www.gov.uk/government/publications/visitor-visa-guide-to-supporting-documents" },
    ],
  },
  us: {
    code: "us",
    status: "需 B1/B2 签证",
    statusTone: "visa-required",
    stay: "由美国口岸在每次入境时决定",
    method: "DS-160、缴费与面谈",
    leadTime: "尽早申请并查看预约等待时间",
    overview: "中国普通护照赴美旅游通常需持 B-2 或 B1/B2 访客签证。签证有效期不等于可停留期限，实际停留期由入境时签发的记录决定。",
    steps: ["完成 DS-160 并保存确认页", "按官方渠道缴费和预约面谈", "携带护照、确认页与支持材料参加面谈"],
    materials: ["有效护照", "DS-160 确认页", "符合要求的照片", "旅行目的与计划", "资金证明", "能说明按期回国的材料"],
    notes: ["不要通过非官方渠道购买预约名额", "签证仅允许前往口岸申请入境"],
    verifiedAt,
    sources: [{ title: "美国旅游与访客签证", authority: "美国国务院", url: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html" }],
  },
  ca: {
    code: "ca",
    status: "需访客签证",
    statusTone: "visa-required",
    stay: "由入境官员决定，通常不超过 6 个月",
    method: "IRCC 在线申请",
    leadTime: "处理时间随申请地和个案变化",
    overview: "中国大陆普通护照属于加拿大签证要求范围，旅游通常需提前申请访客签证（Temporary Resident Visa），多数申请人还需录入生物信息。",
    steps: ["在 IRCC 核对入境文件要求", "在线提交访客签证申请并支付费用", "收到指示后预约并完成生物信息采集"],
    materials: ["有效护照扫描件", "旅行目的与行程", "资金证明", "工作、学习或家庭联系", "邀请材料（如适用）", "生物信息"],
    notes: ["签证有效期可长于单次获准停留期", "以 IRCC 账户中的最新通知为准"],
    verifiedAt,
    sources: [
      { title: "加拿大入境文件要求", authority: "加拿大移民、难民及公民部", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/entry-requirements-country.html" },
      { title: "访客签证申请", authority: "加拿大移民、难民及公民部", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/visitor-visa.html" },
    ],
  },
  br: {
    code: "br",
    status: "临时免签",
    statusTone: "conditional",
    stay: "最多 30 天，不可延期；每个迁移年度累计不超过 30 天",
    method: "符合条件可免签入境",
    leadTime: "措施暂定至 2026-12-31",
    overview: "巴西自 2026 年 5 月 11 日起临时对中国普通护照短期访问实施免签，涵盖旅游、商务和过境等用途；该措施目前公布有效至 2026 年 12 月 31 日。",
    steps: ["确认旅行日期处于临时措施有效期内", "准备返程行程、住宿与旅行目的材料", "若停留超过 30 天或目的不符，提前申请相应签证"],
    materials: ["有效中国普通护照", "返程或联程机票", "住宿信息", "旅行目的证明", "足够的旅行资金"],
    notes: ["这是有截止日期的临时政策，订票前必须再次核验", "工作等活动不在本次短期免签范围内"],
    verifiedAt,
    sources: [{ title: "中国普通护照短期访巴临时免签", authority: "巴西驻广州总领事馆", url: "https://www.gov.br/mre/pt-br/consulado-cantao/EN/visas/info" }],
  },
  ma: {
    code: "ma",
    status: "免签",
    statusTone: "visa-free",
    stay: "不超过 90 天",
    method: "持护照直接出行",
    leadTime: "无需提前申请签证",
    overview: "中国公民持护照可免签进入摩洛哥，停留不超过 90 天。边检可能查验旅行目的、返程行程、住宿和资金。",
    steps: ["确保护照有效期通常在 6 个月以上", "备好返程机票、住宿与旅行计划", "经申根区转机时另行核对过境签证要求"],
    materials: ["有效护照", "返程机票", "酒店订单或居住证明", "足够的现金或资金证明", "旅行计划或邀请材料"],
    notes: ["免签不等于免于边检材料审查", "不要超过 90 天停留期"],
    verifiedAt,
    sources: [{ title: "摩洛哥出入境领事提醒", authority: "中国驻摩洛哥大使馆", url: "https://ma.china-embassy.gov.cn/lsfw/lsbh/aqtxlstx/202403/t20240322_11266442.htm" }],
  },
  za: {
    code: "za",
    status: "需电子授权或电子签",
    statusTone: "electronic",
    stay: "以签发的 ETA / eVisa 条件为准",
    method: "南非内政部在线申请",
    leadTime: "出发前完成并等待批准",
    overview: "中国普通护照持有人属于南非在线电子入境许可覆盖范围，可按旅行条件使用官方 ETA 或 eVisa 渠道；入境机场和许可条件必须逐项核对。",
    steps: ["在南非内政部官方平台核对 ETA 或 eVisa 资格", "上传护照、实时照片和旅行信息并完成支付", "批准后保存并打印许可，按指定口岸入境"],
    materials: ["有效普通护照", "护照资料页照片", "实时人像照片", "旅行与住宿信息", "资金证明", "获批的电子许可打印件"],
    notes: ["ETA 目前仅适用于指定国际机场", "电子许可不允许工作，最终入境仍需口岸审查"],
    verifiedAt,
    sources: [
      { title: "南非官方 ETA 申请平台", authority: "南非内政部", url: "https://eta.dha.gov.za/" },
      { title: "南非 eVisa 申请平台", authority: "南非内政部", url: "https://ehome.dha.gov.za/epermit/home" },
    ],
  },
  au: {
    code: "au",
    status: "需访客签证",
    statusTone: "visa-required",
    stay: "通常每次 3 个月，个案可获更长",
    method: "ImmiAccount 在线申请",
    leadTime: "不要在获签前安排不可退行程",
    overview: "中国普通护照赴澳旅游通常申请 Visitor visa（subclass 600）Tourist stream。申请在线提交，签证与护照电子关联。",
    steps: ["创建或登录 ImmiAccount", "填写申请并上传彩色扫描件和英文翻译", "按通知完成生物信息或体检并等待书面决定"],
    materials: ["有效护照", "证件照", "旅行计划", "资金证明", "工作、学习或家庭联系", "非英文材料的英文翻译"],
    notes: ["访客签证不允许工作", "停留期、入境次数和附加条件以获签信为准"],
    verifiedAt,
    sources: [
      { title: "中国申请人访澳说明", authority: "澳大利亚驻华大使馆", url: "https://china.embassy.gov.au/bjng/DIMA0301.html" },
      { title: "Visitor visa 600 Tourist stream", authority: "澳大利亚内政部", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600/tourist-stream-overseas" },
    ],
  },
  nz: {
    code: "nz",
    status: "通常需访客签证",
    statusTone: "conditional",
    stay: "多次签通常每 12 个月累计 6 个月；单次签可至 9 个月",
    method: "新西兰移民局在线申请",
    leadTime: "建议在不可退行程前申请",
    overview: "中国普通护照通常需提前申请新西兰 Visitor Visa。2025 年 11 月起的试行安排允许部分持合资格澳大利亚签证、从澳大利亚直飞的中国旅客改用 NZeTA，当前应按官方条件核验。",
    steps: ["先用官方工具判断需要 Visitor Visa 还是符合 NZeTA 条件", "在线上传护照、照片、资金与访问目的材料", "出发前完成 New Zealand Traveller Declaration"],
    materials: ["有效护照", "符合标准的照片", "旅行与住宿计划", "资金或担保证明", "离境计划", "非英文材料的英文翻译"],
    notes: ["经澳大利亚前往的 NZeTA 安排有严格资格和期限", "不要把经澳大利亚转机等同于从澳大利亚出发"],
    verifiedAt,
    sources: [
      { title: "中国公民访客签证指南", authority: "新西兰移民局", url: "https://www.immigration.govt.nz/process-to-apply/applying-for-a-visa/providing-evidence-and-documents-to-support-your-visa-application/visitor-visa-application-guide-for-citizens-of-china/" },
      { title: "中国公民 NZeTA 条件", authority: "新西兰移民局", url: "https://www.immigration.govt.nz/visit/what-you-need-to-visit-new-zealand/nzeta-application-guide-for-citizens-of-china/" },
    ],
  },
};

export function getVisaGuide(country: CountrySummary): VisaGuide {
  return (
    visaGuides[country.code] ?? {
      code: country.code,
      status: "正在核验",
      statusTone: "pending",
      stay: "以目的地官方答复为准",
      method: "先查官方入境要求",
      leadTime: "建议在订票前确认",
      overview: `${country.name}页面已经进入知识库，编辑团队正在交叉核验针对中国普通护照的最新短期旅游签证要求。核验完成前，请直接使用下方官方渠道确认。`,
      steps: ["查看中国领事服务网的目的地提醒", "使用航空业旅行证件工具核对护照与行程", "向目的地使领馆确认后再购买不可退改行程"],
      materials: ["有效中国普通护照", "完整旅行日期与入境口岸", "返程或后续行程", "住宿信息", "旅行目的说明"],
      notes: ["此页暂未发布确定的签证结论", "转机、邮轮和陆路入境可能有不同规则"],
      verifiedAt,
      sources: [
        { title: "中国领事服务网目的地指南", authority: "中华人民共和国外交部", url: "https://cs.mfa.gov.cn/zggmcg/ljmdd/" },
        { title: "旅行证件与入境要求查询", authority: "IATA Travel Centre", url: "https://www.iatatravelcentre.com/" },
      ],
    }
  );
}
