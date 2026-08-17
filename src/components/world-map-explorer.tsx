"use client";

import { useMemo, useState } from "react";
import WorldMap, { type CountryContext, type Data } from "react-svg-worldmap";
import { featuredCountries } from "@/data/featured-countries";

const mapData: Data<string> = featuredCountries.map((country) => ({
  country: country.code,
  value: country.name,
}));

const countryNames = new Map(featuredCountries.map((country) => [country.code, country.name]));

export function WorldMapExplorer() {
  const [selectedCode, setSelectedCode] = useState("jp");
  const displayNames = useMemo(
    () => new Intl.DisplayNames(["zh-CN"], { type: "region" }),
    [],
  );

  const selectedName =
    countryNames.get(selectedCode) ?? displayNames.of(selectedCode.toUpperCase()) ?? "未知目的地";
  const isFeatured = countryNames.has(selectedCode);

  const styleCountry = (context: CountryContext<string>) => {
    const code = context.countryCode.toLowerCase();

    return {
      fill:
        code === selectedCode
          ? "#b94468"
          : context.countryValue
            ? "#e99bb3"
            : "#eadde2",
      stroke: "#fff8fa",
      strokeWidth: code === selectedCode ? 1.2 : 0.55,
      cursor: "pointer",
      outline: "none",
      transition: "fill 180ms ease, opacity 180ms ease",
    };
  };

  const selectedSlug = featuredCountries.find((item) => item.code === selectedCode)?.slug;

  return (
    <div className="world-map-explorer">
      <div className="world-map-canvas">
        <WorldMap
          backgroundColor="transparent"
          borderColor="#fff8fa"
          color="#e99bb3"
          data={mapData}
          frame={false}
          onClickFunction={({ countryCode }) => setSelectedCode(countryCode.toLowerCase())}
          richInteraction
          size="responsive"
          styleFunction={styleCountry}
          title="可交互的世界签证地图"
          tooltipBgColor="#2a2024"
          tooltipTextColor="#fff8fa"
          tooltipTextFunction={({ countryCode, countryValue }) =>
            countryValue ?? displayNames.of(countryCode.toUpperCase()) ?? countryCode.toUpperCase()
          }
        />
      </div>

      <div className="map-selection" aria-live="polite">
        <span>{isFeatured ? "首批攻略" : "地图已选中"}</span>
        <strong>{selectedName}</strong>
        <a href={selectedSlug ? `#country-${selectedSlug}` : "#continents"}>
          {isFeatured ? "查看目的地" : "按地区继续找"}
        </a>
      </div>
    </div>
  );
}
