"use client";

import { SolanaIcon, UsdcIcon, UsdtIcon } from "@/components/icons";

import { Button } from "@/components/ui-custom/button";
import { Sidebar } from "@/components/sidebar";
import { SimpleHeader } from "@/components/simple-header";
import { Tabs } from "@/components/ui-custom/tabs";
import { WrapUnwrapCard } from "@/components/wrap-unwrap-card";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useProgram } from "@/hooks/use-program";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWalletBalances } from "@/hooks/use-wallet-balances";

const tokenIcons: Record<string, React.ReactNode> = {
  SOL: <SolanaIcon width={32} height={32} />,
  wSOL: <SolanaIcon width={32} height={32} />,
  USDC: <UsdcIcon />,
  USDT: <UsdtIcon />,
};

export default function WalletPage() {
  const router = useRouter();
  const { primaryWallet } = useDynamicContext();
  const { balances, isLoading, refetch } = useWalletBalances();
  const { wrapSol, unwrapSol } = useProgram();
  const [isRefetching, setIsRefetching] = useState(false);

  if (!primaryWallet) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <Sidebar />
        <main className="md:ml-16 container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">
              Wallet Connection Required
            </h2>
            <p className="text-muted-foreground mb-6">
              Please connect your wallet to view your balances and manage your tokens.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const handleRefresh = async () => {
    setIsRefetching(true);
    await refetch();
    setTimeout(() => setIsRefetching(false), 500);
  };

  const handleWrapSuccess = async () => {
    await refetch();
  };

  const tokens = [
    { symbol: "SOL", balance: balances.sol, color: "text-purple-500" },
    { symbol: "wSOL", balance: balances.wsol, color: "text-purple-400" },
    { symbol: "USDC", balance: balances.usdc, color: "text-blue-500" },
    { symbol: "USDT", balance: balances.usdt, color: "text-green-500" },
  ];

  const wrapUnwrapTabs = [
    {
      id: "wrap",
      label: "SOL → wSOL",
      content: (
        <WrapUnwrapCard
          mode="wrap"
          balance={balances.sol}
          onSuccess={handleWrapSuccess}
          onWrap={wrapSol}
        />
      ),
    },
    {
      id: "unwrap",
      label: "wSOL → SOL",
      content: (
        <WrapUnwrapCard
          mode="unwrap"
          balance={balances.wsol}
          onSuccess={handleWrapSuccess}
          onUnwrap={unwrapSol}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <Sidebar />

      <main className="md:ml-16 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Wallet</h1>
            <p className="text-muted-foreground">Manage your tokens and balances</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefetching} >
            <svg
              className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </Button>
        </div>

        {/* Balances Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tokens.map((token) => (
              <div
                key={token.symbol}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={token.color}>{tokenIcons[token.symbol]}</div>
                    <span className="text-lg font-semibold text-card-foreground">
                      {token.symbol}
                    </span>
                  </div>
                </div>
                <div>
                  {isLoading ? (
                    <div className="h-8 bg-muted animate-pulse rounded" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{token.balance.toFixed(6)}</p>
                )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wrap/Unwrap Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Convert SOL ⇄ wSOL</h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <Tabs tabs={wrapUnwrapTabs} />
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-muted/30 border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">
            About Wrapped SOL (wSOL)
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              wSOL is the SPL token version of SOL. It's required for trading on this platform as
              all trades use SPL tokens.
            </p>
            <p>
              When you wrap SOL, it's converted 1:1 to wSOL. You can unwrap it back to SOL at any
              time.
            </p>
            <p className="text-xs pt-2 border-t border-border">
              Note: Always keep some SOL unwrapped for transaction fees (~0.01 SOL recommended).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
