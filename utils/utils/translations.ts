/**
 * Translation utility functions for accessing entity translations
 */

type Translation = {
  [key: string]: any
  locale: 'ar' | 'en'
}

type TranslationsArray = null | Translation[] | undefined

/**
 * Get a translated field value from translations array
 * @param translations - Array of translations with locale field
 * @param locale - The locale to find ('ar' or 'en')
 * @param field - The field name to extract from the translation
 * @param fallback - Optional fallback value if translation not found
 * @returns The translated field value or fallback
 */
export function getTranslatedField<T extends Translation, K extends keyof T>(
  translations: null | T[] | undefined,
  locale: 'ar' | 'en',
  field: K,
  fallback?: T[K]
): T[K] | undefined {
  const translation = getTranslation(translations, locale)
  return translation?.[field] ?? fallback
}

/**
 * Get a translated name based on RTL/LTR context
 * @param translations - Array of translations with locale field and name property
 * @param isRTL - Whether the current context is RTL (right-to-left)
 * @param fallback - Optional fallback value if translation not found
 * @returns The translated name or fallback
 */
export function getTranslatedName(
  translations: TranslationsArray,
  isRTL: boolean,
  fallback?: string
): string | undefined {
  const locale = isRTL ? 'ar' : 'en'
  const translation = translations?.find((t) => t.locale === locale)
  return translation?.name ?? fallback
}

/**
 * Get a translation by locale from a translations array
 * @param translations - Array of translations with locale field
 * @param locale - The locale to find ('ar' or 'en')
 * @returns The translation object for the specified locale, or undefined if not found
 */
export function getTranslation<T extends Translation>(
  translations: null | T[] | undefined,
  locale: 'ar' | 'en'
): T | undefined {
  return translations?.find((t) => t.locale === locale)
}
