/**
 * The one place prices come from. The pricing table, the model catalogue and the
 * cost calculator all read `data/pricing.json` through this module, so they can't disagree.
 */
import data from "@/data/pricing.json";

export type Modality = "text" | "vision" | "code" | "audio" | "embeddings";

export type Model = {
  id: string;
  name: string;
  tagline: string;
  modalities: Modality[];
  contextTokens: number;
  inputPerM: number;
  outputPerM: number;
  tokensPerSecond: number;
  ttftMs: number;
  fineTune: boolean;
  evals: { reasoning: number; code: number };
  released: string;
  featured?: boolean;
};

export type Tier = {
  id: string;
  name: string;
  qualifies: string;
  requestsPerMinute: number | null;
  tokensPerMinute: number | null;
  requestsPerDay: number | null;
};

export const pricing = data as {
  currency: string;
  updated: string;
  daysPerMonth: number;
  batchDiscount: number;
  freeTier: { monthlyCredit: number; requestsPerMinute: number; tokensPerMinute: number; models: string[]; card: boolean };
  models: Model[];
  tiers: Tier[];
};

export const models = pricing.models;
export const tiers = pricing.tiers;
export const DEFAULT_MODEL = "syn-flash";
export const MODALITIES: Modality[] = ["text", "vision", "code", "audio", "embeddings"];

export function getModel(id: string | null | undefined): Model | undefined {
  return models.find((m) => m.id === id);
}

/** Peaks are assumed to run at twice the daily average when picking a tier. */
export const PEAK_FACTOR = 2;

export type Estimate = {
  model: Model;
  requestsPerDay: number;
  inputTokens: number;
  outputTokens: number;
  batch: boolean;
  monthlyRequests: number;
  monthlyInputTokens: number;
  monthlyOutputTokens: number;
  inputCost: number;
  outputCost: number;
  subtotal: number;
  freeCredit: number;
  total: number;
  peakRpm: number;
  peakTpm: number;
  tier: Tier;
};

export function estimate(input: {
  modelId: string;
  requestsPerDay: number;
  inputTokens: number;
  outputTokens: number;
  batch?: boolean;
}): Estimate {
  const model = getModel(input.modelId) ?? getModel(DEFAULT_MODEL)!;
  const rpd = clampInt(input.requestsPerDay, 0, 100_000_000);
  const inTok = clampInt(input.inputTokens, 0, model.contextTokens);
  const outTok = model.outputPerM === 0 ? 0 : clampInt(input.outputTokens, 0, model.contextTokens);
  const batch = Boolean(input.batch);
  const factor = batch ? 1 - pricing.batchDiscount : 1;

  const monthlyRequests = rpd * pricing.daysPerMonth;
  const monthlyInputTokens = monthlyRequests * inTok;
  const monthlyOutputTokens = monthlyRequests * outTok;
  const inputCost = (monthlyInputTokens / 1e6) * model.inputPerM * factor;
  const outputCost = (monthlyOutputTokens / 1e6) * model.outputPerM * factor;
  const subtotal = inputCost + outputCost;
  const freeCredit = pricing.freeTier.models.includes(model.id) ? Math.min(subtotal, pricing.freeTier.monthlyCredit) : 0;

  const peakRpm = Math.ceil((rpd / 1440) * PEAK_FACTOR);
  const peakTpm = peakRpm * (inTok + outTok);
  const tier =
    tiers.find(
      (t) =>
        (t.requestsPerMinute === null || peakRpm <= t.requestsPerMinute) &&
        (t.tokensPerMinute === null || peakTpm <= t.tokensPerMinute) &&
        (t.requestsPerDay === null || rpd <= t.requestsPerDay),
    ) ?? tiers[tiers.length - 1];

  return {
    model,
    requestsPerDay: rpd,
    inputTokens: inTok,
    outputTokens: outTok,
    batch,
    monthlyRequests,
    monthlyInputTokens,
    monthlyOutputTokens,
    inputCost,
    outputCost,
    subtotal,
    freeCredit,
    total: subtotal - freeCredit,
    peakRpm,
    peakTpm,
    tier,
  };
}

function clampInt(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.round(n)));
}

/* ---------- Shareable URL state (FR-4) ---------- */

export type CalcState = { modelId: string; requestsPerDay: number; inputTokens: number; outputTokens: number; batch: boolean };

export const DEFAULT_CALC: CalcState = { modelId: DEFAULT_MODEL, requestsPerDay: 10_000, inputTokens: 800, outputTokens: 300, batch: false };

export function calcFromParams(params: URLSearchParams | Record<string, string | string[] | undefined>): CalcState {
  const get = (k: string) => {
    if (params instanceof URLSearchParams) return params.get(k);
    const v = params[k];
    return Array.isArray(v) ? v[0] : v ?? null;
  };
  const num = (k: string, fallback: number) => {
    const raw = get(k);
    if (raw === null || raw === "") return fallback;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? Math.round(n) : fallback;
  };
  const m = get("model");
  return {
    modelId: getModel(m) ? m! : DEFAULT_CALC.modelId,
    requestsPerDay: num("rpd", DEFAULT_CALC.requestsPerDay),
    inputTokens: num("in", DEFAULT_CALC.inputTokens),
    outputTokens: num("out", DEFAULT_CALC.outputTokens),
    batch: get("batch") === "1",
  };
}

export function calcToParams(s: CalcState): URLSearchParams {
  const p = new URLSearchParams({ model: s.modelId, rpd: String(s.requestsPerDay), in: String(s.inputTokens), out: String(s.outputTokens) });
  if (s.batch) p.set("batch", "1");
  return p;
}

/* ---------- Formatting ---------- */

export function usd(n: number, opts: { precise?: boolean } = {}) {
  const digits = opts.precise ? (n < 1 ? 3 : 2) : n >= 1000 ? 0 : 2;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
}

export function pricePerM(n: number) {
  if (n === 0) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function compact(n: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function contextLabel(tokens: number) {
  return tokens >= 1_000_000 ? `${tokens / 1_000_000}M` : `${Math.round(tokens / 1000)}K`;
}

/** A single comparable price: 3 input tokens per output token, the typical chat ratio. */
export function blendedPrice(m: Model) {
  return m.outputPerM === 0 ? m.inputPerM : (3 * m.inputPerM + m.outputPerM) / 4;
}
