import Link from "next/link";
import type { Token } from "@/lib/types";
import { CHAINS } from "@/lib/types";
import {
  formatAddress,
  formatAge,
  formatNumber,
  formatUsd,
} from "@/lib/format";
import { ChainBadge } from "@/components/ui/ChainBadge";
import { Pct } from "@/components/ui/Pct";
import { TokenAvatar } from "@/components/ui/TokenAvatar";
import { CandleChart } from "./CandleChart";
import { SecurityPanel } from "./SecurityPanel";
import { HolderStructure } from "./HolderStructure";
import { TradePanel } from "./TradePanel";

export function TokenDetail({ token }: { token: Token }) {
  const metrics = [
    { label: "Market cap", value: formatUsd(token.marketCapUsd) },
    { label: "Liquidity", value: formatUsd(token.liquidityUsd) },
    { label: "Volume 24h", value: formatUsd(token.volume24hUsd) },
    { label: "Holders", value: formatNumber(token.holders.holderCount) },
    { label: "Age", value: formatAge(token.ageSeconds) },
    { label: "Price", value: formatUsd(token.priceUsd, false) },
  ];

  const socials = Object.entries(token.socials).filter(([, v]) => !!v);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <Link href="/" className="hover:text-amber">
          Discovery
        </Link>
        <span>/</span>
        <span className="text-ink">{token.symbol}</span>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <TokenAvatar symbol={token.symbol} hue={token.imageHue} size={56} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-bold tracking-tight">
                {token.symbol}
              </h1>
              <ChainBadge chain={token.chain} size="md" />
              <span className="rounded-md bg-cyan/15 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-cyan">
                {token.lifecycle === "graduated" ? "GRADUATED · DEX" : "BONDED"}
              </span>
            </div>
            <p className="mt-1 text-ink-muted">{token.name}</p>
            <p className="mt-1 font-mono text-xs text-ink-faint">
              {formatAddress(token.address, 6)} · {CHAINS[token.chain].name}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <span className="font-mono text-2xl tabular-nums">
                {formatUsd(token.priceUsd, false)}
              </span>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-ink-faint">1h</span>
                <Pct value={token.changes.h1} />
                <span className="text-ink-faint">24h</span>
                <Pct value={token.changes.h24} />
              </div>
            </div>
          </div>
        </div>
        {socials.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {socials.map(([k, url]) => (
              <a
                key={k}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-line bg-panel px-3 py-1.5 font-mono text-xs capitalize text-ink-muted transition hover:border-amber/40 hover:text-amber"
              >
                {k}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-line bg-panel/40 px-3 py-3"
          >
            <div className="text-[10px] uppercase tracking-wider text-ink-muted">
              {m.label}
            </div>
            <div className="mt-1 font-mono text-sm font-semibold tabular-nums">
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <CandleChart token={token} />
          <div className="grid gap-5 md:grid-cols-2">
            <SecurityPanel security={token.security} />
            <HolderStructure holders={token.holders} />
          </div>
          <section className="rounded-2xl border border-line bg-panel/50 p-4 shadow-panel">
            <h2 className="mb-3 font-display text-sm font-semibold">
              Pool / DEX
            </h2>
            <dl className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-ink-muted">
                  DEX
                </dt>
                <dd className="font-mono">{token.pool.dex}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-ink-muted">
                  Quote
                </dt>
                <dd className="font-mono">{token.pool.quoteSymbol}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] uppercase tracking-wider text-ink-muted">
                  Pair
                </dt>
                <dd className="truncate font-mono text-xs">
                  {token.pool.pairAddress}
                </dd>
              </div>
            </dl>
          </section>
        </div>
        <div className="lg:sticky lg:top-20 lg:self-start">
          <TradePanel token={token} />
        </div>
      </div>
    </div>
  );
}
