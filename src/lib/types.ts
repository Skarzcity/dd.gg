export type ChainId =
  | "solana"
  | "base"
  | "bnb"
  | "robinhood"
  | "ethereum";

export interface ChainMeta {
  id: ChainId;
  name: string;
  short: string;
  color: string;
  nativeSymbol: string;
}

export const CHAINS: Record<ChainId, ChainMeta> = {
  solana: {
    id: "solana",
    name: "Solana",
    short: "SOL",
    color: "#9945FF",
    nativeSymbol: "SOL",
  },
  base: {
    id: "base",
    name: "Base",
    short: "BASE",
    color: "#0052FF",
    nativeSymbol: "ETH",
  },
  bnb: {
    id: "bnb",
    name: "BNB Chain",
    short: "BNB",
    color: "#F0B90B",
    nativeSymbol: "BNB",
  },
  robinhood: {
    id: "robinhood",
    name: "Robinhood Chain",
    short: "HOOD",
    color: "#CCFF00",
    nativeSymbol: "ETH",
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    short: "ETH",
    color: "#627EEA",
    nativeSymbol: "ETH",
  },
};

export const SUPPORTED_CHAINS: ChainId[] = [
  "solana",
  "base",
  "bnb",
  "robinhood",
];

/** Bonding / listing lifecycle */
export type TokenLifecycle = "on_curve" | "bonded" | "graduated";

export interface PriceChanges {
  m1: number;
  m5: number;
  h1: number;
  h24: number;
}

export interface SecurityFlags {
  honeypot: boolean;
  mintRenounced: boolean;
  freezeRenounced: boolean;
  lpBurned: boolean;
  lpLocked: boolean;
  buyTaxPct: number;
  sellTaxPct: number;
}

export interface HolderStructure {
  top10Pct: number;
  devPct: number;
  bundlerPct: number;
  insiderPct: number;
  holderCount: number;
}

export interface TokenSocials {
  twitter?: string;
  telegram?: string;
  website?: string;
  discord?: string;
}

export interface PoolInfo {
  dex: string;
  pairAddress: string;
  quoteSymbol: string;
}

export interface Token {
  id: string;
  address: string;
  symbol: string;
  name: string;
  chain: ChainId;
  /** Lifecycle — only bonded/graduated pass hard filters */
  lifecycle: TokenLifecycle;
  priceUsd: number;
  changes: PriceChanges;
  marketCapUsd: number;
  liquidityUsd: number;
  volume24hUsd: number;
  holders: HolderStructure;
  /** Age in seconds since first liquidity / launch */
  ageSeconds: number;
  createdAt: number;
  security: SecurityFlags;
  socials: TokenSocials;
  pool: PoolInfo;
  imageHue: number;
}

export interface DiscoveryFilters {
  chains?: ChainId[];
  minMarketCap?: number;
  minAgeSeconds?: number;
  minVolume24h?: number;
  minLiquidity?: number;
  search?: string;
  sortBy?: SortField;
  sortDir?: "asc" | "desc";
}

export type SortField =
  | "marketCapUsd"
  | "volume24hUsd"
  | "liquidityUsd"
  | "ageSeconds"
  | "priceUsd"
  | "change1h"
  | "change24h"
  | "holders";

/** Product hard floors — enforced in data layer */
export const HARD_FILTERS = {
  /** Never surface on-curve / bonding-curve tokens */
  requireBonded: true,
  minMarketCapUsd: 100_000,
  minAgeSeconds: 60 * 60, // 1 hour
} as const;
