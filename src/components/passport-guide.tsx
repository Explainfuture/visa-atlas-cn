import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarCheck,
  Camera,
  Clock3,
  FileCheck2,
  Fingerprint,
  IdCard,
  MapPin,
  Phone,
  PlaneTakeoff,
  ShieldAlert,
  WalletCards,
} from "lucide-react";
import { PassportLocationPicker } from "@/components/passport-location-picker";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  getPassportLocation,
  getPassportOffices,
  passportOfficeMetadata,
  passportRegions,
  type PassportOffice,
} from "@/data/passport-offices";

const NIA_PASSPORT_GUIDE =
  "https://s.nia.gov.cn/mps/bszy/gmcrg/slpthz/201903/t20190313_1011.html";
const NIA_OFFICE_DIRECTORY = "https://s.nia.gov.cn/mps/views/query/query-address.html";
const NIA_ONLINE_REPLACEMENT = "https://s.nia.gov.cn/mps/views/hbf/hbf-sqxz.html";
const NIA_HOME = "https://www.nia.gov.cn/";

function OfficeCard({ office }: { office: PassportOffice }) {
  return (
    <article className="passport-office-card">
      <div className="passport-office-topline">
        <span>{office.serviceMode}</span>
        {office.supportsPassport ? <strong>可核对护照业务</strong> : <strong>需电话确认</strong>}
      </div>
      <h3>{office.name}</h3>
      <p>
        <MapPin aria-hidden="true" size={19} />
        <span>{office.address}</span>
      </p>
      <p>
        <Phone aria-hidden="true" size={18} />
        <strong>{office.phone}</strong>
      </p>
      <p>
        <Clock3 aria-hidden="true" size={18} />
        <span>{office.workTime}</span>
      </p>
    </article>
  );
}

