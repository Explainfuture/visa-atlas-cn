import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Compass,
  ShieldCheck,
} from "lucide-react";
import { MapShell } from "@/components/map-shell";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { continents, featuredCountries } from "@/data/featured-countries";
import { visaGuides } from "@/data/visa-guides";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>

      <SiteHeader />

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <Compass aria-hidden="true" size={17} />
              给中国护照的全球签证指南
            </p>
            <h1 id="hero-title">
              世界很大，
              <span>从一张地图出发。</span>
            </h1>
            <p className="hero-intro">
              选择大洲或点亮一个国家，快速找到签证方式、材料清单与官方入口。
            </p>

            <div className="hero-actions">
              <Link className="primary-button" href="#world-map">
                打开世界地图
                <ArrowDownRight aria-hidden="true" size={19} />
              </Link>
              <Link className="text-button" href="#continents">
                按地区查找
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </div>

            <dl className="hero-facts" aria-label="知识库概况">
              <div>
                <dt>7</dt>
                <dd>大洲目录</dd>
              </div>
              <div>
                <dt>{featuredCountries.length}</dt>
                <dd>首批目的地</dd>
              </div>
              <div>
                <dt>官方</dt>
                <dd>来源优先</dd>
              </div>
            </dl>
          </div>

          <div className="hero-map" id="world-map">
            <div className="map-folio">
              <div className="map-folio-topline">
                <span>WORLD VISA ATLAS</span>
                <span>CN · 2026</span>
              </div>
              <MapShell />
              <div className="map-folio-note">
                <span className="map-pulse" aria-hidden="true" />
                点按地图，认识你的下一站
              </div>
            </div>
          </div>
        </section>

        <section className="continent-section" id="continents" aria-labelledby="continents-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">按地区探索</p>
              <h2 id="continents-title">七大洲，一目了然</h2>
            </div>
            <p>从熟悉的地区开始，也可以去地图上随意逛逛。</p>
          </div>

          <div className="continent-grid">
            {continents.map((continent) => (
              <Link
                className="continent-card"
                href={`/continents/${continent.slug}`}
                id={continent.slug}
                key={continent.slug}
              >
                <span className="continent-index">{continent.index}</span>
                <span className="continent-name">
                  <strong>{continent.name}</strong>
                  <small>{continent.englishName}</small>
                </span>
                <span className="continent-count">{continent.count} 个目的地</span>
                <ArrowDownRight aria-hidden="true" size={20} />
              </Link>
            ))}
          </div>
        </section>

        <section className="featured-section" id="featured-guides" aria-labelledby="featured-title">
          <div className="section-heading featured-heading">
            <div>
              <p className="section-kicker">第一批攻略</p>
              <h2 id="featured-title">大家常去的地方，先整理好</h2>
            </div>
            <div className="source-promise">
              <ShieldCheck aria-hidden="true" size={19} />
              每条结论附来源与核验日期
            </div>
          </div>

          <div className="country-grid">
            {featuredCountries.map((country) => (
              <Link
                className="country-card"
                href={`/country/${country.code}`}
                id={`country-${country.slug}`}
                key={country.code}
              >
                <div className="country-card-topline">
                  <span className="country-flag" aria-hidden="true">
                    {country.flag}
                  </span>
                  <span>{country.continent}</span>
                </div>
                <h3>{country.name}</h3>
                <p>{country.city}</p>
                <div className="country-card-footer">
                  <span>
                    <BookOpen aria-hidden="true" size={16} />
                    {visaGuides[country.code]?.status ?? "攻略已收录"}
                  </span>
                  <ArrowRight aria-hidden="true" size={19} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
