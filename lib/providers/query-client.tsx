"use client";

import React, { useState } from "react";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => {
    let client: QueryClient;
    client = new QueryClient({
      defaultOptions: {
        mutations: { retry: 0 },
        queries: { retry: 1, staleTime: 60 * 1000 },
      },
      mutationCache: new MutationCache({
        onSuccess: (_data, _vars, _ctx, mutation) => {
          const keys = (
            mutation.meta as { invalidatesQuery?: unknown[][] } | undefined
          )?.invalidatesQuery;
          if (!keys) return;
          for (const key of keys) {
            void client.invalidateQueries({ queryKey: key });
          }
        },
      }),
    });
    return client;
  });

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
}
