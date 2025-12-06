"use client";

import { Ad, Rating, User } from "@/lib/types";
import { use, useEffect, useState } from "react";

import { AddressDisplay } from "@/components/ui-custom/address-display";
import { Avatar } from "@/components/ui-custom/avatar";
import { Badge } from "@/components/ui-custom/badge";
import { Button } from "@/components/ui-custom/button";
import { Sidebar } from "@/components/sidebar";
import { SimpleHeader } from "@/components/simple-header";
import { StatCard } from "@/components/ui-custom/stat-card";
import { Tabs } from "@/components/ui-custom/tabs";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/toast";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= Math.round(rating) ? "text-warning fill-warning" : "text-muted"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function PublicProfilePage({ params }: { params: Promise<{ address: string }> }) {
  const { ToastComponent } = useToast();
  const { address } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address) {
      fetchUser(address);
      fetchReviews(address);
    }
  }, [address]);

  const fetchUser = async (wallet: string) => {
    try {
      const res = await fetch(`/api/users?wallet=${wallet}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async (wallet: string) => {
    try {
      const res = await fetch(`/api/ratings?wallet=${wallet}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const reviewsContent = (
    <div className="space-y-4">
      {reviews.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No reviews yet</div>
      )}
      {reviews.map((review) => (
        <div key={review.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-mono">{review.fromWallet.slice(0, 2)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <AddressDisplay
                  address={review.fromWallet}
                  className="font-medium text-card-foreground"
                />
                <span className="text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating ? "text-warning fill-warning" : "text-muted"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">{review.comment}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <Sidebar />

      <main className="md:ml-16 container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative group">
              <Avatar
                src={user?.avatar}
                alt={user?.username || "User"}
                size="xl"
                className="mx-auto md:mx-0"
              />
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              <h1 className="text-2xl font-bold text-card-foreground mb-1">
                {user?.username || "Anonymous User"}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-3">
                <AddressDisplay
                  address={user?.walletAddress || address}
                  className="font-mono text-sm"
                />

                {user?.telegramUsername && (
                  <span className="text-primary text-sm">@{user.telegramUsername}</span>
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <StarRating
                  rating={
                    user?.ratingCount && user.ratingCount > 0
                      ? user.ratingSum / user.ratingCount
                      : 0
                  }
                />
                <span className="text-muted-foreground">
                  {user?.ratingCount && user.ratingCount > 0
                    ? (user.ratingSum / user.ratingCount).toFixed(1)
                    : "0.0"}{" "}
                  ({user?.ratingCount || 0} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
          <StatCard
            title="Rating"
            value={`★ ${
              user?.ratingCount && user.ratingCount > 0
                ? (user.ratingSum / user.ratingCount).toFixed(1)
                : "0.0"
            }`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            }
          />
          <StatCard
            title="Member Since"
            value={new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
        </div>

        {/* Reviews */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-card-foreground mb-6">Reviews</h2>
          {reviewsContent}
        </div>
      </main>
    </div>
  );
}
