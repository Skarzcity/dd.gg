"use client";

import { useMemo } from "react";
import type { Token } from "@/lib/types";

/** Deterministic mock OHLC from token id — SVG candlesticks */
export function CandleChart({ token }: { token: Token }) {
  const candles = useMemo(() => buildCandles(token), [token]);
  const w = 640;
  const h = 260;
  const pad = 16;
  const lows = candles.map((c) => c.l);
  const highs = candles.map((c) => c.h);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const range = max - min || 1;
  const slot = (w - pad * 2) / candles.length;

  const y = (v: number) => pad + ((max - v) / range) * (h - pad * 2);

  return (
    <div className="rounded-2xl border border-line bg-panel/50 p-4 shadow-panel">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-semibold text-ink">
            Price · mock OHLC
          </h2>
          <p className="text-[11px] text-ink-faint">
            Swap for TradingView / lightweight-charts when wiring live feeds
          </p>
        </div>
        <div className="flex gap-1">
          {["1m", "5m", "15m", "1h", "4h"].map((tf, i) => (
            <span
              key={tf}
              className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                i === 3
                  ? "bg-amber/20 text-amber"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {tf}
            </span>
          ))}
        </div>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${token.symbol} price chart`}
      >
        <defs>
          <linearGradient id="chartFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245, 180, 0, 0.12)" />
            <stop offset="100%" stopColor="rgba(245, 180, 0, 0)" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((p) => (
          <line
            key={p}
            x1={pad}
            x2={w - pad}
            y1={pad + p * (h - pad * 2)}
            y2={pad + p * (h - pad * 2)}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 6"
          />
        ))}
        {candles.map((c, i) => {
          const x = pad + i * slot + slot / 2;
          const up = c.c >= c.o;
          const color = up ? "#3DDC97" : "#FF5C7A";
          const bodyTop = y(Math.max(c.o, c.c));
          const bodyBot = y(Math.min(c.o, c.c));
          const bodyH = Math.max(2, bodyBot - bodyTop);
          return (
            <g key={i}>
              <line
                x1={x}
                x2={x}
                y1={y(c.h)}
                y2={y(c.l)}
                stroke={color}
                strokeWidth={1.2}
              />
              <rect
                x={x - slot * 0.28}
                y={bodyTop}
                width={slot * 0.56}
                height={bodyH}
                fill={color}
                rx={1}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function buildCandles(token: Token) {
  let seed = 0;
  for (let i = 0; i < token.id.length; i++) seed = (seed + token.id.charCodeAt(i) * (i + 1)) % 9973;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  let price = token.priceUsd;
  const out: { o: number; h: number; l: number; c: number }[] = [];
  for (let i = 0; i < 48; i++) {
    const o = price;
    const drift = (token.changes.h24 / 100 / 48) * price;
    const shock = (rand() - 0.48) * price * 0.04;
    const c = Math.max(price * 0.2, o + drift + shock);
    const h = Math.max(o, c) * (1 + rand() * 0.015);
    const l = Math.min(o, c) * (1 - rand() * 0.015);
    out.push({ o, h, l, c });
    price = c;
  }
  return out;
}
