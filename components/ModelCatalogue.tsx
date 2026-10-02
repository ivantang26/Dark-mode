"use client";

import { useId, useMemo, useState } from "react";
import { blendedPrice, MODALITIES, models, type Modality } from "@/lib/pricing";
import { ModelCard } from "./ui";

type Sort = "price" | "speed" | "context";

const CONTEXT_OPTIONS = [
  { value: 0, label: "Any length" },
  { value: 32_000, label: "32K or more" },
  { value: 128_000, label: "128K or more" },
  { value: 200_000, label: "200K or more" },
  { value: 1_000_000, label: "1M" },
];

const PRICE_OPTIONS = [
  { value: Infinity, label: "Any price" },
  { value: 0.25, label: "Up to $0.25" },
  { value: 1, label: "Up to $1" },
  { value: 5, label: "Up to $5" },
];

/** Model catalogue (FR-5): filter by modality, context and price; sort by price or speed. */
export default function ModelCatalogue() {
  const [mods, setMods] = useState<Modality[]>([]);
  const [minContext, setMinContext] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [sort, setSort] = useState<Sort>("price");
  const id = useId();

  const list = useMemo(() => {
    const filtered = models.filter(
      (m) => (mods.length === 0 || mods.some((x) => m.modalities.includes(x))) && m.contextTokens >= minContext && blendedPrice(m) <= maxPrice,
    );
    return filtered.sort((a, b) =>
      sort === "price" ? blendedPrice(a) - blendedPrice(b) : sort === "speed" ? b.tokensPerSecond - a.tokensPerSecond : b.contextTokens - a.contextTokens,
    );
  }, [mods, minContext, maxPrice, sort]);

  const toggle = (m: Modality) => setMods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  const reset = () => {
    setMods([]);
    setMinContext(0);
    setMaxPrice(Infinity);
  };
  const filtered = mods.length > 0 || minContext > 0 || maxPrice !== Infinity;

  return (
    <div>
      <div className="card grid gap-5 p-4 md:p-5 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:items-end">
        <fieldset>
          <legend className="label mb-2">Modality</legend>
          <div className="flex flex-wrap gap-2">
            {MODALITIES.map((m) => {
              const on = mods.includes(m);
              return (
                <label
                  key={m}
                  className={`relative inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3 font-mono text-[13px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cyan ${on ? "border-violet bg-violet/15 text-text shadow-[0_0_16px_-4px_rgba(139,92,246,0.7)]" : "border-line-strong text-mute hover:text-text"}`}
                >
                  <input type="checkbox" className="absolute opacity-0" checked={on} onChange={() => toggle(m)} />
                  {on && <span aria-hidden="true">✓&nbsp;</span>}
                  {m}
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="field">
          <label className="label" htmlFor={`${id}-ctx`}>
            Context length
          </label>
          <select id={`${id}-ctx`} className="input" value={minContext} onChange={(e) => setMinContext(Number(e.target.value))}>
            {CONTEXT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor={`${id}-price`}>
            Blended price / 1M
          </label>
          <select id={`${id}-price`} className="input" value={String(maxPrice)} onChange={(e) => setMaxPrice(Number(e.target.value))}>
            {PRICE_OPTIONS.map((o) => (
              <option key={o.label} value={String(o.value)}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor={`${id}-sort`}>
            Sort by
          </label>
          <select id={`${id}-sort`} className="input" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="price">Price, lowest first</option>
            <option value="speed">Speed, fastest first</option>
            <option value="context">Context, largest first</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="font-mono text-[13px] text-mute" role="status">
          {list.length} of {models.length} models
        </p>
        {filtered && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            Clear filters
          </button>
        )}
      </div>

      {list.length ? (
        <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => (
            <li key={m.id}>
              <ModelCard model={m} detail />
            </li>
          ))}
        </ul>
      ) : (
        <div className="card mt-4 grid place-items-center gap-3 p-12 text-center">
          <p>No models match those filters.</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={reset}>
            Clear filters
          </button>
        </div>
      )}
      <p className="mt-6 text-[14px] text-mute">
        Blended price assumes three input tokens per output token. Evals are Synapse internal benchmarks (0 to 100), run on the same harness for every model.
      </p>
    </div>
  );
}
