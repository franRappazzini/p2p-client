"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthWatcher } from "@/components/auth-watcher";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <DynamicContextProvider
        settings={{
          environmentId: "004b7624-6c0d-4bb2-98ca-1f2a9ac995b0",
          walletConnectors: [SolanaWalletConnectors],
        }}
      >
        <AuthWatcher />
        {children}
      </DynamicContextProvider>
    </ThemeProvider>
  );
}

export default Providers;
