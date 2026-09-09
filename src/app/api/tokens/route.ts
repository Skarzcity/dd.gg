import { NextRequest, NextResponse } from "next/server";
import { getTokenProvider } from "@/lib/providers";
import type { ChainId, DiscoveryFilters, SortField } from "@/lib/types";
import { HARD_FILTERS } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const chains = sp.getAll("chain") as ChainId[];

  const filters: DiscoveryFilters = {
    chains: chains.length ? chains : undefined,
    // Soft floors cannot go below hard floors (also enforced in applyDiscoveryFilters)
    minMarketCap: Math.max(
      HARD_FILTERS.minMarketCapUsd,
      Number(sp.get("minMarketCap") ?? HARD_FILTERS.minMarketCapUsd)
    ),
    minAgeSeconds: Math.max(
      HARD_FILTERS.minAgeSeconds,
      Number(sp.get("minAgeSeconds") ?? HARD_FILTERS.minAgeSeconds)
    ),
    minVolume24h: Number(sp.get("minVolume24h") ?? 0) || undefined,
    minLiquidity: Number(sp.get("minLiquidity") ?? 0) || undefined,
    search: sp.get("search") ?? undefined,
    sortBy: (sp.get("sortBy") as SortField) || "volume24hUsd",
    sortDir: (sp.get("sortDir") as "asc" | "desc") || "desc",
  };

  const provider = getTokenProvider();
  const tokens = await provider.getDiscovery(filters);
  return NextResponse.json({
    tokens,
    hardFilters: HARD_FILTERS,
    count: tokens.length,
  });
}
