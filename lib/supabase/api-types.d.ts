export declare global {
  type API<T = undefined> = {
    data?: T
    message?: string
    statusCode: number
    success: boolean
  }

  type Pagination = {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }

  type PaginatedResponse<T = undefined> = {
    data?: T
    pagination: Pagination
  }
}
