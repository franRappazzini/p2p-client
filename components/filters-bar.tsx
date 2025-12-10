"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface FiltersBarProps {
  className?: string;
  filters: {
    type: string;
    token: string;
    fiat: string;
  };
  onFiltersChange: (filters: { type: string; token: string; fiat: string }) => void;
}

export function FiltersBar({ className, filters, onFiltersChange }: FiltersBarProps) {
  const [tokenOpen, setTokenOpen] = useState(false);
  const [fiatOpen, setFiatOpen] = useState(false);

  const tokenOptions = [
    { value: "all", label: "All Tokens" },
    { value: "wSOL", label: "wSOL" },
    { value: "USDC", label: "USDC" },
    { value: "USDT", label: "USDT" },
  ];

  const fiatOptions = [
    { value: "all", label: "All Fiats" },
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "ARS", label: "ARS" },
  ];

  const setType = (type: string) => {
    onFiltersChange({ ...filters, type });
  };

  const setToken = (token: string) => {
    onFiltersChange({ ...filters, token });
    setTokenOpen(false);
  };

  const setFiat = (fiat: string) => {
    onFiltersChange({ ...filters, fiat });
    setFiatOpen(false);
  };

  const clearFilters = () => {
    onFiltersChange({ type: "buy", token: "all", fiat: "all" });
  };

  return (
    <div className={cn("bg-card border border-border rounded-xl p-4 shadow-sm", className)}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Type Toggle - Buy/Sell only */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setType("buy")}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
                filters.type === "buy"
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              Buy
            </button>
            <button
              onClick={() => setType("sell")}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
                filters.type === "sell"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              Sell
            </button>
          </div>
        </div>

        {/* Token Select Dropdown */}
        <div className="flex flex-col gap-2 flex-1 md:max-w-xs relative">
          <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Token
          </label>
          <button
            onClick={() => {
              setTokenOpen(!tokenOpen);
              setFiatOpen(false);
            }}
            className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-all flex items-center justify-between"
          >
            <span>{tokenOptions.find((opt) => opt.value === filters.token)?.label}</span>
            <svg
              className={cn("w-4 h-4 transition-transform", tokenOpen && "rotate-180")}
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
          </button>
          {tokenOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
              {tokenOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setToken(opt.value)}
                  className={cn(
                    "w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors",
                    filters.token === opt.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fiat Select Dropdown */}
        <div className="flex flex-col gap-2 flex-1 md:max-w-xs relative">
          <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Fiat
          </label>
          <button
            onClick={() => {
              setFiatOpen(!fiatOpen);
              setTokenOpen(false);
            }}
            className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-all flex items-center justify-between"
          >
            <span>{fiatOptions.find((opt) => opt.value === filters.fiat)?.label}</span>
            <svg
              className={cn("w-4 h-4 transition-transform", fiatOpen && "rotate-180")}
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
          </button>
          {fiatOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
              {fiatOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFiat(opt.value)}
                  className={cn(
                    "w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors",
                    filters.fiat === opt.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={clearFilters}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors md:ml-auto"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
