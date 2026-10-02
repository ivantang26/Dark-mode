import Link from "next/link";
import Terminal from "@/components/Terminal";
import MetricsStrip from "@/components/MetricsStrip";
import CodeTabs from "@/components/CodeTabs";
import CostCalculator from "@/components/CostCalculator";
import ApiKeyLink from "@/components/ApiKeyLink";
import { IconTile, LogoCloud, ModelCard, SectionHeading } from "@/components/ui";
import { DEFAULT_CALC, models } from "@/lib/pricing";
import { firstCall } from "@/lib/snippets";

const features = [
  { icon: "streaming", title: "Streaming", body: "Server-sent events from the first token. p50 time to first token is 120ms on Flash." },
  { icon: "functions", title: "Function calling", body: "Declare tools as JSON Schema. Arguments come back validated, with parallel calls supported." },
  { icon: "batch", title: "Batch API", body: "Send up to 50,000 requests in one file. Half price, results within 24 hours." },
  { icon: "finetune", title: "Fine-tuning", body: "LoRA fine-tunes on Mini, Flash, Code and Pro. Upload JSONL, deploy in minutes." },
  { icon: "regions", title: "Regions", body: "Pin traffic to us-east, eu-west or ap-southeast. Data stays where you send it." },
  { icon: "soc2", title: "SOC 2 Type II", body: "Audited annually. Zero data retention on request; we never train on your traffic." },
];

export default function Home() {
  const featured = models.filter((m) => m.featured).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="aurora" aria-hidden="true" />
        <div className="grid-lines" aria-hidden="true" />
        <div className="container-x relative grid gap-12 pb-16 pt-14 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-28">
          <div>
            <Link
              href="/changelog"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1/70 py-1 pl-1 pr-3 text-[13px] text-mute transition-colors hover:border-line-strong hover:text-text"
            >
              <span className="rounded-full bg-violet/20 px-2 py-0.5 font-mono text-[11px] text-violet-soft">new</span>
              Synapse Ultra: 1M-token context →
            </Link>
            <h1 className="display mt-6">
              <span className="gradient-text">Inference at the speed of thought.</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-[1.1em] text-[#cfcfdb]">
              One API for eight models. First streamed token in about 120 milliseconds, prices you can read without a sales call, and a working request in under three minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ApiKeyLink className="btn btn-primary" />
              <Link href="/docs" className="btn btn-secondary">
                Read the quickstart
              </Link>
            </div>
            <p className="mt-5 font-mono text-[13px] text-mute">$5 free credit every month · no card needed</p>
          </div>
          <div className="min-w-0">
            <Terminal />
          </div>
        </div>
      </section>

      {/* Live metrics */}
      <section aria-label="Live platform metrics" className="border-y border-line bg-surface-1/40">
        <div className="container-x py-5">
          <MetricsStrip />
        </div>
      </section>

      {/* Code tabs */}
      <section className="container-x grid gap-10 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <SectionHeading
          eyebrow="first call"
          title="Ten lines to your first streamed token."
          intro="The same request in Python, JavaScript, Go and cURL. Pick a language once and every code sample on the site follows."
        />
        <div className="min-w-0">
          <CodeTabs snippet={firstCall()} title="First request" where="home" />
        </div>
      </section>

      {/* Features */}
      <section className="container-x py-12">
        <SectionHeading eyebrow="platform" title="Everything a production workload needs." />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} className="card spotlight p-6">
              <IconTile name={f.icon} />
              <h3 className="mt-5 text-h3 font-semibold">{f.title}</h3>
              <p className="mt-2 text-[15px] text-mute">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Models */}
      <section className="container-x py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="models" title="From fractions of a cent to a million tokens of context." />
          <Link href="/models" className="btn btn-secondary">
            All 8 models
          </Link>
        </div>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((m) => (
            <li key={m.id}>
              <ModelCard model={m} showCta={false} />
            </li>
          ))}
        </ul>
      </section>

      {/* Calculator teaser */}
      <section className="container-x py-12">
        <SectionHeading eyebrow="pricing" title="Know your bill before you write code." intro="Per-token pricing, no seats, no minimums. Move the slider to see a month." />
        <div className="mt-10">
          <CostCalculator initial={DEFAULT_CALC} mode="teaser" />
        </div>
      </section>

      {/* Logos */}
      <section className="container-x py-24">
        <p className="eyebrow text-center">teams shipping on synapse</p>
        <div className="mt-6">
          <LogoCloud />
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-x">
        <div className="relative overflow-hidden rounded-[24px] border border-line px-6 py-20 text-center md:py-28">
          <div className="aurora !inset-0 !h-full" aria-hidden="true" />
          <div className="relative">
            <h2 className="h2 mx-auto max-w-2xl" data-reveal>
              Your API key is three minutes away.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#cfcfdb]">Sign up with email or GitHub, copy your key, paste one command. $5 of free credit lands every month.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ApiKeyLink className="btn btn-primary" />
              <Link href="/pricing" className="btn btn-secondary">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
