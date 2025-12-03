import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

import { P2p } from "@/lib/types/p2p";
import idl from "@/lib/idl/p2p.json";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useMemo } from "react";

export const useProgram = () => {
  const { primaryWallet } = useDynamicContext();

  const program = useMemo(() => {
    if (!primaryWallet) return null;

    const connection = new Connection("http://127.0.0.1:8899", "confirmed");

    // @ts-ignore - Dynamic wallet connector matches Anchor wallet interface sufficiently
    const provider = new AnchorProvider(connection, primaryWallet.connector, {
      preflightCommitment: "confirmed",
    });

    setProvider(provider);

    return new Program(idl as any, provider) as Program<P2p>;
  }, [primaryWallet]);

  return program;
};
