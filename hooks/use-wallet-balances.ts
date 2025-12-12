import { useEffect, useState } from "react";

import { MINT_MAP } from "@/lib/constants";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useProgram } from "./use-program";

interface Balances {
  sol: number;
  wsol: number;
  usdc: number;
  usdt: number;
}

export function useWalletBalances() {
  const { primaryWallet } = useDynamicContext();
  const { connection } = useProgram();
  const [balances, setBalances] = useState<Balances>({
    sol: 0,
    wsol: 0,
    usdc: 0,
    usdt: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalances = async () => {
    if (!primaryWallet || !connection) {
      setIsLoading(false);
      return;
    }

    try {
      const userPubkey = new PublicKey(primaryWallet.address);

      // Get SOL balance
      const solBalance = await connection.getBalance(userPubkey);
      const solBalanceInSol = solBalance / 1e9;

      // Get token balances
      const tokenBalances = await Promise.all([
        getTokenBalance("wSOL", userPubkey),
        getTokenBalance("USDC", userPubkey),
        getTokenBalance("USDT", userPubkey),
      ]);

      setBalances({
        sol: solBalanceInSol,
        wsol: tokenBalances[0],
        usdc: tokenBalances[1],
        usdt: tokenBalances[2],
      });
    } catch (error) {
      console.error("Error fetching balances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTokenBalance = async (tokenSymbol: string, userPubkey: PublicKey): Promise<number> => {
    if (!connection) return 0;

    try {
      const mintAddress = MINT_MAP[tokenSymbol];
      if (!mintAddress) return 0;

      const mintPubkey = new PublicKey(mintAddress);
      const ata = getAssociatedTokenAddressSync(mintPubkey, userPubkey);

      const tokenAccount = await connection.getTokenAccountBalance(ata);
      const decimals = tokenSymbol === "wSOL" ? 9 : 6;
      return parseFloat(tokenAccount.value.amount) / Math.pow(10, decimals);
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [primaryWallet?.address, connection]);

  return {
    balances,
    isLoading,
    refetch: fetchBalances,
  };
}
