"use client";

import { useMemo, useState } from "react";
import WorldMap, {
  regions,
  type CountryContext,
  type Data,
  type ISOCode,
} from "react-svg-worldmap";

const supportedCodes = new Set(regions.map((region) => region.code.toLowerCase()));

export function WorldMapExplorer({ availableCodes }: { availableCodes: string[] }) {
  const [selectedCode, setSelectedCode] = useState("jp");
  const displayNames = useMemo(
    () => new Intl.DisplayNames(["zh-CN"], { type: "region" }),
    [],
  );
  const availableCodeSet = useMemo(() => new Set(availableCodes), [availableCodes]);
  const mapData = useMemo<Data<string>>(
    () =>
      availableCodes.flatMap((code) => {
        const normalizedCode = code.toLowerCase();

        if (!supportedCodes.has(normalizedCode)) return [];

        return [{
          country: normalizedCode as ISOCode,
          value:
            displayNames.of(normalizedCode.toUpperCase()) ?? normalizedCode.toUpperCase(),
        }];
      }),
    [availableCodes, displayNames],
  );

  const selectedName =
    displayNames.of(selectedCode.toUpperCase()) ?? "未知目的地";
  const hasGuidePage = availableCodeSet.has(selectedCode);

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
      cursor: context.countryValue ? "pointer" : "default",
      transition: "fill 180ms ease, filter 180ms ease, opacity 180ms ease",
    };
  };

  return (
    <div className="world-map-explorer">
      <div className="world-map-canvas">
        <WorldMap
          backgroundColor="transparent"
          borderColor="#fff8fa"
          color="#e99bb3"
          data={mapData}
          frame={false}
          hrefFunction={({ countryCode }) => {
            const code = countryCode.toLowerCase();
            return availableCodeSet.has(code) ? `/country/${code}` : undefined;
          }}
          onClickFunction={({ countryCode }) => {
            const code = countryCode.toLowerCase();

            if (availableCodeSet.has(code)) setSelectedCode(code);
          }}
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
        <span>{hasGuidePage ? "攻略已收录" : "地图已选中"}</span>
        <strong>{selectedName}</strong>
        <a href={hasGuidePage ? `/country/${selectedCode}` : "#continents"}>
          {hasGuidePage ? "打开完整攻略" : "按地区继续找"}
        </a>
      </div>
    </div>
  );
}
