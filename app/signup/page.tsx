import type { Metadata } from "next";
import Link from "next/link";
import SignupFlow from "@/components/SignupFlow";
import { DEFAULT_MODEL, getModel } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Get your API key",
  description: "Create a Synapse account and get an API key with $5 of free monthly credit.",
};

export default async function SignupPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.model) ? sp.model[0] : sp.model;
  const model = getModel(raw)?.id ?? DEFAULT_MODEL;

  return (
    <section className="relative overflow-hidden">
      <div className="aurora opacity-70" aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />
      <div className="container-x relative grid gap-12 py-14 md:py-20 lg:grid-cols-[1fr_440px] lg:items-start lg:gap-16">
        <div className="lg:pt-6">
          <p className="eyebrow">get started</p>
          <h1 className="mt-4 text-[clamp(2.25rem,1.5rem+3vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">Your API key, in about a minute.</h1>
          <ol className="mt-8 grid gap-4">
            {[
              ["Create an account", "Email or GitHub. No card for the free tier."],
              ["Copy your key", "It's shown once. Store it in your secrets manager."],
              ["Make a call", "Paste one command from the quickstart."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="grid size-8 flex-none place-items-center rounded-full border border-line-strong font-mono text-[13px] text-violet-soft">{i + 1}</span>
                <span>
                  <span className="block font-medium">{t}</span>
                  <span className="block text-[15px] text-mute">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-[15px] text-mute">
            Already have an account?{" "}
            <Link href="/login" className="prose-link">
              Log in
            </Link>
          </p>
        </div>
        <SignupFlow initialModel={model} />
      </div>
    </section>
  );
}
