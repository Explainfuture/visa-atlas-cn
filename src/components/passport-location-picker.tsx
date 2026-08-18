"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import * as Select from "@radix-ui/react-select";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";
import type { PassportProvince } from "@/data/passport-offices";

type PassportLocationPickerProps = {
  provinces: PassportProvince[];
  selectedProvinceId?: string;
  selectedCityId?: string;
};

type PassportSelectOption = {
  id: string;
  name: string;
};

type PassportSelectProps = {
  disabled?: boolean;
  id: string;
  labelId: string;
  onValueChange: (value: string) => void;
  options: PassportSelectOption[];
  placeholder: string;
  value: string;
};

function PassportSelect({
  disabled = false,
  id,
  labelId,
  onValueChange,
  options,
  placeholder,
  value,
}: PassportSelectProps) {
  return (
    <Select.Root
      disabled={disabled}
      onValueChange={onValueChange}
      value={value}
    >
      <Select.Trigger
        aria-labelledby={labelId}
        className="passport-select-trigger"
        id={id}
        type="button"
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="passport-select-icon">
          <ChevronDown aria-hidden="true" size={19} strokeWidth={2.2} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          align="start"
          className="passport-select-content"
          collisionPadding={12}
          position="popper"
          sideOffset={8}
        >
          <Select.ScrollUpButton className="passport-select-scroll-button">
            <ChevronUp aria-hidden="true" size={18} />
          </Select.ScrollUpButton>

          <Select.Viewport className="passport-select-viewport">
            {options.map((option) => (
              <Select.Item
                className="passport-select-item"
                key={option.id}
                value={option.id}
              >
                <span aria-hidden="true" className="passport-select-item-mark">
                  <Select.ItemIndicator>
                    <Check size={15} strokeWidth={2.6} />
                  </Select.ItemIndicator>
                </span>
                <Select.ItemText>{option.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className="passport-select-scroll-button">
            <ChevronDown aria-hidden="true" size={18} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

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
        <label htmlFor="passport-province" id="passport-province-label">
          我在哪个省份
        </label>
        <PassportSelect
          id="passport-province"
          labelId="passport-province-label"
          options={provinces}
          placeholder="选择省份"
          value={provinceId}
          onValueChange={(value) => {
            setProvinceId(value);
            setCityId("");
          }}
        />
      </div>

      <span className="passport-picker-arrow" aria-hidden="true">
        <ArrowRight size={22} />
      </span>

      <div className="passport-picker-field">
        <label htmlFor="passport-city" id="passport-city-label">
          再选择城市
        </label>
        <PassportSelect
          disabled={!provinceId}
          id="passport-city"
          labelId="passport-city-label"
          onValueChange={setCityId}
          options={cities}
          placeholder={provinceId ? "选择城市" : "请先选择省份"}
          value={cityId}
        />
      </div>

      <button
        className="passport-picker-submit"
        disabled={!cityId || isPending}
        type="submit"
      >
        <MapPin aria-hidden="true" size={19} />
        {isPending ? "正在生成…" : "生成城市攻略"}
      </button>
    </form>
  );
}
