"use client";

import { useEffect, useState } from "react";

import { Ad } from "@/lib/types";
import { Badge } from "@/components/ui-custom/badge";
import { Button } from "@/components/ui-custom/button";
import { Sidebar } from "@/components/sidebar";
import { SimpleHeader } from "@/components/simple-header";
import { StatCard } from "@/components/ui-custom/stat-card";
import { TableSkeleton } from "@/components/loading-skeleton";
import { Tabs } from "@/components/ui-custom/tabs";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useProgram } from "@/hooks/use-program";
import { useToast } from "@/components/toast";

function EscrowTable({
  ads,
  showLoading = false,
  onAction,
}: {
  ads: Ad[];
  showLoading?: boolean;
  onAction: (ad: Ad, action: "pay" | "release") => void;
}) {
  const { primaryWallet } = useDynamicContext();

  if (showLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (ads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="text-muted-foreground">No escrows found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Amount
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Created
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => {
            const isSeller = primaryWallet?.address === ad.creatorWallet;
            const isBuyer = primaryWallet?.address === ad.takenBy;
            const hasEscrow = ad.escrowId !== undefined;

            return (
              <tr
                key={ad.id}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="py-4 px-4 font-mono text-sm text-card-foreground">
                  {ad.id.slice(0, 8)}
                </td>
                <td className="py-4 px-4">
                  <Badge variant={ad.type === "buy" ? "success" : "primary"} size="sm">
                    {ad.type.toUpperCase()}
                  </Badge>
                </td>
                <td className="py-4 px-4 font-medium text-card-foreground">
                  {ad.tokenAmount} {ad.tokenMint}
                </td>
                <td className="py-4 px-4">
                  <Badge variant="outline" size="sm">
                    {ad.status}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-sm text-muted-foreground">
                  {new Date(ad.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 text-right">
                  {hasEscrow && isBuyer && ad.status !== "completed" && (
                    <Button variant="primary" size="sm" onClick={() => onAction(ad, "pay")}>
                      Mark Paid
                    </Button>
                  )}
                  {hasEscrow && isSeller && ad.status !== "completed" && (
                    <Button variant="success" size="sm" onClick={() => onAction(ad, "release")}>
                      Release
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardPage() {
  const { primaryWallet } = useDynamicContext();
  const { markAsPaid, releaseTokens } = useProgram();
  const { showToast, ToastComponent } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/ads");
      const data = await res.json();
      if (Array.isArray(data)) {
        // Filter ads where user is creator or taker
        const myAds = data.filter(
          (ad: Ad) =>
            ad.creatorWallet === primaryWallet?.address || ad.takenBy === primaryWallet?.address
        );
        setAds(myAds);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (primaryWallet) {
      fetchAds();
    }
  }, [primaryWallet]);

  const handleAction = async (ad: Ad, action: "pay" | "release") => {
    if (ad.escrowId === undefined) return;

    try {
      if (action === "pay") {
        await markAsPaid(ad.escrowId);
        showToast({ message: "Marked as paid on-chain!", type: "success" });
        // Update status locally or refetch
        // Ideally update backend too
      } else {
        await releaseTokens(ad.escrowId);
        showToast({ message: "Tokens released! Trade completed.", type: "success" });
        // Update backend
        await fetch(`/api/ads/${ad.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        });
        fetchAds();
      }
    } catch (error) {
      console.error(error);
      showToast({ message: `Failed to ${action}`, type: "error" });
    }
  };

  const activeAds = ads.filter(
    (a) => a.status === "active" || a.status === "taken" || a.status === "escrow_created"
  );
  const completedAds = ads.filter((a) => a.status === "completed");

  const tabs = [
    {
      id: "all",
      label: "All",
      content: <EscrowTable ads={ads} showLoading={isLoading} onAction={handleAction} />,
    },
    {
      id: "active",
      label: "Active",
      content: <EscrowTable ads={activeAds} showLoading={isLoading} onAction={handleAction} />,
    },
    {
      id: "completed",
      label: "Completed",
      content: <EscrowTable ads={completedAds} showLoading={isLoading} onAction={handleAction} />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <Sidebar />
      {ToastComponent}

      <main className="md:ml-16 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your P2P trades</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <Tabs tabs={tabs} />
        </div>
      </main>
    </div>
  );
}
