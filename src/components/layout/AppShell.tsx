"use client";

import { useState } from "react";
import { Header } from "./Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-void text-ink">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none fixed -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-amber/5 blur-3xl" />
      <Header
        onConnect={() => {
          setToast("Wallet connect stub — plug in wagmi / wallet-adapter");
          setTimeout(() => setToast(null), 3200);
        }}
      />
      <main className="relative mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
        {children}
      </main>
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-line bg-panel px-4 py-2 text-sm text-ink shadow-glow">
          {toast}
        </div>
      )}
    </div>
  );
}
