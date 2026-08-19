import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  ContinentCountryList,
  type DirectoryCountry,
} from "@/components/continent-country-list";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  continentDirectory,
  getContinent,
  getCountriesByContinent,
} from "@/data/world-countries";
import { getVisaGuide } from "@/data/visa-guides";

export function generateStaticParams() {
  return continentDirectory.map((continent) => ({ continent: continent.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ continent: string }>;
}): Promise<Metadata> {
  const { continent: slug } = await params;
  const continent = getContinent(slug);

  if (!continent) return {};

  const description = `${continent.name}目的地签证目录，面向中国普通护照持有人。`;

  return {
    title: `${continent.name}签证目录`,
    description,
    openGraph: { title: `${continent.name}签证目录｜签证地图`, description, images: [] },
    twitter: { title: `${continent.name}签证目录｜签证地图`, description, images: [] },
  };
}

export default async function ContinentPage({
  params,
}: {
  params: Promise<{ continent: string }>;
}) {
  const { continent: slug } = await params;
  const continent = getContinent(slug);

  if (!continent) notFound();

  const countries: DirectoryCountry[] = getCountriesByContinent(slug).map((country) => {
    const guide = getVisaGuide(country);

    return {
      code: country.code,
      name: country.name,
      englishName: country.englishName,
      flag: country.flag,
      status: guide.status,
      statusTone: guide.statusTone,
    };
  });

  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <SiteHeader />
      <main id="main-content" className="directory-page">
        <section className="directory-hero">
          <Link className="back-link" href="/#continents">
            <ArrowLeft aria-hidden="true" size={17} />
            返回七大洲
          </Link>
          <p className="section-kicker">{continent.englishName}</p>
          <h1>{continent.name}</h1>
          <p>{continent.introduction}</p>
          <span>{countries.length} 条目的地记录</span>
        </section>

        <ContinentCountryList countries={countries} />
      </main>
      <SiteFooter />
    </>
  );
}
