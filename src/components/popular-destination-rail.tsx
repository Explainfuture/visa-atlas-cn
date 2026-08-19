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
const STACK_DEPTH = 3;

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

function getStackOffset(index: number, activeIndex: number, length: number) {
  let offset = wrapIndex(index - activeIndex, length);
  if (offset > length / 2) offset -= length;
  return offset;
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
  const stackedDestinations = destinations
    .map((destination, index) => ({
      destination,
      offset: getStackOffset(index, activeIndex, destinationCount),
    }))
    .filter(({ offset }) => Math.abs(offset) <= STACK_DEPTH);

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
      aria-label="热门国家层叠胶囊，悬停后使用滚轮或方向键旋转"
      className="popular-destination-rail"
      role="region"
    >
      <div
        aria-label="滚动切换热门国家"
        className="popular-stack-stage"
        onKeyDown={handleKeyDown}
        ref={railRef}
        role="group"
        tabIndex={0}
      >
        {stackedDestinations.map(({ destination, offset }) => (
          <Link
            aria-hidden={offset !== 0}
            aria-label={offset === 0 ? `打开${destination.name}签证攻略` : undefined}
            className="popular-stack-card"
            data-stack-position={offset}
            href={`/country/${destination.code}`}
            key={destination.code}
            tabIndex={offset === 0 ? 0 : -1}
          >
            <span
              aria-hidden="true"
              className={`popular-stack-flag fi fi-${destination.code}`}
            />
            <span className="popular-stack-copy">
              <small>{destination.signal} · {destination.continent}</small>
              <strong>{destination.name}</strong>
              <span>{destination.city}</span>
            </span>
            <span className="popular-stack-action">查看攻略 ↗</span>
          </Link>
        ))}
      </div>

      <div className="popular-rail-controls">
        <span aria-live="polite">{String(activeIndex + 1).padStart(2, "0")} / {destinationCount}</span>
        <strong>{activeDestination.name}</strong>
        <div>
          <button aria-label="上一个热门国家" onClick={() => move(-1)} type="button">←</button>
          <button aria-label="下一个热门国家" onClick={() => move(1)} type="button">→</button>
        </div>
        <small>悬停滚轮旋转</small>
      </div>
    </div>
  );
}
