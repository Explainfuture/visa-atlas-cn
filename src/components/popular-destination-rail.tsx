"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type PopularDestination = {
  city: string;
  code: string;
  continent: string;
  name: string;
  signal: string;
};

const WHEEL_THRESHOLD = 20;
const WHEEL_COOLDOWN = 260;
const SECONDARY_COUNT = 5;

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

export function PopularDestinationRail({
  destinations,
}: {
  destinations: readonly PopularDestination[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const wheelAccumulatorRef = useRef(0);
  const wheelLockRef = useRef(0);
  const destinationCount = destinations.length;
  const activeDestination = destinations[activeIndex];
  const secondaryDestinations = Array.from(
    { length: Math.min(SECONDARY_COUNT, Math.max(0, destinationCount - 1)) },
    (_, offset) => destinations[wrapIndex(activeIndex + offset + 1, destinationCount)],
  );

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || destinationCount < 2) return;

    function handleWheel(event: WheelEvent) {
      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < 1) return;

      event.preventDefault();
      const now = performance.now();
      if (now < wheelLockRef.current) return;

      wheelAccumulatorRef.current += delta;
      if (Math.abs(wheelAccumulatorRef.current) < WHEEL_THRESHOLD) return;

      const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
      wheelAccumulatorRef.current = 0;
      wheelLockRef.current = now + WHEEL_COOLDOWN;
      setActiveIndex((current) => wrapIndex(current + direction, destinationCount));
    }

    rail.addEventListener("wheel", handleWheel, { passive: false });
    return () => rail.removeEventListener("wheel", handleWheel);
  }, [destinationCount]);

  function move(direction: number) {
    setActiveIndex((current) => wrapIndex(current + direction, destinationCount));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  }

  if (!activeDestination) return null;

  return (
    <div
      aria-label="热门国家胶囊轨道，悬停后使用滚轮或方向键切换"
      className="popular-destination-rail"
      onKeyDown={handleKeyDown}
      ref={railRef}
      role="region"
      tabIndex={0}
    >
      <Link
        aria-label={`打开${activeDestination.name}签证攻略`}
        className="popular-main-pill"
        href={`/country/${activeDestination.code}`}
        key={activeDestination.code}
      >
        <span
          aria-hidden="true"
          className={`popular-main-flag fi fi-${activeDestination.code}`}
        />
        <span className="popular-main-copy">
          <small>{activeDestination.signal} · {activeDestination.continent}</small>
          <strong>{activeDestination.name}</strong>
          <span>{activeDestination.city}</span>
        </span>
        <span className="popular-main-action">查看攻略 ↗</span>
      </Link>

      <div className="popular-secondary-list" aria-label="接下来的热门国家">
        {secondaryDestinations.map((destination, index) => (
          <Link
            aria-label={`打开${destination.name}签证攻略`}
            className="popular-secondary-pill"
            data-depth={index + 1}
            href={`/country/${destination.code}`}
            key={destination.code}
          >
            <span
              aria-hidden="true"
              className={`popular-secondary-flag fi fi-${destination.code}`}
            />
            <strong>{destination.name}</strong>
          </Link>
        ))}
      </div>

      <div className="popular-rail-controls">
        <span aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {destinationCount}
        </span>
        <div>
          <button aria-label="上一个热门国家" onClick={() => move(-1)} type="button">←</button>
          <button aria-label="下一个热门国家" onClick={() => move(1)} type="button">→</button>
        </div>
        <small>悬停滚轮切换</small>
      </div>
    </div>
  );
}
