"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header({ onConnect }: { onConnect?: () => void }) {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-void/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="font-display text-xl font-bold tracking-tight text-ink">
              dd<span className="text-amber">.</span>gg
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-ink-muted sm:inline">
              signal over noise
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/" active={path === "/"}>
              Discovery
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-[11px] text-ink-muted sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
            </span>
            Hard filters on
          </div>
          <button
            type="button"
            onClick={onConnect}
            className="rounded-lg bg-amber px-3 py-1.5 font-display text-sm font-semibold text-void transition hover:bg-amber-bright active:scale-[0.98]"
          >
            Connect
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-1.5 text-sm transition ${
        active
          ? "bg-panel text-ink"
          : "text-ink-muted hover:bg-panel/60 hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
