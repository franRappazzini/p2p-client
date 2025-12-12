"use client";

import { Button } from "@/components/ui-custom/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WrapUnwrapCardProps {
  mode: "wrap" | "unwrap";
  balance: number;
  onSuccess: () => void;
  onWrap?: (amount: number) => Promise<string>;
  onUnwrap?: (amount: number) => Promise<string>;
}

export function WrapUnwrapCard({
  mode,
  balance,
  onSuccess,
  onWrap,
  onUnwrap,
}: WrapUnwrapCardProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleMaxClick = () => {
    // Reserve 0.01 SOL for transaction fees when wrapping
    const maxAmount = mode === "wrap" ? Math.max(0, balance - 0.01) : balance;
    setAmount(maxAmount.toString());
  };

  const handleSubmit = async () => {
    // For unwrap, we always use the full balance
    const numAmount = mode === "unwrap" ? balance : parseFloat(amount);

    if (!numAmount || numAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description:
          mode === "unwrap" ? "No wSOL balance to unwrap." : "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    if (numAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${mode === "wrap" ? "SOL" : "wSOL"}.`,
        variant: "destructive",
      });
      return;
    }

    // Check for minimum SOL reserve when wrapping
    if (mode === "wrap" && balance - numAmount < 0.01) {
      toast({
        title: "Reserve SOL for Fees",
        description: "Please leave at least 0.01 SOL for transaction fees.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      let signature: string;

      if (mode === "wrap" && onWrap) {
        signature = await onWrap(numAmount);
      } else if (mode === "unwrap" && onUnwrap) {
        // Unwrap doesn't need amount parameter - it unwraps all
        signature = await onUnwrap(balance);
      } else {
        throw new Error("Operation not supported");
      }

      const actualAmount = mode === "unwrap" ? balance : numAmount;

      toast({
        title: "✅ Success!",
        description: `Successfully ${
          mode === "wrap" ? "wrapped" : "unwrapped"
        } ${actualAmount.toFixed(6)} ${mode === "wrap" ? "SOL" : "wSOL"}`,
      });

      setAmount("");
      onSuccess();
    } catch (error: any) {
      console.error(`Error ${mode}ping:`, error);
      toast({
        title: "Transaction Failed",
        description: error.message || `Failed to ${mode} tokens. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const estimatedReceive = parseFloat(amount) || 0;
  const estimatedFee = 0.00001; // Approximate SOL transaction fee

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {mode === "unwrap" ? (
        <div className="mb-6">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-4">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
              ℹ️ Unwrapping will close your wSOL account and convert your entire balance to SOL.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">You will unwrap:</span>
              <span className="text-lg font-bold text-foreground">{balance.toFixed(6)} wSOL</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Amount to Wrap
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 pr-20 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              step="0.000001"
              min="0"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={handleMaxClick}
                className="text-xs text-primary hover:underline font-medium"
                type="button"
              >
                MAX
              </button>
              <span className="text-muted-foreground font-medium">SOL</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Available: {balance.toFixed(6)} SOL</p>
        </div>
      )}

      {((mode === "wrap" && amount && parseFloat(amount) > 0) ||
        (mode === "unwrap" && balance > 0)) && (
        <div className="bg-muted/30 rounded-lg p-4 mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">You will receive:</span>
            <span className="font-medium text-foreground">
              {(mode === "unwrap" ? balance : estimatedReceive).toFixed(6)}{" "}
              {mode === "wrap" ? "wSOL" : "SOL"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated fee:</span>
            <span className="font-medium text-foreground">~{estimatedFee.toFixed(6)} SOL</span>
          </div>
          {mode === "wrap" && (
            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
              Note: {balance < 0.01 ? "You need" : "Keep"} at least 0.01 SOL for transaction fees
              and rent
            </div>
          )}
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={
          isProcessing || (mode === "wrap" ? !amount || parseFloat(amount) <= 0 : balance <= 0)
        }
      >
        {isProcessing ? (
          <>
            <svg
              className="w-5 h-5 mr-2 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          `${mode === "wrap" ? "Wrap" : "Unwrap All"} ${
            mode === "wrap" ? "SOL → wSOL" : "wSOL → SOL"
          }`
        )}
      </Button>
    </div>
  );
}
