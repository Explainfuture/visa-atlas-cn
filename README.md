# 签证地图 · Visa Atlas CN

面向中国普通护照持有人的全球旅行签证知识库。通过世界地图或七大洲目录找到目的地，再查看签证状态、办理路径、材料提示和可追溯来源。

## 当前版本

- 可交互世界地图与七大洲目录
- 约 250 个国家和地区的独立路由与搜索
- 日本、泰国、新加坡、法国、英国、美国、加拿大、巴西、摩洛哥、南非、澳大利亚、新西兰 12 份首批攻略
- 每份已发布攻略标注核验日期、办理步骤和官方来源
- 尚未人工核验的目的地明确显示“正在核验”，不填充猜测性结论
- 响应式浅粉色界面，支持键盘焦点、跳转导航和移动端浏览

## 技术栈

- Next.js 16 App Router、React 19、TypeScript
- `react-svg-worldmap` 负责地图交互
- `countries-list` 负责国家和地区目录
- `flag-icons` 与 `lucide-react` 负责旗帜和界面图标
- Playwright CLI 用于桌面端与移动端回归测试

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。提交前可运行：

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## 内容原则

1. 优先使用目的地移民局、外交部、使领馆等一手来源。
2. 政策按中国普通护照、短期旅游场景编写，并标明核验日期。
3. 社交平台只用于发现线索和常见问题，不作为政策结论的唯一依据。
4. 签证政策可能随时调整，出发前仍应复核对应官方页面。

## 首批官方来源

- [日本外务省：中国公民签证信息](https://www.mofa.go.jp/j_info/visit/visa/topics/china.html)
- [泰国外交部：中泰互免签证协定](https://www.mfa.go.th/en/content/thcn280224-2)
- [新加坡移民与关卡局：中新互免签证安排](https://www.ica.gov.sg/news-and-publications/newsroom/media-release/mutual-30-day-visa-exemption-arrangement-between-singapore-and-the-people-s-republic-of-china)
- [France-Visas：中国申请入口](https://france-visas.gouv.fr/en/web/cn)
- [英国政府：Standard Visitor visa](https://www.gov.uk/standard-visitor)
- [美国国务院：Visitor Visa](https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html)
- [加拿大移民局：Visitor visa](https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/visitor-visa.html)
- [巴西驻华使馆：签证信息](https://www.gov.br/mre/pt-br/embaixada-pequim/consular-services/visa-visas)
- [中国驻摩洛哥使馆：赴摩旅行提醒](http://ma.china-embassy.gov.cn/chn/lsfw/lsxx/202406/t20240627_11442096.htm)
- [南非内政部：Electronic Travel Authorisation](https://www.dha.gov.za/index.php/eta)
- [澳大利亚内政部：Visitor visa](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600)
- [新西兰移民局：Visitor Visa](https://www.immigration.govt.nz/visas/visitor-visa/)

地图仅用于导航与主题可视化，不作为边界或外交立场依据。
