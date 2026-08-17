"use client";

import { Check, Clipboard, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { MaterialItem } from "@/data/visa-guides";

export function PreparationChecklist({
  countryName,
  items,
}: {
  countryName: string;
  items: readonly MaterialItem[];
}) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => new Set());
  const [copyLabel, setCopyLabel] = useState("复制清单");
  const checkedCount = checkedItems.size;
  const progress = items.length === 0 ? 0 : Math.round((checkedCount / items.length) * 100);

  function toggleItem(title: string) {
    setCheckedItems((current) => {
      const next = new Set(current);

      if (next.has(title)) next.delete(title);
      else next.add(title);

      return next;
    });
  }

  async function copyChecklist() {
    const text = [
      `${countryName}签证 / 入境材料清单`,
      ...items.map((item) => `□ [${item.kind}] ${item.title}：${item.detail}`),
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopyLabel("已复制");
    window.setTimeout(() => setCopyLabel("复制清单"), 1800);
  }

  return (
    <div className="preparation-checklist">
      <div className="checklist-toolbar">
        <div className="checklist-progress" aria-live="polite">
          <strong>{checkedCount} / {items.length}</strong>
          <span>已放进材料夹</span>
        </div>
        <div className="checklist-actions">
          <button type="button" onClick={copyChecklist}>
            <Clipboard aria-hidden="true" size={16} />
            {copyLabel}
          </button>
          {checkedCount > 0 ? (
            <button type="button" onClick={() => setCheckedItems(new Set())}>
              <RotateCcw aria-hidden="true" size={16} />
              重置
            </button>
          ) : null}
        </div>
      </div>

      <div className="checklist-meter" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <ul className="action-materials-list">
        {items.map((item) => {
          const checked = checkedItems.has(item.title);

          return (
            <li className={checked ? "is-checked" : undefined} key={item.title}>
              <label>
                <input
                  checked={checked}
                  onChange={() => toggleItem(item.title)}
                  type="checkbox"
                />
                <span className="material-check" aria-hidden="true">
                  <Check size={15} />
                </span>
                <span className="material-copy">
                  <span className="material-title-row">
                    <strong>{item.title}</strong>
                    <small>{item.kind}</small>
                  </span>
                  <span>{item.detail}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
