import Link from "next/link";
import { getSearchIndex } from "@/lib/docs";
import { nav } from "@/lib/site";
import Logo from "./Logo";
import ApiKeyLink from "./ApiKeyLink";
import CommandPalette from "./CommandPalette";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="container-x flex h-16 items-center gap-6">
        <Link href="/" className="flex-none rounded-md" aria-label="Synapse home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="rounded-md px-3 py-2 text-[15px] text-mute transition-colors hover:text-text">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/docs" className="rounded-md px-3 py-2 text-[15px] text-mute transition-colors hover:text-text">
                Docs
              </Link>
            </li>
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <CommandPalette index={getSearchIndex()} />
          <Link href="/login" className="btn btn-ghost hidden sm:inline-flex">
            Log in
          </Link>
          <ApiKeyLink className="btn btn-primary btn-sm hidden sm:inline-flex" />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
