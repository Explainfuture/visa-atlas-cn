"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { CircleHelp } from "lucide-react";

export function SchengenVisaTooltip({
  className,
  label,
}: {
  className?: string;
  label: string;
}) {
  return (
    <Tooltip.Provider delayDuration={180} skipDelayDuration={250}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            aria-label={`${label}，查看“申根签证”解释`}
            className={`${className ?? ""} schengen-tooltip-trigger`}
            type="button"
          >
            <span>{label}</span>
            <CircleHelp aria-hidden="true" size={14} strokeWidth={2.2} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="schengen-tooltip-content"
            collisionPadding={16}
            side="bottom"
            sideOffset={9}
          >
            <strong>申根签证是什么？</strong>
            <span>
              申根国家共同使用的短期签证，通常可在申根区内旅行；整个申根区合计遵守“任意 180 天内最多停留 90 天”。
            </span>
            <small>最终以签证页标注的有效期、停留天数、入境次数和适用地域为准。</small>
            <Tooltip.Arrow className="schengen-tooltip-arrow" width={14} height={7} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
