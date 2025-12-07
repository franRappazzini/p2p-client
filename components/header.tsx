"use client";

import { Button } from "./ui-custom/button";
import Link from "next/link";
import { NotificationsPopover } from "./notifications-popover";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span className="font-bold text-xl text-foreground">SolEscrow</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Profile
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <NotificationsPopover />
            <ThemeToggle />
            <Link href="/create">
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Announcement
              </Button>
            </Link>
            <Button variant="primary" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              Connect Wallet
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <NotificationsPopover />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-80 pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-2 pt-4">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Profile
            </Link>
            <Link
              href="/how-it-works"
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              How It Works
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/create">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Create Announcement
                </Button>
              </Link>
              <Button variant="primary" size="sm" className="w-full">
                Connect Wallet
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
