import passportOfficeData from "./passport-offices.generated.json";

export type PassportCity = {
  id: string;
  name: string;
};

export type PassportProvince = {
  id: string;
  name: string;
  cities: PassportCity[];
};

export type PassportOffice = {
  id: string;
  name: string;
  address: string;
  phone: string;
  workTime: string;
  serviceMode: string;
  scope: string;
  supportsPassport: boolean;
};

type PassportOfficeDataset = {
  metadata: {
    verifiedAt: string;
    sourceAuthority: string;
    regionSource: string;
    officeSourcePattern: string;
    directorySource: string;
    provinceCount: number;
    cityCount: number;
    coveredCityCount: number;
    activeOfficeCount: number;
    passportOfficeCount: number;
    note: string;
  };
  provinces: PassportProvince[];
  officesByCity: Record<string, PassportOffice[]>;
};

const dataset = passportOfficeData as PassportOfficeDataset;

export const passportOfficeMetadata = dataset.metadata;
export const passportRegions = dataset.provinces;
export const passportCityIds = passportRegions.flatMap((province) =>
  province.cities.map((city) => city.id),
);

export function getPassportLocation(cityId: string) {
  for (const province of passportRegions) {
    const city = province.cities.find((item) => item.id === cityId);
    if (city) return { province, city };
  }
  return undefined;
}

export function getPassportOffices(cityId: string) {
  const activeOffices = dataset.officesByCity[cityId] ?? [];
  const passportOffices = activeOffices.filter((office) => office.supportsPassport);

  return {
    offices: passportOffices.length ? passportOffices : activeOffices,
    scopeNeedsConfirmation: activeOffices.length > 0 && passportOffices.length === 0,
  };
}
