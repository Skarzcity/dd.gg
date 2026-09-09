"use client";

import {
  CHAINS,
  HARD_FILTERS,
  SUPPORTED_CHAINS,
  type ChainId,
  type SortField,
} from "@/lib/types";

export interface FilterState {
  chains: ChainId[];
  minMarketCap: number;
  minAgeSeconds: number;
  minVolume24h: number;
  minLiquidity: number;
  sortBy: SortField;
  sortDir: "asc" | "desc";
  search: string;
}

export const defaultFilters: FilterState = {
  chains: [...SUPPORTED_CHAINS],
  minMarketCap: HARD_FILTERS.minMarketCapUsd,
  minAgeSeconds: HARD_FILTERS.minAgeSeconds,
  minVolume24h: 0,
  minLiquidity: 0,
  sortBy: "volume24hUsd",
  sortDir: "desc",
  search: "",
};

export function FiltersBar({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const toggleChain = (id: ChainId) => {
    const has = value.chains.includes(id);
    const chains = has
      ? value.chains.filter((c) => c !== id)
      : [...value.chains, id];
    // Keep at least one chain selected for UX
    onChange({ ...value, chains: chains.length ? chains : [id] });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="search"
            placeholder="Search symbol or address…"
            value={value.search}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
            className="w-full rounded-xl border border-line bg-panel py-2.5 pl-10 pr-3 font-mono text-sm text-ink outline-none ring-amber/40 placeholder:text-ink-faint focus:border-amber/50 focus:ring-2"
          />
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SUPPORTED_CHAINS.map((id) => {
            const on = value.chains.includes(id);
            const meta = CHAINS[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleChain(id)}
                className={`rounded-lg border px-2.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide transition ${
                  on
                    ? "border-transparent text-void"
                    : "border-line bg-panel text-ink-muted hover:text-ink"
                }`}
                style={
                  on
                    ? { background: meta.color, boxShadow: `0 0 12px ${meta.color}55` }
                    : undefined
                }
              >
                {meta.short}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-panel/60 p-3">
        <Field label={`Mcap ≥ (floor $${(HARD_FILTERS.minMarketCapUsd / 1000).toFixed(0)}K)`}>
          <select
            className="select"
            value={value.minMarketCap}
            onChange={(e) =>
              onChange({
                ...value,
                minMarketCap: Math.max(
                  HARD_FILTERS.minMarketCapUsd,
                  Number(e.target.value)
                ),
              })
            }
          >
            <option value={100_000}>$100K+</option>
            <option value={250_000}>$250K+</option>
            <option value={500_000}>$500K+</option>
            <option value={1_000_000}>$1M+</option>
            <option value={5_000_000}>$5M+</option>
          </select>
        </Field>
        <Field label="Age ≥ (floor 1h)">
          <select
            className="select"
            value={value.minAgeSeconds}
            onChange={(e) =>
              onChange({
                ...value,
                minAgeSeconds: Math.max(
                  HARD_FILTERS.minAgeSeconds,
                  Number(e.target.value)
                ),
              })
            }
          >
            <option value={3600}>1h+</option>
            <option value={6 * 3600}>6h+</option>
            <option value={24 * 3600}>24h+</option>
            <option value={7 * 24 * 3600}>7d+</option>
          </select>
        </Field>
        <Field label="Volume 24h ≥">
          <select
            className="select"
            value={value.minVolume24h}
            onChange={(e) =>
              onChange({ ...value, minVolume24h: Number(e.target.value) })
            }
          >
            <option value={0}>Any</option>
            <option value={100_000}>$100K+</option>
            <option value={500_000}>$500K+</option>
            <option value={1_000_000}>$1M+</option>
          </select>
        </Field>
        <Field label="Liquidity ≥">
          <select
            className="select"
            value={value.minLiquidity}
            onChange={(e) =>
              onChange({ ...value, minLiquidity: Number(e.target.value) })
            }
          >
            <option value={0}>Any</option>
            <option value={50_000}>$50K+</option>
            <option value={100_000}>$100K+</option>
            <option value={250_000}>$250K+</option>
          </select>
        </Field>
        <Field label="Sort">
          <select
            className="select"
            value={value.sortBy}
            onChange={(e) =>
              onChange({ ...value, sortBy: e.target.value as SortField })
            }
          >
            <option value="volume24hUsd">Volume</option>
            <option value="marketCapUsd">Market cap</option>
            <option value="liquidityUsd">Liquidity</option>
            <option value="ageSeconds">Age</option>
            <option value="change1h">1h %</option>
            <option value="change24h">24h %</option>
            <option value="holders">Holders</option>
          </select>
        </Field>
        <button
          type="button"
          className="rounded-lg border border-line bg-void px-3 py-2 font-mono text-xs text-ink-muted hover:text-ink"
          onClick={() =>
            onChange({
              ...value,
              sortDir: value.sortDir === "desc" ? "asc" : "desc",
            })
          }
        >
          {value.sortDir === "desc" ? "↓ Desc" : "↑ Asc"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-ink-muted">
      {label}
      {children}
    </label>
  );
}
