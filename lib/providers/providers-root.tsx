import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { QueryClientProvider } from './query-client'
import { ThemeProvider } from './theme-provider'
import { Toaster } from './sonner-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

export const RootProviders = ({ children }: { children: React.ReactNode }) => (
  <>
    <NuqsAdapter>
      <QueryClientProvider>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </NuqsAdapter>
    <Toaster />
  </>
)
