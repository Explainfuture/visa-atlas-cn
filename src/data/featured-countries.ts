export const popularDestinations = [
  { code: "kr", name: "韩国", continent: "亚洲", city: "首尔 · 济州 · 釜山", signal: "暑期热搜", imageCaption: "首尔" },
  { code: "th", name: "泰国", continent: "亚洲", city: "曼谷 · 清迈 · 普吉", signal: "暑期热搜", imageCaption: "曼谷" },
  { code: "jp", name: "日本", continent: "亚洲", city: "东京 · 京都 · 北海道", signal: "暑期热搜", imageCaption: "京都市" },
  { code: "us", name: "美国", continent: "北美洲", city: "纽约 · 洛杉矶 · 旧金山", signal: "暑期热搜", imageCaption: "纽约" },
  { code: "fr", name: "法国", continent: "欧洲", city: "巴黎 · 尼斯 · 里昂", signal: "暑期热搜", imageCaption: "巴黎" },
  { code: "it", name: "意大利", continent: "欧洲", city: "罗马 · 米兰 · 佛罗伦萨", signal: "暑期热搜", imageCaption: "罗马" },
  { code: "nz", name: "新西兰", continent: "大洋洲", city: "奥克兰 · 皇后镇", signal: "暑期热搜", imageCaption: "皇后镇" },
  { code: "gb", name: "英国", continent: "欧洲", city: "伦敦 · 爱丁堡", signal: "暑期热搜", imageCaption: "伦敦" },
  { code: "my", name: "马来西亚", continent: "亚洲", city: "吉隆坡 · 槟城 · 沙巴", signal: "暑期热搜", imageCaption: "黑风洞站" },
  { code: "id", name: "印度尼西亚", continent: "亚洲", city: "巴厘岛 · 雅加达", signal: "暑期热搜", imageCaption: "乌布" },
  { code: "sg", name: "新加坡", continent: "亚洲", city: "滨海湾 · 圣淘沙", signal: "五一热门", imageCaption: "新加坡旅行风光" },
  { code: "au", name: "澳大利亚", continent: "大洋洲", city: "悉尼 · 墨尔本 · 黄金海岸", signal: "长线热门", imageCaption: "悉尼" },
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
