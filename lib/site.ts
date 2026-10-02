export const site = {
  name: "Synapse",
  url: "https://synapse.example",
  statusUrl: "https://status.synapse.example",
  consoleUrl: "https://console.synapse.example",
  /**
   * Open question from the brief: are live latency figures approved for public display?
   * "live" polls /api/status (FR-3). "sla" shows the published SLA numbers instead.
   */
  metricsMode: (process.env.NEXT_PUBLIC_METRICS_MODE === "sla" ? "sla" : "live") as "live" | "sla",
  sla: { p50LatencyMs: 250, uptime: 99.9, requestsPerDay: null as number | null },
  statusEndpoint: process.env.NEXT_PUBLIC_STATUS_ENDPOINT ?? "/api/status",
};

export const nav = [
  { href: "/models", label: "Models" },
  { href: "/pricing", label: "Pricing" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/changelog", label: "Changelog" },
];
