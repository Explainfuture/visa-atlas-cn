# 签证地图 · Visa Atlas CN

面向中国普通护照持有人的全球旅行签证知识库。可以从世界地图、七大洲目录或搜索入口选择目的地，查看签证结论、材料清单、申请步骤、费用账单、注意事项与信息来源。

> 当前数据快照：2026 年 8 月 18 日。签证与边检规则可能随时变化，付款或出发前请再次打开攻略中的官方入口核验。

## 当前进度

- 覆盖 7 大洲、251 个国家和地区，无“正在核验”占位页
- 每个目的地拥有独立的静态路由与完整攻略结构
- 日本、泰国、新加坡、法国、英国、美国、加拿大、巴西、摩洛哥、南非、澳大利亚、新西兰等常用目的地已加入更细的官方材料、费用和申请入口
- 支持世界地图点选、大洲目录、国家搜索与热门目的地快捷入口
- 响应式浅粉色界面，适配桌面端与移动端，并支持键盘导航

## 一份攻略包含什么

| 模块 | 内容 |
| --- | --- |
| 办理结论 | 是否免签、电子签、落地签或需要提前办理，以及可停留时间 |
| 准备材料 | 按“必备 / 按情况 / 建议”分类的可勾选清单，支持一键复制与重置 |
| 申请步骤 | 从确认资格到提交申请、录指纹和入境准备的顺序指引 |
| 费用账单 | 政府费用、签证中心服务费及可能发生的附加费用 |
| 注意事项 | 容易误解或导致拒签、退件、无法登机的关键条件 |
| 信息来源 | 官方规则、数据基线和临行核验入口，并标注核验日期 |

## 技术栈

- Next.js 16 App Router、React 19、TypeScript
- `react-svg-worldmap`：世界地图交互
- `countries-list`：国家和地区目录
- `flag-icons`：国家和地区旗帜
- `lucide-react`：界面图标
- Playwright CLI：桌面端与移动端浏览器回归测试

## 本地启动

环境要求：Node.js 20.9 或更高版本。

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
npm run lint
npx tsc --noEmit
npm run build
```

`verify:visa-data` 会检查 251 个目的地是否完整覆盖、国家代码是否重复，以及是否仍存在占位攻略。

## 数据结构与维护

```text
src/data/
├── world-countries.ts            # 国家、地区与大洲目录
├── visa-baseline.generated.ts    # 自动生成的 251 个目的地数据快照
├── baseline-visa-guide.ts        # 将数据快照转换成完整攻略结构
└── visa-guides.ts                # 高频目的地的人工增强内容与官方来源
```

更新签证数据基线：

```bash
npm run data:visa
npm run verify:visa-data
```

`visa-baseline.generated.ts` 来自 [Wikipedia：中国公民签证要求](https://en.wikipedia.org/wiki/Visa_requirements_for_Chinese_citizens) 的固定修订版本，由脚本生成，不应手工编辑。高频目的地的细节在 `visa-guides.ts` 中使用目的地移民局、外交部、使领馆等一手来源补充。

## 内容原则

1. 默认场景是中国普通护照持有人短期旅游，不把公务护照、永居身份或商务访问规则混在一起。
2. 优先引用目的地移民局、外交部、使领馆和官方签证申请平台。
3. Wikipedia 用于建立全球覆盖基线；社交平台只用于发现线索和常见问题，不作为政策结论的唯一依据。
4. 费用、开放资格、办理时效和材料要求都可能变化，攻略必须保留来源与核验日期。
5. 地图仅用于导航和主题可视化，不作为边界或外交立场依据。

## 免责声明

本项目用于旅行准备和信息整理，不提供法律、移民或领事意见，也不能替代使领馆、签证中心、航空公司或入境机关的最终答复。
