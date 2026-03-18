import { queryOptions, type UseQueryOptions } from '@tanstack/react-query'
import { type AxiosError } from 'axios'

/**
 * Creates a static/placeholder data query that can be used with AutocompleteInfinite.
 * Useful for hardcoded options that don't come from an API.
 *
 * @example
 * ```tsx
 * const SPACE_TYPES = [
 *   { id: 1, name: 'Office' },
 *   { id: 2, name: 'Meeting Room' }
 * ]
 *
 * const spaceTypesQuery = createStaticQuery(SPACE_TYPES, 'space-types')
 *
 * <field.AutocompleteInfinite<SpaceType>
 *   queryOptions={spaceTypesQuery}
 *   labelKey="name"
 *   valueKey="id"
 * />
 * ```
 */
export function createStaticQuery<T extends object>(
  data: T[],
  queryKey: string
) {
  return queryOptions<
    API<PaginatedResponse<T[]>>,
    AxiosError<API>,
    PaginatedResponse<T[]>
  >({
    queryFn: async () => ({
      data: {
        data,
        pagination: {
          current_page: 1,
          from: data.length > 0 ? 1 : 0,
          last_page: 1,
          per_page: data.length,
          to: data.length,
          total: data.length
        }
      },
      statusCode: 200,
      success: true
    }),
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['static', queryKey, data.length] as const,
    select: (response) => response.data!,
    staleTime: Infinity // Static data never goes stale
  })
}

/**
 * Converts a non-paginated query (returns API<T[]>) to a paginated format
 * that can be used with AutocompleteInfinite component.
 *
 * @example
 * ```tsx
 * const countriesQuery = toPaginatedQuery(getAllCountriesQuery)
 *
 * <field.AutocompleteInfinite<Country>
 *   queryOptions={countriesQuery}
 *   labelKey="name"
 *   valueKey="id"
 * />
 * ```
 */
export function toPaginatedQuery<T extends object>(
  query: UseQueryOptions<API<T[]>, AxiosError<API>, T[]>
) {
  return queryOptions<API<T[]>, AxiosError<API>, PaginatedResponse<T[]>>({
    ...query,
    select: (response) => {
      const data = response.data ?? []
      return {
        data,
        pagination: {
          current_page: 1,
          from: data.length > 0 ? 1 : 0,
          last_page: 1,
          per_page: data.length,
          to: data.length,
          total: data.length
        }
      }
    }
  })
}
