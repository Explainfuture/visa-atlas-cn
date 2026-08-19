import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Compass,
  Fingerprint,
  MapPinned,
  PlaneTakeoff,
} from "lucide-react";
import type { TravelDestination } from "@/data/travel-destinations";
import type { CountrySummary } from "@/data/world-countries";

type TravelDestinationProps = {
  country: CountrySummary;
  destination: TravelDestination;
};

export function TravelDestinationIntro({ country, destination }: TravelDestinationProps) {
  return (
    <>
      <section className="travel-destination" id="travel" aria-labelledby="travel-title">
        <div className="travel-heading">
          <p className="section-kicker">
            <Compass aria-hidden="true" size={18} />
            先认识目的地
          </p>
          <div className="travel-title-row">
            <span className={`travel-flag fi fi-${country.code}`} aria-hidden="true" />
            <div>
              <h1 id="travel-title">{country.name}</h1>
              <p>{country.englishName}</p>
            </div>
          </div>
          <p className="travel-introduction">{destination.introduction}</p>
          <a
            className="travel-text-source"
            href={destination.source.url}
            rel="noreferrer"
            target="_blank"
          >
            # 旅行介绍来源 · {destination.source.label}
            <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </div>

        <div className={`travel-gallery image-count-${destination.images.length}`}>
          {destination.images.map((image, index) => (
            <figure className={index === 0 ? "travel-photo main" : "travel-photo"} key={image.url}>
              <Image
                alt={image.alt}
                fill
                loading={index === 0 ? undefined : "eager"}
                preload={index === 0}
                sizes={
                  index === 0
                    ? "(max-width: 760px) calc(100vw - 32px), (max-width: 1080px) 56vw, 650px"
                    : "(max-width: 760px) 46vw, (max-width: 1080px) 28vw, 310px"
                }
                src={image.url}
                unoptimized
              />
              <figcaption>
                <strong>{image.caption}</strong>
                <a href={image.sourceUrl} rel="noreferrer" target="_blank">
                  <Camera aria-hidden="true" size={13} />
                  {image.artist} · {image.license}
                </a>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="travel-attractions">
          <div className="travel-attractions-heading">
            <p className="section-kicker">旅行灵感</p>
            <h2>从这些代表性城市与景点开始</h2>
          </div>
          <ol>
            {destination.attractions.map((attraction, index) => (
              <li key={`${attraction.name}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{attraction.name}</h3>
                  <p>{attraction.description}</p>
                </div>
                <a
                  aria-label={`查看${attraction.name}的参考来源`}
                  href={attraction.sourceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ArrowUpRight aria-hidden="true" size={18} />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="country-passport-bridge" id="passport" aria-labelledby="passport-title">
        <span className="country-passport-index">出发前 · 00</span>
        <div className="country-passport-copy">
          <p className="section-kicker">
            <Fingerprint aria-hidden="true" size={18} />
            第一次出国
          </p>
          <h2 id="passport-title">先把护照办好</h2>
          <p>护照是中国公民在境外证明国籍和身份的旅行证件。没有办过也不用慌，按所在省份和城市就能找到受理窗口。</p>
        </div>
        <ul>
          <li>
            <PlaneTakeoff aria-hidden="true" size={19} />
            <span><strong>本人到场</strong>首次申领通常需要本人办理</span>
          </li>
          <li>
            <MapPinned aria-hidden="true" size={19} />
            <span><strong>按城市找窗口</strong>查看地址、电话与办公时间</span>
          </li>
        </ul>
        <Link href="/passport">
          查看完整护照攻略
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </section>
    </>
  );
}
