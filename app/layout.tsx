import "./globals.css";

import type { Metadata } from "next";
import Providers from "./providers";
import type React from "react";

export const metadata: Metadata = {
  title: "SolEscrow - P2P Crypto Escrow",
  description: "Secure peer-to-peer cryptocurrency escrow on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
