"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type PopularDestination = {
  city: string;
  code: string;
  continent: string;
  image?: {
    alt: string;
    artist: string;
    caption: string;
    license: string;
    sourceUrl: string;
    url: string;
  };
  name: string;
  signal: string;
};

const WHEEL_THRESHOLD = 20;
const WHEEL_COOLDOWN = 260;
const SWIPE_THRESHOLD = 36;
const STACK_DEPTH = 3;

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

function getStackOffset(index: number, activeIndex: number, length: number) {
  let offset = wrapIndex(index - activeIndex, length);
  if (offset > length / 2) offset -= length;
  return offset;
}

export function PopularDestinationShowcase({ destinations }: {
  destinations: readonly PopularDestination[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const pointerGestureRef = useRef<{
    handled: boolean;
    pointerId: number;
    startY: number;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const touchHandledRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
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

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) return;

      suppressClickRef.current = false;
      touchHandledRef.current = false;
      touchStartYRef.current = event.touches[0].clientY;
    }

    function handleTouchMove(event: TouchEvent) {
      const startY = touchStartYRef.current;
      if (startY === null || touchHandledRef.current || event.touches.length !== 1) return;

      const delta = startY - event.touches[0].clientY;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;

      if (event.cancelable) event.preventDefault();
      touchHandledRef.current = true;
      suppressClickRef.current = true;
      setActiveIndex((current) => wrapIndex(current + (delta > 0 ? 1 : -1), destinationCount));
    }

    function handleTouchEnd() {
      touchHandledRef.current = false;
      touchStartYRef.current = null;
    }

    rail.addEventListener("wheel", handleWheel, { passive: false });
    rail.addEventListener("touchstart", handleTouchStart, { passive: true });
    rail.addEventListener("touchmove", handleTouchMove, { passive: false });
    rail.addEventListener("touchend", handleTouchEnd, { passive: true });
    rail.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      rail.removeEventListener("wheel", handleWheel);
      rail.removeEventListener("touchstart", handleTouchStart);
      rail.removeEventListener("touchmove", handleTouchMove);
      rail.removeEventListener("touchend", handleTouchEnd);
      rail.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [destinationCount]);

  useEffect(() => {
    if (destinationCount < 2) return;

    const neighboringImages = [-1, 1]
      .map((offset) => destinations[wrapIndex(activeIndex + offset, destinationCount)]?.image?.url)
      .filter((url): url is string => Boolean(url));
    const preloadTimer = window.setTimeout(() => {
      neighboringImages.forEach((url) => {
        const image = new Image();
        image.decoding = "async";
        image.src = url;
      });
    }, 180);

    return () => window.clearTimeout(preloadTimer);
  }, [activeIndex, destinationCount, destinations]);

  function move(direction: number) {
    setActiveIndex((current) => wrapIndex(current + direction, destinationCount));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown"
    ) return;

    event.preventDefault();
    move(event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (destinationCount < 2 || event.pointerType !== "mouse" || event.button !== 0) return;

    suppressClickRef.current = false;
    pointerGestureRef.current = {
      handled: false,
      pointerId: event.pointerId,
      startY: event.clientY,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const gesture = pointerGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId || gesture.handled) return;

    const delta = gesture.startY - event.clientY;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;

    event.preventDefault();
    gesture.handled = true;
    suppressClickRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    move(delta > 0 ? 1 : -1);
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    const gesture = pointerGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    pointerGestureRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!suppressClickRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }

  if (!activeDestination) return null;

  const backgroundImage = activeDestination.image
    ? `linear-gradient(90deg, rgba(220, 242, 250, 0.9) 0%, rgba(220, 242, 250, 0.54) 32%, rgba(220, 242, 250, 0.12) 66%, rgba(220, 242, 250, 0.18) 100%), linear-gradient(0deg, rgba(220, 242, 250, 0.2), rgba(220, 242, 250, 0.08)), url("${activeDestination.image.url}")`
    : undefined;

  return (
    <section className="featured-section" id="popular-destinations" aria-labelledby="featured-title">
      <div
        aria-hidden="true"
        className="popular-destination-backdrop"
        key={activeDestination.code}
        style={{ backgroundImage }}
      />

      <div className="popular-showcase-layout">
        <div className="section-heading featured-heading">
          <div>
            <p className="section-kicker">出境热榜</p>
            <h2 id="featured-title">热门景点</h2>
          </div>
        </div>

        <div
          aria-label="热门国家层叠胶囊，可上下滑动、使用滚轮或方向键旋转"
          className="popular-destination-rail"
          role="region"
        >
          <div
            aria-label="滚动切换热门国家"
            className="popular-stack-stage"
            onClickCapture={handleClickCapture}
            onKeyDown={handleKeyDown}
            onPointerCancel={handlePointerEnd}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
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
                <span className="popular-stack-action">攻略 ↗</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {activeDestination.image ? (
        <a
          className="popular-image-credit"
          href={activeDestination.image.sourceUrl}
          rel="noreferrer"
          target="_blank"
          title={`${activeDestination.image.caption} · ${activeDestination.image.artist} · ${activeDestination.image.license}`}
        >
          图片：{activeDestination.image.caption} · {activeDestination.image.artist} · {activeDestination.image.license} ↗
        </a>
      ) : null}
    </section>
  );
}
