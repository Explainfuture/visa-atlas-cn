"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
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
        <TransformWrapper
          centerOnInit
          centerZoomedOut
          doubleClick={{ excluded: ["a", "button"], mode: "zoomIn", step: 0.7 }}
          limitToBounds
          maxScale={6}
          minScale={1}
          panning={{ excluded: ["a", "button"], velocityDisabled: true }}
          wheel={{ step: 0.015 }}
        >
          {({ resetTransform, zoomIn, zoomOut }) => (
            <>
              <div className="map-zoom-controls" role="group" aria-label="地图缩放控制">
                <button
                  aria-label="缩小地图"
                  onClick={() => zoomOut(0.6)}
                  title="缩小地图"
                  type="button"
                >
                  <Minus aria-hidden="true" size={17} />
                </button>
                <button
                  aria-label="复位地图"
                  onClick={() => resetTransform(240)}
                  title="复位地图"
                  type="button"
                >
                  <RotateCcw aria-hidden="true" size={16} />
                </button>
                <button
                  aria-label="放大地图"
                  onClick={() => zoomIn(0.6)}
                  title="放大地图"
                  type="button"
                >
                  <Plus aria-hidden="true" size={17} />
                </button>
              </div>

              <TransformComponent
                contentClass="map-zoom-content"
                wrapperClass="map-zoom-viewport"
                wrapperProps={{ "aria-label": "可缩放的世界签证地图" }}
              >
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
                  size="responsive"
                  styleFunction={styleCountry}
                  title="可交互的世界签证地图"
                  tooltipBgColor="#2a2024"
                  tooltipTextColor="#fff8fa"
                  tooltipTextFunction={({ countryCode, countryValue }) =>
                    countryValue ??
                    displayNames.of(countryCode.toUpperCase()) ??
                    countryCode.toUpperCase()
                  }
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
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
