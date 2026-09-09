import { notFound } from "next/navigation";
import { TokenDetail } from "@/components/token/TokenDetail";
import { getTokenProvider } from "@/lib/providers";

export const dynamic = "force-dynamic";

export default async function TokenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = getTokenProvider();
  const token = await provider.getToken(id);
  if (!token) notFound();
  return <TokenDetail token={token} />;
}
