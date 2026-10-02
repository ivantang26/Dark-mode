"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { models } from "@/lib/pricing";
import { LANDED_KEY, MODEL_KEY, writeSession } from "@/lib/session-store";
import { track } from "@/lib/analytics";
import CopyButton from "./CopyButton";

type Errors = Partial<Record<"email" | "password", string>>;

/**
 * Demo sign-up (FR-7). Nothing leaves the browser: submitting creates a fake key so the
 * hand-off to the quickstart can be shown end to end.
 */
export default function SignupFlow({ initialModel }: { initialModel: string }) {
  const id = useId();
  const [model, setModel] = useState(initialModel);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [key, setKey] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const keyHeading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);

  useEffect(() => {
    writeSession(MODEL_KEY, initialModel);
    track("signup_started", { model: initialModel });
  }, [initialModel]);

  useEffect(() => {
    if (key) keyHeading.current?.focus();
  }, [key]);

  function validate(): Errors {
    const e: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter an email address like name@company.com.";
    if (password.length < 12) e.password = "Use at least 12 characters.";
    return e;
  }

  function finish(via: "email" | "github") {
    setBusy(true);
    window.setTimeout(() => {
      const bytes = crypto.getRandomValues(new Uint8Array(24));
      const k = "syn_demo_" + Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 40);
      let ms: number | null = null;
      try {
        const landed = Number(sessionStorage.getItem(LANDED_KEY));
        if (landed) ms = Date.now() - landed;
      } catch {}
      setElapsed(ms);
      setKey(k);
      setBusy(false);
      track("signup_completed", { model, via, timeToKeyMs: ms });
    }, 700);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => errorSummary.current?.focus());
      return;
    }
    finish("email");
  }

  if (key) {
    return (
      <div className="card relative overflow-hidden p-6 shadow-[var(--glow)] md:p-8">
        <p className="pill w-fit">
          <span className="dot" aria-hidden="true" /> <strong>200 OK</strong> account created
        </p>
        <h2 ref={keyHeading} tabIndex={-1} className="mt-5 text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] outline-none">
          Here’s your API key
        </h2>
        <p className="mt-2 text-[15px] text-mute">This is the only time we’ll show it. Copy it now.</p>
        <div className="mt-5 flex items-center gap-2 rounded-[var(--radius-sm)] border border-line-strong bg-bg p-2 pl-3">
          <code className="min-w-0 flex-1 truncate font-mono text-[14px] text-lime">{key}</code>
          <CopyButton text={key} where="signup-key" />
        </div>
        <p className="mt-2 font-mono text-[12px] text-mute">Demo key: it won’t authenticate anywhere.</p>

        <div className="mt-6 grid gap-2 text-[15px]">
          <p className="text-mute">Set it in your shell:</p>
          <div className="flex items-center gap-2 overflow-hidden rounded-[var(--radius-sm)] border border-line bg-bg p-2 pl-3">
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px]">export SYNAPSE_API_KEY=&quot;{key}&quot;</code>
            <CopyButton text={`export SYNAPSE_API_KEY="${key}"`} where="signup-export" />
          </div>
        </div>

        {elapsed !== null && (
          <p className="mt-6 font-mono text-[13px] text-mute">
            Landing to key: <span className="text-text">{formatDuration(elapsed)}</span>
            {elapsed < 180_000 && <span className="text-lime"> · under 3 minutes</span>}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/docs#make-your-first-call" className="btn btn-primary">
            Make your first call →
          </Link>
          <Link href={`/pricing?model=${model}#calculator`} className="btn btn-secondary">
            Estimate cost
          </Link>
        </div>
      </div>
    );
  }

  const errorList = Object.entries(errors).filter(([, v]) => v);

  return (
    <div className="card p-6 md:p-8">
      <h2 className="text-[1.4rem] font-semibold tracking-[-0.02em]">Create your account</h2>
      <p className="mt-1 text-[15px] text-mute">$5 of credit every month. No card needed.</p>

      <button type="button" className="btn btn-secondary mt-6 w-full" onClick={() => finish("github")} disabled={busy}>
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
        Continue with GitHub
      </button>

      <div className="my-6 flex items-center gap-3 font-mono text-[12px] text-mute" aria-hidden="true">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>

      {errorList.length > 0 && (
        <div ref={errorSummary} tabIndex={-1} role="alert" className="mb-5 rounded-[var(--radius-sm)] border border-danger/50 bg-danger/10 p-3 text-[14px] outline-none">
          <p className="font-medium">Check {errorList.length === 1 ? "this field" : "these fields"}:</p>
          <ul className="mt-1 list-disc pl-5">
            {errorList.map(([k, v]) => (
              <li key={k}>
                <a href={`#${id}-${k}`} className="underline underline-offset-2">
                  {v}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form noValidate onSubmit={onSubmit} className="grid gap-4">
        <div className="field">
          <label className="label" htmlFor={`${id}-email`}>
            Work email
          </label>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? `${id}-email-err` : undefined}
          />
          {errors.email && (
            <p id={`${id}-email-err`} className="text-[13px] text-danger">
              {errors.email}
            </p>
          )}
        </div>
        <div className="field">
          <label className="label" htmlFor={`${id}-password`}>
            Password
          </label>
          <input
            id={`${id}-password`}
            type="password"
            autoComplete="new-password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password || undefined}
            aria-describedby={`${id}-password-${errors.password ? "err" : "hint"}`}
          />
          {errors.password ? (
            <p id={`${id}-password-err`} className="text-[13px] text-danger">
              {errors.password}
            </p>
          ) : (
            <p id={`${id}-password-hint`} className="text-[13px] text-mute">
              At least 12 characters.
            </p>
          )}
        </div>
        <div className="field">
          <label className="label" htmlFor={`${id}-model`}>
            Starting model
          </label>
          <select
            id={`${id}-model`}
            className="input"
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              writeSession(MODEL_KEY, e.target.value);
            }}
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.id})
              </option>
            ))}
          </select>
          <p className="text-[13px] text-mute">Used in your sample code. Every key works with every model.</p>
        </div>
        <button type="submit" className="btn btn-primary mt-2 w-full" disabled={busy}>
          {busy ? "Creating your key…" : "Create account and get key"}
        </button>
        <p className="text-center text-[13px] text-mute">By continuing you agree to the Terms and the Data Processing Addendum.</p>
      </form>
    </div>
  );
}

function formatDuration(ms: number) {
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}
