"use client";

import { Button } from "@/components/ui-custom/button";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { SimpleHeader } from "@/components/simple-header";
import { cn } from "@/lib/utils";
import { useState } from "react";

const steps = [
  {
    number: 1,
    title: "Create or Find an Ad",
    description:
      "Browse existing ads or create your own. Specify the token, amount, fiat currency, payment method, and terms.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Contact via Telegram",
    description:
      "If you found an ad you want to take, first contact the counterparty on Telegram to verify they are online and coordinate where the fiat will be transferred.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Take the Ad",
    description:
      "Once the details are coordinated, take the ad on the platform. This initiates the exchange process and notifies both parties that the transaction is active.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
        />
      </svg>
    ),
  },
  {
    number: 4,
    title: "Deposit the Tokens",
    description:
      "The seller deposits the tokens into the Solana smart contract. The funds are securely locked until the exchange conditions are met.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
  },
  {
    number: 5,
    title: "Send Fiat Off-Chain",
    description:
      "The buyer sends the fiat payment through the agreed method (bank transfer, PayPal, etc.). Both parties communicate to confirm the payment.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
  {
    number: 6,
    title: "Release the Tokens",
    description:
      "Once payment is confirmed, the seller releases the tokens from the smart contract. The funds are automatically transferred to the buyer securely.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: "How does the escrow protect me?",
    answer:
      "The escrow smart contract holds the crypto securely until both parties fulfill their obligations. The seller cannot retrieve the funds once locked, and the buyer only receives them when the seller confirms payment receipt. This eliminates the risk of fraud.",
  },
  {
    question: "What happens if the buyer doesn't pay?",
    answer:
      "If the buyer fails to send fiat payment within the agreed time limit, the escrow automatically returns the crypto to the seller. There are no penalties for timeouts, but repeated failures may affect your reputation.",
  },
  {
    question: "How are disputes resolved?",
    answer:
      "Either party can open a dispute if they believe the other isn't honoring the agreement. Disputes are reviewed by our arbitration team who examine evidence from both sides. The funds are released based on their decision.",
  },
  {
    question: "What tokens are supported?",
    answer:
      "Currently we support SOL, USDC, and USDT on the Solana blockchain. We're continuously working to add more tokens based on community demand.",
  },
  {
    question: "What payment methods can I use?",
    answer:
      "You can use any payment method agreed upon with your trading partner, including bank transfers, PayPal, Zelle, Wise, Venmo, and many others. The fiat payment happens off-chain directly between the trading parties.",
  },
  {
    question: "Are there any fees?",
    answer:
      "We charge a small fee (0.5%) on completed trades. This fee is split between both parties. There are no fees for creating announcements or for trades that don't complete.",
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={onClick} className="w-full py-5 flex items-center justify-between text-left">
        <span className="font-medium text-card-foreground pr-4">{question}</span>
        <svg
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        )}
      >
        <p className="text-muted-foreground">{answer}</p>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <Sidebar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="md:ml-16 container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              How Salana P2P Works
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Secure, trustless cryptocurrency trading powered by Solana smart contracts. Trade with
              confidence knowing your funds are protected.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="md:ml-16 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex gap-6 md:gap-8">
                {/* Step Number & Line */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-linear-to-b from-primary to-border mt-4" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-primary">Step {step.number}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="bg-muted/30 py-16">
        <div className="md:ml-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              Why Choose Salana P2P?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-success/10 text-success mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Trustless Security</h3>
                <p className="text-sm text-muted-foreground">
                  Smart contracts ensure neither party can cheat. No trust required.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Built on Solana for instant transactions with minimal fees.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Fair Disputes</h3>
                <p className="text-sm text-muted-foreground">
                  Impartial arbitration when issues arise. Both sides get heard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="md:ml-16 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="bg-card border border-border rounded-xl px-6">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-16">
        <div className="md:ml-16 container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of traders using secure P2P escrow. Create your first ad today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button variant="primary" size="lg">
                Start Trading
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                Browse Ads
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border md:ml-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Image src="/salana.png" alt="Salana P2P Logo" width={40} height={40} />
              <span className="font-semibold text-foreground">Salana P2P</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Salana P2P. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
