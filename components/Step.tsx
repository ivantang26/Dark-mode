import StepTracker from "./StepTracker";

/** A numbered quickstart step. Reaching it is tracked for the "reach step 3" metric. */
export default function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <section className="relative mt-12 border-l border-line pl-8 sm:pl-10 [&>h2]:mt-0">
      <span
        className="absolute -left-[15px] top-0 grid size-[30px] place-items-center rounded-full border border-violet/60 bg-bg font-mono text-[13px] text-violet-soft shadow-[0_0_16px_-2px_rgba(139,92,246,0.6)]"
        aria-hidden="true"
      >
        {n}
      </span>
      <StepTracker n={n} />
      {children}
    </section>
  );
}
