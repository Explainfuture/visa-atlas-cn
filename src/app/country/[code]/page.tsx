import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarCheck,
  Check,
  Clock3,
  FileCheck2,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getCountry, worldCountries } from "@/data/world-countries";
import { getVisaGuide } from "@/data/visa-guides";

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
  const description = `${country.name}旅游签证攻略：中国普通护照${guide.status}，${guide.stay}。含材料、步骤、官方来源和核验日期。`;

  return {
    title: `${country.name}签证攻略`,
    description,
    openGraph: { title: `${country.name}签证攻略｜签证地图`, description, images: [] },
    twitter: { title: `${country.name}签证攻略｜签证地图`, description, images: [] },
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

          <div className="guide-status-card">
            <span className={`visa-chip large ${guide.statusTone}`}>{guide.status}</span>
            <strong>{guide.stay}</strong>
            <span>
              <CalendarCheck aria-hidden="true" size={16} />
              核验于 {verifiedDate}
            </span>
          </div>
        </section>

        <section className="guide-facts" aria-label="办理概览">
          <div>
            <Clock3 aria-hidden="true" />
            <span>办理节奏</span>
            <strong>{guide.leadTime}</strong>
          </div>
          <div>
            <FileCheck2 aria-hidden="true" />
            <span>办理方式</span>
            <strong>{guide.method}</strong>
          </div>
          <div>
            <CalendarCheck aria-hidden="true" />
            <span>停留规则</span>
            <strong>{guide.stay}</strong>
          </div>
        </section>

        <div className="guide-content-grid">
          <section className="guide-section" aria-labelledby="steps-title">
            <p className="section-kicker">办理流程</p>
            <h2 id="steps-title">照着这三步准备</h2>
            <ol className="guide-steps">
              {guide.steps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="guide-section materials-section" aria-labelledby="materials-title">
            <p className="section-kicker">材料清单</p>
            <h2 id="materials-title">先把这些放进文件夹</h2>
            <ul className="materials-list">
              {guide.materials.map((material) => (
                <li key={material}>
                  <Check aria-hidden="true" size={17} />
                  {material}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="guide-notes" aria-labelledby="notes-title">
          <ShieldAlert aria-hidden="true" size={25} />
          <div>
            <p className="section-kicker">出发前再看一眼</p>
            <h2 id="notes-title">容易忽略的地方</h2>
          </div>
          <ul>
            {guide.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <section className="source-section" aria-labelledby="sources-title">
          <div>
            <p className="section-kicker"># 信息来源</p>
            <h2 id="sources-title">从官方页面继续确认</h2>
          </div>
          <div className="source-list">
            {guide.sources.map((source) => (
              <a href={source.url} key={source.url} rel="noreferrer" target="_blank">
                <span># 官方来源</span>
                <strong>{source.title}</strong>
                <small>{source.authority}</small>
                <ArrowUpRight aria-hidden="true" size={19} />
              </a>
            ))}
          </div>
        </section>

        <p className="guide-disclaimer">
          签证与边检规则会变化，本页用于行前整理，不替代使领馆或入境机关的最终答复。
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
