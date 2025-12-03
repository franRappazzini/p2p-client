"use client";

import type { Ad, User } from "@/lib/types";
import { useEffect, useState } from "react";

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
  SOL: "EFLt8jYvwP1JNbJM9q6Kzeg6QMhuhXQNcnzLrzVZQwe1",
  USDC: "EFLt8jYvwP1JNbJM9q6Kzeg6QMhuhXQNcnzLrzVZQwe1",
  USDT: "EFLt8jYvwP1JNbJM9q6Kzeg6QMhuhXQNcnzLrzVZQwe1",
};

export function AdDetailModal({
  ad,
  isOpen,
  onClose,
  showEscrowProgress = false,
  onUpdate,
}: AdDetailModalProps) {
  const { primaryWallet } = useDynamicContext();
  const { createEscrow } = useProgram();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [creator, setCreator] = useState<User | null>(null);

  useEffect(() => {
    if (ad?.creatorWallet) {
      fetch(`/api/users?wallet=${ad.creatorWallet}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setCreator(data);
        })
        .catch(console.error);
    }
  }, [ad?.creatorWallet]);

  if (!ad) return null;

  const isCreator = primaryWallet?.address === ad.creatorWallet;
  const isTaken = ad.status === "taken";
  const canTake = !isCreator && ad.status === "active";
  const canCreateEscrow = isCreator && isTaken && !ad.escrowId;

  const handleTakeAd = async () => {
    if (!primaryWallet) return;
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
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="p-6">
        {/* Type & Amounts */}
        <div className="mb-6">
          <Badge variant={ad.type === "buy" ? "success" : "primary"} className="mb-3">
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
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Creator Profile</h3>
          <div className="flex items-start gap-3 mb-4">
            <Avatar name={ad.creatorWallet} size="md" />
            <div className="flex-1">
              <p className="font-semibold text-card-foreground">
                {truncateWallet(ad.creatorWallet)}
              </p>
              <p className="text-xs text-muted-foreground font-mono">{ad.creatorWallet}</p>
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
                  {mockRating} ({mockCompletedTrades} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted/30 rounded-lg p-2 text-center">
              <p className="text-muted-foreground text-xs">Completed</p>
              <p className="font-bold text-card-foreground">{mockCompletedTrades}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-2 text-center">
              <p className="text-muted-foreground text-xs">Success Rate</p>
              <p className="font-bold text-card-foreground">{mockSuccessRate}%</p>
            </div>
          </div>
        </div>

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
            <StatusStepper currentStep={2} steps={["Open", "Fiat Paid", "Completed"]} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
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

          {creator?.telegramUsername && (
            <Button
              variant="outline"
              size="md"
              className="w-full bg-transparent"
              onClick={() => window.open(`https://t.me/${creator.telegramUsername}`, "_blank")}
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
