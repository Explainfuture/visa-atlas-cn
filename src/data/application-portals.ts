import type { ConsularLocation } from "@/data/consular-locations";

export type ApplicationPortalKind =
  | "direct"
  | "official-form"
  | "appointment"
  | "arrival-form"
  | "agency-list"
  | "official-guide"
  | "permit";

export type ApplicationPortal = {
  kind: ApplicationPortalKind;
  title: string;
  actionLabel: string;
  url: string;
  authority: string;
  note: string;
  verifiedAt: string;
  isDirect: boolean;
};

type CuratedPortal = Omit<ApplicationPortal, "verifiedAt" | "isDirect"> & {
  isDirect?: boolean;
};

const verifiedAt = "2026-08-19";

const curatedPortals = {
  af: direct("阿富汗电子签证系统", "进入 eVisa 系统", "阿富汗外交部", "https://evisa.mfa.gov.af/"),
  ar: officialForm("阿根廷签证与 AVE 入口", "查看适用路径", "阿根廷国家移民局", "https://www.migraciones.gov.ar/ave/index.htm"),
  at: guide("奥地利签证官方说明", "查看递交说明", "奥地利联邦欧洲与国际事务部", "https://www.bmeia.gv.at/en/travel-stay/entrance-and-residence-in-austria/visa"),
  au: direct("ImmiAccount 在线申请", "登录 ImmiAccount", "澳大利亚内政部", "https://online.immi.gov.au/lusc/login"),
  be: officialForm("VisaOnWeb 在线申请表", "打开 VisaOnWeb", "比利时外交部", "https://visaonweb.diplomatie.be/"),
  bd: officialForm("孟加拉国在线签证申请", "填写在线申请表", "孟加拉国政府", "https://visa.gov.bd/"),
  bg: guide("保加利亚签证官方说明", "查看申请要求", "保加利亚外交部", "https://www.mfa.bg/en/services-travel/consular-services/travel-bulgaria/visa-bulgaria"),
  bh: direct("巴林电子签证系统", "进入 eVisa 系统", "巴林内政部", "https://www.evisa.gov.bh/"),
  bo: officialForm("玻利维亚在线签证表", "填写签证表", "玻利维亚外交部", "https://portalmre.rree.gob.bo/formvisas/"),
  bt: permit("不丹入境与许可系统", "查看签证与许可", "不丹移民局", "https://immi.gov.bt/"),
  bw: direct("博茨瓦纳电子签证系统", "开始在线申请", "博茨瓦纳政府", "https://evisa.gov.bw/"),
  ca: direct("IRCC 访客签证申请", "从 IRCC 开始申请", "加拿大移民、难民及公民部", "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/apply-visitor-visa.html"),
  cd: direct("刚果（金）电子签证系统", "创建 eVisa 申请", "刚果（金）移民总局", "https://evisa.gouv.cd/"),
  ch: guide("瑞士在华申根签证入口", "查看递交与预约", "瑞士联邦外交部", "https://www.eda.admin.ch/countries/china/en/home/visa/entry-ch/up-90-days/where-to-apply-schengen.html"),
  ci: direct("科特迪瓦电子签证入口", "查看 eVisa 申请", "科特迪瓦官方授权签证平台", "https://snedai.com/e-visa/"),
  cm: direct("喀麦隆电子签证系统", "进入 eVisa 系统", "喀麦隆国家安全总局", "https://www.evisacam.cm/"),
  co: officialForm("哥伦比亚在线签证申请", "填写在线申请", "哥伦比亚外交部", "https://tramitesmre.cancilleria.gov.co/tramites/enlinea/solicitarVisa.xhtml"),
  cu: direct("古巴电子签证系统", "申请 eVisa", "古巴外交部", "https://evisacuba.cu/en/inicio"),
  cz: guide("捷克驻华签证说明", "查看递交入口", "捷克外交部", "https://mzv.gov.cz/beijing/cz/konzularni_informace/viza_1/index.mobi"),
  de: guide("德国驻华签证与入境说明", "查看申请路径", "德国驻华使领馆", "https://china.diplo.de/cn-zh/service/visa-einreise"),
  dj: direct("吉布提电子签证系统", "进入 eVisa 系统", "吉布提政府", "https://www.evisa.gouv.dj/"),
  dk: officialForm("丹麦 ApplyVisa", "填写并支付申请", "丹麦外交部", "https://applyvisa.um.dk/NVP.App/"),
  ec: officialForm("厄瓜多尔数字领事系统", "进入数字领事服务", "厄瓜多尔外交部", "https://serviciosdigitales.cancilleria.gob.ec/"),
  ee: officialForm("爱沙尼亚签证申请表", "填写在线申请表", "爱沙尼亚外交部", "https://eelviisataotlus.vm.ee/"),
  eg: direct("埃及电子签证系统", "开始 eVisa 申请", "埃及政府", "https://visa2egypt.gov.eg/eVisa/"),
  es: appointment("西班牙 BLS 中国入口", "预约签证中心", "西班牙驻华领事机构指定服务商", "https://web.blscn.cn/"),
  et: direct("埃塞俄比亚电子签证系统", "开始 eVisa 申请", "埃塞俄比亚移民与公民服务局", "https://www.evisa.gov.et/"),
  fi: guide("芬兰在华签证递交说明", "查看预约与递交", "芬兰外交部", "https://finlandabroad.fi/web/chn/where-and-how-to-apply-for-a-visa-"),
  fr: officialForm("France-Visas 申请系统", "进入 France-Visas", "法国外交部", "https://france-visas.gouv.fr/en/"),
  ga: direct("加蓬电子签证系统", "进入 eVisa 系统", "加蓬移民总局", "https://evisa.dgdi.ga/"),
  gb: direct("英国访客签证申请", "从 GOV.UK 开始", "英国政府", "https://www.gov.uk/standard-visitor/apply-standard-visitor-visa"),
  gn: direct("几内亚电子签证入口", "在线申请签证", "几内亚边境航空警察局", "https://www.paf.gov.gn/visa"),
  gr: guide("希腊驻华签证说明", "查看签证入口", "希腊外交部", "https://www.mfa.gr/china/en/services/visas/"),
  gy: direct("圭亚那电子签证服务", "进入电子服务", "圭亚那移民支持服务", "https://eservices.iss.gov.gy/"),
  hr: guide("克罗地亚签证官方说明", "查看申请要求", "克罗地亚外交与欧洲事务部", "https://mvep.gov.hr/consular-information-246152/visas-246158/visa-application-246159/246159"),
  hu: guide("匈牙利驻华申根签证说明", "查看申请路径", "匈牙利驻华大使馆", "https://peking.mfa.gov.hu/en/schengen-visa-application"),
  id: direct("印度尼西亚电子签证系统", "进入 eVisa 系统", "印度尼西亚移民总局", "https://evisa.imigrasi.go.id/"),
  ie: officialForm("爱尔兰 AVATS 在线签证表", "填写 AVATS", "爱尔兰司法部", "https://www.visas.inis.gov.ie/AVATS/OnlineHome.aspx"),
  in: direct("印度电子签证系统", "进入官方 eVisa", "印度政府", "https://indianvisaonline.gov.in/evisa/tvoa.html"),
  iq: direct("伊拉克电子签证系统", "进入 eVisa 系统", "伊拉克内政部", "https://evisa.iq/"),
  is: guide("冰岛签证官方说明", "查看在华递交路径", "冰岛政府", "https://island.is/en/get-a-visa"),
  it: guide("Visa for Italy 指引", "生成材料与表格", "意大利外交与国际合作部", "https://vistoperitalia.esteri.it/home/en"),
  jo: direct("约旦内政部电子服务", "进入签证服务", "约旦内政部", "https://eservices.moi.gov.jo/MOI_EVISA/"),
  jp: agency("日本指定旅行社名单", "按领区找指定旅行社", "日本国驻华大使馆及各总领事馆", "https://www.cn.emb-japan.go.jp/itpr_zh/visa_dantai_daili.html"),
  ke: direct("肯尼亚电子旅行授权", "申请 Kenya eTA", "肯尼亚移民服务局", "https://evisa.go.ke/apply/start"),
  kg: direct("吉尔吉斯斯坦电子签证", "进入 eVisa 系统", "吉尔吉斯斯坦外交部", "https://www.evisa.e-gov.kg/"),
  kh: {
    kind: "arrival-form",
    title: "柬埔寨电子入境卡",
    actionLabel: "免费提交 e-Arrival",
    authority: "柬埔寨移民总局",
    url: "https://arrival.gov.kh/e-arrival/home",
    note: "2026 年 6 月 15 日至 10 月 15 日，中国普通护照游客停留不超过 14 天免签，但仍须在抵达前 7 天内免费提交 e-Arrival。",
    isDirect: true,
  },
  kr: guide("韩国签证门户", "查询签证与表格", "大韩民国法务部", "https://www.visa.go.kr/"),
  kw: direct("科威特电子签证系统", "进入 eVisa 系统", "科威特内政部", "https://evisa.moi.gov.kw/evisa/home_e.do"),
  la: direct("老挝电子签证系统", "申请 Lao eVisa", "老挝外交部", "https://laoevisa.gov.la/"),
  lk: {
    kind: "direct",
    title: "斯里兰卡 ETA 系统",
    actionLabel: "免费提交 ETA 申请",
    authority: "斯里兰卡移民与出入境管理局",
    url: "https://eta.gov.lk/slvisa/",
    note: "中国普通护照仍需取得 ETA；2026 年 5 月 25 日至 11 月 24 日，30 天标准旅游 ETA 的政府费用为免费。",
    isDirect: true,
  },
  lt: officialForm("立陶宛签证申请表", "填写在线申请表", "立陶宛内政部", "https://visa.vrm.lt/epm/"),
  lu: guide("卢森堡短期签证说明", "查看申请程序", "卢森堡政府", "https://guichet.public.lu/en/citoyens/immigration/moins-3-mois/ressortissant-tiers/entree-visa.html"),
  lv: officialForm("拉脱维亚签证申请表", "填写在线申请表", "拉脱维亚内政部门", "https://epak.pmlp.gov.lv/NVIS.EService001.WebSite/ApplicationMain.aspx"),
  ly: direct("利比亚电子签证系统", "进入 eVisa 系统", "利比亚政府", "https://evisa.gov.ly/"),
  mn: direct("蒙古国电子签证系统", "申请 eVisa", "蒙古国外交部", "https://evisa.mn/"),
  mm: direct("缅甸电子签证系统", "申请 eVisa", "缅甸移民与人口部", "https://evisa.moip.gov.mm/"),
  mt: guide("马耳他中央签证处", "查看申请路径", "马耳他身份局", "https://identita.gov.mt/central-visa-unit-main-page/"),
  mw: direct("马拉维电子签证系统", "申请 eVisa", "马拉维移民与公民服务部", "https://www.evisa.gov.mw/"),
  my: arrival("马来西亚电子入境卡", "免费填写 MDAC", "马来西亚移民局", "https://imigresen-online.imi.gov.my/mdac/main"),
  na: direct("纳米比亚电子签证服务", "进入电子服务", "纳米比亚内政、移民、安全与安保部", "https://eservices.mhaiss.gov.na/"),
  ng: direct("尼日利亚电子签证系统", "开始签证申请", "尼日利亚移民局", "https://evisa.immigration.gov.ng/"),
  nl: guide("荷兰在华申根签证入口", "查看申请与预约", "荷兰政府", "https://www.netherlandsworldwide.nl/visa-the-netherlands/schengen-visa/apply-china"),
  no: officialForm("挪威 UDI 申请系统", "进入在线申请", "挪威移民局", "https://selfservice.udi.no/"),
  np: officialForm("尼泊尔入境前在线表", "填写在线申请", "尼泊尔移民局", "https://nepaliport.immigration.gov.np/online"),
  nz: direct("新西兰访客签证申请", "从移民局开始申请", "新西兰移民局", "https://www.immigration.govt.nz/visas/visitor-visa/"),
  om: direct("阿曼电子签证系统", "进入 eVisa 系统", "阿曼皇家警察", "https://evisa.rop.gov.om/"),
  pg: direct("巴布亚新几内亚电子签证", "开始 eVisa 申请", "巴布亚新几内亚移民与公民管理局", "https://evisa.ica.gov.pg/evisa/account/Apply"),
  pk: direct("巴基斯坦在线签证系统", "开始在线申请", "巴基斯坦国家数据库和注册局", "https://visa.nadra.gov.pk/"),
  pl: appointment("波兰 e-Konsulat", "填写表格并预约", "波兰外交部", "https://secure.e-konsulat.gov.pl/"),
  pt: officialForm("葡萄牙在线签证申请", "填写在线申请", "葡萄牙外交部", "https://pedidodevistos.mne.gov.pt/VistosOnline/"),
  ro: officialForm("罗马尼亚 E-VIZA", "填写在线申请", "罗马尼亚外交部", "https://eviza.mae.ro/"),
  ru: direct("俄罗斯统一电子签证", "申请统一 eVisa", "俄罗斯外交部", "https://electronic-visa.kdmid.ru/"),
  rw: direct("卢旺达 Irembo 签证服务", "进入签证服务", "卢旺达政府", "https://irembo.gov.rw/home/citizen/all_services"),
  sa: direct("沙特 KSA Visa", "查看并申请签证", "沙特阿拉伯外交部", "https://ksavisa.sa/"),
  se: guide("瑞典短期访问签证说明", "查看申请路径", "瑞典移民局", "https://www.migrationsverket.se/en/you-want-to-apply/visiting-sweden/visiting-sweden-for-up-to-90-days-entry-visa.html"),
  sg: arrival("新加坡电子入境卡", "免费提交 SGAC", "新加坡移民与关卡局", "https://eservices.ica.gov.sg/sgarrivalcard/"),
  si: guide("斯洛文尼亚驻华领事信息", "查看签证申请", "斯洛文尼亚政府", "https://www.gov.si/en/representations/embassy-beijing/consular-information/"),
  sk: guide("斯洛伐克驻华签证说明", "查看申请路径", "斯洛伐克外交部", "https://www.mzv.sk/en/web/peking-en/services/visa_and_services"),
  so: direct("索马里电子签证系统", "申请 eVisa", "索马里移民与公民局", "https://evisa.gov.so/"),
  sr: direct("苏里南电子签证入口", "开始 eVisa 申请", "苏里南官方签证服务平台", "https://suriname.vfsevisa.com/"),
  ss: direct("南苏丹电子签证系统", "申请 eVisa", "南苏丹内政部", "https://www.evisa.gov.ss/"),
  th: arrival("泰国电子入境卡", "免费填写 TDAC", "泰国移民局", "https://tdac.immigration.go.th/arrival-card/#/home"),
  tj: direct("塔吉克斯坦电子签证", "进入 eVisa 系统", "塔吉克斯坦外交部", "https://www.evisa.tj/"),
  tr: direct("土耳其电子签证系统", "核验资格并申请", "土耳其外交部", "https://www.evisa.gov.tr/en/"),
  tz: direct("坦桑尼亚电子签证", "开始在线申请", "坦桑尼亚移民局", "https://visa.immigration.go.tz/"),
  ug: direct("乌干达电子签证系统", "开始在线申请", "乌干达移民局", "https://www.visas.immigration.go.ug/"),
  us: direct("DS-160 非移民签证表", "进入 CEAC 填表", "美国国务院", "https://ceac.state.gov/genniv/"),
  uz: direct("乌兹别克斯坦电子签证", "进入 eVisa 系统", "乌兹别克斯坦政府", "https://e-visa.gov.uz/main"),
  vn: direct("越南电子签证系统", "申请电子签证", "越南公安部出入境管理局", "https://evisa.gov.vn/"),
  za: direct("南非 ETA 申请系统", "进入 ETA 系统", "南非内政部", "https://eta.dha.gov.za/"),
  zm: direct("赞比亚移民电子服务", "开始签证申请", "赞比亚移民局", "https://eservices.zambiaimmigration.gov.zm/#/home"),
  zw: direct("津巴布韦电子签证", "申请 eVisa", "津巴布韦移民局", "https://www.evisa.gov.zw/"),
} as const satisfies Record<string, CuratedPortal>;

