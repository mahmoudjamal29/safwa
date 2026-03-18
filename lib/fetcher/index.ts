type FetcherOptions = {
  auth?: boolean
  method?: string
  params?: Record<string, string>
  responseType?: 'json' | 'blob' | 'text'
}

export async function fetcher(endpoint: string, options: FetcherOptions = {}): Promise<unknown> {
  const { auth, method = 'GET', params, responseType = 'json' } = options

  const url = new URL(endpoint, typeof window !== 'undefined' ? window.location.origin : undefined)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  const headers: HeadersInit = {}

  if (responseType === 'blob') {
    headers['Accept'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }

  if (auth) {
    // Auth headers are expected to be set via cookies or middleware
  }

  const response = await fetch(url.toString(), {
    headers,
    method,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  if (responseType === 'blob') {
    return response.blob()
  }

  if (responseType === 'text') {
    return response.text()
  }

  return response.json()
}
