export function TokenAvatar({
  symbol,
  hue,
  size = 32,
}: {
  symbol: string;
  hue: number;
  size?: number;
}) {
  const letter = symbol.slice(0, 2).toUpperCase();
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg font-display text-xs font-bold text-void"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue} 85% 55%), hsl(${(hue + 40) % 360} 70% 35%))`,
        boxShadow: `0 0 16px hsl(${hue} 80% 50% / 0.35)`,
      }}
      aria-hidden
    >
      {letter}
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_45%)] opacity-40" />
    </div>
  );
}