const portalAliases: Readonly<Record<string, keyof typeof curatedPortals>> = {
  ax: "fi",
  bl: "fr",
  cc: "au",
  cx: "au",
  fo: "dk",
  gf: "fr",
  gg: "gb",
  gl: "dk",
  gp: "fr",
  gu: "us",
  im: "gb",
  je: "gb",
  li: "ch",
  mf: "fr",
  mq: "fr",
  nc: "fr",
  nf: "au",
  pf: "fr",
  pm: "fr",
  pr: "us",
  re: "fr",
  vi: "us",
  wf: "fr",
  yt: "fr",
};

export function getApplicationPortal(
  code: string,
  location: ConsularLocation,
  visaFree: boolean,
): ApplicationPortal {
  const normalizedCode = code.toLowerCase();
  const portalKey = portalAliases[normalizedCode] ?? normalizedCode;
  const curated = curatedPortals[portalKey as keyof typeof curatedPortals];

  if (curated) {
    return {
      ...curated,
      isDirect: curated.isDirect ?? curated.kind !== "official-guide",
      verifiedAt,
    };
  }

  const fallbackUrl = location.website ?? location.sourceUrl;

  if (visaFree) {
    return {
      kind: "official-guide",
      title: "免签旅行没有签证提交表",
      actionLabel: "核验官方入境规则",
      url: fallbackUrl,
      authority: location.website ? location.office : location.sourceAuthority,
      note: "无需为了‘办签证’向商业网站上传护照或付款；这里只提供官方规则核验入口。",
      verifiedAt,
      isDirect: false,
    };
  }

  return {
    kind: location.website ? "official-guide" : "appointment",
    title: location.website ? "从驻华机构官网开始" : "暂未确认统一在线提交系统",
    actionLabel: location.website ? "打开官方签证入口" : "查看官方机构联系方式",
    url: fallbackUrl,
    authority: location.website ? location.office : location.sourceAuthority,
    note: location.website
      ? "该目的地未确认面向中国普通护照的统一在线提交页；请从驻华机构官网选择签证类型、领区和受理方式。"
      : "不要把搜索广告当成申请入口。请先用官方机构名录确认受理单位，再按其书面要求递交。",
    verifiedAt,
    isDirect: false,
  };
}

