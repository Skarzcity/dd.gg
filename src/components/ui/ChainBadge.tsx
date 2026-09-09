import { CHAINS, type ChainId } from "@/lib/types";

export function ChainBadge({
  chain,
  size = "sm",
}: {
  chain: ChainId;
  size?: "sm" | "md";
}) {
  const meta = CHAINS[chain];
  const pad = size === "md" ? "px-2.5 py-1 text-xs" : "px-1.5 py-0.5 text-[10px]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-mono font-semibold uppercase tracking-wider ${pad}`}
      style={{
        background: `${meta.color}22`,
        color: meta.color,
        border: `1px solid ${meta.color}55`,
      }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: meta.color }}
      />
      {meta.short}
    </span>
  );
}
