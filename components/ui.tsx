import Link from "next/link";
import { contextLabel, pricePerM, type Model } from "@/lib/pricing";
import ApiKeyLink from "./ApiKeyLink";

export function SectionHeading({ eyebrow, title, intro, id, align = "left" }: { eyebrow?: string; title: React.ReactNode; intro?: React.ReactNode; id?: string; align?: "left" | "center" }) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="h2 mt-3" data-reveal>
        {title}
      </h2>
      {intro && <p className="mt-4 text-mute">{intro}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: React.ReactNode; intro?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="aurora opacity-60" aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />
      <div className="container-x relative py-16 md:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.25rem,1.4rem+3.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-[1.1em] text-mute">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  streaming: <path d="M3 12h3l2-6 4 12 3-9 2 3h4" />,
  functions: (
    <>
      <path d="M8 4c-2 0-3 1-3 3v2c0 1.5-1 2.5-2 3 1 .5 2 1.5 2 3v2c0 2 1 3 3 3" />
      <path d="M16 4c2 0 3 1 3 3v2c0 1.5 1 2.5 2 3-1 .5-2 1.5-2 3v2c0 2-1 3-3 3" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  batch: (
    <>
      <rect x="4" y="4" width="16" height="4" rx="1.5" />
      <rect x="4" y="10" width="16" height="4" rx="1.5" />
      <rect x="4" y="16" width="16" height="4" rx="1.5" />
    </>
  ),
  finetune: (
    <>
      <path d="M5 4v16M12 4v16M19 4v16" />
      <circle cx="5" cy="14" r="2" />
      <circle cx="12" cy="8" r="2" />
      <circle cx="19" cy="16" r="2" />
    </>
  ),
  regions: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.5 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.5-3.5-8.5s1-5.9 3.5-8.5Z" />
    </>
  ),
  soc2: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.4 7.5 9.5 4.4-1.1 7.5-4.9 7.5-9.5V6L12 3Z" />
      <path d="m8.8 12 2.3 2.3 4.2-4.6" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8-8M16 7l2 2M14 9l2 2" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 1 1 8 0v3" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.5-3.6 3.2-6 6.5-6s6 2.4 6.5 6M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.4c2 .8 3.2 2.8 3.5 5.6" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
    </>
  ),
};

export function Icon({ name, className = "" }: { name: keyof typeof ICONS | string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export function IconTile({ name }: { name: string }) {
  return (
    <span className="inline-grid size-10 place-items-center rounded-[10px] border border-line bg-[linear-gradient(140deg,rgba(139,92,246,0.18),rgba(34,211,238,0.06))] text-violet-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <Icon name={name} />
    </span>
  );
}

export function ModelCard({ model, showCta = true, detail = false }: { model: Model; showCta?: boolean; detail?: boolean }) {
  return (
    <article className="card spotlight flex h-full flex-col p-5">
      <h3 className="text-h3 font-semibold">{model.name}</h3>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[12px] text-mute">{model.id}</span>
        {model.modalities.map((m) => (
          <span key={m} className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-mute">
            {m}
          </span>
        ))}
      </div>
      <p className="mt-3 flex-1 text-[15px] text-mute">{model.tagline}</p>
      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 font-mono text-[12px]">
        <div>
          <dt className="text-mute">context</dt>
          <dd className="mt-1 text-[15px] text-text">{contextLabel(model.contextTokens)}</dd>
        </div>
        <div>
          <dt className="text-mute">in / 1M</dt>
          <dd className="mt-1 text-[15px] text-text">{pricePerM(model.inputPerM)}</dd>
        </div>
        <div>
          <dt className="text-mute">out / 1M</dt>
          <dd className="mt-1 text-[15px] text-text">{pricePerM(model.outputPerM)}</dd>
        </div>
      </dl>
      {detail && (
        <dl className="mt-3 grid grid-cols-3 gap-3 font-mono text-[12px]">
          <div>
            <dt className="text-mute">speed</dt>
            <dd className="mt-1 text-text">{model.tokensPerSecond.toLocaleString("en-US")} tok/s</dd>
          </div>
          <div>
            <dt className="text-mute">first token</dt>
            <dd className="mt-1 text-text">{model.ttftMs}ms</dd>
          </div>
          <div>
            <dt className="text-mute">fine-tune</dt>
            <dd className="mt-1 text-text">{model.fineTune ? "yes" : "no"}</dd>
          </div>
        </dl>
      )}
      {detail && model.evals.reasoning > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-3 font-mono text-[12px]">
          <Meter label="reasoning eval" value={model.evals.reasoning} />
          <Meter label="code eval" value={model.evals.code} />
        </dl>
      )}
      {showCta && (
        <div className="mt-5 flex gap-2">
          <ApiKeyLink model={model.id} className="btn btn-secondary btn-sm">
            Use {model.id}
          </ApiKeyLink>
          <Link href={`/pricing?model=${model.id}#calculator`} className="btn btn-ghost btn-sm">
            Estimate cost
          </Link>
        </div>
      )}
    </article>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="flex justify-between text-mute">
        {label} <span className="text-text">{value}</span>
      </dt>
      <dd className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-2">
        <span className="block h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6,#22d3ee)]" style={{ width: `${value}%` }} />
      </dd>
    </div>
  );
}

export function LogoCloud() {
  const names = ["fernhollow", "QUANTA/LABS", "paperplane", "Orbitly", "hexfield", "Lumen & Co"];
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-3 lg:grid-cols-6" aria-label="Example customers (placeholder logos)">
      {names.map((n, i) => (
        <li
          key={n}
          className={`grid h-20 place-items-center bg-bg text-[17px] tracking-tight text-mute ${i % 3 === 1 ? "font-mono uppercase tracking-[0.12em] text-[13px]" : i % 3 === 2 ? "italic font-medium" : "font-semibold"}`}
        >
          {n}
        </li>
      ))}
    </ul>
  );
}