export const applicationPortalMetadata = {
  verifiedAt,
  curatedCount: Object.keys(curatedPortals).length,
  aliasCount: Object.keys(portalAliases).length,
} as const;

function direct(title: string, actionLabel: string, authority: string, url: string): CuratedPortal {
  return { kind: "direct", title, actionLabel, authority, url, note: "可在该官方系统创建、提交或查询申请。付款前再次核对域名与签证类别。" };
}

function officialForm(title: string, actionLabel: string, authority: string, url: string): CuratedPortal {
  return { kind: "official-form", title, actionLabel, authority, url, note: "先在线填写或上传资料；是否仍需预约、交护照和录指纹，以该系统生成的下一步为准。" };
}

function appointment(title: string, actionLabel: string, authority: string, url: string): CuratedPortal {
  return { kind: "appointment", title, actionLabel, authority, url, note: "这是官方指定的预约或受理入口。按常住地选择领区和城市，不要从搜索广告进入仿冒页面。" };
}

function arrival(title: string, actionLabel: string, authority: string, url: string): CuratedPortal {
  return { kind: "arrival-form", title, actionLabel, authority, url, note: "它是入境申报而不是签证。按官方开放时间免费填写，不需要购买商业代填服务。" };
}

function agency(title: string, actionLabel: string, authority: string, url: string): CuratedPortal {
  return { kind: "agency-list", title, actionLabel, authority, url, note: "先在官方名单中核对旅行社公司全称，再到直营网点、淘宝或飞猪比较价格与服务。" };
}

function guide(title: string, actionLabel: string, authority: string, url: string): CuratedPortal {
  return { kind: "official-guide", title, actionLabel, authority, url, note: "该页面用于确认申请表、受理领区、预约或签证中心入口；它不一定直接接收在线提交。", isDirect: false };
}

function permit(title: string, actionLabel: string, authority: string, url: string): CuratedPortal {
  return { kind: "permit", title, actionLabel, authority, url, note: "先确认是否需要由当地担保人、旅行社或组织方代办许可，再准备材料和付款。" };
}
