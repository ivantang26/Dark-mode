"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type Status = { p50LatencyMs: number; uptime90d: number; requestsPerDay: number; updatedAt: string };

const POLL_MS = 60_000;

/**
 * Live metrics (FR-3): polls the status endpoint every 60 seconds, shows when it last
 * updated, and falls back to a status page link when the call fails.
 * Add ?status=down to the page URL to see the fallback.
 */
export default function MetricsStrip() {
  const [data, setData] = useState<Status | null>(null);
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (site.metricsMode === "sla") return;
    let alive = true;
    let ctrl = new AbortController();
    const simulateFailure = new URLSearchParams(window.location.search).get("status") === "down";
    const endpoint = simulateFailure ? `${site.statusEndpoint}?fail=1` : site.statusEndpoint;

    async function load() {
      ctrl = new AbortController();
      try {
        const timeout = window.setTimeout(() => ctrl.abort(), 8000);
        const res = await fetch(endpoint, { signal: ctrl.signal, cache: "no-store" }).finally(() => window.clearTimeout(timeout));
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as Status;
        if (typeof json.p50LatencyMs !== "number") throw new Error("bad payload");
        if (alive) {
          setData(json);
          setFailed(false);
        }
      } catch {
        if (alive) setFailed(true);
      }
    }

    load();
    const poll = window.setInterval(load, POLL_MS);
    const tick = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => {
      alive = false;
      ctrl.abort();
      window.clearInterval(poll);
      window.clearInterval(tick);
    };
  }, []);

  if (site.metricsMode === "sla") {
    return (
      <Strip note="Published SLA">
        <Metric label="p50 latency SLA" value={`≤ ${site.sla.p50LatencyMs}ms`} />
        <Metric label="uptime SLA" value={`${site.sla.uptime}%`} />
      </Strip>
    );
  }

  if (failed && !data) {
    return (
      <Strip note={null}>
        <span className="pill">
          <span className="dot" data-state="down" aria-hidden="true" />
          Live metrics unavailable.{" "}
          <a className="prose-link" href={site.statusUrl} target="_blank" rel="noreferrer">
            See status page
          </a>
        </span>
      </Strip>
    );
  }

  const ago = data ? Math.max(0, Math.round((now - new Date(data.updatedAt).getTime()) / 1000)) : null;
  const updated = ago === null ? "Connecting…" : ago < 20 ? "Updated just now" : `Updated ${ago < 60 ? `${ago}s` : `${Math.round(ago / 60)}m`} ago`;

  return (
    <Strip note={failed ? "Showing last known values. Live update failed." : updated}>
      <Metric label="p50 latency" value={data ? `${data.p50LatencyMs}ms` : "—"} live />
      <Metric label="uptime 90d" value={data ? `${data.uptime90d.toFixed(3)}%` : "—"} live />
      <Metric label="requests/day" value={data ? new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(data.requestsPerDay) : "—"} live />
    </Strip>
  );
}

function Strip({ children, note }: { children: React.ReactNode; note: string | null }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
      {note !== null && (
        <p className="font-mono text-[12px] text-mute">
          {note} ·{" "}
          <a className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-text" href={site.statusUrl} target="_blank" rel="noreferrer">
            status page ↗
          </a>
        </p>
      )}
    </div>
  );
}

function Metric({ label, value, live }: { label: string; value: string; live?: boolean }) {
  return (
    <span className="pill">
      {live && <span className="dot" aria-hidden="true" />}
      {label} <strong>{value}</strong>
    </span>
  );
}
