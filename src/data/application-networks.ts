export type ApplicationCenter = {
  city: string;
  address?: string;
  phone?: string;
  email?: string;
};

export type ApplicationGroup = {
  title: string;
  scope: string;
  cities: readonly string[];
  centers?: readonly ApplicationCenter[];
  sourceUrl: string;
  sourceLabel: string;
};

export type ApplicationNetwork = {
  badge: string;
  title: string;
  summary: string;
  steps: readonly string[];
  practicalAdvice: string;
  groups: readonly ApplicationGroup[];
  sourceAuthority: string;
  verifiedAt: string;
};

const verifiedAt = "2026-08-18";

const applicationNetworks = {
  es: {
    badge: "15 个 BLS 受理城市",
    title: "不只北京，按常住地选择最近的西班牙签证中心",
    summary:
      "西班牙在中国的短期申根签证由 BLS 签证申请中心接收。先按常住地确认领区，再预约该领区内离你最近的城市；使馆地址不是普通旅游签证的常规递交地址。",
    steps: [
      "确认西班牙是整段申根行程的唯一目的地或主目的地。",
      "按常住地选择北京、上海、广州或成都领区，不要为了号源跨领区盲约。",
      "只从西班牙领馆页面进入 BLS，核对城市、地址、服务费和预约时间后再前往。",
    ],
    practicalAdvice:
      "地图或搜索结果里的旧地址可能仍在流传。下面给出的详细地址来自西班牙领馆当前页面；未展开地址的城市，请在预约当天以 BLS 官方联系页显示为准。",
    sourceAuthority: "西班牙外交、欧盟与合作部驻华领事机构",
    verifiedAt,
    groups: [
      {
        title: "北京领区",
        scope: "华北、东北部分地区、西北部分地区及湖北",
        cities: ["北京", "济南", "沈阳", "西安", "武汉"],
        sourceLabel: "查看北京领区官方说明",
        sourceUrl:
          "https://www.exteriores.gob.es/Consulados/pekin/es/ServiciosConsulares/Paginas/index.aspx?scca=Visados&scco=China&scd=225&scs=Lugar+de+presentaci%C3%B3n+de+solicitudes+de+visado",
      },
      {
        title: "上海领区",
        scope: "上海、江苏、浙江、安徽、江西",
        cities: ["上海", "杭州", "南京"],
        centers: [
          {
            city: "上海",
            address: "上海市浦东新区张杨路588号 304—305室",
            phone: "021-50460128",
            email: "info.sha@blshelpline.com",
          },
          {
            city: "杭州",
            address: "杭州市拱墅区庆春路118号嘉德广场13层1307室",
            phone: "0571-56386207",
            email: "info.hgh@blshelpline.com",
          },
          {
            city: "南京",
            address: "南京市鼓楼区集庆门大街268号 E08-2栋1019室",
            phone: "025-85600066",
            email: "info.nkg@blshelpline.com",
          },
        ],
        sourceLabel: "查看上海领区官方地址",
        sourceUrl:
          "https://www.exteriores.gob.es/Consulados/shanghai/es/ServiciosConsulares/Paginas/index.aspx?scca=Visados&scco=China&scd=266&scs=Lugar+de+presentaci%C3%B3n+de+solicitudes+de+visado",
      },
      {
        title: "广州领区",
        scope: "广东、福建、湖南、海南、广西",
        cities: ["广州", "深圳", "福州", "长沙"],
        centers: [
          {
            city: "广州",
            address: "广州市天河区华强路3号富力盈力大厦北塔3A12",
            phone: "020-85208574",
            email: "info.can@blshelpline.com",
          },
        ],
        sourceLabel: "查看广州领区与 BLS 联系页",
        sourceUrl:
          "https://www.exteriores.gob.es/Consulados/canton/es/ServiciosConsulares/Paginas/index.aspx?scca=Visados&scco=China&scd=43&scs=Lugar+de+presentaci%C3%B3n+de+solicitudes+de+visado",
      },
      {
        title: "成都领区",
        scope: "四川、重庆、云南、贵州",
        cities: ["成都", "重庆", "昆明"],
        centers: [
          {
            city: "成都",
            address: "成都市高新区天府大道中段530号东方希望天祥广场A座20层2008室",
            phone: "+86 4000626999",
            email: "info.chd@blshelpline.com",
          },
          {
            city: "重庆",
            address: "重庆市渝中区邹容路131号世贸大厦1809室",
            phone: "023-60845997",
            email: "info.ckg@blshelpline.com",
          },
          {
            city: "昆明",
            address: "昆明市官渡区春城路219号东航投资大厦406B室",
            phone: "0871-68137423",
            email: "info.kmg@blshelpline.com",
          },
        ],
        sourceLabel: "查看成都领区官方地址",
        sourceUrl:
          "https://www.exteriores.gob.es/Consulados/Chengdu/es/Consulado/Paginas/Horario%2C-localizaci%C3%B3n-y-contacto.aspx",
      },
    ],
  },
  jp: {
    badge: "7 个驻华领区入口",
    title: "先按居住地找领区，再从官方名单挑指定旅行社",
    summary:
      "日本个人旅游签证不能由申请人直接递交使领馆。真正的入口不是北京使馆地址，而是你常住地所属使领馆公布的指定旅行社名单；不少省会和地级市都有可联系门店。",
    steps: [
      "按实际常住地而不是户籍地找到对应领区；异地居住可能需要居住证。",
      "打开该领区的官方指定旅行社名单，选择同省或附近城市的机构。",
      "拿公司全称、送签领区、材料清单和含税总价，至少向两家询价后再付款。",
    ],
    practicalAdvice:
      "可以在淘宝、飞猪或地图平台搜索，也可以去线下旅行社，但搜索排名和‘旗舰店’不等于有送签资格。先让商家给出营业执照公司全称，再与官方名单逐字核对；同时问清机酒是否必须由其预订、代办费包含什么、撤签或拒签退哪些费用。",
    sourceAuthority: "日本国驻华大使馆及各总领事馆",
    verifiedAt,
    groups: [
      {
        title: "日本驻华大使馆领区",
        scope: "北京、天津、陕西、山西、甘肃、河南、河北、湖北、湖南、青海、新疆、宁夏、西藏、内蒙古",
        cities: ["北京", "天津", "西安", "石家庄", "郑州", "武汉", "长沙", "兰州", "乌鲁木齐", "太原", "呼和浩特"],
        sourceLabel: "打开大使馆指定旅行社名单",
        sourceUrl: "https://www.cn.emb-japan.go.jp/itpr_zh/visa_dantai_daili.html",
      },
      {
        title: "上海总领事馆领区",
        scope: "上海、江苏、浙江、安徽、江西",
        cities: ["上海", "南京", "苏州", "无锡", "杭州", "宁波", "温州", "合肥", "南昌"],
        sourceLabel: "打开上海领区最新名单",
        sourceUrl: "https://www.shanghai.cn.emb-japan.go.jp/itpr_ja/11_000001_01947.html",
      },
      {
        title: "广州总领事馆领区",
        scope: "广东、海南、福建、广西",
        cities: ["广州", "深圳", "福州", "厦门", "南宁", "海口"],
        sourceLabel: "打开广州领区指定旅行社入口",
        sourceUrl: "https://www.guangzhou.cn.emb-japan.go.jp/itpr_zh/visa.html",
      },
      {
        title: "重庆总领事馆领区",
        scope: "重庆、四川、云南、贵州",
        cities: ["重庆", "成都", "昆明", "贵阳"],
        sourceLabel: "打开重庆领区签证入口",
        sourceUrl: "https://www.chongqing.cn.emb-japan.go.jp/itpr_zh/qianzhengshouye.html",
      },
      {
        title: "沈阳总领事馆领区",
        scope: "辽宁（大连除外）、吉林、黑龙江",
        cities: ["沈阳", "长春", "哈尔滨"],
        sourceLabel: "打开 2026 年指定旅行社名单",
        sourceUrl: "https://www.shenyang.cn.emb-japan.go.jp/files/100970949.pdf",
      },
      {
        title: "大连领事办公室",
        scope: "大连市",
        cities: ["大连"],
        sourceLabel: "打开大连签证申请向导",
        sourceUrl: "https://www.dalian.cn.emb-japan.go.jp/itpr_zh/visamadoguchi.html",
      },
      {
        title: "青岛总领事馆领区",
        scope: "山东省",
        cities: ["济南", "青岛", "烟台"],
        sourceLabel: "打开山东指定旅行社名单",
        sourceUrl: "https://www.qingdao.cn.emb-japan.go.jp/itpr_ja/00_000041.html",
      },
    ],
  },
} as const satisfies Record<string, ApplicationNetwork>;

export function getApplicationNetwork(code: string) {
  return applicationNetworks[code.toLowerCase() as keyof typeof applicationNetworks];
}
