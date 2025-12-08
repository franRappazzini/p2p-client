export interface User {
  walletAddress: string;
  username: string;
  telegramUsername?: string;
  avatar?: string;
  createdAt: number;
  positiveRatings: number;
  negativeRatings: number;
  completedTrades: number;
  reputation: number;
  ratingSum: number;
  ratingCount: number;
}

export interface Rating {
  id: string;
  fromWallet: string;
  toWallet: string;
  adId: string;
  rating: number;
  comment?: string;
  createdAt: number;
}

export interface Ad {
  id: string;
  creatorWallet: string;
  type: "buy" | "sell";
  tokenMint: string;
  tokenAmount: number;
  fiatCurrency: string;
  fiatAmount: number;
  paymentMethod: string;
  pricePerToken: number;
  terms: string;
  timeLimit: number;
  status: "active" | "taken" | "escrow_created" | "paid" | "completed" | "cancelled";
  escrowId?: number;
  takenBy?: string;
  createdAt: number;
  expiresAt: number;
  creationSignature?: string;
  paidSignature?: string;
  releaseSignature?: string;
}

// Legacy type for announcement components (not actively used)
export interface Announcement {
  id: string;
  seller: {
    name: string;
    avatar?: string;
    completedTrades: number;
    rating: number;
  };
  type: "buy" | "sell";
  crypto: string;
  amount: number;
  fiat: string;
  price: number;
  total: number;
  paymentMethods: string[];
  terms?: string;
}
