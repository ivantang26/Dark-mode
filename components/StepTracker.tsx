"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

export default function StepTracker({ n }: { n: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          track("quickstart_step", { step: n }, { oncePerPage: true });
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [n]);
  return <span ref={ref} hidden />;
}
