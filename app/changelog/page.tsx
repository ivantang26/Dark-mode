import type { Metadata } from "next";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Changelog", description: "What's new in the Synapse API, SDKs and models." };

const entries = [
  { date: "2026-08-26", tag: "model", title: "Synapse Ultra with a 1M-token context", body: "Our most capable model. Text, vision and code in one, priced at $4 / $16 per million tokens." },
  { date: "2026-07-29", tag: "model", title: "Synapse Code", body: "A 256K-context model tuned for completion and refactors. Scores 88 on our code eval." },
  { date: "2026-07-08", tag: "api", title: "Parallel tool calls", body: "Flash, Code, Pro and Ultra can now return several tool calls in one turn." },
  { date: "2026-06-18", tag: "model", title: "Synapse Flash 2", body: "Same price, 30% faster. p50 time to first token is now 120ms." },
  { date: "2026-05-30", tag: "platform", title: "ap-southeast region", body: "Inference in Singapore with the same endpoints and limits as us-east and eu-west." },
  { date: "2026-05-02", tag: "sdk", title: "Go SDK 1.0", body: "Context-aware streaming with range-over-func iterators." },
];

export default function ChangelogPage() {
  return (
    <>
      <PageHero eyebrow="changelog" title="What shipped." intro="New models, API features and SDK releases. Breaking changes are announced 90 days ahead." />
      <section className="container-x py-16">
        <ol className="relative max-w-3xl border-l border-line">
          {entries.map((e) => (
            <li key={e.date + e.title} className="relative pb-12 pl-8 last:pb-0">
              <span className="absolute -left-[5px] top-2 size-[9px] rounded-full bg-violet shadow-[0_0_12px_rgba(139,92,246,0.9)]" aria-hidden="true" />
              <p className="flex flex-wrap items-center gap-3 font-mono text-[13px] text-mute">
                <time dateTime={e.date}>{new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time>
                <span className="rounded-full border border-line px-2 py-0.5 text-[11px] uppercase tracking-[0.1em]">{e.tag}</span>
              </p>
              <h2 className="mt-2 text-h3 font-semibold">{e.title}</h2>
              <p className="mt-1 text-mute">{e.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
