import { Ad, User } from "./types";

// In-memory storage
// Note: This data will be lost when the server restarts
const ads: Ad[] = [];
const users: User[] = [];

export const db = {
  ads: {
    getAll: () => ads,
    getById: (id: string) => ads.find((ad) => ad.id === id),
    create: (ad: Ad) => {
      ads.push(ad);
      return ad;
    },
    update: (id: string, updates: Partial<Ad>) => {
      const index = ads.findIndex((ad) => ad.id === id);
      if (index !== -1) {
        ads[index] = { ...ads[index], ...updates };
        return ads[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = ads.findIndex((ad) => ad.id === id);
      if (index !== -1) {
        ads.splice(index, 1);
        return true;
      }
      return false;
    },
  },
  users: {
    getAll: () => users,
    getByWallet: (walletAddress: string) => users.find((u) => u.walletAddress === walletAddress),
    create: (user: User) => {
      const existing = users.find((u) => u.walletAddress === user.walletAddress);
      if (existing) {
        return existing;
      }
      users.push(user);
      return user;
    },
    update: (walletAddress: string, updates: Partial<User>) => {
      const index = users.findIndex((u) => u.walletAddress === walletAddress);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        return users[index];
      }
      return null;
    },
  },
};
