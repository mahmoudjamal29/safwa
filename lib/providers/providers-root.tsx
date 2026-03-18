import { NuqsAdapter } from "nuqs/adapters/next/app";

import { TooltipProvider } from "@/components/ui/tooltip";

import { SpeedInsights } from "@vercel/speed-insights/next";

import { QueryClientProvider } from "./query-client";
import { Toaster } from "./sonner-provider";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

export const RootProviders = ({ children }: { children: React.ReactNode }) => (
  <>
    <AuthProvider>
      <NuqsAdapter>
        <QueryClientProvider>
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </NuqsAdapter>
      <Toaster />
    </AuthProvider>
    <SpeedInsights />
  </>
);
