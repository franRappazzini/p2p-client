"use client";

import { Ad, Rating, User } from "@/lib/types";
import { ChangeEvent, useEffect, useState } from "react";

import { AdDetailModal } from "@/components/ad-detail-modal";
import { AddressDisplay } from "@/components/ui-custom/address-display";
import { Avatar } from "@/components/ui-custom/avatar";
import { Badge } from "@/components/ui-custom/badge";
import { Button } from "@/components/ui-custom/button";
import { Sidebar } from "@/components/sidebar";
import { SimpleHeader } from "@/components/simple-header";
import { StatCard } from "@/components/ui-custom/stat-card";
import { Tabs } from "@/components/ui-custom/tabs";
import { formatDistanceToNow } from "date-fns";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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

export default function ProfilePage() {
  const { primaryWallet } = useDynamicContext();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    telegramUsername: "",
    avatar: "",
  });



  useEffect(() => {
    if (primaryWallet?.address) {
      fetchUser(primaryWallet.address);
      fetchReviews(primaryWallet.address);
      fetchAds(primaryWallet.address);
    }
  }, [primaryWallet]);

  const fetchUser = async (wallet: string) => {
    try {
      const res = await fetch(`/api/users?wallet=${wallet}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFormData({
          username: data.username,
          telegramUsername: data.telegramUsername || "",
          avatar: data.avatar || "",
        });
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

  const fetchAds = async (wallet: string) => {
    try {
      const res = await fetch("/api/ads");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const userAds = data.filter(
            (ad: Ad) => ad.creatorWallet === wallet || ad.takenBy === wallet
          );
          setAds(userAds);
        }
      }
    } catch (error) {
      console.error("Failed to fetch ads", error);
    }
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
    if (primaryWallet?.address) {
      fetchAds(primaryWallet.address);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!primaryWallet?.address) return;

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: primaryWallet.address,
          ...formData,
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setIsEditing(false);
        toast({
          title: "✅ Profile Updated!",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!primaryWallet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Please connect your wallet to view your profile.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const activeAds = ads.filter(
    (ad) => ad.creatorWallet === primaryWallet?.address && ad.status === "active"
  );
  const completedAds = ads.filter((ad) => ad.status === "completed");

  const tabContent = {
    active: (
      <div className="space-y-4">
        {activeAds.map((ad) => (
          <div
            key={ad.id}
            className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Badge variant={ad.type === "buy" ? "buy" : "sell"} size="sm">
                {ad.type.toUpperCase()}
              </Badge>
              <div>
                <p className="font-semibold text-card-foreground">
                  {ad.tokenAmount} {ad.tokenMint}
                </p>
                <p className="text-sm text-muted-foreground">
                  → ${ad.fiatAmount} {ad.fiatCurrency}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(ad.createdAt, { addSuffix: true })}
              </span>
              <Button variant="outline" size="sm" onClick={() => handleViewDetails(ad)}>
                View
              </Button>
            </div>
          </div>
        ))}
        {activeAds.length === 0 && (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">No active ads</p>
          </div>
        )}
      </div>
    ),
    completed: (
      <div className="space-y-4">
        {completedAds.map((ad) => (
          <div
            key={ad.id}
            className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Badge variant="success" size="sm">
                COMPLETED
              </Badge>
              <div>
                <p className="font-semibold text-card-foreground">
                  {ad.tokenAmount} {ad.tokenMint}
                </p>
                <p className="text-sm text-muted-foreground">
                  → ${ad.fiatAmount} {ad.fiatCurrency}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {new Date(ad.createdAt).toLocaleDateString()}
              </span>
              <Button variant="ghost" size="sm" onClick={() => handleViewDetails(ad)}>
                Details
              </Button>
            </div>
          </div>
        ))}
        {completedAds.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No completed trades yet</div>
        )}
      </div>
    ),
    reviews: (
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
    ),
  };

  const tabs = [
    { id: "active", label: "Active", content: tabContent.active },
    { id: "completed", label: "Completed", content: tabContent.completed },
    { id: "reviews", label: "Reviews", content: tabContent.reviews },
  ];

  const cancelledAds = ads.filter((ad) => ad.status === "cancelled");
  const finishedCount = completedAds.length + cancelledAds.length;
  const successRate =
    finishedCount > 0 ? Math.round((completedAds.length / finishedCount) * 100) : 0;

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
                src={isEditing ? formData.avatar : user?.avatar}
                alt={user?.username || "User"}
                size="xl"
                className="mx-auto md:mx-0"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <label className="cursor-pointer text-white text-xs font-medium">
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              {isEditing ? (
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Telegram Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-muted-foreground">@</span>
                      <input
                        type="text"
                        value={formData.telegramUsername}
                        onChange={(e) =>
                          setFormData({ ...formData, telegramUsername: e.target.value })
                        }
                        className="w-full pl-7 pr-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <Button variant="primary" size="sm" onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-card-foreground mb-1">
                    {user?.username || "Anonymous User"}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-3">
                    <AddressDisplay
                      address={user?.walletAddress || primaryWallet.address || ""}
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
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Completed Trades"
            value={completedAds.length}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Success Rate"
            value={`${successRate}%`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />
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

        {/* Tabs */}
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
