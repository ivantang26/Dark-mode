import type { Metadata } from "next";
import Link from "next/link";
import CostCalculator from "@/components/CostCalculator";
import { PageHero, SectionHeading } from "@/components/ui";
import { calcFromParams, compact, contextLabel, getModel, models, pricePerM, pricing, tiers } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Per-token pricing for every Synapse model, free tier details, rate limits by tier and a cost calculator you can share.",
};

const fmtLimit = (n: number | null) => (n === null ? "Custom" : n.toLocaleString("en-US"));

export default async function PricingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const initial = calcFromParams(await searchParams);
  const freeModels = pricing.freeTier.models.map((id) => getModel(id)?.name).filter(Boolean);
  const batch = (n: number) => pricePerM(n * (1 - pricing.batchDiscount));

  return (
    <>
      <PageHero
        eyebrow="pricing"
        title="Pay per token. Nothing else."
        intro={`No seats, no minimums, no platform fee. Every account gets $${pricing.freeTier.monthlyCredit} of credit each month, and the Batch API halves the price of anything that can wait a few hours.`}
      />

      {/* Per-model prices */}
      <section className="container-x py-20" aria-labelledby="prices">
        <SectionHeading id="prices" eyebrow="per million tokens" title="Model prices" intro={`Prices in USD, updated ${new Date(pricing.updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`} />

        {/* Phones: a card per model with the key figures. */}
        <ul className="mt-10 grid gap-3 md:hidden">
          {models.map((m) => (
            <li key={m.id} className="card p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold">{m.name}</h3>
                <span className="font-mono text-[12px] text-mute">{contextLabel(m.contextTokens)} ctx</span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[13px]">
                <div>
                  <dt className="text-mute">input</dt>
                  <dd className="text-[16px]">{pricePerM(m.inputPerM)}</dd>
                </div>
                <div>
                  <dt className="text-mute">output</dt>
                  <dd className="text-[16px]">{pricePerM(m.outputPerM)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        {/* Tablet: fewer columns. Desktop: the full table. */}
        <div className="card mt-10 hidden overflow-hidden md:block">
          <table className="w-full border-collapse text-left text-[15px]">
            <caption className="sr-only">Price per million tokens for each model</caption>
            <thead className="font-mono text-[12px] uppercase tracking-[0.08em] text-mute">
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-3.5 font-normal">Model</th>
                <th scope="col" className="hidden px-5 py-3.5 font-normal lg:table-cell">Modalities</th>
                <th scope="col" className="px-5 py-3.5 font-normal">Context</th>
                <th scope="col" className="px-5 py-3.5 text-right font-normal">Input</th>
                <th scope="col" className="px-5 py-3.5 text-right font-normal">Output</th>
                <th scope="col" className="hidden px-5 py-3.5 text-right font-normal lg:table-cell">Batch in / out</th>
                <th scope="col" className="hidden px-5 py-3.5 text-right font-normal lg:table-cell">Speed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {models.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-surface-2/60">
                  <th scope="row" className="px-5 py-4 font-medium">
                    {m.name}
                    <span className="mt-0.5 block font-mono text-[12px] font-normal text-mute">{m.id}</span>
                  </th>
                  <td className="hidden px-5 py-4 font-mono text-[13px] text-mute lg:table-cell">{m.modalities.join(", ")}</td>
                  <td className="px-5 py-4 font-mono">{contextLabel(m.contextTokens)}</td>
                  <td className="px-5 py-4 text-right font-mono">{pricePerM(m.inputPerM)}</td>
                  <td className="px-5 py-4 text-right font-mono">{pricePerM(m.outputPerM)}</td>
                  <td className="hidden px-5 py-4 text-right font-mono text-mute lg:table-cell">
                    {batch(m.inputPerM)} / {m.outputPerM ? batch(m.outputPerM) : "—"}
                  </td>
                  <td className="hidden px-5 py-4 text-right font-mono text-mute lg:table-cell">{compact(m.tokensPerSecond)} tok/s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[14px] text-mute">
          Fine-tuned models are billed at 1.5× the base price. Cached input tokens are billed at 25%. Compare capabilities in the{" "}
          <Link href="/models" className="prose-link">
            model catalogue
          </Link>
          .
        </p>
      </section>

      {/* Free tier */}
      <section className="container-x py-12" aria-labelledby="free">
        <div className="card spotlight grid gap-8 p-6 md:grid-cols-[1fr_1.2fr] md:p-10">
          <div>
            <p className="eyebrow">free tier</p>
            <h2 id="free" className="h2 mt-3" data-reveal>
              ${pricing.freeTier.monthlyCredit} every month, no card.
            </h2>
          </div>
          <ul className="grid gap-3 text-[15px] sm:grid-cols-2">
            {[
              ["Credit", `$${pricing.freeTier.monthlyCredit} per month, resets on the 1st`],
              ["Models", freeModels.join(", ")],
              ["Rate limit", `${pricing.freeTier.requestsPerMinute} requests and ${compact(pricing.freeTier.tokensPerMinute)} tokens per minute`],
              ["Upgrade", "Add a card any time; unused credit still applies"],
            ].map(([k, v]) => (
              <li key={k} className="rounded-[var(--radius-sm)] border border-line bg-bg/50 p-4">
                <span className="block font-mono text-[12px] uppercase tracking-[0.1em] text-mute">{k}</span>
                <span className="mt-1 block">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Rate limits */}
      <section className="container-x py-20" aria-labelledby="rate-limits">
        <SectionHeading
          id="rate-limits"
          eyebrow="rate limits"
          title="Limits that grow with you."
          intro="Tiers upgrade automatically as you spend. Limits apply per organisation, across all models."
        />
        <div className="mt-10 overflow-x-auto rounded-[var(--radius)] border border-line bg-surface-1">
          <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
            <caption className="sr-only">Rate limits by tier</caption>
            <thead className="font-mono text-[12px] uppercase tracking-[0.08em] text-mute">
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-3.5 font-normal">Tier</th>
                <th scope="col" className="px-5 py-3.5 font-normal">Qualifies at</th>
                <th scope="col" className="px-5 py-3.5 text-right font-normal">Requests / min</th>
                <th scope="col" className="px-5 py-3.5 text-right font-normal">Tokens / min</th>
                <th scope="col" className="px-5 py-3.5 text-right font-normal">Requests / day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line font-mono">
              {tiers.map((t) => (
                <tr key={t.id}>
                  <th scope="row" className="px-5 py-4 font-sans font-medium">
                    {t.name}
                  </th>
                  <td className="px-5 py-4 font-sans text-mute">{t.qualifies}</td>
                  <td className="px-5 py-4 text-right">{fmtLimit(t.requestsPerMinute)}</td>
                  <td className="px-5 py-4 text-right">{fmtLimit(t.tokensPerMinute)}</td>
                  <td className="px-5 py-4 text-right">{t.requestsPerDay === null ? "Unlimited" : fmtLimit(t.requestsPerDay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Calculator */}
      <section className="container-x py-12" aria-labelledby="calculator">
        <SectionHeading
          id="calculator"
          eyebrow="cost calculator"
          title="Estimate a month."
          intro="Uses the same price list as the table above. Change any input and the link updates, so you can paste the estimate into a ticket."
        />
        <div className="mt-10">
          <CostCalculator initial={initial} />
        </div>
      </section>

      <section className="container-x py-20">
        <div className="card flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center md:p-8">
          <div>
            <h2 className="text-h3 font-semibold">Over 10 billion tokens a month?</h2>
            <p className="mt-1 text-mute">Committed-use discounts, dedicated capacity and invoicing.</p>
          </div>
          <Link href="/enterprise#contact" className="btn btn-secondary">
            Talk to us
          </Link>
        </div>
      </section>
    </>
  );
}
