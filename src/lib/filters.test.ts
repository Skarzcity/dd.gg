/**
 * Lightweight assertion module — run with: npx tsx src/lib/filters.test.ts
 * Proves hard filters reject on-curve / low mcap / young tokens.
 */
import { applyDiscoveryFilters, passesHardFilters } from "./filters";
import { ALL_INCLUDING_REJECTED, REJECTED_EXAMPLES, SEED_TOKENS } from "./providers/mock/seed";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`PASS: ${msg}`);
}

assert(SEED_TOKENS.every(passesHardFilters), "all seed tokens pass hard filters");
assert(
  REJECTED_EXAMPLES.every((t) => !passesHardFilters(t)),
  "all rejected examples fail hard filters"
);

const discovered = applyDiscoveryFilters(ALL_INCLUDING_REJECTED, {});
assert(
  discovered.length === SEED_TOKENS.length,
  `discovery returns only seed (${discovered.length} === ${SEED_TOKENS.length})`
);
assert(
  discovered.every((t) => t.lifecycle !== "on_curve"),
  "no on-curve tokens in discovery"
);
assert(
  discovered.every((t) => t.marketCapUsd >= 100_000),
  "all discovery mcap >= 100K"
);
assert(
  discovered.every((t) => t.ageSeconds >= 3600),
  "all discovery age >= 1h"
);

console.log("\nAll hard-filter proofs passed.");
