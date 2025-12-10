"use client";

import type { Ad } from "@/lib/types";
import { AdDetailModal } from "@/components/ad-detail-modal";
import { AdsTable } from "@/components/ads-table";
import { Button } from "@/components/ui-custom/button";
import { FiltersBar } from "@/components/filters-bar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { SimpleHeader } from "@/components/simple-header";
import { useAds } from "@/hooks/use-ads";
import { useState } from "react";

export default function HomePage() {
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");

  const [filters, setFilters] = useState({
    type: "buy",
    token: "all",
    fiat: "all",
  });

  const {
    data: allAds,
    loading,
    error,
    refetch,
  } = useAds({
    type: filters.type !== "all" ? filters.type : undefined,
    token: filters.token !== "all" ? filters.token : undefined,
    fiat: filters.fiat !== "all" ? filters.fiat : undefined,
  });

  const activeAds = allAds.filter((ad) => ad.status === "active");

  // Sort ads based on selected option
  const ads = [...activeAds].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.createdAt - a.createdAt;
      case "lowest-price":
        return a.pricePerToken - b.pricePerToken;
      case "highest-amount":
        return b.tokenAmount - a.tokenAmount;
      case "ending-soon":
        return (a.expiresAt || 0) - (b.expiresAt || 0);
      default:
        return 0;
    }
  });

  const handleRefresh = async () => {
    setIsRefetching(true);
    await refetch();
    setTimeout(() => setIsRefetching(false), 500);
  };

  const handleViewDetails = (ad: Ad) => {
    setSelectedAd(ad);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <Sidebar />

      {/* Main Content - with sidebar spacing */}
      <main className="md:ml-16 container mx-auto px-4 py-8">
        {/* Filters */}
        <FiltersBar className="mb-8" filters={filters} onFiltersChange={setFilters} />

        {/* Ads Count and Sort */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground">
              {loading ? "Loading..." : `${ads.length} Active Ads`}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefetching}
              title="Reload ads"
            >
              <svg
                className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
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
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/create">
              <Button>Create Ad</Button>
            </Link>
            <select
              className="text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="lowest-price">Lowest Price</option>
              <option value="highest-amount">Highest Amount</option>
              <option value="ending-soon">Ending Soon</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4">
                  <div className="h-12 w-24 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="h-9 w-24 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-8 text-center">
            <svg
              className="w-12 h-12 text-muted-foreground mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-foreground font-medium mb-2">Failed to load ads</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => refetch()}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && ads.length === 0 && (
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-8 text-center">
            <svg
              className="w-12 h-12 text-muted-foreground mx-auto mb-4"
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
            <p className="text-foreground font-medium mb-2">No ads found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or create the first ad!
            </p>
          </div>
        )}

        {!loading && !error && ads.length > 0 && (
          <AdsTable ads={ads} onViewDetails={handleViewDetails} />
        )}
      </main>

      <Footer />
      {/* Modal */}
      <AdDetailModal
        ad={selectedAd}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showEscrowProgress={selectedAd?.id === "2"}
      />
    </div>
  );
}
