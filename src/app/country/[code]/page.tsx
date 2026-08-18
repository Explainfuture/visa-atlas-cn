import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  Route,
  ShieldAlert,
  WalletCards,
} from "lucide-react";
import { PreparationChecklist } from "@/components/preparation-checklist";
import { SchengenVisaTooltip } from "@/components/schengen-visa-tooltip";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getApplicationNetwork, type ApplicationNetwork } from "@/data/application-networks";
import { getApplicationPortal } from "@/data/application-portals";
import { consularKindLabels, getConsularLocation } from "@/data/consular-locations";
import { getCountry, worldCountries } from "@/data/world-countries";
import { getVisaGuide } from "@/data/visa-guides";

const importantTextPattern =
  /((?:不要|必须|务必|只有|只按|临行前|不是|不等于|不替代|不代表|不退|无需|拒签[^；。！]*不退)[^；。！]*)/g;
const importantTextCheck = /(?:不要|必须|务必|只有|只按|临行前|不是|不等于|不替代|不代表|不退|无需|拒签)/;

function ImportantText({ text }: { text: string }) {
  return (
    <>
      {text.split(importantTextPattern).map((part, index) =>
        importantTextCheck.test(part) ? <strong key={`${part}-${index}`}>{part}</strong> : part,
      )}
    </>
  );
}

