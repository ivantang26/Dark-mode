"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocOutline } from "@/lib/docs";

export default function DocsNav({ outline }: { outline: DocOutline[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Docs" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
      {/* Phones and tablets: a scrollable row of pages. */}
      <ul className="tab-row -mx-4 gap-2 px-4 lg:hidden">
        {outline.map((d) => (
          <li key={d.href} className="flex-none">
            <Link
              href={d.href}
              aria-current={pathname === d.href ? "page" : undefined}
              className={`block rounded-full border px-3 py-1.5 text-[14px] ${pathname === d.href ? "border-violet bg-violet/15 text-text" : "border-line text-mute"}`}
            >
              {d.short}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden lg:block">
        <p className="eyebrow">docs</p>
        <ul className="mt-4 space-y-1">
          {outline.map((d) => {
            const current = pathname === d.href;
            return (
              <li key={d.href}>
                <Link
                  href={d.href}
                  aria-current={current ? "page" : undefined}
                  className={`block rounded-md px-3 py-1.5 text-[15px] transition-colors ${current ? "bg-surface-2 text-text" : "text-mute hover:text-text"}`}
                >
                  {d.short}
                </Link>
                {current && d.headings.length > 0 && (
                  <ul className="my-2 ml-3 space-y-1 border-l border-line pl-3">
                    {d.headings.map((h) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="block py-0.5 text-[14px] text-mute transition-colors hover:text-text">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-8 font-mono text-[12px] text-mute">
          Press <kbd className="rounded border border-line px-1">⌘K</kbd> / <kbd className="rounded border border-line px-1">Ctrl K</kbd> to search
        </p>
      </div>
    </nav>
  );
}
