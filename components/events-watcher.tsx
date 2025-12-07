"use client";

import { PublicKey } from "@solana/web3.js";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect } from "react";
import { useProgram } from "@/hooks/use-program";
import { useToast } from "@/hooks/use-toast";

export function EventsWatcher() {
  const { program } = useProgram();
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();

  useEffect(() => {
    if (!program || !primaryWallet) return;

    let escrowCreatedListener: number;
    let markedAsPaidListener: number;
    let tokensReleasedListener: number;

    const userPublicKey = new PublicKey(primaryWallet.address);

    // EscrowCreated: Notify Buyer
    escrowCreatedListener = program.addEventListener("escrowCreated", (event: any, slot) => {
      try {
        const buyer = event.buyer as PublicKey;
        if (buyer.equals(userPublicKey)) {
          toast({
            title: "New Trade Offer",
            description: `You have a new trade offer for ${event.amount.toString()} tokens.`,
          });
        }
      } catch (e) {
        console.error("Error handling escrowCreated event", e);
      }
    });

    // MarkEscrowAsPaid: Notify Seller
    markedAsPaidListener = program.addEventListener("markEscrowAsPaid", (event: any, slot) => {
      try {
        const seller = event.seller as PublicKey;
        if (seller.equals(userPublicKey)) {
          toast({
            title: "Payment Marked",
            description: `Buyer has marked escrow #${event.id.toString()} as paid.`,
          });
        }
      } catch (e) {
        console.error("Error handling markEscrowAsPaid event", e);
      }
    });

    // TokensReleased: Notify Buyer
    tokensReleasedListener = program.addEventListener("tokensReleased", (event: any, slot) => {
      try {
        const buyer = event.buyer as PublicKey;
        if (buyer.equals(userPublicKey)) {
          toast({
            title: "Tokens Released",
            description: `Seller has released ${event.amount.toString()} tokens from escrow #${event.id.toString()}.`,
          });
        }
      } catch (e) {
        console.error("Error handling tokensReleased event", e);
      }
    });

    return () => {
      if (escrowCreatedListener !== undefined) program.removeEventListener(escrowCreatedListener);
      if (markedAsPaidListener !== undefined) program.removeEventListener(markedAsPaidListener);
      if (tokensReleasedListener !== undefined) program.removeEventListener(tokensReleasedListener);
    };
  }, [program, primaryWallet, toast]);

  return null;
}
