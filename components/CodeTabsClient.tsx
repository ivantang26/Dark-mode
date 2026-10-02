"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { LANG_KEY, useSessionValue } from "@/lib/session-store";
import type { SdkLang } from "@/lib/snippets";
import CopyButton from "./CopyButton";

type Panel = { id: SdkLang; label: string; code: string; html: string };

const IDS: readonly SdkLang[] = ["python", "javascript", "go", "curl"];

export default function CodeTabsClient({ panels, title, where }: { panels: Panel[]; title?: string; where: string }) {
  // Shared across every CodeTabs on every page for the session.
  const [lang, setLang] = useSessionValue<SdkLang>(LANG_KEY, "python", IDS);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = panels.find((p) => p.id === lang) ?? panels[0];

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = panels.findIndex((p) => p.id === active.id);
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % panels.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + panels.length) % panels.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = panels.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setLang(panels[next].id);
    tabs.current[next]?.focus();
  }

  return (
    <div className="code">
      <div className="flex items-center justify-between gap-2 border-b border-line pr-2">
        <div role="tablist" aria-label={title ?? "Language"} className="tab-row min-w-0 pl-1" onKeyDown={onKeyDown}>
          {panels.map((p, i) => (
            <button
              key={p.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`${base}-tab-${p.id}`}
              aria-selected={p.id === active.id}
              aria-controls={`${base}-panel`}
              tabIndex={p.id === active.id ? 0 : -1}
              className="tab"
              onClick={() => setLang(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <CopyButton text={active.code} where={`${where}:${active.id}`} className="flex-none" />
      </div>
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${active.id}`}
        // Lets keyboard users reach the scrollable code.
        tabIndex={0}
        className="rounded-b-[var(--radius)]"
        dangerouslySetInnerHTML={{ __html: active.html }}
      />
    </div>
  );
}
