/**
 * Global type declarations available throughout the project
 */

// Pagination metadata returned by paginated API endpoints
declare interface Pagination {
  count?: number
  current_page: number
  from?: number
  last_page: number
  per_page: number
  to?: number
  total: number
}

// Paginated response wrapper
declare interface PaginatedResponse<T> {
  data: T
  pagination: Pagination
}

// Standard API response wrapper
declare interface API<T = unknown> {
  data: T
  message?: string
  statusCode?: number
  success: boolean
}
