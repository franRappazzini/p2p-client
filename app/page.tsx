"use client";

import type { Ad } from "@/lib/types";
import { AdDetailModal } from "@/components/ad-detail-modal";
import { AdsTable } from "@/components/ads-table";
import { Button } from "@/components/ui-custom/button";
import { FiltersBar } from "@/components/filters-bar";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { SimpleHeader } from "@/components/simple-header";
import { useAds } from "@/hooks/use-ads";
import { useState } from "react";

export default function HomePage() {
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const [filters, setFilters] = useState({
    type: "buy",
    token: "all",
    fiat: "all",
  });

  const { data: allAds, loading, error, refetch } = useAds(filters);
  const ads = allAds.filter((ad) => ad.status === "active");

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
            <select className="text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Newest First</option>
              <option>Lowest Price</option>
              <option>Highest Amount</option>
              <option>Ending Soon</option>
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

      {/* Footer */}
      <footer className="border-t border-border mt-16 md:ml-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-foreground">SolEscrow</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 SolEscrow. All rights reserved.</p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>

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
