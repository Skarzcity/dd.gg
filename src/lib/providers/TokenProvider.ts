import type { DiscoveryFilters, Token } from "../types";

/**
 * Abstract token data provider.
 * Swap MockTokenProvider for a live API implementation without touching UI.
 *
 * Live swap checklist (see README):
 * 1. Implement TokenProvider against Birdeye / DexScreener / GeckoTerminal / custom indexer
 * 2. Map responses → Token shape
 * 3. ALWAYS run applyDiscoveryFilters / passesHardFilters before returning lists
 * 4. Export via getTokenProvider() factory (env TOKEN_PROVIDER=live|mock)
 */
export interface TokenProvider {
  /** Discovery feed — MUST apply hard filters */
  getDiscovery(filters?: DiscoveryFilters): Promise<Token[]>;

  /** Single token — returns null if missing OR fails hard filters (not tradeable) */
  getToken(id: string): Promise<Token | null>;

  /** Raw lookup bypassing filters — for tests / admin only */
  getTokenRaw?(id: string): Promise<Token | null>;
}
