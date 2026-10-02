"use client";

import { useId, useRef, useState } from "react";

/** Enterprise enquiry. Demo only: validates, then confirms without sending anything. */
export default function ContactForm() {
  const id = useId();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const done = useRef<HTMLDivElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setError("Fill in your name, a work email and your company.");
      (form.querySelector(":invalid") as HTMLElement | null)?.focus();
      return;
    }
    setError(null);
    setSent(true);
    requestAnimationFrame(() => done.current?.focus());
  }

  if (sent) {
    return (
      <div ref={done} tabIndex={-1} role="status" className="card p-8 outline-none">
        <p className="pill w-fit">
          <span className="dot" aria-hidden="true" /> <strong>received</strong>
        </p>
        <p className="mt-4 text-h3 font-semibold">Thanks. We’ll reply within one working day.</p>
        <p className="mt-2 text-mute">This is a demo site, so nothing was sent.</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="card grid gap-4 p-6 md:grid-cols-2 md:p-8">
      <div className="field">
        <label className="label" htmlFor={`${id}-name`}>
          Name
        </label>
        <input id={`${id}-name`} name="name" required autoComplete="name" className="input" />
      </div>
      <div className="field">
        <label className="label" htmlFor={`${id}-email`}>
          Work email
        </label>
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" className="input" />
      </div>
      <div className="field">
        <label className="label" htmlFor={`${id}-company`}>
          Company
        </label>
        <input id={`${id}-company`} name="company" required autoComplete="organization" className="input" />
      </div>
      <div className="field">
        <label className="label" htmlFor={`${id}-volume`}>
          Monthly tokens
        </label>
        <select id={`${id}-volume`} name="volume" className="input" defaultValue="1-10B">
          <option>Under 1B</option>
          <option value="1-10B">1B to 10B</option>
          <option>10B to 100B</option>
          <option>Over 100B</option>
        </select>
      </div>
      <div className="field md:col-span-2">
        <label className="label" htmlFor={`${id}-msg`}>
          What are you building? <span className="text-mute">(optional)</span>
        </label>
        <textarea id={`${id}-msg`} name="message" rows={4} className="input resize-y" />
      </div>
      {error && (
        <p role="alert" className="text-[14px] text-danger md:col-span-2">
          {error}
        </p>
      )}
      <div className="md:col-span-2">
        <button type="submit" className="btn btn-primary">
          Send enquiry
        </button>
      </div>
    </form>
  );
}
