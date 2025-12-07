"use client";

import React, { createContext, useContext, useState } from "react";

import { Ad } from "@/lib/types";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

interface EscrowContextType {
  ads: Ad[];
  setAds: (ads: Ad[]) => void;
  updateAdOptimistically: (escrowId: number, updates: Partial<Ad>) => void;
  refreshAds: () => Promise<void>;
}

const EscrowContext = createContext<EscrowContextType | undefined>(undefined);

export function EscrowContextProvider({ children }: { children: React.ReactNode }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const { primaryWallet } = useDynamicContext();

  const updateAdOptimistically = async (escrowId: number, updates: Partial<Ad>) => {
    // Intentar actualizar localmente
    const adIndex = ads.findIndex((ad) => ad.escrowId === escrowId);

    if (adIndex !== -1) {
      // Ad encontrado, actualizar optimísticamente
      const updatedAds = [...ads];
      updatedAds[adIndex] = { ...updatedAds[adIndex], ...updates };
      setAds(updatedAds);
    } else {
      // Ad no encontrado, hacer fetch completo
      console.log(`Ad with escrowId ${escrowId} not found locally, fetching all ads`);
      await refreshAds();
    }
  };

  const refreshAds = async () => {
    if (!primaryWallet?.address) {
      console.warn("No wallet connected, skipping ads refresh");
      return;
    }

    try {
      const response = await fetch(`/api/ads?walletAddress=${primaryWallet.address}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ads");
      }
      const data = await response.json();
      setAds(data.ads || []);
    } catch (error) {
      console.error("Error refreshing ads:", error);
    }
  };

  return (
    <EscrowContext.Provider value={{ ads, setAds, updateAdOptimistically, refreshAds }}>
      {children}
    </EscrowContext.Provider>
  );
}

export function useEscrowContext() {
  const context = useContext(EscrowContext);
  if (context === undefined) {
    throw new Error("useEscrowContext must be used within EscrowContextProvider");
  }
  return context;
}
