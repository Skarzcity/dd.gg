import type { TokenProvider } from "./TokenProvider";
import { MockTokenProvider } from "./mock/MockTokenProvider";

let cached: TokenProvider | null = null;

/**
 * Factory — set TOKEN_PROVIDER=live when a live impl exists.
 * Today only mock is wired; live APIs documented in README.
 */
export function getTokenProvider(): TokenProvider {
  if (cached) return cached;
  const mode = process.env.TOKEN_PROVIDER ?? "mock";
  if (mode === "live") {
    // Placeholder: import { LiveTokenProvider } from "./live/LiveTokenProvider";
    // cached = new LiveTokenProvider();
    throw new Error(
      "Live TokenProvider not configured. Implement src/lib/providers/live and set TOKEN_PROVIDER=live."
    );
  }
  cached = new MockTokenProvider();
  return cached;
}

export type { TokenProvider } from "./TokenProvider";
export { MockTokenProvider } from "./mock/MockTokenProvider";
