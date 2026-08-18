import type { CountrySummary } from "@/data/world-countries";
import { createBaselineVisaGuide } from "@/data/baseline-visa-guide";

export type VisaStatusTone =
  | "visa-free"
  | "conditional"
  | "visa-required"
  | "electronic"
  | "pending";

export type MaterialItem = {
  title: string;
  detail: string;
  kind: "必备" | "按情况" | "建议";
  purpose?: string;
  reference?: {
    label: string;
    url: string;
  };
};

export type ApplicationStep = {
  title: string;
  detail: string;
  action?: {
    label: string;
    url: string;
  };
};

export type FeeItem = {
  label: string;
  amount: string;
  detail: string;
};

export type VisaGuide = {
  code: string;
  status: string;
  statusTone: VisaStatusTone;
  stay: string;
  method: string;
  leadTime: string;
  overview: string;
  decision: string;
  cost: {
    summary: string;
    items: readonly FeeItem[];
    note: string;
  };
  steps: readonly ApplicationStep[];
  materials: readonly MaterialItem[];
  notes: readonly string[];
  verifiedAt: string;
  sources: ReadonlyArray<{
    title: string;
    authority: string;
    url: string;
    tag?: string;
  }>;
};

const verifiedAt = "2026-08-18";

export const visaGuides: Record<string, VisaGuide> = {
  jp: {
    code: "jp",
    status: "需提前办签",
    statusTone: "visa-required",
    stay: "个人旅游通常获 15 天或 30 天",
    method: "按常住地选择领区，再向使领馆指定旅行社递交",
    leadTime: "至少提前 3—4 周开始",
    overview:
      "持中国大陆普通护照赴日个人旅游，需要先办短期旅游签证。中国境内申请不能直接把材料交给使领馆，应先按居住地找到有送签资格的旅行社或代办机构。",
    decision: "先按常住地选领区，再到该使领馆官网核对指定旅行社公司全称；不要只凭淘宝、飞猪或地图搜索排名付款。",
    cost: {
      summary: "¥715 起 + 代办费",
      items: [
        { label: "单次签证手续费", amount: "¥715", detail: "2026 年 7 月 1 日起使领馆标准；获签后收取。" },
        { label: "多次签证手续费", amount: "¥1,430", detail: "需同时满足相应经济能力或旅行记录条件。" },
        { label: "旅行社 / 代办费", amount: "各机构自定", detail: "属于必要递交环节，询价时确认是否含快递、照片和翻译。" },
      ],
      note: "使领馆签证费和代办费是两笔钱。未发给签证时原则上不收使领馆签证费，但代办已发生的服务费可能不退。",
    },
    steps: [
      {
        title: "确认领区与签证类型",
        detail: "按实际居住地确认日本驻华使领馆辖区；首次普通旅游通常先看个人旅游单次签证。",
        action: { label: "查看日本驻华申请说明", url: "https://www.cn.emb-japan.go.jp/consular/visa_dantai.htm" },
      },
      {
        title: "从官方名单选择指定旅行社",
        detail: "淘宝、飞猪和线下门店都可以用来比价，但先索要营业执照公司全称，与所属领区官方名单逐字核对，再要书面材料清单和含税总价。",
        action: { label: "查看使馆指定旅行社名单", url: "https://www.cn.emb-japan.go.jp/itpr_zh/visa_dantai_daili.html" },
      },
      {
        title: "交材料并核对电子签",
        detail: "代办录入 JAPAN eVISA 后等待审查。出发时需联网展示 Visa Issuance Notice，截图、PDF 或打印件不能替代在线页面。",
        action: { label: "了解 JAPAN eVISA", url: "https://www.mofa.go.jp/j_info/visit/visa/visaonline.html" },
      },
    ],
    materials: [
      { title: "有效普通护照", detail: "留有空白页；旧护照如能说明出境记录，也一并准备。", kind: "必备" },
      { title: "签证申请表与照片", detail: "按代办提供的最新模板填写，姓名、护照号和行程日期必须一致。", kind: "必备" },
      { title: "完整旅行日程", detail: "逐日写明城市、景点、住宿和交通，避免与机酒预订单互相矛盾。", kind: "必备" },
      { title: "机票与住宿安排", detail: "以代办要求为准；旅游签证的机酒通常需要通过指定旅行社安排。", kind: "必备" },
      { title: "经济能力证明", detail: "常见为银行流水、存款、纳税或收入证明；具体门槛由签证类型和领区决定。", kind: "必备" },
      { title: "在职 / 在读 / 退休证明", detail: "用于解释收入来源、身份和回国约束力；自由职业者准备业务与收入说明。", kind: "按情况" },
      { title: "户籍或居住证明", detail: "异地居住、家庭共同申请或领区判断时可能需要。", kind: "按情况" },
    ],
    notes: [
      "旅行社说的“简化材料”不代表使领馆放弃审查，仍可能要求补件或面谈。",
      "一次签证有效期通常为 3 个月，停留 15 天或 30 天；以最终签发内容为准。",
      "个人旅游、探亲访友和商务不是同一种材料路径，不要混用邀请函或行程目的。",
      "所谓‘旗舰店’、销量和搜索排名不代表有送签资格；付款前必须用公司全称核对所属领区官方名单。",
    ],
    verifiedAt,
    sources: [
      { title: "赴日旅游签证（团队与个人）", authority: "日本国驻华大使馆", url: "https://www.cn.emb-japan.go.jp/consular/visa_dantai.htm" },
      { title: "2026 年 7 月起签证手续费", authority: "日本国外务省", url: "https://www.mofa.go.jp/j_info/visit/visa/procedure/pagewe_000001_00391.html" },
      { title: "JAPAN eVISA 适用范围与展示方式", authority: "日本国外务省", url: "https://www.mofa.go.jp/j_info/visit/visa/visaonline.html" },
    ],
  },
  th: {
    code: "th",
    status: "互免签证",
    statusTone: "visa-free",
    stay: "每次最多 30 天；180 天内累计最多 90 天",
    method: "持普通护照出行 + 免费填 TDAC",
    leadTime: "抵达前 3 天内填入境卡",
    overview:
      "中国普通护照短期赴泰旅游不需要预先申请签证，但每次入境前都要免费提交 Thailand Digital Arrival Card。免签解决的是签证，不代表边检不看返程、住宿和资金。",
    decision: "不用办签证，也不要买“泰国电子入境卡代办”；TDAC 官方填报免费。",
    cost: {
      summary: "签证费 ¥0",
      items: [
        { label: "30 天短期免签", amount: "免费", detail: "符合中泰普通护照互免协定的旅游等短期访问。" },
        { label: "TDAC 入境卡", amount: "免费", detail: "只能在入境前 3 天内提交，每次入境重新填写。" },
        { label: "第三方代填", amount: "非必需", detail: "官方不收费，搜索广告中的代填网站可能额外收费。" },
      ],
      note: "工作、学习、媒体活动或长期居留不属于这条免签路径，需要另办许可。",
    },
    steps: [
      { title: "检查 30 / 90 天规则", detail: "单次停留不超过 30 天，并确认过去任意 180 天内在泰累计停留不超过 90 天。" },
      {
        title: "抵达前 3 天内免费填 TDAC",
        detail: "准备护照、航班、泰国住宿地址、旅行目的和健康申报信息；婴幼儿也要填写。",
        action: { label: "免费填写 TDAC", url: "https://tdac.immigration.go.th/arrival-card/#/home" },
      },
      { title: "保存确认并带齐行程证明", detail: "保存提交确认，随身准备返程票、首晚住宿和可承担旅行费用的证明。" },
    ],
    materials: [
      { title: "有效中国普通护照", detail: "确保护照覆盖整个行程并留有足够有效期。", kind: "必备" },
      { title: "TDAC 提交确认", detail: "每次入境单独提交；不过移民检查则无需填写。", kind: "必备" },
      { title: "返程或联程机票", detail: "能证明会在获准停留期内离境。", kind: "必备" },
      { title: "泰国住宿地址", detail: "TDAC 需要填写，建议保存酒店订单或邀请人地址。", kind: "必备" },
      { title: "旅行资金证明", detail: "准备银行卡、现金或电子账单，以备航空公司或边检询问。", kind: "建议" },
      { title: "旅行保险", detail: "不是这条免签政策的固定材料，但建议覆盖医疗和行程中断。", kind: "建议" },
    ],
    notes: ["TDAC 不是签证，也不会延长你的免签停留期。", "陆路、海路和航空入境都适用 TDAC；不入境的纯转机旅客无需填写。"],
    verifiedAt,
    sources: [
      { title: "中泰普通护照互免签证协定", authority: "泰国外交部", url: "https://www.mfa.go.th/en/content/thcn280124?cate=5d5bcb4e15e39c306000683e" },
      { title: "TDAC 官方说明与材料要求", authority: "泰国移民局", url: "https://tdac.immigration.go.th/manual/en/faq.html" },
      { title: "TDAC 免费填报提醒", authority: "泰国移民局", url: "https://tak.immigration.go.th/thailand-digital-arrival-card-tdac-%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%8A%E0%B8%B2%E0%B8%A7%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4/" },
    ],
  },
  sg: {
    code: "sg",
    status: "互免签证",
    statusTone: "visa-free",
    stay: "最多 30 天，最终期限看电子访问准证",
    method: "持普通护照出行 + 免费填 SGAC",
    leadTime: "抵达日前 3 天内提交",
    overview:
      "中国普通护照短期赴新加坡旅游可免签停留不超过 30 天。出发前仍需通过 ICA 官方网站或 MyICA 免费提交 SG Arrival Card，入境后查看邮件中的电子访问准证和最后离境日期。",
    decision: "不用付签证费；唯一必须提前做的是在官方渠道免费提交 SG Arrival Card。",
    cost: {
      summary: "签证费 ¥0",
      items: [
        { label: "30 天短期免签", amount: "免费", detail: "适用于中国普通护照的短期访问。" },
        { label: "SG Arrival Card", amount: "免费", detail: "ICA 官方网页与 MyICA 应用均不收费。" },
        { label: "第三方代填", amount: "非必需", detail: "ICA 明确不认可收费代填网站。" },
      ],
      note: "SG Arrival Card 不是签证。任何要求为 SGAC 支付“政府费”的页面都应先核对域名是否为 ica.gov.sg。",
    },
    steps: [
      { title: "确认旅行目的属于短期访问", detail: "旅游、探亲等短期访问可走免签；工作、学习或长期居留需要对应准证。" },
      {
        title: "抵达日前 3 天内提交 SGAC",
        detail: "填写护照、航班或交通、住宿、联系方式与健康申报，使用能正常收邮件的地址。",
        action: { label: "免费提交 SG Arrival Card", url: "https://eservices.ica.gov.sg/sgarrivalcard/" },
      },
      { title: "入境后保存电子访问准证", detail: "ICA 会把 e-Pass 发至申报邮箱，里面的最后离境日期才是本次实际获准停留期限。" },
    ],
    materials: [
      { title: "有效中国普通护照", detail: "确保护照状态良好并覆盖完整行程。", kind: "必备" },
      { title: "SGAC 提交确认", detail: "保存确认邮件或 PDF；每次抵达都需重新提交。", kind: "必备" },
      { title: "返程或联程机票", detail: "证明有明确离境安排。", kind: "必备" },
      { title: "新加坡住宿信息", detail: "酒店订单、亲友住址及联系方式应与 SGAC 一致。", kind: "必备" },
      { title: "足够的旅行资金", detail: "准备能覆盖住宿、交通和日常消费的资金证明。", kind: "建议" },
      { title: "电子访问准证 e-Pass", detail: "入境后检查邮箱并保存，确认最后离境日期。", kind: "必备" },
    ],
    notes: ["免签不保证入境，ICA 仍会判断旅行目的和离境能力。", "转机不通过新加坡边检时通常无需提交 SGAC。"],
    verifiedAt,
    sources: [
      { title: "中新 30 天互免签证安排", authority: "新加坡移民与关卡局", url: "https://www.ica.gov.sg/news-and-publications/newsroom/media-release/mutual-30-day-visa-exemption-arrangement-between-singapore-and-the-people-s-republic-of-china" },
      { title: "SG Arrival Card 官方指南", authority: "新加坡移民与关卡局", url: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/sg-arrival-card" },
    ],
  },
  fr: {
    code: "fr",
    status: "需申根签证",
    statusTone: "visa-required",
    stay: "任意 180 天内最多 90 天",
    method: "France-Visas 填表 + TLScontact 递交",
    leadTime: "可提前 6 个月；建议提前 4—8 周",
    overview:
      "中国普通护照赴法国本土短期旅游通常申请统一申根 C 类签证。先在 France-Visas 完成申请，再预约 TLScontact 递交护照、纸质材料和生物信息。",
    decision: "法国是主要停留国时向法国申请；如果多国停留天数相同，通常向首入境国申请。",
    cost: {
      summary: "€90 + 约 ¥250 + 保险",
      items: [
        { label: "申根短期签证费", amount: "€90", detail: "成人标准；6—12 岁儿童 €45，6 岁以下通常免签证费。" },
        { label: "TLScontact 基础服务费", amount: "约 ¥250", detail: "中国递交中心按领馆确定的欧元标准折算人民币收取。" },
        { label: "旅行医疗保险", amount: "按产品计价", detail: "必须覆盖全部申根行程，医疗与遣返保额至少 €30,000。" },
      ],
      note: "照相、复印、快递和贵宾室属于可选服务，不是获签条件。拒签时签证费和已发生的服务费通常不退。",
    },
    steps: [
      {
        title: "用 Visa Wizard 确认清单",
        detail: "填写国籍、居住地、旅行目的和天数，生成与你情况对应的材料要求。",
        action: { label: "进入 France-Visas", url: "https://france-visas.gouv.fr/en/web/france-visas/visa-wizard" },
      },
      { title: "在线填表并预约 TLScontact", detail: "提交 France-Visas 表格后保存回执和材料清单，再选择所属领区的 TLScontact 中心。" },
      { title: "现场递交与录入生物信息", detail: "携带原件和复印件到场，支付签证费与服务费；取回护照后核对有效期、天数和入境次数。" },
    ],
    materials: [
      { title: "护照与旧护照", detail: "护照签发不超过 10 年、计划离开申根后仍有效至少 3 个月，并留有空白页。", kind: "必备" },
      { title: "France-Visas 表格、回执与照片", detail: "签名和护照信息保持一致，照片使用符合 ICAO 标准的近期证件照。", kind: "必备" },
      { title: "旅行医疗保险", detail: "覆盖全部申根国家和全部日期，医疗、急诊住院及遣返保额至少 €30,000。", kind: "必备" },
      { title: "往返交通与逐日行程", detail: "交通、城市顺序和日期相互对应；未获签前优先选择可退改订单。", kind: "必备" },
      { title: "全程住宿证明", detail: "酒店订单或邀请接待文件覆盖每一晚。", kind: "必备" },
      { title: "银行流水与旅行预算", detail: "用稳定收入和账户余额说明能承担本次机酒与日常费用。", kind: "必备" },
      { title: "在职 / 在读 / 退休材料", detail: "证明当前身份、准假安排和返回中国的约束力。", kind: "必备" },
      { title: "翻译件", detail: "France-Visas 清单要求翻译的中文材料应按规定提供法文或英文版本。", kind: "按情况" },
    ],
    notes: ["申请错国家是常见硬伤：按主要停留国判断，不是简单看哪国更容易出签。", "法国海外领地不一定适用申根签证，目的地是海外省或领地时重新走 Visa Wizard。"],
    verifiedAt,
    sources: [
      { title: "在中国申请法国签证", authority: "France-Visas", url: "https://france-visas.gouv.fr/en/web/france-visas/chine" },
      { title: "法国签证费用表", authority: "France-Visas", url: "https://france-visas.gouv.fr/documents/d/france-visas/frais-de-visa-anglais" },
      { title: "旅行医疗保险要求", authority: "France-Visas", url: "https://www.france-visas.gouv.fr/en/faq" },
    ],
  },
  gb: {
    code: "gb",
    status: "需访客签证",
    statusTone: "visa-required",
    stay: "标准访客每次通常最多 6 个月",
    method: "GOV.UK 在线申请 + 签证中心采集",
    leadTime: "最早提前 3 个月；通常约 3 周决定",
    overview:
      "中国普通护照赴英国旅游通常需要 Standard Visitor visa。每位申请人单独填表、付费和预约，材料核心是解释旅行目的、旅行预算、资金来源以及为什么会按时回国。",
    decision: "签证材料要讲清一条线：谁出钱、钱从哪里来、为什么去、什么时候回来。",
    cost: {
      summary: "£135 / 人起",
      items: [
        { label: "6 个月 Standard Visitor", amount: "£135", detail: "2026 年 4 月 8 日起的境外申请标准。" },
        { label: "2 / 5 / 10 年长期访客签", amount: "£506 / £903 / £1,128", detail: "每次仍最多停留 6 个月，获批期限可能短于申请期限。" },
        { label: "翻译与可选中心服务", amount: "按实际发生", detail: "加急、快递、扫描等不是普通申请的强制项。" },
      ],
      note: "家人同行也必须每人单独申请并付费。拒签或签发期限短于申请期限，费用通常不退。",
    },
    steps: [
      {
        title: "在线填写 Standard Visitor 申请",
        detail: "准备旅行日期、住宿、预算、年收入、住址、旅行史和家庭信息；如实保持与材料一致。",
        action: { label: "从 GOV.UK 开始申请", url: "https://www.gov.uk/standard-visitor/apply-standard-visitor-visa" },
      },
      { title: "付费并预约签证中心", detail: "每位申请人选择时间并到场证明身份、采集指纹和照片。" },
      { title: "上传支持材料并等待决定", detail: "围绕资金、行程和回国约束力组织文件，避免上传大量无法解释的无关材料。" },
    ],
    materials: [
      { title: "有效护照", detail: "须覆盖整个英国访问期；旧护照可用于说明旅行记录。", kind: "必备" },
      { title: "在线申请与预约确认", detail: "表格中的日期、收入和旅费承担人必须与证明材料一致。", kind: "必备" },
      { title: "旅行计划与住宿", detail: "说明计划日期、城市、住址和预计总花费，不要求先买不可退机票。", kind: "必备" },
      { title: "银行流水与收入证明", detail: "解释日常收入、存款来源和本次预算；突然大额入账要附说明。", kind: "必备" },
      { title: "工作、学业或家庭联系", detail: "在职与准假、在读、退休、经营材料等用于说明访问后会离境。", kind: "必备" },
      { title: "资助人材料", detail: "由他人出资时，提供关系、资助说明、对方资金和合法身份材料。", kind: "按情况" },
      { title: "合规翻译", detail: "不是英文或威尔士文的材料需附可核验的完整翻译。", kind: "必备" },
    ],
    notes: ["英国没有“存款越多越好”的官方线，稳定且解释得通比临时存入一大笔钱更重要。", "不要把长期访客签理解成可以长期居住；每次访问目的和时长仍会被审查。"],
    verifiedAt,
    sources: [
      { title: "Standard Visitor 申请、费用与材料", authority: "GOV.UK", url: "https://www.gov.uk/standard-visitor/apply-standard-visitor-visa" },
      { title: "访客签证支持材料指南", authority: "UK Visas and Immigration", url: "https://www.gov.uk/government/publications/visitor-visa-guide-to-supporting-documents" },
    ],
  },
  us: {
    code: "us",
    status: "需 B1/B2 签证",
    statusTone: "visa-required",
    stay: "每次入境由美国海关决定",
    method: "DS-160 + 缴费预约 + 面谈",
    leadTime: "尽早开始，以领馆预约等待为准",
    overview:
      "赴美旅游通常申请 B-2 或 B1/B2 访客签证。真正的必备件并不多，但 DS-160、面谈回答和支持材料必须一致，并能说明访问目的、费用承担能力和会按期离境。",
    decision: "先完整填写 DS-160，再缴费预约；不要向任何人购买所谓“内部面谈名额”。",
    cost: {
      summary: "US$185 / 人起",
      items: [
        { label: "B1/B2 申请费（MRV）", amount: "US$185", detail: "每位申请人支付，申请被拒也不退。" },
        { label: "签发互惠费", amount: "按国籍表核对", detail: "如适用，在批准后另收；以美国国务院互惠表为准。" },
        { label: "EVUS 登记", amount: "以官方页面为准", detail: "中国护照持 10 年 B1/B2 签证赴美前必须完成有效登记。" },
      ],
      note: "照片、赴领馆交通和护照配送可能产生实际支出。面谈加急只使用官方机制，不向黄牛付款。",
    },
    steps: [
      {
        title: "填写并提交 DS-160",
        detail: "准备个人、教育工作、旅行和安全背景信息，提交后保存带条码的确认页。",
        action: { label: "进入 DS-160 官方系统", url: "https://ceac.state.gov/genniv/" },
      },
      { title: "在官方预约系统缴费并选面谈", detail: "使用 DS-160 编号创建资料、支付 MRV 费并预约对应使领馆。" },
      { title: "参加面谈并按要求补充", detail: "携带必备件；简洁、真实地说明目的、预算、工作家庭联系和离境计划。" },
      {
        title: "获 10 年签证后登记 EVUS",
        detail: "中国护照持 10 年 B1/B2 签证需在赴美前完成有效 EVUS 登记，并在信息变化时更新。",
        action: { label: "前往 EVUS 官方网站", url: "https://www.evus.gov/" },
      },
    ],
    materials: [
      { title: "有效护照", detail: "通常应在预计停留结束后仍有至少 6 个月有效期；旧护照一并携带。", kind: "必备" },
      { title: "DS-160 确认页", detail: "带条码的确认页是面谈必备，不需要打印整份 DS-160。", kind: "必备" },
      { title: "面谈预约确认", detail: "确认地点、时间和允许携带物品规则。", kind: "必备" },
      { title: "符合标准的照片", detail: "DS-160 上传失败时必须携带纸质照片；建议按领馆要求备一张。", kind: "按情况" },
      { title: "旅行目的与大致计划", detail: "城市、时长、同行人和预算能与 DS-160 和口头回答对应。", kind: "建议" },
      { title: "资金与收入来源", detail: "银行、工资、纳税或经营材料用于说明能承担旅行费用。", kind: "建议" },
      { title: "回国约束力材料", detail: "工作、学业、家庭和资产等真实材料按个人情况准备。", kind: "建议" },
    ],
    notes: ["邀请函或经济担保书不是普通访客签证的必备件，核心仍是申请人自己的资格。", "签证有效期不是允许停留期；每次入境后查看 I-94 的 Admit Until Date。"],
    verifiedAt,
    sources: [
      { title: "访客签证申请流程、材料与费用", authority: "美国国务院", url: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html" },
      { title: "非移民签证费用表", authority: "美国国务院", url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/fees-visa-services.html" },
      { title: "中国旅客 EVUS 要求", authority: "美国海关与边境保护局", url: "https://www.help.cbp.gov/s/article/Article-1471?language=en_US" },
    ],
  },
  ca: {
    code: "ca",
    status: "需访客签证",
    statusTone: "visa-required",
    stay: "每次通常最多 6 个月，由入境官员决定",
    method: "IRCC Portal 在线申请 + 生物信息",
    leadTime: "处理时间随申请地变化，尽早申请",
    overview:
      "中国普通护照赴加拿大旅游通常需要 Visitor Visa（TRV）。在线上传材料并付费后，多数首次申请人还需按生物信息指示信预约采集指纹和照片。",
    decision: "普通首次成人申请，先按 CAD 185 / 人准备政府费用，再预留签证中心递送护照的支出。",
    cost: {
      summary: "通常 CAD 185 / 人",
      items: [
        { label: "Visitor Visa 申请费", amount: "CAD 100", detail: "单次和多次入境申请费用相同，由 IRCC 决定签发类型。" },
        { label: "生物信息费", amount: "CAD 85", detail: "需要采集时支付；临时居民生物信息通常可在有效期内复用。" },
        { label: "护照递送 / 快递", amount: "按签证中心报价", detail: "获批后收到护照通知时才进入贴签递送环节。" },
      ],
      note: "5 人及以上家庭同时同地申请，访客签证费上限 CAD 500；符合条件的家庭生物信息费上限 CAD 170。",
    },
    steps: [
      {
        title: "在 IRCC Portal 建立申请",
        detail: "回答资格问题后按系统生成的个性化清单填写表格、上传材料并支付费用。",
        action: { label: "查看 IRCC 申请步骤", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/apply-visitor-visa.html" },
      },
      { title: "收到 BIL 后采集生物信息", detail: "下载 Biometrics Instruction Letter，在规定期限内预约官方签证申请中心录指纹和照片。" },
      { title: "获批后按通知递交护照", detail: "不要提前寄护照。收到 Passport Request 后按签证中心流程提交并核对贴签。" },
    ],
    materials: [
      { title: "护照彩色扫描件", detail: "包含个人资料页、签证章和出入境记录；旧护照可补充旅行史。", kind: "必备" },
      { title: "数字照片与在线表格", detail: "按 IRCC Portal 生成的清单上传，不要自行遗漏必填表格。", kind: "必备" },
      { title: "旅行目的与计划", detail: "说明日期、城市、住宿、同行人和访问对象；不必先购买不可退机票。", kind: "必备" },
      { title: "银行流水与资产来源", detail: "展示有能力承担旅费，并解释大额入账、资助或不固定收入。", kind: "必备" },
      { title: "工作 / 学业 / 家庭联系", detail: "用于证明访问结束后会离开加拿大。", kind: "必备" },
      { title: "邀请人与关系证明", detail: "探亲访友时提供邀请、对方身份及双方关系；纯旅游通常不需要。", kind: "按情况" },
      { title: "生物信息指示信 BIL", detail: "收到后打印并按指定地点和期限完成采集。", kind: "按情况" },
    ],
    notes: ["不要先猜单次或多次：费用相同，由 IRCC 根据个案决定签发。", "签证贴纸有效期不是单次可停留期限，入境官员可能另行指定离境日期。"],
    verifiedAt,
    sources: [
      { title: "访客签证费用与在线申请", authority: "加拿大移民、难民及公民部", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/apply-visitor-visa.html" },
      { title: "生物信息费用与有效性", authority: "加拿大移民、难民及公民部", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/biometrics.html" },
    ],
  },
  br: {
    code: "br",
    status: "临时免签",
    statusTone: "conditional",
    stay: "最多 30 天，不可延期；迁移年度累计最多 30 天",
    method: "符合条件可直接出行",
    leadTime: "临时措施有效至 2026-12-31",
    overview:
      "2026 年 5 月 11 日起，中国普通护照短期赴巴西旅游、商务、过境或参加艺术体育活动可免签。每个迁移年度从第一次入境起算 12 个月，累计最多 30 天。",
    decision: "2026 年底前的合规短期旅行不用办签证，但这是一项有截止日期的临时政策。",
    cost: {
      summary: "签证费 ¥0",
      items: [
        { label: "临时短期免签", amount: "免费", detail: "停留不超过 30 天且目的属于政策列明范围。" },
        { label: "超过期限或目的不符", amount: "需另办签证", detail: "通过巴西签证中心按对应类别收费。" },
        { label: "第三方“免签登记”", amount: "非必需", detail: "官方政策没有要求为免签资格购买预登记。" },
      ],
      note: "免签措施目前只公布到 2026 年 12 月 31 日。2027 年或之后行程必须重新核验。",
    },
    steps: [
      { title: "核对出发与返程日期", detail: "确认整个访问在临时政策有效期内，并计算本迁移年度已在巴西停留的天数。" },
      { title: "准备能解释短期访问的材料", detail: "边检可能要求返程机票、住宿、资金和旅行目的证明。" },
      { title: "超过 30 天或需要工作时改办签证", detail: "免签不可延期，也不覆盖工作活动；应提前走巴西签证中心。" },
    ],
    materials: [
      { title: "有效中国普通护照", detail: "确保护照覆盖往返行程且状态良好。", kind: "必备" },
      { title: "返程或联程机票", detail: "日期应在 30 天允许停留范围内。", kind: "必备" },
      { title: "全程住宿信息", detail: "酒店订单、邀请人地址与联系方式。", kind: "必备" },
      { title: "旅行目的材料", detail: "旅游行程、商务活动或艺术体育活动安排应与免签范围一致。", kind: "必备" },
      { title: "旅行资金证明", detail: "银行卡、现金或账户材料能覆盖本次停留。", kind: "建议" },
      { title: "过去一年入境记录", detail: "多次前往时用于自行核对累计 30 天限制。", kind: "按情况" },
    ],
    notes: ["迁移年度不是自然年，而是从旅客第一次入境巴西之日起计算的 12 个月。", "免签停留不可延期；在巴西从事工作不属于本次豁免。"],
    verifiedAt,
    sources: [{ title: "中国普通护照短期访巴临时免签", authority: "巴西外交部", url: "https://www.gov.br/mre/pt-br/consulado-cantao/EN/visas/info" }],
  },
  ma: {
    code: "ma",
    status: "免签",
    statusTone: "visa-free",
    stay: "最多 90 天",
    method: "持护照和入境材料直接出行",
    leadTime: "无需提前申请签证",
    overview:
      "中国公民可持护照免签进入摩洛哥停留不超过 90 天。摩洛哥边检会实际审查返程机票、住宿和资金，材料不足可能导致入境受阻。",
    decision: "签证费为零，但务必把返程票、每晚住宿和现金或资金证明放在随身行李里。",
    cost: {
      summary: "签证费 ¥0",
      items: [
        { label: "90 天短期免签", amount: "免费", detail: "无需在出发前办理贴纸或电子旅游签证。" },
        { label: "入境材料", amount: "自行准备", detail: "机票、酒店、旅行资金属于行程成本，不是政府签证费。" },
        { label: "申根转机", amount: "视路线而定", detail: "不持申根签证时要单独核对机场过境条件。" },
      ],
      note: "不要向第三方购买所谓“摩洛哥免签许可”。如果经申根区转机，过境规则和摩洛哥免签是两件事。",
    },
    steps: [
      { title: "先确认转机路线", detail: "尤其是不持申根签证时，避免需要入境申根或更换机场、航站楼、重新托运行李的组合。" },
      { title: "把入境材料放在随身行李", detail: "护照、返程票、酒店订单、现金或资金证明和旅行计划应能立即出示。" },
      { title: "入境后记清 90 天期限", detail: "短期访问必须在获准期限内离境，长期居留要另办当地居留手续。" },
    ],
    materials: [
      { title: "有效期 6 个月以上的护照", detail: "中国驻摩使馆明确提醒短期旅客准备。", kind: "必备" },
      { title: "返程或后续机票", detail: "证明会在 90 天内离开摩洛哥。", kind: "必备" },
      { title: "酒店订单或居住证明", detail: "覆盖停留期间；住亲友家时准备地址和接待人信息。", kind: "必备" },
      { title: "足量现金或资金证明", detail: "能支持在摩期间住宿、交通和生活。", kind: "必备" },
      { title: "旅行计划或旅行社订单", detail: "用于说明旅游目的和城市安排。", kind: "建议" },
      { title: "邀请与关系材料", detail: "商务、学术交流或探亲时按目的准备。", kind: "按情况" },
      { title: "过境所需签证", detail: "经申根区等第三地转机时，按具体机场和联程条件核对。", kind: "按情况" },
    ],
    notes: ["免签不等于“只带护照就一定能进”，摩洛哥边检近年会实际检查来访目的。", "不要超期停留；长期工作或居留不属于 90 天免签旅游路径。"],
    verifiedAt,
    sources: [{ title: "关于来摩出入境问题的领事提醒", authority: "中国驻摩洛哥大使馆", url: "https://ma.china-embassy.gov.cn/lsfw/lsbh/aqtxlstx/202403/t20240322_11266442.htm" }],
  },
  za: {
    code: "za",
    status: "可申请 ETA",
    statusTone: "electronic",
    stay: "以获批 ETA 条件为准",
    method: "南非内政部官网在线申请",
    leadTime: "出发前完成；官方称可即时出结果",
    overview:
      "符合试点条件的中国普通护照成年旅客，可在南非内政部 ETA 平台在线申请旅游或访客授权。当前要求从约翰内斯堡 OR Tambo、开普敦或 Lanseria 三个指定机场入境。",
    decision: "只有年满 18 岁、普通护照有效期满足要求并从指定机场入境，才直接走 ETA；其他情况改查标准签证。",
    cost: {
      summary: "以官方结算页为准",
      items: [
        { label: "ETA 申请费", amount: "注册后显示", detail: "官方公开首页只说明需支付相关申请费，没有展示统一金额。" },
        { label: "第三方代办费", amount: "非必需", detail: "符合条件可自行在南非内政部平台完成。" },
        { label: "标准签证路径", amount: "另行核价", detail: "不满足 ETA 年龄、护照或入境机场条件时适用。" },
      ],
      note: "这里不硬填一个未经公开页面确认的金额。进入官方平台看到结算金额后再付款，并核对域名必须为 eta.dha.gov.za。",
    },
    steps: [
      {
        title: "先做 ETA 条件检查",
        detail: "中国公民、年满 18 岁、持普通护照、护照不在 19 个月内到期，并从指定机场入境。",
        action: { label: "进入南非 ETA 官网", url: "https://eta.dha.gov.za/" },
      },
      { title: "用手机扫描护照并自拍", detail: "注册账户，完成护照扫描、旅行问答和实时人像采集。" },
      { title: "核对费用、付款并提交", detail: "只在官方结算页付款；获批后保存电子授权并按许可条件安排行程。" },
    ],
    materials: [
      { title: "中国普通护照", detail: "官方资格页要求护照在未来 19 个月内不失效。", kind: "必备" },
      { title: "可扫描护照的智能手机", detail: "申请过程需要拍摄护照并完成实时自拍。", kind: "必备" },
      { title: "实时人像照片", detail: "在申请过程中现场采集，不使用旧证件照代替。", kind: "必备" },
      { title: "指定机场行程", detail: "当前须从 OR Tambo、Cape Town International 或 Lanseria 入境。", kind: "必备" },
      { title: "住宿与访问计划", detail: "准备南非地址、日期、旅行目的和离境安排。", kind: "必备" },
      { title: "可在线支付的银行卡", detail: "最终金额以官方结算页显示为准。", kind: "必备" },
    ],
    notes: ["ETA 当前有年龄、护照剩余有效期和指定机场限制，不满足其中一项就不要强行提交。", "ETA 允许旅游或访客活动，不允许工作；最终入境仍由口岸决定。"],
    verifiedAt,
    sources: [
      { title: "南非 ETA 资格与申请流程", authority: "南非内政部", url: "https://eta.dha.gov.za/" },
      { title: "中国申请人注册条件", authority: "南非内政部", url: "https://eta.dha.gov.za/registration-warning" },
    ],
  },
  au: {
    code: "au",
    status: "需访客签证",
    statusTone: "visa-required",
    stay: "可获最多 12 个月；以获签信为准",
    method: "ImmiAccount 在线申请",
    leadTime: "至少提前数周，处理时间动态变化",
    overview:
      "中国普通护照自由行通常申请 Visitor visa（subclass 600）Tourist stream，并在境外等待决定。所有材料在线上传，获批后签证与护照电子关联。",
    decision: "普通自由行选 Tourist stream，不要误选团体 ADS 或 Frequent Traveller；提交前先把中文材料翻译好。",
    cost: {
      summary: "AUD 250 起",
      items: [
        { label: "600 Tourist stream 基础申请费", amount: "AUD 250 起", detail: "2026 年 7 月 1 日起境外旅游申请标准。" },
        { label: "银行卡附加费", amount: "支付页显示", detail: "在线付款可能按支付方式产生附加费。" },
        { label: "翻译、体检或生物信息", amount: "按实际发生", detail: "只有被要求时才支付相应第三方费用。" },
      ],
      note: "政府申请费通常不因拒签退回。10 年 Frequent Traveller stream 费用远高于普通 Tourist stream，不要因名字相似选错。",
    },
    steps: [
      {
        title: "建立 ImmiAccount 并选择 600 Tourist stream",
        detail: "申请地点选境外，如实填写旅行、工作、家庭、健康和出入境历史。",
        action: { label: "登录 ImmiAccount", url: "https://online.immi.gov.au/lusc/login" },
      },
      { title: "上传彩色文件与英文翻译", detail: "用清晰文件名分类上传护照、资金、行程、身份和回国约束力材料。" },
      { title: "查看账户通知并完成补充", detail: "如收到生物信息、体检或补件要求，按信中期限处理；最终以 Visa Grant Notice 为准。" },
    ],
    materials: [
      { title: "护照彩色扫描件", detail: "个人资料页、签证和出入境页；旧护照可补充旅行记录。", kind: "必备" },
      { title: "近期证件照", detail: "按在线系统的像素、背景和文件要求上传。", kind: "必备" },
      { title: "旅行计划与住宿", detail: "说明日期、城市、活动、同行人和预计开支。", kind: "必备" },
      { title: "资金与收入证明", detail: "银行流水、工资、纳税或经营文件说明资金来源和支付能力。", kind: "必备" },
      { title: "回国约束力材料", detail: "在职准假、在读、退休、家庭责任或经营情况按个人状态准备。", kind: "必备" },
      { title: "英文翻译", detail: "每份非英文材料附完整英文翻译及译者信息。", kind: "必备" },
      { title: "生物信息或体检结果", detail: "不是人人预先提交，只在 ImmiAccount 通知后办理。", kind: "按情况" },
    ],
    notes: ["签证可能附加 No Further Stay 等条件，收到获签信后逐条阅读。", "获批停留时间和入境次数由个案决定，不等同于申请时希望的时长。"],
    verifiedAt,
    sources: [
      { title: "Visitor visa subclass 600 与最新费用", authority: "澳大利亚内政部", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600" },
      { title: "中国申请人访澳说明", authority: "澳大利亚驻华大使馆", url: "https://china.embassy.gov.au/bjng/DIMA0301.html" },
    ],
  },
  nz: {
    code: "nz",
    status: "通常需访客签证",
    statusTone: "conditional",
    stay: "多次签每 12 个月累计 6 个月；单次签可至 9 个月",
    method: "Immigration Online；特定澳洲出发旅客可用 NZeTA",
    leadTime: "官方近期 80% 约 2 周，仍应提前申请",
    overview:
      "中国普通护照通常在线申请 New Zealand Visitor Visa。部分持合资格澳大利亚签证并从澳大利亚直飞的中国旅客，可按试行条件改用 NZeTA。两条路径的材料和费用不同，先判断再付款。",
    decision: "普通从中国出发走 Visitor Visa；只有满足澳签、澳洲出发和试行期限等全部条件，才改走 NZeTA。",
    cost: {
      summary: "Visitor Visa：NZD 441 起",
      items: [
        { label: "Visitor Visa 总费用", amount: "NZD 441 起", detail: "面向中国等其他国家旅客的当前起价，包含适用征费。" },
        { label: "NZeTA 手机应用", amount: "NZD 17 + IVL 100", detail: "仅限满足中国公民澳洲出发试行条件者。" },
        { label: "NZeTA 官方网站", amount: "NZD 23 + IVL 100", detail: "网站申请比官方手机应用多 NZD 6。" },
      ],
      note: "Visitor Visa 和 NZeTA 不是任选其一。先按护照、澳大利亚签证、出发地和日期判断资格，再使用对应官方入口。",
    },
    steps: [
      {
        title: "先判断 Visitor Visa 还是 NZeTA",
        detail: "从中国直接出发通常申请 Visitor Visa；从澳洲直飞且持合资格澳签时再检查中国公民 NZeTA 试行条件。",
        action: { label: "查看中国公民申请指南", url: "https://www.immigration.govt.nz/zh_CN/process-to-apply/applying-for-a-visa/providing-evidence-and-documents-to-support-your-visa-application/visitor-visa-application-guide-for-citizens-of-china/" },
      },
      { title: "在线建申请并上传证据", detail: "提交护照、照片、资金、离境计划、住宿和访问目的；按要求补英文翻译。" },
      {
        title: "获批后填写 Traveller Declaration",
        detail: "出发前完成 New Zealand Traveller Declaration，并随身保存电子签证或 NZeTA 结果。",
        action: { label: "查看 NZeTA 特殊条件", url: "https://www.immigration.govt.nz/visit/what-you-need-to-visit-new-zealand/nzeta-application-guide-for-citizens-of-china/" },
      },
    ],
    materials: [
      { title: "有效护照", detail: "计划申请 5 年多次签时，护照有效期需超过 5 年。", kind: "必备" },
      { title: "符合标准的近期照片", detail: "不得使用 AI 修改，也不能拍摄纸质照片或屏幕作为提交文件。", kind: "必备" },
      { title: "旅行与住宿计划", detail: "说明入离境日期、城市、住宿和访问目的。", kind: "必备" },
      { title: "资金或担保证明", detail: "证明可承担生活费和离境交通；有资助人时按官方担保要求提供。", kind: "必备" },
      { title: "离境安排", detail: "返程票，或有足够资金购买离境机票的证明。", kind: "必备" },
      { title: "工作、学业和家庭联系", detail: "说明真实访客目的和按期离境意图。", kind: "建议" },
      { title: "英文翻译", detail: "非英文材料按移民局要求提供准确完整翻译。", kind: "必备" },
      { title: "澳签与澳洲出发证明", detail: "只有选择中国公民 NZeTA 特殊路径时需要。", kind: "按情况" },
    ],
    notes: ["NZeTA 特殊安排要求从澳大利亚前往新西兰，不要把在澳洲转机自动等同于符合资格。", "新西兰移民局建议获批前不要预订不可退款的旅行。"],
    verifiedAt,
    sources: [
      { title: "中国公民 Visitor Visa 指南、费用与时效", authority: "新西兰移民局", url: "https://www.immigration.govt.nz/zh_CN/process-to-apply/applying-for-a-visa/providing-evidence-and-documents-to-support-your-visa-application/visitor-visa-application-guide-for-citizens-of-china/" },
      { title: "中国公民 NZeTA 条件与费用", authority: "新西兰移民局", url: "https://www.immigration.govt.nz/visit/what-you-need-to-visit-new-zealand/nzeta-application-guide-for-citizens-of-china/" },
    ],
  },
};

export function getVisaGuide(country: CountrySummary): VisaGuide {
  return visaGuides[country.code] ?? createBaselineVisaGuide(country);
}
