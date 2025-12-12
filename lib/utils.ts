import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateTelegramUsername(username: string): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  if (!username || !username.trim()) {
    return { valid: false, sanitized: "", error: "Username cannot be empty" };
  }

  // Remove @ if present at the beginning
  let sanitized = username.trim();
  if (sanitized.startsWith("@")) {
    sanitized = sanitized.slice(1);
  }

  // Check length (5-32 characters)
  if (sanitized.length < 5) {
    return {
      valid: false,
      sanitized,
      error: "Username must be at least 5 characters long",
    };
  }

  if (sanitized.length > 32) {
    return {
      valid: false,
      sanitized,
      error: "Username must be at most 32 characters long",
    };
  }

  // Check format: only letters, numbers, and underscores
  const validFormat = /^[a-zA-Z0-9_]+$/;
  if (!validFormat.test(sanitized)) {
    return {
      valid: false,
      sanitized,
      error: "Username can only contain letters, numbers, and underscores",
    };
  }

  return { valid: true, sanitized };
}

// Platform fee configuration
export const PLATFORM_FEE_BPS = 50; // 0.5% = 50 basis points

export function calculatePlatformFee(amount: number) {
  const fee = (amount * PLATFORM_FEE_BPS) / 10000;
  const amountWithFee = amount + fee;
  const amountAfterFee = amount - fee;
  const percentage = "0.5%";

  return {
    fee,
    amountWithFee,
    amountAfterFee,
    percentage,
  };
}
