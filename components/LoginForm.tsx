"use client";

import { useId, useState } from "react";
import { site } from "@/lib/site";

/** Demo log-in: the real console is out of scope, so submitting explains where it would go. */
export default function LoginForm() {
  const id = useId();
  const [sent, setSent] = useState(false);
  return (
    <form
      className="card mt-8 grid gap-4 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="field">
        <label className="label" htmlFor={`${id}-email`}>
          Email
        </label>
        <input id={`${id}-email`} type="email" autoComplete="email" required className="input" />
      </div>
      <div className="field">
        <label className="label" htmlFor={`${id}-pw`}>
          Password
        </label>
        <input id={`${id}-pw`} type="password" autoComplete="current-password" required className="input" />
      </div>
      <button type="submit" className="btn btn-primary mt-2 w-full">
        Log in
      </button>
      {sent && (
        <p role="status" className="rounded-[var(--radius-sm)] border border-line bg-bg p-3 text-[14px] text-mute">
          This is a demo site. In production you’d land in the console at <span className="font-mono text-text">{site.consoleUrl.replace("https://", "")}</span>.
        </p>
      )}
    </form>
  );
}
