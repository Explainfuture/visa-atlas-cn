export const featuredCountries = [
  { code: "jp", slug: "japan", name: "日本", continent: "亚洲", city: "东京 · 京都 · 北海道", flag: "🇯🇵" },
  { code: "th", slug: "thailand", name: "泰国", continent: "亚洲", city: "曼谷 · 清迈 · 普吉", flag: "🇹🇭" },
  { code: "sg", slug: "singapore", name: "新加坡", continent: "亚洲", city: "新加坡", flag: "🇸🇬" },
  { code: "fr", slug: "france", name: "法国", continent: "欧洲", city: "巴黎 · 尼斯 · 里昂", flag: "🇫🇷" },
  { code: "gb", slug: "united-kingdom", name: "英国", continent: "欧洲", city: "伦敦 · 爱丁堡", flag: "🇬🇧" },
  { code: "us", slug: "united-states", name: "美国", continent: "北美洲", city: "纽约 · 洛杉矶", flag: "🇺🇸" },
  { code: "ca", slug: "canada", name: "加拿大", continent: "北美洲", city: "温哥华 · 多伦多", flag: "🇨🇦" },
  { code: "br", slug: "brazil", name: "巴西", continent: "南美洲", city: "里约 · 圣保罗", flag: "🇧🇷" },
  { code: "ma", slug: "morocco", name: "摩洛哥", continent: "非洲", city: "马拉喀什 · 卡萨布兰卡", flag: "🇲🇦" },
  { code: "za", slug: "south-africa", name: "南非", continent: "非洲", city: "开普敦 · 约翰内斯堡", flag: "🇿🇦" },
  { code: "au", slug: "australia", name: "澳大利亚", continent: "大洋洲", city: "悉尼 · 墨尔本", flag: "🇦🇺" },
  { code: "nz", slug: "new-zealand", name: "新西兰", continent: "大洋洲", city: "奥克兰 · 皇后镇", flag: "🇳🇿" },
] as const;

export const continents = [
  { index: "01", slug: "asia", name: "亚洲", englishName: "Asia", count: 49 },
  { index: "02", slug: "europe", name: "欧洲", englishName: "Europe", count: 44 },
  { index: "03", slug: "north-america", name: "北美洲", englishName: "North America", count: 23 },
  { index: "04", slug: "south-america", name: "南美洲", englishName: "South America", count: 12 },
  { index: "05", slug: "africa", name: "非洲", englishName: "Africa", count: 54 },
  { index: "06", slug: "oceania", name: "大洋洲", englishName: "Oceania", count: 14 },
  { index: "07", slug: "antarctica", name: "南极洲", englishName: "Antarctica", count: 0 },
] as const;
