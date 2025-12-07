"use client";

import { useEffect, useState } from "react";

import { Ad } from "@/lib/types";
import { AdDetailModal } from "@/components/ad-detail-modal";
import { Badge } from "@/components/ui-custom/badge";
import { Button } from "@/components/ui-custom/button";
import { Sidebar } from "@/components/sidebar";
import { SimpleHeader } from "@/components/simple-header";
import { TableSkeleton } from "@/components/loading-skeleton";
import { Tabs } from "@/components/ui-custom/tabs";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

function EscrowTable({
  ads,
  showLoading = false,
  onViewDetails,
}: {
  ads: Ad[];
  showLoading?: boolean;
  onViewDetails: (ad: Ad) => void;
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
            const isActionable =
              ad.status === "taken" || ad.status === "escrow_created" || ad.status === "paid";

            return (
              <tr
                key={ad.id}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="py-4 px-4 font-mono text-sm text-card-foreground">
                  {ad.id.slice(0, 8)}
                </td>
                <td className="py-4 px-4">
                  <Badge variant={ad.type === "buy" ? "success" : "default"} size="sm">
                    {ad.type.toUpperCase()}
                  </Badge>
                </td>
                <td className="py-4 px-4 font-medium text-card-foreground">
                  {ad.tokenAmount} {ad.tokenMint}
                </td>
                <td className="py-4 px-4">
                  <Badge variant="default" size="sm">
                    {ad.status}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-sm text-muted-foreground">
                  {new Date(ad.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <Button
                    variant={isActionable ? "primary" : "outline"}
                    size="sm"
                    onClick={() => onViewDetails(ad)}
                  >
                    {isActionable ? "Manage Trade" : "View Details"}
                  </Button>
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
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleRefresh = () => {
      if (primaryWallet) fetchAds();
    };
    window.addEventListener("p2p-refresh-ads", handleRefresh);
    return () => window.removeEventListener("p2p-refresh-ads", handleRefresh);
  }, [primaryWallet]);

  const handleRefresh = async () => {
    setIsRefetching(true);
    await fetchAds();
    setTimeout(() => setIsRefetching(false), 500);
  };

  const handleViewDetails = (ad: Ad) => {
    setSelectedAd(ad);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAd(null);
  };

  const handleAdUpdate = () => {
    fetchAds();
  };

  const activeAds = ads.filter(
    (a) =>
      a.status === "active" ||
      a.status === "taken" ||
      a.status === "escrow_created" ||
      a.status === "paid"
  );
  const completedAds = ads.filter((a) => a.status === "completed");

  const tabs = [
    {
      id: "all",
      label: "All",
      content: <EscrowTable ads={ads} showLoading={isLoading} onViewDetails={handleViewDetails} />,
    },
    {
      id: "active",
      label: "Active",
      content: (
        <EscrowTable ads={activeAds} showLoading={isLoading} onViewDetails={handleViewDetails} />
      ),
    },
    {
      id: "completed",
      label: "Completed",
      content: (
        <EscrowTable ads={completedAds} showLoading={isLoading} onViewDetails={handleViewDetails} />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <Sidebar />

      <main className="md:ml-16 container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your P2P trades</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefetching}>
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

        <div className="bg-card border border-border rounded-xl p-6">
          <Tabs tabs={tabs} />
        </div>
      </main>

      <AdDetailModal
        ad={selectedAd}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        showEscrowProgress={true}
        onUpdate={handleAdUpdate}
      />
    </div>
  );
}
