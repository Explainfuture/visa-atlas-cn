import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Compass,
  IdCard,
} from "lucide-react";
import { MapShell } from "@/components/map-shell";
import { PopularDestinationShowcase } from "@/components/popular-destination-rail";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  continents,
  popularDestinations,
} from "@/data/featured-countries";
import { getTravelDestination } from "@/data/travel-destinations";
import { getContinentCount, worldCountries } from "@/data/world-countries";

export default function Home() {
  const currentYear = new Date().getUTCFullYear();
  const popularDestinationSlides = popularDestinations.map((destination) => {
    const travelDestination = getTravelDestination(destination.code);
    const image = travelDestination?.images.find(
      (candidate) => candidate.caption === destination.imageCaption,
    ) ?? travelDestination?.images[0];

    return {
      city: destination.city,
      code: destination.code,
      continent: destination.continent,
      image: image
        ? {
            alt: image.alt,
            artist: image.artist,
            caption: image.caption,
            license: image.license,
            sourceUrl: image.sourceUrl,
            url: image.url,
          }
        : undefined,
      name: destination.name,
      signal: destination.signal,
    };
  });

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
              选择大洲或点亮一个目的地，快速找到签证方式、材料清单与官方入口。
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
                <dt>{worldCountries.length}</dt>
                <dd>目的地攻略</dd>
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
                <span>CN · {currentYear}</span>
              </div>
              <MapShell availableCodes={worldCountries.map((country) => country.code)} />
              <div className="map-folio-note">
                <span className="map-pulse" aria-hidden="true" />
                滚轮或双指缩放 · 拖动平移 · 悬浮查看目的地
              </div>
            </div>
          </div>
        </section>

        <section className="passport-home-entry" aria-labelledby="passport-entry-title">
          <div className="passport-home-number" aria-hidden="true">01</div>
          <div>
            <p className="section-kicker">还没有护照？从这里开始</p>
            <h2 id="passport-entry-title">第一次办护照，不用自己到处查</h2>
            <p>看懂护照有什么用、要带什么、交多少钱，再按省份和城市找到出入境办理窗口。</p>
          </div>
          <Link href="/passport">
            <IdCard aria-hidden="true" size={22} />
            打开新手攻略
            <ArrowRight aria-hidden="true" size={19} />
          </Link>
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
                <span className="continent-count">
                  {getContinentCount(continent.slug)} 条记录
                </span>
                <ArrowDownRight aria-hidden="true" size={20} />
              </Link>
            ))}
          </div>
        </section>

        <PopularDestinationShowcase destinations={popularDestinationSlides} />
      </main>

      <SiteFooter />
    </>
  );
}
