"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

/** Copies `text`; confirms with "Copied" for 2 seconds (FR-1). */
export default function CopyButton({ text, label = "Copy", where, className = "" }: { text: string; label?: string; where?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for http:// or blocked clipboard API.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    track("code_copy", { where: where ?? "unknown" });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[12px] text-mute transition-colors hover:border-line-strong hover:text-text ${copied ? "!text-lime" : ""} ${className}`}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="m3 8.5 3 3 7-7" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" />
          <path d="M10.5 5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5H5" />
        </svg>
      )}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
