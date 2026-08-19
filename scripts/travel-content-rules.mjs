const harmfulEventPattern =
  /(?:恐怖|恐袭|恐怖襲擊|袭击|襲擊|爆炸|枪击|槍擊|屠杀|屠殺|战争|戰爭|战役|戰役|内战|內戰|示威|抗议|抗議|骚乱|騷亂|暴乱|暴亂|政变|政變|革命|军事行动|軍事行動|空袭|空襲|劫机|劫機|绑架|綁架|灾难|災難|事故|空难|空難|谋杀|謀殺|暗杀|暗殺|集中营|集中營|核试验|核試驗|\bterror(?:ism|ist)?\b|\battack(?:s|ed)?\b|\bbombing\b|\bshooting\b|\bmassacre\b|\bgenocide\b|\bbattle(?:field)?\b|\bwar\b|\bcivil war\b|\bprotests?\b|\bdemonstration\b|\briot\b|\buprising\b|\brevolution\b|\bcoup\b|\bmilitary operation\b|\bairstrike\b|\bhijacking\b|\bkidnapping\b|\bassassination\b)/i;

const nonDestinationEntityPattern =
  /(?:中央银行|中央銀行|广播电台|廣播電台|海军|海軍|陆军|陸軍|空军|空軍|军舰|軍艦|战舰|戰艦|驱逐舰|驅逐艦|前[^，。]{0,20}总统|前[^，。]{0,20}總統|法院.*司法机构|法院.*司法機構|摄影展|攝影展|成人度假村|古卷|\bcentral bank\b|\bradio station\b|\bnavy\b|\barmy\b|\bair force\b|\bbattleship\b|\bdestroyer\b|\bwarship\b|\bmilitary settlement\b|\bformer [^,.]{0,30} president\b|\bhighest judicial authority\b|\bphotography exhibition\b|\badults-only resort\b|\bmanuscript\b|\bmotorcycle race\b|\bedition of the\b|\bsports tournament\b)/i;

const disambiguationPattern = /(?:维基媒体消歧义页|維基媒體消歧義頁|消歧义页面|消歧義頁面|Wikimedia disambiguation|disambiguation page)/i;
const malformedWikiNamePattern = /(?:\[\[|\]\]|\{\{|\}\}|#(?:See|Do|Go|Eat|Sleep|Buy)\b)/i;
const malformedExternalLinkPattern = /\[(?:https?:|\/\/)/i;
const commercialOrInstitutionNamePattern =
  /(?:酒店|度假村|购物中心|購物中心|体育场|體育場|军事博物馆|軍事博物館|装甲部队|裝甲部隊|\bhotel\b|\bresort\b|\bshopping mall\b|\bstadium\b|\best[aá]dio\b|\bmilitary museum\b)/i;
const genericSuggestionNames = new Set([
  "country",
  "world heritage",
  "world heritage site",
  "世界遗产",
  "世界遺產",
  "国家",
  "國家",
]);

export function getTravelSuggestionIssue({ description = "", name = "" }) {
  const normalizedName = name.trim().toLocaleLowerCase("en");
  const content = `${name} ${description}`;

  if (!normalizedName) return "名称为空";
  if (genericSuggestionNames.has(normalizedName)) return "名称过于笼统";
  if (malformedWikiNamePattern.test(name)) return "名称包含未清理的 Wiki 标记";
  if (malformedExternalLinkPattern.test(name)) return "名称包含未清理的外部链接";
  if (commercialOrInstitutionNamePattern.test(name)) return "商业设施或机构不作为代表性景点";
  if (disambiguationPattern.test(content)) return "来源是消歧义页面";
  if (harmfulEventPattern.test(content)) return "涉及负面事件而非旅行目的地";
  if (nonDestinationEntityPattern.test(content)) return "不是城市、景点或自然目的地";

  return null;
}
