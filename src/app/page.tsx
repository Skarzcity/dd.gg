import { DiscoveryClient } from "@/components/discovery/DiscoveryClient";
import { getTokenProvider } from "@/lib/providers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const provider = getTokenProvider();
  const tokens = await provider.getDiscovery({
    sortBy: "volume24hUsd",
    sortDir: "desc",
  });

  return <DiscoveryClient initialTokens={tokens} />;
}
