"use client";

import Link from "next/link";
import { formatAge, formatNumber, formatUsd } from "@/lib/format";
import type { Token } from "@/lib/types";
import { ChainBadge } from "@/components/ui/ChainBadge";
import { Pct } from "@/components/ui/Pct";
import { TokenAvatar } from "@/components/ui/TokenAvatar";

export function TokenTable({ tokens }: { tokens: Token[] }) {
  if (tokens.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-panel/40 px-6 py-16 text-center">
        <p className="font-display text-lg text-ink">No signal in range</p>
        <p className="mt-2 text-sm text-ink-muted">
          Hard filters require bonded/graduated, mcap ≥ $100K, age ≥ 1h. Widen
          soft filters or switch chains.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel/40 shadow-panel">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-void/50 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              <th className="px-4 py-3 font-medium">Token</th>
              <th className="px-3 py-3 font-medium">Price</th>
              <th className="px-3 py-3 font-medium">1m</th>
              <th className="px-3 py-3 font-medium">5m</th>
              <th className="px-3 py-3 font-medium">1h</th>
              <th className="px-3 py-3 font-medium">24h</th>
              <th className="px-3 py-3 font-medium">Mcap</th>
              <th className="px-3 py-3 font-medium">Liq</th>
              <th className="px-3 py-3 font-medium">Vol 24h</th>
              <th className="px-3 py-3 font-medium">Holders</th>
              <th className="px-3 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">Chain</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t, i) => (
              <tr
                key={t.id}
                className="group border-b border-line/60 transition hover:bg-amber/[0.04]"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/token/${t.id}`}
                    className="flex items-center gap-3"
                  >
                    <TokenAvatar symbol={t.symbol} hue={t.imageHue} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-ink group-hover:text-amber">
                          {t.symbol}
                        </span>
                        <LifecyclePill lifecycle={t.lifecycle} />
                      </div>
                      <div className="truncate font-mono text-[11px] text-ink-faint">
                        {t.name}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-3 py-3 font-mono tabular-nums text-ink">
                  {formatUsd(t.priceUsd, false)}
                </td>
                <td className="px-3 py-3">
                  <Pct value={t.changes.m1} />
                </td>
                <td className="px-3 py-3">
                  <Pct value={t.changes.m5} />
                </td>
                <td className="px-3 py-3">
                  <Pct value={t.changes.h1} />
                </td>
                <td className="px-3 py-3">
                  <Pct value={t.changes.h24} />
                </td>
                <td className="px-3 py-3 font-mono tabular-nums">
                  {formatUsd(t.marketCapUsd)}
                </td>
                <td className="px-3 py-3 font-mono tabular-nums text-ink-muted">
                  {formatUsd(t.liquidityUsd)}
                </td>
                <td className="px-3 py-3 font-mono tabular-nums">
                  {formatUsd(t.volume24hUsd)}
                </td>
                <td className="px-3 py-3 font-mono tabular-nums text-ink-muted">
                  {formatNumber(t.holders.holderCount)}
                </td>
                <td className="px-3 py-3 font-mono tabular-nums text-ink-muted">
                  {formatAge(t.ageSeconds)}
                </td>
                <td className="px-4 py-3">
                  <ChainBadge chain={t.chain} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LifecyclePill({ lifecycle }: { lifecycle: Token["lifecycle"] }) {
  if (lifecycle === "on_curve") return null;
  const label = lifecycle === "graduated" ? "DEX" : "BONDED";
  return (
    <span className="rounded bg-cyan/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wider text-cyan">
      {label}
    </span>
  );
}
