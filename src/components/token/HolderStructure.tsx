import type { HolderStructure as HS } from "@/lib/types";
import { formatNumber } from "@/lib/format";

export function HolderStructure({ holders }: { holders: HS }) {
  const bars = [
    { label: "Top 10", pct: holders.top10Pct, color: "#F5B400" },
    { label: "Dev", pct: holders.devPct, color: "#FF5C7A" },
    { label: "Bundler", pct: holders.bundlerPct, color: "#A78BFA" },
    { label: "Insider", pct: holders.insiderPct, color: "#38BDF8" },
  ];

  return (
    <section className="rounded-2xl border border-line bg-panel/50 p-4 shadow-panel">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold">Holder structure</h2>
        <span className="font-mono text-xs text-ink-muted">
          {formatNumber(holders.holderCount)} holders
        </span>
      </div>
      <div className="space-y-3">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-ink-muted">{b.label}</span>
              <span className="font-mono tabular-nums">{b.pct.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-void">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, b.pct)}%`,
                  background: b.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
