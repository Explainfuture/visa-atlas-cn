import consularDataset from "@/data/consular-locations.generated.json";

export type ConsularLocationKind =
  | "embassy"
  | "parent-mission"
  | "domestic-authority"
  | "official-check";

export type ConsularLocation = {
  kind: ConsularLocationKind;
  office: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  sourceUrl: string;
  sourceAuthority: string;
  verifiedAt: string;
  note: string;
};

type ConsularDataset = {
  metadata: {
    generatedAt: string;
    destinationCount: number;
    missionCount: number;
    counts: Record<ConsularLocationKind, number>;
    embassyDirectoryUrl: string;
    consulateDirectoryUrl: string;
    openSourceReference: string;
  };
  locations: Record<string, ConsularLocation>;
};

const data = consularDataset as ConsularDataset;

export const consularMetadata = data.metadata;

export const consularKindLabels: Record<ConsularLocationKind, string> = {
  embassy: "驻华主要联络点",
  "parent-mission": "属地主管机构",
  "domestic-authority": "国内受理窗口",
  "official-check": "需官方确认",
};

export function getConsularLocation(code: string) {
  const location = data.locations[code.toLowerCase()];
  if (!location) throw new Error(`Missing consular location for destination: ${code}`);
  return location;
}
