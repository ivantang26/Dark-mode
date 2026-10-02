"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LANDED_KEY } from "@/lib/session-store";

/**
 * Page-wide behaviour with one listener each, so cards and headings can stay server components:
 *  - spotlight border position for every .spotlight card (FR-6; mouse/pen only, not reduced motion)
 *  - heading clip-path reveal for every [data-reveal]
 *  - landing timestamp for the "time to API key" metric
 */
export default function Effects() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(LANDED_KEY)) sessionStorage.setItem(LANDED_KEY, String(Date.now()));
    } catch {}
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last: PointerEvent | null = null;

    function apply() {
      frame = 0;
      const e = last;
      if (!e) return;
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType === "touch" || !fine.matches || reduced.matches) return;
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
