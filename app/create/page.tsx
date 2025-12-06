"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui-custom/button";
import { ProgressStepper } from "@/components/ui-custom/progress-stepper";
import type React from "react";
import { Sidebar } from "@/components/sidebar";
import { SimpleHeader } from "@/components/simple-header";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";

type TradeType = "BUY" | "SELL";
type Token = "SOL" | "USDC" | "USDT";
type Fiat = "USD" | "EUR" | "ARS";

interface FormData {
  type: TradeType;
  token: Token;
  tokenAmount: string;
  fiat: Fiat;
  pricePerUnit: string;
  paymentMethod: string;
  terms: string;
}

const tokenIcons: Record<Token, React.ReactNode> = {
  SOL: (
    <svg className="w-5 h-5" viewBox="0 0 397.7 311.7" fill="currentColor">
      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 237.9z" />
      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7z" />
      <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7z" />
    </svg>
  ),
  USDC: (
    <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
      <circle cx="16" cy="16" r="16" fill="#2775CA" />
      <path
        fill="#fff"
        d="M20.5 18.5c0-2-1.2-2.7-3.6-3-.7-.1-1.4-.2-1.9-.5-.4-.2-.6-.5-.6-1s.2-.8.5-1c.4-.3.8-.4 1.4-.4.9 0 1.5.3 1.7.9.1.2.2.3.4.3h.9c.3 0 .5-.2.4-.4-.2-1-1-1.8-2.2-2v-1.2c0-.2-.2-.4-.5-.4h-.7c-.3 0-.5.2-.5.4v1.2c1.5-.2 2.4 1.2 2.4 2.5 0 1.9 1.2 2.6 3.5 2.9.8.1 1.4.3 1.9.5.4.3.6.6.6 1.1 0 .9-.7 1.5-1.8 1.5-1.2 0-1.8-.5-2-1.1-.1-.2-.2-.3-.4-.3h-.9c-.3 0-.5.2-.4.5.3 1.1 1.1 1.9 2.7 2.2v1.2c0 .2.2.4.5.4h.7c.3 0 .5-.2.5-.4v-1.2c1.5-.3 2.5-1.3 2.5-2.7z"
      />
    </svg>
  ),
  USDT: (
    <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path
        fill="#fff"
        d="M17.9 17.9v-.1c-.1 0-.6 0-1.9 0s-1.7 0-1.9.1c-1.3.1-2.3.4-2.3.7 0 .4 1 .6 2.3.7.2 0 .6.1 1.9.1s1.7 0 1.9-.1c1.3-.1 2.3-.4 2.3-.7 0-.4-1-.6-2.5-.7-.2 0-.6.1-1 .1-.4 0-.6 0-.9-.1v.3c-.4 0-.8 0-1.2 0-.3 0-.6 0-.8.1v-.3c-.2 0-.5.1-.9.1-.4 0-.8 0-1-.1-1.5-.1-2.5-.5-2.5-.9 0-.4 1.1-.7 2.6-.9.4 0 .7-.1.9-.1v.1c.2 0 .5 0 .8 0 .5 0 .9 0 1.2 0zm-1.1-6.3h3.8v2.5h-2.3v3.8h-3v-3.8h-2.3v-2.5h3.8z"
      />
    </svg>
  ),
};

