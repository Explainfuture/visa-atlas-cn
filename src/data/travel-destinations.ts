import travelData from "@/data/travel-destinations.generated.json";

export type TravelAttraction = {
  description: string;
  name: string;
  sourceUrl: string;
};

export type TravelImage = {
  alt: string;
  artist: string;
  caption: string;
  height: number;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  url: string;
  width: number;
};

export type TravelDestination = {
  attractions: TravelAttraction[];
  images: TravelImage[];
  introduction: string;
  source: {
    label: string;
    license: string;
    licenseUrl: string;
    url: string;
  };
};

const destinations = travelData.destinations as Record<string, TravelDestination>;

export const travelDataMetadata = travelData.metadata;

export function getTravelDestination(code: string) {
  return destinations[code.toLowerCase()];
}
