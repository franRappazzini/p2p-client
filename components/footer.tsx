"use client";

import Image from "next/image";
import { SolanaLogotypeIcon } from "./icons";
import { useTheme } from "./theme-provider";

export default function Footer() {
  const { theme } = useTheme();

  return (
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
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Running on</span>
            <SolanaLogotypeIcon fill={theme === "light" ? "black" : "white"} />
          </div>
          {/* <div className="flex gap-4">
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
                </div> */}
        </div>
      </div>
    </footer>
  );
}
