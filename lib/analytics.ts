"use client";

/**
 * Event hooks for the success metrics in the brief (copy events, calculator use,
 * quickstart completion, time to API key). Logs to the console and to
 * window.__synapseEvents; swap `send` for a real analytics client in production.
 */
export type EventName =
  | "code_copy"
  | "calculator_used"
  | "calculator_shared"
  | "quickstart_step"
  | "signup_started"
  | "signup_completed"
  | "palette_open"
  | "terminal_replay";

declare global {
  interface Window {
    __synapseEvents?: { name: EventName; props: Record<string, unknown>; at: number }[];
  }
}

const once = new Set<string>();

export function track(name: EventName, props: Record<string, unknown> = {}, opts: { oncePerPage?: boolean } = {}) {
  if (typeof window === "undefined") return;
  const key = `${name}:${JSON.stringify(props)}`;
  if (opts.oncePerPage) {
    if (once.has(key)) return;
    once.add(key);
  }
  (window.__synapseEvents ??= []).push({ name, props, at: Date.now() });
  if (process.env.NODE_ENV !== "production") console.debug("[track]", name, props);
}
