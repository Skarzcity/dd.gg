import Link from "next/link";

export default function TokenNotFound() {
  return (
    <div className="mx-auto max-w-lg py-24 text-center">
      <p className="font-display text-2xl font-bold text-ink">Not tradeable</p>
      <p className="mt-3 text-sm text-ink-muted">
        Token missing — or it failed hard filters (must be bonded/graduated,
        mcap ≥ $100K, age ≥ 1h).
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-amber px-4 py-2 font-display text-sm font-semibold text-void"
      >
        Back to discovery
      </Link>
    </div>
  );
}
