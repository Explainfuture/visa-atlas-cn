# 签证地图 · Visa Atlas CN

面向中国旅行者的出境准备知识库。没有护照的新手可以先按省份和城市查询首次申领材料与办理窗口；已有护照的旅行者可以从世界地图、七大洲目录或搜索入口选择目的地，查看签证结论、材料清单、申请步骤、费用账单、注意事项与信息来源。

**在线访问：[visa.explainsf.com](https://visa.explainsf.com)**

> 当前数据快照：2026 年 8 月 19 日。签证与边检规则可能随时变化，付款或出发前请再次打开攻略中的官方入口核验。

## 当前进度

- 覆盖 7 大洲、251 个目的地，无“正在核验”占位页
- 每个目的地拥有独立的静态路由与完整攻略结构
- 251 个目的地页面均先展示旅行介绍、代表性城市与景点，以及 2–3 张带作者、许可和文件页链接的高清图片
- 每个目的地的旅行内容之后都有“第一次办护照”快捷入口，再进入签证材料、申请与费用攻略
- 新增“第一次办护照”新手指南，解释护照用途、首次申领材料、费用、时限与现场办理流程
- 护照办理地点覆盖国家移民管理局目录中的 31 个省级行政区、458 个当前城市或区县选项、3948 个启用窗口
- 251 个目的地均有“在哪里办理”记录：178 个驻华机构、51 个属地主管机构联络点、3 个国内出入境渠道，以及 19 个明确标注的官方确认项
- 93 个目的地已整理政府申请系统、官方表格或指定受理入口，24 个属地复用所属国家入口；其余页面回退到驻华机构官网或中国外交部官方名录
- 材料清单按免签、电子授权、电子签、落地签、贴纸签和访问许可拆分，每项同时说明用途与参考来源
- 西班牙已按 4 个领区整理 15 个 BLS 受理城市；日本已按 7 个驻华领区提供官方指定旅行社名单入口，不再把北京使馆地址当作唯一递交地点
- 日本、泰国、新加坡、法国、英国、美国、加拿大、巴西、摩洛哥、南非、澳大利亚、新西兰等常用目的地已加入更细的官方材料、费用和申请入口
- 支持世界地图点选、大洲目录、国家搜索与热门目的地快捷入口
- 响应式浅粉色界面，适配桌面端与移动端，并支持键盘导航

## 一份攻略包含什么

| 模块 | 内容 |
| --- | --- |
| 旅行介绍 | 目的地概览、代表性城市与景点、高清图片及对应的开放许可来源 |
| 出发前办护照 | 解释护照用途与首次申领要点，并直达按省市查询办理窗口的新手攻略 |
| 办理结论 | 是否免签、电子签、落地签或需要提前办理，以及可停留时间 |
| 办理地点 | 实际递交方式、领区、可办城市、官方名单入口，以及已公开的地址、电话和邮箱；缺少常设机构时明确提示兼辖馆核验 |
| 准备材料 | 按“必备 / 按情况 / 建议”分类的可勾选清单；每项标注用途和官方参考入口，复制时一并带上来源 |
| 申请步骤 | 从确认资格到提交申请、录指纹和入境准备的顺序指引，并优先展示可执行的官方提交入口 |
| 费用账单 | 政府费用、签证中心服务费及可能发生的附加费用 |
| 注意事项 | 容易误解或导致拒签、退件、无法登机的关键条件 |
| 信息来源 | 官方规则、数据基线和临行核验入口，并标注核验日期 |

## 第一次办护照

访问 [/passport](https://visa.explainsf.com/passport) 可查看从零开始的普通护照攻略：

- 护照是什么、为什么需要，以及护照与签证、港澳台通行证的区别
- 普通成年人基础材料，以及未满 16 周岁、登记备案人员和现役军人的额外材料
- 首次申领本人到场、信息采集、缴纳 120 元工本费和领取证件的完整流程
- 户籍地一般 7 个工作日、跨省异地签发时限 20 日的官方口径
- 省份与城市两级选择器，生成当地公安机关出入境窗口的名称、地址、电话和办公时间

办事机构数据来自国家移民管理局的[全国办事机构查询](https://s.nia.gov.cn/mps/views/query/query-address.html)。首次申领不适用仅面向换发、补发的“全程网办”试点；窗口搬迁、预约要求和办公时间仍应在出发前电话确认。

## 技术栈

- Next.js 16 App Router、React 19、TypeScript
- `react-svg-worldmap`：世界地图交互
- `react-zoom-pan-pinch`：地图自由缩放与拖动
- `countries-list`：目的地目录
- `flag-icons`：目的地旗帜
- `lucide-react`：界面图标
- Wikimedia Commons：带作者与开放许可信息的旅行图片
- Wikivoyage 与 SightsMap：旅行介绍和代表性地点的开放数据基线
- Playwright CLI：桌面端与移动端浏览器回归测试

## 本地启动

环境要求：Node.js 20.18.1 或更高版本。

```bash
git clone https://github.com/Explainfuture/visa-atlas-cn.git
cd visa-atlas-cn
npm ci
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

如需运行生产版本：

```bash
npm run build
npm start
```

## 提交前检查

```bash
npm run verify:visa-data
npm run verify:application-portals
npm run verify:consular-data
npm run verify:passport-data
npm run verify:travel-data
npm run lint
npx tsc --noEmit
npm run build
```

`verify:visa-data` 会检查 251 个目的地是否完整覆盖、代码是否重复，以及是否仍存在占位攻略；`verify:application-portals` 会检查整理过的官方入口、属地别名、HTTPS 链接与页面接线，并确认未整理目的地仍有官方领事来源回退；`verify:consular-data` 会检查办理地点覆盖、必填来源、机构类型与中国香港、中国澳门、中国台湾的国内受理渠道；`verify:passport-data` 会检查 31 个省级行政区、城市代码、启用窗口和数据来源是否完整一致；`verify:travel-data` 会检查 251 个旅行页是否都有介绍、代表性地点、至少两张高清图片，以及图片作者、许可和 Commons 文件页链接。

## 数据结构与维护

```text
src/data/
├── world-countries.ts            # 目的地与大洲目录
├── consular-locations.generated.json # 251 个目的地的办理地点快照
├── consular-locations.ts         # 办理地点类型与查询接口
├── application-portals.ts        # 官方提交系统、表格、预约入口与领事回退
├── application-networks.ts       # 多领区、多城市的实际递交网络（当前含西班牙、日本）
├── passport-offices.generated.json # 全国护照办理窗口快照
├── passport-offices.ts           # 省市目录、窗口类型与查询接口
├── travel-destinations.generated.json # 251 个目的地的旅行介绍、地点与图片快照
├── travel-destinations.ts         # 旅行数据类型与查询接口
├── visa-baseline.generated.ts    # 自动生成的 251 个目的地数据快照
├── baseline-visa-guide.ts        # 将数据快照转换成完整攻略结构
└── visa-guides.ts                # 高频目的地的人工增强内容与官方来源
```

更新签证数据基线：

```bash
npm run data:visa
npm run verify:visa-data
```

更新驻华机构与办理地点数据：

```bash
npm run data:consular
npm run verify:consular-data
```

更新首次申领护照的省市与办理窗口数据：

```bash
npm run data:passport
npm run verify:passport-data
```

更新旅行介绍、代表性地点和开放许可图片：

```bash
npm run data:travel
npm run verify:travel-data
```

`visa-baseline.generated.ts` 来自 [Wikipedia：中国公民签证要求](https://en.wikipedia.org/wiki/Visa_requirements_for_Chinese_citizens) 的固定修订版本，由脚本生成，不应手工编辑。高频目的地的细节在 `visa-guides.ts` 中使用目的地移民局、外交部、使领馆等一手来源补充。

`consular-locations.generated.json` 由脚本读取中国外交部的[外国驻华使馆机构信息](https://www.mfa.gov.cn/web/lbfw_673061/wgzhslgjgxx/)生成，并保留[外国驻华领事机构名录](https://www.mfa.gov.cn/web/lbfw_673061/lsgmd_673079/index.shtml)作为领区复核入口。项目评估了开源的 [Database of Embassies](https://github.com/database-of-embassies/database-of-embassies) 作为字段结构参考，但该项目明确说明数据尚不完整，因此本站的地址与联系方式不以它作为最终依据。

`application-networks.ts` 用于解决“使领馆在哪里”和“旅游签证实际交到哪里”不是同一件事的问题。西班牙数据按驻华领事机构公布的 BLS 受理网络维护；日本数据按大使馆及各总领事馆公布的指定旅行社名单分领区维护。淘宝、飞猪、地图搜索和线下门店只用于查找与比价，商家是否有送签资格必须用营业执照公司全称与所属领区官方名单核对。

`application-portals.ts` 只收录政府申请系统、使领馆页面、官方指定签证中心或明确授权的服务平台，并区分“可直接提交”“先填官方表格”“预约递交”“入境申报”和“仅官方指引”。没有确认统一在线系统时，页面会诚实回退到驻华机构官网或中国外交部名录，不把搜索广告包装成申请入口。入口统一标注核验日期，并通过 `verify:application-portals` 做结构与覆盖检查。

`passport-offices.generated.json` 由脚本读取国家移民管理局公开的省市目录和各省办事机构数据生成，只展示当前启用记录，并优先排列业务范围明确包含普通护照或中国公民出入境证件的窗口。没有直接记录时，页面会回退到 12367 与官方办事机构目录，不推测或编造地址。

`travel-destinations.generated.json` 由脚本读取 [Wikivoyage](https://www.wikivoyage.org/) 的目的地介绍、[SightsMap-HeatmapExplorer](https://github.com/enceladus3/SightsMap-HeatmapExplorer) 的开放景点数据和 [Wikimedia Commons](https://commons.wikimedia.org/) 的图片元数据生成。页面逐张保留作者、许可和 Commons 文件页链接；图片许可可能不同，使用时应以对应文件页为准。

驻华机构地址用于联系与核验，**不代表该地址一定直接接收个人签证申请**。实际递交仍以目的地官方签证页、签证中心、指定代办机构或线上系统为准。

## 内容原则

1. 默认场景是中国普通护照持有人短期旅游，不把公务护照、永居身份或商务访问规则混在一起。
2. 优先引用目的地移民局、外交部、使领馆和官方签证申请平台。
3. Wikipedia 用于建立全球覆盖基线；社交平台只用于发现线索和常见问题，不作为政策结论的唯一依据。
4. 费用、开放资格、办理时效和材料要求都可能变化，攻略必须保留来源与核验日期。
5. 地图仅用于导航和主题可视化，不作为边界或外交立场依据。

## 免责声明

本项目用于旅行准备和信息整理，不提供法律、移民或领事意见，也不能替代使领馆、签证中心、航空公司或入境机关的最终答复。
