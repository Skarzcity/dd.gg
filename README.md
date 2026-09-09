# dd.gg

**bonded. liquid. aged in.** — multi-chain meme/token trading terminal. Signal over noise.

Inspired by the *idea* of terminals like gmgn.ai, with a **unique** void + amber brand (Syne / Outfit / IBM Plex Mono) — not a GMGN visual clone.

## Hard filters (data layer)

Enforced in `src/lib/filters.ts` via `passesHardFilters` / `applyDiscoveryFilters` — not only in UI:

| Rule | Gate |
|------|------|
| Bonded / graduated only | `lifecycle !== "on_curve"` |
| Market cap | `≥ $100,000` |
| Age | `≥ 1 hour` |

Discovery feed **and** trading eligibility (`getToken`) both require all three. Soft UI filters can only **raise** floors, never lower them.

Rejected examples live in `REJECTED_EXAMPLES` inside `src/lib/providers/mock/seed.ts` (on-curve, sub-$100K, &lt;1h). Prove with:

```bash
pnpm test:filters
```

## Chains

Solana · Base · BNB (BSC) · Robinhood Chain — plus extensible `ChainId` / `CHAINS` model (Ethereum stubbed for future).

## Stack

- Next.js 15 App Router + TypeScript + Tailwind CSS v4
- Abstract `TokenProvider` + `MockTokenProvider` seed data

## Run

```bash
cd /workspace/dd.gg
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm start
pnpm lint
```

## Swap in live APIs

1. Implement `TokenProvider` in `src/lib/providers/live/` (Birdeye, DexScreener, GeckoTerminal, custom indexer, etc.).
2. Map API payloads → `Token` in `src/lib/types.ts`.
3. **Always** run `applyDiscoveryFilters` / `passesHardFilters` before returning lists or tradeable tokens.
4. Wire `getTokenProvider()` in `src/lib/providers/index.ts` when `TOKEN_PROVIDER=live`.
5. Replace SVG mock chart with TradingView / lightweight-charts; replace Connect / Trade stubs with wagmi or Solana wallet-adapter + DEX routers.

```ts
// src/lib/providers/index.ts (sketch)
if (process.env.TOKEN_PROVIDER === "live") {
  return new LiveTokenProvider({ apiKey: process.env.BIRDEYE_KEY });
}
```

## Key paths

| Path | Role |
|------|------|
| `src/lib/types.ts` | Chains, Token, HARD_FILTERS |
| `src/lib/filters.ts` | Hard + soft filter engine |
| `src/lib/providers/` | TokenProvider + mock |
| `src/app/page.tsx` | Discovery |
| `src/app/token/[id]/page.tsx` | Token detail + trade UI |
| `src/app/api/tokens/route.ts` | Filtered discovery API |

## Brand

- **Name:** dd.gg  
- **Vibe:** only bonded, liquid enough, aged in — signal over noise  
- **UI:** deep void, amber signal accents, cyan lifecycle pills, custom display type
