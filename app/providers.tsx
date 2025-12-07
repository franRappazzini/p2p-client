"use client";

import { AuthWatcher } from "@/components/auth-watcher";
import DynamicProvider from "./dynamic-provider";
import { EscrowContextProvider } from "@/app/contexts/escrow-context";
import { EventsWatcher } from "@/components/events-watcher";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <DynamicProvider>
        <EscrowContextProvider>
          <AuthWatcher />
          <EventsWatcher />
          {children}
          <Toaster />
        </EscrowContextProvider>
      </DynamicProvider>
    </ThemeProvider>
  );
}

export default Providers;
