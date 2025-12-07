"use client";

import { AuthWatcher } from "@/components/auth-watcher";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EscrowContextProvider } from "@/app/contexts/escrow-context";
import { EventsWatcher } from "@/components/events-watcher";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <DynamicContextProvider
        settings={{
          environmentId: "004b7624-6c0d-4bb2-98ca-1f2a9ac995b0",
          walletConnectors: [SolanaWalletConnectors],
        }}
      >
        <EscrowContextProvider>
          <AuthWatcher />
          <EventsWatcher />
          {children}
          <Toaster />
        </EscrowContextProvider>
      </DynamicContextProvider>
    </ThemeProvider>
  );
}

export default Providers;
