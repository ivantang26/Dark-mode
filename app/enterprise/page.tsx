import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { IconTile, PageHero, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Enterprise",
  description: "SOC 2 Type II, zero data retention, regional processing, SSO and dedicated capacity for Synapse at scale.",
};

const compliance = [
  { k: "SOC 2 Type II", v: "Audited annually by an independent firm. Report available under NDA." },
  { k: "ISO 27001", v: "Certified information security management across all regions." },
  { k: "GDPR and DPA", v: "Standard contractual clauses and a signed DPA on every enterprise contract." },
  { k: "HIPAA", v: "Business associate agreement available for eligible workloads." },
];

const data = [
  { icon: "database", title: "Zero data retention", body: "Prompts and completions are processed in memory and never written to disk. Default for enterprise; available to any account on request." },
  { icon: "lock", title: "Never used for training", body: "Your traffic never trains or evaluates our models. This is in the contract, not just the policy." },
  { icon: "regions", title: "Regional processing", body: "Pin inference to us-east, eu-west or ap-southeast. Requests never leave the region you choose." },
  { icon: "key", title: "Encryption and keys", body: "TLS 1.3 in transit, AES-256 at rest for fine-tune data, customer-managed keys on request." },
  { icon: "users", title: "SSO and SCIM", body: "SAML or OIDC sign-in, SCIM provisioning, role-based access and an audit log you can export." },
  { icon: "bolt", title: "Dedicated capacity", body: "Reserved throughput with a 99.95% uptime SLA and p99 latency targets written into the contract." },
];

export default function EnterprisePage() {
  return (
    <>
      <PageHero
        eyebrow="enterprise"
        title="Inference your security team will sign off."
        intro="The same API and models, with the controls, contracts and capacity that regulated teams need."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#contact" className="btn btn-primary">
            Talk to sales
          </a>
          <a href="#security" className="btn btn-secondary">
            Security overview
          </a>
        </div>
      </PageHero>

      <section id="security" className="container-x scroll-mt-24 py-20" aria-labelledby="compliance">
        <SectionHeading id="compliance" eyebrow="compliance" title="Audited, certified, documented." />
        <dl className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {compliance.map((c) => (
            <div key={c.k} className="bg-surface-1 p-6">
              <dt className="flex items-center gap-2 font-semibold">
                <span className="dot" aria-hidden="true" />
                {c.k}
              </dt>
              <dd className="mt-2 text-[15px] text-mute">{c.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-x py-12" aria-labelledby="data">
        <SectionHeading id="data" eyebrow="data handling" title="Your data stays yours." />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((d) => (
            <li key={d.title} className="card spotlight p-6">
              <IconTile name={d.icon} />
              <h3 className="mt-5 text-h3 font-semibold">{d.title}</h3>
              <p className="mt-2 text-[15px] text-mute">{d.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x py-20" aria-labelledby="regions">
        <SectionHeading id="regions" eyebrow="regions" title="Three regions, one endpoint per region." />
        <div className="mt-10 overflow-x-auto rounded-[var(--radius)] border border-line bg-surface-1">
          <table className="w-full min-w-[520px] text-left text-[15px]">
            <caption className="sr-only">Regions and endpoints</caption>
            <thead className="font-mono text-[12px] uppercase tracking-[0.08em] text-mute">
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-3.5 font-normal">Region</th>
                <th scope="col" className="px-5 py-3.5 font-normal">Location</th>
                <th scope="col" className="px-5 py-3.5 font-normal">Endpoint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[
                ["us-east", "Virginia, USA", "us-east.api.synapse.example"],
                ["eu-west", "Dublin, Ireland", "eu-west.api.synapse.example"],
                ["ap-southeast", "Singapore", "ap-southeast.api.synapse.example"],
              ].map(([r, l, e]) => (
                <tr key={r}>
                  <th scope="row" className="px-5 py-4 font-mono font-normal">
                    {r}
                  </th>
                  <td className="px-5 py-4 text-mute">{l}</td>
                  <td className="px-5 py-4 font-mono text-[14px] text-cyan">{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="contact" className="container-x scroll-mt-24 py-12" aria-labelledby="contact-h">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeading
            id="contact-h"
            eyebrow="contact"
            title="Talk to an engineer, not a script."
            intro="Tell us about your workload. A solutions engineer replies within one working day with a capacity plan and a security pack."
          />
          <ContactForm />
        </div>
      </section>
    </>
  );
}
