import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { AnchorProvider, BN, Idl, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";

import { P2p } from "@/app/lib/types/p2p";
import idl from "@/lib/idl/p2p.json";
import { isSolanaWallet } from "@dynamic-labs/solana";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useMemo } from "react";

const PROGRAM_ID = new PublicKey(idl.address);

export function useProgram() {
  const { primaryWallet, networkConfigurations } = useDynamicContext();

  const connection = useMemo(() => {
    // Usar variables de entorno para configurar RPC endpoints
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "http://127.0.0.1:8899";
    const wsUrl = process.env.NEXT_PUBLIC_SOLANA_WS_URL || "ws://127.0.0.1:8900";

    return new Connection(rpcUrl, {
      commitment: "confirmed",
      wsEndpoint: wsUrl,
    });
  }, []);

  const provider = useMemo(() => {
    if (!primaryWallet) return null;

    if (!isSolanaWallet(primaryWallet)) {
      throw new Error("This wallet is not a Solana wallet");
    }

    // Create a wallet adapter for Anchor
    const wallet = {
      publicKey: new PublicKey(primaryWallet.address),
      signTransaction: async (tx: any) => {
        const signer = await primaryWallet.getSigner();
        return signer.signTransaction(tx);
      },
      signAllTransactions: async (txs: any[]) => {
        const signer = await primaryWallet.getSigner();
        return signer.signAllTransactions(txs);
      },
    };

    return new AnchorProvider(connection, wallet as any, {
      preflightCommitment: "confirmed",
      commitment: "confirmed",
    });
  }, [primaryWallet, connection]);

  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as Idl, provider) as Program<P2p>;
  }, [provider]);

  const createEscrow = async (amount: number, buyer: string, mint: string) => {
    if (!program || !provider) throw new Error("Program not initialized");

    const amountBn = new BN(amount);
    const buyerPubkey = new PublicKey(buyer);
    const mintPubkey = new PublicKey(mint);

    // PDAs
    const [globalConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from("global_config")],
      PROGRAM_ID
    );

    const globalConfigAccount = await program.account.globalConfig.fetch(globalConfig);
    const escrowCount = globalConfigAccount.escrowCount as BN;

    const [escrow] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), escrowCount.toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );

    const [mintVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint_vault"), mintPubkey.toBuffer()],
      PROGRAM_ID
    );

    const [creatorAta] = PublicKey.findProgramAddressSync(
      [provider.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const [mintVaultAta] = PublicKey.findProgramAddressSync(
      [mintVault.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = await program.methods
      .createEscrow(amountBn)
      .accounts({
        creator: provider.publicKey,
        buyer: buyerPubkey,
        // globalConfig,
        // escrow,
        mint: mintPubkey,
        // mintVault,
        // creatorAta,
        // mintVaultAta,
        // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        // systemProgram: SystemProgram.programId,
      })
      .rpc();

    return { tx, escrowId: escrowCount.toNumber() };
  };

  const markAsPaid = async (escrowId: number) => {
    if (!program || !provider) throw new Error("Program not initialized");

    const escrowIdBn = new BN(escrowId);

    const [escrow] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), escrowIdBn.toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );

    const [globalConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from("global_config")],
      PROGRAM_ID
    );

    // Fetch escrow to get mint
    const escrowAccount = await program.account.escrow.fetch(escrow);
    const mintPubkey = escrowAccount.mint as PublicKey;

    // Derive buyer ATA
    const [buyerAta] = PublicKey.findProgramAddressSync(
      [provider.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    return program.methods
      .markEscrowAsPaid(escrowIdBn)
      .accounts({
        buyer: provider.publicKey,
        globalConfig,
        escrow,
        mint: mintPubkey,
        buyerAta,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  };

  const releaseTokens = async (escrowId: number) => {
    if (!program || !provider) throw new Error("Program not initialized");

    const escrowIdBn = new BN(escrowId);

    const [escrow] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), escrowIdBn.toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );

    const escrowAccount = await program.account.escrow.fetch(escrow);
    const mintPubkey = escrowAccount.mint as PublicKey;
    const buyerPubkey = escrowAccount.buyer as PublicKey;

    const [globalConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from("global_config")],
      PROGRAM_ID
    );

    const [mintVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint_vault"), mintPubkey.toBuffer()],
      PROGRAM_ID
    );

    const [mintVaultAta] = PublicKey.findProgramAddressSync(
      [mintVault.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const [buyerAta] = PublicKey.findProgramAddressSync(
      [buyerPubkey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    return program.methods
      .releaseTokensInEscrow(escrowIdBn)
      .accounts({
        seller: provider.publicKey,
        globalConfig,
        escrow,
        mint: mintPubkey,
        mintVault,
        mintVaultAta,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  };

  return {
    program,
    provider,
    connection,
    createEscrow,
    markAsPaid,
    releaseTokens,
  };
}
