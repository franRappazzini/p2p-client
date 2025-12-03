export interface User {
  walletAddress: string
  username: string
  telegramUsername?: string
  createdAt: number
  positiveRatings: number
  negativeRatings: number
  completedTrades: number
  reputation: number
}

export interface Ad {
  id: string
  creatorWallet: string
  type: "buy" | "sell"
  tokenMint: string
  tokenAmount: number
  fiatCurrency: string
  fiatAmount: number
  paymentMethod: string
  pricePerToken: number
  terms: string
  timeLimit: number
  status: "active" | "taken" | "completed" | "cancelled"
  escrowId?: number
  takenBy?: string
  createdAt: number
  expiresAt: number
}
