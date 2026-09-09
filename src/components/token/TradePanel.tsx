"use client";

import { useMemo, useState } from "react";
import type { Token } from "@/lib/types";
import { formatUsd } from "@/lib/format";
import { CHAINS } from "@/lib/types";

export function TradePanel({ token }: { token: Token }) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("0.1");
  const [slippage, setSlippage] = useState("1.0");
  const [msg, setMsg] = useState<string | null>(null);
  const native = CHAINS[token.chain].nativeSymbol;

  const estimate = useMemo(() => {
    const a = Number(amount);
    if (!Number.isFinite(a) || a <= 0 || !token.priceUsd) return null;
    // Rough: treat amount as native ~ mock USD price of native
    const nativeUsd =
      token.chain === "solana" ? 150 : token.chain === "bnb" ? 580 : 3200;
    if (side === "buy") {
      const usd = a * nativeUsd;
      return usd / token.priceUsd;
    }
    return a * token.priceUsd;
  }, [amount, side, token]);

  return (
    <section className="rounded-2xl border border-line bg-panel/60 p-4 shadow-panel">
      <div className="mb-4 flex rounded-xl bg-void p-1">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            className={`flex-1 rounded-lg py-2 font-display text-sm font-semibold capitalize transition ${
              side === s
                ? s === "buy"
                  ? "bg-signal-up text-void"
                  : "bg-signal-down text-void"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <label className="mb-3 block">
        <span className="mb-1 block text-[10px] uppercase tracking-wider text-ink-muted">
          Amount ({side === "buy" ? native : token.symbol})
        </span>
        <input
          type="number"
          min={0}
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border border-line bg-void px-3 py-2.5 font-mono text-sm outline-none focus:border-amber/50 focus:ring-2 focus:ring-amber/30"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(side === "buy" ? ["0.1", "0.5", "1", "2"] : ["25%", "50%", "75%", "100%"]).map(
            (q) => (
              <button
                key={q}
                type="button"
                className="rounded-md border border-line px-2 py-0.5 font-mono text-[10px] text-ink-muted hover:border-amber/40 hover:text-amber"
                onClick={() => {
                  if (q.endsWith("%")) {
                    const pct = Number(q.replace("%", "")) / 100;
                    setAmount(String(Number((10 * pct).toFixed(4))));
                  } else setAmount(q);
                }}
              >
                {q}
              </button>
            )
          )}
        </div>
      </label>

      <label className="mb-4 block">
        <span className="mb-1 block text-[10px] uppercase tracking-wider text-ink-muted">
          Slippage %
        </span>
        <div className="flex gap-2">
          {["0.5", "1.0", "3.0"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSlippage(s)}
              className={`rounded-lg border px-3 py-1.5 font-mono text-xs ${
                slippage === s
                  ? "border-amber/50 bg-amber/10 text-amber"
                  : "border-line text-ink-muted"
              }`}
            >
              {s}%
            </button>
          ))}
          <input
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            className="w-20 rounded-lg border border-line bg-void px-2 py-1.5 font-mono text-xs outline-none"
          />
        </div>
      </label>

      <div className="mb-4 rounded-xl border border-line/60 bg-void/50 px-3 py-2 text-xs text-ink-muted">
        <div className="flex justify-between">
          <span>Est. {side === "buy" ? "receive" : "proceeds"}</span>
          <span className="font-mono text-ink">
            {estimate == null
              ? "—"
              : side === "buy"
                ? `${estimate.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${token.symbol}`
                : formatUsd(estimate, false)}
          </span>
        </div>
        <div className="mt-1 flex justify-between">
          <span>Pool</span>
          <span className="font-mono">
            {token.pool.dex} · {token.pool.quoteSymbol}
          </span>
        </div>
      </div>

      <button
        type="button"
        className={`w-full rounded-xl py-3 font-display text-sm font-bold text-void transition active:scale-[0.99] ${
          side === "buy"
            ? "bg-signal-up hover:brightness-110"
            : "bg-signal-down hover:brightness-110"
        }`}
        onClick={() => {
          setMsg(
            `Stub ${side.toUpperCase()} ${amount} — connect wallet + router to execute on ${token.chain}`
          );
          setTimeout(() => setMsg(null), 3500);
        }}
      >
        {side === "buy" ? `Buy ${token.symbol}` : `Sell ${token.symbol}`}
      </button>
      {msg && (
        <p className="mt-3 text-center text-[11px] text-amber">{msg}</p>
      )}
    </section>
  );
}
