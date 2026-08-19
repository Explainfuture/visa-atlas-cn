"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export type GlobalCountrySearchItem = {
  code: string;
  englishName: string;
  name: string;
};

function useThrottledValue<T>(value: T, delay: number) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdatedAt = useRef(0);

  useEffect(() => {
    const remainingDelay = Math.max(delay - (Date.now() - lastUpdatedAt.current), 0);
    const timeoutId = window.setTimeout(() => {
      setThrottledValue(value);
      lastUpdatedAt.current = Date.now();
    }, remainingDelay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return throttledValue;
}

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase("zh-CN");
}

export function GlobalCountrySearch({ countries }: { countries: GlobalCountrySearchItem[] }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const resultsId = useId();
  const throttledQuery = useThrottledValue(normalizeSearchText(query), 140);

  const results = useMemo(() => {
    if (!throttledQuery) return [];

    return countries.filter((country) =>
      `${country.name} ${country.englishName} ${country.code}`
        .toLocaleLowerCase("zh-CN")
        .includes(throttledQuery),
    );
  }, [countries, throttledQuery]);

  const showResults = isOpen && Boolean(query.trim());

  return (
    <div
      className="global-country-search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
      role="search"
    >
      <label className="global-search-field" htmlFor="global-country-query">
        <Search aria-hidden="true" size={18} />
        <span className="sr-only">搜索国家或地区</span>
        <input
          aria-controls={resultsId}
          autoComplete="off"
          id="global-country-query"
          name="global-country-query"
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
          placeholder="输入你想去的国家"
          spellCheck={false}
          type="search"
          value={query}
        />
        {query ? (
          <button
            aria-label="清空国家搜索"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            type="button"
          >
            <X aria-hidden="true" size={16} />
          </button>
        ) : null}
      </label>

      {showResults ? (
        <div className="global-search-results" id={resultsId}>
          {results.length ? (
            results.map((country) => (
              <Link
                className="global-search-result"
                href={`/country/${country.code}`}
                key={country.code}
                onClick={() => setIsOpen(false)}
              >
                <span
                  aria-hidden="true"
                  className={`global-search-flag fi fi-${country.code}`}
                />
                <strong>{country.name}</strong>
              </Link>
            ))
          ) : (
            <p className="global-search-empty">没有找到这个目的地</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
