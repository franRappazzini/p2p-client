import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  createSyncNativeInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { AnchorProvider, BN, Idl, Program } from "@coral-xyz/anchor";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

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

  const wrapSol = async (amount: number) => {
    if (!provider || !connection) throw new Error("Wallet not connected");

    const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
    const wsolAta = getAssociatedTokenAddressSync(NATIVE_MINT, provider.publicKey);

    // Check if wSOL ATA exists
    const accountInfo = await connection.getAccountInfo(wsolAta);
    const transaction = new Transaction();

    // Create ATA if it doesn't exist
    if (!accountInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          provider.publicKey,
          wsolAta,
          provider.publicKey,
          NATIVE_MINT
        )
      );
    }

    // Transfer SOL to wSOL ATA
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: wsolAta,
        lamports,
      })
    );

    // Sync native to update balance
    transaction.add(createSyncNativeInstruction(wsolAta));

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = provider.publicKey;

    const signer = await provider.wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signer.serialize(), {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    // Poll for confirmation with a shorter timeout
    const maxAttempts = 30;
    const pollInterval = 500; // 500ms

    for (let i = 0; i < maxAttempts; i++) {
      const status = await connection.getSignatureStatus(signature);

      if (status?.value?.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(status.value.err)}`);
      }

      if (
        status?.value?.confirmationStatus === "confirmed" ||
        status?.value?.confirmationStatus === "finalized"
      ) {
        return signature;
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error("Transaction confirmation timeout");
  };

  const unwrapSol = async () => {
    if (!provider || !connection) throw new Error("Wallet not connected");

    const wsolAta = getAssociatedTokenAddressSync(NATIVE_MINT, provider.publicKey);

    // Check if account exists
    const accountInfo = await connection.getAccountInfo(wsolAta);
    if (!accountInfo) throw new Error("No wSOL account found");

    const transaction = new Transaction();

    // Close the account to unwrap all wSOL
    transaction.add(createCloseAccountInstruction(wsolAta, provider.publicKey, provider.publicKey));

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = provider.publicKey;

    const signer = await provider.wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signer.serialize(), {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    // Poll for confirmation with a shorter timeout
    const maxAttempts = 30;
    const pollInterval = 500; // 500ms

    for (let i = 0; i < maxAttempts; i++) {
      const status = await connection.getSignatureStatus(signature);

      if (status?.value?.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(status.value.err)}`);
      }

      if (
        status?.value?.confirmationStatus === "confirmed" ||
        status?.value?.confirmationStatus === "finalized"
      ) {
        return signature;
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error("Transaction confirmation timeout");
  };

  return {
    program,
    provider,
    connection,
    createEscrow,
    markAsPaid,
    releaseTokens,
    wrapSol,
    unwrapSol,
  };
}
