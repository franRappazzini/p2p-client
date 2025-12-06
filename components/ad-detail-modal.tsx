"use client";

import type { Ad, User } from "@/lib/types";
import { useEffect, useState } from "react";

import { AddressDisplay } from "./ui-custom/address-display";
import { Avatar } from "./ui-custom/avatar";
import { Badge } from "./ui-custom/badge";
import { Button } from "./ui-custom/button";
import { Modal } from "./ui-custom/modal";
import { StatusStepper } from "./ui-custom/status-stepper";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useProgram } from "@/hooks/use-program";
import { useToast } from "@/components/toast";

interface AdDetailModalProps {
  ad: Ad | null;
  isOpen: boolean;
  onClose: () => void;
  showEscrowProgress?: boolean;
  onUpdate?: () => void;
}

const MINT_MAP: Record<string, string> = {
  // SOL: "So11111111111111111111111111111111111111112",
  // USDC: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  // USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  SOL: "CgQcRciW86L748HKmDuXCPaSjVi3pzWf8woysdDBNuqh",
  USDC: "CgQcRciW86L748HKmDuXCPaSjVi3pzWf8woysdDBNuqh",
  USDT: "CgQcRciW86L748HKmDuXCPaSjVi3pzWf8woysdDBNuqh",
};

export function AdDetailModal({
  ad,
  isOpen,
  onClose,
  showEscrowProgress = false,
  onUpdate,
}: AdDetailModalProps) {
  const { primaryWallet } = useDynamicContext();
  const { createEscrow, markAsPaid, releaseTokens } = useProgram();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [creator, setCreator] = useState<User | null>(null);
  const [taker, setTaker] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  useEffect(() => {
    if (primaryWallet?.address) {
      fetch(`/api/users?wallet=${primaryWallet.address}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setCurrentUser(data);
        })
        .catch(console.error);
    }
  }, [primaryWallet?.address]);

  useEffect(() => {
    if (ad?.status === "completed" && primaryWallet?.address) {
      fetch(`/api/ratings?fromWallet=${primaryWallet.address}&adId=${ad.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.hasRated) setHasRated(true);
        });
    }
  }, [ad?.status, ad?.id, primaryWallet?.address]);

  useEffect(() => {
    if (ad?.creatorWallet) {
      fetch(`/api/users?wallet=${ad.creatorWallet}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setCreator(data);
        })
        .catch(console.error);
    }
    if (ad?.takenBy) {
      fetch(`/api/users?wallet=${ad.takenBy}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setTaker(data);
        })
        .catch(console.error);
    }
  }, [ad?.creatorWallet, ad?.takenBy]);

  if (!ad) return null;

  const isCreator = primaryWallet?.address === ad.creatorWallet;
  const isTaker = primaryWallet?.address === ad.takenBy;

  const isTaken = ad.status === "taken";
  const canTake = !isCreator && ad.status === "active";
  const canCreateEscrow = isCreator && isTaken && !ad.escrowId;
  const waitingForEscrow = isTaker && isTaken && !ad.escrowId;

  const canPay = isTaker && (ad.status === "escrow_created" || (isTaken && ad.escrowId));
  const waitingForPayment =
    isCreator && (ad.status === "escrow_created" || (isTaken && ad.escrowId));

  const canRelease = isCreator && ad.status === "paid";
  const waitingForRelease = isTaker && ad.status === "paid";

  const handleTakeAd = async () => {
    if (!primaryWallet) return;

    if (!currentUser?.telegramUsername) {
      showToast({
        message: "You must set a Telegram username in your profile to take ads.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/ads/${ad.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "taken",
          takenBy: primaryWallet.address,
        }),
      });
      if (!res.ok) throw new Error("Failed to take ad");
      showToast({ message: "Ad taken! Contact the seller.", type: "success" });
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      showToast({ message: "Failed to take ad", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEscrow = async () => {
    if (!ad.takenBy) return;
    setIsLoading(true);
    try {
      const mint = MINT_MAP[ad.tokenMint] || MINT_MAP["USDC"];
      // Convert amount to atomic units (assuming 6 decimals for USDC/USDT, 9 for SOL)
      const decimals = ad.tokenMint === "SOL" ? 9 : 6;
      const amountAtomic = Math.floor(ad.tokenAmount * Math.pow(10, decimals));

      const { tx, escrowId } = await createEscrow(amountAtomic, ad.takenBy, mint);
      console.log("Escrow created:", tx, "ID:", escrowId);

      // Update ad with escrow ID
      await fetch(`/api/ads/${ad.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          escrowId: escrowId,
          status: "escrow_created", // Or keep "taken" and use escrowId presence
          creationSignature: tx,
        }),
      });

      showToast({ message: "Escrow created on-chain!", type: "success" });
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      showToast({ message: "Failed to create escrow", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    if (ad.escrowId === undefined) return;
    setIsLoading(true);
    try {
      const tx = await markAsPaid(ad.escrowId);
      showToast({ message: "Marked as paid on-chain!", type: "success" });

      await fetch(`/api/ads/${ad.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid", paidSignature: tx }),
      });

      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      showToast({ message: "Failed to mark as paid", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRelease = async () => {
    if (ad.escrowId === undefined) return;
    setIsLoading(true);
    try {
      const tx = await releaseTokens(ad.escrowId);
      showToast({ message: "Tokens released! Trade completed.", type: "success" });

      await fetch(`/api/ads/${ad.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed", releaseSignature: tx }),
      });

      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      showToast({ message: "Failed to release tokens", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRate = async () => {
    if (!primaryWallet || userRating === 0 || !ad) return;

    const targetWallet = isCreator ? ad.takenBy : ad.creatorWallet;
    if (!targetWallet) return;

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromWallet: primaryWallet.address,
          toWallet: targetWallet,
          adId: ad.id,
          rating: userRating,
          comment: ratingComment,
        }),
      });

      if (res.ok) {
        setHasRated(true);
        showToast({ message: "Rating submitted!", type: "success" });
      }
    } catch (error) {
      console.error(error);
      showToast({ message: "Failed to submit rating", type: "error" });
    }
  };

  const formatTimeLeft = (expiresAt: number) => {
    // ... existing code ...
    const now = Date.now();
    const diff = expiresAt - now;
    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateWallet = (wallet: string) => {
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };

  const mockRating = 4.8;
  const mockCompletedTrades = 23;
  const mockSuccessRate = 96;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        {/* Type & Amounts */}
        <div className="mb-6">
          <Badge variant={ad.type === "buy" ? "success" : "default"} className="mb-3">
            {ad.type.toUpperCase()}
          </Badge>
          <h2 className="text-3xl font-bold text-card-foreground mb-2">
            {ad.tokenAmount} {ad.tokenMint}
          </h2>
          <p className="text-xl text-muted-foreground mb-3">
            → {ad.fiatAmount} {ad.fiatCurrency}
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 inline-block">
            <p className="text-primary font-semibold">
              Price: ${ad.pricePerToken.toFixed(2)}/{ad.tokenMint}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-muted/30 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Trade Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="text-card-foreground font-medium">{ad.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Limit:</span>
              <span className="text-card-foreground font-medium">
                {formatTimeLeft(ad.expiresAt || Date.now() + 3600000)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span className="text-card-foreground font-medium">{formatDate(ad.createdAt)}</span>
            </div>
            {ad.expiresAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span className="text-card-foreground font-medium">{formatDate(ad.expiresAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Creator Profile */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">
            {isCreator ? "Your Profile (Creator)" : "Creator Profile"}
          </h3>
          <div className="flex items-start gap-3 mb-4">
            <Avatar src={creator?.avatar} alt={ad.creatorWallet} size="md" />
            <div className="flex-1">
              <p className="font-semibold text-card-foreground">
                {creator?.username || <AddressDisplay address={ad.creatorWallet} />}
              </p>
              {creator?.username && (
                <AddressDisplay
                  address={ad.creatorWallet}
                  className="text-xs text-muted-foreground"
                />
              )}
              {creator?.telegramUsername && (
                <p className="text-sm text-primary mt-1">@{creator.telegramUsername}</p>
              )}
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-warning text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-1">
                  {mockRating} ({creator?.completedTrades || mockCompletedTrades} trades)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Taker Profile (if exists and user is creator) */}
        {isCreator && ad.takenBy && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">
              Counterparty (Taker)
            </h3>
            <div className="flex items-start gap-3 mb-4">
              <Avatar src={taker?.avatar} alt={ad.takenBy} size="md" />
              <div className="flex-1">
                <p className="font-semibold text-card-foreground">
                  {taker?.username || <AddressDisplay address={ad.takenBy} />}
                </p>
                {taker?.username && (
                  <AddressDisplay address={ad.takenBy} className="text-xs text-muted-foreground" />
                )}
                {taker?.telegramUsername && (
                  <p className="text-sm text-primary mt-1">@{taker.telegramUsername}</p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-muted-foreground ml-1">
                    {taker?.completedTrades || 0} completed trades
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Terms */}
        {ad.terms && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Terms & Conditions</h3>
            <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">
              {ad.terms}
            </div>
          </div>
        )}

        {/* Escrow Progress (conditional) */}
        {showEscrowProgress && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Escrow Status</h3>
            <StatusStepper
              steps={[
                {
                  label: "Escrow Created",
                  completed:
                    ad.status === "escrow_created" ||
                    ad.status === "paid" ||
                    ad.status === "completed",
                  current: ad.status === "taken",
                },
                {
                  label: "Payment Sent",
                  completed: ad.status === "paid" || ad.status === "completed",
                  current: ad.status === "escrow_created",
                },
                {
                  label: "Tokens Released",
                  completed: ad.status === "completed",
                  current: ad.status === "paid",
                },
              ]}
            />
          </div>
        )}

        {/* Transaction History */}
        {(ad.creationSignature || ad.paidSignature || ad.releaseSignature) && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Transaction History</h3>
            <div className="space-y-2 text-sm">
              {ad.creationSignature && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Escrow Created:</span>
                  <a
                    href={`https://explorer.solana.com/tx/${ad.creationSignature}?cluster=custom&customUrl=http%3A%2F%2F127.0.0.1%3A8899`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate max-w-[200px]"
                  >
                    View on Explorer
                  </a>
                </div>
              )}
              {ad.paidSignature && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marked as Paid:</span>
                  <a
                    href={`https://explorer.solana.com/tx/${ad.paidSignature}?cluster=custom&customUrl=http%3A%2F%2F127.0.0.1%3A8899`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate max-w-[200px]"
                  >
                    View on Explorer
                  </a>
                </div>
              )}
              {ad.releaseSignature && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tokens Released:</span>
                  <a
                    href={`https://explorer.solana.com/tx/${ad.releaseSignature}?cluster=custom&customUrl=http%3A%2F%2F127.0.0.1%3A8899`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate max-w-[200px]"
                  >
                    View on Explorer
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rating Section */}
        {ad.status === "completed" && !hasRated && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">
              Rate your experience
            </h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  className={`text-2xl ${star <= userRating ? "text-warning" : "text-muted"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="w-full bg-background border border-border rounded-lg p-2 text-sm mb-3"
              placeholder="Optional comment..."
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
            />
            <Button onClick={handleRate} disabled={userRating === 0} className="w-full">
              Submit Rating
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {waitingForEscrow && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-center mb-3">
              <p className="text-warning font-medium">Waiting for seller to create escrow</p>
              <p className="text-xs text-muted-foreground mt-1">
                Please wait for the seller to initialize the on-chain escrow.
              </p>
            </div>
          )}

          {canTake && (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleTakeAd}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Take Ad"}
            </Button>
          )}

          {canCreateEscrow && (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleCreateEscrow}
              disabled={isLoading}
            >
              {isLoading ? "Creating Escrow..." : "Create Escrow On-Chain"}
            </Button>
          )}

          {waitingForPayment && (
            <div className="bg-muted/30 border border-border rounded-lg p-4 text-center mb-3">
              <p className="text-muted-foreground font-medium">Waiting for buyer to pay</p>
            </div>
          )}

          {canPay && (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleMarkPaid}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Mark as Paid"}
            </Button>
          )}

          {waitingForRelease && (
            <div className="bg-muted/30 border border-border rounded-lg p-4 text-center mb-3">
              <p className="text-muted-foreground font-medium">
                Waiting for seller to release tokens
              </p>
            </div>
          )}

          {canRelease && (
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleRelease}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Release Tokens"}
            </Button>
          )}

          {(isCreator ? taker?.telegramUsername : creator?.telegramUsername) && (
            <Button
              variant="outline"
              size="md"
              className="w-full bg-transparent"
              onClick={() => {
                const username = isCreator ? taker?.telegramUsername : creator?.telegramUsername;
                if (username) {
                  window.open(`https://t.me/${username}`, "_blank");
                }
              }}
            >
              Contact on Telegram
            </Button>
          )}

          <Button variant="ghost" size="sm" className="w-full">
            Report
          </Button>
        </div>
      </div>
    </Modal>
  );
}
