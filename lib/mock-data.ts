export interface User {
  id: string;
  username: string;
  wallet: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  completedTrades: number;
  successRate: number;
  memberSince: string;
}

export interface Announcement {
  id: string;
  type: "BUY" | "SELL";
  token: "SOL" | "USDC" | "USDT";
  tokenAmount: number;
  fiat: "USD" | "EUR" | "ARS";
  fiatAmount: number;
  pricePerToken: number;
  paymentMethod: string;
  timeLeft: string;
  timeLimit: string;
  creator: User;
  createdAt: string;
  expiresAt: string;
  terms: string;
  status: "Active" | "Completed" | "Pending" | "Disputed";
}

export interface Review {
  id: string;
  reviewer: User;
  rating: number;
  text: string;
  date: string;
}

export const mockUsers: User[] = [];

export const mockAnnouncements: Announcement[] = [];

export const mockReviews: Review[] = [];

export const mockDashboardStats = {
  activeEscrows: 0,
  pendingActions: 0,
  completedThisMonth: 0,
  totalVolume: 0,
};

export const mockUserEscrows = [];

export const currentUser: User = {
  id: "current",
  username: "john_doe",
  wallet: "4xKm...8Rt2",
  avatar: "/male-avatar-professional.jpg",
  rating: 4.8,
  reviewCount: 0,
  completedTrades: 0,
  successRate: 0,
  memberSince: "Jan 2024",
};
