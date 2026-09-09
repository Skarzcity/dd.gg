import { formatPct } from "@/lib/format";

export function Pct({ value, className = "" }: { value: number; className?: string }) {
  const tone =
    value > 0 ? "text-signal-up" : value < 0 ? "text-signal-down" : "text-ink-muted";
  return (
    <span className={`font-mono tabular-nums ${tone} ${className}`}>
      {formatPct(value)}
    </span>
  );
}