export function PassportGuide({ cityId }: { cityId?: string }) {
  const location = cityId ? getPassportLocation(cityId) : undefined;
  const officeResult = cityId ? getPassportOffices(cityId) : undefined;
  const offices = officeResult?.offices ?? [];
  const primaryOffices = offices.slice(0, 6);
  const extraOffices = offices.slice(6);
  const verifiedDate = new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${passportOfficeMetadata.verifiedAt}T00:00:00Z`));

  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <SiteHeader />

      <main className="passport-page" id="main-content">
        <nav className="passport-breadcrumb" aria-label="面包屑">
          <Link href="/">
            <ArrowLeft aria-hidden="true" size={16} />
            签证地图
          </Link>
          <span>/</span>
          <span>第一次办护照</span>
        </nav>

        <section className="passport-hero" aria-labelledby="passport-title">
          <div className="passport-hero-copy">
            <p className="section-kicker">新手小白 · 从零开始</p>
            <h1 id="passport-title">
              先办一本护照，
              <span>再谈世界有多远。</span>
            </h1>
            <p>
              护照是中国公民出国旅行时证明国籍和身份的证件。订国际机票、过边检、申请大多数签证，都会用到它。
            </p>
            <div className="passport-hero-actions">
              <a className="primary-button" href="#choose-city">
                查我所在城市
                <MapPin aria-hidden="true" size={18} />
              </a>
              <a className="text-button" href="#materials">
                先看材料
              </a>
            </div>
          </div>

          <div className="passport-book" aria-label="中华人民共和国普通护照示意图">
            <div className="passport-book-cover">
              <span>中华人民共和国</span>
              <strong>护照</strong>
              <div className="passport-emblem" aria-hidden="true">✦</div>
              <small>PASSPORT</small>
            </div>
            <div className="passport-book-page">
              <span>第一次办理</span>
              <strong>¥120</strong>
              <p>本人到场办理</p>
              <div>
                <span>户籍地一般</span>
                <b>7 个工作日</b>
              </div>
            </div>
          </div>
        </section>

        <section className="passport-basics" aria-labelledby="passport-basics-title">
          <div className="passport-section-heading">
            <p className="section-kicker">先弄懂这一本证件</p>
            <h2 id="passport-basics-title">护照到底有什么用？</h2>
          </div>
          <div className="passport-basic-grid">
            <article>
              <PlaneTakeoff aria-hidden="true" />
              <span>01</span>
              <h3>出国时证明“你是谁”</h3>
              <p>它是国际旅行证件，承载姓名、照片、国籍和证件号码，供航空公司与边检核验。</p>
            </article>
            <article>
              <BookOpen aria-hidden="true" />
              <span>02</span>
              <h3>签证通常办在它上面</h3>
              <p>贴纸签会贴进护照，电子签也会绑定护照号码。没有护照，很多签证无法开始申请。</p>
            </article>
            <article>
              <ShieldAlert aria-hidden="true" />
              <span>03</span>
              <h3>护照不等于签证</h3>
              <p><strong>有护照不代表能直接进入所有国家。</strong>还要按目的地规则确认免签、电子签或提前办签。</p>
            </article>
          </div>
          <p className="passport-region-note">
            前往中国香港、中国澳门或中国台湾，内地居民应按相应通行证和签注规则办理，<strong>不是使用普通护照替代这些证件</strong>。
          </p>
        </section>

        <section className="passport-city-section" id="choose-city" aria-labelledby="choose-city-title">
          <div className="passport-city-intro">
            <p className="section-kicker">全国办理地点</p>
            <h2 id="choose-city-title">你在哪座城市办理？</h2>
            <p>先选省份，再选城市。页面会从国家移民管理局办事机构目录中，生成可联系的出入境窗口。</p>
          </div>
          <PassportLocationPicker
            provinces={passportRegions}
            selectedCityId={location?.city.id}
            selectedProvinceId={location?.province.id}
          />

          <div className="passport-city-result" id="city-guide">
            {location ? (
              <>
                <div className="passport-city-result-heading">
                  <div>
                    <p className="section-kicker">你的城市攻略已生成</p>
                    <h2>{location.province.name} · {location.city.name}</h2>
                    <p>
                      首次申领应由本人前往公安机关出入境管理窗口。<strong>出发前先电话确认预约方式、护照首办业务和当天办公时间。</strong>
                    </p>
                  </div>
                  <div className="passport-location-count">
                    <strong>{offices.length || "—"}</strong>
                    <span>{offices.length ? "个可联系窗口" : "请查官方目录"}</span>
                  </div>
                </div>

                {officeResult?.scopeNeedsConfirmation ? (
                  <p className="passport-office-warning">
                    该城市的公开记录未明确写出“护照”业务，以下为当前启用的出入境窗口。<strong>请先拨打窗口电话或 12367 确认。</strong>
                  </p>
                ) : null}

                {primaryOffices.length ? (
                  <div className="passport-office-grid">
                    {primaryOffices.map((office) => <OfficeCard key={office.id} office={office} />)}
                  </div>
                ) : (
                  <div className="passport-office-empty">
                    <MapPin aria-hidden="true" size={28} />
                    <div>
                      <h3>这座城市暂未返回启用窗口</h3>
                      <p>请打开国家移民管理局办事机构目录重新查询，或拨打 12367 获取当地最新受理地点。</p>
                    </div>
                  </div>
                )}

                {extraOffices.length ? (
                  <details className="passport-extra-offices">
                    <summary>展开另外 {extraOffices.length} 个窗口</summary>
                    <div className="passport-office-grid">
                      {extraOffices.map((office) => <OfficeCard key={office.id} office={office} />)}
                    </div>
                  </details>
                ) : null}

                <a className="passport-official-directory" href={NIA_OFFICE_DIRECTORY} rel="noreferrer" target="_blank">
                  在国家移民管理局目录再次核对
                  <ArrowUpRight aria-hidden="true" size={18} />
                </a>
              </>
            ) : (
              <div className="passport-city-placeholder">
                <MapPin aria-hidden="true" size={30} />
                <div>
                  <h3>选择后，这里会直接出现办理地点</h3>
                  <p>覆盖 31 个省级行政区、{passportOfficeMetadata.cityCount} 个城市或区县选项。</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="passport-prep" id="materials" aria-labelledby="passport-materials-title">
          <div className="passport-materials">
            <p className="section-kicker">01 · 准备材料</p>
            <h2 id="passport-materials-title">普通成年人先带这三样</h2>
            <ul>
              <li>
                <IdCard aria-hidden="true" />
                <div><strong>居民身份证</strong><span>换领、补领期间可带临时居民身份证。</span></div>
              </li>
              <li>
                <FileCheck2 aria-hidden="true" />
                <div><strong>中国公民出入境证件申请表</strong><span>通常可在办证窗口领取或按当地预约流程填写。</span></div>
              </li>
              <li>
                <Camera aria-hidden="true" />
                <div><strong>符合要求的证件照片</strong><span>很多大厅可现场采集，仍应先向当地窗口确认。</span></div>
              </li>
            </ul>
          </div>

          <aside className="passport-special-materials">
            <p className="section-kicker">这些人要多准备</p>
            <div>
              <strong>未满 16 周岁</strong>
              <p>监护人陪同，并带监护证明和监护人身份证明；委托他人陪同还需委托书及陪同人身份证明。</p>
            </div>
            <div>
              <strong>登记备案的国家工作人员</strong>
              <p>还需单位或上级主管单位按人事管理权限出具同意办理意见。</p>
            </div>
            <div>
              <strong>现役军人</strong>
              <p>带本人身份证明及有审批权的军队系统主管部门出具的同意办理意见。</p>
            </div>
          </aside>
        </section>

        <section className="passport-steps" aria-labelledby="passport-steps-title">
          <div className="passport-section-heading">
            <p className="section-kicker">02 · 办理流程</p>
            <h2 id="passport-steps-title">从预约到拿证，只看这五步</h2>
          </div>
          <ol>
            <li><span>01</span><div><h3>找窗口</h3><p>在上方选择城市，确认首次申领是否需要预约。</p></div></li>
            <li><span>02</span><div><h3>本人到场</h3><p>带好材料，按现场指引取号、填表和拍照。</p></div></li>
            <li><span>03</span><div><h3>采集信息</h3><p>接受询问，并按规定采集指纹、照片和签名。</p></div></li>
            <li><span>04</span><div><h3>缴费 ¥120</h3><p>保存受理回执，核对姓名、领取方式和预计日期。</p></div></li>
            <li><span>05</span><div><h3>领取护照</h3><p>按回执选择到场领取或符合当地条件的寄递服务。</p></div></li>
          </ol>
        </section>

        <section className="passport-time-fee" aria-label="费用与时限">
          <div>
            <WalletCards aria-hidden="true" />
            <span>官方工本费</span>
            <strong>¥120 / 本</strong>
          </div>
          <div>
            <CalendarCheck aria-hidden="true" />
            <span>户籍地办理</span>
            <strong>一般 7 个工作日</strong>
          </div>
          <div>
            <Clock3 aria-hidden="true" />
            <span>跨省异地申请</span>
            <strong>签发时限 20 日</strong>
          </div>
        </section>

        <section className="passport-reminders" aria-labelledby="passport-reminders-title">
          <div>
            <Fingerprint aria-hidden="true" size={28} />
            <p className="section-kicker">提交前注意</p>
            <h2 id="passport-reminders-title">第一次办，别走错入口</h2>
          </div>
          <ul>
            <li><strong>首次申领需要本人到场。</strong>国家移民管理局的“全程网办”试点是换发、补发，不是给从未办过护照的人首办。</li>
            <li><strong>不要先找收费代办。</strong>普通护照由公安机关出入境管理机构受理，先用官方目录找窗口。</li>
            <li><strong>办好护照后再核对目的地签证。</strong>不同国家对有效期、空白页和签证方式有不同要求。</li>
          </ul>
        </section>

        <section className="passport-sources" aria-labelledby="passport-sources-title">
          <div>
            <p className="section-kicker">03 · # 信息来源</p>
            <h2 id="passport-sources-title">所有关键数字都能回到官方</h2>
            <p>办事机构可能搬迁或调整时间，出发前再打开目录确认一次。</p>
          </div>
          <div>
            <a href={NIA_PASSPORT_GUIDE} rel="noreferrer" target="_blank">
              <span># 办理规则</span><strong>普通护照签发服务指南</strong><small>国家移民管理局</small><ArrowUpRight aria-hidden="true" />
            </a>
            <a href={NIA_OFFICE_DIRECTORY} rel="noreferrer" target="_blank">
              <span># 办理地点</span><strong>全国办事机构查询</strong><small>国家移民管理局</small><ArrowUpRight aria-hidden="true" />
            </a>
            <a href={NIA_HOME} rel="noreferrer" target="_blank">
              <span># 收费标准</span><strong>普通护照 ¥120 / 本</strong><small>国家移民管理局</small><ArrowUpRight aria-hidden="true" />
            </a>
            <a href={NIA_ONLINE_REPLACEMENT} rel="noreferrer" target="_blank">
              <span># 入口区别</span><strong>网上换发补发申请须知</strong><small>国家移民管理局</small><ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </section>

        <p className="passport-data-note">
          办事机构数据核验于 {verifiedDate}。本页用于准备材料与定位窗口，具体受理要求以当地公安机关出入境管理部门为准。
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
