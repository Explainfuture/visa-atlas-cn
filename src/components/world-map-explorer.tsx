"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import WorldMap, {
  regions,
  type CountryContext,
  type Data,
  type ISOCode,
} from "react-svg-worldmap";

const supportedCodes = new Set(regions.map((region) => region.code.toLowerCase()));
const destinationNameOverrides: Readonly<Record<string, string>> = {
  tw: "中国台湾",
};

function getDestinationName(code: string, displayNames: Intl.DisplayNames) {
  return (
    destinationNameOverrides[code.toLowerCase()] ??
    displayNames.of(code.toUpperCase()) ??
    code.toUpperCase()
  );
}

export function WorldMapExplorer({ availableCodes }: { availableCodes: string[] }) {
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
          value: getDestinationName(normalizedCode, displayNames),
        }];
      }),
    [availableCodes, displayNames],
  );

  const styleCountry = (context: CountryContext<string>) => {
    return {
      fill: context.countryValue ? "#e99bb3" : "#eadde2",
      stroke: "#fff8fa",
      strokeWidth: 0.55,
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
                    return availableCodeSet.has(code)
                      ? {
                          href: `/country/${code}`,
                          "aria-label": getDestinationName(code, displayNames),
                        }
                      : undefined;
                  }}
                  size="responsive"
                  styleFunction={styleCountry}
                  title="可交互的世界签证地图"
                  tooltipBgColor="#2a2024"
                  tooltipTextColor="#fff8fa"
                  tooltipTextFunction={({ countryCode, countryValue }) =>
                    countryValue ?? getDestinationName(countryCode, displayNames)
                  }
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

    </div>
  );
}