function ApplicationNetworkCard({ network }: { network: ApplicationNetwork }) {
  return (
    <article className="application-network">
      <span className="consular-kind">{network.badge}</span>
      <div className="consular-office">
        <MapPinned aria-hidden="true" size={24} />
        <h3>{network.title}</h3>
      </div>
      <p className="application-network-summary">{network.summary}</p>

      <ol className="application-network-steps" aria-label="选择递交地点的步骤">
        {network.steps.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>

      <div className="application-network-advice">
        <strong>怎么找才不踩广告</strong>
        <p>{network.practicalAdvice}</p>
      </div>

      <div className="application-group-list">
        {network.groups.map((group) => (
          <section className="application-group" key={group.title}>
            <div className="application-group-heading">
              <div>
                <h4>{group.title}</h4>
                <p>{group.scope}</p>
              </div>
              <a href={group.sourceUrl} rel="noreferrer" target="_blank">
                {group.sourceLabel}
                <ArrowUpRight aria-hidden="true" size={16} />
              </a>
            </div>

            <div className="application-city-list" aria-label={`${group.title}可联系城市`}>
              {group.cities.map((city) => (
                <span key={city}>{city}</span>
              ))}
            </div>

            {group.centers?.length ? (
              <div className="application-center-list">
                {group.centers.map((center) => (
                  <article key={`${group.title}-${center.city}`}>
                    <h5>
                      <MapPin aria-hidden="true" size={17} />
                      {center.city}受理点
                    </h5>
                    {center.address ? <p>{center.address}</p> : null}
                    <div>
                      {center.phone ? <a href={`tel:${center.phone}`}>{center.phone}</a> : null}
                      {center.email ? <a href={`mailto:${center.email}`}>{center.email}</a> : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>

      <small>来源：{network.sourceAuthority} · 核验于 {network.verifiedAt}</small>
    </article>
  );
}

export function generateStaticParams() {
  return worldCountries.map((country) => ({ code: country.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const country = getCountry(code);

  if (!country) return {};

  const guide = getVisaGuide(country);
  const description = `${country.name}旅游签证攻略：中国普通护照${guide.status}，预计${guide.cost.summary}。含材料清单、申请步骤、费用与官方来源。`;

  return {
    title: `${country.name}签证材料、申请与费用`,
    description,
    openGraph: { title: `${country.name}签证办理手册｜签证地图`, description, images: [] },
    twitter: { title: `${country.name}签证办理手册｜签证地图`, description, images: [] },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const country = getCountry(code);

  if (!country) notFound();

  const guide = getVisaGuide(country);
  const consularLocation = getConsularLocation(country.code);
  const applicationNetwork = getApplicationNetwork(country.code);
  const applicationPortal = getApplicationPortal(
    country.code,
    consularLocation,
    guide.statusTone === "visa-free",
  );
  const sourceEntries = guide.sources.some((source) => source.url === applicationPortal.url)
    ? guide.sources
    : [
        {
          title: applicationPortal.title,
          authority: applicationPortal.authority,
          url: applicationPortal.url,
          tag: applicationPortal.isDirect ? "申请入口" : "官方指引",
        },
        ...guide.sources,
      ];
  const verifiedDate = new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${guide.verifiedAt}T00:00:00Z`));

  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <SiteHeader />
      <main id="main-content" className="guide-page">
        <nav className="guide-breadcrumb" aria-label="面包屑">
          <Link href={`/continents/${country.continentSlug}`}>
            <ArrowLeft aria-hidden="true" size={16} />
            {country.continentName}
          </Link>
          <span>/</span>
          <span>{country.name}</span>
        </nav>

        <section className="guide-hero">
          <div>
            <p className="section-kicker">
              <MapPin aria-hidden="true" size={17} />
              {country.continentName} · {country.englishName}
            </p>
            <div className="guide-title-row">
              <span className={`guide-flag fi fi-${country.code}`} aria-hidden="true" />
              <h1>{country.name}</h1>
            </div>
            <p className="guide-overview">{guide.overview}</p>
          </div>

          <aside className="guide-status-card" aria-label="办理结论">
            {guide.status.includes("申根") ? (
              <SchengenVisaTooltip
                className={`visa-chip large ${guide.statusTone}`}
                label={guide.status}
              />
            ) : (
              <span className={`visa-chip large ${guide.statusTone}`}>{guide.status}</span>
            )}
            <strong>{guide.decision}</strong>
            <span className="guide-status-cost">
              <WalletCards aria-hidden="true" size={18} />
              {guide.cost.summary}
            </span>
            <span>
              <CalendarCheck aria-hidden="true" size={16} />
              核验于 {verifiedDate}
            </span>
          </aside>
        </section>

        <section className="guide-facts" aria-label="办理概览">
          <div>
            <Clock3 aria-hidden="true" />
            <span>什么时候开始</span>
            <strong>{guide.leadTime}</strong>
          </div>
          <div>
            <FileCheck2 aria-hidden="true" />
            <span>在哪里办理</span>
            <strong>{guide.method}</strong>
          </div>
          <div>
            <WalletCards aria-hidden="true" />
            <span>预计政府与必要费用</span>
            <strong>{guide.cost.summary}</strong>
          </div>
          <div>
            <CalendarCheck aria-hidden="true" />
            <span>可以停留多久</span>
            <strong>{guide.stay}</strong>
          </div>
        </section>

        <nav className="guide-jumpbar" aria-label="攻略页内导航">
          <span>这页能解决</span>
          <a href="#locations">去哪里办理</a>
          <a href="#materials">准备什么</a>
          <a href="#application">怎么申请</a>
          <a href="#fees">要交多少钱</a>
          <a href="#sources">去哪里核验</a>
        </nav>

        <section className="consular-section" id="locations" aria-labelledby="locations-title">
          <div className="consular-heading">
            <p className="section-kicker">
              <MapPinned aria-hidden="true" size={18} />
              办理地点
            </p>
            <h2 id="locations-title">先找对受理渠道</h2>
            <p>签证中心、线上系统和驻华机构分工不同。先按实际递交方式走，再用右侧信息联系或核验。</p>
            <div className="consular-route">
              <Route aria-hidden="true" size={22} />
              <span>实际递交方式</span>
              <strong>{guide.method}</strong>
            </div>
          </div>

          {applicationNetwork ? (
            <ApplicationNetworkCard network={applicationNetwork} />
          ) : (
          <article className={`consular-card ${consularLocation.kind}`}>
            <span className="consular-kind">{consularKindLabels[consularLocation.kind]}</span>
            <div className="consular-office">
              <Building2 aria-hidden="true" size={24} />
              <h3>{consularLocation.office}</h3>
            </div>

            {consularLocation.address ? (
              <div className="consular-detail">
                <MapPin aria-hidden="true" size={19} />
                <div>
                  <span>{consularLocation.city ?? "地址"}</span>
                  <strong>{consularLocation.address}</strong>
                </div>
              </div>
            ) : null}

            <div className="consular-contact-grid">
              {consularLocation.phone ? (
                <div className="consular-detail">
                  <Phone aria-hidden="true" size={18} />
                  <div>
                    <span>电话</span>
                    <strong>{consularLocation.phone}</strong>
                  </div>
                </div>
              ) : null}
              {consularLocation.email ? (
                <a className="consular-detail" href={`mailto:${consularLocation.email}`}>
                  <Mail aria-hidden="true" size={18} />
                  <div>
                    <span>邮箱</span>
                    <strong>{consularLocation.email}</strong>
                  </div>
                </a>
              ) : null}
            </div>

            <p className="consular-warning">
              <strong>使馆地址不等于签证递交地址。</strong>
              {consularLocation.note}
            </p>

            <div className="consular-links">
              <a
                href={consularLocation.website ?? consularLocation.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                {consularLocation.kind === "domestic-authority"
                  ? "查看办事指南"
                  : consularLocation.website
                    ? "打开机构网站"
                    : "查看官方名录"}
                <ArrowUpRight aria-hidden="true" size={17} />
              </a>
              {consularLocation.website && consularLocation.website !== consularLocation.sourceUrl ? (
                <a href={consularLocation.sourceUrl} rel="noreferrer" target="_blank">
                  核对外交部名录
                  <ArrowUpRight aria-hidden="true" size={17} />
                </a>
              ) : null}
            </div>
            <small>来源：{consularLocation.sourceAuthority} · 核验于 {consularLocation.verifiedAt}</small>
          </article>
          )}
        </section>

        <section className="guide-workbench" id="materials" aria-labelledby="materials-title">
          <div className="guide-workbench-heading">
            <div>
              <p className="section-kicker">01 · 准备材料</p>
              <h2 id="materials-title">先把申请文件夹装满</h2>
            </div>
            <p>“必备”人人准备；“按身份必备”只交与你对应的一组；“按情况”命中条件才交。</p>
          </div>
          <PreparationChecklist
            countryName={country.name}
            fallbackReference={{
              label: applicationPortal.authority,
              url: applicationPortal.url,
            }}
            items={guide.materials}
          />
        </section>

        <div className="guide-application-grid">
          <section className="guide-section application-section" id="application" aria-labelledby="steps-title">
            <p className="section-kicker">02 · 提交申请</p>
            <h2 id="steps-title">按这个顺序走</h2>
            <div className={`application-portal ${applicationPortal.kind}`}>
              <span>{applicationPortal.isDirect ? "可从这里开始" : "官方起点 · 非商业代办"}</span>
              <h3>{applicationPortal.title}</h3>
              <p>{applicationPortal.note}</p>
              <a href={applicationPortal.url} rel="noreferrer" target="_blank">
                {applicationPortal.actionLabel}
                <ArrowUpRight aria-hidden="true" size={17} />
              </a>
              <small>
                {applicationPortal.authority} · 核验于 {applicationPortal.verifiedAt}
              </small>
            </div>
            <ol className="action-steps">
              {guide.steps.map((step, index) => {
                const action = index === 0
                  ? { label: applicationPortal.actionLabel, url: applicationPortal.url }
                  : step.action;

                return (
                  <li key={step.title}>
                    <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.detail}</p>
                      {action ? (
                        <a href={action.url} rel="noreferrer" target="_blank">
                          {action.label}
                          <ArrowUpRight aria-hidden="true" size={16} />
                        </a>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <aside className="fee-ledger" id="fees" aria-labelledby="fees-title">
            <div className="fee-ledger-heading">
              <div>
                <p className="section-kicker">03 · 费用账单</p>
                <h2 id="fees-title">钱花在哪里</h2>
              </div>
              <WalletCards aria-hidden="true" size={28} />
            </div>
            <strong className="fee-total">{guide.cost.summary}</strong>
            <dl className="fee-list">
              {guide.cost.items.map((item) => (
                <div key={item.label}>
                  <dt>
                    <span>{item.label}</span>
                    <strong>{item.amount}</strong>
                  </dt>
                  <dd><ImportantText text={item.detail} /></dd>
                </div>
              ))}
            </dl>
            <p className="fee-note"><ImportantText text={guide.cost.note} /></p>
          </aside>
        </div>

        <section className="guide-notes" aria-labelledby="notes-title">
          <ShieldAlert aria-hidden="true" size={25} />
          <div>
            <p className="section-kicker">提交前最后检查</p>
            <h2 id="notes-title">别在这些地方踩坑</h2>
          </div>
          <ul>
            {guide.notes.map((note) => (
              <li key={note}><ImportantText text={note} /></li>
            ))}
          </ul>
        </section>

        <section className="source-section" id="sources" aria-labelledby="sources-title">
          <div>
            <p className="section-kicker">04 · # 信息来源</p>
            <h2 id="sources-title">每个数字都有出处</h2>
            <p className="source-intro">官方规则、资料基线与临行核验分别标注。付款前打开对应入口再确认一次。</p>
          </div>
          <div className="source-list">
            {sourceEntries.map((source) => (
              <a href={source.url} key={source.url} rel="noreferrer" target="_blank">
                <span># {source.tag ?? "官方来源"}</span>
                <strong>{source.title}</strong>
                <small>{source.authority}</small>
                <ArrowUpRight aria-hidden="true" size={19} />
              </a>
            ))}
          </div>
        </section>

        <div className="guide-ready-note">
          <CheckCircle2 aria-hidden="true" />
          <div>
            <strong>准备完成后，再做一次一致性检查</strong>
            <span>表格、银行流水、在职证明、机酒订单和口头说明里的日期与金额要能对得上。</span>
          </div>
          <Route aria-hidden="true" />
        </div>

        <p className="guide-disclaimer">
          签证与边检规则会变化，本页用于行前整理，不替代使领馆或入境机关的最终答复。
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