export default function CreateAdPage() {
  const router = useRouter();
  const { primaryWallet } = useDynamicContext();
  const { showToast, ToastComponent } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    if (primaryWallet?.address) {
      fetch(`/api/users?wallet=${primaryWallet.address}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setUserProfile(data);
        })
        .catch(console.error);
    }
  }, [primaryWallet?.address]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    type: "SELL",
    token: "USDC",
    tokenAmount: "",
    fiat: "USD",
    pricePerUnit: "",
    paymentMethod: "",
    terms: "",
  });

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateTotalFiat = () => {
    const tokenAmt = Number.parseFloat(formData.tokenAmount) || 0;
    const pricePerUnit = Number.parseFloat(formData.pricePerUnit) || 0;
    if (tokenAmt > 0 && pricePerUnit > 0) {
      return (tokenAmt * pricePerUnit).toFixed(2);
    }
    return "0.00";
  };

  const handlePublish = async () => {
    if (isSubmitting) return;

    if (!formData.tokenAmount || !formData.pricePerUnit || !formData.paymentMethod) {
      showToast({ message: "Please fill in all required fields", type: "error" });
      return;
    }

    if (!primaryWallet) {
      showToast({ message: "Please connect your wallet first", type: "error" });
      return;
    }

    if (!userProfile?.telegramUsername) {
      showToast({
        message: "Please configure your Telegram username in your profile first",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to backend
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type.toLowerCase(),
          tokenMint: formData.token,
          tokenAmount: Number(formData.tokenAmount),
          pricePerToken: Number(formData.pricePerUnit),
          fiatCurrency: formData.fiat,
          fiatAmount: Number(formData.tokenAmount) * Number(formData.pricePerUnit),
          creatorWallet: primaryWallet.address,
          paymentMethod: formData.paymentMethod,
          terms: formData.terms,
          timeLimit: 30 * 60, // 30 minutes in seconds
        }),
      });

      if (!response.ok) throw new Error("Failed to create ad");

      showToast({ message: "Ad published successfully!", type: "success" });

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : "Failed to publish ad",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  if (userProfile && !userProfile.telegramUsername) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <Sidebar />
        <main className="md:ml-16 container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">
              Telegram Username Required
            </h2>
            <p className="text-muted-foreground mb-6">
              To create an ad, you must set a Telegram username in your profile. This allows other
              users to contact you.
            </p>
            <Button onClick={() => router.push("/profile")}>Go to Profile</Button>
          </div>
        </main>
      </div>
    );
  }

  const stepLabels = ["Basic Info", "Details", "Review"];

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <Sidebar />
      {ToastComponent}

      <main className="md:ml-16 container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <ProgressStepper currentStep={step} totalSteps={3} labels={stepLabels} />
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {step === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-card-foreground mb-6">Basic Information</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-card-foreground mb-3">
                  What do you want to do?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["BUY", "SELL"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => updateField("type", type)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-center font-semibold transition-all",
                        formData.type === type
                          ? type === "BUY"
                            ? "border-success bg-success/10 text-success"
                            : "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-muted-foreground text-muted-foreground"
                      )}
                    >
                      <span className="text-2xl mb-1 block">{type === "BUY" ? "↓" : "↑"}</span>
                      {type} Crypto
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-card-foreground mb-2">Token</label>
                <div className="relative">
                  <select
                    value={formData.token}
                    onChange={(e) => updateField("token", e.target.value as Token)}
                    className="w-full px-4 py-3 pr-10 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                  >
                    <option value="SOL">SOL - Solana</option>
                    <option value="USDC">USDC - USD Coin</option>
                    <option value="USDT">USDT - Tether</option>
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                    {tokenIcons[formData.token]}
                  </div>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Token Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.tokenAmount}
                    onChange={(e) => updateField("tokenAmount", e.target.value)}
                    className="w-full px-4 py-3 pr-20 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    {formData.token}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Fiat Currency
                </label>
                <div className="relative">
                  <select
                    value={formData.fiat}
                    onChange={(e) => updateField("fiat", e.target.value as Fiat)}
                    className="w-full px-4 py-3 pr-10 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="ARS">ARS - Argentine Peso</option>
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Price Per {formData.token} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.pricePerUnit}
                    onChange={(e) => updateField("pricePerUnit", e.target.value)}
                    className="w-full px-4 py-3 pr-20 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    {formData.fiat}
                  </span>
                </div>
              </div>

              {formData.tokenAmount && formData.pricePerUnit && (
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Total Fiat Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    {calculateTotalFiat()} {formData.fiat}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.tokenAmount} {formData.token} × ${formData.pricePerUnit}
                  </p>
                </div>
              )}

              <Button variant="primary" size="lg" className="w-full" onClick={() => setStep(2)}>
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-card-foreground mb-6">Trade Details</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Bank Transfer, PayPal, Zelle..."
                  value={formData.paymentMethod}
                  onChange={(e) => updateField("paymentMethod", e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  list="payment-suggestions"
                />
                <datalist id="payment-suggestions">
                  <option value="Bank Transfer" />
                  <option value="PayPal" />
                  <option value="Zelle" />
                  <option value="Wise" />
                  <option value="Venmo" />
                  <option value="SEPA Transfer" />
                  <option value="Mercado Pago" />
                </datalist>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Time Limit
                </label>
                <div className="bg-muted/50 border border-border rounded-lg px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Fixed at <span className="font-semibold text-foreground">30 minutes</span>{" "}
                    (enforced by smart contract)
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  placeholder="Enter your trade terms, requirements, and instructions..."
                  value={formData.terms}
                  onChange={(e) => updateField("terms", e.target.value.slice(0, 500))}
                  rows={5}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {formData.terms.length}/500 characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 bg-transparent"
                  onClick={() => setStep(1)}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </Button>
                <Button variant="primary" size="lg" className="flex-1" onClick={() => setStep(3)}>
                  Next
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-card-foreground mb-6">Review Your Ad</h2>

              <div className="bg-muted/30 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-md text-sm font-semibold",
                      formData.type === "BUY"
                        ? "bg-success text-success-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {formData.type}
                  </span>
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="mb-4">
                  <p className="text-2xl font-bold text-card-foreground">
                    {formData.tokenAmount || "0"} {formData.token}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    → {calculateTotalFiat()} {formData.fiat}
                  </p>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mb-4">
                  <p className="text-primary font-semibold">
                    Price: ${formData.pricePerUnit || "0.00"} per {formData.token}
                  </p>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="text-card-foreground font-medium">
                      {formData.paymentMethod || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Limit</span>
                    <span className="text-card-foreground font-medium">30 minutes</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <button
                      onClick={() => setStep(2)}
                      className="text-sm text-primary hover:underline"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>
              </div>

              {formData.terms && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-card-foreground">Terms & Conditions</h4>
                    <button
                      onClick={() => setStep(2)}
                      className="text-sm text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                    {formData.terms}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handlePublish}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Publish Ad
                    </>
                  )}
                </Button>
                <button
                  onClick={() => router.push("/")}
                  className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
