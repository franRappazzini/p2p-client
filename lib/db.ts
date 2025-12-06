import { Ad, Rating, User } from "./types";

// Use a global variable to persist data across hot reloads in development
// In production (Vercel), this will reset when the lambda container is recycled (cold start)
// For a hackathon demo, this is acceptable as long as the container stays warm.
// For production, use Vercel KV, Postgres, or Supabase.

const globalForDb = global as unknown as {
  db: {
    ads: Ad[];
    users: User[];
    ratings: Rating[];
  };
};

if (!globalForDb.db) {
  globalForDb.db = {
    ads: [],
    users: [],
    ratings: [],
  };
}

const data = globalForDb.db;

export const db = {
  ads: {
    getAll: () => data.ads,
    getById: (id: string) => data.ads.find((ad) => ad.id === id),
    create: (ad: Ad) => {
      data.ads.push(ad);
      return ad;
    },
    update: (id: string, updates: Partial<Ad>) => {
      const index = data.ads.findIndex((ad) => ad.id === id);
      if (index !== -1) {
        data.ads[index] = { ...data.ads[index], ...updates };
        return data.ads[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = data.ads.findIndex((ad) => ad.id === id);
      if (index !== -1) {
        data.ads.splice(index, 1);
        return true;
      }
      return false;
    },
  },
  users: {
    getAll: () => data.users,
    getByWallet: (walletAddress: string) =>
      data.users.find((u) => u.walletAddress === walletAddress),
    create: (user: User) => {
      const existing = data.users.find((u) => u.walletAddress === user.walletAddress);
      if (existing) {
        return existing;
      }
      data.users.push(user);
      return user;
    },
    update: (walletAddress: string, updates: Partial<User>) => {
      const index = data.users.findIndex((u) => u.walletAddress === walletAddress);
      if (index !== -1) {
        data.users[index] = { ...data.users[index], ...updates };
        return data.users[index];
      }
      return null;
    },
  },
  ratings: {
    create: (rating: Rating) => {
      data.ratings.push(rating);
      return rating;
    },
    getByUser: (walletAddress: string) => data.ratings.filter((r) => r.toWallet === walletAddress),
    hasRated: (fromWallet: string, adId: string) =>
      data.ratings.some((r) => r.fromWallet === fromWallet && r.adId === adId),
  },
};
