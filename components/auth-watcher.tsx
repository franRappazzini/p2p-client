"use client";

import { useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export function AuthWatcher() {
  const { primaryWallet } = useDynamicContext();

  useEffect(() => {
    const checkAndCreateUser = async () => {
      if (!primaryWallet?.address) return;

      try {
        // Check if user exists
        const res = await fetch(`/api/users?wallet=${primaryWallet.address}`);

        if (res.status === 404) {
          // Create user if not exists
          console.log("User not found, creating new user...");
          await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              walletAddress: primaryWallet.address,
            }),
          });
        }
      } catch (error) {
        console.error("Error in AuthWatcher:", error);
      }
    };

    checkAndCreateUser();
  }, [primaryWallet?.address]);

  return null;
}
