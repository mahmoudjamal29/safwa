// template/lib/providers/query-client.tsx
'use client'

import { useState } from 'react'

import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query'

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      mutations: { retry: 0 },
      queries: { retry: 1, staleTime: 60 * 1000 }
    }
  }))

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  )
}
