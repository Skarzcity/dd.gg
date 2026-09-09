import {
  HARD_FILTERS,
  type DiscoveryFilters,
  type SortField,
  type Token,
} from "./types";

/**
 * HARD FILTERS — enforced here in the data layer, not only in UI.
 * A token must satisfy ALL of:
 * 1. lifecycle is "bonded" or "graduated" (never "on_curve")
 * 2. marketCapUsd >= $100,000
 * 3. ageSeconds >= 1 hour
 */
export function passesHardFilters(token: Token): boolean {
  if (token.lifecycle === "on_curve") return false;
  if (token.marketCapUsd < HARD_FILTERS.minMarketCapUsd) return false;
  if (token.ageSeconds < HARD_FILTERS.minAgeSeconds) return false;
  return true;
}

export function isTradingEligible(token: Token): boolean {
  return passesHardFilters(token);
}

function changeValue(token: Token, field: SortField): number {
  switch (field) {
    case "change1h":
      return token.changes.h1;
    case "change24h":
      return token.changes.h24;
    case "holders":
      return token.holders.holderCount;
    case "marketCapUsd":
      return token.marketCapUsd;
    case "volume24hUsd":
      return token.volume24hUsd;
    case "liquidityUsd":
      return token.liquidityUsd;
    case "ageSeconds":
      return token.ageSeconds;
    case "priceUsd":
      return token.priceUsd;
    default:
      return 0;
  }
}

export function applyDiscoveryFilters(
  tokens: Token[],
  filters: DiscoveryFilters = {}
): Token[] {
  // Always apply hard filters first
  let result = tokens.filter(passesHardFilters);

  if (filters.chains && filters.chains.length > 0) {
    const set = new Set(filters.chains);
    result = result.filter((t) => set.has(t.chain));
  }

  // Soft floors can only raise the hard floors, never lower them
  const minMcap = Math.max(
    HARD_FILTERS.minMarketCapUsd,
    filters.minMarketCap ?? 0
  );
  const minAge = Math.max(
    HARD_FILTERS.minAgeSeconds,
    filters.minAgeSeconds ?? 0
  );
  result = result.filter(
    (t) => t.marketCapUsd >= minMcap && t.ageSeconds >= minAge
  );

  if (filters.minVolume24h != null) {
    result = result.filter((t) => t.volume24hUsd >= filters.minVolume24h!);
  }
  if (filters.minLiquidity != null) {
    result = result.filter((t) => t.liquidityUsd >= filters.minLiquidity!);
  }

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q)
    );
  }

  const sortBy = filters.sortBy ?? "volume24hUsd";
  const sortDir = filters.sortDir ?? "desc";
  const mult = sortDir === "asc" ? 1 : -1;
  result = [...result].sort(
    (a, b) => (changeValue(a, sortBy) - changeValue(b, sortBy)) * mult
  );

  return result;
}
