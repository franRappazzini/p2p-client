"use client";

import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

export function SimpleHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/salana.png" alt="Salana P2P Logo" width={50} height={50} />
            <span className="font-bold text-xl text-foreground">Salana P2P</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <DynamicWidget />
          </div>
        </div>
      </div>
    </header>
  );
}
