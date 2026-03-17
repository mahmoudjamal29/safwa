import type { QueryKey } from '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: MutationMeta
  }
}

declare interface MutationMeta {
  errorMessage?: string
  invalidatesQuery?: QueryKey[]
  successMessage?: string
  toastOnError?: boolean
  toastOnSuccess?: boolean
}
