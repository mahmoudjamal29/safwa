import { cache } from 'react'

import {
  defaultShouldDehydrateQuery,
  isServer,
  MutationCache,
  type QueryKey,
  Query,
  QueryClient
} from '@tanstack/react-query'
import { toast } from 'sonner'

type CustomMutationMeta = {
  errorMessage?: string
  invalidatesQuery?: QueryKey[]
  successMessage?: string
  toastOnError?: boolean
  toastOnSuccess?: boolean
}

const getMeta = (meta: unknown): CustomMutationMeta =>
  (meta ?? {}) as CustomMutationMeta

const makeQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: {
        // Include pending queries in dehydration for streaming SSR
        shouldDehydrateQuery: (query: Query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
        // Next.js automatically redacts errors, so we don't need custom redaction
        shouldRedactErrors: () => false
      },
      mutations: {
        meta: {
          toastOnError: true,
          toastOnSuccess: true
        } as CustomMutationMeta
      },
      queries: {
        gcTime: 5 * 60 * 1000, // 5 minutes - unused data stays in cache for 5 minutes
        refetchOnMount: true, // Refetch if data is stale (staleTime controls freshness)
        refetchOnReconnect: true, // Refetch on reconnect if data is stale
        refetchOnWindowFocus: false, // Don't refetch on window focus to reduce unnecessary requests
        staleTime: 60 * 1000 // 1 minute - data is considered fresh for 1 minute, prevents refetch during this time
      }
    },
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (isServer) return console.warn('Error in mutation', error)
        const meta = getMeta(mutation.meta)
        if (meta.toastOnError === false) return

        if (meta.errorMessage) {
          toast.error(meta.errorMessage)
        } else {
          toast.error(error.message || 'حدث خطأ')
        }
      },

      onSettled: async (_data, _error, _variables, _context, mutation) => {
        const meta = getMeta(mutation.meta)
        if (!meta.invalidatesQuery) return

        // Check for special 'all' key to invalidate everything
        if (
          meta.invalidatesQuery.some(
            (queryKey) => Array.isArray(queryKey) && queryKey[0] === 'all'
          )
        ) {
          await queryClient.invalidateQueries()
          return
        }

        // Invalidate each query key separately
        await Promise.all(
          meta.invalidatesQuery.map((queryKey) =>
            queryClient.invalidateQueries({
              exact: false,
              queryKey
            })
          )
        )
      },
      onSuccess: (data, _variables, _context, mutation) => {
        if (isServer) return
        const meta = getMeta(mutation.meta)
        if (meta.toastOnSuccess === false) return

        if (meta.successMessage) {
          toast.success(meta.successMessage)
        } else if (
          data &&
          typeof data === 'object' &&
          'message' in data &&
          typeof (data as Record<string, unknown>).message === 'string'
        ) {
          toast.success((data as Record<string, string>).message)
        }
      }
    })
  })
  return queryClient
}

let browserQueryClient: QueryClient | undefined = undefined

// Cache the QueryClient per request on the server
// React's cache() ensures the same instance is returned within a single server request
// This allows generateMetadata and page component to share the same QueryClient instance
// Cache is automatically invalidated per server request, preventing cross-request state leakage
const getServerQueryClient = cache(() => makeQueryClient())

export function getQueryClient() {
  if (isServer) {
    // Server: return cached QueryClient instance (same instance per request)
    return getServerQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
