import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import Terminal from "@/components/Terminal";
import { IconTile, PageHero, SectionHeading } from "@/components/ui";
import { contrastRatio, formatRatio } from "@/lib/contrast";
import { pairings, readTokens } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Design system",
  description: "Synapse dark-theme tokens, contrast checks, type scale, texture and components.",
};

const roles: Record<string, string> = {
  bg: "Page background",
  "surface-1": "Cards, code blocks",
  "surface-2": "Raised elements, hover",
  text: "Primary text",
  "text-mute": "Secondary text",
  "neon-violet": "Primary accent",
  "neon-violet-soft": "Accent text",
  "neon-cyan": "Links, focus",
  "neon-lime": "Success, 200 OK",
  danger: "Errors",
  "on-light": "Text on light fills",
};

const sample = `// Every token colour passes 4.5:1 on --surface-1
const res = await fetch("${"https://api.synapse.example/v1/models"}", {
  headers: { Authorization: \`Bearer \${process.env.SYNAPSE_API_KEY}\` },
});
const { data } = await res.json();
console.log(data.length, true, null);`;

export default function DesignSystemPage() {
  const tokens = readTokens();
  const pairs = pairings();

  return (
    <>
      <PageHero
        eyebrow="design system"
        title="Dark neon, readable first."
        intro="Light is the accent: glows mark importance the way colour fills would on a light site. Every token below is a CSS custom property on :root, so a light theme can redefine them without touching components."
      />

      <section className="container-x py-16" aria-labelledby="colour">
        <SectionHeading id="colour" eyebrow="tokens" title="Colour" intro="No pure white or pure black text pairs, to reduce halation for readers with astigmatism. Body text is #EDEDF2 on #07070B." />
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Object.entries(tokens).map(([name, hex]) => (
            <li key={name} className="card overflow-hidden">
              <div className="h-20 border-b border-line" style={{ background: hex }} />
              <div className="p-3">
                <p className="font-mono text-[13px]">--{name}</p>
                <p className="font-mono text-[12px] text-mute">{hex.toUpperCase()}</p>
                <p className="mt-1 text-[13px] text-mute">{roles[name] ?? ""}</p>
                {name !== "bg" && name !== "on-light" && <p className="mt-1 font-mono text-[12px] text-mute">{formatRatio(contrastRatio(hex, tokens.bg))} on bg</p>}
              </div>
            </li>
          ))}
          <li className="card overflow-hidden">
            <div className="h-20 border-b border-line" style={{ background: "var(--gradient-brand)", boxShadow: "var(--glow)" }} />
            <div className="p-3">
              <p className="font-mono text-[13px]">--gradient-brand</p>
              <p className="mt-1 text-[13px] text-mute">Display text, active tabs. Large sizes only.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="container-x py-12" aria-labelledby="contrast">
        <SectionHeading
          id="contrast"
          eyebrow="accessibility"
          title="Contrast, checked on every build"
          intro={
            <>
              The same list runs in <code className="inline">npm run check:contrast</code> before <code className="inline">next build</code>. Neon violet is only used for borders, dots and glows, so it is held to the 3:1 non-text rule.
            </>
          }
        />
        <div className="mt-8 overflow-x-auto rounded-[var(--radius)] border border-line bg-surface-1">
          <table className="w-full min-w-[620px] text-left text-[14px]">
            <caption className="sr-only">Colour pairings and contrast ratios</caption>
            <thead className="font-mono text-[12px] uppercase tracking-[0.08em] text-mute">
              <tr className="border-b border-line">
                <th scope="col" className="px-4 py-3 font-normal">Sample</th>
                <th scope="col" className="px-4 py-3 font-normal">Pair</th>
                <th scope="col" className="px-4 py-3 font-normal">Use</th>
                <th scope="col" className="px-4 py-3 text-right font-normal">Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pairs.map((p) => {
                const r = contrastRatio(p.fg, p.bg);
                return (
                  <tr key={p.fgName + p.bgName}>
                    <td className="px-4 py-2.5">
                      <span className="inline-block rounded-md border border-line px-2.5 py-1 font-mono text-[13px]" style={{ color: p.fg, background: p.bg }}>
                        Aa 200
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[13px]">
                      {p.fgName} <span className="text-mute">on</span> {p.bgName}
                    </td>
                    <td className="px-4 py-2.5 text-mute">{p.use}</td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {formatRatio(r)} <span className={r >= p.min ? "text-lime" : "text-danger"}>{r >= p.min ? "pass" : "fail"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="container-x py-12" aria-labelledby="type">
        <SectionHeading id="type" eyebrow="typography" title="Geist and Geist Mono" />
        <div className="mt-8 grid gap-6">
          <div className="card p-6">
            <p className="font-mono text-[12px] text-mute">Display · Geist 600 · 40 → 96px · gradient with solid fallback</p>
            <p className="display mt-3">
              <span className="gradient-text">Speed of thought.</span>
            </p>
          </div>
          <div className="card p-6">
            <p className="font-mono text-[12px] text-mute">H2 · Geist 600 · 28 → 52px</p>
            <p className="h2 mt-3">Everything a production workload needs.</p>
          </div>
          <div className="card grid gap-6 p-6 md:grid-cols-2">
            <div>
              <p className="font-mono text-[12px] text-mute">Body · Geist 400 · 16 → 18px</p>
              <p className="mt-3">One API for eight models. First streamed token in about 120 milliseconds, and prices you can read without a sales call.</p>
            </div>
            <div>
              <p className="font-mono text-[12px] text-mute">Code, labels, numbers · Geist Mono 400 · 13 → 15px</p>
              <p className="mono mt-3">p50 182ms · $0.10 / 1M · 128K ctx</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-12" aria-labelledby="components">
        <SectionHeading id="components" eyebrow="components" title="Components" />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="card grid gap-5 p-6">
            <p className="font-mono text-[12px] text-mute">Buttons · tab to see the focus ring (2px cyan + 4px glow)</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary">
                Primary
              </button>
              <button type="button" className="btn btn-secondary">
                Secondary
              </button>
              <button type="button" className="btn btn-ghost">
                Ghost
              </button>
              <button type="button" className="btn btn-primary btn-sm">
                Small
              </button>
            </div>
            <p className="font-mono text-[12px] text-mute">Metric pills</p>
            <div className="flex flex-wrap gap-2">
              <span className="pill">
                <span className="dot" aria-hidden="true" /> p50 latency <strong>180ms</strong>
              </span>
              <span className="pill">
                <span className="dot" data-state="down" aria-hidden="true" /> endpoint <strong>unavailable</strong>
              </span>
            </div>
            <p className="font-mono text-[12px] text-mute">Icon tiles</p>
            <div className="flex flex-wrap gap-2">
              {["streaming", "functions", "batch", "finetune", "regions", "soc2", "key", "lock"].map((i) => (
                <IconTile key={i} name={i} />
              ))}
            </div>
          </div>
          <div className="card spotlight p-6">
            <p className="font-mono text-[12px] text-mute">Spotlight card · move a mouse over it</p>
            <p className="mt-4 text-h3 font-semibold">The border follows the pointer.</p>
            <p className="mt-2 text-[15px] text-mute">A radial gradient in a masked ::before. One document-level pointer listener drives every card. Off on touch screens and with reduced motion.</p>
          </div>
          <div className="min-w-0">
            <CodeBlock code={sample} lang="javascript" title="code block · Shiki, synapse-neon theme" where="design-system" />
          </div>
          <div className="min-w-0">
            <Terminal />
          </div>
        </div>
      </section>

      <section className="container-x py-12" aria-labelledby="motion">
        <SectionHeading id="motion" eyebrow="motion" title="Motion" />
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {[
            ["Aurora", "Gradient drifts over 20s, transform only. Static with reduced motion."],
            ["Metric dots", "Pulse every 2s. No pulse with reduced motion."],
            ["Section headings", "300ms clip-path wipe on first view."],
            ["Buttons", "Glow in over 200ms. Glows never flash or strobe."],
            ["Terminal", "Types at 40 characters a second, then streams. Final state with reduced motion."],
            ["Spotlight", "Follows mouse and pen only. Off on touch and with reduced motion."],
          ].map(([k, v]) => (
            <li key={k} className="card p-5">
              <p className="font-medium">{k}</p>
              <p className="mt-1 text-[15px] text-mute">{v}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
