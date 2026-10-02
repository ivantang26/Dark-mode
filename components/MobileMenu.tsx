"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/site";
import ApiKeyLink from "./ApiKeyLink";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={button}
        type="button"
        className="btn btn-ghost"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          {open ? <path d="m5 5 10 10M15 5 5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
        </svg>
      </button>
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-bg px-4 pb-10 pt-4">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-line">
              {[...nav, { href: "/docs", label: "Docs" }, { href: "/login", label: "Log in" }].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="flex items-center justify-between py-4 text-[18px]" aria-current={pathname === n.href ? "page" : undefined}>
                    {n.label}
                    <span className="font-mono text-[13px] text-mute" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ApiKeyLink className="btn btn-primary mt-6 w-full" />
        </div>
      )}
    </div>
  );
}
