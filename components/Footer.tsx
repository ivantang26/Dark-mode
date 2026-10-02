import Link from "next/link";
import { site } from "@/lib/site";
import Logo from "./Logo";

const cols = [
  {
    title: "Product",
    links: [
      { href: "/models", label: "Models" },
      { href: "/pricing", label: "Pricing" },
      { href: "/pricing#calculator", label: "Cost calculator" },
      { href: "/enterprise", label: "Enterprise" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "Quickstart" },
      { href: "/docs/streaming", label: "Streaming" },
      { href: "/docs/errors-and-limits", label: "Rate limits" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/design-system", label: "Design system" },
      { href: "/enterprise#security", label: "Security" },
      { href: site.statusUrl, label: "Status ↗", external: true },
      { href: site.consoleUrl, label: "Console ↗", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-[34ch] text-[15px] text-mute">Fast, predictable inference for developers. One API, eight models, honest pricing.</p>
          <a href={site.statusUrl} target="_blank" rel="noreferrer" className="pill hover:border-line-strong">
            <span className="dot" aria-hidden="true" />
            All systems operational
          </a>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="font-mono text-[12px] uppercase tracking-[0.12em] text-mute">{c.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  {"external" in l ? (
                    <a href={l.href} target="_blank" rel="noreferrer" className="text-[15px] text-[#cfcfdb] transition-colors hover:text-text">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="text-[15px] text-[#cfcfdb] transition-colors hover:text-text">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-line py-6 font-mono text-[12px] text-mute sm:flex-row sm:justify-between">
        <span>© 2026 Synapse Labs (fictional). Portfolio project.</span>
        <span>Terms · Privacy · DPA</span>
      </div>
    </footer>
  );
}
