"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { calculatePlatformFee } from "@/lib/utils";

interface FeeInfoProps {
  amount: number;
  token: string;
  role: "seller" | "buyer";
  className?: string;
}

export function FeeInfo({ amount, token, role, className = "" }: FeeInfoProps) {
  const { fee, amountWithFee, amountAfterFee, percentage } = calculatePlatformFee(amount);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center justify-center w-4 h-4 ml-1 rounded-full bg-muted hover:bg-muted/80 transition-colors ${className}`}
          aria-label="Fee information"
        >
          <svg
            className="w-3 h-3 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Fee Breakdown</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Ad amount:</span>
              <span className="font-medium text-foreground">
                {amount.toFixed(2)} {token}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Platform fee ({percentage}):</span>
              <span className="font-medium text-foreground">
                {role === "seller" ? "+" : "-"}
                {fee.toFixed(4)} {token}
              </span>
            </div>
            <div className="border-t border-border pt-1 mt-1 flex justify-between font-semibold">
              <span>{role === "seller" ? "Total to deposit:" : "Total to receive:"}</span>
              <span className="text-foreground">
                {role === "seller" ? amountWithFee.toFixed(2) : amountAfterFee.toFixed(2)} {token}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
