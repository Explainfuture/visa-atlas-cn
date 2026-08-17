"use client";

import dynamic from "next/dynamic";

const WorldMapExplorer = dynamic(
  () => import("@/components/world-map-explorer").then((module) => module.WorldMapExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="map-loading" role="status">
        <span />
        正在展开地图…
      </div>
    ),
  },
);

export function MapShell({ availableCodes }: { availableCodes: string[] }) {
  return <WorldMapExplorer availableCodes={availableCodes} />;
}
