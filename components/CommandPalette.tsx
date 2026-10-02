"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/docs";
import { track } from "@/lib/analytics";

/** Docs search (FR-8): Cmd/Ctrl + K opens a palette over docs titles, headings and key pages. */
export default function CommandPalette({ index }: { index: SearchEntry[] }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [isMac, setIsMac] = useState(true);
  const listId = useId();

  const results = useMemo(() => search(index, q), [index, q]);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) close();
        else open();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setActive(0), [q]);

  function open() {
    setQ("");
    dialog.current?.showModal();
    input.current?.focus();
    track("palette_open");
  }
  function close() {
    dialog.current?.close();
  }
  function go(entry: SearchEntry | undefined) {
    if (!entry) return;
    close();
    router.push(entry.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  }

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId]);

  let lastGroup = "";

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="hidden items-center gap-3 rounded-lg border border-line bg-surface-1 py-1.5 pl-3 pr-1.5 text-[14px] text-mute transition-colors hover:border-line-strong hover:text-text md:inline-flex"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3 3" />
        </svg>
        Search docs
        <kbd className="rounded border border-line bg-bg px-1.5 py-0.5 font-mono text-[11px]">{isMac ? "⌘K" : "Ctrl K"}</kbd>
      </button>
      <button type="button" onClick={open} className="btn btn-ghost md:hidden" aria-label="Search docs">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3 3" />
        </svg>
      </button>

      <dialog
        ref={dialog}
        aria-label="Search docs"
        className="palette m-auto mt-[12vh] w-[min(640px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-line-strong bg-surface-1 p-0 text-text shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9),0_0_60px_-10px_rgba(139,92,246,0.35)] backdrop:bg-black/60 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-none text-mute" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" />
            <path d="m10.5 10.5 3 3" />
          </svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search docs, headings and pages…"
            className="h-14 w-full bg-transparent text-[16px] text-text outline-none placeholder:text-mute focus-visible:shadow-none focus-visible:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
          />
          <kbd className="flex-none rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-mute">Esc</kbd>
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-[15px] text-mute">No results for “{q}”.</li>}
          {results.map((r, i) => {
            const header = r.group !== lastGroup ? r.group : null;
            lastGroup = r.group;
            return (
              <li key={r.href + i} role="presentation">
                {header && <div className="px-3 pb-1 pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-mute">{header}</div>}
                <div
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(r)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] ${i === active ? "bg-surface-2 text-text" : "text-[#cfcfdb]"}`}
                >
                  <span className={`font-mono text-[12px] ${r.kind === "heading" ? "text-mute" : "text-violet-soft"}`} aria-hidden="true">
                    {r.kind === "heading" ? "#" : r.kind === "doc" ? "▤" : "→"}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{r.title}</span>
                  {i === active && <span className="font-mono text-[11px] text-mute">↵</span>}
                </div>
              </li>
            );
          })}
        </ul>
      </dialog>
    </>
  );
}

function search(index: SearchEntry[], q: string): SearchEntry[] {
  const query = q.trim().toLowerCase();
  if (!query) return index.filter((e) => e.kind !== "heading").slice(0, 10);
  const words = query.split(/\s+/);
  return index
    .map((e) => {
      const hay = `${e.title} ${e.group}`.toLowerCase();
      if (!words.every((w) => hay.includes(w))) return null;
      const t = e.title.toLowerCase();
      const score = (t.startsWith(query) ? 0 : t.includes(query) ? 1 : 2) + (e.kind === "heading" ? 0.5 : 0);
      return { e, score };
    })
    .filter((x): x is { e: SearchEntry; score: number } => x !== null)
    .sort((a, b) => a.score - b.score)
    .slice(0, 12)
    .map((x) => x.e)
    // Keep each group together, groups ordered by their best match.
    .reduce<SearchEntry[][]>((groups, e) => {
      const g = groups.find((g) => g[0].group === e.group);
      if (g) g.push(e);
      else groups.push([e]);
      return groups;
    }, [])
    .flat();
}
