/**
 * Public status JSON (FR-3). Stands in for the status provider's endpoint: numbers
 * drift a little on each call so the strip visibly updates. Add ?fail=1 to get a 503
 * and see the fallback.
 */
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("fail") === "1") {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  // A smooth wobble keyed to the minute, so refreshes within a minute agree.
  const minute = Math.floor(Date.now() / 60_000);
  const wobble = (seed: number) => Math.sin(minute * 0.37 + seed) * 0.5 + Math.sin(minute * 0.11 + seed * 2) * 0.5;

  const body = {
    status: "operational",
    p50LatencyMs: Math.round(182 + wobble(1) * 14),
    p99LatencyMs: Math.round(640 + wobble(2) * 60),
    uptime90d: 99.987,
    requestsPerDay: Math.round(2_430_000_000 + wobble(3) * 60_000_000),
    regions: { "us-east": "operational", "eu-west": "operational", "ap-southeast": "operational" },
    updatedAt: new Date().toISOString(),
  };

  return Response.json(body, {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=30", "Access-Control-Allow-Origin": "*" },
  });
}
