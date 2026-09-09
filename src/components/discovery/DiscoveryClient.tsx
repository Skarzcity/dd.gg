"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import type { Token } from "@/lib/types";
import { FiltersBar, defaultFilters, type FilterState } from "./FiltersBar";
import { TokenTable } from "./TokenTable";

export function DiscoveryClient({ initialTokens }: { initialTokens: Token[] }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [tokens, setTokens] = useState(initialTokens);
  const [pending, startTransition] = useTransition();
  const [liveTick, setLiveTick] = useState(0);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    filters.chains.forEach((c) => p.append("chain", c));
    p.set("minMarketCap", String(filters.minMarketCap));
    p.set("minAgeSeconds", String(filters.minAgeSeconds));
    if (filters.minVolume24h) p.set("minVolume24h", String(filters.minVolume24h));
    if (filters.minLiquidity) p.set("minLiquidity", String(filters.minLiquidity));
    if (filters.search) p.set("search", filters.search);
    p.set("sortBy", filters.sortBy);
    p.set("sortDir", filters.sortDir);
    return p.toString();
  }, [filters]);

  const refresh = useCallback(() => {
    startTransition(async () => {
      const res = await fetch(`/api/tokens?${query}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { tokens: Token[] };
      setTokens(data.tokens);
    });
  }, [query]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveTick((t) => t + 1);
      refresh();
    }, 8000);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Discovery
          </h1>
          <p className="mt-1 max-w-xl text-sm text-ink-muted">
            Only bonded &amp; graduated tokens — market cap ≥ $100K, age ≥ 1
            hour. Noise stays off the board.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-ink-faint">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-up" />
          live · tick {liveTick} · {tokens.length} tokens
          {pending ? " · syncing" : ""}
        </div>
      </div>

      <FiltersBar value={filters} onChange={setFilters} />
      <TokenTable tokens={tokens} />
    </div>
  );
}
