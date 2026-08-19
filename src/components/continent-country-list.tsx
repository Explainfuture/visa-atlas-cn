"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";

export type DirectoryCountry = {
  code: string;
  name: string;
  englishName: string;
  flag: string;
  status: string;
  statusTone: string;
};

export function ContinentCountryList({ countries }: { countries: DirectoryCountry[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("zh-CN"));

  const visibleCountries = useMemo(() => {
    if (!deferredQuery) return countries;

    return countries.filter((country) =>
      `${country.name} ${country.englishName} ${country.code}`
        .toLocaleLowerCase("zh-CN")
        .includes(deferredQuery),
    );
  }, [countries, deferredQuery]);

  return (
    <div className="directory-browser">
      <label className="country-search">
        <Search aria-hidden="true" size={20} />
        <span className="sr-only">搜索目的地</span>
        <input
          autoComplete="off"
          name="country-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索目的地…"
          spellCheck={false}
          type="search"
          value={query}
        />
        <span className="search-count">{visibleCountries.length}</span>
      </label>

      {visibleCountries.length > 0 ? (
        <div className="directory-country-grid">
          {visibleCountries.map((country) => (
            <Link className="directory-country-card" href={`/country/${country.code}`} key={country.code}>
              <span className={`directory-flag fi fi-${country.code}`} aria-hidden="true" />
              <span className="directory-country-name">
                <strong>{country.name}</strong>
                <small>{country.englishName}</small>
              </span>
              <span className={`visa-chip ${country.statusTone}`}>{country.status}</span>
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-search">
          <strong>没有找到匹配目的地</strong>
          <span>试试目的地中文名、英文名或两位代码。</span>
        </div>
      )}
    </div>
  );
}
