import { applyDiscoveryFilters, isTradingEligible } from "../../filters";
import type { DiscoveryFilters, Token } from "../../types";
import type { TokenProvider } from "../TokenProvider";
import { ALL_INCLUDING_REJECTED, SEED_TOKENS } from "./seed";

/**
 * In-memory provider. Discovery and getToken always gate on hard filters.
 * getTokenRaw exposes rejected examples for tests.
 */
export class MockTokenProvider implements TokenProvider {
  private tokens: Token[];

  constructor(tokens: Token[] = SEED_TOKENS) {
    this.tokens = tokens;
  }

  async getDiscovery(filters: DiscoveryFilters = {}): Promise<Token[]> {
    // Soft jitter so the feed feels live without changing filter outcomes
    const jittered = this.tokens.map((t) => ({
      ...t,
      changes: {
        ...t.changes,
        m1: round2(t.changes.m1 + (Math.random() - 0.5) * 0.4),
      },
      volume24hUsd: t.volume24hUsd * (1 + (Math.random() - 0.5) * 0.02),
    }));
    return applyDiscoveryFilters(jittered, filters);
  }

  async getToken(id: string): Promise<Token | null> {
    const token =
      this.tokens.find((t) => t.id === id || t.address === id) ?? null;
    if (!token) return null;
    if (!isTradingEligible(token)) return null;
    return token;
  }

  async getTokenRaw(id: string): Promise<Token | null> {
    const corpus = ALL_INCLUDING_REJECTED;
    return corpus.find((t) => t.id === id || t.address === id) ?? null;
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
