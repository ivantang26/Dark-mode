"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { calcToParams, compact as compactNum, estimate, models, pricing, usd, type CalcState } from "@/lib/pricing";
import { MODEL_KEY, writeSession } from "@/lib/session-store";
import { track } from "@/lib/analytics";
import ApiKeyLink from "./ApiKeyLink";

/**
 * Cost calculator (FR-4). Reads the same pricing data as the table. In full mode the
 * state is mirrored into the URL so any estimate can be shared as a link.
 */
export default function CostCalculator({ initial, mode = "full" }: { initial: CalcState; mode?: "full" | "teaser" }) {
  const [s, setS] = useState<CalcState>(initial);
  const [shared, setShared] = useState(false);
  const touched = useRef(false);
  const id = useId();
  const est = useMemo(() => estimate(s), [s]);
  const full = mode === "full";

  function update(patch: Partial<CalcState>) {
    setS((prev) => ({ ...prev, ...patch }));
    if (!touched.current) {
      touched.current = true;
      track("calculator_used", { mode });
    }
    if (patch.modelId) writeSession(MODEL_KEY, patch.modelId);
  }

  // Keep the URL shareable without adding history entries.
  useEffect(() => {
    if (!full || !touched.current) return;
    const t = window.setTimeout(() => {
      const url = `${window.location.pathname}?${calcToParams(s).toString()}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", url);
    }, 250);
    return () => window.clearTimeout(t);
  }, [s, full]);

  async function share() {
    const url = `${window.location.origin}/pricing?${calcToParams(s).toString()}#calculator`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this link", url);
    }
    setShared(true);
    track("calculator_shared");
    window.setTimeout(() => setShared(false), 2000);
  }

  const outputDisabled = est.model.outputPerM === 0;

  return (
    <div className={`grid gap-4 ${full ? "md:grid-cols-[1fr_1fr] lg:grid-cols-[1.15fr_1fr] lg:items-start" : "md:grid-cols-[1fr_1fr]"}`}>
      <fieldset className="card grid gap-5 p-5 md:p-6">
        <legend className="sr-only">Usage</legend>

        <div className="field">
          <label className="label" htmlFor={`${id}-model`}>
            Model
          </label>
          <select id={`${id}-model`} className="input" value={s.modelId} onChange={(e) => update({ modelId: e.target.value })}>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.id})
              </option>
            ))}
          </select>
        </div>

        <NumberSlider
          id={`${id}-rpd`}
          label="Requests per day"
          value={s.requestsPerDay}
          onChange={(v) => update({ requestsPerDay: v })}
          min={0}
          max={10_000_000}
          log
        />

        {full && (
          <>
            <NumberSlider
              id={`${id}-in`}
              label="Average input tokens per request"
              value={s.inputTokens}
              onChange={(v) => update({ inputTokens: v })}
              min={0}
              max={Math.min(200_000, est.model.contextTokens)}
              log
            />
            <NumberSlider
              id={`${id}-out`}
              label="Average output tokens per request"
              hint={outputDisabled ? "Embeddings have no output tokens." : undefined}
              value={outputDisabled ? 0 : s.outputTokens}
              onChange={(v) => update({ outputTokens: v })}
              min={0}
              max={32_000}
              log
              disabled={outputDisabled}
            />
            <label className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-line p-3">
              <input type="checkbox" className="check mt-1" checked={s.batch} onChange={(e) => update({ batch: e.target.checked })} />
              <span>
                <span className="block text-[15px]">Use the Batch API</span>
                <span className="block text-[14px] text-mute">{pricing.batchDiscount * 100}% off, results within 24 hours.</span>
              </span>
            </label>
          </>
        )}
      </fieldset>

      <section aria-labelledby={`${id}-result`} className={`card relative overflow-hidden p-5 md:p-6 ${full ? "lg:sticky lg:top-24" : ""}`}>
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.28),transparent_65%)]" aria-hidden="true" />
        <h3 id={`${id}-result`} className="font-mono text-[12px] uppercase tracking-[0.12em] text-mute">
          Estimated monthly cost
        </h3>
        <p className="relative mt-2 font-mono text-[clamp(2.25rem,1.7rem+2vw,3.25rem)] leading-none tracking-[-0.03em]" aria-live="polite">
          {usd(est.total)}
        </p>
        <p className="mt-2 text-[14px] text-mute">
          {compactNum(est.monthlyRequests)} requests over {pricing.daysPerMonth} days on {est.model.name}
          {est.batch ? ", batched" : ""}.
        </p>

        {full ? (
          <dl className="mt-6 divide-y divide-line border-y border-line font-mono text-[13px]">
            <Row label={`Input · ${compactNum(est.monthlyInputTokens)} tokens`} value={usd(est.inputCost)} />
            <Row label={`Output · ${compactNum(est.monthlyOutputTokens)} tokens`} value={usd(est.outputCost)} />
            {est.batch && <Row label={`Batch discount (${pricing.batchDiscount * 100}%) applied`} value="included" muted />}
            <Row label="Free tier credit" value={est.freeCredit > 0 ? `−${usd(est.freeCredit)}` : "n/a"} muted={est.freeCredit === 0} />
            <Row label="Total" value={usd(est.total)} strong />
          </dl>
        ) : (
          <p className="mt-4 font-mono text-[13px] text-mute">
            Assumes {s.inputTokens} input and {s.outputTokens} output tokens per request.
          </p>
        )}

        {full && (
          <div className="mt-5 rounded-[var(--radius-sm)] border border-line bg-bg/60 p-3 text-[14px]">
            <p>
              <span className="text-mute">Fits </span>
              <Link href="/pricing#rate-limits" className="prose-link">
                {est.tier.name}
              </Link>
              <span className="text-mute"> rate limits</span>
            </p>
            <p className="mt-1 font-mono text-[12px] text-mute">
              peak ≈ {compactNum(est.peakRpm)} RPM · {compactNum(est.peakTpm)} TPM (2× daily average)
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <ApiKeyLink model={s.modelId} className="btn btn-primary" onClick={() => writeSession(MODEL_KEY, s.modelId)}>
            Get API key
          </ApiKeyLink>
          {full ? (
            <button type="button" className="btn btn-secondary" onClick={share}>
              <span aria-live="polite">{shared ? "Link copied" : "Copy share link"}</span>
            </button>
          ) : (
            <Link href={`/pricing?${calcToParams(s).toString()}#calculator`} className="btn btn-secondary">
              Full breakdown
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className={strong ? "text-text" : "text-mute"}>{label}</dt>
      <dd className={strong ? "text-[15px] text-text" : muted ? "text-mute" : "text-text"}>{value}</dd>
    </div>
  );
}

/* A number field and a (log-scale) slider bound to the same value. */
function NumberSlider({
  id,
  label,
  hint,
  value,
  onChange,
  min,
  max,
  log,
  disabled,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  log?: boolean;
  disabled?: boolean;
}) {
  const STEPS = 1000;
  const toSlider = (v: number) => (log ? Math.round((Math.log10(Math.max(1, v)) / Math.log10(max)) * STEPS) : v);
  const fromSlider = (p: number) => {
    if (!log) return p;
    if (p === 0) return 0;
    const raw = Math.pow(10, (p / STEPS) * Math.log10(max));
    const mag = Math.pow(10, Math.max(0, Math.floor(Math.log10(raw)) - 1));
    return Math.round(raw / mag) * mag; // two significant figures
  };
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  const invalid = text !== "" && (!/^\d+$/.test(text) || Number(text) > max);

  return (
    <div className="field">
      <div className="flex items-baseline justify-between gap-3">
        <label className="label" htmlFor={id}>
          {label}
        </label>
        <span className="font-mono text-[12px] text-mute" aria-hidden="true">
          max {compactNum(max)}
        </span>
      </div>
      <input
        id={id}
        className="input font-mono"
        inputMode="numeric"
        autoComplete="off"
        value={text}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={hint || invalid ? `${id}-hint` : undefined}
        onChange={(e) => {
          const t = e.target.value.replace(/[,\s_]/g, "");
          setText(t);
          if (/^\d+$/.test(t)) onChange(Math.min(max, Number(t)));
        }}
        onBlur={() => setText(String(value))}
      />
      <input
        type="range"
        className="range"
        min={0}
        max={log ? STEPS : max}
        value={toSlider(value)}
        disabled={disabled}
        aria-label={`${label} (slider)`}
        aria-valuetext={value.toLocaleString("en-US")}
        onChange={(e) => onChange(Math.max(min, fromSlider(Number(e.target.value))))}
      />
      {(hint || invalid) && (
        <p id={`${id}-hint`} className={`text-[13px] ${invalid ? "text-danger" : "text-mute"}`}>
          {invalid ? `Enter a whole number up to ${max.toLocaleString("en-US")}.` : hint}
        </p>
      )}
    </div>
  );
}
