import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants'

import { isServer } from '@tanstack/react-query'
import { getRequestConfig, RequestConfig } from 'next-intl/server'

import { defaultLocale } from '@/lib/i18n/i18n-config'
import { messages } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/i18n-config'

export const locales = ['en', 'ar'] as const

export { defaultLocale }

export type Locales = (typeof locales)[number]

export async function getLocale(): Promise<Locales> {
  try {
    if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
      return defaultLocale
    }

    // Client-side: read from document.cookie
    if (!isServer) {
      if (typeof document === 'undefined') {
        return defaultLocale
      }

      const value = `; ${document.cookie}`
      const parts = value.split(`; NEXT_LOCALE=`)

      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift()
        if (cookieValue && locales.includes(cookieValue as Locales)) {
          return cookieValue as Locales
        }
      }

      return defaultLocale
    }

    const { cookies } = await import('next/headers')
    const cookiesStore = await cookies()
    const localeCookie = cookiesStore.get('NEXT_LOCALE')

    if (
      localeCookie?.value &&
      locales.includes(localeCookie.value as Locales)
    ) {
      return localeCookie.value as Locales
    }
  } catch {
    console.warn('Failed to read locale from cookies, using default.')
  }
  return defaultLocale
}

export async function getTimeZone(): Promise<string> {
  const defaultTimezone = 'Africa/Cairo'

  try {
    if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
      return defaultTimezone
    }

    // Client-side: detect from browser and set cookie if needed
    if (!isServer) {
      // Try to read existing cookie
      const cookieValue = getCookie('NEXT_TIMEZONE')
      if (cookieValue) {
        return cookieValue
      }

      // Cookie doesn't exist - detect from browser and set it
      try {
        const timeZone =
          Intl.DateTimeFormat().resolvedOptions().timeZone || defaultTimezone
        setCookie('NEXT_TIMEZONE', timeZone)
        return timeZone
      } catch {
        return defaultTimezone
      }
    }

    // Server-side: read from cookie
    const { cookies } = await import('next/headers')
    const cookiesStore = await cookies()
    const timezoneCookie = cookiesStore.get('NEXT_TIMEZONE')

    return timezoneCookie?.value || defaultTimezone
  } catch {
    return defaultTimezone
  }
}

// Client-side cookie helpers
function getCookie(name: string): null | string {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

function setCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=lax`
}

export default getRequestConfig(async () => {
  const locale = await getLocale()
  const msgs = await messages[locale as Locale]()

  return {
    locale,
    messages: msgs as RequestConfig['messages']
  }
})
