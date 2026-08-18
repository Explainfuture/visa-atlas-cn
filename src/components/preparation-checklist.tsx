"use client";

import { ArrowUpRight, Check, Clipboard, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { MaterialItem } from "@/data/visa-guides";

export function PreparationChecklist({
  countryName,
  items,
  fallbackReference,
}: {
  countryName: string;
  items: readonly MaterialItem[];
  fallbackReference: {
    label: string;
    url: string;
  };
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
      ...items.map((item) => {
        const reference = item.reference ?? fallbackReference;
        return `□ [${item.kind}] ${item.title}：${item.detail}\n  用途：${materialPurpose(item)}\n  参考：${reference.label} ${reference.url}`;
      }),
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
            <li
              className={checked ? "is-checked" : undefined}
              data-kind={item.kind}
              key={item.title}
            >
              <label className="material-checkbox-row">
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
              <div className="material-reference-row">
                <span>
                  <strong>用途</strong>
                  {materialPurpose(item)}
                </span>
                <a
                  href={(item.reference ?? fallbackReference).url}
                  rel="noreferrer"
                  target="_blank"
                >
                  参考 · {(item.reference ?? fallbackReference).label}
                  <ArrowUpRight aria-hidden="true" size={14} />
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const purposeRules: ReadonlyArray<readonly [RegExp, string]> = [
  [/护照|旅行证件/, "确认身份与证件资格"],
  [/照片|申请表/, "建立申请档案并核对本人"],
  [/机票|交通|行程|路线/, "证明真实访问计划与离境安排"],
  [/住宿|酒店|接待/, "说明停留地点与责任联系人"],
  [/流水|资金|收入|在职|在读|退休|经济/, "证明费用来源与回国约束"],
  [/保险|医疗|撤离/, "覆盖医疗、遣返与紧急风险"],
  [/邀请|关系|资助|担保|组织方/, "证明访问事由与承担责任的人"],
  [/疫苗|接种|健康/, "满足口岸公共卫生要求"],
  [/付款|银行卡|邮箱/, "完成线上提交并接收结果"],
];

function materialPurpose(item: MaterialItem) {
  if (item.purpose) return item.purpose;
  return purposeRules.find(([pattern]) => pattern.test(`${item.title}${item.detail}`))?.[1] ?? "支持官方对旅行目的的审查";
}
