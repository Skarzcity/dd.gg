import type { SecurityFlags } from "@/lib/types";

export function SecurityPanel({ security }: { security: SecurityFlags }) {
  const rows: { label: string; ok: boolean; detail: string }[] = [
    {
      label: "Honeypot",
      ok: !security.honeypot,
      detail: security.honeypot ? "FLAGGED" : "Clear",
    },
    {
      label: "Mint authority",
      ok: security.mintRenounced,
      detail: security.mintRenounced ? "Renounced" : "Active",
    },
    {
      label: "Freeze authority",
      ok: security.freezeRenounced,
      detail: security.freezeRenounced ? "Renounced" : "Active",
    },
    {
      label: "LP burned",
      ok: security.lpBurned,
      detail: security.lpBurned ? "Burned" : "Not burned",
    },
    {
      label: "LP locked",
      ok: security.lpLocked,
      detail: security.lpLocked ? "Locked" : "Unlocked",
    },
    {
      label: "Buy / sell tax",
      ok: security.buyTaxPct + security.sellTaxPct === 0,
      detail: `${security.buyTaxPct}% / ${security.sellTaxPct}%`,
    },
  ];

  const score = rows.filter((r) => r.ok).length;

  return (
    <section className="rounded-2xl border border-line bg-panel/50 p-4 shadow-panel">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold">Security</h2>
        <span
          className={`font-mono text-xs ${
            score >= 5
              ? "text-signal-up"
              : score >= 3
                ? "text-amber"
                : "text-signal-down"
          }`}
        >
          {score}/{rows.length} checks
        </span>
      </div>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li
            key={r.label}
            className="flex items-center justify-between rounded-lg border border-line/50 bg-void/40 px-3 py-2 text-sm"
          >
            <span className="text-ink-muted">{r.label}</span>
            <span
              className={`font-mono text-xs font-semibold ${
                r.ok ? "text-signal-up" : "text-signal-down"
              }`}
            >
              {r.detail}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
