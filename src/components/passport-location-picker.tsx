"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import type { PassportProvince } from "@/data/passport-offices";

type PassportLocationPickerProps = {
  provinces: PassportProvince[];
  selectedProvinceId?: string;
  selectedCityId?: string;
};

export function PassportLocationPicker({
  provinces,
  selectedProvinceId = "",
  selectedCityId = "",
}: PassportLocationPickerProps) {
  const router = useRouter();
  const [provinceId, setProvinceId] = useState(selectedProvinceId);
  const [cityId, setCityId] = useState(selectedCityId);
  const [isPending, startTransition] = useTransition();

  const cities = useMemo(
    () => provinces.find((province) => province.id === provinceId)?.cities ?? [],
    [provinceId, provinces],
  );

  function openCityGuide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cityId) return;
    startTransition(() => router.push(`/passport/${cityId}#city-guide`));
  }

  return (
    <form className="passport-picker" onSubmit={openCityGuide}>
      <div className="passport-picker-field">
        <label htmlFor="passport-province">我在哪个省份</label>
        <select
          id="passport-province"
          value={provinceId}
          onChange={(event) => {
            setProvinceId(event.target.value);
            setCityId("");
          }}
        >
          <option value="">选择省份</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      <span className="passport-picker-arrow" aria-hidden="true">
        <ArrowRight size={22} />
      </span>

      <div className="passport-picker-field">
        <label htmlFor="passport-city">再选择城市</label>
        <select
          disabled={!provinceId}
          id="passport-city"
          value={cityId}
          onChange={(event) => setCityId(event.target.value)}
        >
          <option value="">{provinceId ? "选择城市" : "请先选择省份"}</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <button disabled={!cityId || isPending} type="submit">
        <MapPin aria-hidden="true" size={19} />
        {isPending ? "正在生成…" : "生成城市攻略"}
      </button>
    </form>
  );
}
