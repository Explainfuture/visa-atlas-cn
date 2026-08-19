import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PassportGuide } from "@/components/passport-guide";
import { getPassportLocation, passportCityIds } from "@/data/passport-offices";

export function generateStaticParams() {
  return passportCityIds.map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const location = getPassportLocation(city);
  if (!location) return {};

  const place = `${location.province.name}${location.city.name}`;
  return {
    title: `${place}第一次办护照：材料、费用与办理地点`,
    description: `${place}首次申领普通护照攻略：所需材料、120元费用、办理流程和国家移民管理局出入境受理窗口。`,
  };
}

export default async function PassportCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  if (!getPassportLocation(city)) notFound();
  return <PassportGuide cityId={city} />;
}
